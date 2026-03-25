import { auth } from '../lib/firebase';

// Type describing one review record (same as before)
export interface ResumeReviewRecord {
  id?: string | number;
  userId: string;
  timestamp: Date;
  atsScore: number;
  fileName: string;
  summary: string;
  suggestions: string[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get User UID from Firebase Auth
async function getUserId(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid; // Get the User UID (e.g., "Kd17WEeqixY3iJ0I55OCqujQl6i1")
}

// Save a review result to the backend database
export const storeReviewTimestamp = async (
  userId: string,
  atsScore: number,
  fileName: string,
  summary: string,
  suggestions: string[]
) => {
  try {
    const userUid = await getUserId(); // Get User UID from Firebase

    const response = await fetch(`${API_BASE_URL}/resume-reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userUid, // Send User UID directly
        atsScore,
        fileName,
        summary,
        suggestions,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${error.error || response.status}`);
    }

    const data = await response.json();
    return data.data.id;
  } catch (error) {
    console.error('Error storing review:', error);
    throw error;
  }
};

// Fetch the most recent reviews for a specific user
export const getReviewHistory = async (
  userId: string,
  limit_count: number = 5
): Promise<ResumeReviewRecord[]> => {
  try {
    const userUid = await getUserId(); // Get User UID from Firebase

    const response = await fetch(
      `${API_BASE_URL}/resume-reviews?limit=${limit_count}&userId=${userUid}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Convert response to ResumeReviewRecord format
    return data.data.map((review: any) => ({
      id: review.id,
      userId: review.userId,
      timestamp: new Date(review.timestamp),
      atsScore: review.atsScore,
      fileName: review.fileName,
      summary: review.summary,
      suggestions: review.suggestions,
    }));
  } catch (error) {
    console.error('Error fetching review history:', error);
    return [];
  }
};

// Get a single review by ID
export const getReview = async (
  reviewId: string | number
): Promise<ResumeReviewRecord | null> => {
  try {
    const userUid = await getUserId(); // Get User UID from Firebase

    const response = await fetch(
      `${API_BASE_URL}/resume-reviews/${reviewId}?userId=${userUid}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const review = data.data;

    return {
      id: review.id,
      userId: review.userId,
      timestamp: new Date(review.timestamp),
      atsScore: review.atsScore,
      fileName: review.fileName,
      summary: review.summary,
      suggestions: review.suggestions,
    };
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string | number): Promise<boolean> => {
  try {
    const userUid = await getUserId(); // Get User UID from Firebase

    const response = await fetch(
      `${API_BASE_URL}/resume-reviews/${reviewId}?userId=${userUid}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};
