from flask import current_app, render_template
from flask_mail import Message
from ...extensions import safe, mail

def send_registration_email(email):
    token = safe.dumps(email, salt="email-confirm")

    msg = Message(subject="Registration - Soccher", sender=current_app.config["MAIL_USERNAME"], recipients=[email])
    msg.html = render_template("auth/register_email.html", link=f"{current_app.config['DOMAIN']}/confirm_email/{email}/{token}")

    mail.send(msg)

    return token


def send_change_password_email(email):
    token = safe.dumps(email, salt="password-change")

    msg = Message(subject="Password Change - Soccher", sender=current_app.config["MAIL_USERNAME"], recipients=[email])
    msg.html = render_template("auth/password_email.html", link=f"{current_app.config['DOMAIN']}/change_password/{email}/{token}")

    mail.send(msg)

    return token