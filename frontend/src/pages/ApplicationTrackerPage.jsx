import React, { useState, useEffect } from 'react';
import {
  Layers,
  Table as TableIcon,
  Kanban,
  Search,
  Filter,
  Plus,
  Calendar,
  Building2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import KanbanBoard from '../components/applications/KanbanBoard';
import ApplicationTable from '../components/applications/ApplicationTable';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';

const STAGES = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment',
  'Interview Scheduled',
  'Selected',
  'Rejected',
];

const ApplicationTrackerPage = () => {
  const { student, searchQuery, setSearchQuery } = useApp();
  const { showToast } = useNotifications();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'

  // Filters
  const [selectedStage, setSelectedStage] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'placement', 'internship'

  // Modal
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const studentId = student ? student.id : 1;
      const res = await api.get(`/applications?student_id=${studentId}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [student]);

  const handleUpdateApplication = async (appId, updateData) => {
    try {
      await api.put(`/applications/${appId}`, updateData);
      showToast('Application updated successfully', 'success');
      fetchApplications();
    } catch (err) {
      showToast('Failed to update application', 'error');
    }
  };

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}`, { status: newStatus });
      showToast(`Status changed to '${newStatus}'`, 'success');
      fetchApplications();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteApplication = async (appId) => {
    try {
      await api.delete(`/applications/${appId}`);
      showToast('Application record deleted', 'info');
      fetchApplications();
    } catch (err) {
      showToast('Failed to delete application', 'error');
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'All' || app.status === selectedStage;

    const matchesType =
      typeFilter === 'All' || app.opportunity_type?.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStage && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Application Status & Pipeline Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor all your active campus placement drives and internship applications through every hiring stage.
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Table View
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role title, notes..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-semibold">Stage:</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-semibold">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="placement">Full-Time Placement</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Reset */}
        {(searchQuery || selectedStage !== 'All' || typeFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStage('All');
              setTypeFilter('All');
            }}
            className="text-slate-500 hover:text-slate-800 p-2 flex items-center gap-1 text-[11px]"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Main View: Kanban or Table */}
      {loading ? (
        <LoadingSpinner text="Fetching application tracking pipeline..." />
      ) : filteredApps.length === 0 ? (
        <EmptyState
          title="No applications in pipeline"
          description="Browse placement drives and internships to apply and track your interview rounds."
          actionText="Browse Opportunities"
          onAction={() => (window.location.href = '/opportunities')}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApps}
          onSelectApplication={(app) => setSelectedApplication(app)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      ) : (
        <ApplicationTable
          applications={filteredApps}
          onSelectApplication={(app) => setSelectedApplication(app)}
          onQuickStatusChange={handleQuickStatusChange}
          onDeleteApplication={handleDeleteApplication}
        />
      )}

      {/* Application Detail / Edit Modal */}
      <ApplicationDetailModal
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
};

export default ApplicationTrackerPage;
