# app.py
# Dependencies: flask, requests
# Project structure:
# ECS162/
# ├── .venv/
# ├── backend/app.py
# ├── templates/index.html  ← your frontend HTML here
# ├── static/              ← optional CSS/JS assets
# └── requirements.txt

import os
from flask import Flask, render_template
import requests

app = Flask(__name__,
            static_folder="../static",    # adjust if your static files are elsewhere
            template_folder="../templates")  # point to your HTML templates

# Your NYT API key\ nNYT_API_KEY = "NLoBQZiM2qmf6XtMkOAJSwE8MAGJ46K2"

@app.route('/')
def home():
    # Fetch NYT Top Stories API (Home section)
    endpoint = 'https://api.nytimes.com/svc/topstories/v2/home.json'
    params = {'api-key': NYT_API_KEY}
    try:
        resp = requests.get(endpoint, params=params)
        resp.raise_for_status()
        stories = resp.json().get('results', [])[:10]
    except Exception as e:
        return render_template('index.html', error=str(e), stories=[])

    # Render your frontend template, passing the stories
    return render_template('index.html', stories=stories)

if __name__ == '__main__':
    app.run(debug=True)
