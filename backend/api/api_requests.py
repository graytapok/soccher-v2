from app import app
from icecream import ic
from datetime import *
import json as j
import requests
import os

headers = {
    "X-RapidAPI-Key": app.config["API_KEY"], 
    "X-RapidAPI-Host": app.config["API_HOST"]
}

"""SHORTCUTS"""
def api_create_open_json(path, url, **kwargs):
    if not os.path.exists(path) or kwargs["update"] == True:
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print(f"Creating '{path}' ...")
        with open(path, 'w+') as outfile:
            j.dump(response.json(), outfile)
    with open(path, 'rb') as outfile:
        data = outfile.read()
        data_json = j.loads(data)
    return data_json

"""MATCH"""
def api_match_date(day, month, year):
    path = f"api/json/match/todays/{day}_{month}_{year}.json"
    url = f"https://footapi7.p.rapidapi.com/api/matches/{day}/{month}/{year}"
    return api_create_open_json(path, url)

def api_match_details(match_id):
    path = f"api/json/match/details/{match_id}.json"
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}"
    return api_create_open_json(path, url)
            
def api_match_statistics(match_id):
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/statistics/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/statistics"
        return api_create_open_json(path, url)
    return None

def api_match_graph(match_id): # idk
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/graph/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/graph"
        return api_create_open_json(path, url)
    return None

def api_match_streak_odd(match_id): # idk
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/streak_odd/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/streaks/odds"
        return api_create_open_json(path, url)
    return None

def api_match_preform(match_id):
    path = f"api/json/match/preform/{match_id}.json"
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/form"
    return api_create_open_json(path, url)

def api_match_highlights(match_id):
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished":
        path = f"api/json/match/highlights/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/highlights"
        return api_create_open_json(path, url)
    return None

def api_match_shotmap(match_id):
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/shotmap/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/shotmap"
        return api_create_open_json(path, url)
    return None

def api_match_best_players(match_id):
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/best_players/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/best-players"
        return api_create_open_json(path, url)
    return None

def api_match_incidents(match_id):
    details = api_match_details(match_id)
    status = details["event"]["status"]["type"]
    if status == "finished" or status == "inprogress":
        path = f"api/json/match/incidents/{match_id}.json"
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/incidents"
        return api_create_open_json(path, url)
    return None

def api_match_odd_data(match_id):
    path = f"api/json/match/odd_data/{match_id}.json"
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/odds"
    return api_create_open_json(path, url)

def api_match_lineups(match_id):
    path = f"api/json/match/lineups/{match_id}.json"
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/lineups"
    return api_create_open_json(path, url)


"""LEAGUE"""
def api_league_seasons(league_id):
    path = f"api/json/league/seasons/{league_id}.json"
    url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/seasons'
    return api_create_open_json(path, url)

def api_league_standings(league_id, season=None):
    league_json = api_league_seasons(league_id)

    available_seasons = []
    for seasons in league_json["seasons"]:
        available_seasons.append(seasons["id"])
        
    if season is None:
        season = available_seasons[0]
    elif season not in available_seasons:
        print(f"Season of {league_id} not found")
        return None
    
    path = f"api/json/league/standings/{league_id}_{season}.json"
    url = f"https://footapi7.p.rapidapi.com/api/tournament/{league_id}/season/{season}/standings/total"
    return {
        "season": season, 
        "json": api_create_open_json(path, url)
    }

def api_league_media(league_id): # idk
    path = f"api/json/league/media/{league_id}.json"
    url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/media'
    return api_create_open_json(path, url)
   
def api_league_details(league_id): # idk
    path = f"api/json/league/details/{league_id}.json"
    url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}'
    return api_create_open_json(path, url)


"""OTHERS"""
def api_fifa_country_ranking():
    path = f"api/json/rankings/fifa_country_ranking.json"
    url = "https://footapi7.p.rapidapi.com/api/rankings/fifa"
    return api_create_open_json(path, url)

def api_uefa_country_ranking():
    path = f"api/json/rankings/uefa_club_ranking.json"
    url = "https://footapi7.p.rapidapi.com/api/rankings/uefa/clubs"
    return api_create_open_json(path, url)

def api_uefa_club_ranking():
    path = f"api/json/rankings/uefa_country_ranking.json"
    url = "https://footapi7.p.rapidapi.com/api/rankings/uefa/countries"
    return api_create_open_json(path, url)
      
      
"""UPDATE"""
def api_update(type, **kwargs):
    if type == "league":
        
      
            
country_list = {}
country_codes_path = f"api/json/country_codes.json"
os.makedirs(os.path.dirname(country_codes_path), exist_ok=True)
with open(country_codes_path, "rb") as f:
    data = f.read()
    country_codes_json = j.loads(data)
    for i in country_codes_json:
        country_list.update({i["label_en"]: i['iso2_code'].lower()})
    country_list.update({
        "England": "gb-eng", 
        'Northern Ireland': "mp", 
        'Venezuela': "ve", 
        'Hong Kong': "hk",
        'Laos': "la",
        "USA": "us",
        "Iran": "ir",
        "South Korea": "kr",
        "North Korea": "kp",
        "Scotland": "gb-sct",
        "Wales": "gb-wls",
        "Russia": "ru",
        "Ivory Coast": "cl",
        'Bosnia & Herzegovina': "ba",
        "North Macedonia": "mk",
        "DR Congo": "cg",
        "Curaçao": "cr",
        "Syria": "sy",
        "Vietnam": "vn",
        "Palestine": "ps",
        "Tanzania": "tz",
        "Congo Republic": "cd",
        "Libya": "lb",
        "Faroe Islands": "fo",
        "Sudan": "sd",
        "Eswatini": "sz",
        "Chinese Taipei": "tw",
        "Tahiti": "pf",
        "Moldova": "md",
        "South Sudan": "ss",
        "Macau": "mo",
        "São Tomé and Príncipe": "st",
        "East Timor": "tl",
        "US Virgin Islands": "vi",
        "Kosovo": "xk",
        "Bonaire": "bq",
        "Saint Martin": "mf"
        })

league_id_list = {}
paths = {
    1: f"api/json/matches.json",
    2: f"api/json/match/todays/2_10_2023.json",
    3: f"api/json/match/todays/10_10_2023.json"
}
c = 1
for i in paths.values(): 
    os.makedirs(os.path.dirname(i), exist_ok=True)
    with open(paths[c], "rb") as f:
        data = f.read()
        match_json = j.loads(data)
        for event in match_json["events"]:
            if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
                league_id_list.update({
                    event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                    "slug": event["tournament"]["slug"],
                                                                    "category_name": event["tournament"]["uniqueTournament"]["category"]["name"],
                                                                    "priority": event["tournament"]["priority"]}
                })
    c += 1