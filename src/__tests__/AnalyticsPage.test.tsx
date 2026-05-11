// src/__tests__/AnalyticsPage.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';

jest.setTimeout(15000);

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

// Keep auth working after each test
beforeEach(() => {
  const { onAuthStateChanged } = require('firebase/auth');
  (onAuthStateChanged as jest.Mock).mockImplementation((auth: any, callback: any) => {
    callback({ uid: 'test-user-123', email: 'test@gmail.com', displayName: 'Test User' });
    return jest.fn();
  });
});

const renderAnalyticsPage = () =>
  render(<MemoryRouter><AnalyticsPage /></MemoryRouter>);

const makeMockDoc = (id: string, atsScore: number, date: string) => ({
  id,
  data: () => ({
    userId: 'test-user-123',
    timestamp: { toDate: () => new Date(date) },
    atsScore,
    fileName: `Resume_${id}.pdf`,
    summary: 'Good resume.',
    suggestions: ['Improve skills'],
  }),
});

// ══════════════════════════════════════════════════════════════════════════════
// UNIT TESTS — UI Rendering
// ══════════════════════════════════════════════════════════════════════════════

describe('📊 AnalyticsPage - UI Rendering', () => {
  test('✅ renders Resume Review Analytics heading', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderAnalyticsPage();
    await waitFor(() => {
      // Use getAllByText since the word "Analytics" appears multiple times
      const headings = screen.getAllByText(/Analytics/i);
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  test('✅ shows empty state when no reviews', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('No resume reviews yet')).toBeInTheDocument(),
      { timeout: 5000 }
    );
  });

  test('✅ shows interview empty state message', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('No interview data yet')).toBeInTheDocument(),
      { timeout: 5000 }
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS — Stats Calculation
// ══════════════════════════════════════════════════════════════════════════════

describe('📊 AnalyticsPage - Stats Integration', () => {
  test('✅ shows correct Total Reviews count', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        makeMockDoc('r1', 80, '2026-05-01'),
        makeMockDoc('r2', 90, '2026-05-05'),
        makeMockDoc('r3', 70, '2026-05-10'),
      ],
    });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('3')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ shows correct Average Score', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        makeMockDoc('r1', 80, '2026-05-01'),
        makeMockDoc('r2', 90, '2026-05-05'),
        makeMockDoc('r3', 70, '2026-05-10'),
      ],
    });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('80%')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ shows correct Best Score', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        makeMockDoc('r1', 80, '2026-05-01'),
        makeMockDoc('r2', 95, '2026-05-05'),
        makeMockDoc('r3', 70, '2026-05-10'),
      ],
    });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('95%')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ renders score chart when reviews exist', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        makeMockDoc('r1', 80, '2026-05-01'),
        makeMockDoc('r2', 85, '2026-05-05'),
      ],
    });
    renderAnalyticsPage();
    await waitFor(
      () => expect(screen.getByText('Score Progression')).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });

  test('✅ shows stat cards when reviews exist', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [makeMockDoc('r1', 80, '2026-05-01')],
    });
    renderAnalyticsPage();
    await waitFor(() => {
      expect(screen.getByText('Total Reviews')).toBeInTheDocument();
      expect(screen.getByText('Avg Score')).toBeInTheDocument();
      expect(screen.getByText('Best Score')).toBeInTheDocument();
      expect(screen.getByText('Trend')).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});