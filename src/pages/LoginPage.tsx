import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';
import { useApp } from '../AppContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, t } = useApp();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user info to localStorage (same as before)
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        loginMethod: 'google',
      }));

      // ✅ Save login record to Firestore
      await addDoc(collection(db, 'loginHistory'), {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        loginTime: new Date(),
      });

      navigate('/dashboard');
    } catch (err: any) {
      // Ignore cancelled popup — not a real error
      if (err.code === 'auth/cancelled-popup-request') return;
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  // Dark mode classes
  const dkBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const dkBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
  const dkCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const dkTitle = darkMode ? 'text-white' : 'text-gray-900';
  const dkSub = darkMode ? 'text-gray-400' : 'text-gray-600';
  const dkBtn = darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen ${dkBg} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className={`border-b ${dkBorder}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-6 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Bird className="h-8 w-8 text-[#FF6B2C]" />
            <span className={`font-mono text-xl font-bold ${dkTitle}`}>PrepAxis</span>
          </button>
          <p className={`text-sm font-mono ${dkSub}`}>
            Master your interviews with AI coaching
          </p>
        </motion.div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-md w-full">

          <div className={`border ${dkCard} rounded-lg p-8`}>
            <h2 className={`text-3xl font-mono font-bold text-center mb-2 ${dkTitle}`}>
              {t('welcomeBack') || 'Welcome Back'}
            </h2>
            <p className={`text-center font-mono text-sm mb-8 ${dkSub}`}>
              {t('signInSub') || 'Sign in to continue your interview preparation'}
            </p>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-mono">
                {error}
              </motion.div>
            )}

            <button onClick={handleGoogleSignIn}
              className={`w-full rounded-lg font-mono mb-4 px-4 py-3 border-2 ${dkBtn} transition-colors flex items-center justify-center gap-3`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{t('signIn') || 'Sign In with Google'}</span>
            </button>
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-center text-xs font-mono mt-8 ${dkSub}`}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;