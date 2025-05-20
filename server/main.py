# API server to expose flight delay model and airport list.
# - /predict endpoint: returns delay chance for a given day and airport.
# - /airports endpoint: returns all airport names and IDs, sorted alphabetically.
# - /most_delayed_routes endpoint: returns most delayed routes with readable airport info.
# - /best_performers endpoint: returns best on-time performers with readable airport info.
# - /airline_delays endpoint: returns delay chance by airline, sorted descending.

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and airport data
delay_chance = pd.read_csv("../data/delay_chance_by_day_and_airport.csv")
airports = pd.read_csv("../data/airports.csv")
most_delayed_routes = pd.read_csv("../data/most_delayed_routes.csv")
best_performers = pd.read_csv("../data/best_performers.csv")
airline_delays = pd.read_csv("../data/airline_delays.csv")

# Helper: airport id to name mapping
airport_id_to_name = dict(zip(airports["DestAirportID"], airports["DestAirportName"]))

@app.get("/")
def root():
    return {
        "message": "Welcome to the Flight Delay Prediction API!",
        "usage": "See /docs for interactive API documentation.",
        "examples": [
            "/predict?day_of_week=1&airport_id=10140",
            "/airports",
            "/most_delayed_routes?top_n=5",
            "/airline_delays"
        ]
    }

@app.get("/airports")
def get_airports():
    airports_sorted = airports.sort_values("DestAirportName")
    return [
        {
            "airport_id": int(row.DestAirportID),
            "airport_name": row.DestAirportName
        }
        for _, row in airports_sorted.iterrows()
    ]

@app.get("/best_performers")
def get_best_performers(top_n: int = Query(10, ge=1, le=100)):
    # Sort by delay_chance and return top N cities
    performers_sorted = best_performers.sort_values("delay_chance").head(top_n).copy()
    # Add airport name if possible (DestCity to airport name mapping if available)
    # If you have a mapping from DestCity to airport name, use it here.
    # Otherwise, just return DestCity as airport_name.
    performers_sorted["airport_name"] = performers_sorted["DestCity"]
    performers_sorted["delay_chance"] = (performers_sorted["delay_chance"] * 100).round(2).astype(str) + "%"
    return performers_sorted[["airport_name", "delay_chance"]].to_dict(orient="records")

@app.get("/predict")
def predict(
    day_of_week: int = Query(..., ge=1, le=7, description="Day of week as integer (1=Monday, 7=Sunday)"),
    airport_id: int = Query(..., description="Airport ID (see /airports for valid IDs)")
):
    if airport_id not in airport_id_to_name:
        raise HTTPException(status_code=404, detail="Airport ID not found. Use /airports to see valid IDs.")
    row = delay_chance[
        (delay_chance["DayOfWeek"] == day_of_week) &
        (delay_chance["DestAirportID"] == airport_id)
    ]
    if row.empty:
        return {"delay_chance": None, "confidence_percent": 0}
    chance = float(row["delay_chance"].iloc[0])
    return {
        "delay_chance": f"{(chance * 100):.2f}%",
        "confidence_percent": 100,
        "airport_id": int(airport_id),
        "airport_name": airport_id_to_name.get(airport_id, "Unknown"),
        "day_of_week": int(day_of_week)
    }


@app.get("/most_delayed_routes")
def get_most_delayed_routes(top_n: int = Query(10, ge=1, le=100)):
    # Add readable airport names and show delay_chance as a percent string
    routes_sorted = most_delayed_routes.sort_values("delay_chance", ascending=False).head(top_n).copy()
    routes_sorted["OriginAirportName"] = routes_sorted["OriginAirportID"].map(airport_id_to_name)
    routes_sorted["DestAirportName"] = routes_sorted["DestAirportID"].map(airport_id_to_name)
    routes_sorted["delay_chance"] = (routes_sorted["delay_chance"] * 100).round(2).astype(str) + "%"
    return routes_sorted[
        [
            "OriginAirportID",
            "OriginAirportName",
            "DestAirportID",
            "DestAirportName",
            "delay_chance"
        ]
    ].to_dict(orient="records")

@app.get("/airline_delays")
def get_airline_delays():
    # Return delay chance by airline, sorted descending and formatted as percent string
    airlines_sorted = airline_delays.sort_values("delay_chance", ascending=False).copy()
    airlines_sorted["delay_chance"] = (airlines_sorted["delay_chance"] * 100).round(2).astype(str) + "%"
    return airlines_sorted.to_dict(orient="records")
