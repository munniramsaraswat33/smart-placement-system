import io
import re
from typing import Dict, List, Any, Optional
import pypdf
from app.schemas.resume import ResumeAnalysisResponse

# Standard skills taxonomy categorized
SKILL_TAXONOMY = {
    "Programming": [
        "python", "java", "c++", "c", "c#", "javascript", "typescript", "go", "golang", 
        "rust", "ruby", "php", "kotlin", "swift", "dart", "r", "scala"
    ],
    "Web Development": [
        "react", "react.js", "next.js", "vue", "vue.js", "angular", "node.js", "express", 
        "fastapi", "django", "flask", "spring boot", "html", "html5", "css", "css3", 
        "tailwind css", "bootstrap", "rest api", "graphql", "redux"
    ],
    "Database": [
        "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite", "oracle", 
        "elasticsearch", "cassandra", "sql", "nosql", "firebase"
    ],
    "Cloud & DevOps": [
        "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "gitlab", 
        "ci/cd", "jenkins", "linux", "terraform", "nginx"
    ],
    "Data Science & AI": [
        "machine learning", "deep learning", "nlp", "pandas", "numpy", "scikit-learn", 
        "tensorflow", "pytorch", "computer vision", "data analysis", "tableau", "power bi"
    ],
    "Soft Skills": [
        "problem solving", "leadership", "communication", "teamwork", "critical thinking", 
        "agile", "scrum", "time management", "adaptability"
    ]
}

ROLE_SKILL_REQUIREMENTS = {
    "Full Stack Engineer": [
        "react", "javascript", "typescript", "node.js", "python", "fastapi", "sql", "docker", "git", "rest api"
    ],
    "Frontend Developer": [
        "react", "javascript", "typescript", "html", "css", "tailwind css", "next.js", "git", "redux"
    ],
    "Backend Developer": [
        "python", "fastapi", "java", "spring boot", "node.js", "sql", "mysql", "postgresql", "docker", "redis", "rest api"
    ],
    "Data Scientist / AI Engineer": [
        "python", "machine learning", "deep learning", "pandas", "numpy", "tensorflow", "pytorch", "sql", "data analysis"
    ],
    "DevOps / Cloud Engineer": [
        "aws", "docker", "kubernetes", "ci/cd", "linux", "git", "terraform", "python"
    ]
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from uploaded PDF bytes using pypdf."""
    text_content = []
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
    except Exception as e:
        # Fallback to plain utf-8 decode attempt if pypdf has any issue
        text_content.append(file_bytes.decode("utf-8", errors="ignore"))
    
    return "\n".join(text_content)

def analyze_resume_content(
    file_bytes: bytes, 
    filename: str, 
    target_role: Optional[str] = "Full Stack Engineer"
) -> ResumeAnalysisResponse:
    text = extract_text_from_pdf(file_bytes)
    total_words = len(re.findall(r"\b\w+\b", text))
    normalized_text = text.lower()

    # Detect skills across taxonomy
    detected_skills = []
    category_breakdown = {}

    for category, skills in SKILL_TAXONOMY.items():
        matched_in_cat = []
        for skill in skills:
            # Word boundary matching
            pattern = r"(?:\b|_)" + re.escape(skill) + r"(?:\b|_)"
            if re.search(pattern, normalized_text):
                # Capitalize nicely
                proper_name = skill.title() if len(skill) > 3 else skill.upper()
                if skill == "node.js": proper_name = "Node.js"
                elif skill == "react.js": proper_name = "React.js"
                elif skill == "next.js": proper_name = "Next.js"
                elif skill == "ci/cd": proper_name = "CI/CD"
                elif skill == "fastapi": proper_name = "FastAPI"
                elif skill == "mongodb": proper_name = "MongoDB"
                elif skill == "mysql": proper_name = "MySQL"
                elif skill == "postgresql": proper_name = "PostgreSQL"
                
                matched_in_cat.append(proper_name)
                if proper_name not in detected_skills:
                    detected_skills.append(proper_name)
        category_breakdown[category] = matched_in_cat

    # Compare against target role
    role = target_role if target_role in ROLE_SKILL_REQUIREMENTS else "Full Stack Engineer"
    required_for_role = ROLE_SKILL_REQUIREMENTS.get(role, ROLE_SKILL_REQUIREMENTS["Full Stack Engineer"])

    matched_role_skills = []
    missing_skills = []

    for req in required_for_role:
        pattern = r"(?:\b|_)" + re.escape(req) + r"(?:\b|_)"
        if re.search(pattern, normalized_text):
            proper = req.title() if len(req) > 3 else req.upper()
            matched_role_skills.append(proper)
        else:
            proper = req.title() if len(req) > 3 else req.upper()
            missing_skills.append(proper)

    # ATS & Match Score calculation
    skill_coverage = len(matched_role_skills) / max(len(required_for_role), 1)
    
    # Section header checks
    sections_found = 0
    important_sections = ["education", "experience", "project", "skill", "certification"]
    for s in important_sections:
        if s in normalized_text:
            sections_found += 1

    section_score = (sections_found / len(important_sections)) * 25
    word_count_score = 25 if 250 <= total_words <= 900 else (15 if total_words > 150 else 5)
    skill_score = skill_coverage * 50

    ats_score = int(round(section_score + word_count_score + skill_score))
    ats_score = min(max(ats_score, 35), 98)

    match_percentage = round((len(matched_role_skills) / max(len(required_for_role), 1)) * 100, 1)

    # Strengths and suggestions
    strengths = []
    suggestions = []

    if len(detected_skills) >= 6:
        strengths.append(f"Identified strong technical vocabulary with {len(detected_skills)} skills detected.")
    if sections_found >= 4:
        strengths.append("Well-structured document with standard academic & professional section headers.")
    if "project" in normalized_text:
        strengths.append("Project experience highlighted with implementation details.")

    if not strengths:
        strengths.append("Basic resume layout parsed successfully.")

    if missing_skills:
        suggestions.append(f"Add target keywords for {role}: {', '.join(missing_skills[:5])}.")
    if total_words < 250:
        suggestions.append("Resume length is brief. Expand on technical project contributions and quantifiable impact.")
    if "certification" not in normalized_text:
        suggestions.append("Include verified certifications or credentials to enhance credibility.")
    if not re.search(r"\b(improved|optimized|achieved|reduced|increased|built|developed|led)\b", normalized_text):
        suggestions.append("Use strong action verbs (e.g. 'Optimized', 'Architected', 'Reduced latency') in project descriptions.")

    if not suggestions:
        suggestions.append("Resume contains solid alignment with target engineering roles.")

    return ResumeAnalysisResponse(
        filename=filename,
        total_words=total_words,
        match_percentage=match_percentage,
        detected_skills=detected_skills,
        missing_skills=missing_skills,
        target_role=role,
        suggestions=suggestions,
        strengths=strengths,
        ats_score=ats_score,
        category_breakdown=category_breakdown
    )
