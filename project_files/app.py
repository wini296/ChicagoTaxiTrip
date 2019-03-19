import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import inspect

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

# Flask setup
app = Flask(__name__)

#################################################
# Database Setup
#################################################
db_endpoint=os.environ.get('DATABASE_URL', '')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL', '') or "sqlite:///data/taxi.sqlite"
db = SQLAlchemy(app)

class Metadata(db.Model):
    __tablename__ = "taxi_data"
    trip_id = db.Column(db.String, primary_key=True)
    trip_start_timestamp = db.Column(db.String)
    trip_end_timestamp = db.Column(db.String)
    fare = db.Column(db.Float)
    pickup_latitude = db.Column(db.Float)
    pickup_longitude = db.Column(db.Float)
    dropoff_latitude = db.Column(db.Float)
    dropoff_longitude = db.Column(db.Float)

#################################################
# Routes
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/api/pickupdata")
def pickupdata():
    sel = [
        Metadata.trip_id,
        Metadata.trip_start_timestamp,
        Metadata.pickup_latitude,
        Metadata.pickup_longitude,
        Metadata.fare
    ]
    results = db.session.query(*sel).all()
    all_pickups = []
    for result in results:
        pickup_dict = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    result.pickup_latitude,
                    result.pickup_longitude,
                ]
            },  
            "properties": {
                "trip_id": result.trip_id,
                "trip_start": result.trip_start_timestamp,
                "fare": result.fare
            }
        }
        all_pickups.append(pickup_dict)
    return jsonify(all_pickups)

@app.route("/api/dropoffdata")
def dropoffdata():
    sel = [
        Metadata.trip_id,
        Metadata.trip_end_timestamp,
        Metadata.dropoff_latitude,
        Metadata.dropoff_longitude,
        Metadata.fare
    ]
    results = db.session.query(*sel).all()
    all_dropoffs = []
    for result in results:
        dropoff_dict = {
            "type": "Feature", 
            "geometry": {
                "type": "Point",
                "coordinates": [
                    result.dropoff_latitude,
                    result.dropoff_longitude
                ]
            },
            "properties": {
                "trip_id": result.trip_id,
                "trip_start": result.trip_end_timestamp,
                "fare": result.fare
            }
        }
        all_dropoffs.append(dropoff_dict)
    return jsonify(all_dropoffs)    

if __name__ == "__main__":
    app.run(port=9999)
