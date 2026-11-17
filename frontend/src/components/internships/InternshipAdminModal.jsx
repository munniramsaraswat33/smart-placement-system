import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const InternshipAdminModal = ({ isOpen, onClose, onSave, internship = null }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    job_role: '',
    job_description: '',
    stipend: '₹50,000 / month',
    duration: '6 Months',
    required_skills: 'Python, React, SQL',
    min_cgpa: 6.5,
    eligible_branches: 'All Engineering Branches',
    work_mode: 'Hybrid',
    location: 'Bangalore',
    application_deadline: '2026-12-31',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (internship) {
      setFormData({
        company_name: internship.company_name || '',
        job_role: internship.job_role || '',
        job_description: internship.job_description || '',
        stipend: internship.stipend || '₹50,000 / month',
        duration: internship.duration || '6 Months',
        required_skills: internship.required_skills || '',
        min_cgpa: internship.min_cgpa || 6.5,
        eligible_branches: internship.eligible_branches || 'All Engineering Branches',
        work_mode: internship.work_mode || 'Hybrid',
        location: internship.location || 'Bangalore',
        application_deadline: internship.application_deadline || '',
        is_active: internship.is_active !== undefined ? internship.is_active : true,
      });
    } else {
      setFormData({
        company_name: '',
        job_role: '',
        job_description: '',
        stipend: '₹60,000 / month',
        duration: '6 Months',
        required_skills: 'Python, React, SQL',
        min_cgpa: 6.5,
        eligible_branches: 'All Engineering Branches',
        work_mode: 'Hybrid',
        location: 'Bangalore',
        application_deadline: '2026-12-31',
        is_active: true,
      });
    }
  }, [internship, isOpen]);

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
      title={internship ? 'Edit Internship' : 'Post New Internship Opening'}
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
              placeholder="e.g. Google India"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Role Title *</label>
            <input
              type="text"
              name="job_role"
              required
              value={formData.job_role}
              onChange={handleChange}
              placeholder="e.g. Software Engineering Intern"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Monthly Stipend *</label>
            <input
              type="text"
              name="stipend"
              required
              value={formData.stipend}
              onChange={handleChange}
              placeholder="e.g. ₹75,000 / month"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Duration *</label>
            <input
              type="text"
              name="duration"
              required
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 6 Months"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Work Mode *</label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Internship Description *</label>
          <textarea
            name="job_description"
            rows="3"
            required
            value={formData.job_description}
            onChange={handleChange}
            placeholder="Key projects and learning objectives..."
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
            placeholder="Python, React, Git"
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
              placeholder="e.g. Bangalore"
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
            {internship ? 'Update Internship' : 'Create Internship'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InternshipAdminModal;
