from flask import Flask, render_template, flash, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user

from app import app, db, login
from app.forms.register_form import RegistrationForm
from app.forms.login_form import LoginForm
from app.models import User, FollowedMatch
from app.sending import send_registration_email

from datetime import *
import os
import json

@app.route("/login", methods=["GET", "POST"])
@app.route("/login/<incorrect>", methods=["GET", "POST"])
def login(incorrect=None):
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            return redirect(url_for("login", incorrect="incorrect"))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for("index"))
    return {} # render_template('auth/login.html', title='Log In', form=form, user=current_user, incorrect=incorrect)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return {} # redirect(url_for('index'))

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