from flask import Flask

from datetime import datetime

from ..config import Config, PrefixMiddleware
from .extensions import db, migrate, mail, login
from ..api import ApiData

from .blueprints.main import main_bp
from .blueprints.auth import auth_bp
from .blueprints.admin import admin_bp
from .blueprints.errors import errors_bp

def create_app():
    app = Flask("soccher-v2")
    app.config.from_object(Config)
    app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix="/api")

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    login.init_app(app)

    app.register_blueprint(main_bp)
    app.register_blueprint(errors_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    with app.app_context():
        day, month, year = datetime.now().day, datetime.now().month, datetime.now().year
        ApiData(
            day=day,
            month=month,
            year=year,
            timeframe=60 * 60
        ).match("date")

    return app
