import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import {
  Bird,
  LogOut,
  Mic,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Home,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, onClick: () => navigate('/dashboard') },
    { id: 'interview', label: 'Start Interview', icon: Mic, onClick: () => navigate('/dashboard/interview') },
    { id: 'resume', label: 'Resume Review', icon: FileText, onClick: () => navigate('/dashboard/resume') },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, onClick: () => navigate('/dashboard/analytics') },
    { id: 'settings', label: 'Settings', icon: Settings, onClick: () => navigate('/dashboard/settings') },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Update active nav based on current path
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveNav('dashboard');
    } else if (path.includes('interview')) {
      setActiveNav('interview');
    } else if (path.includes('resume')) {
      setActiveNav('resume');
    } else if (path.includes('analytics')) {
      setActiveNav('analytics');
    } else if (path.includes('settings')) {
      setActiveNav('settings');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 border-4 border-[#FF6B2C] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed, No Scrolling */}
      <div
        className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Content - All fixed height sections */}
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <Bird className="h-8 w-8 text-[#FF6B2C]" />
              <span className="font-mono text-xl font-bold">PrepAxis</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-[#FF6B2C] flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-bold truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs font-mono text-gray-600 line-clamp-2">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation - Fixed Height, No Scroll */}
          <nav className="flex-1 p-4 space-y-2 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    item.onClick();
                    setActiveNav(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all ${
                    activeNav === item.id
                      ? 'bg-[#FF6B2C]/10 text-[#FF6B2C] border-l-4 border-[#FF6B2C]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeNav === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </nav>

          {/* Help & Logout - Fixed at Bottom */}
          <div className="border-t border-gray-200 p-4 space-y-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-gray-700 hover:bg-gray-100 transition-all"
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              <span>Help & Support</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-red-600 hover:bg-red-50 transition-all border border-red-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="hidden md:block font-mono text-2xl font-bold ml-4">Dashboard</h1>
            <div className="ml-auto text-right">
              <p className="text-xs font-mono text-gray-600">Last updated: Today</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
