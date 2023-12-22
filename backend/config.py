import os

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY')
    DOMAIN = os.getenv("DOMAIN")
    
    # Football API
    API_KEY = os.getenv("API_KEY")
    API_HOST = os.getenv("API_HOST")
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask Mail
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True