from flask_login import current_user

from functools import wraps

'''ERRORS'''
class UnexpectedError(Exception):
    pass

'''FUNCTIONS'''
def create_response(message: str, **kwargs):
    data = None
    if "data" in kwargs:
        if kwargs["data"] != {}:
            data = kwargs["data"]
    return {
        "message": message,
        "data": data if "data" in kwargs else None,
        "success": True if message == "" else False
    }

def check_request_type(request_type: str, request_types: list[str]):
    if request_type not in request_types:
        return create_response("wrong request type", data={"request_types": request_types, "request_type": request_type})
    return None

'''DECORATORS'''
def login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            return {
                "message": "login required",
                "data": None,
                "success": False
            }
        elif not current_user.email_confirmed:
            return {
                "message": "email must be confirmed",
                "data": None,
                "success": False
            }
        return func(*args, **kwargs)
    return wrapped

def no_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user:
            if current_user.is_authenticated:
                return {
                    "message": "no login required",
                    "data": None,
                    "success": False
                }
            else:
                return func(*args, **kwargs)
    return wrapped

def admin_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user:
            if not current_user.is_authenticated:
                return {
                    "message": "login required",
                    "data": None,
                    "success": False
                }
            elif not current_user.admin:
                return {
                    "message": "admin role required",
                    "data": None,
                    "success": False
                }
            else:
                return func(*args, **kwargs)
    return wrapped
