from flask import redirect, request
from flask_login import login_user, logout_user, current_user

from email_validator import validate_email, EmailNotValidError
from itsdangerous import SignatureExpired, BadSignature

from .email import send_registration_email, send_change_password_email
from ..auth import auth_bp
from ...extensions import db, safe
from ...tools import login_required, no_login_required, create_response
from ...database.models import User, FollowedMatch, FollowedLeague
from ...database.schemas import UserSchema, FollowedMatchSchema, FollowedLeagueSchema


@auth_bp.route("/", methods=["GET"])
def auth():
    user_schema = UserSchema()
    user = user_schema.dump(current_user)
    user.update({"auth": current_user.is_authenticated})

    return create_response("", data=user)

@auth_bp.route("/login", methods=["POST"])
@no_login_required
def login():
    message = ""

    username_email = request.json['login'] if "login" in request.json else ""
    password = request.json['password'] if "password" in request.json else ""
    remember_me = request.json['rememberMe'] if "rememberMe" in request.json else ""

    try:
        v = validate_email(username_email)
        email = v["email"]
        user = User.query.filter_by(email=f"{username_email}").first()
    except EmailNotValidError:
        user = User.query.filter_by(username=f"{username_email}").first()

    if user is None or not user.check_password(password):
        message = "incorrect input"
    elif user.email_confirmed != True:
        message = "email must be confirmed"
    else:
        login_user(user, remember=remember_me)

    return create_response(message)

@auth_bp.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return create_response("")

@auth_bp.route("/register", methods=["POST"])
@no_login_required
def register():
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
    else:
        user = User(username=username, email=email)
        user.set_password(password)
        user.verification_token = send_registration_email(email)
        db.session.add(user)
        db.session.commit()

    return create_response(message, data=data)

@auth_bp.route("/resend_email/<login>", methods=["GET"])
@no_login_required
def resend_email(login):
    message = ""

    try:
        v = validate_email(login)
        email = v["email"]
        user = User.query.filter_by(email=f"{login}").first()
    except EmailNotValidError:
        user = User.query.filter_by(username=f"{login}").first()

    if user is not None:
        if user.email_confirmed:
            message = "email already confirmed"
        else:
            user.verification_token = send_registration_email(user.email)
            db.session.commit()
    else:
        message = "user not found"

    return create_response(message)

@auth_bp.route("/confirm_email/<email>/<token>", methods=["GET"])
def confirm_email(email, token):
    message = ""

    try:
        v = validate_email(email)
        email = v["email"]
        user = User.query.filter_by(email=email).first()
        if user is None:
            message = "user not found"
    except EmailNotValidError:
        message = "email is not valid"

    if message == "":
        try:
            itsdanger = safe.loads(token, salt="email-confirm", max_age=60 * 10)
            if user.email_confirmed:
                message = "already confirmed"
            elif user.verification_token == token:
                user.email_confirmed = True
                user.verification_token = ""
                db.session.commit()
                login_user(user, remember=True)
            else:
                message = "token is expired"
        except SignatureExpired:
            message = "token is expired"
        except BadSignature:
            message = "token is incorrect"
    return create_response(message)

@auth_bp.route("/forgot_password/<login>", methods=["GET"])
def forgot_password(login):
    message = ""

    try:
        v = validate_email(login)
        email = v["email"]
        user = User.query.filter_by(email=f"{login}").first()
    except EmailNotValidError:
        user = User.query.filter_by(username=f"{login}").first()

    if user is not None:
        user.verification_token = send_change_password_email(user.email)
        db.session.commit()
    else:
        message = "user not found"

    return create_response(message)

@auth_bp.route("/change_password/<email>/<token>", methods=["POST"])
def change_password(email, token):
    message = ""
    data = {}

    password = request.json["password"]
    confirm_password = request.json["confirmPassword"]

    try:
        v = validate_email(email)
        email = v["email"]
        user = User.query.filter_by(email=email).first()
        if user is None:
            message = "user not found"
    except EmailNotValidError:
        message = "email is not valid"

    if message == "":
        try:
            itsdanger = safe.loads(token, salt="password-change", max_age=60 * 15)

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

            if user.verification_token == token and len(data) == 0:
                user.email_confirmed = True
                user.verification_token = ""
                user.set_password(password)
                db.session.commit()
                if not current_user.is_authenticated:
                    login_user(user, remember=True)
            else:
                if len(data) != 0:
                    message = "incorrect input"
                else:
                    message = "token is expired"
        except SignatureExpired:
            message = "token is expired"
        except BadSignature:
            message = "token is incorrect"

    return create_response(message, data=data)

@auth_bp.route("/followed/<request_type>", methods=["GET"])
@login_required
def followed(request_type):
    request_types = ["matches", "leagues"]
    if request_type not in request_types:
        return create_response("incorrect request type",
                               data={"requst_type": request_type, "request_types": request_types})

    match request_type:
        case "matches":
            followed_schema = FollowedMatchSchema(many=True)
            matches = followed_schema.dump(current_user.followed_matches)
            return create_response("", data=matches)

        case "leagues":
            followed_schema = FollowedLeagueSchema(many=True)
            leagues = followed_schema.dump(current_user.followed_leagues)
            return create_response("", data=leagues)

@auth_bp.route("/follow/<request_type>", methods=["DELETE", "POST"])
@login_required
def follow(request_type):
    request_types = ["match", "league"]
    if request_type not in request_types:
        return create_response("incorrect request type",
                               data={"requst_type": request_type, "request_types": request_types})

    match request_type:
        case "match":
            if request.method == "POST":
                message = ""
                details = request.json["details"]

                row = FollowedMatch.query.filter_by(user_id=current_user.id).filter_by(
                    match_id=int(details["id"])).first()
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
                    return redirect("/api/auth/followed/matches")

                return create_response(message)
            if request.method == "DELETE":
                message = ""
                match_id = int(request.args["id"])

                match = FollowedMatch.query.filter_by(user_id=current_user.id).filter_by(match_id=match_id).first()

                if match is not None:
                    db.session.delete(match)
                    db.session.commit()
                    return redirect("/api/auth/followed/matches", code=303)
                else:
                    message = "match not found"

                return create_response(message)

        case "league":
            if request.method == "POST":
                message = ""
                details = request.json["details"]

                row = FollowedLeague.query.filter_by(user_id=current_user.id).filter_by(
                    league_id=int(details["id"])).first()
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
                    return redirect("/api/auth/followed/leagues")

                return create_response(message)
            if request.method == "DELETE":
                message = ""
                league_id = int(request.args["id"])

                league = FollowedLeague.query.filter_by(user_id=current_user.id).filter_by(league_id=league_id).first()

                if league is not None:
                    db.session.delete(league)
                    db.session.commit()
                    return redirect("/api/auth/followed/leagues", code=303)
                else:
                    message = "league not found"
                    return create_response(message)