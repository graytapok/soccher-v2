from app.api.api_requests import country_list
from icecream import ic

def dict_of_match_details(**info) -> dict: 
    country = info["country"] if "country" in info else None
    return {"id": info["match_id"],
             "home": {
                 "name": info["home"]["name"],
                 "img": (country_list[info["home"]["name"]] + ".png") if country else None,
                 "score": info["home"]["score"]
             },
             "away": {
                 "name": info["away"]['name'],
                 "img": (country_list[info["away"]['name']] + ".png") if country else None,
                 "score": info["away"]["score"]
             },
             "start_time": info["start_time"] if "start_time" in info else None,
             "current_time": info["current_time"] if "current_time" in info else None,
             "extra_time": info["extra_time"] if "extra_time" in info else None,                    
             "status": info["status"] if "status" in info else None,
             "country": info["country"]}
    
    