from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class PaymentStatus(str, Enum):
    PAID = "paid"
    OVERDUE = "overdue"
    PENDING = "pending"

class MembershipPlan(BaseModel):
    name: str
    price: int
    duration: int  # months

class PhotoInfo(BaseModel):
    filename: str
    url: str
    size: Optional[int] = None
    upload_date: Optional[datetime] = None