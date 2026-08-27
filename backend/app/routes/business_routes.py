"""
Business CRUD routes.

Follows the exact same shape as safety_report_routes.py deliberately —
same validation pattern, same use of `owns_resource`, same pagination
helper. Two resources implementing the same conventions is what makes this
DRY rather than "two similar-looking but subtly different copies."
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Business, Location, FACILITY_TYPES, AD_TIERS
from app.utils.decorators import owns_resource
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
    query = Business.query.order_by(Business.created_at.desc())

    location_id = request.args.get("location_id", type=int)
    if location_id:
        query = query.filter_by(location_id=location_id)

    lifeguard_only = request.args.get("lifeguard_available", type=str)
    if lifeguard_only and lifeguard_only.lower() == "true":
        query = query.filter_by(lifeguard_available=True)

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
    updatable_fields = [
        "name", "facility_type", "description", "lifeguard_available",
        "lifeguard_hours", "amenities", "contact_phone", "contact_email", "ad_tier",
    ]
    for field in updatable_fields:
        if field in data:
            setattr(resource, field, data[field])

    db.session.commit()
    return jsonify(resource.to_dict()), 200


@businesses_bp.route("/<int:business_id>", methods=["DELETE"])
@jwt_required()
@owns_resource(lambda business_id: Business.query.get(business_id))
def delete_business(business_id, resource):
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Business listing deleted"}), 200
