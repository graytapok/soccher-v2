from marshmallow import Schema, fields

from ..models import FollowedMatch
from .json_field import JSON

class FollowedMatchSchema(Schema):
    class Meta:
        model = FollowedMatch
        include_relationships = True
        load_instance = True
    id = fields.Integer()
    userId = fields.Integer(attribute="user_id")
    matchId = fields.Integer(attribute="match_id")
    details = JSON()