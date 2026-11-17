import pytest
from app.routers.applications import (
    get_applications, create_application, update_application, delete_application
)
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from fastapi import HTTPException

def test_get_applications(db):
    apps = get_applications(db=db)
    assert len(apps) >= 5
    statuses = [a.status for a in apps]
    assert "Applied" in statuses or "Interview Scheduled" in statuses

def test_application_lifecycle(db):
    new_app = ApplicationCreate(
        student_id=1,
        company_name="Netflix",
        role_title="Backend Software Engineer",
        opportunity_type="placement",
        status="Applied",
        salary_or_stipend="45 LPA",
        location="Remote"
    )
    created = create_application(app_in=new_app, db=db)
    assert created.id is not None
    assert created.status == "Applied"

    # Transition status to Interview Scheduled
    updated = update_application(
        application_id=created.id,
        app_in=ApplicationUpdate(
            status="Interview Scheduled",
            interview_date="2026-12-01 at 4:00 PM IST",
            notes="Completed take-home assignment with high praise."
        ),
        db=db
    )
    assert updated.status == "Interview Scheduled"
    assert updated.interview_date == "2026-12-01 at 4:00 PM IST"
    assert "take-home assignment" in updated.notes

    # Delete application
    delete_application(application_id=created.id, db=db)
    with pytest.raises(HTTPException):
        delete_application(application_id=created.id, db=db)
