from flask import Flask, jsonify
from app import app

@app.route("/")
@app.route("/index")
def index():
    return jsonify({"time": "19:29"})