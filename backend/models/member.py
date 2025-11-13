from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import date
from .common import PaymentStatus, PhotoInfo

class MemberCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=18, le=100)
    contact: str = Field(..., min_length=10, max_length=20)
    email: EmailStr
    plan: str = Field(..., min_length=3, max_length=50)
    fees: int = Field(..., ge=0)

class MemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    age: Optional[int] = Field(None, ge=18, le=100)
    contact: Optional[str] = Field(None, min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    plan: Optional[str] = Field(None, min_length=3, max_length=50)
    fees: Optional[int] = Field(None, ge=0)
    photo: Optional[PhotoInfo] = None

class Member(BaseModel):
    id: str
    name: str
    age: int
    contact: str
    email: str
    photo: Optional[str] = None  # URL to photo
    plan: str
    joinDate: str  # YYYY-MM-DD format
    dueDate: str   # YYYY-MM-DD format
    fees: int
    paymentStatus: PaymentStatus
    lastPayment: str  # YYYY-MM-DD format
    attendance: List[str]  # List of dates attended