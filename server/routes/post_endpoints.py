# pylint: disable=import-error
# pylint: disable=no-name-in-module

from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from helper_functions import convert_icon_path_to_base64
from models import Post, Reply, User, db

post_endpoints = Blueprint("post_endpoints", __name__)


def convert_uuid_to_username(uuid):
    """Converts a UUID to a username.

    Args:
        uuid (str): The UUID.

    Returns:
        str: The username.
    """
    return User.query.filter_by(id=uuid).first().username


def get_user_word(uuid):
    """Converts a UUID to a userword.

    Args:
        uuid (str): The UUID.

    Returns:
        str: The userword.
    """
    return User.query.filter_by(id=uuid).first().userword


@post_endpoints.route("/api/post/page/<int:page>", methods=["GET"])
def post_list(page):
    """Returns a list of posts.

    Args:
        page (int): The page number.

    Returns:
        JSON: A JSON object with a list of posts.
    """
    # Get the posts and replies
    posts = Post.query.paginate(page=page, per_page=10)
    replies = Reply.query.all()
    post_items = []
    for post in posts.items:
        post_item = {
            "id": post.id,
            "body": post.body,
            "created": post.created,
            "author": [
                {
                    "username": convert_uuid_to_username(post.uuid),
                    "uuid": post.uuid,
                    "userword": get_user_word(post.uuid),
                    "icon_path": convert_icon_path_to_base64(
                        User.query.filter_by(id=post.uuid).first().icon_path
                    ),
                }
            ],
            "replies": [],
        }
        for reply in replies:
            if reply.post_id == post.id:
                post_item["replies"].append(
                    {
                        "id": reply.id,
                        "body": reply.body,
                        "created": reply.created,
                        "author": [
                            {
                                "username": convert_uuid_to_username(reply.uuid),
                                "uuid": reply.uuid,
                                "userword": get_user_word(reply.uuid),
                                "icon_path": convert_icon_path_to_base64(
                                    User.query.filter_by(id=reply.uuid)
                                    .first()
                                    .icon_path
                                ),
                            }
                        ],
                    }
                )
        post_items.append(post_item)

    return (
        jsonify(
            {
                "items": post_items,
                "has_next": posts.has_next,
                "has_prev": posts.has_prev,
                "next_num": posts.next_num,
                "prev_num": posts.prev_num,
                "page": posts.page,
                "pages": posts.pages,
                "per_page": posts.per_page,
                "total": posts.total,
            }
        ),
        200,
    )


@post_endpoints.route("/api/post/<int:post_id>", methods=["GET"])
def post_get(post_id):
    """Returns a post.

    Args:
        id (int): The post ID.

    Returns:
        JSON: A JSON object with a post.
    """
    # Get the post
    post = Post.query.get_or_404(post_id)
    replies = Reply.query.all()
    return (
        jsonify(
            {
                "id": post.id,
                "body": post.body,
                "created": post.created,
                "author": [
                    {
                        "username": convert_uuid_to_username(post.uuid),
                        "uuid": post.uuid,
                        "userword": get_user_word(post.uuid),
                        "icon_path": convert_icon_path_to_base64(
                            User.query.filter_by(id=post.uuid).first().icon_path
                        ),
                    }
                ],
                "replies": [
                    {
                        "id": reply.id,
                        "body": reply.body,
                        "created": reply.created,
                        "author": [
                            {
                                "username": convert_uuid_to_username(reply.uuid),
                                "uuid": reply.uuid,
                                "userword": get_user_word(reply.uuid),
                                "icon_path": convert_icon_path_to_base64(
                                    User.query.filter_by(id=reply.uuid)
                                    .first()
                                    .icon_path
                                ),
                            }
                        ],
                    }
                    for reply in replies
                    if reply.post_id == post_id
                ],
            }
        ),
        200,
    )


@post_endpoints.route("/api/post/delete/<int:post_id>", methods=["DELETE"])
@jwt_required()
def post_delete(post_id):
    """Deletes a post.

    Args:
        id (int): The post ID.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    # Check that the user is the author of the post
    post = Post.query.get_or_404(post_id)
    if post.uuid != get_jwt_identity():
        return jsonify({"error": "Unauthorized."}), 401

    # Delete the post and its replies
    replies = Reply.query.filter_by(post_id=post_id).all()
    for reply in replies:
        db.session.delete(reply)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted."}), 200


@post_endpoints.route("/api/post/create", methods=["POST"])
@jwt_required()
def post_create():
    """Creates a new post.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    data = request.get_json()
    body = data.get("body")

    # If not a user, return an error
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"error": "Invalid user."}), 401

    # If no body, return an error
    if not body:
        return jsonify({"error": "Body is required."}), 400

    # Check if the message matches the last 3 entries in the database, return an error
    last_posts = Post.query.order_by(Post.created.desc()).limit(3).all()
    for post in last_posts:
        if body == post.body:
            return jsonify({"error": "Duplicate post."}), 400

    # If the user has already posted within the last 3 entries, return an error
    for post in last_posts:
        if post.uuid == get_jwt_identity():
            return (
                jsonify(
                    {"error": "You have already posted within the last 3 entries."}
                ),
                400,
            )

    # Create the post
    post = Post(uuid=get_jwt_identity(), body=body, created=datetime.now())
    db.session.add(post)
    db.session.commit()

    return jsonify({"message": "Post created."}), 201


@post_endpoints.route("/api/post/reply/<int:post_id>", methods=["POST"])
@jwt_required()
def post_reply(post_id):
    """Replies to a post.

    Args:
        id (int): The post ID.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    data = request.get_json()
    body = data.get("body")

    # If not a user, return an error
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({"error": "Invalid user."}), 401

    # If no body, return an error
    if not body:
        return jsonify({"error": "Body is required."}), 400

    # Check if the post exists
    post = Post.query.get_or_404(post_id)
    if not post:
        return jsonify({"error": "Post not found."}), 404

    # If the user is replying to their own post, return an error
    if post.uuid == get_jwt_identity():
        return jsonify({"error": "You cannot reply to your own post."}), 400

    # If reply matches the last 3 entries in the database, return an error
    last_replies = Reply.query.order_by(Reply.created.desc()).limit(3).all()
    for reply in last_replies:
        if body == reply.body:
            return jsonify({"error": "Duplicate reply."}), 400

    # If user has already replied to the post, return an error
    replies = Reply.query.filter_by(post_id=post_id).all()
    for reply in replies:
        if reply.uuid == get_jwt_identity():
            return jsonify({"error": "You have already replied to this post."}), 4000

    # Create the reply
    reply = Reply(
        uuid=get_jwt_identity(), post_id=post_id, body=body, created=datetime.now()
    )
    db.session.add(reply)
    db.session.commit()

    return jsonify({"message": "Reply created."}), 201


@post_endpoints.route("/api/post/reply/delete/<int:reply_id>", methods=["DELETE"])
@jwt_required()
def reply_delete(reply_id):
    """Deletes a reply.

    Args:
        id (int): The reply ID.

    Returns:
        JSON: A JSON object with a message or error key.
    """
    # Check that the user is the author of the reply
    reply = Reply.query.get_or_404(reply_id)
    if reply.uuid != get_jwt_identity():
        return jsonify({"error": "Unauthorized."}), 401

    # Delete the reply
    db.session.delete(reply)
    db.session.commit()
    return jsonify({"message": "Reply deleted."}), 200
