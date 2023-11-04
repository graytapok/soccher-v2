from flask import Flask, render_template, flash, redirect, url_for, request, jsonify
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

# Update the Database and open the JSON files "app/api/json/api_info/categories.json", "app/api/json/country_codes.json".
# List of all leagues_info ids.
with app.app_context():
    db.create_all()
    db.session.close_all()
    with open("app/api/json/country_codes.json", "rb") as f:
        data = f.read()
        country_codes_json = json.loads(data)


@app.route("/", methods=["GET"])
@app.route("/home", methods=["GET"])
@app.route("/index", methods=["GET"])
def index():
    # Open or create JSON file for today's matches.
    d, m, y = datetime.now().day, datetime.now().month, datetime.now().year
    matches_file = f"app/api/json/todays_matches/{d}_{m}_{y}.json"
    if not os.path.exists(matches_file):
        create_todays_matches_json()
        while not os.path.exists(matches_file):
            continue
    os.makedirs(os.path.dirname(matches_file), exist_ok=True)
    with open(matches_file, "rb") as f:
        data = f.read()
        matches_json = json.loads(data)

    # Creating a dict of today's most important matches by "priority".
    matches = {}
    priority = 450
    while len(matches) < 8:
        for event in matches_json["events"]:
            if "women" in event["tournament"]["name"].lower():
                continue
            elif event["tournament"]["priority"] >= priority:
                timestamp = event['startTimestamp']

                hour = datetime.fromtimestamp(timestamp).hour
                hour = "0" + str(hour) if hour < 10 else hour

                minutes = datetime.fromtimestamp(timestamp).minute
                minutes = minutes = "0" + str(minutes) if minutes < 10 else minutes

                if event['homeTeam']['name'] in country_list or event['awayTeam']['name'] in country_list:
                    matches.update({int(event['id']): {"home": event['homeTeam']['name'],
                                                  "away": event['awayTeam']['name'],
                                                  "time": f'{hour}:{minutes}',
                                                  "country": True,
                                                  "home_code": "images/country_flags/" +
                                                               country_list[event['homeTeam']['name']] + ".png",
                                                  "away_code": "images/country_flags/" +
                                                               country_list[event['awayTeam']['name']] + ".png"}})
                else:
                    matches.update({int(event['id']): {"home": event['homeTeam']['name'],
                                                  "away": event['awayTeam']['name'],
                                                  "time": f'{hour}:{minutes}',
                                                  "country": False}})
        priority -= 50

    # get a list of followed matches
    return {"matches": matches}

@app.route("/leagues_info", methods=["GET", "POST"])
def leagues():
    # Open the JSON file "matches.json".
    file = "app/api/json/matches.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)

    # Sorting the matches to their leagues_info.
    matches_leagues = {}
    leagues_accepted = {1: "Premier League",
                        4: "Ligue 1",
                        33: "Seria A",
                        36: "La Liga",
                        42: "Bundesliga",
                        384: "Ukraine Premiere League"}
    for event in json_data["events"]:
        if "woman" in event["tournament"]["name"].lower():
            continue
        else:
            league_id = event["tournament"]["id"]
            if league_id in leagues_accepted:
                matches_leagues.update({event['id']: {"home": event['homeTeam']['name'],
                                                      "away": event['awayTeam']['name'],
                                                      "league": league_id}})
    return {} # render_template("leagues_info.html", title="Leagues", matches_leagues=matches_leagues, leagues_accepted=leagues_accepted)


@app.route("/match_details/<match_id>", methods=["GET", "POST"])
def match_details(match_id):
    # Open or create the match details JSON file.
    details_file = f"app/api/json/match_detail_info/{match_id}.json"
    if not os.path.exists(details_file):
        create_match_detail_info_json(match_id)
        os.makedirs(os.path.dirname(details_file), exist_ok=True)
        while not os.path.exists(details_file):
            continue
    with open(details_file, "rb") as f:
        data = f.read()
        details_json = json.loads(data)

    # Open or create the match statistics JSON file.
    statistics_file = f"app/api/json/match_statistics/{match_id}.json"
    if not os.path.exists(statistics_file):
        create_match_statistics_json(match_id)
        os.makedirs(os.path.dirname(statistics_file), exist_ok=True)
        while not os.path.exists(statistics_file):
            continue
    with open(statistics_file, "rb") as f:
        data = f.read()
        statistics_json = json.loads(data)

    # Get the team's name and color.
    team = {}
    home_color = ImageColor.getcolor(details_json["event"]["homeTeam"]["teamColors"]["primary"], "RGB")
    away_color = ImageColor.getcolor(details_json["event"]["awayTeam"]["teamColors"]["primary"], "RGB")
    team.update({"home": [details_json["event"]["homeTeam"]["name"], home_color],
                 "away": [details_json["event"]["awayTeam"]["name"], away_color]})

    # Get details about the match
    # Time
    match = {}
    t = details_json["event"]["startTimestamp"]
    match_time = datetime.fromtimestamp(t)
    hour = datetime.fromtimestamp(t).hour
    minutes = datetime.fromtimestamp(t).minute
    if minutes < 10:
        minutes = "0" + str(datetime.fromtimestamp(t).minute)
    if hour < 10:
        hour = "0" + str(datetime.fromtimestamp(t).minute)
    match.update({"starttime": f"{hour}:{minutes}, {match_time.day}.{match_time.month}"})

    # Score
    score = {}
    try:
        score.update({"home": details_json["event"]["homeScore"]["normaletime"],
                      "away": details_json["event"]["awayScore"]["normaletime"]})
    except KeyError:
        score.update({"home": 0, "away": 0})

    # Posession
    i = 0
    game_posession = {}
    for posession in statistics_json["statistics"]:
        game_posession.update({i: [posession['groups'][1]['statisticsItems'][0]['home'],
                                   posession['groups'][1]['statisticsItems'][0]['away']]})
        i += 1
    return {} # render_template("match_details.html", title="Match Details", match_id=match_id, team=team, score=score, match=match)


@app.route("/countrys_ranking")
def countrys_ranking():
    # Open or create the ranking JSON file.
    file = "app/api/json/ranking.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)

    # Get information about each team.
    countrys = {}
    for country in json_data["rankings"]:
        if country["points"] - country["previousPoints"] == 0:
            diff_points = 0
        elif country["points"] - country["previousPoints"] > 0:
            diff_points = f"+{round(country['points'] - country['previousPoints'], 2)}"
        else:
            diff_points = round(country["points"] - country["previousPoints"], 2)
        if (country["previousRanking"] - country['team']['ranking']) > 0:
            diff_ranking = f"+{country['previousRanking'] - country['team']['ranking']}"
        else:
            diff_ranking = country["previousRanking"] - country['team']['ranking']
        countrys.update(
            {country['team']['ranking']: {"name": country['team']['name'],
                                          "color_primary":
                                              ImageColor.getcolor(country['team']['teamColors']['primary'], "RGB"),
                                          "color_secondary":
                                              ImageColor.getcolor(country['team']['teamColors']['secondary'], "RGB"),
                                          "img": "images/country_flags/" +
                                                  country_list[country['team']['name']] + ".png",
                                          "points": country["points"],
                                          "prev_points": country["previousPoints"],
                                          "prev_ranking": country["previousRanking"],
                                          "diff_points": diff_points,
                                          "diff_ranking": diff_ranking}})
    return {"matches": countrys}

@app.route("/league_ranking/<league_id>")
def league_ranking(league_id):
    # Open or create league details JSON file.
    league_standings_file = f"app/api/json/leagues_info/standings/{league_id}.json"
    if not os.path.exists(league_standings_file):
        create_league_standings_json(league_id)
        os.makedirs(os.path.dirname(league_standings_file), exist_ok=True)
        while not os.path.exists(league_standings_file):
            continue
    with open(league_standings_file, "rb") as f:
        data = f.read()
        league_standings_json = json.loads(data)

    # Open or create league media JSON file.
    league_media_file = f"app/api/json/leagues_info/media/{league_id}.json"
    if not os.path.exists(league_media_file):
        create_league_media_json(league_id)
        os.makedirs(os.path.dirname(league_media_file), exist_ok=True)
        while not os.path.exists(league_media_file):
            continue
    with open(league_media_file, "rb") as f:
        data = f.read()
        league_media_json = json.loads(data)
    return render_template("league_ranking.html", title="League Table")

@app.route("/countrys_ranking/<country_name>")
def country(country_name):
    file = "app/api/json/ranking.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)
    return {} # render_template("country.html", title="County Ranking", country_name=country_name)


@app.route("/follow_match", methods=["POST"])
def follow_match():
    # Adding or deleting the match from followed matches.
    match_id = request.json["id"]
    if not current_user.is_authenticated:
        return {"state": "auth"}
    fav = FollowedMatch.query.filter_by(match_id=match_id).filter_by(user_id=current_user.id).first()
    if fav is not None:
        db.session.delete(fav)
        db.session.commit()

        followed_matches = []
        matches = FollowedMatch.query.filter_by(user_id=current_user.id).all()
        for i in range(len(matches)):
            followed_matches.append(matches[i].match_id)
        print(followed_matches, f"deleted: {match_id}")

        return {"state": "deleted"}
    elif fav is None: 
        db.session.add(FollowedMatch(user_id=current_user.id, match_id=match_id))
        db.session.commit()

        followed_matches = []
        matches = FollowedMatch.query.filter_by(user_id=current_user.id).all()
        for i in range(len(matches)):
            followed_matches.append(matches[i].match_id)
        print(followed_matches, f"added: {match_id}")

        return {"state": "added"}
