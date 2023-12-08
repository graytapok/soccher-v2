from flask import Flask

from app import app

from icecream import ic

@app.errorhandler(400)
def bad_request(e):
    return {"message": "Page not found"}

@app.errorhandler(404)
def page_not_found(e):
    return {"message": "Page not found"}

@app.errorhandler(405)
def method_not_allowed(e):
    return {"message": "Method not allowed"}

@app.errorhandler(500)
def internal_server_error(e):
    return {"message": "Internal Server Error"}