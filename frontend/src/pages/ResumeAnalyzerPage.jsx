import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  Award,
  Layers,
  ArrowRight,
  ListCheck,
} from 'lucide-react';
import ResumeUploader from '../components/resume/ResumeUploader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/client';
import { useNotifications } from '../context/NotificationContext';

const ResumeAnalyzerPage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotifications();

  const handleAnalyzeResume = async (file, targetRole) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_role', targetRole);

      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysisResult(res.data);
      showToast('Resume analyzed successfully with ATS scoring!', 'success');
    } catch (err) {
      console.error('Resume parsing failed:', err);
      showToast(
        err.response?.data?.detail || 'Failed to parse resume document. Please check file format.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900">
          Smart Resume Analyzer & ATS Readiness Engine
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
          Upload your academic resume in PDF format. Our parser extracts technical keywords across programming, cloud, database, and system design taxonomies and scores alignment against target tech roles.
        </p>
      </div>

      {/* Uploader Card */}
      <ResumeUploader onAnalyze={handleAnalyzeResume} loading={loading} />

      {/* Analysis Results View */}
      {loading ? (
        <LoadingSpinner text="Extracting text layers, checking ATS keywords, and scoring match..." />
      ) : analysisResult ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ATS Score */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  ATS Compliance Score
                </span>
                <span className="text-3xl font-black text-blue-600 mt-1 block">
                  {analysisResult.ats_score} / 100
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {analysisResult.ats_score >= 80
                    ? 'Excellent ATS readability'
                    : 'Good format, minor keyword gaps'}
                </p>
              </div>

              <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-blue-600 flex items-center justify-center font-black text-blue-700 text-lg">
                {analysisResult.ats_score}%
              </div>
            </div>

            {/* Role Match */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Target Role Match
                </span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">
                  {analysisResult.match_percentage}%
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">{analysisResult.target_role}</p>
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-600 flex items-center justify-center font-black text-emerald-700 text-lg">
                {analysisResult.match_percentage}%
              </div>
            </div>

            {/* Word Count & Health */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Document Metrics
                </span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {analysisResult.total_words}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Total words parsed from {analysisResult.filename}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Detected Strengths in Resume
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {analysisResult.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Suggestions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Actionable Optimization Recommendations
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {analysisResult.suggestions?.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Skills Highlight */}
          {analysisResult.missing_skills?.length > 0 && (
            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Critical Missing Keywords for {analysisResult.target_role}
                </h4>
              </div>
              <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                Adding verified experience with these technologies will significantly improve your automated ATS screening match:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_skills.map((skill, idx) => (
                  <Badge key={idx} variant="warning" size="sm">
                    + {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Detected Skills Breakdown by Category */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Detected Technical Skills Taxonomy ({analysisResult.detected_skills?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Categorized keywords extracted directly from the parsed document layers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysisResult.category_breakdown || {}).map(([cat, skills]) => (
                <div key={cat} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <span className="text-xs font-bold text-slate-800 block mb-2">{cat}</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.length > 0 ? (
                      skills.map((s, idx) => (
                        <Badge key={idx} variant="primary" size="xs">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None detected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResumeAnalyzerPage;
