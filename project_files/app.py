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
db_endpoint= os.environ.get('DATABASE_URL', '')
print(db_endpoint)
app.config["SQLALCHEMY_DATABASE_URI"] = db_endpoint # os.environ.get('DATABASE_URL', '') or "sqlite:///data/taxi.sqlite"
db = SQLAlchemy(app)
# engine = create_engine(os.environ.get('DATABASE_URL','') or "sqlite:///data/taxi.sqlite")

class Metadata(db.Model):
    __tablename__ = "taxi_data"
    trip_id = db.column(db.integer, primary_key=true, autoincrement=true)
    trip_start_timestamp = db.column(db.string)
    trip_end_timestamp = db.column(db.string)
    pickup_latitude = db.column(db.float)
    pickup_longitude = db.column(db.float)
    dropoff_latitude = db.column(db.float)
    dropoff_longitude = db.column(db.float)
    fare = db.column(db.float)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/api/taxidata")
def taxidata():
    """Return a list of taxi data"""

    sel = [
        metadata.trip_id,
        metadata.trip_start_timestamp,
        metadata.trip_end_timestamp,
        metadata.pickup_latitude,
        metadata.pickup_longitude,
        metadata.dropoff_latitude,
        metadata.dropoff_longitude,
        metadata.fare
    ]

    print(sel)
    results = db.session.query(*sel).all()

    # Create a dictionary entry for each row of metadata information
    all_rides = []
    for result in results:
        taxi_dict = {}
	    taxi_dict["trip_id"] = result.trip_id
        taxi_dict["trip_start"] = result.trip_start_timestamp
        taxi_dict["trip_end"] = result.trip_end_timestamp
        taxi_dict["pickup_lat"] = result.pickup_latitude
        taxi_dict["pickup_lng"] = result.pickup_longitude
        taxi_dict["dropoff_lat"] = result.dropoff_latitude
        taxi_dict["dropoff_lng"] = result.dropoff_longitude
        taxi_dict["fare"] = result.fare
        all_rides.append(taxi_dict)

    return jsonify(all_rides)

if __name__ == "__main__":
    app.run(port=9999)
