from pydantic import BaseModel
from typing import List, Dict, Any

class DashboardStats(BaseModel):
    total_students: int
    total_opportunities: int
    active_internships: int
    applications_submitted: int
    interviews_scheduled: int
    placement_success_rate: float # percentage

class ApplicationStatusCount(BaseModel):
    status: str
    count: int

class ApplicationTimeline(BaseModel):
    month: str
    count: int

class SkillDistribution(BaseModel):
    category: str
    count: int

class CompanyOpportunity(BaseModel):
    company_name: str
    package_lpa: float
    role: str

class PlacementProgress(BaseModel):
    category: str
    score: int
    max_score: int

class DashboardAnalyticsResponse(BaseModel):
    stats: DashboardStats
    application_statuses: List[ApplicationStatusCount]
    monthly_trends: List[ApplicationTimeline]
    skills_distribution: List[SkillDistribution]
    placement_readiness_score: int # e.g. 84 / 100
    placement_progress: List[PlacementProgress]
    recent_opportunities: List[Dict[str, Any]]
    upcoming_interviews: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    recommended_skills: List[Dict[str, Any]]
