from flask_login import UserMixin

from app import db, login

from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime, time, date

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(65), index=True, unique=True)
    email = db.Column(db.String(300), index=True, unique=True)
    password_hash = db.Column(db.String(300))
    
    admin = db.Column(db.Boolean, default=False)
    email_confirmed = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String)
    
    followed_matches = db.relationship("FollowedMatch", backref="user", lazy=True)
    followed_leagues = db.relationship("FollowedLeague", backref="user", lazy=True)
    
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
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
    details = db.Column(db.JSON)

    def __repr__(self):
        return f'<match_id: {self.match_id}, user_id: {self.user_id}>'
    
class FollowedLeague(db.Model):
    __tablename__ = "followed_league"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    league_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
    details = db.Column(db.JSON)

    def __repr__(self):
        return f'<league_id: {self.league_id}, user_id: {self.user_id}>'

@login.user_loader
def load_user(user):
    return User.query.get(int(user))