import {
  collection, addDoc, query, getDocs,
  orderBy, limit, where, doc, getDoc, deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ─────────────────────────────────────────────
// RESUME REVIEW TYPES & FUNCTIONS
// ─────────────────────────────────────────────

export interface ResumeReviewRecord {
  id?: string | number;
  userId: string;
  timestamp: Date;
  atsScore: number;
  fileName: string;
  summary: string;
  suggestions: string[];
}

// Save a resume review to Firestore
export const storeReviewTimestamp = async (
  userId: string,
  atsScore: number,
  fileName: string,
  summary: string,
  suggestions: string[]
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'resumeReviews'), {
      userId,
      timestamp: new Date(),
      atsScore,
      fileName,
      summary,
      suggestions,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error storing resume review:', error);
    throw error;
  }
};

// Fetch recent resume reviews for a user
export const getReviewHistory = async (
  userId: string,
  limit_count: number = 5
): Promise<ResumeReviewRecord[]> => {
  try {
    const q = query(
      collection(db, 'resumeReviews'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
        atsScore: data.atsScore,
        fileName: data.fileName,
        summary: data.summary || '',
        suggestions: data.suggestions || [],
      };
    });
  } catch (error) {
    console.error('Error fetching resume history:', error);
    return [];
  }
};

// Get a single resume review by ID
export const getReview = async (
  reviewId: string | number
): Promise<ResumeReviewRecord | null> => {
  try {
    const reviewDoc = await getDoc(doc(db, 'resumeReviews', String(reviewId)));
    if (!reviewDoc.exists()) return null;
    const data = reviewDoc.data();
    return {
      id: reviewDoc.id,
      userId: data.userId,
      timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
      atsScore: data.atsScore,
      fileName: data.fileName,
      summary: data.summary || '',
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};

// Delete a resume review by ID
export const deleteReview = async (reviewId: string | number): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'resumeReviews', String(reviewId)));
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};


// ─────────────────────────────────────────────
// INTERVIEW SESSION TYPES & FUNCTIONS
// ─────────────────────────────────────────────

export interface CategoryScore {
  name: string;
  score: number;
}

export interface InterviewSessionRecord {
  id?: string;
  userId: string;
  timestamp: Date;
  interviewType: 'hr' | 'technical';
  inputMode: 'voice' | 'text';
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  categoryScores: CategoryScore[];
}

// Save an interview session result to Firestore
export const storeInterviewSession = async (
  userId: string,
  interviewType: 'hr' | 'technical',
  inputMode: 'voice' | 'text',
  score: number,
  summary: string,
  strengths: string[],
  improvements: string[],
  categoryScores: CategoryScore[]
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'interviewSessions'), {
      userId,
      timestamp: new Date(),
      interviewType,
      inputMode,
      score,
      summary,
      strengths,
      improvements,
      categoryScores,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error storing interview session:', error);
    throw error;
  }
};

// Fetch recent interview sessions for a user
export const getInterviewHistory = async (
  userId: string,
  limit_count: number = 10
): Promise<InterviewSessionRecord[]> => {
  try {
    const q = query(
      collection(db, 'interviewSessions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
        interviewType: data.interviewType,
        inputMode: data.inputMode,
        score: data.score,
        summary: data.summary || '',
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        categoryScores: data.categoryScores || [],
      };
    });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    return [];
  }
};

// Delete an interview session by ID
export const deleteInterviewSession = async (sessionId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'interviewSessions', sessionId));
    return true;
  } catch (error) {
    console.error('Error deleting interview session:', error);
    return false;
  }
};