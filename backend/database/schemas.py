from app import ma
from database.models import User, FollowedMatch, FollowedLeague
from marshmallow import fields

        
class FollowedMatchSchema(ma.SQLAlchemySchema):
    class Meta:
        model = FollowedMatch
        include_relationships = True
        load_instance = True
    id = ma.auto_field()
    userId = fields.Integer(attribute="user_id")
    matchId = fields.Integer(attribute="match_id")
    details = ma.auto_field()
        
class FollowedLeagueSchema(ma.SQLAlchemySchema):
    class Meta:
        model = FollowedLeague
        include_relationships = True
        load_instance = True
    id = ma.auto_field()
    userId = fields.Integer(attribute="user_id")
    leagueId = fields.Integer(attribute="league_id")
    details = ma.auto_field()

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
        
    id = ma.auto_field()
    username = ma.auto_field()
    email = ma.auto_field()
    admin = ma.auto_field()
    emailConfirmed = fields.Boolean(attribute="email_confirmed")
    
    # followedMatches = fields.Nested(FollowedMatchSchema, many=True, attribute="followed_matches")
    # followedLeagues = fields.Nested(FollowedLeagueSchema, many=True, attribute="followed_leagues")