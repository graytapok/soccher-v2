from itsdangerous import URLSafeTimedSerializer
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail

safe = URLSafeTimedSerializer("28is098vshlisdfß8")
login = LoginManager()
migrate = Migrate()
db = SQLAlchemy()
mail = Mail()
