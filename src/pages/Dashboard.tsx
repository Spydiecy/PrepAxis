import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Bird, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 border-4 border-[#FF6B2C] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="h-8 w-8 text-[#FF6B2C]" />
            <span className="font-mono text-xl font-bold">PrepAxis</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-none font-mono flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-mono font-bold mb-4">
            Welcome, {user.displayName || user.email}!
          </h1>
          <p className="text-lg font-mono text-gray-600 mb-8">
            You have successfully authenticated with Firebase. Your interview preparation journey starts here.
          </p>

          {user.photoURL && (
            <div className="mb-8">
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-16 h-16 rounded-full border-2 border-[#FF6B2C]"
              />
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
            <h2 className="text-2xl font-mono font-bold mb-4">Account Details</h2>
            <div className="space-y-3 font-mono text-sm">
              <p>
                <span className="text-gray-600">User ID:</span> {user.uid}
              </p>
              <p>
                <span className="text-gray-600">Email:</span> {user.email}
              </p>
              <p>
                <span className="text-gray-600">Display Name:</span> {user.displayName}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-mono mt-8">
            🎉 Firebase authentication is working! Ready to start your interview preparation.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
