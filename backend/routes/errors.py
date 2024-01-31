from app import app
from flask import request

from icecream import ic

@app.route("/favicon.ico")
def react_error1():
    return {}

@app.route("/match_details/images/react/favicon.ico")
def react_error2():
    return {}

@app.errorhandler(400)
def bad_request(e):
    print(e)
    print(request.base_url)
    return {"message": "Page not found"}

@app.errorhandler(404)
def page_not_found(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return {"message": "Page not found"}

@app.errorhandler(405)
def method_not_allowed(e):
    print(e)
    print(request.base_url)
    return {"message": "Method not allowed"}

@app.errorhandler(500)
def internal_server_error(e):
    print(e)
    print(request.base_url)
    return {"message": "Internal Server Error"}