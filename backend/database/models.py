from flask_admin.contrib.sqla import ModelView
from flask_login import UserMixin

from app import db, login

from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime, time, date

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(65), index=True, unique=True)
    email = db.Column(db.String(121), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    admin = db.Column(db.Boolean, default=False)
    confirmed = db.Column(db.Boolean, default=False)
    followed_matches = db.relationship("FollowedMatch", backref="user", lazy="dynamic")
    followed_leagues = db.relationship("FollowedLeague", backref="user", lazy="dynamic")
    
    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def jsonify(self):
        matches = []
        followed_matches = FollowedMatch.query.with_parent(self)
        for match in followed_matches:
            matches.append(match.jsonify())
            
        matches_ids = []
        for match in matches:
            matches_ids.append(match["match_id"])
            
        leagues = []
        followed_leagues = FollowedLeague.query.with_parent(self)
        for league in followed_leagues:
            leagues.append(league.jsonify())
            
        leagues_ids = []
        for league in leagues:
            leagues_ids.append(league["league_id"])
            
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "admin": self.admin,
            "email_confirmed": self.email_confirmed,
            "followed_matches": {
                "matches": matches, 
                "ids": matches_ids
            },
            "followed_leagues": {
                "leagues": leagues, 
                "ids": leagues_ids
            },
        }

class FollowedMatch(db.Model):
    __tablename__ = "followed_match"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    match_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    details = db.Column(JSON)

    def __repr__(self):
        return f'<details: {self.details}, user_id: {self.user_id}>'
    
class FollowedLeague(db.Model):
    __tablename__ = "followed_league"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    league_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    details = db.Column(JSON)

    def __repr__(self):
        return f'<details: {self.details}, user_id: {self.user_id}>'

@login.user_loader
def load_user(user):
    return User.query.get(int(user))