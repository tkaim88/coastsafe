"""
Business CRUD routes.

Follows the exact same shape as safety_report_routes.py deliberately —
same validation pattern, same use of `owns_resource`, same pagination
helper. Two resources implementing the same conventions is what makes this
DRY rather than "two similar-looking but subtly different copies."

Public listing/detail routes only ever return approved businesses — a
pending or rejected listing is only visible to its owner (via /mine) or
an admin (via /pending).
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Business, Location, FACILITY_TYPES, AD_TIERS, STATUSES
from app.utils.decorators import owns_resource, admin_required
from app.utils.pagination import paginate_query

businesses_bp = Blueprint("businesses", __name__, url_prefix="/api/businesses")


def _validate_business_payload(data, partial=False):
    errors = {}

    if not partial or "name" in data:
        if not (data.get("name") or "").strip():
            errors["name"] = "is required"

    if not partial or "facility_type" in data:
        if data.get("facility_type") not in FACILITY_TYPES:
            errors["facility_type"] = f"must be one of {FACILITY_TYPES}"

    if "ad_tier" in data and data["ad_tier"] not in AD_TIERS:
        errors["ad_tier"] = f"must be one of {AD_TIERS}"

    if not partial:
        if not data.get("location_id"):
            errors["location_id"] = "is required"
        elif Location.query.get(data["location_id"]) is None:
            errors["location_id"] = "does not match an existing location"

    return errors


@businesses_bp.route("", methods=["GET"])
def list_businesses():
    query = Business.query.filter_by(status="approved").order_by(Business.created_at.desc())

    location_id = request.args.get("location_id", type=int)
    if location_id:
        query = query.filter_by(location_id=location_id)

    lifeguard_only = request.args.get("lifeguard_available", type=str)
    if lifeguard_only and lifeguard_only.lower() == "true":
        query = query.filter_by(lifeguard_available=True)

    return jsonify(paginate_query(query, lambda b: b.to_dict())), 200


@businesses_bp.route("/mine", methods=["GET"])
@jwt_required()
def list_my_businesses():
    """
    A business owner's own listings, regardless of status — so they can
    see a listing sitting in "pending" review, not just approved ones.
    """
    user_id = int(get_jwt_identity())
    query = Business.query.filter_by(user_id=user_id).order_by(Business.created_at.desc())
    return jsonify(paginate_query(query, lambda b: b.to_dict())), 200


@businesses_bp.route("/pending", methods=["GET"])
@jwt_required()
@admin_required
def list_pending_businesses():
    """Admin review queue — oldest submissions first."""
    query = Business.query.filter_by(status="pending").order_by(Business.created_at.asc())
    return jsonify(paginate_query(query, lambda b: b.to_dict())), 200


@businesses_bp.route("/<int:business_id>", methods=["GET"])
def get_business(business_id):
    business = Business.query.get(business_id)
    if business is None:
        return jsonify({"error": "Business not found"}), 404
    return jsonify(business.to_dict()), 200


@businesses_bp.route("", methods=["POST"])
@jwt_required()
def create_business():
    data = request.get_json(silent=True) or {}
    errors = _validate_business_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    business = Business(
        user_id=int(get_jwt_identity()),
        location_id=data["location_id"],
        name=data["name"].strip(),
        facility_type=data["facility_type"],
        description=data.get("description"),
        lifeguard_available=bool(data.get("lifeguard_available", False)),
        lifeguard_hours=data.get("lifeguard_hours"),
        amenities=data.get("amenities", []),
        contact_phone=data.get("contact_phone"),
        contact_email=data.get("contact_email"),
        ad_tier=data.get("ad_tier", "standard"),
        # Owners can never self-approve — every new listing starts pending,
        # regardless of what (if anything) the client sends for status.
        status="pending",
    )
    db.session.add(business)
    db.session.commit()

    return jsonify(business.to_dict()), 201


@businesses_bp.route("/<int:business_id>", methods=["PATCH"])
@jwt_required()
@owns_resource(lambda business_id: Business.query.get(business_id))
def update_business(business_id, resource):
    data = request.get_json(silent=True) or {}
    errors = _validate_business_payload(data, partial=True)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    # Only touch fields that were actually sent, so a partial PATCH can't
    # accidentally wipe out fields the client didn't intend to change.
    # Deliberately excludes "status" — an owner can never change their own
    # listing's approval status, only an admin can (see set_business_status).
    updatable_fields = [
        "name", "facility_type", "description", "lifeguard_available",
        "lifeguard_hours", "amenities", "contact_phone", "contact_email", "ad_tier",
    ]
    for field in updatable_fields:
        if field in data:
            setattr(resource, field, data[field])

    db.session.commit()
    return jsonify(resource.to_dict()), 200


@businesses_bp.route("/<int:business_id>/status", methods=["PATCH"])
@jwt_required()
@admin_required
def set_business_status(business_id):
    """Admin-only: approve or reject a pending listing."""
    business = Business.query.get(business_id)
    if business is None:
        return jsonify({"error": "Business not found"}), 404

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if new_status not in STATUSES:
        return jsonify({
            "error": "Validation failed",
            "details": {"status": f"must be one of {STATUSES}"},
        }), 422

    business.status = new_status
    db.session.commit()
    return jsonify(business.to_dict()), 200


@businesses_bp.route("/<int:business_id>", methods=["DELETE"])
@jwt_required()
@owns_resource(lambda business_id: Business.query.get(business_id))
def delete_business(business_id, resource):
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Business listing deleted"}), 200