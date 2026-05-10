import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import {
  Bird, LogOut, Mic, FileText, BarChart3, Settings,
  Menu, X, Home, HelpCircle, ChevronRight, ChevronLeft, User,
} from 'lucide-react';
import { useApp } from '../AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, userPhoto, userName, t } = useApp();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: t('dashboard') || 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'interview', label: t('startInterview') || 'Start Interview', icon: Mic, path: '/dashboard/interview' },
    { id: 'resume', label: t('resumeReview') || 'Resume Review', icon: FileText, path: '/dashboard/resume' },
    { id: 'analytics', label: t('analytics') || 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed.email || '');
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') setActiveNav('dashboard');
    else if (path.includes('interview')) setActiveNav('interview');
    else if (path.includes('resume')) setActiveNav('resume');
    else if (path.includes('analytics')) setActiveNav('analytics');
    else if (path.includes('settings')) setActiveNav('settings');
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Dark mode classes
  const dk = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const dkBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
  const dkHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const dkMain = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const dkHeader = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const dkText = darkMode ? 'text-gray-300' : 'text-gray-600';

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 border-4 border-[#FF6B2C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`min-h-screen flex ${dkMain}`}>
      {/* Sidebar */}
      <div className={`fixed md:relative h-screen ${dk} border-r ${dkBorder} z-50 transform transition-all duration-300 md:translate-x-0 overflow-hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${sidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className="h-full flex flex-col overflow-hidden">

          {/* Header */}
          <div className={`p-4 border-b ${dkBorder} flex-shrink-0 flex items-center justify-between`}>
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <Bird className="h-7 w-7 text-[#FF6B2C] flex-shrink-0" />
                <span className="font-mono text-lg font-bold whitespace-nowrap">PrepAxis</span>
              </div>
            )}
            {!sidebarExpanded && <Bird className="h-7 w-7 text-[#FF6B2C]" />}
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className={`hidden md:flex p-1 ${dkHover} rounded`}>
              {sidebarExpanded
                ? <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                : <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
            </button>
            <button onClick={() => setSidebarOpen(false)} className={`md:hidden p-2 ${dkHover} rounded-lg`}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          {sidebarExpanded && (
            <div className={`p-4 border-b ${dkBorder} flex-shrink-0`}>
              <div className="flex items-start gap-2">
                {userPhoto ? (
                  <img src={userPhoto} alt="User"
                    className="w-10 h-10 rounded-full border-2 border-[#FF6B2C] flex-shrink-0 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-[#FF6B2C] bg-[#FF6B2C]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#FF6B2C]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-bold truncate">{userName || userEmail}</p>
                  <p className={`text-xs font-mono ${dkText} line-clamp-2`}>{userEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: sidebarExpanded ? 5 : 0 }}
                  onClick={() => { navigate(item.path); setActiveNav(item.id); setSidebarOpen(false); }}
                  title={sidebarExpanded ? '' : item.label}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono font-bold transition-all ${
                    activeNav === item.id
                      ? 'bg-[#FF6B2C]/10 text-[#FF6B2C] border-l-4 border-[#FF6B2C] pl-2'
                      : `${darkMode ? 'text-gray-300' : 'text-gray-700'} ${dkHover}`
                  }`}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarExpanded && <span className="flex-1 text-left text-sm">{item.label}</span>}
                  {sidebarExpanded && activeNav === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className={`border-t ${dkBorder} px-3 py-2 space-y-1 flex-shrink-0`}>
            <motion.button whileHover={{ scale: 1.02 }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${dkHover} transition-all`}>
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span>Help & Support</span>}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-bold text-red-600 hover:bg-red-50 transition-all border border-red-200">
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span>Logout</span>}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button className="fixed inset-0 bg-black/50 z-40 md:hidden"
          type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`${dkHeader} border-b sticky top-0 z-30`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className={`md:hidden p-2 ${dkHover} rounded-lg`}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className={`hidden md:block font-mono text-2xl font-bold ml-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('dashboard') || 'Dashboard'}
            </h1>
            <div className="ml-auto text-right">
              <p className={`text-xs font-mono ${dkText}`}>{t('lastUpdated') || 'Last updated: Today'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 ${dkMain}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;