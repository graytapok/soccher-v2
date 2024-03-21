from ...extensions import db
class FollowedMatch(db.Model):
    __tablename__ = "followed_match"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    match_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    details = db.Column(db.JSON)

    def __repr__(self):
        return f'<match_id: {self.match_id}, user_id: {self.user_id}>'
