import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';

import DashboardPage from './pages/DashboardPage';
import StudentProfilePage from './pages/StudentProfilePage';
import SkillsAssessmentPage from './pages/SkillsAssessmentPage';
import PlacementOpportunitiesPage from './pages/PlacementOpportunitiesPage';
import InternshipOpportunitiesPage from './pages/InternshipOpportunitiesPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import PlacementAnalyticsPage from './pages/PlacementAnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path="/skills" element={<SkillsAssessmentPage />} />
              <Route path="/opportunities" element={<PlacementOpportunitiesPage />} />
              <Route path="/internships" element={<InternshipOpportunitiesPage />} />
              <Route path="/applications" element={<ApplicationTrackerPage />} />
              <Route path="/resume" element={<ResumeAnalyzerPage />} />
              <Route path="/analytics" element={<PlacementAnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AppProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
