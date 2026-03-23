import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - loaded from .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Google Analytics (optional - tracks user behavior)
getAnalytics(app);

// Initialize Firebase Authentication
// This is exported so other files can use it for login/signup
export const auth = getAuth(app);

// Initialize Google Sign-In provider
// This allows users to sign in with their Google account
export const googleProvider = new GoogleAuthProvider();

// Configure Google Sign-In to show account selection
// "select_account" means user sees the account picker every time
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
