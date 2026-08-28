"""
Location routes.

GET routes are read-only — locations are reference data, seeded plus
extendable, not something end users edit/delete. The one write route,
resolve, is a find-or-create: it lets the business listing form register
a location anywhere on earth (via the same Open-Meteo geocoding the
homepage search already uses) without needing a full CRUD surface here.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models import Location

locations_bp = Blueprint("locations", __name__, url_prefix="/api/locations")


@locations_bp.route("", methods=["GET"])
def list_locations():
    locations = Location.query.order_by(Location.name).all()
    return jsonify([loc.to_dict() for loc in locations]), 200


@locations_bp.route("/<int:location_id>", methods=["GET"])
def get_location(location_id):
    location = Location.query.get(location_id)
    if location is None:
        return jsonify({"error": "Location not found"}), 404
    return jsonify(location.to_dict()), 200


@locations_bp.route("/resolve", methods=["POST"])
@jwt_required()
def resolve_location():
    """
    Find-or-create a Location from already-geocoded data.

    Used by the business listing form so an owner can list a facility at
    any coastal location on earth, not just the locations seeded at
    launch — the frontend does the actual geocoding (Open-Meteo) and
    hands the result here to get back a location_id a Business can point
    at. Matching is by case-insensitive name; a genuinely new place
    becomes a new row. Auth-required since this is the one place outside
    seed.py that grows the Location table.
    """
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    errors = {}
    if not name:
        errors["name"] = "is required"
    if latitude is None:
        errors["latitude"] = "is required"
    if longitude is None:
        errors["longitude"] = "is required"
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 422

    existing = Location.query.filter(
        db.func.lower(Location.name) == name.lower()
    ).first()
    if existing:
        return jsonify(existing.to_dict()), 200

    location = Location(
        name=name,
        region=data.get("region"),
        country=data.get("country"),
        latitude=latitude,
        longitude=longitude,
        water_type=data.get("water_type", "beach"),
        description=data.get("description"),
    )
    db.session.add(location)
    db.session.commit()

    return jsonify(location.to_dict()), 201