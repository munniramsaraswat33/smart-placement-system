import React from 'react';
import { Building2, Calendar, Edit3, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

const ApplicationTable = ({
  applications,
  onSelectApplication,
  onQuickStatusChange,
  onDeleteApplication,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <Badge variant="success">{status}</Badge>;
      case 'Interview Scheduled':
        return <Badge variant="warning">{status}</Badge>;
      case 'Shortlisted':
        return <Badge variant="indigo">{status}</Badge>;
      case 'Assessment':
        return <Badge variant="purple">{status}</Badge>;
      case 'Under Review':
        return <Badge variant="primary">{status}</Badge>;
      case 'Rejected':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const STAGES = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Assessment',
    'Interview Scheduled',
    'Selected',
    'Rejected',
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Company & Role</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Compensation</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Current Stage</th>
              <th className="py-3 px-4">Interview Schedule</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                onClick={() => onSelectApplication(app)}
              >
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {app.role_title}
                  </div>
                  <div className="text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {app.company_name}
                  </div>
                </td>

                <td className="py-3.5 px-4 capitalize font-medium text-slate-600">
                  {app.opportunity_type || 'Placement'}
                </td>

                <td className="py-3.5 px-4 font-bold text-emerald-700">
                  {app.salary_or_stipend || 'Competitive'}
                </td>

                <td className="py-3.5 px-4 text-slate-500">{app.applied_date}</td>

                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={app.status}
                    onChange={(e) => onQuickStatusChange(app.id, e.target.value)}
                    className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-3.5 px-4">
                  {app.interview_date ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                      <Calendar className="w-3 h-3" />
                      {app.interview_date}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">None scheduled</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit application details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this application entry?')) {
                          onDeleteApplication(app.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;
