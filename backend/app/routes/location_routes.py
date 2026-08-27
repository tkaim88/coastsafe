"""
Location routes — intentionally read-only.

Locations are reference data (seeded, and extendable via the Geocoding
flow on the frontend), not something end users create/edit/delete through
this API. Keeping it read-only here means there's no ownership model to
enforce for this resource at all.
"""

from flask import Blueprint, jsonify

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
