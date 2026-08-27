"""
Registers every blueprint on the app in one place, so create_app() doesn't
need to know the internal file layout of app/routes/ — it just calls
register_routes(app) once.
"""

from app.routes.auth_routes import auth_bp
from app.routes.safety_report_routes import safety_reports_bp
from app.routes.business_routes import businesses_bp
from app.routes.location_routes import locations_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(safety_reports_bp)
    app.register_blueprint(businesses_bp)
    app.register_blueprint(locations_bp)
