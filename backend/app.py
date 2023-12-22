from flask import Flask, render_template
from flask_mail import Mail
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
from config import Config
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
mail = Mail(app)
safe = URLSafeTimedSerializer(app.config["SECRET_KEY"])

from routes import main, auth, admin, errors