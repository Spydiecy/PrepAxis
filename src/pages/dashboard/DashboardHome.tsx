import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Zap, FileText, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getReviewHistory, ResumeReviewRecord } from '../../services/apiService';
import { useApp } from '../../AppContext';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, t } = useApp();
  const [userId, setUserId] = useState<string | null>(null);
  const [recentReviews, setRecentReviews] = useState<ResumeReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const loadReviews = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const reviews = await getReviewHistory(userId, 3);
    setRecentReviews(reviews);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) loadReviews();
  }, [userId, loadReviews]);

  // Dark mode classes
  const dkText = darkMode ? 'text-gray-300' : 'text-gray-600';
  const dkCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';
  const dkCardHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const dkTitle = darkMode ? 'text-white' : 'text-gray-900';
  const dkSub = darkMode ? 'text-gray-400' : 'text-gray-600';
  const dkEmpty = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300';

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-3">
        <p className={`text-xs font-mono ${dkText}`}>
          {t('welcomeSub') || 'Welcome to PrepAxis. Start your interview preparation journey with AI-powered practice.'}
        </p>
      </motion.div>

      {/* Action Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">

        {/* Interview */}
        <motion.button onClick={() => navigate('/dashboard/interview')}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5 hover:bg-[#FF6B2C]/10 transition-all text-left">
          <div className="flex items-start justify-between mb-2">
            <Mic className="h-6 w-6 text-[#FF6B2C]" />
            <ArrowRight className="h-4 w-4 text-[#FF6B2C] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </div>
          <h3 className={`text-base font-mono font-bold mb-1 ${dkTitle}`}>
            {t('startInterview') || 'Start Interview'}
          </h3>
          <p className={`text-xs font-mono ${dkSub}`}>
            {t('startInterviewSub') || 'Practice with AI-powered mock interviews and get instant feedback'}
          </p>
        </motion.button>

        {/* Resume */}
        <motion.button onClick={() => navigate('/dashboard/resume')}
          whileHover={{ scale: 1.02, y: -5 }}
          className={`group border-2 rounded-lg p-4 transition-all text-left ${darkMode ? 'border-gray-600 bg-gray-800 hover:border-[#FF6B2C] hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C]'}`}>
          <div className="flex items-start justify-between mb-2">
            <FileText className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} group-hover:text-[#FF6B2C]`} />
            <ArrowRight className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1`} />
          </div>
          <h3 className={`text-base font-mono font-bold mb-1 ${dkTitle}`}>
            {t('resumeReview') || 'Resume Review'}
          </h3>
          <p className={`text-xs font-mono ${dkSub}`}>
            {t('resumeReviewSub') || 'Upload your resume for AI analysis and personalized suggestions'}
          </p>
        </motion.button>

        {/* Analytics */}
        <motion.button onClick={() => navigate('/dashboard/analytics')}
          whileHover={{ scale: 1.02, y: -5 }}
          className={`group border-2 rounded-lg p-4 transition-all text-left ${darkMode ? 'border-gray-600 bg-gray-800 hover:border-[#FF6B2C] hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C]'}`}>
          <div className="flex items-start justify-between mb-2">
            <TrendingUp className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} group-hover:text-[#FF6B2C]`} />
            <ArrowRight className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1`} />
          </div>
          <h3 className={`text-base font-mono font-bold mb-1 ${dkTitle}`}>
            {t('analytics') || 'Analytics'}
          </h3>
          <p className={`text-xs font-mono ${dkSub}`}>
            {t('analyticsSub') || 'Track your progress with detailed performance metrics and insights'}
          </p>
        </motion.button>
      </motion.div>

      {/* Recent Reviews */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="mb-2">
          <h3 className={`text-lg font-mono font-bold mb-1 ${dkTitle}`}>
            {t('recentReviews') || 'Recent Resume Reviews'}
          </h3>
          <p className={`font-mono text-xs ${dkSub}`}>
            {t('recentReviewsSub') || 'Your latest AI-powered resume analyses'}
          </p>
        </div>

        {loading ? (
          <div className={`border-2 ${dkEmpty} rounded-lg p-6 text-center`}>
            <p className={`font-mono text-sm ${dkText}`}>Loading reviews...</p>
          </div>
        ) : recentReviews.length > 0 ? (
          <div className="space-y-2">
            {recentReviews.map((review) => (
              <motion.div key={review.id} whileHover={{ scale: 1.01 }}
                onClick={() => navigate('/dashboard/resume')}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/dashboard/resume'); }}
                className={`border-2 ${dkCard} rounded-lg p-3 ${dkCardHover} cursor-pointer transition-all`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-mono text-xs font-semibold ${dkTitle}`}>{review.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className={`h-3 w-3 ${dkText}`} />
                      <p className={`font-mono text-xs ${dkText}`}>
                        {review.timestamp.toLocaleDateString()} • {review.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-mono text-sm font-bold text-[#FF6B2C]">{review.atsScore}%</p>
                    <p className={`font-mono text-xs ${dkText}`}>ATS Score</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div whileHover={{ scale: 1.01 }}
            className={`border-2 border-dashed ${dkEmpty} rounded-lg p-6 text-center`}>
            <Zap className={`h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-2`} />
            <p className={`font-mono text-sm font-semibold ${dkText} mb-1`}>
              {t('noReviews') || 'No reviews yet'}
            </p>
            <p className={`font-mono text-xs ${dkSub} mb-3`}>
              {t('noReviewsSub') || 'Upload your resume to get AI-powered feedback'}
            </p>
            <button onClick={() => navigate('/dashboard/resume')}
              className="font-mono font-bold text-sm text-[#FF6B2C] hover:text-[#d95500]">
              {t('startReview') || 'Start Review →'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;