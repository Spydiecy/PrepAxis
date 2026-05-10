import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0JnxQTNkBu0_m_UEFBC00okVTwsFPLSE",
  authDomain: "my-fse-project-2dea0.firebaseapp.com",
  projectId: "my-fse-project-2dea0",
  storageBucket: "my-fse-project-2dea0.firebasestorage.app",
  messagingSenderId: "836301378993",
  appId: "1:836301378993:web:ae60f9563bfcbd7434d990"
};

// Initialize Firebase app (single instance)
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore Database
export const db = getFirestore(app);

// Google Sign-In Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;