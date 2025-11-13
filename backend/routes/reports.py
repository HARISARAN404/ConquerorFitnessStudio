from fastapi import APIRouter, Depends, Query
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from ..services.file_storage import FileStorageService
from ..services.statistics import StatisticsService

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard_stats(storage: FileStorageService = Depends()):
    """Get dashboard statistics"""
    stats_service = StatisticsService(storage)
    return await stats_service.get_dashboard_stats()

@router.get("/monthly/{year}/{month}", response_model=Dict[str, Any])
async def get_monthly_report(year: int, month: int, storage: FileStorageService = Depends()):
    """Get comprehensive monthly report"""
    stats_service = StatisticsService(storage)
    return await stats_service.get_monthly_report(year, month)

@router.get("/attendance/{year}/{month}")
async def get_attendance_report(year: int, month: int, storage: FileStorageService = Depends()):
    """Get attendance report for a specific month"""
    stats_service = StatisticsService(storage)
    return await stats_service.get_attendance_report(year, month)

@router.get("/export/members")
async def export_members_data(format: str = Query("json", regex="^(json|csv)$"), storage: FileStorageService = Depends()):
    """Export members data in JSON or CSV format"""
    members = await storage.read_json("members.json")

    if format == "csv":
        import csv
        import io

        output = io.StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow([
            "ID", "Name", "Age", "Contact", "Email", "Plan",
            "Join Date", "Due Date", "Fees", "Payment Status",
            "Last Payment", "Attendance Count"
        ])

        # Write data
        for member in members:
            writer.writerow([
                member["id"],
                member["name"],
                member["age"],
                member["contact"],
                member["email"],
                member["plan"],
                member["joinDate"],
                member["dueDate"],
                member["fees"],
                member["paymentStatus"],
                member["lastPayment"],
                len(member.get("attendance", []))
            ])

        output.seek(0)
        return {
            "filename": f"members_export_{datetime.now().strftime('%Y%m%d')}.csv",
            "content": output.getvalue()
        }

    return {
        "filename": f"members_export_{datetime.now().strftime('%Y%m%d')}.json",
        "content": members
    }