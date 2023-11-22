import os

basedir = os.path.abspath(os.path.dirname(__file__))

db_url = "postgresql://postgres:fixiki2009@localhost:5432/soccher"

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'basic_flask_project_key'
    APP_NAME = os.environ.get('APP_NAME') or 'Basic Flask Project'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
