from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from datetime import datetime, timedelta
from ..models.attendance import AttendanceRecord, AttendanceUpdate, DailyAttendance
from ..services.file_storage import FileStorageService

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/date/{date}", response_model=Dict[str, bool])
async def get_attendance_by_date(date: str, storage: FileStorageService = Depends()):
    """Get attendance records for a specific date"""
    attendance_data = await storage.read_json("attendance.json")
    return attendance_data.get(date, {})

@router.post("/date/{date}", response_model=Dict[str, bool])
async def save_attendance(date: str, attendance_records: Dict[str, bool], storage: FileStorageService = Depends()):
    """Save attendance records for a specific date"""
    attendance_data = await storage.read_json("attendance.json")
    attendance_data[date] = attendance_records

    # Update member attendance records
    members = await storage.read_json("members.json")
    for member in members:
        if member["id"] in attendance_records and attendance_records[member["id"]]:
            if date not in member["attendance"]:
                member["attendance"].append(date)
        elif member["id"] in attendance_records and not attendance_records[member["id"]]:
            if date in member["attendance"]:
                member["attendance"].remove(date)

    await storage.write_json("attendance.json", attendance_data)
    await storage.write_json("members.json", members)

    return attendance_records

@router.get("/member/{member_id}", response_model=List[str])
async def get_member_attendance(member_id: str, storage: FileStorageService = Depends()):
    """Get attendance history for a specific member"""
    members = await storage.read_json("members.json")
    member = next((m for m in members if m["id"] == member_id), None)

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    return member.get("attendance", [])

@router.get("/daily/{date}", response_model=DailyAttendance)
async def get_daily_attendance_summary(date: str, storage: FileStorageService = Depends()):
    """Get daily attendance summary with present/absent lists"""
    attendance_data = await storage.read_json("attendance.json")
    members = await storage.read_json("members.json")

    day_attendance = attendance_data.get(date, {})
    present_members = [member_id for member_id, present in day_attendance.items() if present]
    absent_members = [m["id"] for m in members if m["id"] not in day_attendance]

    present_info = [
        {
            "id": member["id"],
            "name": member["name"],
            "photo": member.get("photo")
        }
        for member in members if member["id"] in present_members
    ]

    absent_info = [
        {
            "id": member["id"],
            "name": member["name"],
            "photo": member.get("photo")
        }
        for member in members if member["id"] in absent_members
    ]

    return {
        "date": date,
        "present_members": present_info,
        "absent_members": absent_info,
        "total_members": len(members),
        "present_count": len(present_members),
        "absent_count": len(absent_members)
    }

@router.get("/recent/{days}", response_model=List[DailyAttendance])
async def get_recent_attendance(days: int = 7, storage: FileStorageService = Depends()):
    """Get attendance summary for recent days"""
    attendance_data = await storage.read_json("attendance.json")
    members = await storage.read_json("members.json")

    recent_days = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        day_attendance = attendance_data.get(date, {})
        present_members = [member_id for member_id, present in day_attendance.items() if present]
        absent_members = [m["id"] for m in members if m["id"] not in day_attendance]

        present_info = [
            {
                "id": member["id"],
                "name": member["name"],
                "photo": member.get("photo")
            }
            for member in members if member["id"] in present_members
        ]

        absent_info = [
            {
                "id": member["id"],
                "name": member["name"],
                "photo": member.get("photo")
            }
            for member in members if member["id"] in absent_members
        ]

        recent_days.append({
            "date": date,
            "present_members": present_info,
            "absent_members": absent_info,
            "total_members": len(members),
            "present_count": len(present_members),
            "absent_count": len(absent_members)
        })

    return recent_days