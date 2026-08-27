"""
SafetyReport CRUD routes.

Read (list, single) is public — anyone can see reports for a location, the
same way anyone can see weather. Create requires login. Update/delete
require login AND ownership, enforced by the shared `owns_resource`
decorator rather than a hand-rolled check in each function.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import SafetyReport, Location, VALID_RATINGS
from app.utils.decorators import owns_resource
from app.utils.pagination import paginate_query

safety_reports_bp = Blueprint("safety_reports", __name__, url_prefix="/api/reports")


def _validate_report_payload(data, partial=False):
    """
    Shared validation for create and update. `partial=True` means only
    validate fields that are actually present (used for PATCH), so an
    update doesn't have to resend every field just to satisfy validation.
    """
    errors = {}

    if not partial or "rating" in data:
        rating = data.get("rating")
        if rating not in VALID_RATINGS:
            errors["rating"] = f"must be one of {VALID_RATINGS}"

    if not partial:
        if not data.get("location_id"):
            errors["location_id"] = "is required"
        elif Location.query.get(data["location_id"]) is None:
            errors["location_id"] = "does not match an existing location"

    return errors


@safety_reports_bp.route("", methods=["GET"])
def list_reports():
    query = SafetyReport.query.order_by(SafetyReport.created_at.desc())

    location_id = request.args.get("location_id", type=int)
    if location_id:
        query = query.filter_by(location_id=location_id)

    return jsonify(paginate_query(query, lambda r: r.to_dict())), 200


@safety_reports_bp.route("/<int:report_id>", methods=["GET"])
def get_report(report_id):
    report = SafetyReport.query.get(report_id)
    if report is None:
        return jsonify({"error": "Report not found"}), 404
    return jsonify(report.to_dict()), 200


@safety_reports_bp.route("", methods=["POST"])
@jwt_required()
def create_report():
    data = request.get_json(silent=True) or {}
    errors = _validate_report_payload(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    report = SafetyReport(
        rating=data["rating"],
        notes=data.get("notes"),
        location_id=data["location_id"],
        user_id=int(get_jwt_identity()),
    )
    db.session.add(report)
    db.session.commit()

    return jsonify(report.to_dict()), 201


@safety_reports_bp.route("/<int:report_id>", methods=["PATCH"])
@jwt_required()
@owns_resource(lambda report_id: SafetyReport.query.get(report_id))
def update_report(report_id, resource):
    data = request.get_json(silent=True) or {}
    errors = _validate_report_payload(data, partial=True)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    if "rating" in data:
        resource.rating = data["rating"]
    if "notes" in data:
        resource.notes = data["notes"]

    db.session.commit()
    return jsonify(resource.to_dict()), 200


@safety_reports_bp.route("/<int:report_id>", methods=["DELETE"])
@jwt_required()
@owns_resource(lambda report_id: SafetyReport.query.get(report_id))
def delete_report(report_id, resource):
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Report deleted"}), 200
