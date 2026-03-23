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
        {/* Home page */}
        <Route path="/" element={<MynaHero />} />
        
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />          {/* /dashboard = home */}
          <Route path="interview" element={<InterviewPage />} /> {/* /dashboard/interview */}
          <Route path="resume" element={<ResumePage />} />       {/* /dashboard/resume */}
          <Route path="analytics" element={<AnalyticsPage />} /> {/* /dashboard/analytics */}
          <Route path="settings" element={<SettingsPage />} />   {/* /dashboard/settings */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

