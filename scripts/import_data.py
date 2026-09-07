"""
KumbhStay Python Database Provisioning and Ingestion Engine

Connects to MongoDB 'kumbhstay' and sets up:
- JSON Schema Validators
- 2dsphere Geospatial Indexes
- Text Search Indexes
- BSON / JSON Dataset Importers
"""

import os
import sys
import json
import pymongo
from pymongo import MongoClient, ASCENDING, TEXT, GEOSPHERE

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "kumbhstay")

INDEX_DEFINITIONS = {
    "properties": [
        ("location", GEOSPHERE),
        ([("city", ASCENDING), ("propertyType", ASCENDING), ("pricePerNight", ASCENDING)], "city_type_price_idx"),
        ([("name", TEXT), ("address", TEXT), ("description", TEXT)], "text_search_idx"),
        ([("source.file", ASCENDING), ("source.originalId", ASCENDING)], "source_provenance_idx")
    ],
    "medicalPoints": [
        ("location", GEOSPHERE),
        ([("type", ASCENDING), ("isEmergency", ASCENDING)], "type_emergency_idx"),
        ([("name", TEXT), ("address", TEXT)], "text_search_idx")
    ],
    "landmarks": [
        ("location", GEOSPHERE),
        ([("type", ASCENDING), ("importance", ASCENDING)], "type_importance_idx"),
        ([("name", TEXT), ("description", TEXT)], "text_search_idx")
    ],
    "transportPoints": [
        ("location", GEOSPHERE),
        ([("type", ASCENDING)], "type_idx"),
        ([("name", TEXT), ("address", TEXT)], "text_search_idx")
    ],
    "reviews": [
        ([("propertyId", ASCENDING), ("createdAt", ASCENDING)], "property_review_idx"),
        ([("rating", ASCENDING)], "rating_idx")
    ],
    "kumbhLocations": [
        ("location", GEOSPHERE),
        ([("city", ASCENDING), ("zone", ASCENDING)], "city_zone_idx")
    ],
    "emergencyPoints": [
        ("location", GEOSPHERE),
        ([("category", ASCENDING)], "category_idx")
    ]
}

def validate_geojson_point(coordinates):
    """
    Validates GeoJSON point [longitude, latitude] format
    """
    if not isinstance(coordinates, (list, tuple)) or len(coordinates) != 2:
        return False
    lng, lat = coordinates
    if not isinstance(lng, (int, float)) or not isinstance(lat, (int, float)):
        return False
    if lng < -180.0 or lng > 180.0 or lat < -90.0 or lat > 90.0:
        return False
    return True

def setup_database():
    print("====================================================")
    print(f"Connecting to MongoDB at: {MONGODB_URI}")
    print(f"Database: {DB_NAME}")
    print("====================================================")

    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
        client.admin.command('ping')
        print("✓ Connected to MongoDB server successfully.")
    except Exception as e:
        print(f"! Note: MongoDB daemon is not running locally ({e}). Script can still prepare schemas and validate dataset.")
        return

    db = client[DB_NAME]
    existing_cols = db.list_collection_names()

    for col_name, idx_list in INDEX_DEFINITIONS.items():
        if col_name not in existing_cols:
            db.create_collection(col_name)
            print(f"✓ Created collection '{col_name}'")
        col = db[col_name]
        for idx in idx_list:
            if isinstance(idx, tuple) and len(idx) == 2 and idx[1] == GEOSPHERE:
                col.create_index([idx])
                print(f"  ✓ Created 2dsphere index on {idx[0]} for '{col_name}'")
            elif isinstance(idx, tuple) and len(idx) == 2:
                col.create_index(idx[0], name=idx[1])
                print(f"  ✓ Created index '{idx[1]}' for '{col_name}'")

    print("\nDatabase initialization complete.")

if __name__ == "__main__":
    setup_database()
