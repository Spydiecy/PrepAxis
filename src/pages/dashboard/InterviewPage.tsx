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
        className="mb-3"
      >
        <p className="text-xs font-mono text-gray-600 mb-3">
          Practice with AI-powered mock interviews
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5"
          >
            <Mic className="h-6 w-6 text-[#FF6B2C] mb-2" />
            <h3 className="text-base font-mono font-bold mb-1">Voice Interview</h3>
            <p className="font-mono text-xs text-gray-600 mb-3">
              Practice speaking and get feedback on your communication skills
            </p>
            <button className="font-mono font-bold text-sm text-[#FF6B2C] hover:text-[#d95500]">
              Start Practice →
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
          >
            <Mic className="h-6 w-6 text-gray-600 mb-2" />
            <h3 className="text-base font-mono font-bold mb-1">Text Interview</h3>
            <p className="font-mono text-xs text-gray-600 mb-3">
              Answer questions in text format and improve your written communication
            </p>
            <button className="font-mono font-bold text-sm text-gray-600 hover:text-[#FF6B2C]">
              Start Practice →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewPage;
