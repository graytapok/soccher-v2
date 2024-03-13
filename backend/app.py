from flask import Flask
from flask_mail import Mail
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from itsdangerous import URLSafeTimedSerializer
from shutil import get_terminal_size
from dotenv import load_dotenv
from threading import Thread
from itertools import cycle
from config import Config
import sys
import os

load_dotenv()

app = Flask("soccher-v2")
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
mail = Mail(app)
ma = Marshmallow(app)
safe = URLSafeTimedSerializer(app.config["SECRET_KEY"])

from database.models import *

with app.app_context():
    print("Creating Database ... ", end="")
    db.create_all()
    print("Done!")

from routes import main, auth, admin, update, errors
