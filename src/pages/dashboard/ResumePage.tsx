import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { analyzeResumeWithGemini } from '../../services/geminiService';
import { storeReviewTimestamp, getReviewHistory, ResumeReviewRecord } from '../../services/firestoreService';

interface AnalysisResult {
  atsScore: number;
  atsDetails: string;
  suggestions: string[];
  updates: string[];
}

const ResumePage: React.FC = () => {
  // State: Track the selected PDF file
  const [file, setFile] = useState<File | null>(null);
  
  // State: Track if we're currently analyzing (to disable button while loading)
  const [analyzing, setAnalyzing] = useState(false);
  
  // State: Store the analysis results from Gemini API
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // State: Track any error messages to show user
  const [error, setError] = useState<string | null>(null);
  
  // State: Store list of past reviews from Firestore
  const [history, setHistory] = useState<ResumeReviewRecord[]>([]);

  // Load review history when page first loads
  useEffect(() => {
    loadHistory();
  }, []);

  // Fetch past reviews from Firestore database
  const loadHistory = async () => {
    const reviews = await getReviewHistory(5);
    setHistory(reviews);
  };

  // When user selects a file from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files?.[0]) return;
    
    const selectedFile = files[0];
    
    // Check if file is a PDF
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    
    if (isPdf) {
      setFile(selectedFile);      // Save the file
      setError(null);             // Clear any previous errors
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  // When user clicks the Analyze button
  const handleAnalyze = async () => {
    // Check if file was selected
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Show loading state
    setAnalyzing(true);
    setError(null);

    try {
      // Step 1: Send to Gemini API for analysis
      const analysis = await analyzeResumeWithGemini(file);
      
      // Step 2: Store results in React state to display
      setResult({
        atsScore: analysis.atsScore,
        atsDetails: analysis.atsDetails,
        suggestions: analysis.suggestions,
        updates: analysis.updates,
      });

      // Step 3: Save review to Firestore (for college project documentation)
      await storeReviewTimestamp(analysis.atsScore, file.name);
      
      // Step 4: Refresh the history list
      await loadHistory();
    } catch (err) {
      // Show error message if something went wrong
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
      setError(errorMessage);
      setResult(null);
    } finally {
      // Hide loading state
      setAnalyzing(false);
    }
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
          Get AI-powered analysis of your resume with ATS optimization
        </p>

        {/* Upload Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 border-2 border-dashed border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5 text-center mb-3"
        >
          <Upload className="h-6 w-6 text-[#FF6B2C] mx-auto mb-2" />
          <h3 className="text-base font-mono font-bold mb-1">Upload Resume</h3>
          <p className="font-mono text-xs text-gray-600 mb-3">
            Upload your PDF resume for AI analysis
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={analyzing}
            />
            <span className="font-mono font-bold text-sm text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
              Select PDF File
            </span>
          </label>
          {file && (
            <p className="font-mono text-xs text-green-600 mt-2">✓ {file.name}</p>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg mb-3"
          >
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="font-mono text-xs text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Analyze Button */}
        {file && !result && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full font-mono font-bold text-sm py-2 px-4 bg-[#FF6B2C] text-white rounded-lg hover:bg-[#d95500] disabled:opacity-50 disabled:cursor-not-allowed mb-3 transition-colors"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        )}

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* ATS Score */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono font-bold text-sm">ATS Score</h3>
                <CheckCircle className="h-5 w-5 text-[#FF6B2C]" />
              </div>
              <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-2">
                {result.atsScore}%
              </p>
              <p className="font-mono text-xs text-gray-600">{result.atsDetails}</p>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-[#FF6B2C]" />
                <h3 className="font-mono font-bold text-sm">Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={`suggestion-${i}`} className="font-mono text-xs text-gray-700 flex gap-2">
                    <span className="text-[#FF6B2C]">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Updates */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="h-4 w-4 text-[#FF6B2C]" />
                <h3 className="font-mono font-bold text-sm">Recommended Updates</h3>
              </div>
              <ul className="space-y-2">
                {result.updates.map((update, i) => (
                  <li key={`update-${i}`} className="font-mono text-xs text-gray-700 flex gap-2">
                    <span className="text-[#FF6B2C]">→</span>
                    <span>{update}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* New Analysis Button */}
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
              }}
              className="w-full font-mono font-bold text-sm py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Analyze Another Resume
            </button>
          </motion.div>
        )}

        {/* Review History */}
        {history.length > 0 && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mt-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-600" />
              <h3 className="font-mono font-bold text-sm">Recent Reviews</h3>
            </div>
            <div className="space-y-2">
              {history.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-mono text-xs font-semibold">{review.fileName}</p>
                    <p className="font-mono text-xs text-gray-500">
                      {review.timestamp.toLocaleDateString()} {review.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#FF6B2C]">{review.atsScore}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResumePage;
