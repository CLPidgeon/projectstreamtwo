import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'footballtransfers')
COLLECTION_NAME = 'project'


@app.route('/')
def about():
    return render_template('about.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/trends')
def trends():
    return render_template('trends.html')


@app.route('/ftdb/data')
def transfer_data():
    fields = {
        '_id': False, 'season': True, 'league_position': True, 'club': True, 'player_name': True,
        'transfer_direction': True, 'transfer_type': True, 'transfer_value': True, 'net_transfer': True
    }

    with MongoClient(MONGO_URI) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        project = collection.find(projection=fields, limit=3000)
        return json.dumps(list(project))

if __name__ == '__main__':
    app.run(debug=True)
