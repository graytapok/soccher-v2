from flask import Flask
from flask_mail import Mail
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from itsdangerous import URLSafeTimedSerializer
from config import Config, PrefixMiddleware
from shutil import get_terminal_size
from dotenv import load_dotenv
from threading import Thread
from itertools import cycle
import sys
import os

load_dotenv()

app = Flask("soccher-v2")
app.debug = True
app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix="/api")
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
mail = Mail(app)
safe = URLSafeTimedSerializer(app.config["SECRET_KEY"])

from database.models import *

with app.app_context():
    print("Creating Database ... ", end="")
    db.create_all()
    print("Done!")

from routes import main, auth, admin, update, errors
