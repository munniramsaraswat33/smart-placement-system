import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Bell,
  User,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';

const SettingsPage = () => {
  const { student, fetchStudentProfile } = useApp();
  const { showToast, fetchNotifications } = useNotifications();

  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // Preference switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings/system-status');
      setSystemStatus(res.data);
    } catch (err) {
      console.error('Failed to get system status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleResetDemoData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all demo data? This will drop and re-seed the full academic database with original opportunities, student profile, and applications.'
    );
    if (!confirmed) return;

    try {
      setResetting(true);
      await api.post('/settings/reset-demo-data');
      showToast('Database reset and freshly seeded with demo dataset!', 'success');
      await Promise.all([fetchStatus(), fetchStudentProfile(), fetchNotifications()]);
    } catch (err) {
      showToast('Failed to reset demo data', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900">System Preferences & Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system notification preferences, inspect database diagnostics, and control demo state.
        </p>
      </div>

      {/* Database Diagnostic Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Database Engine & Architecture</h3>
        </div>

        {loading ? (
          <LoadingSpinner text="Querying database metrics..." size="sm" />
        ) : systemStatus ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Database Engine
              </span>
              <span className="font-extrabold text-blue-700 text-sm mt-0.5 block uppercase">
                {systemStatus.database_backend}
              </span>
              <span className="text-[10px] text-slate-500">MySQL / Persistent ORM</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Target Database
              </span>
              <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
                {systemStatus.database_target}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Opportunities
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {systemStatus.opportunities_count}
              </span>
              <span className="text-[10px] text-slate-500">Full-time drives</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Active Internships
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {systemStatus.internships_count}
              </span>
              <span className="text-[10px] text-slate-500">Internship openings</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Notification Alerts</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <span className="font-bold text-slate-900 block">Interview Schedule Reminders</span>
              <span className="text-slate-500">Receive in-app alerts when technical rounds are confirmed.</span>
            </div>
            <input
              type="checkbox"
              checked={interviewReminders}
              onChange={(e) => setInterviewReminders(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <span className="font-bold text-slate-900 block">Application Deadline Alerts</span>
              <span className="text-slate-500">
                Notify 48 hours prior to campus drive application closures.
              </span>
            </div>
            <input
              type="checkbox"
              checked={deadlineAlerts}
              onChange={(e) => setDeadlineAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <span className="font-bold text-slate-900 block">New Company Drives Announcement</span>
              <span className="text-slate-500">
                Receive notifications when eligible companies release openings.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Demo Data Reset Zone */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-2xs bg-rose-50/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Reset Demo Dataset
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Resets all test applications, skills, and drives back to the complete sample dataset (12 opportunities, 9 internships, student profile, and sample interview tracker records).
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            loading={resetting}
            onClick={handleResetDemoData}
          >
            Reset Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
