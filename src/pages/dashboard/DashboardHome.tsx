import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Zap, FileText, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getReviewHistory, ResumeReviewRecord } from '../../services/firestoreService';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [recentReviews, setRecentReviews] = useState<ResumeReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current user ID when component loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch recent reviews from Firestore
  const loadReviews = useCallback(async () => {
    setLoading(true);
    if (!userId) return;
    const reviews = await getReviewHistory(userId, 3);
    setRecentReviews(reviews);
    setLoading(false);
  }, [userId]);

  // Load recent resume reviews when user ID is available
  useEffect(() => {
    if (userId) {
      loadReviews();
    }
  }, [userId, loadReviews]);

  return (
    <div>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <p className="text-xs font-mono text-gray-600">
          Welcome to PrepAxis. Start your interview preparation journey with AI-powered practice.
        </p>
      </motion.div>

      {/* Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
      >
        <motion.button
          onClick={() => navigate('/dashboard/interview')}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5 hover:bg-[#FF6B2C]/10 transition-all text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <Mic className="h-6 w-6 text-[#FF6B2C]" />
            <ArrowRight className="h-4 w-4 text-[#FF6B2C] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-mono font-bold mb-1">Start Interview</h3>
          <p className="text-xs font-mono text-gray-600">
            Practice with AI-powered mock interviews and get instant feedback
          </p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/dashboard/resume')}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group border-2 border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C] transition-all text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <FileText className="h-6 w-6 text-gray-600 group-hover:text-[#FF6B2C]" />
            <ArrowRight className="h-4 w-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-mono font-bold mb-1">Resume Review</h3>
          <p className="text-xs font-mono text-gray-600">
            Upload your resume for AI analysis and personalized suggestions
          </p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/dashboard/analytics')}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group border-2 border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 hover:border-[#FF6B2C] transition-all text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <TrendingUp className="h-6 w-6 text-gray-600 group-hover:text-[#FF6B2C]" />
            <ArrowRight className="h-4 w-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-[#FF6B2C] transition-opacity transform group-hover:translate-x-1" />
          </div>
          <h3 className="text-base font-mono font-bold mb-1">Analytics</h3>
          <p className="text-xs font-mono text-gray-600">
            Track your progress with detailed performance metrics and insights
          </p>
        </motion.button>
      </motion.div>

      {/* Recent Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mb-2">
          <h3 className="text-lg font-mono font-bold mb-1">Recent Resume Reviews</h3>
          <p className="font-mono text-xs text-gray-600">
            Your latest AI-powered resume analyses
          </p>
        </div>

        {renderRecentReviews()}
      </motion.div>
    </div>
  );

  function renderRecentReviews() {
    if (loading) {
      return (
        <motion.div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
          <p className="font-mono text-sm text-gray-600">Loading reviews...</p>
        </motion.div>
      );
    }

    if (recentReviews.length > 0) {
      return (
        <div className="space-y-2">
          {recentReviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate('/dashboard/resume')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/dashboard/resume');
                }
              }}
              className="border-2 border-gray-300 rounded-lg p-3 bg-white hover:bg-gray-50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-mono text-xs font-semibold text-gray-800">{review.fileName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="font-mono text-xs text-gray-500">
                      {review.timestamp.toLocaleDateString()} • {review.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="font-mono text-sm font-bold text-[#FF6B2C]">{review.atsScore}%</p>
                  <p className="font-mono text-xs text-gray-500">ATS Score</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center"
      >
        <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="font-mono text-sm font-semibold text-gray-600 mb-1">No reviews yet</p>
        <p className="font-mono text-xs text-gray-500 mb-3">Upload your resume to get AI-powered feedback</p>
        <button
          onClick={() => navigate('/dashboard/resume')}
          className="font-mono font-bold text-sm text-[#FF6B2C] hover:text-[#d95500]"
        >
          Start Review →
        </button>
      </motion.div>
    );
  }
};

export default DashboardHome;
