from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.internship import Internship
from app.schemas.internship import InternshipOut, InternshipCreate, InternshipUpdate

router = APIRouter(prefix="/internships", tags=["Internship Opportunities"])

@router.get("", response_model=List[InternshipOut])
def get_internships(
    search: Optional[str] = None,
    work_mode: Optional[str] = None,
    location: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Internship)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Internship.company_name.ilike(search_pattern)) |
            (Internship.job_role.ilike(search_pattern)) |
            (Internship.required_skills.ilike(search_pattern)) |
            (Internship.location.ilike(search_pattern))
        )
    
    if work_mode:
        query = query.filter(Internship.work_mode.ilike(f"%{work_mode}%"))
    if location:
        query = query.filter(Internship.location.ilike(f"%{location}%"))
    if is_active is not None:
        query = query.filter(Internship.is_active == is_active)

    return query.order_by(Internship.id.desc()).all()

@router.get("/{internship_id}", response_model=InternshipOut)
def get_internship(internship_id: int, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

@router.post("", response_model=InternshipOut, status_code=status.HTTP_201_CREATED)
def create_internship(internship_in: InternshipCreate, db: Session = Depends(get_db)):
    internship = Internship(**internship_in.dict())
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

@router.put("/{internship_id}", response_model=InternshipOut)
def update_internship(internship_id: int, internship_in: InternshipUpdate, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    data = internship_in.dict(exclude_unset=True)
    for field, val in data.items():
        setattr(internship, field, val)

    db.commit()
    db.refresh(internship)
    return internship

@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    db.delete(internship)
    db.commit()
    return None
