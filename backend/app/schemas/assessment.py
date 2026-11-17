from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AssessmentQuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    # correct_option and explanation are hidden during test taking

    class Config:
        from_attributes = True

class AssessmentOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    duration_minutes: int
    total_questions: int
    pass_percentage: float
    questions: List[AssessmentQuestionOut] = []

    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: str # 'A', 'B', 'C', 'D'

class AssessmentSubmission(BaseModel):
    student_id: int
    assessment_id: int
    answers: List[AnswerSubmission]

class AssessmentResultOut(BaseModel):
    id: int
    student_id: int
    assessment_id: int
    assessment_title: Optional[str] = None
    score: int
    total_score: int
    percentage: float
    passed: bool
    attempted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
