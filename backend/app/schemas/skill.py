from pydantic import BaseModel
from typing import Optional

class SkillBase(BaseModel):
    name: str
    category: str = "Programming" # Programming, Database, Data Science, Web Development, Soft Skills
    is_technical: bool = True

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int

    class Config:
        from_attributes = True

class StudentSkillCreate(BaseModel):
    skill_id: Optional[int] = None
    name: Optional[str] = None
    category: Optional[str] = "Programming"
    proficiency: str = "Intermediate" # Beginner, Intermediate, Advanced
    score: float = 75.0

class StudentSkillUpdate(BaseModel):
    proficiency: Optional[str] = None
    score: Optional[float] = None

class StudentSkillOut(BaseModel):
    id: int
    student_id: int
    skill_id: int
    name: str
    category: str
    proficiency: str
    score: float

    class Config:
        from_attributes = True
