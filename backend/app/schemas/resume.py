from pydantic import BaseModel
from typing import List, Optional

class ResumeAnalysisResponse(BaseModel):
    filename: str
    total_words: int
    match_percentage: float
    detected_skills: List[str]
    missing_skills: List[str]
    target_role: Optional[str] = "Full Stack Engineer"
    suggestions: List[str]
    strengths: List[str]
    ats_score: int
    category_breakdown: dict
