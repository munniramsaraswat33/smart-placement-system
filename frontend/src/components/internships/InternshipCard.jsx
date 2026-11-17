import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Wifi,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const InternshipCard = ({
  internship,
  onApply,
  onToggleSave,
  isSaved = false,
  isApplied = false,
}) => {
  const [applying, setApplying] = useState(false);

  const skillsList = internship.required_skills
    ? internship.required_skills.split(',').map((s) => s.trim()).slice(0, 4)
    : [];

  const handleApply = async () => {
    try {
      setApplying(true);
      await onApply(internship);
    } finally {
      setApplying(false);
    }
  };

  const getWorkModeBadge = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'remote':
        return <Badge variant="success" size="xs">Remote</Badge>;
      case 'hybrid':
        return <Badge variant="primary" size="xs">Hybrid</Badge>;
      default:
        return <Badge variant="default" size="xs">On-site</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs card-hover flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
            {internship.company_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {internship.job_role}
              </h3>
            </div>
            <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {internship.company_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {getWorkModeBadge(internship.work_mode)}
          <button
            onClick={() => onToggleSave && onToggleSave(internship.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Bookmarked' : 'Bookmark Internship'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Stipend</span>
          <span className="font-bold text-emerald-700 text-sm truncate block">
            {internship.stipend}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
          <span className="font-semibold text-slate-800">{internship.duration}</span>
        </div>
        <div className="col-span-2 flex items-center gap-4 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {internship.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Deadline: {internship.application_deadline}
          </span>
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Key Requirements
        </span>
        <div className="flex flex-wrap gap-1.5">
          {skillsList.map((skill, index) => (
            <Badge key={index} variant="default" size="xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        {isApplied ? (
          <Button
            variant="secondary"
            size="sm"
            disabled
            className="w-full text-xs text-emerald-700 bg-emerald-50 border-emerald-200"
            icon={CheckCircle2}
          >
            Application Submitted
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            loading={applying}
            className="w-full text-xs"
            onClick={handleApply}
          >
            Apply for Internship
          </Button>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
