import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';

const OpportunityModal = ({ isOpen, onClose, opportunity, onApply, isApplied = false }) => {
  if (!opportunity) return null;

  const skillsList = opportunity.required_skills
    ? opportunity.required_skills.split(',').map((s) => s.trim())
    : [];

  const branchesList = opportunity.eligible_branches
    ? opportunity.eligible_branches.split(',').map((b) => b.trim())
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${opportunity.company_name} - ${opportunity.job_role}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-slate-800">
        {/* Company Header */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
              {opportunity.company_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{opportunity.job_role}</h3>
              <p className="text-xs text-blue-600 font-semibold">{opportunity.company_name}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">CTC Package</span>
            <span className="text-xl font-black text-emerald-600">{opportunity.package_lpa} LPA</span>
          </div>
        </div>

        {/* Quick specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Min CGPA</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {opportunity.min_cgpa} / 10
            </span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Job Type</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{opportunity.job_type}</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {opportunity.location}
            </span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Deadline</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {opportunity.application_deadline}
            </span>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Role Description & Responsibilities
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {opportunity.job_description}
          </p>
        </div>

        {/* Required Technical Skills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Required Technical Stack & Competencies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {skillsList.map((skill, idx) => (
              <Badge key={idx} variant="primary" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Eligible Engineering Branches */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Eligible Academic Disciplines
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {branchesList.map((branch, idx) => (
              <Badge key={idx} variant="default" size="sm">
                {branch}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {isApplied ? (
            <Button variant="secondary" size="sm" disabled icon={CheckCircle2}>
              Already Applied
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                onClose();
                onApply(opportunity);
              }}
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OpportunityModal;
