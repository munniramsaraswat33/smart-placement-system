from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityOut, OpportunityCreate, OpportunityUpdate

router = APIRouter(prefix="/opportunities", tags=["Placement Opportunities"])

@router.get("", response_model=List[OpportunityOut])
def get_opportunities(
    search: Optional[str] = None,
    company: Optional[str] = None,
    min_package: Optional[float] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Opportunity.company_name.ilike(search_pattern)) |
            (Opportunity.job_role.ilike(search_pattern)) |
            (Opportunity.required_skills.ilike(search_pattern)) |
            (Opportunity.location.ilike(search_pattern))
        )
    
    if company:
        query = query.filter(Opportunity.company_name.ilike(f"%{company}%"))
    if min_package is not None:
        query = query.filter(Opportunity.package_lpa >= min_package)
    if location:
        query = query.filter(Opportunity.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Opportunity.job_type == job_type)
    if is_active is not None:
        query = query.filter(Opportunity.is_active == is_active)

    return query.order_by(Opportunity.package_lpa.desc()).all()

@router.get("/{opportunity_id}", response_model=OpportunityOut)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

@router.post("", response_model=OpportunityOut, status_code=status.HTTP_201_CREATED)
def create_opportunity(opp_in: OpportunityCreate, db: Session = Depends(get_db)):
    opp = Opportunity(**opp_in.dict())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp

@router.put("/{opportunity_id}", response_model=OpportunityOut)
def update_opportunity(opportunity_id: int, opp_in: OpportunityUpdate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    data = opp_in.dict(exclude_unset=True)
    for field, val in data.items():
        setattr(opp, field, val)

    db.commit()
    db.refresh(opp)
    return opp

@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opp)
    db.commit()
    return None
