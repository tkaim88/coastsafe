"""
Reusable route decorators.

Ownership enforcement is the one piece of logic that absolutely must not
be duplicated per-route — a copy-pasted version that's missing from a
single endpoint is a real security hole. `owns_resource` centralizes it:
every write route for SafetyReport and Business wraps its update/delete
handler with this same decorator instead of re-checking user_id inline.
"""

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity


def owns_resource(fetch_fn):
    """
    Decorator factory for routes that modify a single owned record.

    `fetch_fn` takes the same kwargs the route receives (e.g. report_id)
    and returns the model instance, or None if it doesn't exist. The
    wrapped view function is only called if the record exists AND belongs
    to the current authenticated user; otherwise a 404 or 403 is returned
    before the view body ever runs.

    Usage:
        @safety_reports_bp.route("/<int:report_id>", methods=["PATCH"])
        @jwt_required()
        @owns_resource(lambda report_id: SafetyReport.query.get(report_id))
        def update_report(report_id, resource):
            ...
    """

    def decorator(view_fn):
        @wraps(view_fn)
        def wrapper(*args, **kwargs):
            resource = fetch_fn(**kwargs)

            if resource is None:
                return jsonify({"error": "Resource not found"}), 404

            current_user_id = int(get_jwt_identity())
            if resource.user_id != current_user_id:
                return jsonify({"error": "You do not have permission to modify this resource"}), 403

            # Pass the already-fetched resource through so the view doesn't
            # have to query for it a second time.
            return view_fn(*args, resource=resource, **kwargs)

        return wrapper

    return decorator

def admin_required(view_fn):
    """
    Decorator for routes that only an admin should be able to call
    (e.g. approving/rejecting a business listing). Must be used after
    @jwt_required() so get_jwt_identity() has a valid identity to look up.

    Usage:
        @businesses_bp.route("/pending", methods=["GET"])
        @jwt_required()
        @admin_required
        def list_pending_businesses():
            ...
    """
    @wraps(view_fn)
    def wrapper(*args, **kwargs):
        from app.models import User  # local import avoids a circular import with models

        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if user is None or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return view_fn(*args, **kwargs)
    return wrapper
