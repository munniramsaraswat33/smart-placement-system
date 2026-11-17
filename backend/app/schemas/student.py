from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    student_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    name: str
    issuing_organization: str
    issue_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationOut(CertificationBase):
    id: int
    student_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudentSkillBrief(BaseModel):
    id: int
    skill_id: int
    name: str
    category: str
    proficiency: str
    score: float

class StudentBase(BaseModel):
    full_name: str
    college_name: str = "National Institute of Technology"
    branch: str = "Computer Science & Engineering"
    semester: int = 7
    cgpa: float = 8.65
    email: EmailStr
    phone: str = "+91 98765 43210"
    graduation_year: int = 2025
    bio: Optional[str] = None
    resume_url: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    college_name: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    graduation_year: Optional[int] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None

class StudentOut(StudentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    projects: List[ProjectOut] = []
    certifications: List[CertificationOut] = []

    class Config:
        from_attributes = True
