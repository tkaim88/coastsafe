"""
Auth routes: signup, login, logout, and "who am I".

Kept separate from the CRUD blueprints below since authentication is a
distinct concern from resource management — this file would exist even if
CoastSafe had zero owned resources.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
)

from app.extensions import db
from app.models import User, TokenBlocklist

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role", "user")

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if role not in ("user", "business_owner"):
        return jsonify({"error": "role must be 'user' or 'business_owner'"}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "An account with that email already exists"}), 409

    user = User(name=name, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"user": user.to_dict(), "access_token": access_token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()

    # Same error for "no such user" and "wrong password" — being specific
    # here would let an attacker enumerate which emails have accounts.
    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"user": user.to_dict(), "access_token": access_token}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # Revoke this specific token by recording its jti, so a stolen/leaked
    # token can't keep being used after the user has explicitly logged out.
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200
