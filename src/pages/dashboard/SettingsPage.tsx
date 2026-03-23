import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, User, Moon, Globe, Key, Trash2 } from 'lucide-react';

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
        className="mb-3"
      >
        <p className="text-xs font-mono text-gray-600 mb-3">
          Manage your preferences and account
        </p>

        <div className="space-y-3 max-w-2xl">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Account Settings</h3>
                  <p className="font-mono text-xs text-gray-600">
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
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 text-[#FF6B2C] mt-0.5" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Notifications</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pl-7">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs">Email Notifications</div>
                <button
                  aria-label="Toggle email notifications"
                  onClick={() => toggleSetting('emailNotifications')}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-[#FF6B2C]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs">Push Notifications</div>
                <button
                  aria-label="Toggle push notifications"
                  onClick={() => toggleSetting('pushNotifications')}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-[#FF6B2C]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Privacy & Security</h3>
                  <p className="font-mono text-xs text-gray-600">
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
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Preferences</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Customize your experience
                  </p>
                </div>
              </div>
              <span className="font-mono text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Configure →
              </span>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Appearance</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Choose your theme and display settings
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Customize →
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Language & Region</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Change your language and regional preferences
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Select →
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-gray-300 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Two-Factor Auth</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Enable extra security for your account
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#FF6B2C] cursor-pointer hover:text-[#d95500]">
                Setup →
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-red-300 rounded-lg p-4 bg-red-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-red-600" />
                <div>
                  <h3 className="font-mono font-bold text-sm">Danger Zone</h3>
                  <p className="font-mono text-xs text-gray-600">
                    Permanently delete your account and data
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-red-600 cursor-pointer hover:text-red-700">
                Delete →
              </span>
            </div>
          </motion.div>        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
