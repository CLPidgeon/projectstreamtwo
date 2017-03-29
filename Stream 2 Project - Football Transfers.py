from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'ftdb'
COLLECTION_NAME = 'data'


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
        'transfer_direction': True, 'transfer_type': True, 'transfer_value': True
    }

    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        data = collection.find(projection=fields, limit=5000)
        return json.dumps(list(data))

if __name__ == '__main__':
    app.run(debug=True)
