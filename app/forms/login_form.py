from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, RadioField
from flask import Flask, render_template, flash, redirect, url_for, request, make_response
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
from flask_wtf import FlaskForm
from app.models import User

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()], render_kw={"placeholder": "Username"})
    password = PasswordField("Password", validators=[DataRequired()], render_kw={"placeholder": "Password"})
    remember_me = BooleanField("Remember me")
    submit = SubmitField("Login")