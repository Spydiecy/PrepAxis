import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


// Firebase configuration - loaded from .env file
const firebaseConfig = {
  apiKey: "AIzaSyB0JnxQTNkBu0_m_UEFBC00okVTwsFPLSE", 
  authDomain: "my-fse-project-2dea0.firebaseapp.com",
  projectId: "my-fse-project-2dea0",
  storageBucket: "my-fse-project-2dea0.firebasestorage.app",
  messagingSenderId: "836301378993",
  appId: "1:836301378993:web:ae60f9563bfcbd7434d990"
};
// Initialize the Firebase app
const app = initializeApp(firebaseConfig);



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
