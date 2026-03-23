import { collection, addDoc, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

// Type describing one review record stored in database
export interface ResumeReviewRecord {
  id?: string;              // Unique document ID from Firestore
  timestamp: Date;          // When the review was created
  atsScore: number;         // The ATS score from Gemini
  fileName: string;         // Name of the PDF file analyzed
}

// Save a review result to Firestore database
export const storeReviewTimestamp = async (atsScore: number, fileName: string) => {
  try {
    // Get reference to the "resumeReviews" collection in database
    const reviewsRef = collection(db, 'resumeReviews');
    
    // Add a new document with the review data
    const docRef = await addDoc(reviewsRef, {
      timestamp: new Date(),    // Current time
      atsScore: atsScore,       // Score from Gemini
      fileName: fileName,       // PDF file name
    });
    
    // Return the unique ID of the document just created
    return docRef.id;
  } catch (error) {
    console.error('Error storing review timestamp:', error);
    throw error;
  }
};

// Fetch the 5 most recent reviews from Firestore
export const getReviewHistory = async (limit_count: number = 5) => {
  try {
    // Get reference to the "resumeReviews" collection
    const reviewsRef = collection(db, 'resumeReviews');
    
    // Build a query: 
    // - Get documents from reviewsRef
    // - Sort by timestamp (newest first)
    // - Limit to N results
    const q = query(
      reviewsRef,
      orderBy('timestamp', 'desc'),
      limit(limit_count)
    );
    
    // Execute the query and get results
    const querySnapshot = await getDocs(q);
    const reviews: ResumeReviewRecord[] = [];
    
    // Convert each Firestore document to a ResumeReviewRecord
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        // Convert Firestore timestamp to JavaScript Date
        timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
        atsScore: data.atsScore,
        fileName: data.fileName,
      });
    });
    
    return reviews;
  } catch (error) {
    // If query fails, log error and return empty list
    console.error('Error fetching review history:', error);
    return [];
  }
};
