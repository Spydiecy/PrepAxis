import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MynaHero } from './components/ui/myna-hero';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import InterviewPage from './pages/dashboard/InterviewPage';
import ResumePage from './pages/dashboard/ResumePage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MynaHero />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

