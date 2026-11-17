from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.assessment import Assessment, AssessmentQuestion, AssessmentResult
from app.models.notification import Notification
from app.schemas.assessment import (
    AssessmentOut, AssessmentSubmission, AssessmentResultOut
)

router = APIRouter(prefix="/assessments", tags=["Skills Assessment"])

@router.get("", response_model=List[AssessmentOut])
def get_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).all()

@router.get("/{assessment_id}", response_model=AssessmentOut)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.post("/submit", response_model=AssessmentResultOut, status_code=status.HTTP_201_CREATED)
def submit_assessment(submission: AssessmentSubmission, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == submission.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Score calculation
    correct_count = 0
    total_questions = len(assessment.questions)
    
    question_map = {q.id: q.correct_option.strip().upper() for q in assessment.questions}

    for answer in submission.answers:
        expected = question_map.get(answer.question_id)
        if expected and answer.selected_option.strip().upper() == expected:
            correct_count += 1

    percentage = round((correct_count / max(total_questions, 1)) * 100, 1)
    passed = percentage >= assessment.pass_percentage

    result = AssessmentResult(
        student_id=submission.student_id,
        assessment_id=submission.assessment_id,
        score=correct_count,
        total_score=total_questions,
        percentage=percentage,
        passed=passed
    )
    db.add(result)

    # Add notification for score
    notif = Notification(
        title=f"Assessment Completed: {assessment.title}",
        message=f"You scored {percentage}% ({correct_count}/{total_questions}) - {'PASSED' if passed else 'NEEDS PRACTICE'}.",
        notification_type="general",
        link="/skills"
    )
    db.add(notif)

    db.commit()
    db.refresh(result)

    return AssessmentResultOut(
        id=result.id,
        student_id=result.student_id,
        assessment_id=result.assessment_id,
        assessment_title=assessment.title,
        score=result.score,
        total_score=result.total_score,
        percentage=result.percentage,
        passed=result.passed,
        attempted_at=result.attempted_at
    )

@router.get("/history/{student_id}", response_model=List[AssessmentResultOut])
def get_student_assessment_history(student_id: int, db: Session = Depends(get_db)):
    results = db.query(AssessmentResult).filter(AssessmentResult.student_id == student_id).order_by(AssessmentResult.id.desc()).all()
    history = []
    for r in results:
        history.append(AssessmentResultOut(
            id=r.id,
            student_id=r.student_id,
            assessment_id=r.assessment_id,
            assessment_title=r.assessment.title if r.assessment else "Assessment",
            score=r.score,
            total_score=r.total_score,
            percentage=r.percentage,
            passed=r.passed,
            attempted_at=r.attempted_at
        ))
    return history
