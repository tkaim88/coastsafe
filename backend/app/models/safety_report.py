"""
SafetyReport model — the first of the two required full-CRUD resources.

A community-submitted observation about conditions at a specific location.
Owned by the user who created it (enforced in the route layer, not here —
models describe data, routes decide access).
"""

from datetime import datetime, timezone

from app.extensions import db

# Kept as a plain tuple (not a DB enum) so adding a new rating value later
# is a one-line change here, not a migration against a Postgres ENUM type.
VALID_RATINGS = ("favorable", "caution", "unsafe")


class SafetyReport(db.Model):
    __tablename__ = "safety_reports"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.String(20), nullable=False)
    notes = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "notes": self.notes,
            "user_id": self.user_id,
            "location_id": self.location_id,
            "location_name": self.location.name if self.location else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
