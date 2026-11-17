from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OpportunityBase(BaseModel):
    company_name: str
    job_role: str
    job_description: str
    required_skills: str
    min_cgpa: float = 7.0
    eligible_branches: str = "Computer Science & Engineering, Information Technology, Electronics & Communication"
    graduation_year: int = 2025
    package_lpa: float
    location: str = "Bangalore / Hybrid"
    application_deadline: str
    job_type: str = "Full-Time"
    is_active: bool = True

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    job_description: Optional[str] = None
    required_skills: Optional[str] = None
    min_cgpa: Optional[float] = None
    eligible_branches: Optional[str] = None
    graduation_year: Optional[int] = None
    package_lpa: Optional[float] = None
    location: Optional[str] = None
    application_deadline: Optional[str] = None
    job_type: Optional[str] = None
    is_active: Optional[bool] = None

class OpportunityOut(OpportunityBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
