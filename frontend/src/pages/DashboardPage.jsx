import React, { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  GraduationCap,
  Layers,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
  Award,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EligibilityModal from '../components/opportunities/EligibilityModal';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOppForEligibility, setSelectedOppForEligibility] = useState(null);
  const { showToast } = useNotifications();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApply = async (opp) => {
    try {
      await api.post('/applications', {
        student_id: 1,
        opportunity_id: opp.id,
        company_name: opp.company_name,
        role_title: opp.job_role,
        opportunity_type: 'placement',
        status: 'Applied',
        salary_or_stipend: `${opp.package_lpa} LPA`,
        location: opp.location,
      });
      showToast(`Successfully applied to ${opp.company_name}!`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast('Error submitting application', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Aggregating campus placement metrics..." />;
  }

  const stats = data?.stats || {
    total_students: 1,
    total_opportunities: 12,
    active_internships: 9,
    applications_submitted: 8,
    interviews_scheduled: 2,
    placement_success_rate: 85.0,
  };

  // Doughnut chart setup
  const statusLabels = data?.application_statuses?.map((s) => s.status) || [];
  const statusCounts = data?.application_statuses?.map((s) => s.count) || [];
  const doughnutColors = [
    '#94a3b8', // Applied
    '#3b82f6', // Under Review
    '#6366f1', // Shortlisted
    '#8b5cf6', // Assessment
    '#f59e0b', // Interview Scheduled
    '#10b981', // Selected
    '#f43f5e', // Rejected
  ];

  const chartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: doughnutColors.slice(0, statusLabels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-400/20 uppercase tracking-widest">
            2025 - 2026 Campus Placement Season
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
            Smart Placement & Career Management Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Monitor real-time placement opportunities, track interview pipelines, check company eligibility criteria, and optimize your ATS resume score.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/opportunities">
            <Button variant="primary" size="sm" icon={Briefcase}>
              Explore Drives
            </Button>
          </Link>
          <Link to="/resume">
            <Button variant="secondary" size="sm" icon={Sparkles}>
              Analyze Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Core Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Students"
          value={stats.total_students}
          subtitle="Registered batch"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Job Drives"
          value={stats.total_opportunities}
          subtitle="Full-time openings"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Internships"
          value={stats.active_internships}
          subtitle="Active openings"
          icon={GraduationCap}
          color="violet"
        />
        <StatCard
          title="Applications"
          value={stats.applications_submitted}
          subtitle="Submitted tracker"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Interviews"
          value={stats.interviews_scheduled}
          subtitle="Active rounds"
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.placement_success_rate}%`}
          subtitle="Offer conversions"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Middle Section: Progress & Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Preparation Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Placement Readiness & Preparation Index
              </h3>
              <p className="text-xs text-slate-500">
                Calculated across technical competencies, certifications, mock assessments, and projects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-blue-600">
                {data?.placement_readiness_score || 84}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>

          <div className="space-y-4">
            {data?.placement_progress?.map((prog, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{prog.category}</span>
                  <span className="font-bold text-slate-900">{prog.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      prog.score >= 80
                        ? 'bg-emerald-500'
                        : prog.score >= 60
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${prog.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status Doughnut */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-2">
            <h3 className="text-sm font-bold text-slate-900">Application Pipeline</h3>
            <p className="text-xs text-slate-500">Breakdown of applications across recruitment stages</p>
          </div>

          <div className="h-48 flex items-center justify-center relative my-2">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                cutout: '72%',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">
                {stats.applications_submitted}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Apps</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {data?.application_statuses?.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                <span className="text-[11px] text-slate-600 truncate">{st.status}</span>
                <span className="text-[11px] font-bold text-slate-900">{st.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Opportunities, Upcoming Interviews, Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Opportunities */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-bold text-slate-900">Featured Placement Drives</h3>
            <Link
              to="/opportunities"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recent_opportunities?.map((opp) => (
              <div
                key={opp.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{opp.job_role}</h4>
                  <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {opp.company_name} • {opp.location.split('/')[0]}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {opp.package_lpa} LPA
                  </span>
                  <button
                    onClick={() => setSelectedOppForEligibility(opp)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Check Eligibility"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interview Schedule */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Interview Schedule</h3>
            <Badge variant="warning" size="xs">
              Live Pipeline
            </Badge>
          </div>

          <div className="space-y-3">
            {data?.upcoming_interviews?.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active interview rounds scheduled.
              </div>
            ) : (
              data?.upcoming_interviews?.map((intw, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{intw.company_name}</span>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {intw.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{intw.role_title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-amber-900 font-semibold pt-1 border-t border-amber-200/60">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>{intw.interview_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Skills to Learn */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-bold text-slate-900">High-Demand Tech Skills</h3>
            <Link to="/skills" className="text-xs font-semibold text-blue-600 hover:underline">
              Assess Skills →
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.recommended_skills?.map((sk, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{sk.name}</span>
                  <span className="text-[10px] text-slate-500">{sk.category}</span>
                </div>
                <Badge variant="indigo" size="xs">
                  {sk.demand}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Eligibility Modal */}
      <EligibilityModal
        isOpen={Boolean(selectedOppForEligibility)}
        onClose={() => setSelectedOppForEligibility(null)}
        opportunity={selectedOppForEligibility}
        onApply={handleApply}
      />
    </div>
  );
};

export default DashboardPage;
