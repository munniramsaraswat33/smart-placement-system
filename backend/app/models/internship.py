from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False, index=True)
    job_role = Column(String(150), nullable=False, index=True)
    job_description = Column(Text, nullable=False)
    stipend = Column(String(100), nullable=False) # e.g. "₹45,000 / month"
    duration = Column(String(50), default="6 Months")
    required_skills = Column(Text, nullable=False)
    min_cgpa = Column(Float, default=6.5)
    eligible_branches = Column(String(255), default="All Engineering Branches")
    work_mode = Column(String(50), default="Hybrid") # Remote, Hybrid, On-site
    location = Column(String(150), default="Bangalore")
    application_deadline = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
