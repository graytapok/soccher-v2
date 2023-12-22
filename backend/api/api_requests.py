from app import app
from icecream import ic
from datetime import *
import json as j
import requests
import os

headers = {"X-RapidAPI-Key": app.config["API_KEY"], "X-RapidAPI-Host": app.config["API_HOST"]}

api_folder = "api/json"

def create_date_matches_json(day, month, year):
    path = f"{api_folder}/todays_matches/{day}_{month}_{year}.json"
    if not os.path.exists(path):
        url = f"https://footapi7.p.rapidapi.com/api/matches/{day}/{month}/{year}"
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print(f"Creating '{path}' ...")
        with open(path, 'w+') as outfile:
            j.dump(response.json(), outfile)

def create_match_statistics_json(match_id):
    path = f"{api_folder}/match_statistics/{match_id}.json"
    if not os.path.exists(path):
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/statistics"
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print(f"Creating '{path}' ...")
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)

def create_match_detail_info_json(match_id):
    path = f"{api_folder}/match_detail_info/{match_id}.json"
    if not os.path.exists(path):
        url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}"
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)

def create_categories_json():
    path = f"json/api_info/categories.json"
    if not os.path.exists(path):
        url = "https://footapi7.p.rapidapi.com/api/tournament/categories"
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)

def create_league_available_seasons_json(league_id):
    path = f"{api_folder}/leagues_info/seasons/{league_id}.json"
    if not os.path.exists(path):
        url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/seasons'
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)

def create_league_standings_json(league_id, season=None):
    seasons_path = f"{api_folder}/leagues_info/seasons/{league_id}.json"
    if not os.path.exists(seasons_path):
        create_league_available_seasons_json(league_id)
        while not os.path.exists(seasons_path):
            continue
    os.makedirs(os.path.dirname(seasons_path), exist_ok=True)
    with open(seasons_path, "rb") as f:
        data = f.read()
        league_json = j.loads(data)

    available_seasons = []
    for seasons in league_json["seasons"]:
        available_seasons.append(seasons["id"])
        
    if season is None:
        season = available_seasons[0]
    elif season not in available_seasons:
        return f"Season of {league_id} not found"
    
    league_standings_file = f"{api_folder}/leagues_info/standings/{league_id}_{season}.json"
    if not os.path.exists(league_standings_file):
        url = f"https://footapi7.p.rapidapi.com/api/tournament/{league_id}/season/{season}/standings/total"
        response = requests.get(url, headers=headers)
        path = f"{api_folder}/leagues_info/standings/{league_id}_{season}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)

        message = f"Created '{path}' ..."
        ic(message)
    return season

def create_league_media_json(league_id):
    path = f"{api_folder}/leagues_info/media/{league_id}.json"
    if not os.path.exists(path):
        url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/media'
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)
   
def create_league_details_json(league_id):
    path = f"{api_folder}/leagues_info/details/{league_id}.json"
    if not os.path.exists(path):
        url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}'
        response = requests.get(url, headers=headers)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as outfile:
            j.dump(response.json(), outfile)  
        message = f"Created '{path}' ..."
        ic(message)

country_list = {}
country_codes_path = f"{api_folder}/country_codes.json"
os.makedirs(os.path.dirname(country_codes_path), exist_ok=True)
with open(country_codes_path, "rb") as f:
    data = f.read()
    country_codes_json = j.loads(data)
    for i in country_codes_json:
        country_list.update({i["label_en"]: i['iso2_code'].lower()})
    country_list.update({"England": "gb-eng"})
    country_list.update({'Northern Ireland': "mp"})
    country_list.update({'Venezuela': "ve"})
    country_list.update({'Hong Kong': "hk"})
    country_list.update({'Laos': "la"})
    country_list.update({"USA": "us"})
    country_list.update({"Iran": "ir"})
    country_list.update({"South Korea": "kr"})
    country_list.update({"North Korea": "kp"})
    country_list.update({"Scotland": "gb-sct"})
    country_list.update({"Wales": "gb-wls"})
    country_list.update({"Russia": "ru"})
    country_list.update({"Ivory Coast": "cl"})
    country_list.update({'Bosnia & Herzegovina': "ba"})
    country_list.update({"North Macedonia": "mk"})
    country_list.update({"DR Congo": "cg"})
    country_list.update({"Curaçao": "cr"})
    country_list.update({"Syria": "sy"})
    country_list.update({"Vietnam": "vn"})
    country_list.update({"Palestine": "ps"})
    country_list.update({"Congo Republic": "cd"})
    country_list.update({"Tanzania": "tz"})
    country_list.update({"Libya": "lb"})
    country_list.update({"Faroe Islands": "fo"})
    country_list.update({"Sudan": "sd"})
    country_list.update({"Eswatini": "sz"})
    country_list.update({"Chinese Taipei": "tw"})
    country_list.update({"Tahiti": "pf"})
    country_list.update({"Moldova": "md"})
    country_list.update({"South Sudan": "ss"})
    country_list.update({"Macau": "mo"})
    country_list.update({"São Tomé and Príncipe": "st"})
    country_list.update({"East Timor": "tl"})
    country_list.update({"US Virgin Islands": "vi"})
    country_list.update({"Kosovo": "xk"})
    country_list.update({"Bonaire": "bq"})
    country_list.update({"Saint Martin": "mf"})

league_id_list = {}
paths = {
    1: f"{api_folder}/matches.json",
    2: f"{api_folder}/todays_matches/2_10_2023.json",
    3: f"{api_folder}/todays_matches/10_10_2023.json"
}
for i in paths.values(): os.makedirs(os.path.dirname(i), exist_ok=True)
with open(paths[1], "rb") as f:
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
with open(paths[2], "rb") as f:
    data = f.read()
    match_json = j.loads(data)
    for event in match_json["events"]:
        if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
            league_id_list.update({
                event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                "category_name": event["tournament"]["uniqueTournament"]["category"]["name"],
                                                                "priority": event["tournament"]["priority"]}
            })
with open(paths[3], "rb") as f:
    data = f.read()
    match_json = j.loads(data)
    for event in match_json["events"]:
        if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
            league_id_list.update({
                event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                "category_name": event["tournament"]["uniqueTournament"]["category"]["name"],
                                                                "priority": event["tournament"]["priority"]}
            })

