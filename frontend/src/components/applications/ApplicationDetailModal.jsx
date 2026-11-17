import React, { useState, useEffect } from 'react';
import { Calendar, Building2, MapPin, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';

const STAGES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment',
  'Interview Scheduled',
  'Selected',
  'Rejected',
];

const ApplicationDetailModal = ({ isOpen, onClose, application, onUpdate, onDelete }) => {
  const [status, setStatus] = useState('Applied');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.status || 'Applied');
      setInterviewDate(application.interview_date || '');
      setNotes(application.notes || '');
    }
  }, [application, isOpen]);

  if (!application) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(application.id, {
        status,
        interview_date: interviewDate,
        notes,
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
      title={`${application.company_name} - Pipeline Details`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Summary */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">{application.role_title}</h4>
            <p className="text-slate-500 font-medium mt-0.5">{application.company_name}</p>
          </div>
          <span className="font-bold text-emerald-700 text-sm">
            {application.salary_or_stipend || 'Competitive'}
          </span>
        </div>

        {/* Status Selector */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Application Pipeline Stage</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Interview Date Input */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Interview Date & Timing (if scheduled)
          </label>
          <input
            type="text"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            placeholder="e.g. 2026-11-20 at 10:30 AM IST (Round 2)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Preparation Notes & Feedback */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Interview Feedback & Preparation Notes
          </label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key discussion topics, coding questions asked, interviewer notes..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this application record?')) {
                onDelete(application.id);
                onClose();
              }
            }}
            className="text-rose-600 hover:text-rose-800 font-semibold"
          >
            Delete Application
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              Save Updates
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;
