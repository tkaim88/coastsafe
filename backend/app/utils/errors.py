"""
Centralized error handling.

Registered once on the app (see app/__init__.py) so every unhandled
exception, 404, or 400 returns the same JSON shape — {"error": "..."} —
instead of Flask's default HTML error pages, which would break the
frontend's fetch().then(res => res.json()) calls.
"""

from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        return jsonify({"error": err.description}), err.code

    @app.errorhandler(Exception)
    def handle_unexpected_exception(err):
        # Log the real error server-side; never leak internals to the client.
        app.logger.exception(err)
        return jsonify({"error": "An unexpected error occurred"}), 500
