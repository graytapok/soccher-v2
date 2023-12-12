from flask_admin.contrib.sqla import ModelView
from flask_login import UserMixin
from app import db, login, admin
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime, time, date


class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(65), index=True, unique=True)
    email = db.Column(db.String(121), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    about_me = db.Column(db.String(141))
    admin = db.Column(db.Boolean, default=False)
    fav_matches = db.relationship("FollowedMatch", backref="user", lazy="dynamic")

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class FollowedMatch(db.Model):
    __tablename__ = "followed_match"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    match_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    details = db.Column(JSON)

    def __repr__(self):
        return f'<details: {self.details}, user_id: {self.user_id}>'
    
class FollowedLeague(db.Model):
    __tablename__ = "followed_league"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    league_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    details = db.Column(JSON)

    def __repr__(self):
        return f'<details: {self.details}, user_id: {self.user_id}>'

@login.user_loader
def load_user(user):
    return User.query.get(int(user))

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(FollowedMatch, db.session))
admin.add_view(ModelView(FollowedLeague, db.session))