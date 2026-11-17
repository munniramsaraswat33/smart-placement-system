from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: str = "general" # interview, application, deadline, opportunity, general
    is_read: bool = False
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
