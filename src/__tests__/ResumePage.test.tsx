// src/__tests__/ResumePage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getDocs, addDoc } from 'firebase/firestore';

// ─── Mocks must be at top level ───────────────────────────────────────────────
jest.mock('../services/geminiService', () => ({
  analyzeResumeWithGemini: jest.fn(),
}));

jest.mock('../services/apiService', () => ({
  storeReviewTimestamp: jest.fn(() => Promise.resolve('review-doc-1')),
  getReviewHistory: jest.fn(() => Promise.resolve([])),
}));

import ResumePage from '../pages/dashboard/ResumePage';
import { analyzeResumeWithGemini } from '../services/geminiService';
import { storeReviewTimestamp, getReviewHistory } from '../services/apiService';

jest.setTimeout(15000);

// Restore auth before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Restore onAuthStateChanged
  const { onAuthStateChanged } = require('firebase/auth');
  (onAuthStateChanged as jest.Mock).mockImplementation((auth: any, callback: any) => {
    callback({ uid: 'test-user-123', email: 'test@gmail.com', displayName: 'Test User' });
    return jest.fn();
  });

  // Default mocks
  (analyzeResumeWithGemini as jest.Mock).mockResolvedValue({
    atsScore: 87,
    atsDetails: 'Strong ATS compatibility.',
    suggestions: ['Add quantifiable achievements', 'Include LinkedIn URL'],
    updates: ['Update summary section'],
  });

  (getReviewHistory as jest.Mock).mockResolvedValue([]);
  (storeReviewTimestamp as jest.Mock).mockResolvedValue('review-doc-1');
});

const renderResumePage = () =>
  render(<MemoryRouter><ResumePage /></MemoryRouter>);

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TESTS — UI Rendering
// ══════════════════════════════════════════════════════════════════════════════

describe('📄 ResumePage - UI Rendering', () => {
  test('✅ renders Upload Resume heading', () => {
    renderResumePage();
    expect(screen.getByText('Upload Resume')).toBeInTheDocument();
  });

  test('✅ renders Select PDF File button', () => {
    renderResumePage();
    expect(screen.getByText('Select PDF File')).toBeInTheDocument();
  });

  test('✅ renders file input that accepts only PDFs', () => {
    renderResumePage();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.accept).toBe('.pdf');
  });

  test('✅ does not show Analyze button before file is selected', () => {
    renderResumePage();
    expect(screen.queryByText('Analyze Resume')).not.toBeInTheDocument();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TESTS — File Handling
// ══════════════════════════════════════════════════════════════════════════════

describe('📄 ResumePage - File Handling', () => {
  test('✅ shows filename when valid PDF is selected', async () => {
    renderResumePage();
    const file = new File(['pdf'], 'MyResume.pdf', { type: 'application/pdf' });
    fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/MyResume\.pdf/)).toBeInTheDocument());
  });

  test('✅ shows Analyze Resume button after PDF selected', async () => {
    renderResumePage();
    const file = new File(['pdf'], 'MyResume.pdf', { type: 'application/pdf' });
    fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText('Analyze Resume')).toBeInTheDocument());
  });

  test('❌ shows error when non-PDF file is uploaded', async () => {
    renderResumePage();
    const file = new File(['content'], 'document.docx', { type: 'application/docx' });
    fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText('Please upload a PDF file')).toBeInTheDocument());
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS — Analysis Flow
// ══════════════════════════════════════════════════════════════════════════════

describe('📄 ResumePage - Analysis Integration', () => {
  const doAnalysis = async () => {
    renderResumePage();
    await new Promise(r => setTimeout(r, 50)); // let auth resolve
    const file = new File(['pdf'], 'MyResume.pdf', { type: 'application/pdf' });
    fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => screen.getByText('Analyze Resume'));
    fireEvent.click(screen.getByText('Analyze Resume'));
  };

  test('✅ shows ATS score after successful analysis', async () => {
    await doAnalysis();
    await waitFor(() => expect(screen.getByText('87%')).toBeInTheDocument(), { timeout: 10000 });
  });

  test('✅ shows suggestions after analysis', async () => {
    await doAnalysis();
    await waitFor(
      () => expect(screen.getByText('Add quantifiable achievements')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ saves review after analysis', async () => {
    await doAnalysis();
    await waitFor(() => expect(storeReviewTimestamp).toHaveBeenCalledTimes(1), { timeout: 10000 });
  });

  test('✅ shows Analyze Another Resume button after analysis', async () => {
    await doAnalysis();
    await waitFor(
      () => expect(screen.getByText('Analyze Another Resume')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ resets state when Analyze Another Resume is clicked', async () => {
    await doAnalysis();
    await waitFor(() => screen.getByText('Analyze Another Resume'), { timeout: 10000 });
    fireEvent.click(screen.getByText('Analyze Another Resume'));
    await waitFor(() => {
      expect(screen.getByText('Upload Resume')).toBeInTheDocument();
      expect(screen.queryByText('87%')).not.toBeInTheDocument();
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS — Review History
// ══════════════════════════════════════════════════════════════════════════════

describe('📄 ResumePage - Review History Integration', () => {
  test('✅ shows previous reviews when they exist', async () => {
    (getReviewHistory as jest.Mock).mockResolvedValue([{
      id: 'review-1',
      userId: 'test-user-123',
      timestamp: new Date('2026-05-09'),
      atsScore: 72,
      fileName: 'OldResume.pdf',
      summary: 'Decent resume.',
      suggestions: ['Improve skills section'],
    }]);

    renderResumePage();

    await waitFor(() => {
      expect(screen.getByText('Your Previous Reviews')).toBeInTheDocument();
      expect(screen.getByText('OldResume.pdf')).toBeInTheDocument();
      expect(screen.getByText('72%')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});