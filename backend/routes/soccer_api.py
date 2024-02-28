from flask import Flask

from app import app
from routes.admin import admin_required
from api.api_requests import headers

def api_update_json(path, url):
    response = requests.get(url, headers=headers)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(f"Updating '{path}' ...")
    
    with open(path, 'w+') as outfile:
        j.dump(response.json(), outfile)

@app.route('/soccer_api/')
@admin_required
def update_league():
    return create_response("")