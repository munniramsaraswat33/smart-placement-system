import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const TARGET_ROLES = [
  'Full Stack Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist / AI Engineer',
  'DevOps / Cloud Engineer',
];

const SAMPLE_RESUME_TEXT = `Aarav Sharma
Email: aarav.sharma@nitkkr.ac.in | Phone: +91 98765 43210
Education: B.Tech in Computer Science & Engineering, National Institute of Technology (2021 - 2025), CGPA: 8.82 / 10.0

Technical Skills:
- Programming Languages: Python, C++, Java, JavaScript, TypeScript, SQL
- Web Engineering & Frameworks: React.js, FastAPI, Node.js, Next.js, Tailwind CSS, REST APIs, GraphQL
- Databases & Systems: MySQL, PostgreSQL, Redis, MongoDB
- Cloud & DevOps: Docker, AWS, Git, GitHub Actions, Linux, Kubernetes

Projects:
1. CloudPulse - Distributed Time-Series Metrics & Monitoring System
- Architected a distributed metrics collection pipeline in Python and FastAPI handling 10,000 requests/sec.
- Implemented real-time anomaly detection with Redis pub/sub and automated Prometheus alerting.
- Deployed on AWS ECS with Docker containerization and CI/CD pipelines.

2. DevCollab - Real-Time Collaborative Code Editor
- Developed a browser-based collaborative programming IDE using React, TypeScript, and WebSockets.
- Built operational transformation algorithms supporting simultaneous multi-user code editing with zero conflicts.

3. SmartPlacement AI - Automated Placement & Resume Matching Platform
- Engineered an automated resume analysis tool using NLP and vector keyword matching in Python.
- Calculated ATS compliance metrics and recommended targeted missing skills for tech candidates.

Work Experience:
Software Engineering Intern - Cloud Solutions Lab (June 2024 - Aug 2024)
- Designed and documented scalable RESTful microservices reducing database query latency by 35%.
- Wrote end-to-end integration test suites with Pytest achieving 92% code coverage.

Certifications:
- AWS Certified Solutions Architect – Associate (2024)
- Meta Front-End Developer Professional Certificate (2024)
`;

const ResumeUploader = ({ onAnalyze, loading }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onAnalyze(file, targetRole);
  };

  const handleLoadSampleResume = () => {
    const blob = new Blob([SAMPLE_RESUME_TEXT], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Aarav_Sharma_Resume.txt', { type: 'text/plain' });
    setFile(sampleFile);
    onAnalyze(sampleFile, targetRole);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
            Target Career Role for Optimization
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50'
              : file
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt"
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {file ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{file.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Upload PDF Resume or Text Document
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Drag and drop your file here, or click to browse. We extract technical keywords, evaluate ATS compliance, and score job role readiness.
                </p>
                <span className="inline-block mt-3 px-2.5 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-md">
                  Supports .PDF and .TXT
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Sample Student Resume (1-Click Demo)
          </button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={!file}
            className="w-full sm:w-auto px-6"
          >
            Run ATS & Skill Analysis
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUploader;
