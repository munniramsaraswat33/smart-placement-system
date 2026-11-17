import pytest
from app.routers.opportunities import (
    get_opportunities, get_opportunity, create_opportunity,
    update_opportunity, delete_opportunity
)
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate
from fastapi import HTTPException

def test_get_opportunities(db):
    opps = get_opportunities(db=db)
    assert len(opps) >= 10
    companies = [o.company_name for o in opps]
    assert "Google" in companies
    assert "Microsoft" in companies

def test_filter_opportunities(db):
    high_pay_opps = get_opportunities(min_package=35.0, db=db)
    assert len(high_pay_opps) > 0
    for o in high_pay_opps:
        assert o.package_lpa >= 35.0

def test_opportunity_crud(db):
    new_opp = OpportunityCreate(
        company_name="InnovateTech Inc",
        job_role="Full Stack Engineer",
        job_description="Architecting high-scale modern web platforms.",
        required_skills="Python, React, FastAPI, SQL",
        min_cgpa=7.5,
        eligible_branches="Computer Science & Engineering",
        graduation_year=2025,
        package_lpa=20.0,
        location="Bangalore",
        application_deadline="2026-12-31",
        job_type="Full-Time",
        is_active=True
    )
    created = create_opportunity(opp_in=new_opp, db=db)
    assert created.id is not None
    assert created.company_name == "InnovateTech Inc"

    # Update
    updated = update_opportunity(
        opportunity_id=created.id,
        opp_in=OpportunityUpdate(package_lpa=22.5),
        db=db
    )
    assert updated.package_lpa == 22.5

    # Delete
    delete_opportunity(opportunity_id=created.id, db=db)
    with pytest.raises(HTTPException):
        get_opportunity(opportunity_id=created.id, db=db)
