import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  GraduationCap,
  Building2,
  MapPin,
  Calendar,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/common/Button';
import InternshipCard from '../components/internships/InternshipCard';
import InternshipAdminModal from '../components/internships/InternshipAdminModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';

const WORK_MODES = ['All', 'Hybrid', 'Remote', 'On-site'];

const InternshipOpportunitiesPage = () => {
  const { student, searchQuery, setSearchQuery } = useApp();
  const { showToast } = useNotifications();

  const [internships, setInternships] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [onlySaved, setOnlySaved] = useState(false);

  // Admin Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const studentId = student ? student.id : 1;
      const [internRes, savedRes, appsRes] = await Promise.all([
        api.get('/internships'),
        api.get(`/saved-opportunities?student_id=${studentId}`),
        api.get(`/applications?student_id=${studentId}&opportunity_type=internship`),
      ]);

      setInternships(internRes.data);

      const savedSet = new Set(
        savedRes.data.filter((s) => s.internship_id).map((s) => s.internship_id)
      );
      setSavedIds(savedSet);

      const appliedSet = new Set(
        appsRes.data.filter((a) => a.internship_id).map((a) => a.internship_id)
      );
      setAppliedIds(appliedSet);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [student]);

  const handleApply = async (internship) => {
    try {
      const studentId = student ? student.id : 1;
      await api.post('/applications', {
        student_id: studentId,
        internship_id: internship.id,
        company_name: internship.company_name,
        role_title: internship.job_role,
        opportunity_type: 'internship',
        status: 'Applied',
        salary_or_stipend: internship.stipend,
        location: internship.location,
      });

      setAppliedIds((prev) => new Set([...prev, internship.id]));
      showToast(`Internship application submitted to ${internship.company_name}!`, 'success');
    } catch (err) {
      showToast('Failed to apply for internship', 'error');
    }
  };

  const handleToggleSave = async (internshipId) => {
    try {
      const studentId = student ? student.id : 1;
      await api.post('/saved-opportunities', {
        student_id: studentId,
        internship_id: internshipId,
        item_type: 'internship',
      });

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(internshipId)) next.delete(internshipId);
        else next.add(internshipId);
        return next;
      });
      showToast('Bookmarks updated', 'info');
    } catch (err) {
      showToast('Failed to update bookmark', 'error');
    }
  };

  const handleSaveInternship = async (internshipData) => {
    try {
      if (editingInternship) {
        await api.put(`/internships/${editingInternship.id}`, internshipData);
        showToast('Internship updated', 'success');
      } else {
        await api.post('/internships', internshipData);
        showToast('New internship opening posted!', 'success');
      }
      setEditingInternship(null);
      fetchInternships();
    } catch (err) {
      showToast('Failed to save internship', 'error');
    }
  };

  // Filter pipeline
  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.required_skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWorkMode =
      selectedWorkMode === 'All' ||
      item.work_mode.toLowerCase() === selectedWorkMode.toLowerCase();

    const matchesSaved = !onlySaved || savedIds.has(item.id);

    return matchesSearch && matchesWorkMode && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Internship Opportunities</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-placement internship opportunities, summer training programs, and research positions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => {
            setEditingInternship(null);
            setAdminModalOpen(true);
          }}
        >
          Post New Internship (Admin)
        </Button>
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
            placeholder="Search internships by company, skills, role..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Work Mode Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {WORK_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedWorkMode(mode)}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                selectedWorkMode === mode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Saved Toggle */}
        <button
          onClick={() => setOnlySaved(!onlySaved)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-semibold transition-all ${
            onlySaved
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-amber-600' : ''}`} />
          Saved Only
        </button>

        {/* Reset */}
        {(searchQuery || selectedWorkMode !== 'All' || onlySaved) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedWorkMode('All');
              setOnlySaved(false);
            }}
            className="text-slate-500 hover:text-slate-800 p-2 flex items-center gap-1 text-[11px]"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching active internships..." />
      ) : filteredInternships.length === 0 ? (
        <EmptyState
          title="No internships found"
          description="Try broadening your search or switching work mode filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedWorkMode('All');
            setOnlySaved(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApply={handleApply}
              onToggleSave={handleToggleSave}
              isSaved={savedIds.has(internship.id)}
              isApplied={appliedIds.has(internship.id)}
            />
          ))}
        </div>
      )}

      {/* Admin Post/Edit Internship Modal */}
      <InternshipAdminModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          setEditingInternship(null);
        }}
        onSave={handleSaveInternship}
        internship={editingInternship}
      />
    </div>
  );
};

export default InternshipOpportunitiesPage;
