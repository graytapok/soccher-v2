from ...extensions import db

class FollowedLeague(db.Model):
    __tablename__ = "followed_league"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    league_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    details = db.Column(db.JSON)

    def __repr__(self):
        return f'<league_id: {self.league_id}, user_id: {self.user_id}>'