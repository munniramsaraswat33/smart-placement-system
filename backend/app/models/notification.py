from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="general") # interview, application, deadline, opportunity, general
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True) # Optional route link like "/applications", "/opportunities"
    created_at = Column(DateTime, default=datetime.utcnow)
