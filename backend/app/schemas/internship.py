from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InternshipBase(BaseModel):
    company_name: str
    job_role: str
    job_description: str
    stipend: str
    duration: str = "6 Months"
    required_skills: str
    min_cgpa: float = 6.5
    eligible_branches: str = "All Engineering Branches"
    work_mode: str = "Hybrid" # Remote, Hybrid, On-site
    location: str = "Bangalore"
    application_deadline: str
    is_active: bool = True

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    job_description: Optional[str] = None
    stipend: Optional[str] = None
    duration: Optional[str] = None
    required_skills: Optional[str] = None
    min_cgpa: Optional[float] = None
    eligible_branches: Optional[str] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    application_deadline: Optional[str] = None
    is_active: Optional[bool] = None

class InternshipOut(InternshipBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
