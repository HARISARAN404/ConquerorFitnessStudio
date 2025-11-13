from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List, Optional
from ..models.member import Member, MemberCreate, MemberUpdate
from ..services.file_storage import FileStorageService
from ..utils.validators import validate_email_unique, generate_member_id
import uuid

router = APIRouter(prefix="/members", tags=["members"])

@router.get("/", response_model=List[Member])
async def get_all_members(storage: FileStorageService = Depends()):
    """Get all gym members"""
    members = await storage.read_json("members.json")
    return members

@router.get("/{member_id}", response_model=Member)
async def get_member(member_id: str, storage: FileStorageService = Depends()):
    """Get a specific member by ID"""
    members = await storage.read_json("members.json")
    member = next((m for m in members if m["id"] == member_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.post("/", response_model=Member)
async def create_member(member: MemberCreate, storage: FileStorageService = Depends()):
    """Create a new gym member"""
    members = await storage.read_json("members.json")

    # Validate email uniqueness
    if validate_email_unique(member.email, members):
        raise HTTPException(status_code=400, detail="Email already exists")

    # Generate member ID
    new_id = generate_member_id(members)

    # Create member object
    from datetime import datetime, timedelta
    join_date = datetime.now().strftime("%Y-%m-%d")
    plan_duration = {"Basic (3 Months)": 3, "Standard (6 Months)": 6, "Premium (12 Months)": 12}
    duration_months = plan_duration.get(member.plan, 3)
    due_date = (datetime.now() + timedelta(days=duration_months*30)).strftime("%Y-%m-%d")

    new_member = {
        "id": new_id,
        "name": member.name,
        "age": member.age,
        "contact": member.contact,
        "email": member.email,
        "photo": None,
        "plan": member.plan,
        "joinDate": join_date,
        "dueDate": due_date,
        "fees": member.fees,
        "paymentStatus": "paid",
        "lastPayment": join_date,
        "attendance": []
    }

    members.append(new_member)
    await storage.write_json("members.json", members)
    return new_member

@router.put("/{member_id}", response_model=Member)
async def update_member(member_id: str, member_update: MemberUpdate, storage: FileStorageService = Depends()):
    """Update member information"""
    members = await storage.read_json("members.json")
    member_index = next((i for i, m in enumerate(members) if m["id"] == member_id), None)

    if member_index is None:
        raise HTTPException(status_code=404, detail="Member not found")

    # Update member fields
    update_data = member_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "photo" and value:
            members[member_index][field] = value.url if hasattr(value, 'url') else value
        else:
            members[member_index][field] = value

    await storage.write_json("members.json", members)
    return members[member_index]

@router.delete("/{member_id}")
async def delete_member(member_id: str, storage: FileStorageService = Depends()):
    """Delete a member"""
    members = await storage.read_json("members.json")
    member_index = next((i for i, m in enumerate(members) if m["id"] == member_id), None)

    if member_index is None:
        raise HTTPException(status_code=404, detail="Member not found")

    # Delete member photo if exists
    member = members[member_index]
    if member.get("photo") and member["photo"].startswith("/uploads/"):
        filename = member["photo"].split("/")[-1]
        storage.delete_photo(filename)

    # Remove member
    members.pop(member_index)
    await storage.write_json("members.json", members)
    return {"message": "Member deleted successfully"}

@router.post("/{member_id}/photo")
async def upload_member_photo(member_id: str, file: UploadFile = File(...), storage: FileStorageService = Depends()):
    """Upload member photo"""
    members = await storage.read_json("members.json")
    member = next((m for m in members if m["id"] == member_id), None)

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Validate file type and size
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    file_data = await file.read()
    if len(file_data) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large")

    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"{member_id}_{uuid.uuid4().hex[:8]}.{file_extension}"

    # Save photo
    photo_url = await storage.save_photo(file_data, unique_filename)

    # Update member with photo URL
    member_index = next(i for i, m in enumerate(members) if m["id"] == member_id)
    members[member_index]["photo"] = photo_url
    await storage.write_json("members.json", members)

    return {"photo_url": photo_url}