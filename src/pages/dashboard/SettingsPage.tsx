import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-mono font-bold mb-2">Settings</h2>
        <p className="text-lg font-mono text-gray-600 mb-8">
          Manage your preferences and account
        </p>

        <div className="space-y-6 max-w-2xl">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold">Account Settings</h3>
                  <p className="font-mono text-sm text-gray-600">
                    Manage your profile and personal information
                  </p>
                </div>
              </div>
              <span className="font-mono text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Edit →
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold">Notifications</h3>
                  <p className="font-mono text-sm text-gray-600">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 ml-9">
              <div className="flex items-center justify-between">
                <label className="font-mono text-sm">Email Notifications</label>
                <button
                  onClick={() => toggleSetting('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-[#FF6B2C]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-mono text-sm">Push Notifications</label>
                <button
                  onClick={() => toggleSetting('pushNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-[#FF6B2C]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Lock className="h-5 w-5 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold">Privacy & Security</h3>
                  <p className="font-mono text-sm text-gray-600">
                    Manage your security preferences
                  </p>
                </div>
              </div>
              <span className="font-mono text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                View →
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Settings className="h-5 w-5 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold">Preferences</h3>
                  <p className="font-mono text-sm text-gray-600">
                    Customize your experience
                  </p>
                </div>
              </div>
              <span className="font-mono text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Configure →
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
