from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.opportunity import Opportunity
from app.models.internship import Internship
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse

def check_placement_eligibility(db: Session, request: EligibilityCheckRequest) -> EligibilityCheckResponse:
    cgpa = request.cgpa
    branch = request.branch
    grad_year = request.graduation_year
    student_skills: List[str] = request.student_skills or []
    
    min_cgpa = request.min_cgpa or 7.0
    eligible_branches_str = request.eligible_branches or "Computer Science & Engineering, Information Technology"
    target_grad_year = request.target_graduation_year or 2025
    required_skills_str = request.required_skills or "Python, React, SQL"

    # If student_id is provided, load student profile & skills
    if request.student_id:
        student = db.query(Student).filter(Student.id == request.student_id).first()
        if student:
            cgpa = student.cgpa
            branch = student.branch
            grad_year = student.graduation_year
            student_skills = [s.skill.name for s in student.skills if s.skill]

    # If opportunity_id is provided, load opportunity details
    if request.opportunity_id:
        opp = db.query(Opportunity).filter(Opportunity.id == request.opportunity_id).first()
        if opp:
            min_cgpa = opp.min_cgpa
            eligible_branches_str = opp.eligible_branches
            target_grad_year = opp.graduation_year
            required_skills_str = opp.required_skills

    # Defaults if still None
    cgpa = cgpa if cgpa is not None else 8.5
    branch = branch if branch is not None else "Computer Science & Engineering"
    grad_year = grad_year if grad_year is not None else 2025

    explanation = []
    
    # 1. CGPA check
    cgpa_ok = float(cgpa) >= float(min_cgpa)
    if cgpa_ok:
        explanation.append(f"CGPA requirement met: Student has {cgpa:.2f} CGPA (Minimum required: {min_cgpa:.2f}).")
    else:
        explanation.append(f"CGPA below cutoff: Student has {cgpa:.2f} CGPA, but {min_cgpa:.2f} is required.")

    # 2. Branch check
    branch_lower = branch.strip().lower()
    eligible_branches_list = [b.strip().lower() for b in eligible_branches_str.split(",") if b.strip()]
    
    is_all_branches = any("all" in b for b in eligible_branches_list)
    branch_ok = is_all_branches or any(b in branch_lower or branch_lower in b for b in eligible_branches_list)
    
    if branch_ok:
        explanation.append(f"Branch eligible: '{branch}' is permitted under eligible disciplines.")
    else:
        explanation.append(f"Branch mismatch: '{branch}' is not in the list of eligible branches ({eligible_branches_str}).")

    # 3. Graduation Year check
    grad_year_ok = True
    if target_grad_year:
        grad_year_ok = int(grad_year) == int(target_grad_year)
        if grad_year_ok:
            explanation.append(f"Graduation batch matched: Batch of {grad_year}.")
        else:
            explanation.append(f"Graduation batch mismatch: Opening is for {target_grad_year} graduates, student is {grad_year}.")

    # 4. Skills match
    req_skills_list = [s.strip() for s in required_skills_str.replace(";", ",").split(",") if s.strip()]
    normalized_student_skills = {s.lower().strip() for s in student_skills}
    
    matched_skills = []
    missing_skills = []

    for req in req_skills_list:
        clean_req = req.strip()
        if any(clean_req.lower() == s or clean_req.lower() in s or s in clean_req.lower() for s in normalized_student_skills):
            matched_skills.append(clean_req)
        else:
            missing_skills.append(clean_req)

    skill_ratio = len(matched_skills) / max(len(req_skills_list), 1)
    
    if missing_skills:
        explanation.append(f"Missing recommended technical skills: {', '.join(missing_skills)}.")
    else:
        explanation.append("All primary required skills are present in the student's skill profile.")

    # Calculate overall match percentage
    weights = {"cgpa": 0.35, "branch": 0.25, "grad": 0.15, "skills": 0.25}
    score = (
        (1.0 if cgpa_ok else max(0.0, float(cgpa) / float(min_cgpa) * 0.7)) * weights["cgpa"] +
        (1.0 if branch_ok else 0.0) * weights["branch"] +
        (1.0 if grad_year_ok else 0.2) * weights["grad"] +
        skill_ratio * weights["skills"]
    )
    match_percentage = round(score * 100, 1)

    is_eligible = cgpa_ok and branch_ok and grad_year_ok

    return EligibilityCheckResponse(
        is_eligible=is_eligible,
        status="Eligible" if is_eligible else "Not Eligible",
        match_percentage=match_percentage,
        cgpa_eligible=cgpa_ok,
        branch_eligible=branch_ok,
        grad_year_eligible=grad_year_ok,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        explanation=explanation
    )
