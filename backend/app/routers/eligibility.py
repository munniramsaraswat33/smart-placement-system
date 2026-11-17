from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.eligibility_service import check_placement_eligibility
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse

router = APIRouter(prefix="/eligibility", tags=["Placement Eligibility Checker"])

@router.post("/check", response_model=EligibilityCheckResponse)
def check_eligibility(
    request: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    return check_placement_eligibility(db, request)
