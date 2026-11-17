import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  Building2,
  DollarSign,
  MapPin,
  Bookmark,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/common/Button';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import OpportunityModal from '../components/opportunities/OpportunityModal';
import OpportunityAdminModal from '../components/opportunities/OpportunityAdminModal';
import EligibilityModal from '../components/opportunities/EligibilityModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';

const PlacementOpportunitiesPage = () => {
  const { student, searchQuery, setSearchQuery } = useApp();
  const { showToast } = useNotifications();

  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [minPackage, setMinPackage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [onlySaved, setOnlySaved] = useState(false);

  // Modals
  const [selectedOppForDetails, setSelectedOppForDetails] = useState(null);
  const [selectedOppForEligibility, setSelectedOppForEligibility] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const studentId = student ? student.id : 1;
      const [oppsRes, savedRes, appsRes] = await Promise.all([
        api.get('/opportunities'),
        api.get(`/saved-opportunities?student_id=${studentId}`),
        api.get(`/applications?student_id=${studentId}`),
      ]);

      setOpportunities(oppsRes.data);

      const savedSet = new Set(
        savedRes.data.filter((s) => s.opportunity_id).map((s) => s.opportunity_id)
      );
      setSavedIds(savedSet);

      const appliedSet = new Set(
        appsRes.data.filter((a) => a.opportunity_id).map((a) => a.opportunity_id)
      );
      setAppliedIds(appliedSet);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [student]);

  const handleApply = async (opp) => {
    try {
      const studentId = student ? student.id : 1;
      await api.post('/applications', {
        student_id: studentId,
        opportunity_id: opp.id,
        company_name: opp.company_name,
        role_title: opp.job_role,
        opportunity_type: 'placement',
        status: 'Applied',
        salary_or_stipend: `${opp.package_lpa} LPA`,
        location: opp.location,
      });

      setAppliedIds((prev) => new Set([...prev, opp.id]));
      showToast(`Application successfully submitted to ${opp.company_name}!`, 'success');
    } catch (err) {
      showToast('Failed to apply for opportunity', 'error');
    }
  };

  const handleToggleSave = async (oppId) => {
    try {
      const studentId = student ? student.id : 1;
      await api.post('/saved-opportunities', {
        student_id: studentId,
        opportunity_id: oppId,
        item_type: 'placement',
      });

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(oppId)) next.delete(oppId);
        else next.add(oppId);
        return next;
      });
      showToast('Bookmarks updated', 'info');
    } catch (err) {
      showToast('Failed to update bookmark', 'error');
    }
  };

  const handleSaveOpportunity = async (oppData) => {
    try {
      if (editingOpp) {
        await api.put(`/opportunities/${editingOpp.id}`, oppData);
        showToast('Opportunity updated successfully', 'success');
      } else {
        await api.post('/opportunities', oppData);
        showToast('New opportunity published to campus drive!', 'success');
      }
      setEditingOpp(null);
      fetchOpportunities();
    } catch (err) {
      showToast('Failed to save opportunity', 'error');
    }
  };

  // Filter pipeline
  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      !searchQuery ||
      opp.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.required_skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPackage = !minPackage || opp.package_lpa >= parseFloat(minPackage);

    const matchesLocation =
      selectedLocation === 'All' ||
      opp.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesSaved = !onlySaved || savedIds.has(opp.id);

    return matchesSearch && matchesPackage && matchesLocation && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Campus Placement Opportunities</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified full-time engineering drives from Tier-1 and product companies. Check eligibility and apply in 1 click.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => {
            setEditingOpp(null);
            setAdminModalOpen(true);
          }}
        >
          Post New Drive (Admin)
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
            placeholder="Filter by company, role, skills..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Min Package Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-semibold">Min Package:</label>
          <select
            value={minPackage}
            onChange={(e) => setMinPackage(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Any CTC</option>
            <option value="15">15+ LPA</option>
            <option value="25">25+ LPA</option>
            <option value="35">35+ LPA</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-500 font-semibold">Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="All">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Noida">Noida / Gurgaon</option>
            <option value="Remote">Remote</option>
          </select>
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

        {/* Reset Filter Button */}
        {(searchQuery || minPackage || selectedLocation !== 'All' || onlySaved) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setMinPackage('');
              setSelectedLocation('All');
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

      {/* Opportunities Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching active placement opportunities..." />
      ) : filteredOpps.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description="Try adjusting your package or location filters to see more placement openings."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setMinPackage('');
            setSelectedLocation('All');
            setOnlySaved(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onApply={handleApply}
              onCheckEligibility={(o) => setSelectedOppForEligibility(o)}
              onViewDetails={(o) => setSelectedOppForDetails(o)}
              onToggleSave={handleToggleSave}
              isSaved={savedIds.has(opp.id)}
              isApplied={appliedIds.has(opp.id)}
            />
          ))}
        </div>
      )}

      {/* Eligibility Modal */}
      <EligibilityModal
        isOpen={Boolean(selectedOppForEligibility)}
        onClose={() => setSelectedOppForEligibility(null)}
        opportunity={selectedOppForEligibility}
        onApply={handleApply}
      />

      {/* Job Details Modal */}
      <OpportunityModal
        isOpen={Boolean(selectedOppForDetails)}
        onClose={() => setSelectedOppForDetails(null)}
        opportunity={selectedOppForDetails}
        onApply={handleApply}
        isApplied={selectedOppForDetails ? appliedIds.has(selectedOppForDetails.id) : false}
      />

      {/* Admin Post/Edit Opportunity Modal */}
      <OpportunityAdminModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          setEditingOpp(null);
        }}
        onSave={handleSaveOpportunity}
        opportunity={editingOpp}
      />
    </div>
  );
};

export default PlacementOpportunitiesPage;
