from flask_login import login_user, logout_user, login_required, current_user
from flask import Flask, render_template, flash, redirect, url_for, request
from werkzeug.security import generate_password_hash

from app.forms.register_form import RegistrationForm
from app.sending import send_registration_email
from app.forms.login_form import LoginForm
from app.models import User, FollowedMatch
from app import app, db, login

from email_validator import validate_email, EmailNotValidError
from datetime import *
import json
import os

@app.route("/auth", methods=["GET"])
def auth():
    if current_user.is_authenticated:
        return {
            "auth": current_user.is_authenticated, 
            "name": current_user.username, 
            "id": current_user.id,
            "email": current_user.email,
            "followed_matches": FollowedMatch.query.filter_by(user_id=current_user.id).all()
        }
    else:
        return {
            "auth": current_user.is_authenticated, 
            "name": "", 
            "id": "",
            "email": "",
            "fav_matches": ""
        }

@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        username_email = request.json['username_email']
        password = request.json['password']
        remember_me = request.json['remember_me']

        try:
            v = validate_email(username_email)
            email = v["email"]
            user = User.query.filter_by(email=username_email).first()
        except EmailNotValidError:
            user = User.query.filter_by(username=username_email).first()

        if user is None or not user.check_password(password):
            print(False)
            return {"correct_input": False}
        else:
            login_user(user, remember=remember_me)
            return {"correct_input": True} # render_template('auth/login.html', title='Log In', form=form, user=current_user, incorrect=incorrect)

@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return {"logged_out": True} # redirect(url_for('index'))

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
        print(users)
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
            send_registration_email(email)

        print(correctness)
        return correctness

@app.route("/my_profile", methods=["GET", "POST"])
@login_required
def my_profile():
    fav_matches = {}
    for i in FollowedMatch.query.filter_by(user_id=current_user.id):
        fav_matches.update({i.id: i.match_id})
    return {} # render_template("my_profile.html", title="My Profile", user=current_user, fav_matches=fav_matches)