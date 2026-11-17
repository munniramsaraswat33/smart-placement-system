from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics_service import get_dashboard_analytics
from app.schemas.analytics import DashboardAnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Placement Analytics"])

@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def get_analytics(student_id: int = Query(1), db: Session = Depends(get_db)):
    return get_dashboard_analytics(db, student_id=student_id)

@router.get("/applications")
def get_applications_analytics(student_id: int = Query(1), db: Session = Depends(get_db)):
    analytics = get_dashboard_analytics(db, student_id=student_id)
    return {
        "status_distribution": analytics.application_statuses,
        "monthly_trends": analytics.monthly_trends,
        "success_rate": analytics.stats.placement_success_rate,
        "total": analytics.stats.applications_submitted
    }

@router.get("/skills")
def get_skills_analytics(student_id: int = Query(1), db: Session = Depends(get_db)):
    analytics = get_dashboard_analytics(db, student_id=student_id)
    return {
        "skills_distribution": analytics.skills_distribution,
        "readiness_score": analytics.placement_readiness_score,
        "progress": analytics.placement_progress,
        "recommended": analytics.recommended_skills
    }
