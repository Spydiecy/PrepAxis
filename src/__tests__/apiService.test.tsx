// src/__tests__/apiService.test.ts
import {
  storeReviewTimestamp,
  getReviewHistory,
  getReview,
  deleteReview,
  storeInterviewSession,
  getInterviewHistory,
  deleteInterviewSession,
} from '../services/apiService';
import { addDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';

// ─── Mock Firestore responses ──────────────────────────────────────────────────
const mockReviewDoc = {
  id: 'review-doc-1',
  data: () => ({
    userId: 'test-user-123',
    timestamp: { toDate: () => new Date('2026-05-10T10:00:00Z') },
    atsScore: 85,
    fileName: 'MyResume.pdf',
    summary: 'Great resume with strong keywords.',
    suggestions: ['Add more quantifiable achievements', 'Include LinkedIn URL'],
  }),
  exists: () => true,
};

const mockInterviewDoc = {
  id: 'interview-doc-1',
  data: () => ({
    userId: 'test-user-123',
    timestamp: { toDate: () => new Date('2026-05-10T11:00:00Z') },
    interviewType: 'hr',
    inputMode: 'text',
    score: 78,
    summary: 'Good communication skills demonstrated.',
    strengths: ['Clear answers', 'Good structure'],
    improvements: ['More examples needed', 'Be more concise'],
    categoryScores: [
      { name: 'Communication', score: 80 },
      { name: 'Teamwork', score: 75 },
    ],
  }),
};

// ══════════════════════════════════════════════════════════════════════════════
// RESUME REVIEW UNIT TESTS
// ══════════════════════════════════════════════════════════════════════════════

describe('📄 Resume Review - storeReviewTimestamp()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ saves review to Firestore and returns document ID', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'review-doc-1' });

    const id = await storeReviewTimestamp(
      'test-user-123', 85, 'MyResume.pdf',
      'Great resume.', ['Add LinkedIn URL']
    );

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(id).toBe('review-doc-1');
  });

  test('✅ saves correct data fields to Firestore', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'review-doc-1' });

    await storeReviewTimestamp(
      'test-user-123', 85, 'MyResume.pdf',
      'Great resume.', ['Add LinkedIn URL']
    );

    const callArgs = (addDoc as jest.Mock).mock.calls[0][1];
    expect(callArgs.userId).toBe('test-user-123');
    expect(callArgs.atsScore).toBe(85);
    expect(callArgs.fileName).toBe('MyResume.pdf');
    expect(callArgs.summary).toBe('Great resume.');
    expect(callArgs.suggestions).toEqual(['Add LinkedIn URL']);
    expect(callArgs.timestamp).toBeInstanceOf(Date);
  });

  test('❌ throws error when Firestore fails', async () => {
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error('Firestore write failed'));

    await expect(
      storeReviewTimestamp('test-user-123', 85, 'MyResume.pdf', 'Summary', [])
    ).rejects.toThrow('Firestore write failed');
  });
});

describe('📄 Resume Review - getReviewHistory()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ returns list of reviews for a user', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [mockReviewDoc] });

    const reviews = await getReviewHistory('test-user-123', 5);

    expect(reviews).toHaveLength(1);
    expect(reviews[0].id).toBe('review-doc-1');
    expect(reviews[0].atsScore).toBe(85);
    expect(reviews[0].fileName).toBe('MyResume.pdf');
    expect(reviews[0].userId).toBe('test-user-123');
  });

  test('✅ returns empty array when no reviews exist', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [] });

    const reviews = await getReviewHistory('test-user-123', 5);
    expect(reviews).toHaveLength(0);
    expect(reviews).toEqual([]);
  });

  test('✅ timestamp is converted to Date object', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [mockReviewDoc] });

    const reviews = await getReviewHistory('test-user-123', 5);
    expect(reviews[0].timestamp).toBeInstanceOf(Date);
  });

  test('❌ returns empty array on Firestore error', async () => {
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const reviews = await getReviewHistory('test-user-123', 5);
    expect(reviews).toEqual([]);
  });
});

describe('📄 Resume Review - getReview()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ returns a single review by ID', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce(mockReviewDoc);

    const review = await getReview('review-doc-1');

    expect(review).not.toBeNull();
    expect(review?.id).toBe('review-doc-1');
    expect(review?.atsScore).toBe(85);
  });

  test('❌ returns null when review does not exist', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false });

    const review = await getReview('nonexistent-id');
    expect(review).toBeNull();
  });
});

describe('📄 Resume Review - deleteReview()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ deletes review and returns true', async () => {
    (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await deleteReview('review-doc-1');
    expect(result).toBe(true);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });

  test('❌ returns false when delete fails', async () => {
    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('Permission denied'));

    const result = await deleteReview('review-doc-1');
    expect(result).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// INTERVIEW SESSION UNIT TESTS
// ══════════════════════════════════════════════════════════════════════════════

describe('🎤 Interview Session - storeInterviewSession()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ saves interview session and returns document ID', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'interview-doc-1' });

    const id = await storeInterviewSession(
      'test-user-123', 'hr', 'text', 78,
      'Good communication.', ['Clear answers'], ['More examples'],
      [{ name: 'Communication', score: 80 }]
    );

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(id).toBe('interview-doc-1');
  });

  test('✅ saves correct interview type and input mode', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'interview-doc-1' });

    await storeInterviewSession(
      'test-user-123', 'technical', 'voice', 90,
      'Excellent technical knowledge.', ['Strong DSA'], ['Improve system design'],
      [{ name: 'Technical Knowledge', score: 90 }]
    );

    const callArgs = (addDoc as jest.Mock).mock.calls[0][1];
    expect(callArgs.interviewType).toBe('technical');
    expect(callArgs.inputMode).toBe('voice');
    expect(callArgs.score).toBe(90);
  });

  test('❌ throws error when Firestore fails', async () => {
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error('Write failed'));

    await expect(
      storeInterviewSession('test-user-123', 'hr', 'text', 78, '', [], [], [])
    ).rejects.toThrow('Write failed');
  });
});

describe('🎤 Interview Session - getInterviewHistory()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ returns list of interview sessions', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [mockInterviewDoc] });

    const sessions = await getInterviewHistory('test-user-123', 10);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].interviewType).toBe('hr');
    expect(sessions[0].inputMode).toBe('text');
    expect(sessions[0].score).toBe(78);
  });

  test('✅ returns empty array when no sessions exist', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [] });

    const sessions = await getInterviewHistory('test-user-123');
    expect(sessions).toEqual([]);
  });

  test('❌ returns empty array on error', async () => {
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const sessions = await getInterviewHistory('test-user-123');
    expect(sessions).toEqual([]);
  });
});

describe('🎤 Interview Session - deleteInterviewSession()', () => {
  beforeEach(() => jest.clearAllMocks());

  test('✅ deletes session and returns true', async () => {
    (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await deleteInterviewSession('interview-doc-1');
    expect(result).toBe(true);
  });

  test('❌ returns false when delete fails', async () => {
    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('Permission denied'));

    const result = await deleteInterviewSession('interview-doc-1');
    expect(result).toBe(false);
  });
});