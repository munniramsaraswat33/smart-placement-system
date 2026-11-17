from app.services.eligibility_service import check_placement_eligibility
from app.schemas.eligibility import EligibilityCheckRequest

def test_eligibility_checker_eligible(db):
    req = EligibilityCheckRequest(
        student_id=1,
        cgpa=8.8,
        branch="Computer Science & Engineering",
        graduation_year=2025,
        min_cgpa=7.5,
        eligible_branches="Computer Science & Engineering, Information Technology",
        target_graduation_year=2025,
        required_skills="Python, React, SQL",
        student_skills=["Python", "React.js", "MySQL", "C++"]
    )
    result = check_placement_eligibility(db, req)
    assert result.is_eligible is True
    assert result.status == "Eligible"
    assert result.cgpa_eligible is True
    assert result.branch_eligible is True
    assert result.grad_year_eligible is True
    assert len(result.matched_skills) > 0
    assert result.match_percentage >= 70.0

def test_eligibility_checker_not_eligible(db):
    req = EligibilityCheckRequest(
        cgpa=6.2, # below min_cgpa 8.0
        branch="Mechanical Engineering",
        graduation_year=2026,
        min_cgpa=8.0,
        eligible_branches="Computer Science & Engineering",
        target_graduation_year=2025,
        required_skills="Python, C++",
        student_skills=[]
    )
    result = check_placement_eligibility(db, req)
    assert result.is_eligible is False
    assert result.status == "Not Eligible"
    assert result.cgpa_eligible is False
    assert result.branch_eligible is False
    assert result.grad_year_eligible is False
    assert len(result.missing_skills) == 2
    assert len(result.explanation) >= 3
