// src/__tests__/DashboardHome.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';
import DashboardHome from '../pages/dashboard/DashboardHome';

// Keep onAuthStateChanged working after clearAllMocks
beforeEach(() => {
  const { onAuthStateChanged } = require('firebase/auth');
  (onAuthStateChanged as jest.Mock).mockImplementation((auth: any, callback: any) => {
    callback({ uid: 'test-user-123', email: 'test@gmail.com', displayName: 'Test User' });
    return jest.fn();
  });
});

const renderDashboard = () =>
  render(<MemoryRouter><DashboardHome /></MemoryRouter>);

describe('🏠 DashboardHome - UI Rendering', () => {
  test('✅ renders Start Interview card', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Start Interview')).toBeInTheDocument());
  });

  test('✅ renders Resume Review card', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Resume Review')).toBeInTheDocument());
  });

  test('✅ renders Analytics card', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Analytics')).toBeInTheDocument());
  });

  test('✅ renders Recent Resume Reviews section', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Recent Resume Reviews')).toBeInTheDocument());
  });
});

describe('🏠 DashboardHome - Firestore Integration', () => {
  test('✅ shows empty state when no reviews exist', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderDashboard();
    await waitFor(() => expect(screen.getByText('No reviews yet')).toBeInTheDocument(), { timeout: 5000 });
  });

  test('✅ shows review cards when reviews exist in Firestore', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{
        id: 'review-1',
        data: () => ({
          userId: 'test-user-123',
          timestamp: { toDate: () => new Date('2026-05-10') },
          atsScore: 85,
          fileName: 'MyResume.pdf',
          summary: 'Great resume.',
          suggestions: ['Add LinkedIn'],
        }),
      }],
    });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('MyResume.pdf')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('✅ shows ATS Score label next to score', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{
        id: 'review-1',
        data: () => ({
          userId: 'test-user-123',
          timestamp: { toDate: () => new Date('2026-05-10') },
          atsScore: 92,
          fileName: 'Resume_v2.pdf',
          summary: 'Excellent.',
          suggestions: [],
        }),
      }],
    });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('ATS Score')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('❌ handles Firestore error gracefully', async () => {
    (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));
    renderDashboard();
    await waitFor(() => expect(screen.getByText('No reviews yet')).toBeInTheDocument(), { timeout: 5000 });
  });
});