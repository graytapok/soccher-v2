from flask_login import login_user, logout_user, login_required, current_user
from flask import Flask, render_template, flash, redirect, url_for, request

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
    return {"auth": current_user.is_authenticated}

@app.route("/login", methods=["GET", "POST"])
def login():
    correct_input = False
    if current_user.is_authenticated:
        print("user auth")
        return {"auth": True}
    if request.method == "POST":
        username_email = request.json['username_email']
        password = request.json['password']
        remember_me = request.json['remember_me']

        print([username_email, password, remember_me])

        try:
            v = validate_email(username_email)
            email = v["email"]
            user = User.query.filter_by(email=username_email).first()
        except EmailNotValidError:
            user = User.query.filter_by(username=username_email).first()

        if user is None or user.password_hash == password:
            correct_input = False
        else:
            login_user(user, remember=remember_me)
            correct_input = True
    return {"correct_input": correct_input} # render_template('auth/login.html', title='Log In', form=form, user=current_user, incorrect=incorrect)

@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    print("user loggout")
    return {"logged_out": True} # redirect(url_for('index'))

@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        send_registration_email(form.email.data)
        return redirect(url_for('index'))
    return {} # render_template("auth/register.html", form=form, title="Registration")

@app.route("/my_profile", methods=["GET", "POST"])
@login_required
def my_profile():
    fav_matches = {}
    for i in FollowedMatch.query.filter_by(user_id=current_user.id):
        fav_matches.update({i.id: i.match_id})
    return {} # render_template("my_profile.html", title="My Profile", user=current_user, fav_matches=fav_matches)