from database.models import User, FollowedMatch, FollowedLeague
from marshmallow import fields, Schema
import json

class JSON(fields.Field):
    def _deserialize(self, value, attr, data, **kwargs):
        if value:
            try:
                return json.loads(value)
            except ValueError:
                return None
        return None

        
class FollowedMatchSchema(Schema):
    class Meta:
        model = FollowedMatch
        include_relationships = True
        load_instance = True
    id = fields.Integer()
    userId = fields.Integer(attribute="user_id")
    matchId = fields.Integer(attribute="match_id")
    details = JSON()
        
class FollowedLeagueSchema(Schema):
    class Meta:
        model = FollowedLeague
        include_relationships = True
        load_instance = True
    id = fields.Integer()
    userId = fields.Integer(attribute="user_id")
    leagueId = fields.Integer(attribute="league_id")
    details = JSON()

class UserSchema(Schema):
    class Meta:
        model = User
        load_instance = True
        
    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    admin = fields.Boolean()
    emailConfirmed = fields.Boolean(attribute="email_confirmed")
    
    # followedMatches = fields.Nested(FollowedMatchSchema, many=True, attribute="followed_matches")
    # followedLeagues = fields.Nested(FollowedLeagueSchema, many=True, attribute="followed_leagues")