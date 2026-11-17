import pytest
from app.routers.students import (
    get_students, get_student, update_student,
    add_project, delete_project,
    add_certification, delete_certification
)
from app.schemas.student import StudentUpdate, ProjectCreate, CertificationCreate
from fastapi import HTTPException

def test_get_students(db):
    students = get_students(skip=0, limit=20, db=db)
    assert len(students) >= 1
    assert students[0].full_name == "Aarav Sharma"
    assert students[0].email == "aarav.sharma@nitkkr.ac.in"

def test_get_single_student(db):
    student = get_student(student_id=1, db=db)
    assert student.id == 1
    assert student.cgpa == 8.82
    assert len(student.projects) >= 1
    assert len(student.certifications) >= 1

def test_update_student(db):
    update_data = StudentUpdate(phone="+91 99999 88888", semester=8)
    updated = update_student(student_id=1, student_in=update_data, db=db)
    assert updated.phone == "+91 99999 88888"
    assert updated.semester == 8

def test_student_not_found(db):
    with pytest.raises(HTTPException) as exc_info:
        get_student(student_id=9999, db=db)
    assert exc_info.value.status_code == 404

def test_project_crud(db):
    new_proj = ProjectCreate(
        title="Test Placement AI",
        description="A machine learning test project",
        tech_stack="Python, PyTorch",
        github_url="https://github.com/test/repo"
    )
    proj = add_project(student_id=1, project_in=new_proj, db=db)
    assert proj.title == "Test Placement AI"
    assert proj.student_id == 1

    delete_project(student_id=1, project_id=proj.id, db=db)
    
    with pytest.raises(HTTPException):
        delete_project(student_id=1, project_id=proj.id, db=db)

def test_certification_crud(db):
    new_cert = CertificationCreate(
        name="Kubernetes Certified Administrator",
        issuing_organization="Linux Foundation",
        issue_date="Oct 2024"
    )
    cert = add_certification(student_id=1, cert_in=new_cert, db=db)
    assert cert.name == "Kubernetes Certified Administrator"

    delete_certification(student_id=1, cert_id=cert.id, db=db)
