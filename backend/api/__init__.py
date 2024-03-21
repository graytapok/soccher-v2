from ..config import Config

from datetime import *
import json as j
import requests
import time
import os

headers = {
    "X-RapidAPI-Key": Config.API_KEY,
    "X-RapidAPI-Host": Config.API_HOST
}


class ApiData:
    def __init__(self, day=None, month=None, year=None, id=None, season=None, timeframe=None, update=False):
        self.day = day
        self.month = month
        self.year = year
        self.id = id
        self.season = season
        self.update = update

        self.timeframe = timeframe

    class Errors:
        class UndefinedRequestArgument(Exception):
            pass

        class IncorrectRequestType(Exception):
            pass

        class IncorrectFunctionArgument(Exception):
            pass

        class NoResponseFromApi(Exception):
            pass

    def check_missing_args(self, **kwargs):
        args = []
        for i in kwargs:
            if kwargs[i] == None:
                args.append(i)
        if len(args) == 0:
            return None
        else:
            raise self.Errors.UndefinedRequestArgument(args)

    def create_open_update(self, path, url, timeframe):
        with open("api/updates.json", "r+") as outfile:
            file = j.load(outfile)
            list_of_json_keys = path.split("/")[2:]

            def check_timestamp(arr):
                data = file
                for i in arr:
                    if i in data:
                        data = data[i]

                time_now = time.time()
                if "timestamp" in data:
                    time_from_timestamp = data["timestamp"]
                else:
                    return True

                diff = time_now - time_from_timestamp

                if self.timeframe:
                    if diff >= self.timeframe:
                        return True
                    else:
                        return False
                else:
                    if diff >= timeframe:
                        return True
                    else:
                        return False

            def make_request():
                def update_changes(arr, json):
                    data = json
                    if len(arr) > 1:
                        if arr[0] not in data:
                            data.update({arr[0]: {}})
                        data[arr[0]] = update_changes(arr[1:], data[arr[0]])
                    else:
                        data[arr[0]] = {
                            "timestamp": time.time(),
                            "url": url
                        }
                    return data

                response = requests.get(url, headers=headers)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w+') as on_path:
                    try:
                        print(f"--- Creating '{path}' ... ", end="")
                        j.dump(response.json(), on_path)
                        print("Done!")
                    except:
                        return None

                update_changes(list_of_json_keys, file)

            if not os.path.exists(path):
                make_request()
            elif check_timestamp(list_of_json_keys) or self.update:
                make_request()

            outfile.seek(0)
            j.dump(file, outfile)
            outfile.truncate()

        with open(path, 'rb') as outfile:
            try:
                data = outfile.read()
                data_json = j.loads(data)
            except:
                return None

        return data_json

    def match(self, request_type):
        match request_type:
            case "date":
                self.check_missing_args(day=self.day, month=self.month, year=self.year)

                path = f"api/json/match/todays/{self.day}_{self.month}_{self.year}.json"
                url = f"https://footapi7.p.rapidapi.com/api/matches/{self.day}/{self.month}/{self.year}"

                return self.create_open_update(path, url, 60 * 30)

            case "details":
                self.check_missing_args(id=self.id)

                path = f"api/json/match/details/{self.id}.json"
                url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}"

                return self.create_open_update(path, url, 60 * 30)

            case "statistics":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/statistics/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/statistics"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "graph":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/graph/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/graph"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "streak_odd":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/streak_odd/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/streaks/odds"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "preform":
                self.check_missing_args(id=self.id)

                path = f"api/json/match/preform/{self.id}.json"
                url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/form"

                return self.create_open_update(path, url, 60 * 30)

            case "highlights":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished":
                    path = f"api/json/match/highlights/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/highlights"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "shotmap":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/shotmap/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/shotmap"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "best_players":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/best_players/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/best-players"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "incidents":
                self.check_missing_args(id=self.id)

                details = ApiData(id=self.id).match("details")
                status = details["event"]["status"]["type"]

                if status == "finished" or status == "inprogress":
                    path = f"api/json/match/incidents/{self.id}.json"
                    url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/incidents"

                    return self.create_open_update(path, url, 60 * 30)
                else:
                    return None

            case "odd_data":
                self.check_missing_args(id=self.id)

                path = f"api/json/match/odd_data/{self.id}.json"
                url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/odds"

                return self.create_open_update(path, url, 60 * 30)

            case "lineups":
                self.check_missing_args(id=self.id)

                path = f"api/json/match/lineups/{self.id}.json"
                url = f"https://footapi7.p.rapidapi.com/api/match/{self.id}/lineups"

                return self.create_open_update(path, url, 60 * 30)

            case _:
                raise self.Errors.IncorrectRequestType(request_type)

    def league(self, request_type):
        match request_type:
            case "seasons":
                self.check_missing_args(id=self.id)

                path = f"api/json/league/seasons/{self.id}.json"
                url = f'https://footapi7.p.rapidapi.com/api/tournament/{self.id}/seasons'

                return self.create_open_update(path, url, 60 * 60 * 24 * 31 * 3)

            case "standings":
                self.check_missing_args(id=self.id)

                seasons = ApiData(id=self.id).league("seasons")

                available_seasons = []
                for seasons in seasons["seasons"]:
                    available_seasons.append(seasons["id"])

                if self.season is None:
                    self.season = available_seasons[0]
                elif self.season not in available_seasons:
                    raise self.Errors.IncorrectFunctionArgument(
                        f"season '{self.season}' for league '{self.id}' is not available")

                path = f"api/json/league/standings/{self.id}/{self.season}.json"
                url = f'https://footapi7.p.rapidapi.com/api/tournament/{self.id}/season/{self.season}/standings/total'

                return self.create_open_update(path, url, 60 * 60 * 24 * 3)

            case "media":
                self.check_missing_args(id=self.id)

                path = f"api/json/league/media/{self.id}.json"
                url = f'https://footapi7.p.rapidapi.com/api/tournament/{self.id}/media'

                return self.create_open_update(path, url, 60 * 60 * 24 * 7)

            case "deatails":
                self.check_missing_args(id=self.id)

                path = f"api/json/league/details/{league_id}.json"
                url = f'https://footapi7.p.rapidapi.com/api/tournament/{league_id}'

                return self.create_open_update(path, url, 60 * 30)

            case "leagues":
                with open("api/json/league/leagues.json", "r") as file:
                    data = j.load(file)
                return data

            case _:
                raise self.Errors.IncorrectRequestType(request_type)

    def other(self, request_type):
        match request_type:
            case "fifa":
                path = f"api/json/rankings/fifa_country_ranking.json"
                url = "https://footapi7.p.rapidapi.com/api/rankings/fifa"

                return self.create_open_update(path, url, 60 * 60 * 24)

            case "uefa_country":
                path = f"api/json/rankings/fifa_country_ranking.json"
                url = "https://footapi7.p.rapidapi.com/api/rankings/fifa"

                return self.create_open_update(path, url, 60 * 60 * 24)

            case "uefa_club":
                path = f"api/json/rankings/uefa_country_ranking.json"
                url = "https://footapi7.p.rapidapi.com/api/rankings/uefa/countries"

                return self.create_open_update(path, url, 60 * 60 * 24)

            case "country_codes":
                with open("api/json/country_codes.json", "r") as file:
                    data = j.load(file)
                return data

            case _:
                raise self.Errors.IncorrectRequestType(request_type)