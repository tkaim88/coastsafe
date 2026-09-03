"""
Seeds the locations table with the Kenyan coastal towns curated in the
frontend's coastalLocations.js, so the backend and frontend agree on
locations from day one.

Run with: python seed.py
Safe to re-run — it skips any location that already exists by name.
"""

import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db
from app.models import Location

LOCATIONS = [
    {
        "name": "Mombasa", "region": "Mombasa County", "country": "Kenya",
        "latitude": -4.0435, "longitude": 39.6682, "water_type": "beach",
        "description": "A major coastal destination with beaches, resorts, marine activities, and a historic Old Town.",
    },
    {
        "name": "Nyali", "region": "Mombasa County", "country": "Kenya",
        "latitude": -4.0217, "longitude": 39.7206, "water_type": "beach",
        "description": "A popular coastal area north of Mombasa with beaches and a range of leisure activities.",
    },
    {
        "name": "Diani Beach", "region": "Kwale County", "country": "Kenya",
        "latitude": -4.2797, "longitude": 39.594, "water_type": "beach",
        "description": "One of Kenya's best-known beach destinations, located on the South Coast.",
    },
    {
        "name": "Watamu", "region": "Kilifi County", "country": "Kenya",
        "latitude": -3.355, "longitude": 40.0219, "water_type": "beach",
        "description": "A coastal destination known for beaches, marine life, and nearby protected areas.",
    },
    {
        "name": "Malindi", "region": "Kilifi County", "country": "Kenya",
        "latitude": -3.2192, "longitude": 40.1169, "water_type": "beach",
        "description": "A historic coastal town with beaches, marine attractions, and a strong tourism industry.",
    },
    {
        "name": "Lamu", "region": "Lamu County", "country": "Kenya",
        "latitude": -2.2717, "longitude": 40.902, "water_type": "beach",
        "description": "A historic island destination known for its Swahili architecture and surrounding coastline.",
    },
    {
        "name": "Tiwi Beach", "region": "Kwale County", "country": "Kenya",
        "latitude": -4.2333, "longitude": 39.5833, "water_type": "beach",
        "description": "A quieter beach south of Mombasa, popular for its reef-protected swimming waters.",
    },
    {
        "name": "Kilifi", "region": "Kilifi County", "country": "Kenya",
        "latitude": -3.6333, "longitude": 39.85, "water_type": "creek",
        "description": "A coastal town on Kilifi Creek known for its dramatic estuary and laid-back atmosphere.",
    },
    {
        "name": "Shanzu", "region": "Mombasa County", "country": "Kenya",
        "latitude": -3.9833, "longitude": 39.7333, "water_type": "beach",
        "description": "A resort-lined beach area just north of Nyali, popular for water sports and hotels.",
    },
    {
        "name": "Mtwapa", "region": "Kilifi County", "country": "Kenya",
        "latitude": -3.9432, "longitude": 39.7461, "water_type": "creek",
        "description": "A coastal town on Mtwapa Creek, known for its waterfront restaurants and nightlife near the beach.",
    },
    {
        "name": "Tudor", "region": "Mombasa County", "country": "Kenya",
        "latitude": -4.0511, "longitude": 39.6739, "water_type": "creek",
        "description": "A creek-side area of Mombasa Island, close to the city center and Tudor Creek waterfront.",
    },
]


def seed_locations():
    for entry in LOCATIONS:
        exists = Location.query.filter_by(name=entry["name"]).first()
        if exists:
            print(f"Skipping {entry['name']} (already exists)")
            continue
        db.session.add(Location(**entry))
        print(f"Added {entry['name']}")

    db.session.commit()
    print("Done.")


if __name__ == "__main__":
    app = create_app(os.environ.get("FLASK_ENV", "development"))
    with app.app_context():
        seed_locations()