"""
User model.

Handles both regular users (who submit safety reports) and business owners
(who manage a facility listing) through a single `role` column rather than
two separate tables — the two kinds of account share every other field, so
splitting them would just duplicate the auth logic.

is_admin is separate from role: role describes what a user *does* on the
platform (submits reports vs. manages a listing), while is_admin is a
platform-operator flag used only to gate the business-approval workflow.
"""

from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # "user" submits safety reports; "business_owner" manages Business listings.
    role = db.Column(db.String(20), nullable=False, default="user")

    # Platform-operator flag — gates admin-only routes (e.g. approving
    # business listings). Not exposed via to_dict(); set directly in the
    # database for now rather than through any in-app UI.
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Ownership relationships. cascade="all, delete-orphan" means a user's
    # reports/listings are cleaned up automatically if the account is
    # deleted, so no orphaned rows are left pointing at a missing user.
    safety_reports = db.relationship(
        "SafetyReport", backref="user", cascade="all, delete-orphan", lazy=True
    )
    businesses = db.relationship(
        "Business", backref="owner", cascade="all, delete-orphan", lazy=True
    )

    def set_password(self, raw_password):
        """Hash and store a plaintext password. Never store raw_password directly."""
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        """Verify a plaintext password against the stored hash."""
        return check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        """
        Public representation of a user. Deliberately excludes
        password_hash and is_admin — neither is safe or useful to send to
        the frontend or embed inside a report/business payload.
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
        }