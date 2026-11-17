from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    student_id: int
    opportunity_id: Optional[int] = None
    internship_id: Optional[int] = None
    company_name: str
    role_title: str
    opportunity_type: str = "placement" # 'placement' or 'internship'
    status: str = "Applied"
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    notes: Optional[str] = None
    salary_or_stipend: Optional[str] = None
    location: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    interview_date: Optional[str] = None
    notes: Optional[str] = None
    salary_or_stipend: Optional[str] = None
    location: Optional[str] = None

class ApplicationOut(ApplicationBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SavedOpportunityCreate(BaseModel):
    student_id: int
    opportunity_id: Optional[int] = None
    internship_id: Optional[int] = None
    item_type: str = "placement"

class SavedOpportunityOut(BaseModel):
    id: int
    student_id: int
    opportunity_id: Optional[int] = None
    internship_id: Optional[int] = None
    item_type: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
