import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const OpportunityAdminModal = ({ isOpen, onClose, onSave, opportunity = null }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    job_role: '',
    job_description: '',
    required_skills: '',
    min_cgpa: 7.0,
    eligible_branches: 'Computer Science & Engineering, Information Technology',
    graduation_year: 2025,
    package_lpa: 15.0,
    location: 'Bangalore / Hybrid',
    application_deadline: '2026-12-31',
    job_type: 'Full-Time',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        company_name: opportunity.company_name || '',
        job_role: opportunity.job_role || '',
        job_description: opportunity.job_description || '',
        required_skills: opportunity.required_skills || '',
        min_cgpa: opportunity.min_cgpa || 7.0,
        eligible_branches: opportunity.eligible_branches || '',
        graduation_year: opportunity.graduation_year || 2025,
        package_lpa: opportunity.package_lpa || 15.0,
        location: opportunity.location || '',
        application_deadline: opportunity.application_deadline || '',
        job_type: opportunity.job_type || 'Full-Time',
        is_active: opportunity.is_active !== undefined ? opportunity.is_active : true,
      });
    } else {
      setFormData({
        company_name: '',
        job_role: '',
        job_description: '',
        required_skills: 'Python, React, SQL, Git',
        min_cgpa: 7.5,
        eligible_branches: 'Computer Science & Engineering, Information Technology',
        graduation_year: 2025,
        package_lpa: 18.0,
        location: 'Bangalore',
        application_deadline: '2026-12-31',
        job_type: 'Full-Time',
        is_active: true,
      });
    }
  }, [opportunity, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        ...formData,
        min_cgpa: parseFloat(formData.min_cgpa),
        package_lpa: parseFloat(formData.package_lpa),
        graduation_year: parseInt(formData.graduation_year),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity ? 'Edit Placement Opportunity' : 'Post New Placement Opportunity (Admin Demo)'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Company Name *</label>
            <input
              type="text"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g. Adobe, Microsoft"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Role Title *</label>
            <input
              type="text"
              name="job_role"
              required
              value={formData.job_role}
              onChange={handleChange}
              placeholder="e.g. Member of Technical Staff"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Package (LPA) *</label>
            <input
              type="number"
              step="0.1"
              name="package_lpa"
              required
              value={formData.package_lpa}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Minimum CGPA *</label>
            <input
              type="number"
              step="0.01"
              name="min_cgpa"
              required
              value={formData.min_cgpa}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Graduation Year *</label>
            <input
              type="number"
              name="graduation_year"
              required
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Job Description *</label>
          <textarea
            name="job_description"
            rows="3"
            required
            value={formData.job_description}
            onChange={handleChange}
            placeholder="Key responsibilities and engineering requirements..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Required Technical Skills (comma separated) *
          </label>
          <input
            type="text"
            name="required_skills"
            required
            value={formData.required_skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, SQL"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Eligible Branches (comma separated)
          </label>
          <input
            type="text"
            name="eligible_branches"
            value={formData.eligible_branches}
            onChange={handleChange}
            placeholder="Computer Science, IT, Electronics"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore / Hybrid"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Application Deadline</label>
            <input
              type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={saving}>
            {opportunity ? 'Update Opportunity' : 'Create Opportunity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OpportunityAdminModal;
