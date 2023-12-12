from flask import Flask, render_template, flash, redirect, url_for, request, make_response
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash

from app import app, db, login
from models import User, FollowedMatch, FollowedLeague

from email_validator import validate_email, EmailNotValidError
from icecream import ic
from datetime import *
import json
import os

@app.route("/auth", methods=["GET"])
def auth():
    if current_user.is_authenticated:
        return {
            "auth": True, 
            "name": current_user.username, 
            "id": current_user.id,
            "email": current_user.email,
            "admin": current_user.admin
        }
    else:
        return {
            "auth": False, 
            "name": None, 
            "id": None,
            "email": None,
            "admin": False
        }    

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

@app.route("/login", methods=["POST"])
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
            return {"correct_input": True} # render_template('auth/login.html', title='Log In', form=form, user=current_user, incorrect=incorrect)

@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return {"logged_out": True}

@app.route("/register", methods=["POST"])
def register():
    if request.method == "POST":
        correctness = {
            "correct_input": True, "data": {
            "username": {"unique": True, "rules": True},
            "email": {"unique": True, "rules": True},
            "password": True,
            "confirm_password": True}      
        }

        username = request.json["username"]
        email = request.json["email"]
        password = request.json["password"]
        confirm_password = request.json["confirm_password"]

        # Username: lenght >= 3, no only space
        users = User.query.filter_by(username=username).first()
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
            login_user(user, remember=True)
        return correctness

@app.route("/my_profile", methods=["GET", "POST"])
@login_required
def my_profile():
    fav_matches = {}
    for i in FollowedMatch.query.filter_by(user_id=current_user.id):
        fav_matches.update({i.id: i.match_id})
    return {}

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