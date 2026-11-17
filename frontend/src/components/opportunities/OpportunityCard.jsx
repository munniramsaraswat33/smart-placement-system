import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const OpportunityCard = ({
  opportunity,
  onApply,
  onCheckEligibility,
  onViewDetails,
  onToggleSave,
  isSaved = false,
  isApplied = false,
}) => {
  const [applying, setApplying] = useState(false);

  const skillsList = opportunity.required_skills
    ? opportunity.required_skills.split(',').map((s) => s.trim()).slice(0, 4)
    : [];

  const handleApply = async () => {
    try {
      setApplying(true);
      await onApply(opportunity);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs card-hover flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner Stripe */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
            {opportunity.company_name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {opportunity.job_role}
            </h3>
            <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {opportunity.company_name}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleSave && onToggleSave(opportunity.id)}
          className={`p-2 rounded-lg border transition-colors ${
            isSaved
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={isSaved ? 'Bookmarked' : 'Bookmark Opportunity'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Package</span>
          <span className="font-bold text-emerald-700 text-sm">{opportunity.package_lpa} LPA</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Min. CGPA</span>
          <span className="font-semibold text-slate-800">{opportunity.min_cgpa} / 10</span>
        </div>
        <div className="col-span-2 flex items-center gap-4 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Deadline: {opportunity.application_deadline}
          </span>
        </div>
      </div>

      {/* Required Skills Badges */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Required Tech Skills
        </span>
        <div className="flex flex-wrap gap-1.5">
          {skillsList.map((skill, index) => (
            <Badge key={index} variant="default" size="xs">
              {skill}
            </Badge>
          ))}
          {opportunity.required_skills &&
            opportunity.required_skills.split(',').length > 4 && (
              <Badge variant="default" size="xs">
                +{opportunity.required_skills.split(',').length - 4} more
              </Badge>
            )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          icon={Sparkles}
          onClick={() => onCheckEligibility && onCheckEligibility(opportunity)}
        >
          Check Eligibility
        </Button>

        {isApplied ? (
          <Button
            variant="secondary"
            size="sm"
            disabled
            className="flex-1 text-xs text-emerald-700 bg-emerald-50 border-emerald-200"
            icon={CheckCircle2}
          >
            Applied
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            loading={applying}
            className="flex-1 text-xs"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        )}

        <button
          onClick={() => onViewDetails && onViewDetails(opportunity)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Full Description"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
