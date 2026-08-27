"""
Location model.

Represents a water body (beach, lake, river, dam). Seeded from known
coastal locations and extendable later via the Open-Meteo Geocoding flow
already built into the Phase 1 frontend — this table doesn't need to know
about geocoding at all, it just needs somewhere to point SafetyReports and
Businesses at.
"""

from app.extensions import db


class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    region = db.Column(db.String(120))
    country = db.Column(db.String(120))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    water_type = db.Column(db.String(30))  # e.g. "beach", "lake", "river", "dam"
    description = db.Column(db.Text)

    safety_reports = db.relationship(
        "SafetyReport", backref="location", cascade="all, delete-orphan", lazy=True
    )
    businesses = db.relationship(
        "Business", backref="location", cascade="all, delete-orphan", lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "region": self.region,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "water_type": self.water_type,
            "description": self.description,
        }
