from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime, timedelta
from ..models.member import Member
from ..models.common import PaymentStatus
from ..services.file_storage import FileStorageService

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/update/{member_id}")
async def update_payment_status(member_id: str, status: PaymentStatus, storage: FileStorageService = Depends()):
    """Update payment status for a member"""
    members = await storage.read_json("members.json")
    member_index = next((i for i, m in enumerate(members) if m["id"] == member_id), None)

    if member_index is None:
        raise HTTPException(status_code=404, detail="Member not found")

    members[member_index]["paymentStatus"] = status.value
    if status == PaymentStatus.PAID:
        members[member_index]["lastPayment"] = datetime.now().strftime("%Y-%m-%d")

        # Update due date based on plan
        plan_duration = {"Basic (3 Months)": 3, "Standard (6 Months)": 6, "Premium (12 Months)": 12}
        duration_months = plan_duration.get(members[member_index]["plan"], 3)
        current_due = datetime.strptime(members[member_index]["dueDate"], "%Y-%m-%d")
        new_due = current_due + timedelta(days=duration_months*30)
        members[member_index]["dueDate"] = new_due.strftime("%Y-%m-%d")

    await storage.write_json("members.json", members)
    return members[member_index]

@router.get("/overdue", response_model=List[Member])
async def get_overdue_members(storage: FileStorageService = Depends()):
    """Get all members with overdue payments"""
    members = await storage.read_json("members.json")
    today = datetime.now().strftime("%Y-%m-%d")

    overdue_members = []
    for member in members:
        if (member["paymentStatus"] == "overdue" or
            (member["paymentStatus"] == "paid" and member["dueDate"] < today)):
            overdue_members.append(member)

    return overdue_members

@router.get("/pending", response_model=List[Member])
async def get_pending_payments(storage: FileStorageService = Depends()):
    """Get members with pending payments"""
    members = await storage.read_json("members.json")

    pending_members = [
        member for member in members
        if member["paymentStatus"] == "pending"
    ]

    return pending_members

@router.get("/revenue/{month}", response_model=Dict[str, Any])
async def get_monthly_revenue(month: str, storage: FileStorageService = Depends()):
    """Get revenue summary for a specific month (format: YYYY-MM)"""
    members = await storage.read_json("members.json")

    total_revenue = 0
    new_members_revenue = 0
    renewal_revenue = 0
    new_members_count = 0

    for member in members:
        if member["lastPayment"].startswith(month):
            total_revenue += member["fees"]
            if member["joinDate"].startswith(month):
                new_members_revenue += member["fees"]
                new_members_count += 1
            else:
                renewal_revenue += member["fees"]

    return {
        "month": month,
        "total_revenue": total_revenue,
        "new_members_revenue": new_members_revenue,
        "renewal_revenue": renewal_revenue,
        "new_members_count": new_members_count,
        "total_paid_members": len([m for m in members if m["lastPayment"].startswith(month)])
    }