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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()