from flask import *
from flask_login import *

from app import app
from functools import wraps

class UnexpectedError(Exception):
    pass

def create_response(message: str, **kwargs):
    if "data" in kwargs:
        if kwargs["data"] == {}:
            data = None
        else:
            data = kwargs["data"]
    return {
        "message": message,
        "data": data if "data" in kwargs else None,
        "success": True if message == "" else False
    }

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