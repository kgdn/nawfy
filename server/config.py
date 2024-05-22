# pylint: disable=too-few-public-methods

import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class ApplicationConfig:
    """Application configuration class which holds all the configuration variables for
    the Flask app. The variables are loaded from the .env file using the load_dotenv()
    function.
    """

    SECRET_KEY = os.environ.get("SECRET_KEY")  # Secret key

    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")  # Database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get(
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    )  # Track modifications
    SQLALCHEMY_ECHO = os.environ.get(
        "SQLALCHEMY_ECHO"
    )  # Echo SQL queries to the console

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")  # Secret key
    JWT_COOKIE_CSRF_PROTECT = os.environ.get(
        "JWT_COOKIE_CSRF_PROTECT"
    )  # CSRF protection
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE")  # Secure cookies
    JWT_TOKEN_LOCATION = os.environ.get(
        "JWT_TOKEN_LOCATION"
    )  # Token location, i.e. cookies
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES"))
    )  # Access token expiration time
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.environ.get("JWT_REFRESH_TOKEN_EXPIRES"))
    )  # Refresh token expiration time
    CORS_HEADERS = os.environ.get("CORS_HEADERS")
    DAILY_LIMIT = os.environ.get("DAILY_LIMIT")  # Daily limit
    HOURLY_LIMIT = os.environ.get("HOURLY_LIMIT")  # Hourly limit
