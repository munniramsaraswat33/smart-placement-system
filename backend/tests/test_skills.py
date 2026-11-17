import pytest
from app.routers.skills import (
    get_master_skills, create_master_skill,
    get_student_skills, add_student_skill,
    update_student_skill, delete_student_skill
)
from app.schemas.skill import SkillCreate, StudentSkillCreate, StudentSkillUpdate

def test_get_master_skills(db):
    skills = get_master_skills(db=db)
    assert len(skills) >= 10
    names = [s.name for s in skills]
    assert "Python" in names
    assert "React.js" in names

def test_create_master_skill(db):
    new_skill = SkillCreate(name="Rust Programming", category="Programming", is_technical=True)
    res = create_master_skill(skill_in=new_skill, db=db)
    assert res.name == "Rust Programming"

def test_student_skills_flow(db):
    # Add skill to student 1
    new_student_skill = StudentSkillCreate(
        name="GraphQL",
        category="Web Development",
        proficiency="Intermediate",
        score=75.0
    )
    added = add_student_skill(student_id=1, skill_in=new_student_skill, db=db)
    assert added.name == "GraphQL"
    assert added.proficiency == "Intermediate"
    assert added.score == 75.0

    # Update skill
    updated = update_student_skill(
        student_id=1,
        skill_entry_id=added.id,
        update_in=StudentSkillUpdate(proficiency="Advanced", score=90.0),
        db=db
    )
    assert updated.proficiency == "Advanced"
    assert updated.score == 90.0

    # Delete skill
    delete_student_skill(student_id=1, skill_entry_id=added.id, db=db)
