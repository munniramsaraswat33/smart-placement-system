import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
import app.models # ensure all models are registered
from app.seed_data import seed_all_data

# Import routers
from app.routers import (
    students,
    skills,
    opportunities,
    internships,
    applications,
    resume,
    eligibility,
    analytics,
    assessments,
    notifications,
    settings as settings_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed sample demo data
    db = SessionLocal()
    try:
        seed_all_data(db)
    finally:
        db.close()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Smart Placement & Career Management System REST API built with FastAPI, SQLAlchemy, and MySQL.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(students.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(opportunities.router, prefix="/api")
app.include_router(internships.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(eligibility.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(assessments.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(settings_router.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Placement & Career Management System API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": engine.url.get_backend_name(),
        "project": settings.PROJECT_NAME
    }
