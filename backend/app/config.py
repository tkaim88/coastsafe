"""
Centralized app configuration.

Keeping config in one place (rather than scattered os.environ.get() calls
throughout the codebase) means there is exactly one place to look when a
setting needs to change, and it's easy to add a TestingConfig later without
touching application code.
"""

import os
from datetime import timedelta


class Config:
    """Base config — shared by every environment."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60))
    )

    # Comma-separated list of allowed frontend origins for CORS.
    FRONTEND_ORIGINS = os.environ.get(
        "FRONTEND_ORIGINS", "http://localhost:5173"
    ).split(",")

    # Default page size for paginated list endpoints; individual routes
    # can still accept a ?per_page= override up to MAX_PER_PAGE.
    DEFAULT_PER_PAGE = 10
    MAX_PER_PAGE = 50


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


# Looked up by name in the app factory so FLASK_ENV can select a config
# without importing classes directly elsewhere in the codebase.
config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
