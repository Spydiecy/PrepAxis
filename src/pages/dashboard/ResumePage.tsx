import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { analyzeResumeWithGemini } from '../../services/geminiService';
import { storeReviewTimestamp, getReviewHistory, ResumeReviewRecord } from '../../services/apiService';
import { useApp } from '../../AppContext';

interface AnalysisResult {
  atsScore: number;
  atsDetails: string;
  suggestions: string[];
  updates: string[];
}

const ResumePage: React.FC = () => {
  const { darkMode } = useApp();
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ResumeReviewRecord[]>([]);
  const [selectedReview, setSelectedReview] = useState<ResumeReviewRecord | null>(null);

  // Dark mode classes
  const dkBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';
  const dkCard = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const dkText = darkMode ? 'text-gray-300' : 'text-gray-600';
  const dkTitle = darkMode ? 'text-white' : 'text-gray-800';
  const dkHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    const reviews = await getReviewHistory(userId, 5);
    setHistory(reviews);
  }, [userId]);

  useEffect(() => {
    if (userId) loadHistory();
  }, [userId, loadHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.[0]) return;
    const selectedFile = files[0];
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    if (isPdf) { setFile(selectedFile); setError(null); }
    else { setError('Please upload a PDF file'); setFile(null); }
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a file first'); return; }
    if (!userId) { setError('You must be logged in to analyze resumes'); return; }
    setAnalyzing(true); setError(null);
    try {
      const analysis = await analyzeResumeWithGemini(file);
      setResult({ atsScore: analysis.atsScore, atsDetails: analysis.atsDetails, suggestions: analysis.suggestions, updates: analysis.updates });
      await storeReviewTimestamp(userId, analysis.atsScore, file.name, analysis.atsDetails, analysis.suggestions);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      setResult(null);
    } finally { setAnalyzing(false); }
  };

  const handleOpenReview = (review: ResumeReviewRecord) => {
    setSelectedReview(review);
    setResult({ atsScore: review.atsScore, atsDetails: review.summary, suggestions: review.suggestions, updates: [] });
    setFile(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-3">
        <p className={`text-xs font-mono ${dkText} mb-3`}>
          Get AI-powered analysis of your resume with ATS optimization
        </p>

        {/* Upload Section */}
        <motion.div whileHover={{ scale: 1.02 }}
          className={`border-2 border-dashed border-[#FF6B2C] rounded-lg p-4 ${darkMode ? 'bg-[#FF6B2C]/10' : 'bg-[#FF6B2C]/5'} text-center mb-3`}>
          <Upload className="h-6 w-6 text-[#FF6B2C] mx-auto mb-2" />
          <h3 className={`text-base font-mono font-bold mb-1 ${dkTitle}`}>Upload Resume</h3>
          <p className={`font-mono text-xs ${dkText} mb-3`}>Upload your PDF resume for AI analysis</p>
          <label className="inline-block">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" disabled={analyzing} />
            <span className="font-mono font-bold text-sm text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
              Select PDF File
            </span>
          </label>
          {file && <p className="font-mono text-xs text-green-500 mt-2">✓ {file.name}</p>}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg mb-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="font-mono text-xs text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Analyze Button */}
        {file && !result && (
          <button onClick={handleAnalyze} disabled={analyzing}
            className="w-full font-mono font-bold text-sm py-2 px-4 bg-[#FF6B2C] text-white rounded-lg hover:bg-[#d95500] disabled:opacity-50 disabled:cursor-not-allowed mb-3 transition-colors">
            {analyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        )}

        {/* History */}
        {history.length > 0 && !result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`border-2 ${dkBg} rounded-lg p-4 mb-3`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`h-4 w-4 ${dkText}`} />
              <h3 className={`font-mono font-bold text-sm ${dkTitle}`}>Your Previous Reviews</h3>
            </div>
            <div className="space-y-2">
              {history.map((review) => (
                <motion.div key={review.id} whileHover={{ scale: 1.01 }} onClick={() => handleOpenReview(review)}
                  className={`p-3 ${dkCard} rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer ${dkHover} transition-colors`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className={`font-mono text-xs font-semibold ${dkTitle}`}>{review.fileName}</p>
                      <p className={`font-mono text-xs ${dkText} mt-1`}>
                        {review.timestamp.toLocaleDateString()} • {review.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#FF6B2C] ml-2">{review.atsScore}%</span>
                  </div>
                  {review.summary && (
                    <p className={`font-mono text-xs ${dkText} mb-2`}>{review.summary.substring(0, 100)}...</p>
                  )}
                  {review.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {review.suggestions.slice(0, 2).map((s, i) => (
                        <span key={i} className="inline-block bg-[#FF6B2C]/10 text-[#FF6B2C] text-xs font-mono px-2 py-1 rounded">
                          {s.substring(0, 30)}...
                        </span>
                      ))}
                      {review.suggestions.length > 2 && (
                        <span className={`inline-block text-xs font-mono ${dkText} px-2 py-1`}>
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

        {/* Results */}
        {result && (
          <>
            {/* Previous Review Modal */}
            {selectedReview && (
              <>
                <button type="button" className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => { setSelectedReview(null); setResult(null); }} aria-label="Close modal" />
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto z-50 pointer-events-auto`}
                    onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-mono font-bold text-base ${dkTitle}`}>Review Details</h2>
                        <button onClick={() => { setSelectedReview(null); setResult(null); }}
                          className={`${dkText} hover:text-gray-700 font-bold text-lg`}>✕</button>
                      </div>
                      <div className={`border-2 ${dkBg} rounded-lg p-3`}>
                        <p className={`font-mono text-xs font-semibold ${dkTitle}`}>{selectedReview.fileName}</p>
                        <p className={`font-mono text-xs ${dkText} mt-1`}>
                          {selectedReview.timestamp.toLocaleDateString()} • {selectedReview.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <motion.div whileHover={{ scale: 1.01 }} className="border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-mono font-bold text-sm">ATS Score</h3>
                          <CheckCircle className="h-5 w-5 text-[#FF6B2C]" />
                        </div>
                        <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-2">{result.atsScore}%</p>
                        <p className={`font-mono text-xs ${dkText}`}>{result.atsDetails}</p>
                      </motion.div>
                      {selectedReview.suggestions.length > 0 && (
                        <motion.div whileHover={{ scale: 1.01 }} className={`border-2 ${dkBg} rounded-lg p-4`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-[#FF6B2C]" />
                            <h3 className={`font-mono font-bold text-sm ${dkTitle}`}>Suggestions</h3>
                          </div>
                          <ul className="space-y-2">
                            {selectedReview.suggestions.map((s, i) => (
                              <li key={i} className={`font-mono text-xs ${dkText} flex gap-2`}>
                                <span className="text-[#FF6B2C]">•</span><span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      <button onClick={() => { setSelectedReview(null); setResult(null); }}
                        className={`w-full font-mono font-bold text-sm py-2 px-4 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors`}>
                        Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {/* New Analysis Results */}
            {!selectedReview && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <motion.div whileHover={{ scale: 1.01 }} className="border-2 border-[#FF6B2C] rounded-lg p-4 bg-[#FF6B2C]/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono font-bold text-sm">ATS Score</h3>
                    <CheckCircle className="h-5 w-5 text-[#FF6B2C]" />
                  </div>
                  <p className="text-3xl font-mono font-bold text-[#FF6B2C] mb-2">{result.atsScore}%</p>
                  <p className={`font-mono text-xs ${dkText}`}>{result.atsDetails}</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} className={`border-2 ${dkBg} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-[#FF6B2C]" />
                    <h3 className={`font-mono font-bold text-sm ${dkTitle}`}>Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className={`font-mono text-xs ${dkText} flex gap-2`}>
                        <span className="text-[#FF6B2C]">•</span><span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {result.updates.length > 0 && (
                  <motion.div whileHover={{ scale: 1.01 }} className={`border-2 ${dkBg} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="h-4 w-4 text-[#FF6B2C]" />
                      <h3 className={`font-mono font-bold text-sm ${dkTitle}`}>Recommended Updates</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.updates.map((u, i) => (
                        <li key={i} className={`font-mono text-xs ${dkText} flex gap-2`}>
                          <span className="text-[#FF6B2C]">→</span><span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <button onClick={() => { setResult(null); setFile(null); setSelectedReview(null); }}
                  className={`w-full font-mono font-bold text-sm py-2 px-4 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors`}>
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