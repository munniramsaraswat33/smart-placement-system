from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="SET NULL"), nullable=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="SET NULL"), nullable=True)
    company_name = Column(String(150), nullable=False)
    role_title = Column(String(150), nullable=False)
    opportunity_type = Column(String(50), default="placement") # 'placement' or 'internship'
    status = Column(
        String(50), 
        default="Applied"
    ) # Applied, Under Review, Shortlisted, Assessment, Interview Scheduled, Selected, Rejected
    applied_date = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    interview_date = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    salary_or_stipend = Column(String(100), nullable=True)
    location = Column(String(150), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="applications")

class SavedOpportunity(Base):
    __tablename__ = "saved_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=True)
    item_type = Column(String(50), default="placement") # 'placement' or 'internship'
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="saved_opportunities")
