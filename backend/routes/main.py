from flask import Flask, render_template, flash, redirect, url_for, request, jsonify
from flask_login import current_user

from app import app, db
from tools import create_response
from database.models import User, FollowedMatch
from api.api_requests import *

from PIL import ImageColor
from icecream import ic
from datetime import *
import requests
import time
import json
import os

with app.app_context():
    date = datetime.now()
    todays_json = api_match_date(date.day, date.month, date.year, update=True, timeframe=60*60*60*24)

@app.route("/index", methods=["GET"])
def index():
    message = ""
    
    # Open or create JSON file for today's matches.
    d, m, y = datetime.now().day, datetime.now().month, datetime.now().year
    todays_json = api_match_date(d, m, y)
        
    # Creating a dict of today's most important matches by "priority".
    matches = []
    priority = 550
    counter = 0
    while len(matches) < 10 and counter < 9:
        if counter > 0:
            matches.clear()
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
                
                matches.append({
                    "id": int(event['id']),
                    "home": {
                        "name": event['homeTeam']['name'],
                        "img": (country_list[info["home"]["name"]] + ".png") if country else None,
                        "score": home_score
                    },
                    "away": {
                        "name": event['awayTeam']['name'],
                        "img": (country_list[info["away"]['name']] + ".png") if country else None,
                        "score": away_score
                    },
                    "startTime": f'{hour}:{minutes}',
                    "currentTime": current_time, 
                    "extraTime": extra_time,            
                    "status": event["status"]["type"],
                    "country": country
                })
        priority -= 50  
        counter += 1
        
    # Sort matches
    matches = sorted(matches, key = lambda k: k["startTime"], reverse=False)
        
    # leagues overview
    leagues = []
    for i in league_id_list:
        if league_id_list[i]["priority"] >= 430:
            leagues.append({
                "id": i,
                "name": league_id_list[i]["name"],
                "slug": league_id_list[i]["slug"],
                "categoryName": league_id_list[i]["category_name"],
                "priority": league_id_list[i]["priority"]}
            )
    
    return create_response(
        message, 
        data={
            "matches": matches, 
            "leagues": leagues
        }
    )

@app.route("/league/<league_id>", methods=["GET"])
def league(league_id):
    message = ""
    league_id = int(league_id)
    
    # Open or create JSON file for league_id.
    api_request = api_league_standings(league_id)
    standings_json = api_request["json"]
    season = api_request["season"]
        
    json_data = standings_json["standings"][0]
    
    standings = []
    for row in json_data["rows"]:
        goals_diff = row["scoresFor"] - row["scoresAgainst"]
        if goals_diff > 0:
            goals_diff = f"+{goals_diff}"
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
            "diff": goals_diff})
    
    # sort standings  
    standings = sorted(standings, key = lambda k: k["position"], reverse=False)
    
    league = {
        "id": league_id, 
        "name": json_data["name"], 
        "type": json_data["type"], 
        "slug": league_id_list[league_id]["slug"],
        "categoryName": league_id_list[league_id]["category_name"],
        "priority": league_id_list[league_id]["priority"]
    }
    
    return create_response(
        message, 
        data={
            "league": league, 
            "standings": standings
        }
    )

@app.route("/match_details/<match_id>", methods=["GET"])
def match_details(match_id):
    message = ""
    
    # Open JSON files.
    details_json = api_match_details(match_id)
    statistics_json = api_match_statistics(match_id)
    try:
        preform_json = api_match_preform(match_id)
        lineups_json = api_match_lineups(match_id)
    except:
        preform_json = None
        lineups_json = None

    status = details_json["event"]["status"]["type"]

    """MATCH DETAILS"""
    match = {}
    if details_json != None:
        t = details_json["event"]["startTimestamp"]
        
        start_time = datetime.fromtimestamp(t)
        hour = start_time.hour
        minutes = start_time.minute
        if minutes < 10:
            minutes = "0" + str(start_time.minute)
        if hour < 10:
            hour = "0" + str(start_time.hour)

        colors = {
            "away": ImageColor.getcolor(details_json["event"]["awayTeam"]["teamColors"]["primary"], "RGB"),
            "home": ImageColor.getcolor(details_json["event"]["homeTeam"]["teamColors"]["primary"], "RGB")
        }

        if "foundationDateTimestamp" in details_json["event"]["homeTeam"]:
            home_f = details_json["event"]["homeTeam"]["foundationDateTimestamp"]
            home_dt = datetime(1970, 1, 1) + timedelta(seconds=home_f)
            home_date = f"{f'0{home_dt.day}' if home_dt.day < 10 else home_dt.day}.{f'0{home_dt.month}' if home_dt.month < 10 else home_dt.month}.{home_dt.year}"

        if "foundationDateTimestamp" in details_json["event"]["awayTeam"]:
            away_f = details_json["event"]["awayTeam"]["foundationDateTimestamp"]
            away_dt = datetime(1970, 1, 1) + timedelta(seconds=away_f)
            away_date = f"{f'0{away_dt.day}' if away_dt.day < 10 else away_dt.day}.{f'0{away_dt.month}' if away_dt.month < 10 else away_dt.month}.{away_dt.year}"

        foundations = {
            "home": home_date if "foundationDateTimestamp" in details_json["event"]["homeTeam"] else None,
            "away": away_date if "foundationDateTimestamp" in details_json["event"]["awayTeam"] else None
        }

        if f"{start_time.day}.{start_time.month}.{start_time.year}" == f"{datetime.now().day}.{datetime.now().month}.{datetime.now().year}":
            date = "today"
        else:
            day = "0" + str(start_time.day) if start_time.day < 10 else start_time.day
            month = "0" + str(start_time.month) if start_time.month < 10 else start_time.month
            year = "0" + str(start_time.year) if start_time.year < 10 else start_time.year
            date = f"{day}.{month}.{year}"

        match.update({
            "id": details_json["event"]["id"],
            "startTime": {
                "time": f"{hour}:{minutes}", 
                "date": date,
            }, 
            "round": details_json["event"]["roundInfo"]["round"],
            "place": details_json["event"]["venue"] if "venue" in details_json["event"] else None,
            "referee": {
                "name": details_json["event"]["referee"]["name"],
                "games": details_json["event"]["referee"]["games"],
                "id": details_json["event"]["referee"]["id"],
                "country": details_json["event"]["referee"]["country"]["name"],
                "cards": {
                    "yellow": details_json["event"]["referee"]["yellowCards"],
                    "red": details_json["event"]["referee"]["redCards"],
                    "yellow-red": details_json["event"]["referee"]["yellowRedCards"]
                }
            } if "referee" in details_json["event"] else None,
            "teams": {
                "home": {
                    "name": details_json["event"]["homeTeam"]["name"],
                    "manager": {
                        "name": details_json["event"]["homeTeam"]["manager"]["name"],
                        "country": details_json["event"]["homeTeam"]["manager"]["country"]["name"] if "name" in details_json["event"]["homeTeam"]["manager"]["country"] else None,
                        "id": details_json["event"]["homeTeam"]["manager"]["id"]
                    } if "manager" in details_json["event"]["homeTeam"] else None,
                    "id": details_json["event"]["homeTeam"]["id"],
                    "country": details_json["event"]["homeTeam"]["country"]["name"],
                    "foundation": foundations["home"],
                    "color": colors["home"]
                },
                "away": {
                    "name": details_json["event"]["awayTeam"]["name"],
                    "manager": {
                        "name": details_json["event"]["awayTeam"]["manager"]["name"],
                        "country": details_json["event"]["awayTeam"]["manager"]["country"]["name"] if "name" in details_json["event"]["awayTeam"]["manager"]["country"] else None,
                        "id": details_json["event"]["awayTeam"]["manager"]["id"]
                    } if "manager" in details_json["event"]["awayTeam"] else None,
                    "id": details_json["event"]["awayTeam"]["id"],
                    "country": details_json["event"]["awayTeam"]["country"]["name"],
                    "foundation": foundations["away"],
                    "color": colors["away"]
                },
            },
            "league": "",
            "status": status
        })

    """MATCH STATISTICS"""
    """
    statistics = {}
    if statistics_json != None:
        # Posession
        statistics = {"status": details_json["event"]["status"]["type"]}
        for period in statistics_json["statistics"]:
            def find_value(atr, team):
                for i in period["groups"][2]['statisticsItems']:
                    if i["name"] == atr:
                        return i[team]
                return None
            
            def convert_prc(num, base):
                if int(base) > 0:
                    return f"{int(round((int(num)/ int(base)), 2) * 100)}%"
                else:
                    return None
            
            data = {}
            for i in ["home", "away"]:
                data.update({
                    i: {
                        "possesion": period['groups'][0]['statisticsItems'][0][i],
                        "shots": {
                            "total": period["groups"][1]['statisticsItems'][0][i],
                            "on_target": period["groups"][1]['statisticsItems'][1][i],
                            "off_target": period["groups"][1]['statisticsItems'][2][i],
                            "blocked": period["groups"][1]['statisticsItems'][3][i]
                        },
                        "tvdata": {
                            "corner_kicks": find_value("Corner kicks", i),
                            "offsides": find_value("Offsides", i),
                            "fouls": find_value("Fouls", i),
                            "yellow_cards": find_value("Yellow cards", i),
                            "free_kicks": find_value("Free kicks", i),
                            "throw_ins": find_value("Throw-ins", i),
                        },
                        "passes": {
                            "total": period["groups"][4]['statisticsItems'][0][i],
                            "acurate": convert_prc(period["groups"][4]['statisticsItems'][1][i + "Value"], period["groups"][4]['statisticsItems'][0][i]),
                        },
                        "duels": {
                            "dribbles": {
                                "value": period["groups"][5]['statisticsItems'][0][i + "Value"],
                                "total": period["groups"][5]['statisticsItems'][0][i + "Total"],
                                "percentage": convert_prc(period["groups"][5]['statisticsItems'][0][i + "Value"], period["groups"][5]['statisticsItems'][0][i + "Total"])
                            },
                            "possession_lost": period["groups"][5]['statisticsItems'][1][i],
                            "duels_won": period["groups"][5]['statisticsItems'][2][i],
                        },
                        "defending": {
                            "tackles": period["groups"][6]['statisticsItems'][0][i],
                            "interceptions": period["groups"][6]['statisticsItems'][1][i],
                            "clearances": period["groups"][6]['statisticsItems'][2][i],
                        },
                    },
                })
                
            statistics.update({
                period["period"]: data
            })
    else:
        statistics.update({"status": "notstarted"})
    """
        
    """MATCH LINEUPS"""
    lineups = {}
    lineups_team = {}
    if lineups_json != None:
        for i in ["home", "away"]:
            players = []
            for j in lineups_json[i]["players"]:
                if "statistics" in j and "rating" in j["statistics"]:
                    rating = j["statistics"]["rating"]
                elif "statistics" not in j and "avgRating" in j:
                    rating = j["avgRating"]
                else: 
                    rating = None
                name = j["player"]["name"].split(" ")
                players.append({
                    "position": j["position"],
                    "name": name[-1],
                    "id": j["player"]["id"],
                    "number": j["shirtNumber"],
                    "substitute": j["substitute"],
                    "rating": rating if j["substitute"] == False else None
                })
            lineups_team.update({
                i: {
                    "players": players,
                    "formation": lineups_json[i]["formation"],
                    "player": lineups_json[i]["playerColor"],
                    "goalkeeper": lineups_json[i]["goalkeeperColor"]
                }, 
            })
        lineups.update({"confirmed": lineups_json["confirmed"], "teams": lineups_team})
    else:
        lineups = None
    
    return create_response(
        message,
        data={
            "match": match, 
            "statistics": None, #statistics, 
            "preform": preform_json,
            "lineups": lineups
        }
    )

@app.route("/countrys_ranking", methods=["GET"])
def countrys_ranking():
    message = ""
    
    # Open or create the ranking JSON file.
    json_data = api_fifa_country_ranking()

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
            "prevPoints": country["previousPoints"],   #
            "prevRanking": country["previousRanking"],  #
            "diffPoints": diff_points,   #
            "diffRanking": diff_ranking   #
        })
        
    return create_response(
        messgae,
        data={
            "countrys": countrys
        }
    )

@app.route("/countrys_ranking/<country_name>")
def country(country_name):
    file = "api/json/ranking.json"
    with open(file, 'rb') as f:
        data = f.read()
        json_data = json.loads(data)
    return create_response("")