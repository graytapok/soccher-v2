from icecream import ic
from datetime import *
import json as j
import requests
import os

def create_todays_matches_json():
    date = datetime.now()
    day, month, year = date.day, date.month, date.year
    url = f"https://footapi7.p.rapidapi.com/api/matches/{day}/{month}/{year}"
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"app/api/json/todays_matches/{day}_{month}_{year}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_match_statistics_json(match_id):
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}/statistics"
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"app/api/json/match_statistics/{match_id}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_match_detail_info_json(match_id):
    url = f"https://footapi7.p.rapidapi.com/api/match/{match_id}"
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"app/api/json/match_detail_info/{match_id}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_categories_json():
    url = "https://footapi7.p.rapidapi.com/api/tournament/categories"
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"json/api_info/categories.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_league_available_seasons_json(league_id):
    url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/seasons'
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"json/leagues_info/seasons/{league_id}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_league_standings_json(league_id, season=None):
    seasons_path = f"json/leagues_info/seasons/{league_id}.json"
    if not os.path.exists(seasons_path):
        create_league_available_seasons_json(league_id)
        os.makedirs(os.path.dirname(seasons_path), exist_ok=True)
        while not os.path.exists(seasons_path):
            continue
    with open(seasons_path, "rb") as f:
        data = f.read()
        league_json = j.loads(data)

    available_seasons = []
    cur_season = season
    for seasons in league_json["seasons"]:
        available_seasons.append(seasons["id"])
    if season is None:
        cur_season = available_seasons[0]
    elif season not in available_seasons:
        return "Error"

    url = f"https://footapi7.p.rapidapi.com/api/tournament/{league_id}/season/{cur_season}/standings/total"
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"json/leagues_info/standings/{league_id}_{season}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)

def create_league_media_json(league_id):
    url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}/media'
    headers = {
        "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
        "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers)
    path = f"json/leagues_info/media/{league_id}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as outfile:
        j.dump(response.json(), outfile)


country_list = {}
country_codes_path = "app/api/json/country_codes.json"
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
    country_list.update({"US Virgin Islands": "vl"})

league_id_list = {}
paths = {1: "app/api/json/matches.json",
         2: "app/api/json/todays_matches/2_10_2023.json",
         3: "app/api/json/todays_matches/10_10_2023.json"}
for i in paths.values(): os.makedirs(os.path.dirname(i), exist_ok=True)
with open(paths[1], "rb") as f:
    data = f.read()
    match_json = j.loads(data)
    for event in match_json["events"]:
        if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
            league_id_list.update({
                event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                "category_name": event["tournament"]["uniqueTournament"]["category"]["name"]}})
with open(paths[2], "rb") as f:
    data = f.read()
    match_json = j.loads(data)
    for event in match_json["events"]:
        if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
            league_id_list.update({
                event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                "category_name": event["tournament"]["uniqueTournament"]["category"]["name"]}})
with open(paths[3], "rb") as f:
    data = f.read()
    match_json = j.loads(data)
    for event in match_json["events"]:
        if event["tournament"]["uniqueTournament"]["id"] not in league_id_list:
            league_id_list.update({
                event["tournament"]["uniqueTournament"]["id"]: {"name": event["tournament"]["name"],
                                                                "category_name": event["tournament"]["uniqueTournament"]["category"]["name"]}})

