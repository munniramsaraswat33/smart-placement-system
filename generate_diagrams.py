import os
os.environ["MPLCONFIGDIR"] = os.path.join(os.path.expanduser("~"), "AppData", "Local", "Temp", "mpl_cache")

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

OUTPUT_DIR = "report_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Helper function to save figure
def save_fig(fig, filename):
    filepath = os.path.join(OUTPUT_DIR, filename)
    fig.savefig(filepath, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print(f"Generated {filepath}")

# 1. System Block Diagram
def generate_fig1_block_diagram():
    fig, ax = plt.subplots(figsize=(11, 7))
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.96, "Figure 1: 5-Tier System Architecture Block Diagram", 
            fontsize=13, fontweight='bold', ha='center', color='#102a43')

    # Layers
    tiers = [
        ("Tier 1: Presentation Layer\n(React 18 + Vite + Tailwind CSS)", 
         ["Responsive Dashboard UI", "Kanban & Table Views", "Chart.js Visualizations", "Profile & Portfolio Forms"],
         "#eff6ff", "#2563eb", 0.76),
        ("Tier 2: API Gateway & Routing Layer\n(FastAPI ASGI Router + CORS Middleware)",
         ["REST Endpoints (/api/...)", "Request Validation (Pydantic)", "Exception Handlers", "CORS Middleware"],
         "#f0fdf4", "#16a34a", 0.54),
        ("Tier 3: Business Logic & Analytics Engines\n(Core Services Layer)",
         ["Placement Eligibility Checker", "ATS Resume Parsing Engine", "Real-time Analytics Service", "Assessment Evaluation Engine"],
         "#fefce8", "#ca8a04", 0.32),
        ("Tier 4: Object-Relational Mapping (ORM) Layer\n(SQLAlchemy 2.0 ORM Engine)",
         ["Declarative Base Mapping", "Connection Pool (QueuePool)", "SessionLocal Transaction Manager", "Failover Database Selector"],
         "#faf5ff", "#9333ea", 0.10),
    ]

    for title, components, bg_color, border_color, y_pos in tiers:
        # Tier box
        rect = patches.FancyBboxPatch((0.05, y_pos), 0.90, 0.17, 
                                     boxstyle="round,pad=0.02,rounding_size=0.03", 
                                     ec=border_color, fc=bg_color, lw=2)
        ax.add_patch(rect)
        ax.text(0.08, y_pos + 0.13, title, fontsize=10, fontweight='bold', color='#0f172a', va='center')

        # Inner component boxes
        for i, comp in enumerate(components):
            cx = 0.08 + i * 0.21
            comp_rect = patches.FancyBboxPatch((cx, y_pos + 0.02), 0.19, 0.08,
                                             boxstyle="round,pad=0.01,rounding_size=0.02",
                                             ec=border_color, fc='white', lw=1.2)
            ax.add_patch(comp_rect)
            ax.text(cx + 0.095, y_pos + 0.06, comp, fontsize=7.5, ha='center', va='center', color='#1e293b', wrap=True)

        # Down arrow
        if y_pos > 0.15:
            ax.annotate('', xy=(0.5, y_pos - 0.04), xytext=(0.5, y_pos),
                        arrowprops=dict(arrowstyle="->", color='#334155', lw=2, mutation_scale=15))

    # Bottom Database & Storage Tier (Tier 5)
    db_rect = patches.FancyBboxPatch((0.2, -0.08), 0.60, 0.12, 
                                     boxstyle="round,pad=0.02,rounding_size=0.03", 
                                     ec='#dc2626', fc='#fff1f2', lw=2)
    ax.add_patch(db_rect)
    ax.text(0.5, -0.02, "Tier 5: Persistent Storage Layer\nMySQL 8.0 Engine (Primary) | SQLite Engine (Resilient Zero-Setup Fallback)", 
            fontsize=9.5, fontweight='bold', color='#991b1b', ha='center', va='center')
    ax.annotate('', xy=(0.5, -0.08 + 0.12), xytext=(0.5, 0.10),
                arrowprops=dict(arrowstyle="<->", color='#dc2626', lw=2, mutation_scale=15))

    ax.set_ylim(-0.12, 1.0)
    save_fig(fig, "fig1_block_diagram.png")

# 2. Use Case Diagram
def generate_fig2_use_case_diagram():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 2: UML Use Case Diagram", fontsize=13, fontweight='bold', ha='center', color='#102a43')

    # System boundary box
    sys_rect = patches.FancyBboxPatch((0.25, 0.05), 0.50, 0.88, boxstyle="round,pad=0.02,rounding_size=0.02",
                                      ec='#2563eb', fc='#f8fafc', lw=2, linestyle='--')
    ax.add_patch(sys_rect)
    ax.text(0.5, 0.90, "Smart Placement & Career Management System", fontsize=10.5, fontweight='bold', color='#1e40af', ha='center')

    # Actor: Student
    ax.text(0.10, 0.55, "[ACTOR]\nStudent User\n(College Candidate)", fontsize=10, ha='center', va='center', fontweight='bold', color='#0f172a')
    # Actor: Placement Admin / Recruiter
    ax.text(0.90, 0.55, "[ACTOR]\nPlacement Admin\n/ Recruiter", fontsize=10, ha='center', va='center', fontweight='bold', color='#0f172a')

    # Use Cases
    use_cases = [
        ("UC-1: View Dashboard & Key Placement Metrics", 0.82),
        ("UC-2: Manage Student Profile, Projects & Certs", 0.72),
        ("UC-3: Browse Placement Drives & Internships", 0.62),
        ("UC-4: Verify Eligibility Against Company Criteria", 0.52),
        ("UC-5: Submit Job Application & Track Pipeline", 0.42),
        ("UC-6: Upload & Analyze Resume ATS Score", 0.32),
        ("UC-7: Take Technical MCQ Mock Assessments", 0.22),
        ("UC-8: Manage Drives & Post New Openings (Admin)", 0.12),
    ]

    for uc_text, y in use_cases:
        uc_patch = patches.Ellipse((0.5, y), 0.42, 0.07, ec='#2563eb', fc='#ffffff', lw=1.5)
        ax.add_patch(uc_patch)
        ax.text(0.5, y, uc_text, fontsize=8, ha='center', va='center', color='#1e293b', fontweight='medium')

        # Connect to Student
        if "Admin" not in uc_text:
            ax.plot([0.16, 0.29], [0.55, y], color='#64748b', lw=1.2)
        # Connect to Admin
        if "UC-3" in uc_text or "UC-5" in uc_text or "UC-8" in uc_text or "UC-1" in uc_text:
            ax.plot([0.71, 0.84], [y, 0.55], color='#64748b', lw=1.2, linestyle=':')

    ax.set_xlim(0, 1)
    ax.set_ylim(0.02, 1.0)
    save_fig(fig, "fig2_use_case_diagram.png")

# 3. UML Class Diagram
def generate_fig3_class_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')
    ax.text(0.5, 0.98, "Figure 3: UML Class Diagram (Domain Model & Entities)", fontsize=13, fontweight='bold', ha='center', color='#102a43')

    classes = [
        ("Student", ["+ id: int [PK]", "+ full_name: str", "+ college_name: str", "+ branch: str", "+ semester: int", "+ cgpa: float", "+ email: str", "+ phone: str", "+ graduation_year: int"], 0.05, 0.52, 0.26, 0.40),
        ("Project", ["+ id: int [PK]", "+ student_id: int [FK]", "+ title: str", "+ description: text", "+ tech_stack: str", "+ github_url: str", "+ live_url: str"], 0.37, 0.70, 0.26, 0.24),
        ("Certification", ["+ id: int [PK]", "+ student_id: int [FK]", "+ name: str", "+ issuing_organization: str", "+ issue_date: str", "+ credential_id: str"], 0.69, 0.70, 0.26, 0.24),
        ("Opportunity", ["+ id: int [PK]", "+ company_name: str", "+ job_role: str", "+ required_skills: str", "+ min_cgpa: float", "+ eligible_branches: str", "+ package_lpa: float", "+ location: str"], 0.05, 0.05, 0.26, 0.38),
        ("Application", ["+ id: int [PK]", "+ student_id: int [FK]", "+ opportunity_id: int [FK]", "+ company_name: str", "+ role_title: str", "+ status: str", "+ applied_date: str", "+ interview_date: str"], 0.37, 0.24, 0.26, 0.36),
        ("Assessment", ["+ id: int [PK]", "+ title: str", "+ category: str", "+ duration_minutes: int", "+ total_questions: int", "+ pass_percentage: float"], 0.69, 0.36, 0.26, 0.26),
        ("AssessmentResult", ["+ id: int [PK]", "+ student_id: int [FK]", "+ assessment_id: int [FK]", "+ score: int", "+ percentage: float", "+ passed: bool"], 0.69, 0.05, 0.26, 0.24)
    ]

    for name, attrs, x, y, w, h in classes:
        # Outer box
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0", ec='#1e3a8a', fc='#ffffff', lw=1.5)
        ax.add_patch(rect)
        # Header banner
        hdr = patches.Rectangle((x, y + h - 0.06), w, 0.06, ec='#1e3a8a', fc='#1e40af', lw=1.5)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.035, f"«Entity»\n{name}", fontsize=8.5, fontweight='bold', color='white', ha='center', va='center')
        
        # Attribute text
        attr_text = "\n".join(attrs)
        ax.text(x + 0.015, y + h - 0.08, attr_text, fontsize=7.5, color='#1e293b', va='top', fontfamily='monospace')

    # Association lines
    ax.annotate('', xy=(0.37, 0.82), xytext=(0.31, 0.82), arrowprops=dict(arrowstyle="<-", color='#1e40af', lw=1.5))
    ax.text(0.33, 0.84, "1..*", fontsize=7, color='#1e40af')

    ax.annotate('', xy=(0.69, 0.82), xytext=(0.63, 0.82), arrowprops=dict(arrowstyle="<-", color='#1e40af', lw=1.5))
    ax.text(0.65, 0.84, "1..*", fontsize=7, color='#1e40af')

    ax.annotate('', xy=(0.37, 0.42), xytext=(0.31, 0.60), arrowprops=dict(arrowstyle="<-", color='#1e40af', lw=1.5))
    ax.text(0.33, 0.52, "1..*", fontsize=7, color='#1e40af')

    ax.annotate('', xy=(0.37, 0.30), xytext=(0.31, 0.20), arrowprops=dict(arrowstyle="<-", color='#1e40af', lw=1.5))
    ax.text(0.33, 0.24, "0..1", fontsize=7, color='#1e40af')

    ax.annotate('', xy=(0.69, 0.17), xytext=(0.69, 0.36), arrowprops=dict(arrowstyle="<-", color='#1e40af', lw=1.5))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.02)
    save_fig(fig, "fig3_class_diagram.png")

# 4. Activity Diagram: Eligibility
def generate_fig4_activity_eligibility():
    fig, ax = plt.subplots(figsize=(8, 9))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 4: UML Activity Diagram - Placement Eligibility Verification", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    nodes = [
        ("Start: Click 'Check Eligibility'", 0.88, 'circle'),
        ("Fetch Student Profile & Verified Skills", 0.80, 'rect'),
        ("Fetch Opportunity Criteria (CGPA, Branch, Year, Skills)", 0.70, 'rect'),
        ("Is CGPA >= Min Required CGPA?", 0.58, 'diamond'),
        ("Is Academic Branch Eligible?", 0.44, 'diamond'),
        ("Calculate Technical Skill Overlap & Missing Items", 0.32, 'rect'),
        ("Compute Overall Fit Score & Output Decision", 0.20, 'rect'),
        ("Display Decision Modal with Full Breakdown", 0.10, 'rect'),
        ("End Activity", 0.02, 'circle_end'),
    ]

    for text, y, shape in nodes:
        if shape == 'circle':
            c = plt.Circle((0.5, y), 0.025, color='#1e293b')
            ax.add_patch(c)
        elif shape == 'circle_end':
            c1 = plt.Circle((0.5, y), 0.025, color='#1e293b', fill=False, lw=2)
            c2 = plt.Circle((0.5, y), 0.015, color='#1e293b')
            ax.add_patch(c1)
            ax.add_patch(c2)
        elif shape == 'diamond':
            poly = patches.Polygon([[0.5, y+0.04], [0.72, y], [0.5, y-0.04], [0.28, y]], 
                                   closed=True, ec='#ea580c', fc='#fff7ed', lw=1.5)
            ax.add_patch(poly)
            ax.text(0.5, y, text, fontsize=7.5, ha='center', va='center', fontweight='bold', color='#9a3412')
        else:
            rect = patches.FancyBboxPatch((0.22, y - 0.03), 0.56, 0.06, 
                                         boxstyle="round,pad=0.01,rounding_size=0.02",
                                         ec='#2563eb', fc='#eff6ff', lw=1.5)
            ax.add_patch(rect)
            ax.text(0.5, y, text, fontsize=8, ha='center', va='center', color='#1e3a8a', fontweight='medium')

    # Flow arrows
    y_coords = [0.88, 0.80, 0.70, 0.58, 0.44, 0.32, 0.20, 0.10, 0.02]
    for i in range(len(y_coords) - 1):
        ax.annotate('', xy=(0.5, y_coords[i+1] + 0.035), xytext=(0.5, y_coords[i] - 0.035),
                    arrowprops=dict(arrowstyle="->", color='#334155', lw=1.5, mutation_scale=12))

    # Decision branches text
    ax.text(0.52, 0.52, "[Yes]", fontsize=7.5, color='#16a34a', fontweight='bold')
    ax.text(0.52, 0.39, "[Yes]", fontsize=7.5, color='#16a34a', fontweight='bold')
    ax.text(0.74, 0.58, "[No: Flag Cutoff]", fontsize=7, color='#dc2626')
    ax.text(0.74, 0.44, "[No: Flag Branch]", fontsize=7, color='#dc2626')

    ax.set_ylim(-0.02, 1.0)
    save_fig(fig, "fig4_activity_eligibility.png")

# 5. Activity Diagram: Resume ATS
def generate_fig5_activity_resume():
    fig, ax = plt.subplots(figsize=(8, 8.5))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 5: UML Activity Diagram - Resume ATS Keyword Analyzer", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    steps = [
        ("Start: Candidate uploads PDF Resume", 0.88, 'circle'),
        ("Receive Document Stream at /api/resume/analyze", 0.79, 'rect'),
        ("Extract Raw Text Layers using PyPDF Engine", 0.69, 'rect'),
        ("Normalize Text & Match against Skill Taxonomy", 0.59, 'rect'),
        ("Compare Extracted Keywords vs Target Role Taxonomy", 0.47, 'rect'),
        ("Compute ATS Score: Word Count + Sections + Keywords", 0.35, 'rect'),
        ("Synthesize Missing Skills & Actionable Feedback", 0.23, 'rect'),
        ("Return Structured JSON Response & Display Scorecards", 0.12, 'rect'),
        ("End Activity", 0.03, 'circle_end'),
    ]

    for text, y, shape in steps:
        if shape == 'circle':
            ax.add_patch(plt.Circle((0.5, y), 0.025, color='#1e293b'))
        elif shape == 'circle_end':
            ax.add_patch(plt.Circle((0.5, y), 0.025, color='#1e293b', fill=False, lw=2))
            ax.add_patch(plt.Circle((0.5, y), 0.015, color='#1e293b'))
        else:
            rect = patches.FancyBboxPatch((0.20, y - 0.035), 0.60, 0.065, 
                                         boxstyle="round,pad=0.01,rounding_size=0.02",
                                         ec='#4f46e5', fc='#eef2ff', lw=1.5)
            ax.add_patch(rect)
            ax.text(0.5, y, text, fontsize=8, ha='center', va='center', color='#312e81', fontweight='medium')

    y_pts = [s[1] for s in steps]
    for i in range(len(y_pts) - 1):
        ax.annotate('', xy=(0.5, y_pts[i+1] + 0.035), xytext=(0.5, y_pts[i] - 0.035),
                    arrowprops=dict(arrowstyle="->", color='#334155', lw=1.5, mutation_scale=12))

    ax.set_ylim(-0.01, 1.0)
    save_fig(fig, "fig5_activity_resume.png")

# 6. Sequence Diagram: Application Flow
def generate_fig6_sequence_application():
    fig, ax = plt.subplots(figsize=(10, 7.5))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 6: UML Sequence Diagram - Application Submission & Pipeline Gate", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    lifelines = [
        ("Student UI\n(React)", 0.12),
        ("API Router\n(FastAPI)", 0.38),
        ("Eligibility Engine\n(Service)", 0.64),
        ("Database Layer\n(MySQL/SQLite)", 0.88),
    ]

    for label, x in lifelines:
        # Header box
        hdr = patches.FancyBboxPatch((x - 0.09, 0.84), 0.18, 0.08, boxstyle="round,pad=0.01", ec='#2563eb', fc='#eff6ff', lw=1.5)
        ax.add_patch(hdr)
        ax.text(x, 0.88, label, fontsize=8.5, ha='center', va='center', fontweight='bold', color='#1e3a8a')
        # Vertical lifeline
        ax.plot([x, x], [0.10, 0.84], color='#94a3b8', linestyle='--', lw=1.2)

    messages = [
        (0.12, 0.38, 0.77, "1. POST /api/applications", '#2563eb', False),
        (0.38, 0.64, 0.68, "2. Verify Candidate Status & Drive State", '#2563eb', False),
        (0.64, 0.88, 0.59, "3. Query Existing Applications & Profile", '#2563eb', False),
        (0.88, 0.64, 0.50, "4. Return Student & Opportunity Records", '#64748b', True),
        (0.64, 0.38, 0.41, "5. Eligibility Validated & Verified", '#64748b', True),
        (0.38, 0.88, 0.32, "6. INSERT Application (status='Applied')", '#2563eb', False),
        (0.38, 0.88, 0.23, "7. INSERT Notification Alert", '#2563eb', False),
        (0.88, 0.38, 0.16, "8. Commit Transaction & Return Record", '#64748b', True),
        (0.38, 0.12, 0.10, "9. Return 201 Created & Trigger UI Toast", '#16a34a', True),
    ]

    for x1, x2, y, msg, color, is_dash in messages:
        ls = '--' if is_dash else '-'
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=color, lw=1.5, linestyle=ls, mutation_scale=12))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.015, msg, fontsize=7.5, ha='center', va='bottom', color='#0f172a', fontweight='medium')

    ax.set_ylim(0.05, 1.0)
    save_fig(fig, "fig6_sequence_application.png")

# 7. Sequence Diagram: Resume Parsing Flow
def generate_fig7_sequence_resume():
    fig, ax = plt.subplots(figsize=(10, 7.5))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 7: UML Sequence Diagram - Resume Upload & ATS Parsing Workflow", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    lifelines = [
        ("Browser Client\n(Resume View)", 0.12),
        ("Upload Router\n(/api/resume/analyze)", 0.38),
        ("PDF Extraction\n(PyPDF Engine)", 0.64),
        ("Taxonomy Engine\n(Keyword Matcher)", 0.88),
    ]

    for label, x in lifelines:
        hdr = patches.FancyBboxPatch((x - 0.09, 0.84), 0.18, 0.08, boxstyle="round,pad=0.01", ec='#4f46e5', fc='#eef2ff', lw=1.5)
        ax.add_patch(hdr)
        ax.text(x, 0.88, label, fontsize=8.5, ha='center', va='center', fontweight='bold', color='#312e81')
        ax.plot([x, x], [0.10, 0.84], color='#94a3b8', linestyle='--', lw=1.2)

    messages = [
        (0.12, 0.38, 0.76, "1. POST multipart/form-data (PDF file + target_role)", '#4f46e5', False),
        (0.38, 0.64, 0.66, "2. Stream Byte Buffer to extract_text_from_pdf()", '#4f46e5', False),
        (0.64, 0.64, 0.58, "3. Iterate PdfReader.pages & extract text", '#4f46e5', False),
        (0.64, 0.38, 0.50, "4. Return Sanitized Normalized Text String", '#64748b', True),
        (0.38, 0.88, 0.42, "5. match_skills(text, SKILL_TAXONOMY, target_role)", '#4f46e5', False),
        (0.88, 0.88, 0.33, "6. Detect overlaps, compute ATS Score & missing skills", '#4f46e5', False),
        (0.88, 0.38, 0.24, "7. Return ResumeAnalysisResponse Schema", '#64748b', True),
        (0.38, 0.12, 0.14, "8. 200 OK: Display ATS Gauge & Keyword Breakdown", '#16a34a', True),
    ]

    for x1, x2, y, msg, color, is_dash in messages:
        ls = '--' if is_dash else '-'
        if x1 == x2:
            # Self call
            ax.plot([x1, x1 + 0.06, x1 + 0.06, x1], [y + 0.02, y + 0.02, y - 0.02, y - 0.02], color=color, lw=1.5)
            ax.annotate('', xy=(x1, y - 0.02), xytext=(x1 + 0.01, y - 0.02),
                        arrowprops=dict(arrowstyle="->", color=color, lw=1.5, mutation_scale=12))
            ax.text(x1 + 0.07, y, msg, fontsize=7.5, va='center', color='#0f172a', fontweight='medium')
        else:
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", color=color, lw=1.5, linestyle=ls, mutation_scale=12))
            mid_x = (x1 + x2) / 2
            ax.text(mid_x, y + 0.015, msg, fontsize=7.5, ha='center', va='bottom', color='#0f172a', fontweight='medium')

    ax.set_ylim(0.08, 1.0)
    save_fig(fig, "fig7_sequence_resume.png")

# 8. DFD Level 0 (Context Diagram)
def generate_fig8_dfd_level0():
    fig, ax = plt.subplots(figsize=(9, 6.5))
    ax.axis('off')
    ax.text(0.5, 0.95, "Figure 8: Data Flow Diagram (DFD) Level 0 - Context Diagram", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    # Central System Bubble
    sys_circle = plt.Circle((0.5, 0.5), 0.18, color='#eff6ff', ec='#2563eb', lw=2.5)
    ax.add_patch(sys_circle)
    ax.text(0.5, 0.5, "0.0\nSmart Placement\n& Career\nManagement System", fontsize=10, fontweight='bold', ha='center', va='center', color='#1e3a8a')

    # Entities
    # Entity: Student
    e1 = patches.Rectangle((0.05, 0.40), 0.18, 0.20, ec='#0f172a', fc='#ffffff', lw=2)
    ax.add_patch(e1)
    ax.text(0.14, 0.50, "College Student\n(Candidate)", fontsize=9, fontweight='bold', ha='center', va='center', color='#0f172a')

    # Entity: Recruiter / Admin
    e2 = patches.Rectangle((0.77, 0.40), 0.18, 0.20, ec='#0f172a', fc='#ffffff', lw=2)
    ax.add_patch(e2)
    ax.text(0.86, 0.50, "Recruiter /\nT&P Admin", fontsize=9, fontweight='bold', ha='center', va='center', color='#0f172a')

    # Flow arrows: Student to System
    ax.annotate('', xy=(0.32, 0.55), xytext=(0.23, 0.55), arrowprops=dict(arrowstyle="->", color='#2563eb', lw=1.5, mutation_scale=12))
    ax.text(0.275, 0.57, "Profile, Resumes,\nApplications", fontsize=7, ha='center', color='#1e40af')

    # Flow arrows: System to Student
    ax.annotate('', xy=(0.23, 0.45), xytext=(0.32, 0.45), arrowprops=dict(arrowstyle="->", color='#16a34a', lw=1.5, mutation_scale=12))
    ax.text(0.275, 0.39, "Drive Matches, ATS Scores,\nInterview Alerts", fontsize=7, ha='center', color='#166534')

    # Flow arrows: Admin to System
    ax.annotate('', xy=(0.68, 0.55), xytext=(0.77, 0.55), arrowprops=dict(arrowstyle="->", color='#2563eb', lw=1.5, mutation_scale=12))
    ax.text(0.725, 0.57, "Job Criteria,\nDrive Postings", fontsize=7, ha='center', color='#1e40af')

    # Flow arrows: System to Admin
    ax.annotate('', xy=(0.77, 0.45), xytext=(0.68, 0.45), arrowprops=dict(arrowstyle="->", color='#16a34a', lw=1.5, mutation_scale=12))
    ax.text(0.725, 0.39, "Applicant Pipeline,\nAnalytics Reports", fontsize=7, ha='center', color='#166534')

    ax.set_xlim(0, 1)
    ax.set_ylim(0.2, 1.0)
    save_fig(fig, "fig8_dfd_level0.png")

# 9. DFD Level 1 (Decomposition)
def generate_fig9_dfd_level1():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 9: Data Flow Diagram (DFD) Level 1 - Detailed Process Decomposition", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    processes = [
        ("1.0 Profile & Skill\nManagement", 0.20, 0.78),
        ("2.0 Opportunity &\nInternship Engine", 0.70, 0.78),
        ("3.0 Eligibility Checking\n& Verification", 0.20, 0.45),
        ("4.0 Application Tracking\n& Kanban Pipeline", 0.70, 0.45),
        ("5.0 Resume ATS\nKeyword Analyzer", 0.20, 0.15),
        ("6.0 Placement Analytics\n& Reporting", 0.70, 0.15),
    ]

    for label, x, y in processes:
        circ = plt.Circle((x, y), 0.11, color='#eff6ff', ec='#1d4ed8', lw=2)
        ax.add_patch(circ)
        ax.text(x, y, label, fontsize=8, fontweight='bold', ha='center', va='center', color='#1e3a8a')

    # Data Store: Database
    ds = patches.FancyBboxPatch((0.40, 0.32), 0.20, 0.26, boxstyle="round,pad=0.01", ec='#dc2626', fc='#fff1f2', lw=2)
    ax.add_patch(ds)
    ax.text(0.50, 0.45, "D1: Central Database\n(Students, Drives,\nApplications, Skills)", fontsize=8, fontweight='bold', ha='center', va='center', color='#991b1b')

    # Connect processes to D1
    ax.annotate('', xy=(0.40, 0.50), xytext=(0.31, 0.72), arrowprops=dict(arrowstyle="<->", color='#64748b', lw=1.2))
    ax.annotate('', xy=(0.60, 0.50), xytext=(0.69, 0.72), arrowprops=dict(arrowstyle="<->", color='#64748b', lw=1.2))
    ax.annotate('', xy=(0.40, 0.45), xytext=(0.31, 0.45), arrowprops=dict(arrowstyle="<->", color='#64748b', lw=1.2))
    ax.annotate('', xy=(0.60, 0.45), xytext=(0.69, 0.45), arrowprops=dict(arrowstyle="<->", color='#64748b', lw=1.2))
    ax.annotate('', xy=(0.43, 0.32), xytext=(0.31, 0.20), arrowprops=dict(arrowstyle="<->", color='#64748b', lw=1.2))
    ax.annotate('', xy=(0.57, 0.32), xytext=(0.69, 0.20), arrowprops=dict(arrowstyle="<-", color='#64748b', lw=1.2))

    ax.set_xlim(0, 1)
    ax.set_ylim(0.02, 1.0)
    save_fig(fig, "fig9_dfd_level1.png")

# 10. Entity-Relationship (ER) Diagram
def generate_fig10_er_diagram():
    fig, ax = plt.subplots(figsize=(11, 8))
    ax.axis('off')
    ax.text(0.5, 0.97, "Figure 10: Entity-Relationship (ER) Diagram (Relational Data Model)", fontsize=13, fontweight='bold', ha='center', color='#102a43')

    entities = [
        ("STUDENT\n(id, full_name, cgpa, branch,\nsemester, email, phone, grad_year)", 0.50, 0.78, '#1e40af'),
        ("PROJECT\n(id, student_id, title,\ndescription, tech_stack)", 0.16, 0.88, '#0369a1'),
        ("CERTIFICATION\n(id, student_id, name,\nissuing_org, credential_id)", 0.84, 0.88, '#0369a1'),
        ("STUDENT_SKILL\n(id, student_id, skill_id,\nproficiency, score)", 0.16, 0.65, '#0369a1'),
        ("SKILL\n(id, name, category,\nis_technical)", 0.16, 0.45, '#047857'),
        ("OPPORTUNITY\n(id, company_name, job_role,\nmin_cgpa, eligible_branches, package_lpa)", 0.50, 0.15, '#b45309'),
        ("APPLICATION\n(id, student_id, opp_id,\ncompany_name, status, applied_date)", 0.50, 0.46, '#7c3aed'),
        ("SAVED_OPPORTUNITY\n(id, student_id, opp_id)", 0.84, 0.46, '#7c3aed'),
        ("ASSESSMENT\n(id, title, category,\nduration_minutes, pass_percentage)", 0.84, 0.25, '#be185d'),
        ("ASSESSMENT_RESULT\n(id, student_id, assessment_id,\nscore, percentage, passed)", 0.84, 0.08, '#be185d'),
    ]

    for label, x, y, col in entities:
        rect = patches.FancyBboxPatch((x - 0.13, y - 0.05), 0.26, 0.10, boxstyle="round,pad=0.01", ec=col, fc='#ffffff', lw=1.5)
        ax.add_patch(rect)
        ax.text(x, y, label, fontsize=7.2, fontweight='bold', ha='center', va='center', color='#0f172a')

    # Relationships
    def draw_rel(x1, y1, x2, y2, label):
        ax.plot([x1, x2], [y1, y2], color='#64748b', lw=1.3)
        mid_x = (x1 + x2) / 2
        mid_y = (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, fontsize=6.8, color='#1e293b', fontweight='bold', bbox=dict(boxstyle='square,pad=0.1', fc='white', ec='none'))

    draw_rel(0.37, 0.78, 0.29, 0.88, "1 : N")
    draw_rel(0.63, 0.78, 0.71, 0.88, "1 : N")
    draw_rel(0.37, 0.75, 0.29, 0.65, "1 : N")
    draw_rel(0.16, 0.60, 0.16, 0.50, "N : 1")
    draw_rel(0.50, 0.73, 0.50, 0.51, "1 : N")
    draw_rel(0.50, 0.41, 0.50, 0.20, "N : 1")
    draw_rel(0.63, 0.75, 0.71, 0.46, "1 : N")
    draw_rel(0.63, 0.72, 0.71, 0.08, "1 : N")
    draw_rel(0.84, 0.20, 0.84, 0.13, "1 : N")

    ax.set_xlim(0, 1)
    ax.set_ylim(0.01, 1.0)
    save_fig(fig, "fig10_er_diagram.png")

# 11. Hardware / Connection Circuit Diagram
def generate_fig11_connection_circuit():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    ax.axis('off')
    ax.text(0.5, 0.96, "Figure 11: Network Architecture & Connection Data-Interface Diagram", fontsize=12, fontweight='bold', ha='center', color='#102a43')

    boxes = [
        ("Client Browser\n(Google Chrome / Edge / Safari)\nDesktop / Mobile / Tablet", 0.05, 0.50, 0.25, 0.28, '#2563eb', '#eff6ff'),
        ("Frontend Web Server\n(Vite Development Engine)\nLocalhost Port 5173", 0.38, 0.50, 0.24, 0.28, '#0891b2', '#ecfeff'),
        ("Backend ASGI Server\n(FastAPI + Uvicorn Worker)\nLocalhost Port 8000", 0.71, 0.50, 0.24, 0.28, '#16a34a', '#f0fdf4'),
        ("Database Server\n(MySQL Community Server 8.0)\nTCP Port 3306 (or SQLite Fallback)", 0.71, 0.08, 0.24, 0.24, '#dc2626', '#fff1f2'),
    ]

    for title, x, y, w, h, ec, fc in boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02", ec=ec, fc=fc, lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, title, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0f172a')

    # Connections
    # Client <-> Frontend
    ax.annotate('', xy=(0.38, 0.64), xytext=(0.30, 0.64), arrowprops=dict(arrowstyle="<->", color='#0284c7', lw=2))
    ax.text(0.34, 0.67, "HTTP/2\n(HTML/JS/CSS)", fontsize=7, ha='center', color='#0369a1')

    # Frontend Proxy / Axios <-> Backend
    ax.annotate('', xy=(0.71, 0.64), xytext=(0.62, 0.64), arrowprops=dict(arrowstyle="<->", color='#16a34a', lw=2))
    ax.text(0.665, 0.67, "JSON REST API\n(/api/v1/..)", fontsize=7, ha='center', color='#15803d')

    # Backend <-> Database
    ax.annotate('', xy=(0.83, 0.32), xytext=(0.83, 0.50), arrowprops=dict(arrowstyle="<->", color='#dc2626', lw=2))
    ax.text(0.88, 0.41, "PyMySQL TCP\nConnection Pool", fontsize=7, va='center', color='#b91c1c')

    ax.set_xlim(0, 1)
    ax.set_ylim(0.02, 1.0)
    save_fig(fig, "fig11_connection_circuit_diagram.png")

# 12. Testing Distribution Chart
def generate_fig12_test_distribution():
    fig, ax = plt.subplots(figsize=(8, 4.5))
    modules = ['Students CRUD', 'Skills Matrix', 'Opportunities', 'Applications', 'Eligibility Check', 'Resume ATS']
    test_counts = [6, 3, 3, 2, 2, 1]
    
    colors = ['#2563eb', '#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626']
    bars = ax.barh(modules, test_counts, color=colors, height=0.55)
    
    ax.set_title("Figure 12: Automated Pytest Test Suite Distribution (17/17 Passed - 100% Pass Rate)", fontsize=11, fontweight='bold', color='#102a43', pad=15)
    ax.set_xlabel("Number of Automated Test Cases", fontsize=9, fontweight='bold', color='#334155')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.set_xlim(0, 7)
    
    for bar in bars:
        w = bar.get_width()
        ax.text(w + 0.15, bar.get_y() + bar.get_height()/2, f"{int(w)} Passed (100%)", va='center', fontsize=8.5, fontweight='bold', color='#1e293b')

    plt.tight_layout()
    save_fig(fig, "fig12_test_distribution.png")

if __name__ == "__main__":
    generate_fig1_block_diagram()
    generate_fig2_use_case_diagram()
    generate_fig3_class_diagram()
    generate_fig4_activity_eligibility()
    generate_fig5_activity_resume()
    generate_fig6_sequence_application()
    generate_fig7_sequence_resume()
    generate_fig8_dfd_level0()
    generate_fig9_dfd_level1()
    generate_fig10_er_diagram()
    generate_fig11_connection_circuit()
    generate_fig12_test_distribution()
    print("All 12 diagrams successfully rendered and exported to report_assets/!")
