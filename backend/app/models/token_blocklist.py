"""
TokenBlocklist model.

A JWT is normally valid until it expires, even after "logout" — the token
itself doesn't know it's been logged out. Storing revoked token IDs (jti)
here, and checking against this table on every request (see
app/__init__.py's jwt.token_in_blocklist_loader), makes logout actually
invalidate the token instead of just deleting it client-side.
"""

from datetime import datetime, timezone

from app.extensions import db


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
