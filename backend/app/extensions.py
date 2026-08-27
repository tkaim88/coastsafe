"""
Extension instances, created here (not inside create_app) so models and
routes can import `db` without triggering circular imports. Each extension
is bound to the actual Flask app later, inside the application factory.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
