from flask import request

from app import app
from tools import create_response

@app.errorhandler(400)
def bad_request(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Page not found")

@app.errorhandler(404)
def page_not_found(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Page not found")

@app.errorhandler(405)
def method_not_allowed(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Method not allowed")

@app.errorhandler(500)
def internal_server_error(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Internal Server Error")