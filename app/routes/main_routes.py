from flask import Flask, render_template, flash, redirect, url_for, request, jsonify
from flask_login import current_user

from app import app, db
from app.models import User, FollowedMatch
from app.api.api_requests import (create_match_statistics_json, create_date_matches_json,
                                  create_match_detail_info_json, create_categories_json, country_list, league_id_list,
                                  create_league_standings_json, create_league_media_json)
from app.api.tools import dict_of_match_details

from PIL import ImageColor
from icecream import ic
from datetime import *
import requests
import time
import json
import os

# Update the Database and open the JSON files "app/api/json/api_info/categories.json", "app/api/json/country_codes.json".
# List of all leagues_info ids.
with app.app_context():
    db.create_all()
    db.session.commit()
    db.session.close_all()

@app.route("/", methods=["GET"])
@app.route("/home", methods=["GET"])
@app.route("/index", methods=["GET"])
def index():
    # Open or create JSON file for today's matches.
    d, m, y = datetime.now().day, datetime.now().month, datetime.now().year
    todays_file = f"app/api/json/todays_matches/{d}_{m}_{y}.json"
    if not os.path.exists(todays_file):
        create_date_matches_json(d, m, y)
        while not os.path.exists(todays_file):
            continue
    
    os.makedirs(os.path.dirname(todays_file), exist_ok=True)
    with open(todays_file, "rb") as f:
        data = f.read()
        todays_json = json.loads(data)
        
    # Creating a dict of today's most important matches by "priority".
    matches = []
    priority = 550
    counter = 0
    while len(matches) < 10 and counter < 9:
        for event in todays_json["events"]:
            if "women" in event["tournament"]["name"].lower():
                continue
            elif event["tournament"]["priority"] >= priority:
                timestamp = event['startTimestamp']
                current_timestamp = time.time()
                user_current_time = datetime.now()

                day = datetime.fromtimestamp(timestamp).day
                if ((day == 31 or day == 30 or day == 29 or day == 28) and day > user_current_time.day) or day < user_current_time.day:
                    continue
                    
                current_time = event["status"]["description"]
                extra_time = None
                if event["status"]["type"] == "inprogress" and "statusTime" in event:
                    current_time = (current_timestamp - event["statusTime"]["timestamp"]) + event["statusTime"]["initial"]
                    current_time //= 60
                    if (current_timestamp - event["statusTime"]["timestamp"]) > event["statusTime"]["max"]:
                        extra_time = (current_timestamp - event["statusTime"]["timestamp"]) - event["statusTime"]["max"]

                if "current" in event["awayScore"]:
                    away_score = event["awayScore"]["current"]
                    home_score = event["homeScore"]["current"]
                else:
                    away_score = "/" if current_time == "Canceled" else "-"
                    home_score = "/" if current_time == "Canceled" else "-"

                hour = datetime.fromtimestamp(timestamp).hour
                hour = "0" + str(hour) if hour < 10 else hour

                minutes = datetime.fromtimestamp(timestamp).minute
                minutes = minutes = "0" + str(minutes) if minutes < 10 else minutes
                
                country = False
                if event['homeTeam']['name'] in country_list or event['awayTeam']['name'] in country_list:
                    country = True
                
                matches.append(dict_of_match_details(match_id=int(event['id']), 
                                                     home={"name":event['homeTeam']['name'], "score": home_score}, 
                                                     away={"name":event['awayTeam']['name'], "score": away_score}, 
                                                     start_time=f'{hour}:{minutes}',
                                                     status=event["status"]["type"],
                                                     current_time=current_time,
                                                     country=country,
                                                     extra_time=extra_time))
        priority -= 50  
        counter += 1
        
    # Sort matches
    matches = sorted(matches, key = lambda k: k["start_time"], reverse=False)
        
    # leagues overview
    leagues = []
    for i in league_id_list:
        if league_id_list[i]["priority"] >= 430:
            leagues.append({
                "id": i,
                "name": league_id_list[i]["name"],
                "slug": league_id_list[i]["slug"],
                "category_name": league_id_list[i]["category_name"],
                "priority": league_id_list[i]["priority"]}
            )
    return {"matches": matches, "leagues": leagues}

@app.route("/league", methods=["POST", "GET"])
def league():
    if request.method == "GET":
        league_id = 17
    else:
        league_id = int(request.json["league_id"])
        
    # Open or create JSON file for league_id.
    season = create_league_standings_json(league_id)
    league_standings_file = f"app/api/json/leagues_info/standings/{league_id}_{season}.json"
    while not os.path.exists(league_standings_file):
            continue
    os.makedirs(os.path.dirname(league_standings_file), exist_ok=True)
    with open(league_standings_file, "rb") as f:
        data = f.read()
        league_standings_json = json.loads(data)
        
    json_data = league_standings_json["standings"][0]
    
    standings = []
    for row in json_data["rows"]:
        standings.append({
            "position": row["position"],
            "name": row["team"]["name"],
            "team": { 
                "id": row["team"]["id"],
                "colors": {
                    "primary": ImageColor.getcolor(row["team"]["teamColors"]["primary"], "RGB"),
                    "secondary": ImageColor.getcolor(row["team"]["teamColors"]["secondary"], "RGB"),
                    "text": ImageColor.getcolor(row["team"]["teamColors"]["primary"], "RGB"),
                }
            }, # promotion Error
            "points": row["points"],
            "wins": row["wins"],
            "draws": row["draws"],
            "losses": row["losses"],
            "scored": row["scoresFor"],
            "recieved": row["scoresAgainst"],
            "diff": row["scoresFor"] - row["scoresAgainst"]})
    
    # sort standings  
    standings = sorted(standings, key = lambda k: k["position"], reverse=False)
    
    league = {
        "id": league_id, 
        "name": json_data["name"], 
        "type": json_data["type"], 
        "slug": league_id_list[league_id]["slug"],
        "category_name": league_id_list[league_id]["category_name"],
        "priority": league_id_list[league_id]["priority"]
    }
    return {"league": league, "standings": standings}

@app.route("/match_details", methods=["GET", "POST"])
def match_details():
    match_id = int(request.json["match_id"])

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
    """ i = 0
    game_posession = {}
    for posession in statistics_json["statistics"]:
        game_posession.update({i: [posession['groups'][1]['statisticsItems'][0]['home'],
                                   posession['groups'][1]['statisticsItems'][0]['away']]})
        i += 1 """
    return {"match_id": ""}

@app.route("/countrys_ranking", methods=["GET"])
def countrys_ranking():
    # Open or create the ranking JSON file.
    file = "app/api/json/ranking.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)

    # Get information about each team.
    countrys = []
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
            
        countrys.append({
            "rank":country['team']['ranking'],
            "name": country['team']['name'],
            "color":
                ImageColor.getcolor(country['team']['teamColors']['primary'], "RGB"),
            "img": country_list[country['team']['name']] + ".png",
            "points": country["points"],
            "prev_points": country["previousPoints"],
            "prev_ranking": country["previousRanking"],
            "diff_points": diff_points,
            "diff_ranking": diff_ranking
        })
    return {"countrys": countrys}

@app.route("/countrys_ranking/<country_name>")
def country(country_name):
    file = "app/api/json/ranking.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)
    return {}