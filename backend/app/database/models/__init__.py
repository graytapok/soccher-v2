from .user import User
from .followed_match import FollowedMatch
from .followed_league import FollowedLeague

from ...extensions import login

@login.user_loader
def load_user(user):
    return User.query.get(int(user))
