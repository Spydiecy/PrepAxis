import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Target, Zap, Mic } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getReviewHistory, ResumeReviewRecord } from '../../services/apiService';

// Helper function to get trend color classes
const getTrendColorClasses = (trend: number) => {
  if (trend > 0) return { border: 'border-green-300', bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-600' };
  if (trend < 0) return { border: 'border-red-300', bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-600' };
  return { border: 'border-gray-300', bg: 'bg-gray-50', icon: 'text-gray-600', text: 'text-gray-600' };
};

const AnalyticsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ResumeReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    improvementTrend: 0,
  });

  // Get current user ID when component loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch reviews and calculate statistics
  const loadReviewsAndStats = useCallback(async () => {
    setLoading(true);
    if (!userId) return;

    const allReviews = await getReviewHistory(userId, 50);
    setReviews(allReviews);

    if (allReviews.length === 0) {
      setLoading(false);
      return;
    }

    // Calculate statistics
    const scores = allReviews.map((r) => r.atsScore);
    const totalReviews = allReviews.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Calculate improvement trend (last 3 vs first 3)
    let improvementTrend = 0;
    if (allReviews.length >= 3) {
      const lastThree = scores.slice(0, 3);
      const firstThree = scores.slice(-3);
      const lastAvg = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
      const firstAvg = firstThree.reduce((a, b) => a + b, 0) / firstThree.length;
      improvementTrend = Math.round(lastAvg - firstAvg);
    }

    setStats({
      totalReviews,
      averageScore,
      bestScore,
      worstScore,
      improvementTrend,
    });

    setLoading(false);
  }, [userId]);

  // Load reviews and calculate stats when user ID is available
  useEffect(() => {
    if (userId) {
      loadReviewsAndStats();
    }
  }, [userId, loadReviewsAndStats]);

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, isTrend = false) => {
    let borderClass = 'border-gray-300';
    let bgClass = 'bg-white';
    let valueClass = 'text-gray-800';

    if (isTrend) {
      const colorClasses = getTrendColorClasses(Number(value));
      borderClass = `border-${colorClasses.border.split('-')[1]}-${colorClasses.border.split('-')[2]}`;
      bgClass = colorClasses.bg;
      valueClass = colorClasses.text;
    } else if (title === 'Avg Score') {
      borderClass = 'border-[#FF6B2C]';
      bgClass = 'bg-[#FF6B2C]/5';
      valueClass = 'text-[#FF6B2C]';
    } else if (title === 'Best Score') {
      borderClass = 'border-green-300';
      bgClass = 'bg-green-50';
      valueClass = 'text-green-600';
    }

    return (
      <motion.div
        key={title}
        whileHover={{ scale: 1.02 }}
        className={`border-2 ${borderClass} rounded-lg p-4 ${bgClass}`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-xs text-gray-600">{title}</p>
          {icon}
        </div>
        <p className={`font-mono text-2xl font-bold ${valueClass}`}>{value}</p>
      </motion.div>
    );
  };

  const renderChartData = () => {
    return reviews
      .slice(0, 20)
      .reverse()
      .map((review, idx) => ({
        name: `Review ${idx + 1}`,
        score: review.atsScore,
      }));
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <p className="text-xs font-mono text-gray-600 mb-3">
          Track your interview performance and progress
        </p>

        {/* Resume Reviews Analytics Section */}
        <div className="mb-3">
          <h3 className="text-base font-mono font-bold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#FF6B2C]" />
            Resume Review Analytics
          </h3>

          {renderResumeAnalytics()}

          {/* Score Progression Chart */}
          {reviews.length > 0 && renderScoreChart()}
        </div>

        {/* Interview Analytics Section */}
        <div>
          <h3 className="text-base font-mono font-bold mb-3 flex items-center gap-2">
            <Mic className="h-5 w-5 text-gray-600" />
            Interview Analytics
          </h3>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center"
          >
            <Mic className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-mono text-sm font-semibold text-gray-600 mb-1">No interview data yet</p>
            <p className="font-mono text-xs text-gray-500">
              Complete practice interviews to see your performance analytics
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  function renderResumeAnalytics() {
    if (loading) {
      return (
        <motion.div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
          <p className="font-mono text-sm text-gray-600">Loading stats...</p>
        </motion.div>
      );
    }

    if (stats.totalReviews === 0) {
      return renderEmptyState();
    }

    return renderStatsCards();
  }

  function renderEmptyState() {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center"
      >
        <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="font-mono text-sm font-semibold text-gray-600 mb-1">No resume reviews yet</p>
        <p className="font-mono text-xs text-gray-500">Upload and analyze resumes to see your analytics</p>
      </motion.div>
    );
  }

  function renderStatsCards() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {renderStatCard('Total Reviews', stats.totalReviews, <Target className="h-4 w-4 text-[#FF6B2C]" />)}
        {renderStatCard('Avg Score', `${stats.averageScore}%`, <TrendingUp className="h-4 w-4 text-[#FF6B2C]" />)}
        {renderStatCard('Best Score', `${stats.bestScore}%`, <Award className="h-4 w-4 text-green-600" />)}
        {renderTrendCard()}
      </div>
    );
  }

  function renderTrendCard() {
    const colors = getTrendColorClasses(stats.improvementTrend);
    const borderClass = `border-${colors.border.split('-')[1]}-${colors.border.split('-')[2]}`;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`border-2 ${borderClass} rounded-lg p-4 ${colors.bg}`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-xs text-gray-600">Trend</p>
          <Zap className={`h-4 w-4 ${colors.icon}`} />
        </div>
        <p className={`font-mono text-2xl font-bold ${colors.text}`}>
          {stats.improvementTrend > 0 ? '+' : ''}
          {stats.improvementTrend}%
        </p>
      </motion.div>
    );
  }

  function renderScoreChart() {
    const chartData = renderChartData();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-gray-300 rounded-lg p-4 bg-white"
      >
        <h4 className="font-mono font-bold text-sm mb-4">Score Progression</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d1d5db" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d1d5db" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #FF6B2C',
                borderRadius: '6px',
                padding: '8px',
              }}
              labelStyle={{ color: '#FF6B2C', fontSize: '12px', fontFamily: 'monospace' }}
              formatter={(value: unknown) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [`${numValue}%`, 'Score'];
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FF6B2C"
              dot={{ fill: '#FF6B2C', r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="font-mono text-xs text-gray-500 mt-3 text-center">Last {Math.min(20, reviews.length)} reviews</p>
      </motion.div>
    );
  }
};

export default AnalyticsPage;
