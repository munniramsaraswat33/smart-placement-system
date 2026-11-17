from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.skill import Skill, StudentSkill
from app.models.student import Student
from app.schemas.skill import (
    SkillOut, SkillCreate,
    StudentSkillCreate, StudentSkillUpdate, StudentSkillOut
)

router = APIRouter(tags=["Skills"])

# Master Skills catalog
@router.get("/skills", response_model=List[SkillOut])
def get_master_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@router.post("/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_master_skill(skill_in: SkillCreate, db: Session = Depends(get_db)):
    existing = db.query(Skill).filter(Skill.name.ilike(skill_in.name)).first()
    if existing:
        return existing
    skill = Skill(**skill_in.dict())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/skills/{skill_id}", response_model=SkillOut)
def update_master_skill(skill_id: int, skill_in: SkillCreate, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.name = skill_in.name
    skill.category = skill_in.category
    skill.is_technical = skill_in.is_technical
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_master_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return None

# Student Skills
@router.get("/students/{student_id}/skills", response_model=List[StudentSkillOut])
def get_student_skills(student_id: int, db: Session = Depends(get_db)):
    student_skills = db.query(StudentSkill).filter(StudentSkill.student_id == student_id).all()
    results = []
    for ss in student_skills:
        results.append(StudentSkillOut(
            id=ss.id,
            student_id=ss.student_id,
            skill_id=ss.skill_id,
            name=ss.skill.name if ss.skill else "Unknown",
            category=ss.skill.category if ss.skill else "General",
            proficiency=ss.proficiency,
            score=ss.score
        ))
    return results

@router.post("/students/{student_id}/skills", response_model=StudentSkillOut, status_code=status.HTTP_201_CREATED)
def add_student_skill(student_id: int, skill_in: StudentSkillCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    skill_obj = None
    if skill_in.skill_id:
        skill_obj = db.query(Skill).filter(Skill.id == skill_in.skill_id).first()
    elif skill_in.name:
        skill_obj = db.query(Skill).filter(Skill.name.ilike(skill_in.name.strip())).first()
        if not skill_obj:
            skill_obj = Skill(
                name=skill_in.name.strip(), 
                category=skill_in.category or "Programming", 
                is_technical=True
            )
            db.add(skill_obj)
            db.commit()
            db.refresh(skill_obj)
    
    if not skill_obj:
        raise HTTPException(status_code=400, detail="Skill name or valid skill_id required")

    # Check if student already has this skill
    existing_ss = db.query(StudentSkill).filter(
        StudentSkill.student_id == student_id,
        StudentSkill.skill_id == skill_obj.id
    ).first()

    if existing_ss:
        existing_ss.proficiency = skill_in.proficiency
        existing_ss.score = skill_in.score
        db.commit()
        db.refresh(existing_ss)
        return StudentSkillOut(
            id=existing_ss.id,
            student_id=existing_ss.student_id,
            skill_id=existing_ss.skill_id,
            name=skill_obj.name,
            category=skill_obj.category,
            proficiency=existing_ss.proficiency,
            score=existing_ss.score
        )

    ss = StudentSkill(
        student_id=student_id,
        skill_id=skill_obj.id,
        proficiency=skill_in.proficiency,
        score=skill_in.score
    )
    db.add(ss)
    db.commit()
    db.refresh(ss)

    return StudentSkillOut(
        id=ss.id,
        student_id=ss.student_id,
        skill_id=ss.skill_id,
        name=skill_obj.name,
        category=skill_obj.category,
        proficiency=ss.proficiency,
        score=ss.score
    )

@router.put("/students/{student_id}/skills/{skill_entry_id}", response_model=StudentSkillOut)
def update_student_skill(
    student_id: int, 
    skill_entry_id: int, 
    update_in: StudentSkillUpdate, 
    db: Session = Depends(get_db)
):
    ss = db.query(StudentSkill).filter(
        StudentSkill.id == skill_entry_id, 
        StudentSkill.student_id == student_id
    ).first()
    if not ss:
        raise HTTPException(status_code=404, detail="Student skill not found")
    
    if update_in.proficiency is not None:
        ss.proficiency = update_in.proficiency
    if update_in.score is not None:
        ss.score = update_in.score
        
    db.commit()
    db.refresh(ss)

    return StudentSkillOut(
        id=ss.id,
        student_id=ss.student_id,
        skill_id=ss.skill_id,
        name=ss.skill.name if ss.skill else "Skill",
        category=ss.skill.category if ss.skill else "General",
        proficiency=ss.proficiency,
        score=ss.score
    )

@router.delete("/students/{student_id}/skills/{skill_entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_skill(student_id: int, skill_entry_id: int, db: Session = Depends(get_db)):
    ss = db.query(StudentSkill).filter(
        StudentSkill.id == skill_entry_id, 
        StudentSkill.student_id == student_id
    ).first()
    if not ss:
        raise HTTPException(status_code=404, detail="Student skill not found")
    db.delete(ss)
    db.commit()
    return None
