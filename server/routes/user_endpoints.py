# pylint: disable=import-error
# pylint: disable=no-name-in-module

from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from helper_functions import convert_icon_path_to_base64
from models import User, db
from PIL import Image, ImageDraw, ImageFont

user_endpoints = Blueprint("user_endpoints", __name__)
Bcrypt = Bcrypt()


def generate_icon(user_id, userword):
    """Generates a random icon for the user based on the userword provided.
    Store in instance/icons/<user_id>.png

    Args:
        user_id (str): The user ID.
        userword (str): The userword.

    Returns:
        str: The icon path.
    """
    icon_path = f"instance/icons/{user_id}.png"

    # Create the icon. The icon is a 500x500 dark grey image, with [userword] written in the centre,
    # surrounded by brackets.
    img = Image.new("RGB", (500, 500), color=(36, 36, 36))
    d = ImageDraw.Draw(img)
    fnt = ImageFont.load_default()
    d.text((10, 40), f"[{userword}]", font=fnt, fill=(255, 255, 255))
    img.save(icon_path)

    return icon_path


@user_endpoints.after_request
def refresh_expiring_jwts(response):
    """Refreshes the JWT token if it is about to expire.

    Args:
        response (flask.Response): The response object to add the new JWT token to.

    Returns:
        flask.Response: The response object with the new JWT token.
    """
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response


@user_endpoints.route("/api/user/register", methods=["POST"])
def register():
    """Registers a new user.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    data = request.get_json()
    if (
        not data
        or "username" not in data
        or "password" not in data
        or "userword" not in data
    ):
        return jsonify({"error": "Invalid data format."}), 400

    username = data.get("username")
    password = data.get("password")
    userword = data.get("userword")

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username is already taken."}), 400

    user = User(
        username=username,
        password=Bcrypt.generate_password_hash(password).decode("utf-8"),
        userword=userword,
        icon_path="",
    )
    db.session.add(user)
    db.session.commit()

    # Generate a random icon for the user based on the userword
    # provided. Store in instance/icons/<user_id>.png
    user.icon_path = generate_icon(user.id, user.userword)
    db.session.commit()

    return jsonify({"message": "User registered."}), 200


@user_endpoints.route("/api/user/login", methods=["POST"])
def login():
    """Logs a user in.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data format."}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not Bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password."}), 401

    user.login_time = datetime.now()
    user.ip = request.remote_addr
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    response = jsonify({"message": "Login successful."})
    set_access_cookies(response, access_token)
    return response, 200


@user_endpoints.route("/api/user/me", methods=["GET"])
@jwt_required()
def me():
    """Get the user details.

    Returns:
        JSON: A JSON object with the user details.
    """
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"message": "Invalid user"}), 401

    return (
        jsonify(
            {
                "username": user.username,
                "userword": user.userword,
                "icon": convert_icon_path_to_base64(user.icon_path),
            }
        ),
        200,
    )


@user_endpoints.route("/api/user/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logs a user out.

    Returns:
        JSON: A JSON object with a message key.
    """

    # Get the user from the authorization token
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"message": "Invalid user"}), 401

    # Log the user out
    response = jsonify({"message": "Logout successful."})
    unset_jwt_cookies(response)
    return response, 200


@user_endpoints.route("/api/user/username", methods=["PUT"])
@jwt_required()
def change_username():
    """Change the username of the user

    Returns:
        JSON: A JSON object with a message key.
    """

    # Get the user from the authorization token
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"message": "Invalid user"}), 401

    # Get the new username from the request, and the current password
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"message": "Invalid data format"}), 400

    username = data["username"]
    password = data["password"]

    # Check if the current password is correct
    if not Bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 401

    # Change the username
    user.username = username

    # Save the user
    db.session.commit()

    return jsonify({"message": "Username changed."}), 200


@user_endpoints.route("/api/user/password", methods=["PUT"])
@jwt_required()
def change_password():
    """Change the password of the user

    Returns:
        JSON: A JSON object with a message key.
    """

    # Get the user from the authorization token
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"message": "Invalid user"}), 401

    # Get the new password from the request, and the current password
    data = request.get_json()
    if not data or "new_password" not in data or "password" not in data:
        return jsonify({"message": "Invalid data format"}), 400

    new_password = data["new_password"]
    password = data["password"]

    # Check if the current password is correct
    if not Bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 401

    # Change the password
    user.password = Bcrypt.generate_password_hash(new_password).decode("utf-8")

    # Save the user
    db.session.commit()

    return jsonify({"message": "Password changed."}), 200


@user_endpoints.route("/api/user/userword", methods=["PUT"])
@jwt_required()
def change_userword():
    """Change the userword of the user

    Returns:
        JSON: A JSON object with a message key.
    """

    # Get the user from the authorization token
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"message": "Invalid user"}), 401

    # Get the new userword from the request, and the current password
    data = request.get_json()
    if not data or "userword" not in data or "password" not in data:
        return jsonify({"message": "Invalid data format"}), 400

    userword = data["userword"]
    password = data["password"]

    # Check if the current password is correct
    if not Bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 401

    # Change the userword and generate a new icon
    user.userword = userword
    user.icon_path = generate_icon(user.id, user.userword)

    # Save the user
    db.session.commit()

    return jsonify({"message": "Userword changed."}), 200
