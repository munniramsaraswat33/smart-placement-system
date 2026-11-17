from app.services.resume_service import analyze_resume_content

def test_resume_analyzer_text_content():
    resume_text = """
    Aarav Sharma - Software Engineer
    Education: B.Tech Computer Science & Engineering, NIT
    Technical Skills: Python, React, FastAPI, Node.js, MySQL, Docker, Git, TypeScript, C++
    Projects: Developed distributed cloud analytics platform and REST APIs with Docker.
    Experience: Software Engineering Intern working on backend microservices.
    Certifications: AWS Certified Solutions Architect
    """
    file_bytes = resume_text.encode("utf-8")
    result = analyze_resume_content(
        file_bytes=file_bytes,
        filename="aarav_resume.txt",
        target_role="Full Stack Engineer"
    )
    assert result.total_words > 25
    assert result.ats_score > 60
    assert "Python" in result.detected_skills or "React" in result.detected_skills
    assert len(result.strengths) >= 1
    assert len(result.suggestions) >= 1
