from pydantic import BaseModel
from typing import List, Optional

class EligibilityCheckRequest(BaseModel):
    student_id: Optional[int] = None
    opportunity_id: Optional[int] = None
    # Can also pass manual values for simulation/testing
    cgpa: Optional[float] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    student_skills: Optional[List[str]] = None
    min_cgpa: Optional[float] = None
    eligible_branches: Optional[str] = None
    target_graduation_year: Optional[int] = None
    required_skills: Optional[str] = None

class EligibilityCheckResponse(BaseModel):
    is_eligible: bool
    status: str # "Eligible" or "Not Eligible"
    match_percentage: float
    cgpa_eligible: bool
    branch_eligible: bool
    grad_year_eligible: bool
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: List[str]
