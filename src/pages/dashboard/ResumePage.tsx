import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { analyzeResumeWithGemini } from '../../services/geminiService';
import { storeReviewTimestamp, getReviewHistory, ResumeReviewRecord } from '../../services/firestoreService';

interface AnalysisResult {
  atsScore: number;
  atsDetails: string;
  suggestions: string[];
  updates: string[];
}

const ResumePage: React.FC = () => {
  // State: Track the current user ID from Firebase Auth
  const [userId, setUserId] = useState<string | null>(null);
  
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
  
  // State: Track which previous review is selected to view details
  const [selectedReview, setSelectedReview] = useState<ResumeReviewRecord | null>(null);

  // Get current user ID when component loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Store user ID
      }
    });
    return unsubscribe;
  }, []);

  // Load review history when user ID is available
  useEffect(() => {
    if (userId) {
      loadHistory();
    }
  }, [userId]);

  // Fetch past reviews from Firestore database for this user
  const loadHistory = async () => {
    if (!userId) return;
    const reviews = await getReviewHistory(userId, 5);
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
    
    // Check if user is authenticated
    if (!userId) {
      setError('You must be logged in to analyze resumes');
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

      // Step 3: Save review to Firestore with user ID and additional details
      await storeReviewTimestamp(
        userId,
        analysis.atsScore,
        file.name,
        analysis.atsDetails,
        analysis.suggestions
      );
      
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

  // When user clicks on a previous review
  const handleOpenReview = (review: ResumeReviewRecord) => {
    // Convert the stored review into result format to display
    setSelectedReview(review);
    setResult({
      atsScore: review.atsScore,
      atsDetails: review.summary,
      suggestions: review.suggestions,
      updates: [], // Previous reviews don't have updates stored, so empty array
    });
    // Clear file selection since we're viewing a previous review
    setFile(null);
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

        {/* Review History - Display Below Upload Box */}
        {history.length > 0 && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-600" />
              <h3 className="font-mono font-bold text-sm">Your Previous Reviews</h3>
            </div>
            <div className="space-y-2">
              {history.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleOpenReview(review)}
                  className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-mono text-xs font-semibold text-gray-800">{review.fileName}</p>
                      <p className="font-mono text-xs text-gray-500 mt-1">
                        {review.timestamp.toLocaleDateString()} • {review.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#FF6B2C] ml-2">{review.atsScore}%</span>
                  </div>
                  {review.summary && (
                    <p className="font-mono text-xs text-gray-600 mb-2">{review.summary.substring(0, 100)}...</p>
                  )}
                  {review.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {review.suggestions.slice(0, 2).map((suggestion, i) => (
                        <span key={`${review.id}-suggestion-${i}`} className="inline-block bg-[#FF6B2C]/10 text-[#FF6B2C] text-xs font-mono px-2 py-1 rounded">
                          {suggestion.substring(0, 30)}...
                        </span>
                      ))}
                      {review.suggestions.length > 2 && (
                        <span className="inline-block text-xs font-mono text-gray-500 px-2 py-1">
                          +{review.suggestions.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {result && (
          <>
            {/* Modal Overlay for Previous Reviews */}
            {selectedReview && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => {
                    setSelectedReview(null);
                    setResult(null);
                  }}
                  aria-label="Close modal"
                />
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto z-50 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-3">
                    {/* Close Button */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-mono font-bold text-base">Review Details</h2>
                      <button
                        onClick={() => {
                          setSelectedReview(null);
                          setResult(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 font-bold text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
                      <p className="font-mono text-xs font-semibold text-gray-800">{selectedReview.fileName}</p>
                      <p className="font-mono text-xs text-gray-500 mt-1">
                        {selectedReview.timestamp.toLocaleDateString()} • {selectedReview.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

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
                    {selectedReview.suggestions.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="h-4 w-4 text-[#FF6B2C]" />
                          <h3 className="font-mono font-bold text-sm">Suggestions</h3>
                        </div>
                        <ul className="space-y-2">
                          {selectedReview.suggestions.map((suggestion, i) => (
                            <li key={`${selectedReview.id}-suggestion-${i}`} className="font-mono text-xs text-gray-700 flex gap-2">
                              <span className="text-[#FF6B2C]">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setSelectedReview(null);
                        setResult(null);
                      }}
                      className="w-full font-mono font-bold text-sm py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
              </>
            )}

            {/* New Analysis Results (not from previous review) */}
            {!selectedReview && (
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
                    {result.suggestions.map((suggestion) => (
                      <li key={`result-suggestion-${suggestion.substring(0, 20)}`} className="font-mono text-xs text-gray-700 flex gap-2">
                        <span className="text-[#FF6B2C]">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Updates */}
                {result.updates.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="h-4 w-4 text-[#FF6B2C]" />
                      <h3 className="font-mono font-bold text-sm">Recommended Updates</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.updates.map((update) => (
                        <li key={`result-update-${update.substring(0, 20)}`} className="font-mono text-xs text-gray-700 flex gap-2">
                          <span className="text-[#FF6B2C]">→</span>
                          <span>{update}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* New Analysis Button */}
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setSelectedReview(null);
                  }}
                  className="w-full font-mono font-bold text-sm py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Analyze Another Resume
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResumePage;
