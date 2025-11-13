from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
import os
import logging
from pathlib import Path
from typing import Dict, Any

# Import new routes and services
from services.file_storage import FileStorageService
from routes import members, attendance, payments, reports

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize file storage service
storage_service = FileStorageService(
    storage_path=os.environ.get('STORAGE_PATH', './storage')
)

# Create the main app
app = FastAPI(
    title="Conqueror Fitness Studio API",
    description="Gym Management System Backend",
    version="1.0.0"
)

# Mount static files for photo uploads
app.mount("/uploads", StaticFiles(directory="storage/uploads"), name="uploads")

# Include API routes
app.include_router(members.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Conqueror Fitness Studio API", "version": "1.0.0"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "storage_type": "local_file"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize storage and data on startup"""
    logger.info("Starting Conqueror Fitness Studio API")

    # Initialize default data if storage is empty
    await initialize_default_data(storage_service)
    logger.info("API initialization complete")

async def initialize_default_data(storage: FileStorageService):
    """Initialize storage with default data if empty"""
    # Check if members data exists
    members = await storage.read_json("members.json")

    if not members:  # Empty storage, initialize with sample data
        # Import from frontend mock data
        try:
            # Add parent directory to path to import frontend data
            import sys
            sys.path.append(str(ROOT_DIR.parent))
            from frontend.src.mock import mockMembers, planOptions

            # Save membership plans
            await storage.write_json("plans.json", planOptions)

            # Save sample members (convert to match backend format)
            backend_members = []
            for member in mockMembers:
                backend_member = {
                    "id": member["id"],
                    "name": member["name"],
                    "age": member["age"],
                    "contact": member["contact"],
                    "email": member["email"],
                    "photo": member["photo"],
                    "plan": member["plan"],
                    "joinDate": member["joinDate"],
                    "dueDate": member["dueDate"],
                    "fees": member["fees"],
                    "paymentStatus": member["paymentStatus"],
                    "lastPayment": member["lastPayment"],
                    "attendance": member["attendance"]
                }
                backend_members.append(backend_member)

            await storage.write_json("members.json", backend_members)
            await storage.write_json("attendance.json", {})

            logger.info(f"Initialized storage with {len(backend_members)} sample members")
        except ImportError as e:
            logger.warning(f"Could not import frontend data: {e}")
            # Create minimal default data
            default_plans = [
                {"name": "Basic (3 Months)", "price": 4500, "duration": 3},
                {"name": "Standard (6 Months)", "price": 9000, "duration": 6},
                {"name": "Premium (12 Months)", "price": 15000, "duration": 12}
            ]

            await storage.write_json("plans.json", default_plans)
            await storage.write_json("members.json", [])
            await storage.write_json("attendance.json", {})
            logger.info("Created minimal default data")