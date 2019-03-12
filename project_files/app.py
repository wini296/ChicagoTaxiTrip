import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import inspect

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

# Flask setup
app = Flask(__name__)

#################################################
# Database Setup
#################################################
db_endpoint=os.environ.get('DATABASE_URL', '')
print(db_endpoint)
app.config["SQLALCHEMY_DATABASE_URI"] = db_endpoint # os.environ.get('DATABASE_URL', '') or "sqlite:///data/taxi.sqlite"
db = SQLAlchemy(app)
# engine = create_engine(os.environ.get('DATABASE_URL','') or "sqlite:///data/taxi.sqlite")

class Metadata(db.Model):
    __tablename__ = "taxi_data"
    TRIP_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TRIP_START_TIMESTAMP = db.Column(db.String)
    TRIP_END_TIMESTAMP = db.Column(db.String)
    PICKUP_LATITUDE = db.Column(db.Float)
    PICKUP_LONGITUDE = db.Column(db.Float)
    DROPOFF_LATITUDE = db.Column(db.Float)
    DROPOFF_LONGITUDE = db.Column(db.Float)
    FARE = db.Column(db.Float)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/api/taxidata")
def taxidata():
    """Return a list of taxi data"""

    sel = [
        Metadata.TRIP_ID,
        Metadata.TRIP_START_TIMESTAMP,
        Metadata.TRIP_END_TIMESTAMP,
        Metadata.PICKUP_LATITUDE,
        Metadata.PICKUP_LONGITUDE,
        Metadata.DROPOFF_LATITUDE,
        Metadata.DROPOFF_LONGITUDE,
        Metadata.FARE
    ]

    results = db.session.query(*sel).all()

    # Create a dictionary entry for each row of metadata information
    all_rides = []
    for result in results:
        taxi_dict = {}
        taxi_dict["trip_id"] = result.TRIP_ID
        taxi_dict["trip_start"] = result.TRIP_START_TIMESTAMP
        taxi_dict["trip_end"] = result.TRIP_END_TIMESTAMP
        taxi_dict["pickup_lat"] = result.PICKUP_LATITUDE
        taxi_dict["pickup_lng"] = result.PICKUP_LONGITUDE
        taxi_dict["dropoff_lat"] = result.DROPOFF_LATITUDE
        taxi_dict["dropoff_lng"] = result.DROPOFF_LONGITUDE
        taxi_dict["fare"] = result.FARE
        all_rides.append(taxi_dict)

    return jsonify(all_rides)

if __name__ == "__main__":
    app.run()
