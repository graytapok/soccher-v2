from flask import Flask
from flask_admin import Admin
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from dotenv import load_dotenv
from config import Config
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
admin = Admin(app)


from routes import auth, main, errors, admin
