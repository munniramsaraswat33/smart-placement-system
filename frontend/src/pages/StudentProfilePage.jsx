import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Github,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../api/client';

const StudentProfilePage = () => {
  const { student, studentLoading, fetchStudentProfile, updateStudentProfile } = useApp();
  const { showToast } = useNotifications();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    college_name: '',
    branch: '',
    semester: 7,
    cgpa: 8.82,
    phone: '',
    graduation_year: 2025,
    bio: '',
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
  });

  const [certForm, setCertForm] = useState({
    name: '',
    issuing_organization: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
  });

  const [saving, setSaving] = useState(false);

  const openEditProfile = () => {
    if (student) {
      setProfileForm({
        full_name: student.full_name || '',
        college_name: student.college_name || '',
        branch: student.branch || '',
        semester: student.semester || 7,
        cgpa: student.cgpa || 8.82,
        phone: student.phone || '',
        graduation_year: student.graduation_year || 2025,
        bio: student.bio || '',
      });
    }
    setIsEditProfileOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateStudentProfile({
        ...profileForm,
        cgpa: parseFloat(profileForm.cgpa),
        semester: parseInt(profileForm.semester),
        graduation_year: parseInt(profileForm.graduation_year),
      });
      showToast('Profile updated successfully!', 'success');
      setIsEditProfileOpen(false);
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post(`/students/${student.id}/projects`, projectForm);
      showToast('Project added to portfolio!', 'success');
      setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '' });
      setIsAddProjectOpen(false);
      fetchStudentProfile();
    } catch (err) {
      showToast('Failed to add project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project record?')) return;
    try {
      await api.delete(`/students/${student.id}/projects/${projectId}`);
      showToast('Project removed', 'info');
      fetchStudentProfile();
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post(`/students/${student.id}/certifications`, certForm);
      showToast('Certification added!', 'success');
      setCertForm({ name: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '' });
      setIsAddCertOpen(false);
      fetchStudentProfile();
    } catch (err) {
      showToast('Failed to add certification', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCert = async (certId) => {
    if (!window.confirm('Delete this certification record?')) return;
    try {
      await api.delete(`/students/${student.id}/certifications/${certId}`);
      showToast('Certification removed', 'info');
      fetchStudentProfile();
    } catch (err) {
      showToast('Failed to delete certification', 'error');
    }
  };

  if (studentLoading || !student) {
    return <LoadingSpinner text="Loading verified student credentials..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {student.full_name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{student.full_name}</h2>
                <Badge variant="success" size="xs">
                  Verified Candidate
                </Badge>
              </div>

              <p className="text-xs font-semibold text-blue-600 mt-0.5">
                {student.college_name}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {student.branch}
                </span>
                <span>•</span>
                <span>Semester {student.semester}</span>
                <span>•</span>
                <span>Batch of {student.graduation_year}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <Button variant="outline" size="sm" icon={Edit2} onClick={openEditProfile}>
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick contact and Academic highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative GPA</span>
              <span className="text-base font-extrabold text-slate-900">{student.cgpa} / 10.0</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">University Email</span>
              <span className="font-semibold text-slate-800 truncate block">{student.email}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone</span>
              <span className="font-semibold text-slate-800">{student.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Placement Batch</span>
              <span className="font-semibold text-slate-800">Class of {student.graduation_year}</span>
            </div>
          </div>
        </div>

        {/* Student Bio */}
        {student.bio && (
          <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">Executive Summary</span>
            {student.bio}
          </div>
        )}
      </div>

      {/* Projects Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Featured Technical Projects</h3>
            <p className="text-xs text-slate-500">
              Production systems, architecture designs, and open-source contributions.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddProjectOpen(true)}
          >
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.projects?.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.tech_stack.split(',').map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 text-xs">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Industry Certifications & Credentials</h3>
            <p className="text-xs text-slate-500">
              Verified certifications from cloud providers and universities.
            </p>
          </div>
          <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsAddCertOpen(true)}>
            Add Certification
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {student.certifications?.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  {cert.issuing_organization}
                </p>
                {cert.issue_date && (
                  <p className="text-[11px] text-slate-400 mt-1">Issued: {cert.issue_date}</p>
                )}
                {cert.credential_id && (
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    ID: {cert.credential_id}
                  </p>
                )}
              </div>

              {cert.credential_url && (
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Verify Credential <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Student Academic Profile"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">College Name *</label>
              <input
                type="text"
                required
                value={profileForm.college_name}
                onChange={(e) => setProfileForm({ ...profileForm, college_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Branch *</label>
              <input
                type="text"
                required
                value={profileForm.branch}
                onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Semester *</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={profileForm.semester}
                onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">CGPA (out of 10) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={profileForm.cgpa}
                onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Graduation Year *</label>
              <input
                type="number"
                required
                value={profileForm.graduation_year}
                onChange={(e) => setProfileForm({ ...profileForm, graduation_year: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Profile Bio / Summary</label>
            <textarea
              rows="3"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Add Technical Project"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddProject} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. Distributed Cache System"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Description *</label>
            <textarea
              rows="3"
              required
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Describe architecture, scalability, impact..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tech Stack (comma separated) *</label>
            <input
              type="text"
              required
              value={projectForm.tech_stack}
              onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
              placeholder="React, Node.js, Redis, Docker"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">GitHub Repo URL</label>
              <input
                type="url"
                value={projectForm.github_url}
                onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Live Demo URL</label>
              <input
                type="url"
                value={projectForm.live_url}
                onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsAddProjectOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              Add Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal
        isOpen={isAddCertOpen}
        onClose={() => setIsAddCertOpen(false)}
        title="Add Certification Credential"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddCert} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Certification Name *</label>
            <input
              type="text"
              required
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              placeholder="e.g. AWS Solutions Architect"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Issuing Organization *</label>
            <input
              type="text"
              required
              value={certForm.issuing_organization}
              onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
              placeholder="e.g. Amazon Web Services"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue Date</label>
              <input
                type="text"
                value={certForm.issue_date}
                onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                placeholder="e.g. Nov 2024"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Credential ID</label>
              <input
                type="text"
                value={certForm.credential_id}
                onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                placeholder="e.g. AWS-8392193"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Credential Verification URL</label>
            <input
              type="url"
              value={certForm.credential_url}
              onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsAddCertOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              Save Credential
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfilePage;
