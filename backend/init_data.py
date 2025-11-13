"""
Script to initialize the local storage with sample data from the frontend
Run this once to populate the backend with the existing frontend data
"""

import asyncio
import json
from pathlib import Path
import sys
import os

# Add the parent directory to the path to import from frontend
sys.path.append(str(Path(__file__).parent.parent))

from services.file_storage import FileStorageService

async def initialize_data():
    """Initialize storage with data from frontend mock.js"""
    storage = FileStorageService()

    # Import frontend mock data
    try:
        # This would need the actual import path adjusted based on your structure
        from frontend.src.mock import mockMembers, planOptions

        # Save plans
        await storage.write_json("plans.json", planOptions)
        print(f"Saved {len(planOptions)} membership plans")

        # Save members
        await storage.write_json("members.json", mockMembers)
        print(f"Saved {len(mockMembers)} members")

        # Initialize empty attendance
        await storage.write_json("attendance.json", {})
        print("Initialized empty attendance records")

        print("Data initialization complete!")

    except ImportError as e:
        print(f"Could not import frontend data: {e}")
        print("Please ensure the frontend mock data is accessible")

        # Create minimal default data
        default_plans = [
            {"name": "Basic (3 Months)", "price": 4500, "duration": 3},
            {"name": "Standard (6 Months)", "price": 9000, "duration": 6},
            {"name": "Premium (12 Months)", "price": 15000, "duration": 12}
        ]

        await storage.write_json("plans.json", default_plans)
        await storage.write_json("members.json", [])
        await storage.write_json("attendance.json", {})
        print("Created minimal default data")

if __name__ == "__main__":
    asyncio.run(initialize_data())