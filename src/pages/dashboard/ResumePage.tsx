import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, Zap } from 'lucide-react';

const ResumePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-mono font-bold mb-2">Resume Review</h2>
        <p className="text-lg font-mono text-gray-600 mb-8">
          Get AI-powered suggestions to improve your resume
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-2 border-2 border-dashed border-[#FF6B2C] rounded-lg p-12 bg-[#FF6B2C]/5 text-center"
          >
            <Upload className="h-12 w-12 text-[#FF6B2C] mx-auto mb-4" />
            <h3 className="text-2xl font-mono font-bold mb-2">Upload Resume</h3>
            <p className="font-mono text-gray-600 mb-6">
              Drag and drop your resume or click to select
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="font-mono font-bold text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Select File
              </span>
            </label>
            {file && (
              <p className="font-mono text-green-600 mt-4">✓ {file.name}</p>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50"
          >
            <FileCheck className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-mono font-bold mb-2">ATS Score</h3>
            <p className="font-mono text-gray-600 mb-6 text-sm">
              Check how your resume performs with Applicant Tracking Systems
            </p>
            <button className="w-full font-mono font-bold text-gray-600 hover:text-[#FF6B2C] py-2">
              Check →
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50"
          >
            <Zap className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-mono font-bold mb-2">Quick Tips</h3>
            <p className="font-mono text-gray-600 mb-6 text-sm">
              Get instant suggestions to boost your resume
            </p>
            <button className="w-full font-mono font-bold text-gray-600 hover:text-[#FF6B2C] py-2">
              View →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumePage;
