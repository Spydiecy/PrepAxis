import React from 'react';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Zap, FileText, ArrowRight } from 'lucide-react';

const DashboardHome: React.FC = () => {
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

      {/* Empty State for Recent Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mb-2">
          <h3 className="text-lg font-mono font-bold mb-1">Recent Interviews</h3>
          <p className="font-mono text-xs text-gray-600">
            Review your recent practice sessions and track improvements
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center"
        >
          <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="font-mono text-sm font-semibold text-gray-600 mb-1">No interviews yet</p>
          <p className="font-mono text-xs text-gray-500 mb-3">Start your first interview to see results here</p>
          <button className="font-mono font-bold text-sm text-[#FF6B2C] hover:text-[#d95500]">
            Start Practice →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
