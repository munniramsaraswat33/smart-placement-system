from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.application import Application, SavedOpportunity
from app.models.notification import Notification
from app.schemas.application import (
    ApplicationOut, ApplicationCreate, ApplicationUpdate,
    SavedOpportunityOut, SavedOpportunityCreate
)

router = APIRouter(tags=["Applications & Saved Opportunities"])

@router.get("/applications", response_model=List[ApplicationOut])
def get_applications(
    student_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    opportunity_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    
    if student_id:
        query = query.filter(Application.student_id == student_id)
    if status_filter:
        query = query.filter(Application.status == status_filter)
    if opportunity_type:
        query = query.filter(Application.opportunity_type == opportunity_type)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Application.company_name.ilike(search_pattern)) |
            (Application.role_title.ilike(search_pattern)) |
            (Application.notes.ilike(search_pattern))
        )

    return query.order_by(Application.updated_at.desc()).all()

@router.post("/applications", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    # Check if duplicate application already exists
    existing = None
    if app_in.opportunity_id:
        existing = db.query(Application).filter(
            Application.student_id == app_in.student_id,
            Application.opportunity_id == app_in.opportunity_id
        ).first()
    elif app_in.internship_id:
        existing = db.query(Application).filter(
            Application.student_id == app_in.student_id,
            Application.internship_id == app_in.internship_id
        ).first()

    if existing:
        return existing

    app_data = app_in.dict()
    if not app_data.get("applied_date"):
        app_data["applied_date"] = datetime.utcnow().strftime("%Y-%m-%d")

    application = Application(**app_data)
    db.add(application)
    
    # Create notification for new application
    notif = Notification(
        title=f"Application Submitted: {application.company_name}",
        message=f"You successfully applied for {application.role_title} at {application.company_name}.",
        notification_type="application",
        link="/applications"
    )
    db.add(notif)
    
    db.commit()
    db.refresh(application)
    return application

@router.put("/applications/{application_id}", response_model=ApplicationOut)
def update_application(application_id: int, app_in: ApplicationUpdate, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == application_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app_obj.status
    update_data = app_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(app_obj, field, val)

    # If status changed, generate notification
    if app_in.status and app_in.status != old_status:
        notif_type = "interview" if "interview" in app_in.status.lower() else "application"
        notif = Notification(
            title=f"Status Update: {app_obj.company_name}",
            message=f"Application for {app_obj.role_title} moved to '{app_in.status}'.",
            notification_type=notif_type,
            link="/applications"
        )
        db.add(notif)

    db.commit()
    db.refresh(app_obj)
    return app_obj

@router.delete("/applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == application_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app_obj)
    db.commit()
    return None

# Saved / Bookmarked Opportunities
@router.get("/saved-opportunities", response_model=List[SavedOpportunityOut])
def get_saved_opportunities(student_id: int = 1, db: Session = Depends(get_db)):
    return db.query(SavedOpportunity).filter(SavedOpportunity.student_id == student_id).all()

@router.post("/saved-opportunities", response_model=SavedOpportunityOut, status_code=status.HTTP_201_CREATED)
def toggle_save_opportunity(save_in: SavedOpportunityCreate, db: Session = Depends(get_db)):
    query = db.query(SavedOpportunity).filter(
        SavedOpportunity.student_id == save_in.student_id,
        SavedOpportunity.item_type == save_in.item_type
    )
    if save_in.opportunity_id:
        query = query.filter(SavedOpportunity.opportunity_id == save_in.opportunity_id)
    elif save_in.internship_id:
        query = query.filter(SavedOpportunity.internship_id == save_in.internship_id)

    existing = query.first()
    if existing:
        db.delete(existing)
        db.commit()
        return SavedOpportunityOut(
            id=existing.id,
            student_id=save_in.student_id,
            opportunity_id=save_in.opportunity_id,
            internship_id=save_in.internship_id,
            item_type=save_in.item_type
        )
    
    saved = SavedOpportunity(**save_in.dict())
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved
