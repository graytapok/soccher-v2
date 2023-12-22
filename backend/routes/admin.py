from flask import request
from flask_login import current_user

from app import app, db
from models import User, FollowedMatch, FollowedLeague

from email_validator import validate_email, EmailNotValidError
from functools import wraps
from icecream import ic
import time

def admin_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user:
            if not current_user.is_authenticated:
                return {"message": "You must be logged in!"}
            elif not current_user.admin:
                return {"message": "You must be an admin!"}
            else:
                return func(*args, **kwargs)
    return wrapped

@app.route("/admin/dashboard", methods=["GET"])
@admin_required
def admin():
    users = User.query.order_by(User.id).all()
    json_users = []
    for user in users:
        json_users.append(user.jsonify())
    return {"users": json_users}

@app.route("/admin/edit/user", methods=["POST"])
@admin_required
def admin_edit_user():
    username = request.json['username']
    email = request.json['email']
    admin = request.json['admin']
    email_confirmed = request.json['email_confirmed']
    user_id = request.json["id"]
    
    correctness = {
        "correct_input": True, 
        "data": {
            "username": {
                "unique": True, 
                "rules": True
            },
            "email": {
                "unique": True, 
                "rules": True
            },
            "password": True,
            "confirm_password": True
        }      
    }
    
    user = User.query.get(user_id)
            
    # Username: lenght >= 3, no only space
    if user.username != username and username != "":
        if len(username) < 3 or username.isspace():
            correctness["correct_input"] = False
            correctness["data"]["username"]["rules"] = False
        elif User.query.filter_by(username=username).first() != None:
            correctness["correct_input"] = False
            correctness["data"]["username"]["unique"] = False
        else:
            user.username = username
            
    # Email: valid
    if user.email != email and email != "":
        if User.query.filter_by(email=email).first() != None:
            correctness["correct_input"] = False
            correctness["data"]["email"]["unique"] = False
        else: 
            try:
                v = validate_email(email)
                email = v["email"]
                user.email = email
            except EmailNotValidError:
                correctness["correct_input"] = False
                correctness["data"]["email"]["rules"] = False
                
    # Password: 8-units, letters, capitals, numbers
    # Confirm Password: must be equal to password
    if "password" in request.json or "confirm_password" in request.json: 
        if ("password" in request.json and not "confirm_password" in request.json) or (not "password" in request.json and "confirm_password" in request.json):
            correctness["correct_input"] = False
            correctness["data"]["password"] = False
            correctness["data"]["confirm_password"] = False
        else:
            password = request.json['password']
            confirm_password = request.json['confirm_password'] if "confirm_password" in request.json else None
            if password != "" and confirm_password != "":
                if (len(password) < 8 
                        or password.isalpha() 
                        or password.isdigit() 
                        or password.islower() 
                        or password.isupper()):
                    correctness["correct_input"] = False
                    correctness["data"]["password"] = False
                elif confirm_password != password:
                    correctness["correct_input"] = False
                    correctness["data"]["confirm_password"] = False
                else:
                    user.set_password(password)
            
    # Admin
    user.admin = admin if user.admin != admin else user.admin
    
    # Email confirmed
    if user.email_confirmed != email_confirmed:
        user.email_confirmed = email_confirmed
            
    if correctness["correct_input"]:
        db.session.commit()
        
    return correctness

@app.route("/admin/create/user", methods=["POST"])
@admin_required
def admin_create_user():
    username = request.json['username']
    email = request.json['email']
    password = request.json["password"]
    confirm_password = request.json["confirm_password"]
    admin = request.json['admin']
    email_confirmed = request.json['email_confirmed']
    
    correctness = {
        "correct_input": True, 
        "data": {
            "username": {
                "unique": True, 
                "rules": True
            },
            "email": {
                "unique": True, 
                "rules": True
            },
            "password": True,
            "confirm_password": True
        }      
    }
            
    # Username: lenght >= 3, no only space
    if len(username) < 3 or username.isspace():
        correctness["correct_input"] = False
        correctness["data"]["username"]["rules"] = False
    elif User.query.filter_by(username=username).first() != None:
        correctness["correct_input"] = False
        correctness["data"]["username"]["unique"] = False
            
    # Email: valid
    if User.query.filter_by(email=email).first() != None:
        correctness["correct_input"] = False
        correctness["data"]["email"]["unique"] = False
    else: 
        try:
            v = validate_email(email)
            email = v["email"]
        except EmailNotValidError:
            correctness["correct_input"] = False
            correctness["data"]["email"]["rules"] = False
                
    # Password: 8-units, letters, capitals, numbers
    if (len(password) < 8 
            or password.isalpha() 
            or password.isdigit() 
            or password.islower() 
            or password.isupper()):
        correctness["correct_input"] = False
        correctness["data"]["password"] = False
            
    # Confirm Password: must be equal to password
    if confirm_password != password:
        correctness["correct_input"] = False
        correctness["data"]["confirm_password"] = False
            
    if correctness["correct_input"]:
        user = User(username=username, email=email, admin=admin, email_confirmed=email_confirmed)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
    return correctness

@app.route("/admin/delete/user/<id>", methods=["GET"])
@admin_required
def admin_delete_user(id):
    message = ""
    user = User.query.filter_by(id=id).first()
    if user is None:
        message = f"not found"
    else:
        FollowedMatch.query.filter_by(user_id=id).delete()
        FollowedLeague.query.filter_by(user_id=id).delete()
        db.session.delete(user)
        db.session.commit()
        message = f"deleted"
    return {"message": message}

@app.route("/admin/delete/followed_match/<id>", methods=["GET"])
@admin_required
def admin_delete_followed_match(id):
    message = ""
    match = FollowedMatch.query.filter_by(id=id).first()
    if match is None:
        message = f"not found"
    else:
        db.session.delete(match)
        db.session.commit()
        message = f"deleted"
    return {"message": message}

@app.route("/admin/delete/followed_league/<id>", methods=["GET"])
@admin_required
def admin_delete_followed_league(id):
    message = ""
    league = FollowedLeague.query.filter_by(id=id).first()
    if match is None:
        message = f"not found"
    else:
        db.session.delete(league)
        db.session.commit()
        message = f"deleted"
    return {"message": message}