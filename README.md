# Smart Placement & Career Management System

A modern, full-stack, enterprise-grade web application designed for engineering college students to manage their campus placement preparation, track job eligibility, explore opportunities and internships, analyze skills, optimize resumes with ATS matching, and track multi-stage hiring pipelines.

---

## 🚀 Key Features & Highlights

- **Single-User Demo Environment**: No login or signup barriers; starts directly on the executive Career Dashboard.
- **Modern SaaS Analytics Interface**: Built with Tailwind CSS, professional Navy/Blue/White palette, collapsible sidebar, responsive layout, and Chart.js visualizations.
- **Placement Eligibility Checker**: Real-time evaluation of Student CGPA, Academic Branch, Graduation Year, and Technical Skills against company cutoffs with actionable explanations.
- **Kanban & Table Application Tracker**: Full 7-stage recruitment pipeline tracking (`Applied`, `Under Review`, `Shortlisted`, `Assessment`, `Interview Scheduled`, `Selected`, `Rejected`) with interview scheduling and notes.
- **ATS Resume Analyzer**: PDF/Text parsing with `pypdf`, extracting skills across categorized taxonomies, detecting missing keywords for specific job roles, and computing ATS compliance percentages.
- **Skills & Mock Assessment Engine**: Proficiency management with interactive MCQ technical tests (DSA & Full-Stack), timer, automated scoring, and attempt history.
- **Opportunity & Internship Management**: Rich database of 12+ placement drives and 9+ internships with complete CRUD capabilities via demo administration modals.
- **Persistent MySQL Database Integration**: SQLAlchemy ORM with resilient fallback to SQLite for instantaneous zero-setup evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript, Tailwind CSS, React Router v6, Chart.js, react-chartjs-2, Lucide React, Axios |
| **Backend** | Python 3.14 / 3.11+, FastAPI, SQLAlchemy ORM, Pydantic v2, Uvicorn, PyPDF |
| **Database** | MySQL (with PyMySQL driver) & Automatic SQLite Fallback |
| **Testing** | Pytest (17 Automated Test Cases) |

---

## 📁 Project Architecture

```
SE Project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI core application & CORS setup
│   │   ├── config.py                   # Environment settings loader
│   │   ├── database.py                 # MySQL & resilient SQLite engine
│   │   ├── seed_data.py                # Academic dataset initial seed
│   │   ├── models/                     # SQLAlchemy Models (13 tables)
│   │   │   ├── student.py              # Students, Projects, Certifications
│   │   │   ├── skill.py                # Skills, StudentSkills
│   │   │   ├── opportunity.py          # Full-time placement opportunities
│   │   │   ├── internship.py           # Internships
│   │   │   ├── application.py          # Application tracker & bookmarks
│   │   │   ├── assessment.py           # Mock tests, questions & results
│   │   │   └── notification.py         # In-app notifications
│   │   ├── schemas/                    # Pydantic validation models
│   │   ├── routers/                    # REST API endpoints (/api/...)
│   │   └── services/                   # Eligibility, Resume & Analytics logic
│   ├── tests/                          # 17 Automated Unit & Integration Tests
│   ├── requirements.txt
│   ├── schema.sql                      # Native MySQL schema definition
│   ├── .env.example
│   ├── .env
│   └── run.py                          # Backend launch runner
├── frontend/
│   ├── package.json
│   ├── vite.config.js                  # Vite dev server & proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── api/client.js               # Axios client instance
│       ├── context/                    # AppContext & NotificationContext
│       ├── components/                 # Reusable UI components
│       │   ├── common/                 # StatCard, Badge, Button, Modal, etc.
│       │   ├── layout/                 # Sidebar, Navbar, Layout
│       │   ├── opportunities/          # OpportunityCard, EligibilityModal, etc.
│       │   ├── internships/            # InternshipCard, AdminModal
│       │   ├── applications/           # KanbanBoard, ApplicationTable, DetailModal
│       │   ├── skills/                 # AddSkillModal, AssessmentModal
│       │   └── resume/                 # ResumeUploader
│       └── pages/                      # 9 Complete Core Feature Pages
└── README.md
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Python** (3.10, 3.11, 3.12, 3.13, or 3.14)
- *(Optional)* **MySQL Server 8.0+** running locally on port 3306

---

### Step 1: Configure MySQL (Optional)

The application automatically connects to MySQL if available, or gracefully uses SQLite if MySQL is not running on your machine:

1. Open MySQL Workbench or CLI and create the database:
   ```sql
   CREATE DATABASE placement_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. You can optionally import `backend/schema.sql`:
   ```bash
   mysql -u root -p placement_db < backend/schema.sql
   ```
3. Update `backend/.env` with your MySQL credentials:
   ```env
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=placement_db
   DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/placement_db
   ```

---

### Step 2: Install Backend Dependencies & Start Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd "backend"
   ```
2. Install Python requirements:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   *The backend will automatically create all tables and seed 12 placement drives, 9 internships, student profile, mock tests, and notifications.*
   - **Interactive API Swagger Docs**: `http://localhost:8000/docs`
   - **API Base URL**: `http://localhost:8000/api`

---

### Step 3: Install Frontend Dependencies & Start App

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd "frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the web application:
   ```
   http://localhost:5173
   ```

---

## 🧪 Running Automated Tests

Run the backend Pytest test suite (17 comprehensive test cases verifying Student CRUD, Skills, Opportunities, Applications lifecycle, Eligibility calculations, and Resume parsing):

```bash
cd "backend"
python -m pytest -v
```

All 17 test cases will pass with zero errors:
- `test_applications.py`: Pipeline status updates and lifecycle
- `test_eligibility.py`: High-precision match and missing skill calculations
- `test_opportunities.py`: Filter by package, CRUD operations
- `test_resume.py`: ATS scoring, skill extraction, keyword detection
- `test_skills.py`: Master skills taxonomy and student proficiency
- `test_students.py`: Profile, projects portfolio, and certifications

---

## 🖥️ System Modules Overview

1. **Career Dashboard (`/`)**:
   - 6 KPI stat cards (Registered Students, Active Drives, Internships, Applications, Interviews, Placement Success Rate).
   - Preparation progress breakdown & doughnut chart of pipeline status.
   - Recent placement openings with 1-click eligibility check and apply.
   - Upcoming interview schedule and recommended skills.

2. **Student Profile (`/profile`)**:
   - Full academic profile (CGPA, Branch, Semester, Batch, Phone, Email, Bio).
   - Full CRUD for technical projects (with GitHub and live demo links).
   - Full CRUD for verified certifications and credentials.

3. **Skills & Assessment (`/skills`)**:
   - Categorized skills matrix (Programming, Web Dev, Database, Data Science, Soft Skills) with proficiency ratings.
   - Recommended skills tailored for career roles (Full Stack, Backend, AI/ML, DevOps).
   - Interactive MCQ mock assessments with live timer, automated grading, and question explanations.

4. **Placement Opportunities (`/opportunities`)**:
   - Explore full-time drives with search and filters (Package, Location, Bookmarked).
   - Interactive **Eligibility Verification Modal** calculating candidate fit.
   - Admin post/edit opportunity modal.

5. **Internship Opportunities (`/internships`)**:
   - Browse internships with filters for Remote, Hybrid, On-site.
   - Monthly stipend details and duration tracking.

6. **Application Tracker (`/applications`)**:
   - Dual-mode **Kanban Board** & **Table View**.
   - Track applications across all 7 stages from `Applied` to `Selected`.
   - Update interview dates and preparation feedback notes.

7. **Resume Analyzer (`/resume`)**:
   - Upload PDF resumes or use the 1-click student demo sample.
   - Extracts text layers, calculates ATS compliance percentage, detects strengths, missing role keywords, and suggests concrete resume enhancements.

8. **Placement Analytics (`/analytics`)**:
   - Chart.js visual intelligence: application trajectories, stage distribution, and skill coverage.

9. **Settings (`/settings`)**:
   - System diagnostics and database connection health.
   - Notification preference switches.
   - One-click **Reset Demo Data** button with confirmation prompt.

---

## 🎓 Academic Software Engineering Highlights

- **Separation of Concerns**: Clean modular directory structure separating UI components, state contexts, API routers, ORM models, Pydantic schemas, and business services.
- **Resilient Database Layer**: Transparent failover prevents application crash if MySQL is unreachable, guaranteeing zero-friction evaluation.
- **Type Safety & Data Integrity**: Pydantic schemas enforce robust request/response validation with clear HTTP status codes.
