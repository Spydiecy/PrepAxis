import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Target, Zap, Mic } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getReviewHistory, ResumeReviewRecord } from '../../services/apiService';
import { useApp } from '../../AppContext';

const AnalyticsPage: React.FC = () => {
  const { darkMode, t } = useApp();
  const [userId, setUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ResumeReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalReviews: 0, averageScore: 0, bestScore: 0, worstScore: 0, improvementTrend: 0 });

  // Dark mode classes
  const dkBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const dkBorder = darkMode ? 'border-gray-700' : 'border-gray-300';
  const dkText = darkMode ? 'text-gray-300' : 'text-gray-600';
  const dkTitle = darkMode ? 'text-white' : 'text-gray-800';
  const dkEmpty = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300';
  const dkChart = darkMode ? '#374151' : '#e5e7eb';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const loadReviewsAndStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const allReviews = await getReviewHistory(userId, 50);
    setReviews(allReviews);
    if (allReviews.length === 0) { setLoading(false); return; }
    const scores = allReviews.map(r => r.atsScore);
    const totalReviews = allReviews.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    let improvementTrend = 0;
    if (allReviews.length >= 3) {
      const lastThree = scores.slice(0, 3);
      const firstThree = scores.slice(-3);
      const lastAvg = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
      const firstAvg = firstThree.reduce((a, b) => a + b, 0) / firstThree.length;
      improvementTrend = Math.round(lastAvg - firstAvg);
    }
    setStats({ totalReviews, averageScore, bestScore, worstScore, improvementTrend });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) loadReviewsAndStats();
  }, [userId, loadReviewsAndStats]);

  const chartData = reviews.slice(0, 20).reverse().map((review, idx) => ({
    name: `#${idx + 1}`,
    score: review.atsScore,
  }));

  const trendColor = stats.improvementTrend > 0 ? 'text-green-500 border-green-400 bg-green-900/20' : stats.improvementTrend < 0 ? 'text-red-500 border-red-400 bg-red-900/20' : `${dkText} ${dkBorder} ${dkBg}`;
  const trendColorLight = stats.improvementTrend > 0 ? 'text-green-600 border-green-300 bg-green-50' : stats.improvementTrend < 0 ? 'text-red-600 border-red-300 bg-red-50' : 'text-gray-600 border-gray-300 bg-gray-50';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-3">
        <p className={`text-xs font-mono ${dkText} mb-3`}>
          {t('analyticsSub') || 'Track your interview performance and progress'}
        </p>

        {/* Resume Analytics */}
        <div className="mb-3">
          <h3 className={`text-base font-mono font-bold mb-3 flex items-center gap-2 ${dkTitle}`}>
            <BarChart3 className="h-5 w-5 text-[#FF6B2C]" />
            {t('resumeReview') || 'Resume'} Analytics
          </h3>

          {loading ? (
            <div className={`border-2 ${dkEmpty} rounded-lg p-6 text-center`}>
              <p className={`font-mono text-sm ${dkText}`}>Loading stats...</p>
            </div>
          ) : stats.totalReviews === 0 ? (
            <motion.div whileHover={{ scale: 1.01 }}
              className={`border-2 border-dashed ${dkEmpty} rounded-lg p-6 text-center`}>
              <Zap className={`h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-2`} />
              <p className={`font-mono text-sm font-semibold ${dkText} mb-1`}>No resume reviews yet</p>
              <p className={`font-mono text-xs ${dkText}`}>Upload and analyze resumes to see your analytics</p>
            </motion.div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {[
                  { title: 'Total Reviews', value: stats.totalReviews, icon: <Target className="h-4 w-4 text-[#FF6B2C]" />, cls: darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white', valCls: darkMode ? 'text-white' : 'text-gray-800' },
                  { title: 'Avg Score', value: `${stats.averageScore}%`, icon: <TrendingUp className="h-4 w-4 text-[#FF6B2C]" />, cls: 'border-[#FF6B2C] bg-[#FF6B2C]/5', valCls: 'text-[#FF6B2C]' },
                  { title: 'Best Score', value: `${stats.bestScore}%`, icon: <Award className="h-4 w-4 text-green-500" />, cls: darkMode ? 'border-green-700 bg-green-900/20' : 'border-green-300 bg-green-50', valCls: 'text-green-500' },
                ].map(({ title, value, icon, cls, valCls }) => (
                  <motion.div key={title} whileHover={{ scale: 1.02 }} className={`border-2 ${cls} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-mono text-xs ${dkText}`}>{title}</p>
                      {icon}
                    </div>
                    <p className={`font-mono text-2xl font-bold ${valCls}`}>{value}</p>
                  </motion.div>
                ))}

                {/* Trend card */}
                <motion.div whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-lg p-4 ${darkMode ? trendColor : trendColorLight}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-mono text-xs ${dkText}`}>Trend</p>
                    <Zap className="h-4 w-4 text-[#FF6B2C]" />
                  </div>
                  <p className={`font-mono text-2xl font-bold ${darkMode ? trendColor.split(' ')[0] : trendColorLight.split(' ')[0]}`}>
                    {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend}%
                  </p>
                </motion.div>
              </div>

              {/* Chart */}
              {reviews.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`border-2 ${dkBorder} rounded-lg p-4 ${dkBg}`}>
                  <h4 className={`font-mono font-bold text-sm mb-4 ${dkTitle}`}>Score Progression</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dkChart} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} stroke={dkChart} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} stroke={dkChart} />
                      <Tooltip
                        contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: '2px solid #FF6B2C', borderRadius: '6px', padding: '8px' }}
                        labelStyle={{ color: '#FF6B2C', fontSize: '12px', fontFamily: 'monospace' }}
                        formatter={(value: unknown) => [`${value}%`, 'Score']} />
                      <Line type="monotone" dataKey="score" stroke="#FF6B2C"
                        dot={{ fill: '#FF6B2C', r: 5 }} activeDot={{ r: 7 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className={`font-mono text-xs ${dkText} mt-3 text-center`}>
                    Last {Math.min(20, reviews.length)} reviews
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Interview Analytics */}
        <div>
          <h3 className={`text-base font-mono font-bold mb-3 flex items-center gap-2 ${dkTitle}`}>
            <Mic className={`h-5 w-5 ${dkText}`} />
            {t('startInterview') || 'Interview'} Analytics
          </h3>
          <motion.div whileHover={{ scale: 1.01 }}
            className={`border-2 border-dashed ${dkEmpty} rounded-lg p-6 text-center`}>
            <Mic className={`h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-2`} />
            <p className={`font-mono text-sm font-semibold ${dkText} mb-1`}>No interview data yet</p>
            <p className={`font-mono text-xs ${dkText}`}>
              Complete practice interviews to see your performance analytics
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;