from uuid import uuid4

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def generate_uuid():
    """Generates a random UUID (universally unique identifier) and returns it as a string.

    Returns:
        str: A random UUID as a string.
    """
    return uuid4().hex


class User(db.Model):
    """User model.

    Args:
        db (SQLAlchemy): The SQLAlchemy object.
    """

    id = db.Column(db.String(32), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    userword = db.Column(db.String(80), nullable=False)
    icon_path = db.Column(db.String(80), nullable=False)
    login_time = db.Column(db.DateTime, nullable=True)
    ip = db.Column(db.String(80), nullable=True)


class Post(db.Model):
    """Post model.

    Args:
        db (SQLAlchemy): The SQLAlchemy object.
    """

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)
    body = db.Column(db.String(80), nullable=False)
    created = db.Column(db.DateTime, nullable=False)
    replies = db.relationship("Reply", backref="post", lazy=True)


class Reply(db.Model):
    """Reply model.

    Args:
        db (SQLAlchemy): The SQLAlchemy object.
    """

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)
    body = db.Column(db.String(80), nullable=False)
    created = db.Column(db.DateTime, nullable=False)
