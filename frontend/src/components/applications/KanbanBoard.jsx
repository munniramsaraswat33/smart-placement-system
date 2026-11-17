import React from 'react';
import { Calendar, Building2, MapPin, Clock, Edit2 } from 'lucide-react';
import Badge from '../common/Badge';

const STAGES = [
  { id: 'Applied', name: 'Applied', color: 'border-slate-300 bg-slate-50 text-slate-700' },
  { id: 'Under Review', name: 'Under Review', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { id: 'Shortlisted', name: 'Shortlisted', color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { id: 'Assessment', name: 'Assessment', color: 'border-violet-300 bg-violet-50 text-violet-700' },
  { id: 'Interview Scheduled', name: 'Interview', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { id: 'Selected', name: 'Selected', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { id: 'Rejected', name: 'Rejected', color: 'border-rose-300 bg-rose-50 text-rose-700' },
];

const KanbanBoard = ({ applications, onSelectApplication, onQuickStatusChange }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {STAGES.map((stage) => {
        const stageApps = applications.filter((app) => app.status === stage.id);

        return (
          <div
            key={stage.id}
            className="w-72 shrink-0 bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 flex flex-col max-h-[calc(100vh-250px)]"
          >
            {/* Stage Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3">
              <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stage.color.split(' ')[1]}`} />
                {stage.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 text-[11px] font-bold border border-slate-200 shadow-2xs">
                {stageApps.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {stageApps.length === 0 ? (
                <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg bg-white/40">
                  No applications
                </div>
              ) : (
                stageApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {app.role_title}
                      </span>
                      <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-2">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {app.company_name}
                    </p>

                    {/* Interview date alert if present */}
                    {app.interview_date && (
                      <div className="mb-2 p-1.5 rounded bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{app.interview_date}</span>
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-2 bg-slate-50 p-1.5 rounded">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Footer Details */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="font-semibold text-emerald-700">
                        {app.salary_or_stipend || 'Competitive'}
                      </span>
                      <span>{app.applied_date}</span>
                    </div>

                    {/* Quick Move Stage Select (prevent propagation to modal click) */}
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <select
                        value={app.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          onQuickStatusChange(app.id, e.target.value);
                        }}
                        className="w-full text-[10px] py-1 px-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to: {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
