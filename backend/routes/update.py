from flask import Flask, request, redirect

from app import app
from tools import create_response
from routes.admin import admin_required
from api.api_requests import *

@app.route('/update/league_standings/<league_id>')
@admin_required
def update_league_standings(league_id):
    return redirect("/test")
    if "season" in request.args:
        api_league_standings(league_id, request.args["season"] , update=True)
    else:
        api_league_standings(league_id, update=True)
    return create_response("")

@app.route("/test")
def test():
    return create_response("redirect")
    