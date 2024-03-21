from marshmallow import Schema, fields

from ..models import User

class UserSchema(Schema):
    class Meta:
        model = User
        load_instance = True

    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    admin = fields.Boolean()
    emailConfirmed = fields.Boolean(attribute="email_confirmed")

    # followedMatches = fields.Nested(
    #   FollowedMatchSchema,
    #   many=True,
    #   attribute="followed_matches"
    # )
    # followedLeagues = fields.Nested(
    #   FollowedLeagueSchema,
    #   many=True,
    #   attribute="followed_leagues"
    # )
