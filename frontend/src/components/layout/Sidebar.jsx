import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, student } = useApp();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Student Profile', path: '/profile', icon: UserCheck },
    { name: 'Skills & Assessment', path: '/skills', icon: Award },
    { name: 'Placement Opportunities', path: '/opportunities', icon: Briefcase },
    { name: 'Internship Opportunities', path: '/internships', icon: GraduationCap },
    { name: 'Application Tracker', path: '/applications', icon: Layers },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Placement Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 select-none z-30 shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white tracking-tight truncate">
                SmartPlacement
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Career Hub
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            sidebarCollapsed ? 'hidden' : 'block'
          }`}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`
            }
            title={sidebarCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Expand trigger when collapsed */}
      {sidebarCollapsed && (
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User profile footer pill */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs border border-blue-500/30">
              {student ? student.full_name.slice(0, 2).toUpperCase() : 'AS'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {student ? student.full_name : 'Aarav Sharma'}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                CGPA {student ? student.cgpa : '8.82'} • {student ? student.branch.split(' ')[0] : 'CSE'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
