from marshmallow import Schema, fields

from ..models import FollowedLeague
from .json_field import JSON

class FollowedLeagueSchema(Schema):
    class Meta:
        model = FollowedLeague
        include_relationships = True
        load_instance = True
    id = fields.Integer()
    userId = fields.Integer(attribute="user_id")
    leagueId = fields.Integer(attribute="league_id")
    details = JSON()