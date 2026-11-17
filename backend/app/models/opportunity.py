from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False, index=True)
    job_role = Column(String(150), nullable=False, index=True)
    job_description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False) # Comma-separated or JSON string, e.g. "React, Node.js, Python, SQL"
    min_cgpa = Column(Float, default=7.0)
    eligible_branches = Column(String(255), default="Computer Science & Engineering, Information Technology, Electronics & Communication")
    graduation_year = Column(Integer, default=2025)
    package_lpa = Column(Float, nullable=False) # e.g. 14.5 LPA
    location = Column(String(150), default="Bangalore / Hybrid")
    application_deadline = Column(String(50), nullable=False)
    job_type = Column(String(50), default="Full-Time") # Full-Time, Direct Placement, FTE
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
