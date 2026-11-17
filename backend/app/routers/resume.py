from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from app.services.resume_service import analyze_resume_content
from app.schemas.resume import ResumeAnalysisResponse

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])

@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Full Stack Engineer")
):
    if not file.filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Currently, only PDF (.pdf) or text (.txt) files are supported for analysis."
        )

    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = analyze_resume_content(
            file_bytes=content,
            filename=file.filename,
            target_role=target_role
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while parsing the resume: {str(e)}"
        )
