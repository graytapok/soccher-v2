from app import db, ma
from database.models import User, FollowedMatch, FollowedLeague
from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("id", "username", "email", "admin", "confirmed")
        
class FollowedMatchSchema(ma.SQLAlchemySchema):
    class Meta:
        model = FollowedMatch
    id = ma.auto_field()
    userId = fields.Integer(attribute="user_id")
    matchId = fields.Integer(attribute="match_id")
    details = ma.auto_field()
        
class FollowedLeagueSchema(ma.SQLAlchemySchema):
    class Meta:
        model = FollowedLeague
    id = ma.auto_field()
    userId = fields.Integer(attribute="user_id")
    leagueId = fields.Integer(attribute="league_id")
    details = ma.auto_field()