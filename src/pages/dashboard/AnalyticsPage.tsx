import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
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

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center"
        >
          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="font-mono text-sm font-semibold text-gray-600 mb-1">No analytics data yet</p>
          <p className="font-mono text-xs text-gray-500">Complete interviews to see your analytics and performance insights</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
