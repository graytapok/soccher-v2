from datetime import datetime, time, date
from hashlib import md5
from app import db
from app import login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(65), index=True, unique=True)
    email = db.Column(db.String(121), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    about_me = db.Column(db.String(141))
    fav_matches = db.relationship("FollowedMatch", backref="user", lazy="dynamic")

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def check_correct_input(self):
        pass

class FollowedMatch(db.Model):
    __tablename__ = "followed_match"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    match_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    home = db.Column(db.String(120))
    away = db.Column(db.String(120))
    time = db.Column(db.String(120))

    def __repr__(self):
        return f'<table_id: {self.id}, match_id: {self.match_id}, user_id: {self.user_id}>'

@login.user_loader
def load_user(user):
    return User.query.get(int(user))
