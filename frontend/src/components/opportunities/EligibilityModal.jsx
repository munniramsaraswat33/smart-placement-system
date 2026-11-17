import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../api/client';
import { useApp } from '../../context/AppContext';

const EligibilityModal = ({ isOpen, onClose, opportunity, onApply }) => {
  const { student } = useApp();
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);

  useEffect(() => {
    if (!isOpen || !opportunity) return;

    const check = async () => {
      try {
        setLoading(true);
        const res = await api.post('/eligibility/check', {
          student_id: student ? student.id : 1,
          opportunity_id: opportunity.id,
        });
        setEligibilityData(res.data);
      } catch (err) {
        console.error('Failed to run eligibility check:', err);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [isOpen, opportunity, student]);

  if (!opportunity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Eligibility Verification: ${opportunity.company_name}`}
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <LoadingSpinner text="Evaluating profile against hiring criteria..." />
      ) : eligibilityData ? (
        <div className="space-y-5">
          {/* Main Status Header Card */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              eligibilityData.is_eligible
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {eligibilityData.is_eligible ? (
                <div className="p-2 rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-amber-600 text-white">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="text-base font-bold">
                  {eligibilityData.is_eligible
                    ? 'Eligible for Direct Campus Application'
                    : 'Profile Partially Matches Criteria'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  {opportunity.job_role} • Package: {opportunity.package_lpa} LPA
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-bold tracking-wider opacity-75 block">
                Match Index
              </span>
              <span className="text-2xl font-black">{eligibilityData.match_percentage}%</span>
            </div>
          </div>

          {/* Criteria Checklist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CGPA */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              {eligibilityData.cgpa_eligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Academic CGPA</span>
                <span className="text-slate-500">
                  {student ? student.cgpa : '8.82'} vs Min. {opportunity.min_cgpa}
                </span>
              </div>
            </div>

            {/* Branch */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              {eligibilityData.branch_eligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Engineering Branch</span>
                <span className="text-slate-500 truncate block">
                  {student ? student.branch.split(' ')[0] : 'CSE'} Permitted
                </span>
              </div>
            </div>

            {/* Graduation Batch */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              {eligibilityData.grad_year_eligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Graduation Batch</span>
                <span className="text-slate-500">
                  Class of {student ? student.graduation_year : '2025'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Skills Analysis */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Technical Skill Alignment
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matched Skills ({eligibilityData.matched_skills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {eligibilityData.matched_skills.length > 0 ? (
                    eligibilityData.matched_skills.map((s, idx) => (
                      <Badge key={idx} variant="success" size="xs">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No direct keyword overlap</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                <span className="font-semibold text-rose-800 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Missing Recommended Skills ({eligibilityData.missing_skills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {eligibilityData.missing_skills.length > 0 ? (
                    eligibilityData.missing_skills.map((s, idx) => (
                      <Badge key={idx} variant="danger" size="xs">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-emerald-700 italic">Zero missing skills!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Automated Eligibility Breakdown
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {eligibilityData.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
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
              Proceed to Apply
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default EligibilityModal;
