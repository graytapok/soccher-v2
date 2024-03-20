from flask import request, render_template
from flask_login import current_user

from app import app, db
from app.tools import admin_required, create_response, UnexpectedError
from database.models import User, FollowedMatch, FollowedLeague
from database.schemas import UserSchema, FollowedMatchSchema, FollowedLeagueSchema

from email_validator import validate_email, EmailNotValidError
from icecream import ic
import time

@app.route("/admin/dashboard", methods=["GET"])
@admin_required
def admin():
    user_schema = UserSchema(many=True)
    users = user_schema.dump(User.query.order_by(User.id).all())
    
    return create_response("", data=users)

@app.route("/admin/edit/user", methods=["POST"])
@admin_required
def admin_edit_user():
    message = ""
    data = {}
    
    user_id = request.json["id"]
    
    user = User.query.get(user_id)
            
    # Username: lenght >= 3, no only space
    if "username" in request.json:
        username = request.json["username"]
        if len(username) < 3 or username.isspace():
            data.update({"username": {"rules": False}})
        elif User.query.filter_by(username=username).first() != None:
            if User.query.filter_by(username=username).first() != user:
                data.update({"username": {"unique": False}})
        else:
            user.username = username
            
    # Email: valid
    if "email" in request.json:
        email = request.json["email"]
        if User.query.filter_by(email=email).first() != None:
            if User.query.filter_by(email=email).first() != user:
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
        if ("password" in request.json and "confirmPassword" not in request.json):
            password = request.json['password']
            if (len(password) < 8 
                    or password.isalpha() 
                    or password.isdigit() 
                    or password.islower() 
                    or password.isupper()):
                data.update({"password": False})
            data.update({"confirmPassword": False})
        elif ("password" not in request.json and "confirmPassword" in request.json):
            data.update({"password": False})
            data.update({"confirmPassword": False})
        else:
            password = request.json['password']
            confirm_password = request.json['confirmPassword']
            if (len(password) < 8 
                    or password.isalpha() 
                    or password.isdigit() 
                    or password.islower() 
                    or password.isupper()):
                data.update({"password": False})
            if confirm_password != password:
                data.update({"confirmPassword": False})
            if "password" not in data and "confirmPassword" in data:
                user.set_password(password)
                
    # Admin
    if "admin" in request.json:
        user.admin = request.json["admin"]
    
    # Email confirmed
    if "emailConfirmed" in request.json:
        user.email_confirmed = request.json["emailConfirmed"]
            
    if len(data) == 0:
        db.session.commit()
    else:
        message = "invalid input"
        
    return create_response(message, data=data)

@app.route("/admin/create/user", methods=["POST"])
@admin_required
def admin_create_user():
    message = ""
    data = {}
    
    # Username: lenght >= 3, no only space
    if "username" in request.json:
        username = request.json['username']
        if len(username) < 3 or username.isspace():
            data.update({"username": {"rules": False}})
        elif User.query.filter_by(username=username).first() != None:
            data.update({"username": {"unique": False}})
    else:
        data.update({"username": {"rules": False}})
            
    # Email: valid
    if "email" in request.json:
        email = request.json['email']   
        if User.query.filter_by(email=email).first() != None:
            data.update({"email": {"unique": False}})
        else: 
            try:
                v = validate_email(email)
                email = v["email"]
            except EmailNotValidError:
                data.update({"email": {"rules": False}})
    else:
        data.update({"email": {"rules": False}})
        
    # Password: 8-units, letters, capitals, numbers
    if "password" in request.json:
        password = request.json["password"]
        if (len(password) < 8 
                or password.isalpha() 
                or password.isdigit() 
                or password.islower() 
                or password.isupper()):
            data.update({"password": False})
    else:
        data.update({"password": False})
        
    # Confirm Password: must be equal to password
    if "confirmPassword" in request.json:  
        confirm_password = request.json["confirmPassword"]
        if confirm_password != password:
            data.update({"confirmPassword": False})
    else: 
        data.update({"confirmPassword": False})   
        
    admin = request.json['admin'] if "admin" in request.json else False
    email_confirmed = request.json['emailConfirmed'] if 'emailConfirmed' in request.json else False
          
    if len(data) != 0:
        message = "invalid input"
    else:
        user = User(username=username, email=email, admin=admin, email_confirmed=email_confirmed)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

    return create_response(message, data=data)

@app.route("/admin/delete/<request_type>/<id>", methods=["DELETE"])
@admin_required
def admin_delete(request_type, id):
    request_types = ["user", "followed_match", "followed_league"]
    if request_type not in request_types:
        return create_response(f"wrong request type: {request_type}", data={"request_types": request_types})
    
    match request_type:
        case "user":
            message = ""

            user = User.query.filter_by(id=id).first()
            if user is None:
                message = "user not found"
            else:
                FollowedMatch.query.filter_by(user_id=id).delete()
                FollowedLeague.query.filter_by(user_id=id).delete()
                db.session.delete(user)
                db.session.commit()

            return create_response(message)
        
        case "followed_match":
            message = ""

            match = FollowedMatch.query.filter_by(id=id).first()
            if match is None:
                message = "match not found"
            else:
                db.session.delete(match)
                db.session.commit()

            return create_response(message)
        
        case "followed_league":
            message = ""

            league = FollowedLeague.query.filter_by(id=id).first()
            if league is None:
                message = "league not found"
            else:
                db.session.delete(league)
                db.session.commit()

            return create_response(message)
