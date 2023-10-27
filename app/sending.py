from email.message import EmailMessage
import ssl
import smtplib

def send_registration_email(recevier):
    email_sender = "wvtrupp@gmail.com"
    email_password = "hwcg mqgh zjae sruh"
    email_recevier = recevier

    subject = "New user!"
    body = "You are now a registrated user! Have a nice time by using my application!"

    em = EmailMessage()
    em["From"] = email_sender
    em["To"] = email_recevier
    em["subject"] = subject
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, email_recevier, em.as_string())