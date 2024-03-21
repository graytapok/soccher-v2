from flask import request

from ..errors import errors_bp
from ...extensions import db
from ...tools import create_response

@errors_bp.app_errorhandler(400)
def bad_request(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Page not found")

@errors_bp.app_errorhandler(404)
def page_not_found(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Page not found")

@errors_bp.app_errorhandler(405)
def method_not_allowed(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    return create_response("Method not allowed")

@errors_bp.app_errorhandler(500)
def internal_server_error(e):
    print(f"""
        {e}
        {request.base_url}
    """)
    db.session.rollback()
    return create_response("Internal Server Error")
