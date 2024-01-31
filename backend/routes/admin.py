from flask import request, render_template
from flask_login import current_user

from app import app, db
from database.models import User, FollowedMatch, FollowedLeague
from database.schemas import UserSchema, FollowedMatchSchema, FollowedLeagueSchema

from email_validator import validate_email, EmailNotValidError
from functools import wraps
from icecream import ic
import time

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

@app.route("/admin/dashboard", methods=["GET"])
@admin_required
def admin():
    user_schema = UserSchema(many=True)
    users = user_schema.dump(User.query.order_by(User.id).all())
    return {
        "message": "",
        "data": None,
        "success": True
    }

@app.route("/admin/edit/user", methods=["POST"])
@admin_required
def admin_edit_user():
    message = ""
    data = {}
    
    username = request.json['username']
    email = request.json['email']
    admin = request.json['admin']
    email_confirmed = request.json['Confirmed']
    user_id = request.json["id"]
    
    user = User.query.get(user_id)
            
    # Username: lenght >= 3, no only space
    if user.username != username and username != "":
        if len(username) < 3 or username.isspace():
            data.update({"username": {"rules": False}})
        elif User.query.filter_by(username=username).first() != None:
            data.update({"username": {"unique": False}})
        else:
            user.username = username
            
    # Email: valid
    if user.email != email and email != "":
        if User.query.filter_by(email=email).first() != None:
            data.update({"email": {"unique": False}})
        else: 
            try:
                v = validate_email(email)
                email = v["email"]
                user.email = email
            except EmailNotValidError:
                data.update({"email": {"rules": False}})
                
    # Password: 8-units, letters, capitals, numbers
    # Confirm Password: must be equal to password
    if "password" in request.json or "confirmPassword" in request.json: 
        if (("password" in request.json and not "confirmPassword" in request.json) 
            or (not "password" in request.json and "confirmPassword" in request.json)):
            data.update({"password": False})
            data.update({"confirmPassword": False})
        else:
            password = request.json['password']
            confirm_password = request.json['confirmPassword'] if "confirmPassword" in request.json else None
            if password != "" and confirm_password != "":
                if (len(password) < 8 
                        or password.isalpha() 
                        or password.isdigit() 
                        or password.islower() 
                        or password.isupper()):
                    data.update({"password": False})
                elif confirm_password != password:
                    data.update({"confirmPassword": False})
                else:
                    user.set_password(password)
            
    # Admin
    user.admin = admin if user.admin != admin else user.admin
    
    # Email confirmed
    if user.email_confirmed != email_confirmed:
        user.email_confirmed = email_confirmed
            
    if len(data) == 0:
        db.session.commit()
        
    return {
        "message": "",
        "data": data,
        "success": True if message == "" else False
    }

@app.route("/admin/create/user", methods=["POST"])
@admin_required
def admin_create_user():
    message = ""
    data = {}
    
    username = request.json['username']
    email = request.json['email']
    password = request.json["password"]
    confirm_password = request.json["confirmPassword"]
    admin = request.json['admin']
    email_confirmed = request.json['emailConfirmed']
            
    # Username: lenght >= 3, no only space
    if len(username) < 3 or username.isspace():
        data.update({"username": {"rules": False}})
    elif User.query.filter_by(username=username).first() != None:
        data.update({"username": {"unique": False}})
            
    # Email: valid
    if User.query.filter_by(email=email).first() != None:
        data.update({"email": {"unique": False}})
    else: 
        try:
            v = validate_email(email)
            email = v["email"]
        except EmailNotValidError:
            data.update({"email": {"rules": False}})
                
    # Password: 8-units, letters, capitals, numbers
    if (len(password) < 8 
            or password.isalpha() 
            or password.isdigit() 
            or password.islower() 
            or password.isupper()):
        data.update({"password": False})
            
    # Confirm Password: must be equal to password
    if confirm_password != password:
        data.update({"confirmPassword": False})
            
    if len(data) == 0:
        user = User(username=username, email=email, admin=admin, email_confirmed=email_confirmed)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
    return {
        "message": "",
        "data": data,
        "success": True if message == "" else False
    }

@app.route("/admin/delete/user", methods=["DELETE"])
@admin_required
def admin_delete_user():
    message = ""
    
    user_id = request.args.get("id")
    
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        message = "user not found"
    else:
        FollowedMatch.query.filter_by(user_id=user_id).delete()
        FollowedLeague.query.filter_by(user_id=user_id).delete()
        db.session.delete(user)
        db.session.commit()
    return {
        "message": message,
        "data": None,
        "success": True if message == "" else False
    }

@app.route("/admin/delete/followed_match", methods=["DELETE"])
@admin_required
def admin_delete_followed_match():
    message = ""
    
    match_id = request.args.get("id")
    
    match = FollowedMatch.query.filter_by(id=match_id).first()
    if match is None:
        message = "match not found"
    else:
        db.session.delete(match)
        db.session.commit()
    return {
        "message": message,
        "data": None,
        "success": True if message == "" else False
    }


@app.route("/admin/delete/followed_league", methods=["DELETE"])
@admin_required
def admin_delete_followed_league():
    message = ""
    
    league_id = request.args.get("id")
    
    league = FollowedLeague.query.filter_by(id=league_id).first()
    if match is None:
        message = "league not found"
    else:
        db.session.delete(league)
        db.session.commit()
    return {
        "message": message,
        "data": None,
        "success": True if message == "" else False
    }

