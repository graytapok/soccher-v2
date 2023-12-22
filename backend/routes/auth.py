from flask import Flask, render_template, flash, redirect, url_for, request, make_response
from flask_login import login_user, logout_user, current_user
from flask_mail import Message
from werkzeug.security import generate_password_hash

from app import app, db, login, mail, safe
from models import User, FollowedMatch, FollowedLeague

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
        if current_user:
            if not current_user.is_authenticated:
                return {"message": "You must be logged in!"}
            else:
                return func(*args, **kwargs)
    return wrapped

def no_login_required(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        if current_user:
            if current_user.is_authenticated:
                return {"message": "You must not be logged in!"}
            else:
                return func(*args, **kwargs)
    return wrapped

@app.route("/auth", methods=["GET"])
def auth():
    if current_user.is_authenticated:
        return {
            "auth": True, 
            "name": current_user.username, 
            "id": current_user.id,
            "email": current_user.email,
            "admin": current_user.admin,
            "email_confirmed": current_user.email_confirmed
        }
    else:
        return {
            "auth": False, 
            "name": None, 
            "id": None,
            "email": None,
            "admin": False,
            "email_confirmed": False
        }    

@app.route("/login", methods=["POST"])
@no_login_required
def login():
    if request.method == "POST":
        username_email = request.json['username_email']
        password = request.json['password']
        remember_me = request.json['remember_me']

        try:
            v = validate_email(username_email)
            email = v["email"]
            user = User.query.filter_by(email = f"{username_email}").first()
        except EmailNotValidError:
            user = User.query.filter_by(username=f"{username_email}").first()

        if user is None or not user.check_password(password):
            return {"correct_input": False}
        else:
            login_user(user, remember=remember_me)
            return {"correct_input": True} 
        
@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return {"logged_out": True}

@app.route("/register", methods=["POST"])
@no_login_required
def register():
    def send_registration_email(email):
        email_confirm = safe.dumps(email, salt="email-confirm")
        
        msg = Message(subject="Registration - Soccher", sender=app.config["MAIL_USERNAME"], recipients=[email])
        
        msg_body = "You signed up for Soccher. Please confirm your email for security reasons."
        token = safe.dumps(email, salt="email-confirm")
        domain = app.config["DOMAIN"]
        data = {
            "app_name": "Soccher",
            "title": "Welcome to Soccher",
            "body": msg_body,
            "token_link": f"{domain}/confirm_email/{token}"
        }
        msg.html = render_template("register_email.html", data=data)
        mail.send(msg)
        ic("Email sent")
    
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
    
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    confirm_password = request.json["confirm_password"]
    
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
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        send_registration_email(email)
        login_user(user, remember=True)
    return correctness
    
@app.route("/confirm_email/<token>")
@login_required
def confirm_email(token):
    try:
        email = safe.loads(token, salt="email-confirm", max_age=60*60*24)
        if current_user.is_authenticated:
            if current_user.email_confirmed:
                return {"message": "already confirmed"}
        current_user.email_confirmed = True
        db.session.commit()
        return {"message": "confirmed"}
    except SignatureExpired:
        return {"message": "expired"}
    except BadSignature:
        return {"message": "not correct"}

@app.route("/follow_match", methods=["POST"])
def follow_match():
    # Adding or deleting the match from followed matches.
    match_id = request.json["id"]
    details = request.json["details"]

    if not current_user.is_authenticated:
        return {"state": "auth"}

    fav = FollowedMatch.query.filter_by(user_id=current_user.id).filter_by(match_id=match_id).first()
    if fav is not None:
        db.session.delete(fav)
        db.session.commit()
        return {"state": "deleted"}
    elif fav is None: 
        row = FollowedMatch(
            user_id=current_user.id, 
            match_id=match_id,
            details=details)
        db.session.add(row)
        db.session.commit() 
        return {"state": "added"} 
    
@app.route("/follow_league", methods=["POST"])
def follow_league():
    # Adding or deleting the match from followed matches.
    league_id = request.json["id"]
    details = request.json["details"]

    if not current_user.is_authenticated:
        return {"state": "auth"}

    fav = FollowedLeague.query.filter_by(user_id=current_user.id).filter_by(league_id=league_id).first()
    if fav is not None:
        db.session.delete(fav)
        db.session.commit()
        return {"state": "deleted"}
    elif fav is None: 
        row = FollowedLeague(
            user_id=current_user.id, 
            league_id=league_id,
            details=details)
        db.session.add(row)
        db.session.commit() 
        return {"state": "added"} 
    
@app.route("/followed_matches", methods=["GET"])
def followed_matches():
    if current_user.is_authenticated:
        followed_matches = {}
        matches = FollowedMatch.query.filter_by(user_id=current_user.id).all()
        for i in matches:
            match_id = str(i.match_id)
            followed_matches.update({
                i.match_id: {
                    "home": {
                        "name": i.details["home"]["name"],
                        "score": i.details["home"]["score"],
                        "img": i.details["home"]["img"]
                    },
                    "away": {
                        "name": i.details["away"]["name"],
                        "score": i.details["away"]["score"],
                        "img": i.details["away"]["img"]
                    },
                    "start_time": i.details["start_time"],
                    "status": i.details["status"],
                    "current_time": i.details["current_time"], 
                    "country": i.details["country"]
                } 
                })
        return {"followed_matches": followed_matches}
    else:
        return {"followed_matches": "auth"}
    
@app.route("/followed_leagues", methods=["GET"])
def followed_leagues():
    if current_user.is_authenticated:
        followed_leagues = {}
        leagues = FollowedLeague.query.filter_by(user_id=current_user.id).all()
        for i in leagues:
            league_id = str(i.league_id)
            followed_leagues.update({
                i.league_id: {
                    "name": i.details["name"],
                    "slug": i.details["slug"],
                    "category_name": i.details["category_name"],
                    "priority": i.details["priority"]
                }
            })
        return {"followed_leagues": followed_leagues}
    else:
        return {"followed_leagues": "auth"}

@app.route("/cookies", methods=["POST"])
def cookies():
    if not request.cookies.get("darkmode"):
        darkmode = request.json["darkmode"]
        if darkmode == "darkmode":
            darkmode = "darkmode"
        else:
            darkmode = "lightmode"
        res = make_response({"cookies": True})
        res.set_cookie("darkmode", darkmode, max_age=60*60*24*365)
        return res
    return {"cookies": False}