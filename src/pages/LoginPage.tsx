import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      // Decode JWT token to get user info
      const token = credentialResponse.credential;
      if (token) {
        // Store user info in localStorage (in production, verify with backend)
        localStorage.setItem('user', JSON.stringify({ 
          loginMethod: 'google',
          token 
        }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    // eslint-disable-next-line no-undef
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-6 flex items-center justify-between"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Bird className="h-8 w-8 text-[#FF6B2C]" />
              <span className="font-mono text-xl font-bold">PrepAxis</span>
            </button>
            <p className="text-sm text-gray-600 font-mono">
              Master your interviews with AI coaching
            </p>
          </motion.div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            {/* Sign In Card */}
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h2 className="text-3xl font-mono font-bold text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 font-mono text-sm mb-8">
                Sign in to continue your interview preparation
              </p>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-mono"
                >
                  {error}
                </motion.div>
              )}

              {/* Google Sign-In Button */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                />
              </div>
            </div>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center text-xs text-gray-500 font-mono mt-8"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;

