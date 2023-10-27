import requests
import json

url = "https://footapi7.p.rapidapi.com/api/rankings/fifa"

headers = {
    "X-RapidAPI-Key": "261229b62cmsh9ff85b6a1f70efep192152jsn0dd435f8eb55",
    "X-RapidAPI-Host": "footapi7.p.rapidapi.com"
}

response = requests.get(url, headers=headers)
with open('json/rankings.json', 'w') as outfile:
    json.dump(response.json(), outfile)
