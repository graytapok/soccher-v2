from flask import Flask, request, redirect

from app import app
from tools import create_response
from routes.admin import admin_required
from api.api_requests import ApiData

@app.route('/update/league_standings/<league_id>')
@app.route("/update/league_standings/<league_id>/<season>")
@admin_required
def update_league_standings(league_id, season=None):
    message = ""
    if league_id: message += league_id
    if season: message += season
    return create_response(message)
    