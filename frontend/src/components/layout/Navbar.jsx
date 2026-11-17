import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Calendar, User, Menu } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { student, sidebarCollapsed, setSidebarCollapsed, searchQuery, setSearchQuery } = useApp();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Career Dashboard', breadcrumb: 'Overview' };
      case '/profile':
        return { title: 'Student Profile', breadcrumb: 'My Profile' };
      case '/skills':
        return { title: 'Skills & Assessment', breadcrumb: 'Competency Hub' };
      case '/opportunities':
        return { title: 'Placement Opportunities', breadcrumb: 'Full-Time Drives' };
      case '/internships':
        return { title: 'Internship Opportunities', breadcrumb: 'Internship Openings' };
      case '/applications':
        return { title: 'Application Tracker', breadcrumb: 'Pipeline Status' };
      case '/resume':
        return { title: 'Resume Analyzer', breadcrumb: 'ATS & Skill Matcher' };
      case '/analytics':
        return { title: 'Placement Analytics', breadcrumb: 'Trends & Insights' };
      case '/settings':
        return { title: 'System Settings', breadcrumb: 'Preferences' };
      default:
        return { title: 'Dashboard', breadcrumb: 'SmartPlacement' };
    }
  };

  const pageInfo = getPageInfo();

  // Current formatted date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm bg-white/95">
      {/* Left: Mobile menu & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Portal</span>
            <span>/</span>
            <span className="font-medium text-slate-700">{pageInfo.breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Date, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drives, skills..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Current Date Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{today}</span>
        </div>

        {/* Notification Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:ring-2 group-hover:ring-blue-500/30 transition-all">
            {student ? student.full_name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
              {student ? student.full_name : 'Aarav Sharma'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {student ? `CGPA ${student.cgpa}` : 'Demo Profile'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
