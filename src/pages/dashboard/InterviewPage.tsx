import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

const InterviewPage: React.FC = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-mono font-bold mb-2">Start Interview</h2>
        <p className="text-lg font-mono text-gray-600 mb-8">
          Practice with AI-powered mock interviews
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-[#FF6B2C] rounded-lg p-8 bg-[#FF6B2C]/5"
          >
            <Mic className="h-12 w-12 text-[#FF6B2C] mb-4" />
            <h3 className="text-2xl font-mono font-bold mb-2">Voice Interview</h3>
            <p className="font-mono text-gray-600 mb-4">
              Practice speaking and get feedback on your communication skills
            </p>
            <button className="font-mono font-bold text-[#FF6B2C] hover:text-[#d95500]">
              Start Practice →
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50"
          >
            <Mic className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-2xl font-mono font-bold mb-2">Text Interview</h3>
            <p className="font-mono text-gray-600 mb-4">
              Answer questions in text format and improve your written communication
            </p>
            <button className="font-mono font-bold text-gray-600 hover:text-[#FF6B2C]">
              Start Practice →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewPage;
