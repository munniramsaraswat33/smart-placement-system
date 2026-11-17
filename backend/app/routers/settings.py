from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.seed_data import seed_all_data
from app.models.student import Student
from app.models.opportunity import Opportunity
from app.models.internship import Internship
from app.models.application import Application

router = APIRouter(prefix="/settings", tags=["System Settings"])

@router.post("/reset-demo-data", status_code=status.HTTP_200_OK)
def reset_demo_data(db: Session = Depends(get_db)):
    """Reset and re-seed the demo database with rich sample data."""
    # Drop and recreate tables safely
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_all_data(db)
    return {"message": "Demo data successfully reset and freshly seeded with full academic dataset."}

@router.get("/system-status")
def get_system_status(db: Session = Depends(get_db)):
    db_name = engine.url.database or "SQLite Database"
    db_backend = engine.url.get_backend_name()
    return {
        "status": "online",
        "database_backend": db_backend,
        "database_target": db_name,
        "students_count": db.query(Student).count(),
        "opportunities_count": db.query(Opportunity).count(),
        "internships_count": db.query(Internship).count(),
        "applications_count": db.query(Application).count()
    }
