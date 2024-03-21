from flask_login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash

from ...extensions import db

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String)

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
