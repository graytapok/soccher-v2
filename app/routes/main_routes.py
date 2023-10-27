from flask import Flask, render_template, flash, redirect, url_for, request
from flask_login import current_user

from app import app, db
from app.models import User, FollowedMatch
from app.api.api_requests import (create_match_statistics_json, create_todays_matches_json,
                                  create_match_detail_info_json, create_categories_json, country_list, league_id_list,
                                  create_league_standings_json, create_league_media_json)

from PIL import ImageColor
from icecream import ic
from datetime import *
import requests
import json
import os

@app.route("/")
@app.route("/index")
def index():
    auth = current_user.is_authenticated
    return {"auth": auth}