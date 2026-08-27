"""
Application factory.

Using create_app() instead of a single global `app = Flask(__name__)`
means the app can be instantiated multiple times with different configs
(e.g. a separate instance for tests with a throwaway database) without any
import-order headaches — a common source of bugs in small Flask projects
that skip this pattern.
"""

from flask import Flask

from app.config import config_by_name
from app.extensions import db, migrate, jwt, cors
from app.routes import register_routes
from app.utils.errors import register_error_handlers
from app.models import TokenBlocklist


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # --- Extensions ---
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGINS"]}})

    # --- JWT blocklist check ---
    # Runs on every request that requires a valid token; rejects any token
    # whose jti was recorded by the /auth/logout route.
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

    # --- Blueprints & error handlers ---
    register_routes(app)
    register_error_handlers(app)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app
