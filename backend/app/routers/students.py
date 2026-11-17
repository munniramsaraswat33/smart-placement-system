from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.student import Student, Project, Certification
from app.schemas.student import (
    StudentOut, StudentCreate, StudentUpdate,
    ProjectCreate, ProjectOut,
    CertificationCreate, CertificationOut
)

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("", response_model=List[StudentOut])
def get_students(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(student_in: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this email already exists")
    student = Student(**student_in.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}", response_model=StudentOut)
def update_student(student_id: int, student_in: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return None

# Student Projects
@router.post("/{student_id}/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def add_project(student_id: int, project_in: ProjectCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    project = Project(student_id=student_id, **project_in.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{student_id}/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(student_id: int, project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None

# Student Certifications
@router.post("/{student_id}/certifications", response_model=CertificationOut, status_code=status.HTTP_201_CREATED)
def add_certification(student_id: int, cert_in: CertificationCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    cert = Certification(student_id=student_id, **cert_in.dict())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

@router.delete("/{student_id}/certifications/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(student_id: int, cert_id: int, db: Session = Depends(get_db)):
    cert = db.query(Certification).filter(Certification.id == cert_id, Certification.student_id == student_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(cert)
    db.commit()
    return None
