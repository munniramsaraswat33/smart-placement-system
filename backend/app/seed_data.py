import logging
from sqlalchemy.orm import Session
from app.models.student import Student, Project, Certification
from app.models.skill import Skill, StudentSkill
from app.models.opportunity import Opportunity
from app.models.internship import Internship
from app.models.application import Application, SavedOpportunity
from app.models.assessment import Assessment, AssessmentQuestion, AssessmentResult
from app.models.notification import Notification

logger = logging.getLogger("placement_system.seed")

def seed_all_data(db: Session):
    logger.info("Checking database data...")

    # Check if student already exists
    if db.query(Student).first():
        logger.info("Database already seeded. Skipping initial seeding.")
        return

    logger.info("Seeding realistic sample demo data...")

    # 1. Primary Demo Student
    demo_student = Student(
        full_name="Aarav Sharma",
        college_name="National Institute of Technology, Kurukshetra",
        branch="Computer Science & Engineering",
        semester=7,
        cgpa=8.82,
        email="aarav.sharma@nitkkr.ac.in",
        phone="+91 98765 43210",
        graduation_year=2025,
        bio="Passionate Full Stack Developer and Competitive Programmer. Experienced in building scalable cloud-native microservices, modern React interfaces, and distributed systems. Seeking challenging software engineering roles.",
        resume_url="/resumes/aarav_sharma_resume.pdf"
    )
    db.add(demo_student)
    db.flush()

    # 2. Student Projects
    projects = [
        Project(
            student_id=demo_student.id,
            title="CloudPulse - Distributed Metrics & Monitoring System",
            description="Designed and deployed a high-throughput time-series metrics collector handling 10,000 req/sec with automated alerting and Grafana dashboards.",
            tech_stack="Python, FastAPI, Redis, Docker, Prometheus, PostgreSQL",
            github_url="https://github.com/aaravsharma/cloudpulse-metrics",
            live_url="https://cloudpulse-demo.up.railway.app"
        ),
        Project(
            student_id=demo_student.id,
            title="DevCollab - Real-time Collaborative Code Editor",
            description="Built a peer-to-peer real-time collaborative code editor with syntax highlighting, compiler integration, and WebSockets multi-cursor editing.",
            tech_stack="React, TypeScript, Node.js, WebSockets, Tailwind CSS, Monaco Editor",
            github_url="https://github.com/aaravsharma/devcollab-editor",
            live_url="https://devcollab.vercel.app"
        ),
        Project(
            student_id=demo_student.id,
            title="SmartPlacement AI - Career & Resume Matching Engine",
            description="Developed an automated resume parsing and ATS score analyzer using Natural Language Processing and keyword frequency ranking algorithms.",
            tech_stack="Python, PyMuPDF, Scikit-learn, FastAPI, React",
            github_url="https://github.com/aaravsharma/smartplacement-ats",
            live_url="https://smartplacement-demo.org"
        )
    ]
    db.add_all(projects)

    # 3. Student Certifications
    certifications = [
        Certification(
            student_id=demo_student.id,
            name="AWS Certified Solutions Architect – Associate",
            issuing_organization="Amazon Web Services (AWS)",
            issue_date="Nov 2024",
            credential_id="AWS-SAA-8392193",
            credential_url="https://aws.amazon.com/verification"
        ),
        Certification(
            student_id=demo_student.id,
            name="Meta Front-End Developer Professional Certificate",
            issuing_organization="Meta / Coursera",
            issue_date="Aug 2024",
            credential_id="COURSERA-META-77123",
            credential_url="https://coursera.org/verify/META"
        ),
        Certification(
            student_id=demo_student.id,
            name="Algorithmic Toolbox & Data Structures Specialization",
            issuing_organization="UC San Diego",
            issue_date="May 2024",
            credential_id="UCSD-ALGO-44910",
            credential_url="https://coursera.org/verify/UCSD"
        )
    ]
    db.add_all(certifications)

    # 4. Master Skills
    master_skills_data = [
        ("Python", "Programming", True),
        ("C++", "Programming", True),
        ("Java", "Programming", True),
        ("JavaScript", "Programming", True),
        ("TypeScript", "Programming", True),
        ("React.js", "Web Development", True),
        ("FastAPI", "Web Development", True),
        ("Node.js", "Web Development", True),
        ("Tailwind CSS", "Web Development", True),
        ("Next.js", "Web Development", True),
        ("MySQL", "Database", True),
        ("PostgreSQL", "Database", True),
        ("MongoDB", "Database", True),
        ("Redis", "Database", True),
        ("Machine Learning", "Data Science", True),
        ("Data Structures & Algorithms", "Programming", True),
        ("Docker & Containers", "Web Development", True),
        ("AWS Cloud", "Web Development", True),
        ("Git & GitHub", "Programming", True),
        ("Communication & Leadership", "Soft Skills", False),
        ("Problem Solving", "Soft Skills", False),
        ("Agile & Scrum", "Soft Skills", False),
    ]

    skills_dict = {}
    for name, cat, is_tech in master_skills_data:
        skill = Skill(name=name, category=cat, is_technical=is_tech)
        db.add(skill)
        db.flush()
        skills_dict[name] = skill

    # 5. Student Skills mapping with proficiency
    student_skills = [
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["Python"].id, proficiency="Advanced", score=92.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["C++"].id, proficiency="Advanced", score=90.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["React.js"].id, proficiency="Advanced", score=88.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["FastAPI"].id, proficiency="Advanced", score=86.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["JavaScript"].id, proficiency="Advanced", score=85.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["TypeScript"].id, proficiency="Intermediate", score=78.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["Data Structures & Algorithms"].id, proficiency="Advanced", score=94.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["MySQL"].id, proficiency="Intermediate", score=80.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["PostgreSQL"].id, proficiency="Intermediate", score=75.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["Docker & Containers"].id, proficiency="Intermediate", score=72.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["Git & GitHub"].id, proficiency="Advanced", score=95.0),
        StudentSkill(student_id=demo_student.id, skill_id=skills_dict["Problem Solving"].id, proficiency="Advanced", score=92.0),
    ]
    db.add_all(student_skills)

    # 6. Placement Opportunities (12 realistic full-time opportunities)
    placement_opps = [
        Opportunity(
            company_name="Google",
            job_role="Software Engineer (L3) - University Graduate",
            job_description="Join Google engineering teams to build products that touch billions. You will develop large-scale distributed systems, collaborate on cross-functional architectures, and solve critical computational challenges.",
            required_skills="C++, Java, Python, Data Structures & Algorithms, Distributed Systems",
            min_cgpa=8.0,
            eligible_branches="Computer Science & Engineering, Information Technology, Electronics & Communication",
            graduation_year=2025,
            package_lpa=38.5,
            location="Bangalore / Hyderabad",
            application_deadline="2026-12-15",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Microsoft",
            job_role="Software Development Engineer (SDE-1)",
            job_description="Design, implement, and maintain customer-facing enterprise cloud services on Microsoft Azure and Microsoft 365, utilizing modern C#, TypeScript, and cloud-native frameworks.",
            required_skills="C#, Java, Python, Azure, Data Structures, OOP",
            min_cgpa=7.5,
            eligible_branches="Computer Science, IT, ECE, Mathematics & Computing",
            graduation_year=2025,
            package_lpa=44.0,
            location="Hyderabad / Bangalore / Noida",
            application_deadline="2026-12-05",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Amazon",
            job_role="Software Development Engineer - I",
            job_description="Work on Amazon Web Services or Retail Core Systems. Own end-to-end design of microservices that handle peak holiday shopping traffic and zero-downtime deployments.",
            required_skills="Java, C++, AWS, Object Oriented Design, System Design",
            min_cgpa=7.0,
            eligible_branches="Computer Science & Engineering, IT, Electronics",
            graduation_year=2025,
            package_lpa=32.0,
            location="Bangalore / Chennai",
            application_deadline="2026-11-30",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Atlassian",
            job_role="Associate Software Engineer",
            job_description="Shape the future of team collaboration by developing core services for Jira, Confluence, and Bitbucket. Emphasizes clean code, automated testing, and developer productivity.",
            required_skills="React, TypeScript, Java, Spring Boot, Microservices",
            min_cgpa=7.8,
            eligible_branches="Computer Science, Information Technology",
            graduation_year=2025,
            package_lpa=35.0,
            location="Remote / Bangalore",
            application_deadline="2026-12-10",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Goldman Sachs",
            job_role="Software Engineering Analyst",
            job_description="Engineer robust, low-latency financial exchange platforms, risk management engines, and real-time algorithmic trade analysis applications.",
            required_skills="Java, Python, C++, Data Structures, Relational Databases, Algorithms",
            min_cgpa=8.0,
            eligible_branches="All Engineering Branches",
            graduation_year=2025,
            package_lpa=28.0,
            location="Bangalore",
            application_deadline="2026-11-28",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Uber",
            job_role="Software Engineer I - Core Infrastructure",
            job_description="Help power Uber's mobility platform across 70+ countries. Build real-time geo-spatial dispatch services, ride pooling logic, and fraud detection microservices.",
            required_skills="Go, Golang, Python, Kafka, Redis, Distributed Systems",
            min_cgpa=8.2,
            eligible_branches="Computer Science & Engineering, Information Technology",
            graduation_year=2025,
            package_lpa=42.0,
            location="Bangalore / Hyderabad",
            application_deadline="2026-12-20",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Adobe",
            job_role="Member of Technical Staff - Creative Cloud",
            job_description="Create next-generation creative tooling incorporating generative AI workflows, high-performance web graphics (WebAssembly, WebGPU), and collaborative cloud canvases.",
            required_skills="C++, JavaScript, React, WebGL, Algorithms",
            min_cgpa=7.5,
            eligible_branches="Computer Science, IT, Electronics",
            graduation_year=2025,
            package_lpa=31.5,
            location="Noida / Bangalore",
            application_deadline="2026-12-18",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Oracle",
            job_role="Software Developer - Oracle Cloud Infrastructure (OCI)",
            job_description="Build modern virtualization, networking, and high-performance cloud storage layers powering mission-critical enterprises globally.",
            required_skills="Java, Python, Linux, Operating Systems, Computer Networks",
            min_cgpa=7.0,
            eligible_branches="Computer Science, IT, ECE, Electrical",
            graduation_year=2025,
            package_lpa=19.5,
            location="Bangalore / Hyderabad",
            application_deadline="2026-12-08",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Zomato",
            job_role="Product Engineer - Full Stack",
            job_description="Develop consumer-facing hyper-local food delivery and Blinkit quick-commerce logistics systems handling 100M+ monthly transactions.",
            required_skills="React.js, Node.js, Python, PostgreSQL, Redis",
            min_cgpa=7.0,
            eligible_branches="All Engineering Branches",
            graduation_year=2025,
            package_lpa=24.0,
            location="Gurgaon",
            application_deadline="2026-11-25",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Cisco",
            job_role="Software Engineer - Cloud & Security",
            job_description="Innovate within Cisco SecureX, enterprise cybersecurity threat intelligence, and next-generation software-defined networking (SDN).",
            required_skills="Python, C++, Networking Protocols, TCP/IP, Linux",
            min_cgpa=7.2,
            eligible_branches="Computer Science, IT, Electronics & Communication",
            graduation_year=2025,
            package_lpa=18.0,
            location="Bangalore",
            application_deadline="2026-12-12",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Intuit",
            job_role="Software Engineer 1 - TurboTax & QuickBooks",
            job_description="Build financial automation platforms using AI-driven tax calculation engines, modern React frontends, and resilient AWS microservices.",
            required_skills="Java, Spring Boot, React, AWS, Docker",
            min_cgpa=7.5,
            eligible_branches="Computer Science, Information Technology",
            graduation_year=2025,
            package_lpa=29.0,
            location="Bangalore",
            application_deadline="2026-12-14",
            job_type="Full-Time",
            is_active=True
        ),
        Opportunity(
            company_name="Flipkart",
            job_role="Associate Software Development Engineer",
            job_description="Work on big billion day e-commerce supply chain logistics, inventory optimization, and personalized recommendation architectures.",
            required_skills="Java, Spring, MySQL, Kafka, Data Structures",
            min_cgpa=7.0,
            eligible_branches="Computer Science, IT, Electronics",
            graduation_year=2025,
            package_lpa=26.5,
            location="Bangalore",
            application_deadline="2026-12-22",
            job_type="Full-Time",
            is_active=True
        )
    ]
    db.add_all(placement_opps)
    db.flush()

    # 7. Internship Opportunities (9 realistic opportunities)
    internships = [
        Internship(
            company_name="Microsoft India",
            job_role="Software Engineering Intern",
            job_description="Collaborate with senior software engineers on Microsoft 365 Copilot intelligence features, building real-time productivity accelerators.",
            stipend="₹1,25,000 / month",
            duration="6 Months (Jan - Jun 2025)",
            required_skills="C++, Python, Algorithms, Problem Solving",
            min_cgpa=7.5,
            eligible_branches="Computer Science, IT, ECE",
            work_mode="Hybrid",
            location="Hyderabad / Bangalore",
            application_deadline="2026-12-01",
            is_active=True
        ),
        Internship(
            company_name="Google India",
            job_role="Student Researcher / Engineering Intern",
            job_description="Research and develop experimental machine learning models and edge systems with the Google Research India lab.",
            stipend="₹1,15,000 / month",
            duration="6 Months",
            required_skills="Python, PyTorch, Linear Algebra, Machine Learning",
            min_cgpa=8.0,
            eligible_branches="Computer Science & Engineering, IT",
            work_mode="Hybrid",
            location="Bangalore",
            application_deadline="2026-12-10",
            is_active=True
        ),
        Internship(
            company_name="Salesforce",
            job_role="Software Engineering Summer Intern",
            job_description="Design enterprise CRM features and developer tooling on the Lightning web platform with automated CI/CD validation.",
            stipend="₹90,000 / month",
            duration="2 Months Summer",
            required_skills="Java, JavaScript, React, REST API",
            min_cgpa=7.0,
            eligible_branches="All Engineering Branches",
            work_mode="On-site",
            location="Hyderabad",
            application_deadline="2026-12-15",
            is_active=True
        ),
        Internship(
            company_name="NVIDIA",
            job_role="Deep Learning Software Intern",
            job_description="Accelerate CUDA libraries, TensorRT optimizations, and neural rendering models for next-generation generative AI infrastructure.",
            stipend="₹85,000 / month",
            duration="6 Months",
            required_skills="C++, CUDA, Python, Deep Learning, GPU Architecture",
            min_cgpa=8.0,
            eligible_branches="CSE, IT, Electrical, ECE",
            work_mode="Hybrid",
            location="Pune / Bangalore",
            application_deadline="2026-11-28",
            is_active=True
        ),
        Internship(
            company_name="Swiggy",
            job_role="Backend Engineering Intern",
            job_description="Optimize delivery partner routing algorithms, real-time geohash clustering, and surge pricing engines in Go and Redis.",
            stipend="₹60,000 / month",
            duration="6 Months",
            required_skills="Go, Python, Redis, Microservices, SQL",
            min_cgpa=7.0,
            eligible_branches="All Branches",
            work_mode="Remote",
            location="Remote",
            application_deadline="2026-12-05",
            is_active=True
        ),
        Internship(
            company_name="Razorpay",
            job_role="Frontend Engineering Intern",
            job_description="Build modern, high-conversion payment checkout screens and financial dashboards using React, TypeScript, and Tailwind CSS.",
            stipend="₹55,000 / month",
            duration="6 Months",
            required_skills="React, TypeScript, CSS, State Management, Git",
            min_cgpa=6.8,
            eligible_branches="All Branches",
            work_mode="Hybrid",
            location="Bangalore",
            application_deadline="2026-12-12",
            is_active=True
        ),
        Internship(
            company_name="Morgan Stanley",
            job_role="Technology Analyst Summer Intern",
            job_description="Implement secure algorithmic trading transaction ledgers, analytics pipelines, and institutional client gateways.",
            stipend="₹80,000 / month",
            duration="2 Months",
            required_skills="Java, C++, SQL, Object-Oriented Programming",
            min_cgpa=7.5,
            eligible_branches="Computer Science, IT, Mathematics",
            work_mode="On-site",
            location="Mumbai / Bangalore",
            application_deadline="2026-11-30",
            is_active=True
        ),
        Internship(
            company_name="Postman",
            job_role="API Platform Engineering Intern",
            job_description="Improve developer API collaboration workflows, mock servers, and schema validation tooling used by 30M+ developers.",
            stipend="₹70,000 / month",
            duration="6 Months",
            required_skills="Node.js, JavaScript, REST, GraphQL, Docker",
            min_cgpa=7.0,
            eligible_branches="All Engineering Branches",
            work_mode="Remote",
            location="Remote",
            application_deadline="2026-12-20",
            is_active=True
        ),
        Internship(
            company_name="CRED",
            job_role="Backend Developer Intern",
            job_description="Develop high-reliability financial reward engines, card bill processing pipelines, and Kafka stream consumers.",
            stipend="₹75,000 / month",
            duration="6 Months",
            required_skills="Python, Go, Kafka, PostgreSQL, Docker",
            min_cgpa=7.5,
            eligible_branches="CSE, IT, ECE",
            work_mode="On-site",
            location="Bangalore",
            application_deadline="2026-12-08",
            is_active=True
        )
    ]
    db.add_all(internships)
    db.flush()

    # 8. Applications representing all stages of the tracker
    applications = [
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[0].id, # Google
            company_name="Google",
            role_title="Software Engineer (L3) - University Graduate",
            opportunity_type="placement",
            status="Interview Scheduled",
            applied_date="2026-10-14",
            interview_date="2026-11-20 at 10:30 AM IST (Round 2 Technical)",
            notes="Passed Round 1 coding round (Graph & Dynamic Programming). Next round focuses on System Design & Data Structures.",
            salary_or_stipend="38.5 LPA",
            location="Bangalore"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[1].id, # Microsoft
            company_name="Microsoft",
            role_title="Software Development Engineer (SDE-1)",
            opportunity_type="placement",
            status="Assessment",
            applied_date="2026-10-22",
            interview_date=None,
            notes="Completed online Codility assessment with 100% test cases passing. Awaiting interview shortlisting notice.",
            salary_or_stipend="44.0 LPA",
            location="Hyderabad"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[3].id, # Atlassian
            company_name="Atlassian",
            role_title="Associate Software Engineer",
            opportunity_type="placement",
            status="Shortlisted",
            applied_date="2026-10-28",
            interview_date="TBD - Scheduling Next Week",
            notes="Resume shortlisted by technical hiring manager. Received invitation to complete Karat coding interview.",
            salary_or_stipend="35.0 LPA",
            location="Bangalore / Remote"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[8].id, # Zomato
            company_name="Zomato",
            role_title="Product Engineer - Full Stack",
            opportunity_type="placement",
            status="Selected",
            applied_date="2026-09-18",
            interview_date="Completed",
            notes="Offer letter received! Base package 24 LPA + ESOPs. Accepted pending campus placement officer endorsement.",
            salary_or_stipend="24.0 LPA",
            location="Gurgaon"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[4].id, # Goldman Sachs
            company_name="Goldman Sachs",
            role_title="Software Engineering Analyst",
            opportunity_type="placement",
            status="Under Review",
            applied_date="2026-11-05",
            interview_date=None,
            notes="Campus referral submitted through alumni network. Profile under evaluation by Global Markets engineering team.",
            salary_or_stipend="28.0 LPA",
            location="Bangalore"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[2].id, # Amazon
            company_name="Amazon",
            role_title="Software Development Engineer - I",
            opportunity_type="placement",
            status="Rejected",
            applied_date="2026-09-02",
            interview_date="Completed on Sep 29",
            notes="Cleared OA 1 & OA 2. Rejected after final bar-raiser round due to edge case handling in tree serialization problem.",
            salary_or_stipend="32.0 LPA",
            location="Bangalore"
        ),
        Application(
            student_id=demo_student.id,
            opportunity_id=placement_opps[5].id, # Uber
            company_name="Uber",
            role_title="Software Engineer I - Core Infrastructure",
            opportunity_type="placement",
            status="Applied",
            applied_date="2026-11-12",
            interview_date=None,
            notes="Application submitted via university placement drive portal. Awaiting initial profile screening results.",
            salary_or_stipend="42.0 LPA",
            location="Bangalore"
        ),
        Application(
            student_id=demo_student.id,
            internship_id=internships[0].id, # Microsoft Internship
            company_name="Microsoft India",
            role_title="Software Engineering Intern",
            opportunity_type="internship",
            status="Interview Scheduled",
            applied_date="2026-10-18",
            interview_date="2026-11-22 at 3:00 PM IST (Teams Call)",
            notes="Interviewer: Senior Azure Cloud Architect. Topics: Distributed caching and concurrency primitives.",
            salary_or_stipend="₹1,25,000 / month",
            location="Hyderabad"
        )
    ]
    db.add_all(applications)

    # 9. Saved / Bookmarked opportunities
    saved = [
        SavedOpportunity(student_id=demo_student.id, opportunity_id=placement_opps[0].id, item_type="placement"),
        SavedOpportunity(student_id=demo_student.id, opportunity_id=placement_opps[6].id, item_type="placement"),
        SavedOpportunity(student_id=demo_student.id, internship_id=internships[1].id, item_type="internship")
    ]
    db.add_all(saved)

    # 10. Mock Skill Assessments & Questions
    dsa_assessment = Assessment(
        title="Data Structures & Algorithms - Technical Screening",
        category="Programming",
        description="Comprehensive evaluation of algorithmic complexity, balanced binary trees, dynamic programming, and graph traversals for Tier-1 software roles.",
        duration_minutes=25,
        total_questions=5,
        pass_percentage=60.0
    )
    db.add(dsa_assessment)
    db.flush()

    dsa_questions = [
        AssessmentQuestion(
            assessment_id=dsa_assessment.id,
            question_text="What is the worst-case time complexity of searching an element in a self-balancing AVL Tree with N nodes?",
            option_a="O(1)",
            option_b="O(log N)",
            option_c="O(N)",
            option_d="O(N log N)",
            correct_option="B",
            explanation="AVL trees maintain a strict balance factor where heights never differ by more than 1, guaranteeing O(log N) worst-case search time."
        ),
        AssessmentQuestion(
            assessment_id=dsa_assessment.id,
            question_text="Which algorithmic paradigm does Dijkstra's shortest-path algorithm for non-negative edge weights employ?",
            option_a="Divide and Conquer",
            option_b="Dynamic Programming",
            option_c="Greedy Approach",
            option_d="Backtracking",
            correct_option="C",
            explanation="Dijkstra's algorithm greedily extracts the vertex with minimum tentative distance from a min-priority queue."
        ),
        AssessmentQuestion(
            assessment_id=dsa_assessment.id,
            question_text="In an unweighted graph, which traversal algorithm identifies the shortest path between a source and destination node?",
            option_a="Breadth-First Search (BFS)",
            option_b="Depth-First Search (DFS)",
            option_c="Topological Sort",
            option_d="Tarjan's Strongly Connected Components",
            correct_option="A",
            explanation="BFS explores nodes level by level, ensuring that the first time a destination is reached, the path taken has minimum edge transitions."
        ),
        AssessmentQuestion(
            assessment_id=dsa_assessment.id,
            question_text="What is the amortized time complexity of inserting an element into a dynamic array (like Python list or C++ std::vector)?",
            option_a="O(1)",
            option_b="O(log N)",
            option_c="O(N)",
            option_d="O(N^2)",
            correct_option="A",
            explanation="Although dynamic arrays periodically double capacity (which costs O(N)), the cost is spread out across N operations, yielding O(1) amortized time."
        ),
        AssessmentQuestion(
            assessment_id=dsa_assessment.id,
            question_text="Which data structure is primarily used to detect cycles in an undirected graph in near-constant time using union and find operations?",
            option_a="Min-Heap",
            option_b="Disjoint Set Union (DSU)",
            option_c="Trie",
            option_d="Bloom Filter",
            correct_option="B",
            explanation="Disjoint Set Union (Union-Find) with path compression and rank heuristic determines connectivity in alpha(N) nearly constant time."
        )
    ]
    db.add_all(dsa_questions)

    web_assessment = Assessment(
        title="Full Stack & Web Engineering Assessment",
        category="Web Development",
        description="Assesses modern web technologies, asynchronous execution, HTTP semantics, RESTful API design, and database indexing strategies.",
        duration_minutes=20,
        total_questions=4,
        pass_percentage=75.0
    )
    db.add(web_assessment)
    db.flush()

    web_questions = [
        AssessmentQuestion(
            assessment_id=web_assessment.id,
            question_text="Which HTTP status code is most appropriate when a client sends valid syntax but the server refuses authorization due to lack of valid credentials?",
            option_a="400 Bad Request",
            option_b="401 Unauthorized",
            option_c="403 Forbidden",
            option_d="404 Not Found",
            correct_option="B",
            explanation="HTTP 401 indicates that the request requires user authentication credentials that were missing or invalid."
        ),
        AssessmentQuestion(
            assessment_id=web_assessment.id,
            question_text="In the JavaScript event loop, where do Promises and queueMicrotask callbacks get queued?",
            option_a="Macrotask / Task Queue",
            option_b="Microtask Queue",
            option_c="Render Queue",
            option_d="Web Worker Pool",
            correct_option="B",
            explanation="Promises execute in the microtask queue, which is drained completely before the next macrotask (such as setTimeout) is pulled."
        ),
        AssessmentQuestion(
            assessment_id=web_assessment.id,
            question_text="What is the primary benefit of creating a B-Tree index on a foreign key column in a relational SQL database?",
            option_a="Reduces database storage size",
            option_b="Speeds up JOIN and WHERE queries from O(N) full table scan to O(log N)",
            option_c="Prevents any duplicate rows from ever being inserted",
            option_d="Automatically normalizes the table to 3NF",
            correct_option="B",
            explanation="B-Tree indexes allow the query planner to quickly locate matching rows in logarithmic time instead of scanning every table row."
        ),
        AssessmentQuestion(
            assessment_id=web_assessment.id,
            question_text="What does idempotency mean with respect to HTTP methods?",
            option_a="The request always executes in under 100 milliseconds",
            option_b="Making multiple identical requests produces the exact same intended effect on the server as making a single request",
            option_c="The request is guaranteed to never fail",
            option_d="Data is compressed using gzip",
            correct_option="B",
            explanation="Methods like GET, PUT, and DELETE are idempotent because repeating the request results in the same resource state."
        )
    ]
    db.add_all(web_questions)

    # Completed test record
    assessment_result = AssessmentResult(
        student_id=demo_student.id,
        assessment_id=dsa_assessment.id,
        score=5,
        total_score=5,
        percentage=100.0,
        passed=True
    )
    db.add(assessment_result)

    # 11. Realistic in-app notifications
    notifications = [
        Notification(
            title="Interview Scheduled: Google Round 2",
            message="Your Technical Round 2 for Google University Graduate SWE is confirmed for Nov 20 at 10:30 AM IST.",
            notification_type="interview",
            is_read=False,
            link="/applications"
        ),
        Notification(
            title="Upcoming Application Deadline: Amazon SDE-1",
            message="The campus placement application window for Amazon SDE-1 closes in 13 days (Nov 30). Ensure resume is verified.",
            notification_type="deadline",
            is_read=False,
            link="/opportunities"
        ),
        Notification(
            title="New Opportunity: Uber Core Infrastructure",
            message="Uber has opened campus applications for Software Engineer I (Package: 42.0 LPA). Your profile is eligible!",
            notification_type="opportunity",
            is_read=False,
            link="/opportunities"
        ),
        Notification(
            title="Application Selected: Zomato Offer Letter",
            message="Congratulations! Your placement offer letter for Product Engineer (24 LPA) has been published on your dashboard.",
            notification_type="application",
            is_read=True,
            link="/applications"
        ),
        Notification(
            title="Microsoft India: Interview Call Scheduled",
            message="Technical interview for Software Engineering Intern set for Nov 22 at 3:00 PM on Microsoft Teams.",
            notification_type="interview",
            is_read=True,
            link="/applications"
        )
    ]
    db.add_all(notifications)

    db.commit()
    logger.info("Database seeding completed successfully!")
