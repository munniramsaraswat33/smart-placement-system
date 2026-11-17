import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  TrendingUp,
  Brain,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AddSkillModal from '../components/skills/AddSkillModal';
import AssessmentModal from '../components/skills/AssessmentModal';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Database',
  'Data Science',
  'Soft Skills',
];

const ROLE_RECOMMENDATIONS = {
  'Full Stack Software Engineer': [
    { name: 'TypeScript', reason: 'Industry standard for enterprise web apps' },
    { name: 'Docker & Containers', reason: 'Essential for CI/CD microservice deployment' },
    { name: 'System Design', reason: 'Core criteria for L3/SDE-1 interviews' },
    { name: 'GraphQL & REST APIs', reason: 'Modern frontend-backend contracts' },
  ],
  'Backend Systems Engineer': [
    { name: 'Go / Golang', reason: 'High concurrency microservice language' },
    { name: 'Kafka & Event Streaming', reason: 'Distributed asynchronous messaging' },
    { name: 'Redis Caching', reason: 'Low-latency in-memory data store' },
    { name: 'PostgreSQL Indexing', reason: 'Complex relational query optimization' },
  ],
  'Data Science & AI Engineer': [
    { name: 'PyTorch & Deep Learning', reason: 'Model training and fine-tuning' },
    { name: 'NLP & LLM Architectures', reason: 'Generative AI applications' },
    { name: 'MLOps & Model Serving', reason: 'Productionizing AI pipelines' },
    { name: 'Pandas & NumPy', reason: 'Data preprocessing and matrix computation' },
  ],
  'DevOps & Cloud Engineer': [
    { name: 'Kubernetes (K8s)', reason: 'Container orchestration across clouds' },
    { name: 'Terraform (IaC)', reason: 'Infrastructure as Code automation' },
    { name: 'CI/CD Pipelines', reason: 'Automated testing and zero-downtime release' },
    { name: 'AWS Cloud Architecture', reason: 'Primary enterprise cloud platform' },
  ],
};

const SkillsAssessmentPage = () => {
  const { student } = useApp();
  const { showToast } = useNotifications();

  const [studentSkills, setStudentSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRole, setSelectedRole] = useState('Full Stack Software Engineer');

  // Modals
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null);

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      const studentId = student ? student.id : 1;
      const [skillsRes, assessRes, historyRes] = await Promise.all([
        api.get(`/students/${studentId}/skills`),
        api.get('/assessments'),
        api.get(`/assessments/history/${studentId}`),
      ]);
      setStudentSkills(skillsRes.data);
      setAssessments(assessRes.data);
      setAssessmentHistory(historyRes.data);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, [student]);

  const handleAddSkill = async (skillData) => {
    try {
      const studentId = student ? student.id : 1;
      await api.post(`/students/${studentId}/skills`, skillData);
      showToast(`Skill '${skillData.name}' saved to your profile!`, 'success');
      fetchSkillsData();
    } catch (err) {
      showToast('Failed to add skill', 'error');
    }
  };

  const handleDeleteSkill = async (skillEntryId) => {
    if (!window.confirm('Remove this skill from your profile?')) return;
    try {
      const studentId = student ? student.id : 1;
      await api.delete(`/students/${studentId}/skills/${skillEntryId}`);
      showToast('Skill removed', 'info');
      fetchSkillsData();
    } catch (err) {
      showToast('Failed to delete skill', 'error');
    }
  };

  const filteredSkills =
    activeCategory === 'All'
      ? studentSkills
      : studentSkills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  const getProficiencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'intermediate':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving skill taxonomy and assessments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Technical Skills & Competency Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified tech competencies, take mock assessments, and view career role recommendations.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddSkillOpen(true)}>
          Add New Skill
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
            No skills found in this category. Click 'Add New Skill' to register your proficiencies.
          </div>
        ) : (
          filteredSkills.map((sk) => (
            <div
              key={sk.id}
              className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{sk.category}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs my-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getProficiencyColor(
                      sk.proficiency
                    )}`}
                  >
                    {sk.proficiency}
                  </span>
                  <span className="font-extrabold text-slate-800">{sk.score}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    sk.score >= 85
                      ? 'bg-emerald-500'
                      : sk.score >= 70
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${sk.score}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recommended Skills for Career Roles
            </h3>
            <p className="text-xs text-slate-500">
              Curated by tech recruiters for top placement conversion rates.
            </p>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
          >
            {Object.keys(ROLE_RECOMMENDATIONS).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROLE_RECOMMENDATIONS[selectedRole]?.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">{rec.name}</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{rec.reason}</p>
              </div>
              <button
                onClick={() =>
                  handleAddSkill({
                    name: rec.name,
                    category: 'Web Development',
                    proficiency: 'Beginner',
                    score: 60,
                  })
                }
                className="mt-3 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                + Add to My Skills
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Assessments Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="pb-4 border-b border-slate-100 mb-5">
          <h3 className="text-base font-bold text-slate-900">Mock Technical Assessments</h3>
          <p className="text-xs text-slate-500">
            Interactive multiple-choice tests with real-time scoring to benchmark your readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((test) => (
            <div
              key={test.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{test.title}</h4>
                  <Badge variant="indigo" size="xs">
                    {test.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {test.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {test.duration_minutes} Mins
                  </span>
                  <span>•</span>
                  <span>{test.total_questions} Questions</span>
                  <span>•</span>
                  <span>Passing: {test.pass_percentage}%</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={() => setActiveAssessment(test)}
                >
                  Start Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment History Log */}
        {assessmentHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Your Assessment Attempt History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[10px] uppercase">
                    <th className="py-2.5 px-3">Assessment Title</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Percentage</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Attempt Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessmentHistory.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {res.assessment_title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {res.score} / {res.total_score}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{res.percentage}%</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={res.passed ? 'success' : 'danger'} size="xs">
                          {res.passed ? 'Passed' : 'Needs Practice'}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {res.attempted_at
                          ? new Date(res.attempted_at).toLocaleDateString()
                          : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onAdd={handleAddSkill}
      />

      {/* Interactive Assessment Modal */}
      <AssessmentModal
        isOpen={Boolean(activeAssessment)}
        onClose={() => setActiveAssessment(null)}
        assessment={activeAssessment}
        onCompleted={(result) => {
          showToast(`Assessment submitted! Score: ${result.percentage}%`, 'success');
          fetchSkillsData();
        }}
      />
    </div>
  );
};

export default SkillsAssessmentPage;
