import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-mono font-bold mb-2">Analytics</h2>
        <p className="text-lg font-mono text-gray-600 mb-8">
          Track your interview performance and progress
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-[#FF6B2C] rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold">Average Score</h3>
              <TrendingUp className="h-5 w-5 text-[#FF6B2C]" />
            </div>
            <p className="text-4xl font-mono font-bold text-[#FF6B2C]">78%</p>
            <p className="font-mono text-sm text-gray-600 mt-2">+5% from last month</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold">Interviews</h3>
              <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-4xl font-mono font-bold">24</p>
            <p className="font-mono text-sm text-gray-600 mt-2">Total completed</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold">Best Score</h3>
              <Target className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-4xl font-mono font-bold">92%</p>
            <p className="font-mono text-sm text-gray-600 mt-2">Achieved last week</p>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50"
        >
          <h3 className="text-2xl font-mono font-bold mb-6">Performance Over Time</h3>
          <div className="h-64 flex items-end gap-4">
            {[65, 72, 68, 75, 80, 78].map((score, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${score}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-[#FF6B2C] rounded-t-lg opacity-80 hover:opacity-100"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 font-mono text-sm text-gray-600">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
            <span>Week 6</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
