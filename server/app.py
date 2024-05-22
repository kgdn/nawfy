# pylint: disable=import-error
import os

from config import ApplicationConfig
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_migrate import Migrate
from helper_functions import get_user_ip_addr
from models import db
from routes.post_endpoints import post_endpoints
from routes.user_endpoints import user_endpoints
from werkzeug.middleware.proxy_fix import ProxyFix

# Create the Flask app
app = Flask(__name__)  # Create the Flask app
app.config.from_object(
    ApplicationConfig
)  # Load the configuration from the config.py file
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # Fix the proxy headers
Bcrypt = Bcrypt(app)  # Create the Bcrypt object
CORS(app, supports_credentials=True)  # Enable CORS
db.init_app(app)  # Initialise the database
jwt = JWTManager(app)  # Create the JWT manager
limiter = Limiter(
    key_func=get_user_ip_addr,
    app=app,
    default_limits=[app.config["HOURLY_LIMIT"], app.config["DAILY_LIMIT"]],
    storage_uri="memory://",
)
migrate = Migrate(app, db)  # Create the migration object

# Create DB
with app.app_context():
    db.create_all()

# Register the endpoints
app.register_blueprint(user_endpoints)
app.register_blueprint(post_endpoints)

# If instance/icons doesn't exist, create it
if not os.path.exists("instance/icons"):
    os.makedirs("instance/icons")

if __name__ == "__main__":
    app.run()
