import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import {
  Bird,
  LogOut,
  Mic,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Target,
  Menu,
  X,
} from 'lucide-react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface Interview {
  id: string;
  title: string;
  date: string;
  score: number;
  type: 'voice' | 'text';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data for interviews
  const recentInterviews: Interview[] = [
    {
      id: '1',
      title: 'Behavioral Interview - Leadership',
      date: 'Today',
      score: 85,
      type: 'voice',
    },
    {
      id: '2',
      title: 'Technical Interview - System Design',
      date: 'Yesterday',
      score: 78,
      type: 'text',
    },
    {
      id: '3',
      title: 'HR Interview - Culture Fit',
      date: '3 days ago',
      score: 92,
      type: 'voice',
    },
  ];

  const stats = [
    { label: 'Total Interviews', value: '12', icon: Mic },
    { label: 'Average Score', value: '84', icon: TrendingUp },
    { label: 'Improvement', value: '+8%', icon: Zap },
    { label: 'Resume Reviews', value: '3', icon: FileText },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bird className="h-8 w-8 text-[#FF6B2C]" />
              <span className="font-mono text-xl font-bold">PrepAxis</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-[#FF6B2C]"
                />
              )}
              <div>
                <p className="text-sm font-mono font-bold">
                  {user.displayName || user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 mt-4 pt-4">
              <div className="flex flex-col gap-4">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-[#FF6B2C]"
                  />
                )}
                <p className="text-sm font-mono font-bold">
                  {user.displayName || user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-mono font-bold text-[#FF6B2C] hover:text-[#d95500]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-mono font-bold mb-2">
            Welcome back, {user.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg font-mono text-gray-600">
            Ready to ace your next interview? Let's practice!
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#FF6B2C] transition-colors bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-gray-600">
                    {stat.label}
                  </span>
                  <Icon className="h-5 w-5 text-[#FF6B2C]" />
                </div>
                <p className="text-3xl font-mono font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Start Interview Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => navigate('/interview')}
            className="group border-2 border-[#FF6B2C] rounded-lg p-8 bg-[#FF6B2C]/5 hover:bg-[#FF6B2C]/10 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <Mic className="h-8 w-8 text-[#FF6B2C]" />
              <ArrowRight className="h-5 w-5 text-[#FF6B2C] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">Start Interview</h3>
            <p className="text-sm font-mono text-gray-600">
              Practice with AI-powered mock interviews and get instant feedback
            </p>
          </motion.button>

          {/* Resume Review Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => navigate('/resume')}
            className="group border-2 border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C] transition-all text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-8 w-8 text-gray-600 group-hover:text-[#FF6B2C]" />
              <ArrowRight className="h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">Resume Review</h3>
            <p className="text-sm font-mono text-gray-600">
              Upload your resume for AI analysis and personalized suggestions
            </p>
          </motion.button>

          {/* Performance Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => navigate('/analytics')}
            className="group border-2 border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C] transition-all text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-gray-600 group-hover:text-[#FF6B2C]" />
              <ArrowRight className="h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">Analytics</h3>
            <p className="text-sm font-mono text-gray-600">
              Track your progress with detailed performance metrics and insights
            </p>
          </motion.button>
        </motion.div>

        {/* Recent Interviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-3xl font-mono font-bold mb-2">Recent Interviews</h2>
            <p className="font-mono text-gray-600">
              Review your recent practice sessions and track improvements
            </p>
          </div>

          <div className="space-y-4">
            {recentInterviews.map((interview, idx) => (
              <motion.div
                key={interview.id}
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * idx }}
                className="border border-gray-200 rounded-lg p-6 hover:border-[#FF6B2C] hover:shadow-lg transition-all group cursor-pointer bg-white"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:flex-1">
                    <div className="p-3 bg-[#FF6B2C]/10 rounded-lg flex-shrink-0">
                      {interview.type === 'voice' ? (
                        <Mic className="h-6 w-6 text-[#FF6B2C]" />
                      ) : (
                        <FileText className="h-6 w-6 text-[#FF6B2C]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-mono font-bold mb-1">
                        {interview.title}
                      </h3>
                      <p className="text-sm font-mono text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {interview.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-3xl font-mono font-bold text-[#FF6B2C]">
                          {interview.score}
                        </p>
                        <p className="text-xs font-mono text-gray-600">/100</p>
                      </div>
                      {interview.score >= 80 ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                      ) : (
                        <Target className="h-8 w-8 text-orange-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full mt-6 border-2 border-gray-300 rounded-lg p-4 font-mono font-bold hover:border-[#FF6B2C] hover:bg-[#FF6B2C]/5 transition-all flex items-center justify-center gap-2"
          >
            View All Interviews
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* Featured Tip Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 border-l-4 border-[#FF6B2C] bg-[#FF6B2C]/5 rounded-r-lg p-8"
        >
          <h3 className="text-2xl font-mono font-bold mb-3 flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#FF6B2C]" />
            Pro Tip
          </h3>
          <p className="font-mono text-gray-700 mb-4">
            Use the STAR method for behavioral questions: Situation, Task, Action, Result. 
            Practice explaining your accomplishments concisely and with specific metrics.
          </p>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 font-mono font-bold text-[#FF6B2C] hover:text-[#d95500] transition-colors"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
