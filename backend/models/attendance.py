from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import date

class AttendanceRecord(BaseModel):
    date: str  # YYYY-MM-DD
    records: Dict[str, bool]  # member_id: present/absent

class AttendanceUpdate(BaseModel):
    member_id: str
    present: bool

class DailyAttendance(BaseModel):
    date: str
    present_members: List[str]
    absent_members: List[str]
    total_members: int
    present_count: int
    absent_count: int