from flask import Flask, render_template, flash, redirect, url_for, request, make_response
from flask_login import login_user, logout_user, current_user
from flask_mail import Message

from app import app, db, login, mail, safe
from database.models import User, FollowedMatch, FollowedLeague
from database.schemas import UserSchema, FollowedMatchSchema, FollowedLeagueSchema

from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from email_validator import validate_email, EmailNotValidError
from functools import wraps
from icecream import ic
from datetime import *
import json
import os

def login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            return {
                "message": "login required",
                "data": None,
                "success": False
            }
        elif not current_user.confirmed:
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

@app.route("/auth", methods=["GET"])
def auth():
    user_schema = UserSchema()
    user = user_schema.dump(current_user)
    user.update({"auth": current_user.is_authenticated})
    
    return {
        "message": "",
        "data": user,
        "success": True
    }

@app.route("/auth/login", methods=["POST"])
@no_login_required
def login():
    message = ""
    
    username_email = request.json['login']
    password = request.json['password']
    remember_me = request.json['rememberMe']
    
    try:
        v = validate_email(username_email)
        email = v["email"]
        user = User.query.filter_by(email=f"{username_email}").first()
    except EmailNotValidError:
        user = User.query.filter_by(username=f"{username_email}").first()
        
    if user is None or not user.check_password(password):
        message = "incorrect input"
    else:
        login_user(user, remember=remember_me)
    
    return {
        "message": message,
        "data": None,
        "success": True if message == "" else False
    }
          
@app.route('/auth/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return {
        "message": "",
        "data": None,
        "success": True
    }

@app.route("/auth/register", methods=["POST"])
@no_login_required
def register():
    def send_registration_email(email):
        email_confirm = safe.dumps(email, salt="email-confirm")
        
        msg = Message(subject="Registration - Soccher", sender=app.config["MAIL_USERNAME"], recipients=[email])
        
        token = safe.dumps(email, salt="email-confirm")
        
        msg.html = render_template("register_email.html", link=f"{app.config['DOMAIN']}/confirm_email/{token}")
        mail.send(msg)
    
    message = ""
    data = {}
    
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    confirm_password = request.json["confirmPassword"]
    
    # Username: lenght >= 3, no spaces
    if len(username) < 3 or " " in username:
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
        
    if len(data) != 0:
        message = "invalid input"
        
    res = make_response({
        "message": message,
        "data": data,
        "success": True if message == "" else False
    })
        
    if len(data) == 0:
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        send_registration_email(email)
        res.set_cookie("email", email, max_age=60*60*24*365)
        
    return res
    
@app.route("/auth/confirm_email/<token>")
def confirm_email(token):
    message = ""
    set_cookies = False
    try:
        email = safe.loads(token, salt="email-confirm", max_age=60*60*24)
        user = User.query.filter_by(email=request.cookies.get("email")).first()
        login_user(user, remember=True)
        set_cookies = True
        current_user.confirmed = True
        db.session.commit()
    except SignatureExpired:
        message = "token is expired"
    except BadSignature:
        message = "token is incorrect"
        
    res = make_response({
        "message": message,
        "data": None,
        "success": True if message == "" else False
    })
    
    if set_cookies:
        res.set_cookie("email", "", expires=0)
    
    return res

@app.route("/auth/follow_match", methods=["POST", "DELETE"])
@login_required
def follow_match():
    if request.method == "POST":        
        message = ""
        details = request.json["details"]
        
        row = FollowedMatch.query.filter_by(user_id=current_user.id).filter_by(match_id=int(details["id"])).first()
        if row is not None:
            message = "already followed"
        else:
            match = FollowedMatch(
                user_id=current_user.id, 
                match_id=details["id"],
                details=details
            )
            db.session.add(match)
            db.session.commit()
        
        return {
            "message": message,
            "data": None,
            "success": True if message == "" else False
        }
    if request.method == "DELETE":
        message = ""
        match_id = int(request.args["id"])
        
        match = FollowedMatch.query.filter_by(user_id=current_user.id).filter_by(match_id=match_id).first()
        
        if match is not None:
            db.session.delete(match)
            db.session.commit()
        else:
            message = "match not found"
        
        return {
            "message": message,
            "data": None,
            "success": True if message == "" else False
        }
    
@app.route("/auth/follow_league", methods=["POST", "DELETE"])
@login_required
def follow_league():
    if request.method == "POST":  
        message = ""      
        details = request.json["details"]
        
        row = FollowedLeague.query.filter_by(user_id=current_user.id).filter_by(league_id=details["id"]).first()
        if row is not None:
            message = "already followed"
        else:
            league = FollowedLeague(
                user_id=current_user.id, 
                league_id=details["id"],
                details=details
            )
            db.session.add(league)
            db.session.commit()
        
        return {
            "message": message,
            "data": None,
            "success": True if message == "" else False
        }
        
    if request.method == "DELETE":
        message = ""
        league_id = int(request.args["id"])
        
        league = FollowedLeague.query.filter_by(user_id=current_user.id).filter_by(league_id=league_id).first()
        
        if league is not None:
            db.session.delete(league)
            db.session.commit()
        else:
            message = "league not found"
        
        return {
            "message": message,
            "data": None,
            "success": True if message == "" else False
        } 
        
@app.route("/cookies", methods=["POST"])
def cookies():
    res = make_response({
        "message": "",
        "data": None,
        "success": True
    })
    if not request.cookies.get("darkmode"):
        darkmode = request.json["darkmode"]
        if darkmode == "darkmode":
            darkmode = "darkmode"
        else:
            darkmode = "lightmode"
        res.set_cookie("darkmode", darkmode, max_age=60*60*24*365)
    return res