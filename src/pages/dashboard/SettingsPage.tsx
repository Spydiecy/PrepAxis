import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Lock, User, Moon, Sun, Globe, Key,
  Trash2, X, Check, Eye, EyeOff, Camera, Image, Settings
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
  updateProfile, updatePassword, deleteUser,
  EmailAuthProvider, reauthenticateWithCredential
} from 'firebase/auth';
import { useApp } from '../../AppContext';

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
  <button onClick={onChange}
    className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center ${value ? 'bg-[#FF6B2C]' : 'bg-gray-300'}`}>
    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-mono text-sm text-white shadow-lg z-[100] whitespace-nowrap ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {type === 'success' ? '✅' : '❌'} {message}
  </motion.div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={onClose}>
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono font-bold text-base">{title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

// ─── Account Modal ────────────────────────────────────────────────────────────
const AccountModal: React.FC<{
  onClose: () => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}> = ({ onClose, onToast }) => {
  const { setUserPhoto, setUserName } = useApp();
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>(user?.photoURL || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { onToast('Image must be under 5MB', 'error'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let photoURL = user.photoURL || '';

      if (photoFile) {
        // Convert to base64 and store
        photoURL = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photoFile);
        });
        await updateProfile(user, { displayName: name, photoURL });
      } else {
        await updateProfile(user, { displayName: name });
      }

      // Update global context — this updates ALL pages instantly
      setUserPhoto(photoURL);
      setUserName(name);

      onToast('Profile updated successfully!', 'success');
      onClose();
    } catch {
      onToast('Failed to update profile.', 'error');
    }
    setLoading(false);
  };

  return (
    <Modal title="Account Settings" onClose={onClose}>
      <div className="space-y-4">
        {/* Photo */}
        <div>
          <label className="font-mono text-xs text-gray-600 mb-2 block">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {preview ? (
                <img src={preview} alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-[#FF6B2C] object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                  <User className="w-7 h-7 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => galleryRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-mono text-xs font-bold text-gray-600 hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-all">
                <Image className="w-3.5 h-3.5" /> Upload from Gallery
              </button>
              <button onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl font-mono text-xs font-bold text-gray-600 hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-all">
                <Camera className="w-3.5 h-3.5" /> Take Photo
              </button>
            </div>
          </div>
          {/* Hidden inputs */}
          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
          {photoFile && <p className="font-mono text-xs text-green-600 mt-1">✅ {photoFile.name} selected</p>}
        </div>

        {/* Name */}
        <div>
          <label className="font-mono text-xs text-gray-600 mb-1 block">Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-[#FF6B2C]" />
        </div>

        {/* Email */}
        <div>
          <label className="font-mono text-xs text-gray-600 mb-1 block">Email</label>
          <input value={user?.email || ''} disabled
            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 font-mono text-sm text-gray-400 cursor-not-allowed" />
          <p className="font-mono text-xs text-gray-400 mt-1">Email cannot be changed (Google account)</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold hover:bg-[#d95500] disabled:bg-gray-200">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Password Modal ───────────────────────────────────────────────────────────
const PasswordModal: React.FC<{
  onClose: () => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}> = ({ onClose, onToast }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const isGoogle = auth.currentUser?.providerData?.[0]?.providerId === 'google.com';

  const handleSave = async () => {
    if (newPass !== confirm) { onToast('Passwords do not match!', 'error'); return; }
    if (newPass.length < 6) { onToast('Minimum 6 characters required!', 'error'); return; }
    const user = auth.currentUser;
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);
      onToast('Password updated!', 'success');
      onClose();
    } catch { onToast('Failed. Check your current password.', 'error'); }
    setLoading(false);
  };

  if (isGoogle) return (
    <Modal title="Change Password" onClose={onClose}>
      <div className="text-center py-4">
        <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-mono text-sm text-gray-600 mb-2">You signed in with Google.</p>
        <p className="font-mono text-xs text-gray-400 mb-4">Password is managed by your Google account.</p>
        <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer"
          className="inline-block px-4 py-2 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold">
          Manage Google Account →
        </a>
      </div>
    </Modal>
  );

  return (
    <Modal title="Change Password" onClose={onClose}>
      <div className="space-y-3">
        {[
          { label: 'Current Password', val: current, set: setCurrent, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
          { label: 'New Password', val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(v => !v) },
          { label: 'Confirm New Password', val: confirm, set: setConfirm, show: showNew, toggle: () => {} },
        ].map(({ label, val, set, show, toggle }) => (
          <div key={label}>
            <label className="font-mono text-xs text-gray-600 mb-1 block">{label}</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-10 font-mono text-sm focus:outline-none focus:border-[#FF6B2C]" />
              <button onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold disabled:bg-gray-200">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Language Modal ───────────────────────────────────────────────────────────
const LanguageModal: React.FC<{
  onClose: () => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}> = ({ onClose, onToast }) => {
  const { language, setLanguage } = useApp();
  const [selected, setSelected] = useState(language);
  const langs = [
    { code: 'English (US)', flag: '🇺🇸' },
    { code: 'English (UK)', flag: '🇬🇧' },
    { code: 'Hindi', flag: '🇮🇳' },
    { code: 'Spanish', flag: '🇪🇸' },
    { code: 'French', flag: '🇫🇷' },
    { code: 'German', flag: '🇩🇪' },
    { code: 'Chinese', flag: '🇨🇳' },
    { code: 'Japanese', flag: '🇯🇵' },
    { code: 'Arabic', flag: '🇸🇦' },
  ];

  const handleSave = () => {
    setLanguage(selected); // updates global context → ALL pages change
    onToast(`Language changed to ${selected}`, 'success');
    onClose();
  };

  return (
    <Modal title="Language & Region" onClose={onClose}>
      <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
        {langs.map(({ code, flag }) => (
          <button key={code} onClick={() => setSelected(code)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 font-mono text-sm transition-all ${selected === code ? 'border-[#FF6B2C] bg-[#FF6B2C]/5 text-[#FF6B2C]' : 'border-gray-100 hover:border-gray-200'}`}>
            <span>{flag} {code}</span>
            {selected === code && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
        <button onClick={handleSave} className="flex-1 py-2.5 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold">Save</button>
      </div>
    </Modal>
  );
};

// ─── Privacy Modal ────────────────────────────────────────────────────────────
const PrivacyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [analytics, setAnalytics] = useState(localStorage.getItem('analytics') !== 'false');
  const [dataSharing, setDataSharing] = useState(localStorage.getItem('dataSharing') !== 'false');
  const handleSave = () => {
    localStorage.setItem('analytics', String(analytics));
    localStorage.setItem('dataSharing', String(dataSharing));
    onClose();
  };
  return (
    <Modal title="Privacy & Security" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div><p className="font-mono text-sm font-bold">Analytics</p><p className="font-mono text-xs text-gray-500">Help improve PrepAxis</p></div>
          <Toggle value={analytics} onChange={() => setAnalytics(v => !v)} />
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div><p className="font-mono text-sm font-bold">Data Sharing</p><p className="font-mono text-xs text-gray-500">Share anonymized data</p></div>
          <Toggle value={dataSharing} onChange={() => setDataSharing(v => !v)} />
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="font-mono text-xs text-gray-500">Your data is stored securely and never shared with third parties.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold">Save</button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Preferences Modal ────────────────────────────────────────────────────────
const PreferencesModal: React.FC<{
  onClose: () => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}> = ({ onClose, onToast }) => {
  const [reminders, setReminders] = useState(localStorage.getItem('interviewReminders') !== 'false');
  const [autoSave, setAutoSave] = useState(localStorage.getItem('autoSave') !== 'false');
  const [difficulty, setDifficulty] = useState(localStorage.getItem('difficulty') || 'medium');
  const handleSave = () => {
    localStorage.setItem('interviewReminders', String(reminders));
    localStorage.setItem('autoSave', String(autoSave));
    localStorage.setItem('difficulty', difficulty);
    onToast('Preferences saved!', 'success');
    onClose();
  };
  return (
    <Modal title="Preferences" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div><p className="font-mono text-sm font-bold">Interview Reminders</p><p className="font-mono text-xs text-gray-500">Get reminded to practice daily</p></div>
          <Toggle value={reminders} onChange={() => setReminders(v => !v)} />
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div><p className="font-mono text-sm font-bold">Auto-save Results</p><p className="font-mono text-xs text-gray-500">Automatically save results</p></div>
          <Toggle value={autoSave} onChange={() => setAutoSave(v => !v)} />
        </div>
        <div className="py-2">
          <p className="font-mono text-sm font-bold mb-2">Interview Difficulty</p>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl border-2 font-mono text-xs font-bold capitalize transition-all ${difficulty === d ? 'border-[#FF6B2C] bg-[#FF6B2C]/5 text-[#FF6B2C]' : 'border-gray-200 text-gray-600'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold">Save</button>
        </div>
      </div>
    </Modal>
  );
};

// ─── 2FA Modal ────────────────────────────────────────────────────────────────
const TwoFAModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <Modal title="Two-Factor Authentication" onClose={onClose}>
    <div className="text-center py-2">
      <Key className="w-10 h-10 text-[#FF6B2C] mx-auto mb-3" />
      <p className="font-mono text-sm font-bold text-gray-700 mb-2">Your account is protected</p>
      <p className="font-mono text-xs text-gray-500 mb-4">Google Sign-In already provides 2FA.</p>
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
        <p className="font-mono text-xs text-green-700">✅ 2FA enabled via Google Sign-In</p>
      </div>
      <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer"
        className="inline-block px-4 py-2 bg-[#FF6B2C] text-white rounded-xl font-mono text-sm font-bold">
        Manage Google Security →
      </a>
    </div>
  </Modal>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal: React.FC<{
  onClose: () => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}> = ({ onClose, onToast }) => {
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (confirm !== 'DELETE') { onToast('Type DELETE to confirm', 'error'); return; }
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    try {
      await deleteUser(user);
      localStorage.clear();
      window.location.href = '/';
    } catch { onToast('Failed. Sign out and sign in again first.', 'error'); }
    setLoading(false);
  };
  return (
    <Modal title="Delete Account" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-mono text-xs text-red-700 font-bold mb-1">⚠️ This is permanent!</p>
          <p className="font-mono text-xs text-red-600">All your data will be deleted and cannot be recovered.</p>
        </div>
        <div>
          <label className="font-mono text-xs text-gray-600 mb-1 block">Type <span className="font-bold text-red-600">DELETE</span> to confirm</label>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Type DELETE here"
            className="w-full border-2 border-red-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-mono text-sm font-bold text-gray-600">Cancel</button>
          <button onClick={handleDelete} disabled={loading || confirm !== 'DELETE'}
            className="flex-1 py-2.5 bg-red-500 disabled:bg-gray-200 text-white rounded-xl font-mono text-sm font-bold">
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Main SettingsPage ────────────────────────────────────────────────────────
const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode, language, userPhoto, userName, t } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [notifications, setNotifications] = useState({
    email: localStorage.getItem('emailNotifications') !== 'false',
    push: localStorage.getItem('pushNotifications') === 'true',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleNotif = (key: 'email' | 'push') => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem(key === 'email' ? 'emailNotifications' : 'pushNotifications', String(updated[key]));
    showToast(`${key === 'email' ? 'Email' : 'Push'} notifications ${updated[key] ? 'enabled' : 'disabled'}`, 'success');
  };

  const dk = darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white';
  const dt = darkMode ? 'text-white' : 'text-gray-900';
  const ds = darkMode ? 'text-gray-400' : 'text-gray-500';

  const getLangFlag = (lang: string) => {
    const map: Record<string, string> = {
      'English (US)': '🇺🇸', 'English (UK)': '🇬🇧', 'Hindi': '🇮🇳',
      'Spanish': '🇪🇸', 'French': '🇫🇷', 'German': '🇩🇪',
      'Chinese': '🇨🇳', 'Japanese': '🇯🇵', 'Arabic': '🇸🇦',
    };
    return map[lang] || '🌍';
  };

  return (
    <div className={darkMode ? 'min-h-screen' : ''}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-3">
        <p className={`text-xs font-mono mb-4 ${ds}`}>{t('manageAccount')}</p>

        <div className="space-y-3 max-w-2xl">

          {/* Account */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userPhoto
                  ? <img src={userPhoto} alt="avatar" className="w-9 h-9 rounded-full border-2 border-[#FF6B2C] object-cover" />
                  : <div className="w-9 h-9 rounded-full bg-[#FF6B2C]/10 flex items-center justify-center"><User className="w-5 h-5 text-[#FF6B2C]" /></div>}
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('accountSettings')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>{userName || auth.currentUser?.email || 'Manage your profile'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('account')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('edit')}</button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-start gap-3 mb-3">
              <Bell className="h-4 w-4 text-[#FF6B2C] mt-0.5" />
              <div>
                <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('notifications')}</h3>
                <p className={`font-mono text-xs ${ds}`}>Choose how you want to be notified</p>
              </div>
            </div>
            <div className="space-y-2.5 pl-7">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs ${ds}`}>{t('emailNotif')}</span>
                <Toggle value={notifications.email} onChange={() => toggleNotif('email')} />
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs ${ds}`}>{t('pushNotif')}</span>
                <Toggle value={notifications.push} onChange={() => toggleNotif('push')} />
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('privacy')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>Manage your security preferences</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('privacy')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('view')}</button>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('changePassword')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>Update your account password</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('password')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('change')}</button>
            </div>
          </motion.div>

          {/* Dark Mode */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Sun className="h-4 w-4 text-[#FF6B2C]" /> : <Moon className="h-4 w-4 text-[#FF6B2C]" />}
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('appearance')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>{darkMode ? '🌙 Dark mode ON' : '☀️ Light mode ON'}</p>
                </div>
              </div>
              <Toggle value={darkMode} onChange={toggleDarkMode} />
            </div>
          </motion.div>

          {/* Language */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('language')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>{getLangFlag(language)} {language}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('language')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('select')}</button>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('preferences')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>Difficulty: {localStorage.getItem('difficulty') || 'medium'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('preferences')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('configure')}</button>
            </div>
          </motion.div>

          {/* 2FA */}
          <motion.div whileHover={{ scale: 1.01 }} className={`border-2 rounded-xl p-4 ${dk}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-[#FF6B2C]" />
                <div>
                  <h3 className={`font-mono font-bold text-sm ${dt}`}>{t('twoFA')}</h3>
                  <p className={`font-mono text-xs ${ds}`}>Extra security for your account</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('2fa')} className="font-mono text-sm text-[#FF6B2C] font-bold">{t('setup')}</button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div whileHover={{ scale: 1.01 }} className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-red-600" />
                <div>
                  <h3 className="font-mono font-bold text-sm text-red-700">{t('dangerZone')}</h3>
                  <p className="font-mono text-xs text-gray-500">Permanently delete your account</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('delete')} className="font-mono text-sm text-red-600 font-bold">{t('delete')}</button>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'account' && <AccountModal onClose={() => setActiveModal(null)} onToast={showToast} />}
        {activeModal === 'password' && <PasswordModal onClose={() => setActiveModal(null)} onToast={showToast} />}
        {activeModal === 'language' && <LanguageModal onClose={() => setActiveModal(null)} onToast={showToast} />}
        {activeModal === '2fa' && <TwoFAModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'privacy' && <PrivacyModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'delete' && <DeleteModal onClose={() => setActiveModal(null)} onToast={showToast} />}
        {activeModal === 'preferences' && <PreferencesModal onClose={() => setActiveModal(null)} onToast={showToast} />}
        {toast && <Toast message={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;