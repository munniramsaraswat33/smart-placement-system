import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Award,
  Layers,
  Sparkles,
  Building2,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import api from '../api/client';
import { useApp } from '../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PlacementAnalyticsPage = () => {
  const { student } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const studentId = student ? student.id : 1;
        const res = await api.get(`/analytics/dashboard?student_id=${studentId}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [student]);

  if (loading || !data) {
    return <LoadingSpinner text="Crunching real-time placement data & trends..." />;
  }

  // 1. Status Doughnut Chart
  const statusLabels = data.application_statuses?.map((s) => s.status) || [];
  const statusCounts = data.application_statuses?.map((s) => s.count) || [];
  const statusDoughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          '#94a3b8',
          '#3b82f6',
          '#6366f1',
          '#8b5cf6',
          '#f59e0b',
          '#10b981',
          '#f43f5e',
        ].slice(0, statusLabels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // 2. Monthly Trends Line Chart
  const trendLabels = data.monthly_trends?.map((t) => t.month) || ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const trendCounts = data.monthly_trends?.map((t) => t.count) || [2, 4, 7, 11, 15, 18];
  const trendLineData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Applications Submitted',
        data: trendCounts,
        fill: true,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        tension: 0.35,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  // 3. Skills Distribution Bar Chart
  const skillCategories = data.skills_distribution?.map((s) => s.category) || [];
  const skillCounts = data.skills_distribution?.map((s) => s.count) || [];
  const skillsBarData = {
    labels: skillCategories,
    datasets: [
      {
        label: 'Verified Skills Count',
        data: skillCounts,
        backgroundColor: '#4f46e5',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900">Placement Intelligence & Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive visual analytics covering application pipelines, skill distribution, monthly velocity, and readiness scores.
        </p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Conversion Rate"
          value={`${data.stats.placement_success_rate}%`}
          subtitle="Final selections"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Active Drives"
          value={data.stats.total_opportunities}
          subtitle="Tier-1 company openings"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Interviews"
          value={data.stats.interviews_scheduled}
          subtitle="Upcoming technical rounds"
          icon={Layers}
          color="amber"
        />
        <StatCard
          title="Readiness Score"
          value={`${data.placement_readiness_score} / 100`}
          subtitle="Overall candidate index"
          icon={Award}
          color="indigo"
        />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Application Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Application Trajectory</h3>
              <p className="text-xs text-slate-500">Submission velocity during campus placement drive</p>
            </div>
            <Badge variant="primary" size="xs">
              Monthly Active
            </Badge>
          </div>

          <div className="h-64">
            <Line
              data={trendLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: '#f1f5f9' },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Application Status Doughnut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of applications across 7 stages</p>
            </div>
            <Badge variant="indigo" size="xs">
              Live Funnel
            </Badge>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            <Doughnut
              data={statusDoughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } },
                },
                cutout: '68%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Distribution Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Skills Taxonomy Distribution</h3>
            <p className="text-xs text-slate-500">Number of verified competencies by technological discipline</p>
          </div>

          <div className="h-64">
            <Bar
              data={skillsBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: '#f1f5f9' },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Preparation Progress Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Placement Preparation Breakdown</h3>
            <p className="text-xs text-slate-500">Key pillars assessed by technical interview boards</p>
          </div>

          <div className="space-y-4">
            {data.placement_progress?.map((p, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{p.category}</span>
                  <span className="font-bold text-slate-900">{p.score} / {p.max_score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      p.score >= 80 ? 'bg-emerald-500' : p.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
            <span>Overall Readiness Index</span>
            <span className="text-lg font-black text-blue-700">{data.placement_readiness_score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalyticsPage;
