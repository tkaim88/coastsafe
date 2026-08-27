"""
Business model — the second required full-CRUD resource.

Represents a facility a business owner wants visitors to find: a pool,
water park, or resort, tied to a Location. This is the model the whole
monetization story runs on — lifeguard_available and facility_type exist
because that's the actual trust signal a visitor is looking for, not just
a generic "ad" with a name and a price tier.

A listing starts as "pending" and only becomes visible to the public once
an admin approves it — status exists so not just any business can list
themselves without review.
"""

from datetime import datetime, timezone

from app.extensions import db

FACILITY_TYPES = ("swimming_pool", "water_park", "beach_resort", "lodge", "other")
AD_TIERS = ("standard", "featured")
STATUSES = ("pending", "approved", "rejected")


class Business(db.Model):
    __tablename__ = "businesses"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)

    name = db.Column(db.String(150), nullable=False)
    facility_type = db.Column(db.String(30), nullable=False, default="other")
    description = db.Column(db.Text)

    # The trust signal users actually care about when picking somewhere to swim.
    lifeguard_available = db.Column(db.Boolean, nullable=False, default=False)
    lifeguard_hours = db.Column(db.String(120))  # e.g. "9am–6pm daily"

    # Stored as a JSON list (e.g. ["slides", "changing rooms", "parking"]).
    # Using JSON here instead of a separate amenities table keeps this
    # resource simple; if amenities ever need their own filtering/search,
    # that's the natural point to split it out.
    amenities = db.Column(db.JSON, default=list)

    contact_phone = db.Column(db.String(30))
    contact_email = db.Column(db.String(255))

    ad_tier = db.Column(db.String(20), nullable=False, default="standard")

    # Gatekeeping: a listing is only public once an admin approves it.
    # Owners can never set this themselves — enforced in the route layer.
    status = db.Column(db.String(20), nullable=False, default="pending")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "location_id": self.location_id,
            "location_name": self.location.name if self.location else None,
            "name": self.name,
            "facility_type": self.facility_type,
            "description": self.description,
            "lifeguard_available": self.lifeguard_available,
            "lifeguard_hours": self.lifeguard_hours,
            "amenities": self.amenities or [],
            "contact_phone": self.contact_phone,
            "contact_email": self.contact_email,
            "ad_tier": self.ad_tier,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }