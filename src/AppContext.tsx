import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './lib/firebase';

// ─── Translations ─────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  'English (US)': {
    welcome: 'Welcome to PrepAxis',
    welcomeSub: 'Start your interview preparation journey with AI-powered practice.',
    startInterview: 'Start Interview',
    startInterviewSub: 'Practice with AI-powered mock interviews and get instant feedback',
    resumeReview: 'Resume Review',
    resumeReviewSub: 'Upload your resume for AI analysis and personalized suggestions',
    analytics: 'Analytics',
    analyticsSub: 'Track your progress with detailed performance metrics and insights',
    recentReviews: 'Recent Resume Reviews',
    recentReviewsSub: 'Your latest AI-powered resume analyses',
    noReviews: 'No reviews yet',
    noReviewsSub: 'Upload your resume to get AI-powered feedback',
    startReview: 'Start Review →',
    manageAccount: 'Manage your preferences and account',
    accountSettings: 'Account Settings',
    notifications: 'Notifications',
    emailNotif: 'Email Notifications',
    pushNotif: 'Push Notifications',
    privacy: 'Privacy & Security',
    changePassword: 'Change Password',
    appearance: 'Appearance',
    language: 'Language & Region',
    preferences: 'Preferences',
    twoFA: 'Two-Factor Auth',
    dangerZone: 'Danger Zone',
    signIn: 'Sign In with Google',
    welcomeBack: 'Welcome Back',
    signInSub: 'Sign in to continue your interview preparation',
    lastUpdated: 'Last updated: Today',
    dashboard: 'Dashboard',
    practiceAI: 'Practice with AI-powered mock interviews',
    edit: 'Edit →', view: 'View →', change: 'Change →',
    select: 'Select →', configure: 'Configure →', setup: 'Setup →', delete: 'Delete →',
  },
  'Hindi': {
    welcome: 'PrepAxis में आपका स्वागत है',
    welcomeSub: 'AI-संचालित अभ्यास के साथ अपनी साक्षात्कार तैयारी शुरू करें।',
    startInterview: 'साक्षात्कार शुरू करें',
    startInterviewSub: 'AI-संचालित मॉक साक्षात्कार के साथ अभ्यास करें',
    resumeReview: 'रिज्यूमे समीक्षा',
    resumeReviewSub: 'AI विश्लेषण के लिए अपना रिज्यूमे अपलोड करें',
    analytics: 'विश्लेषण',
    analyticsSub: 'विस्तृत प्रदर्शन मेट्रिक्स के साथ अपनी प्रगति ट्रैक करें',
    recentReviews: 'हाल की रिज्यूमे समीक्षाएं',
    recentReviewsSub: 'आपके नवीनतम AI-संचालित रिज्यूमे विश्लेषण',
    noReviews: 'अभी तक कोई समीक्षा नहीं',
    noReviewsSub: 'AI-संचालित फीडबैक के लिए अपना रिज्यूमे अपलोड करें',
    startReview: 'समीक्षा शुरू करें →',
    manageAccount: 'अपनी प्राथमिकताएं और खाता प्रबंधित करें',
    accountSettings: 'खाता सेटिंग्स',
    notifications: 'सूचनाएं',
    emailNotif: 'ईमेल सूचनाएं',
    pushNotif: 'पुश सूचनाएं',
    privacy: 'गोपनीयता और सुरक्षा',
    changePassword: 'पासवर्ड बदलें',
    appearance: 'दिखावट',
    language: 'भाषा और क्षेत्र',
    preferences: 'प्राथमिकताएं',
    twoFA: 'दो-चरण प्रमाणीकरण',
    dangerZone: 'खतरनाक क्षेत्र',
    signIn: 'Google से साइन इन करें',
    welcomeBack: 'वापस स्वागत है',
    signInSub: 'अपनी साक्षात्कार तैयारी जारी रखने के लिए साइन इन करें',
    lastUpdated: 'अंतिम अपडेट: आज',
    dashboard: 'डैशबोर्ड',
    practiceAI: 'AI-संचालित मॉक साक्षात्कार के साथ अभ्यास करें',
    edit: 'संपादित करें →', view: 'देखें →', change: 'बदलें →',
    select: 'चुनें →', configure: 'कॉन्फ़िगर करें →', setup: 'सेटअप →', delete: 'हटाएं →',
  },
  'Spanish': {
    welcome: 'Bienvenido a PrepAxis',
    welcomeSub: 'Comienza tu preparación con práctica impulsada por IA.',
    startInterview: 'Iniciar Entrevista',
    startInterviewSub: 'Practica con entrevistas simuladas impulsadas por IA',
    resumeReview: 'Revisión de CV',
    resumeReviewSub: 'Sube tu CV para análisis de IA y sugerencias personalizadas',
    analytics: 'Analíticas',
    analyticsSub: 'Rastrea tu progreso con métricas detalladas',
    recentReviews: 'Revisiones Recientes de CV',
    recentReviewsSub: 'Tus últimos análisis de CV impulsados por IA',
    noReviews: 'Sin revisiones aún',
    noReviewsSub: 'Sube tu CV para obtener comentarios de IA',
    startReview: 'Iniciar Revisión →',
    manageAccount: 'Gestiona tus preferencias y cuenta',
    accountSettings: 'Configuración de cuenta',
    notifications: 'Notificaciones',
    emailNotif: 'Notificaciones por correo',
    pushNotif: 'Notificaciones push',
    privacy: 'Privacidad y seguridad',
    changePassword: 'Cambiar contraseña',
    appearance: 'Apariencia',
    language: 'Idioma y región',
    preferences: 'Preferencias',
    twoFA: 'Autenticación de dos factores',
    dangerZone: 'Zona peligrosa',
    signIn: 'Iniciar sesión con Google',
    welcomeBack: 'Bienvenido de nuevo',
    signInSub: 'Inicia sesión para continuar tu preparación',
    lastUpdated: 'Última actualización: Hoy',
    dashboard: 'Panel',
    practiceAI: 'Practica con entrevistas simuladas de IA',
    edit: 'Editar →', view: 'Ver →', change: 'Cambiar →',
    select: 'Seleccionar →', configure: 'Configurar →', setup: 'Configurar →', delete: 'Eliminar →',
  },
  'French': {
    welcome: 'Bienvenue sur PrepAxis',
    welcomeSub: 'Commencez votre préparation aux entretiens avec la pratique alimentée par IA.',
    startInterview: 'Démarrer l\'entretien',
    startInterviewSub: 'Pratiquez avec des entretiens simulés alimentés par IA',
    resumeReview: 'Révision du CV',
    resumeReviewSub: 'Téléchargez votre CV pour une analyse IA',
    analytics: 'Analytique',
    analyticsSub: 'Suivez vos progrès avec des métriques détaillées',
    recentReviews: 'Révisions récentes de CV',
    recentReviewsSub: 'Vos dernières analyses de CV alimentées par IA',
    noReviews: 'Pas encore de révisions',
    noReviewsSub: 'Téléchargez votre CV pour obtenir des commentaires IA',
    startReview: 'Commencer la révision →',
    manageAccount: 'Gérez vos préférences et votre compte',
    accountSettings: 'Paramètres du compte',
    notifications: 'Notifications',
    emailNotif: 'Notifications par e-mail',
    pushNotif: 'Notifications push',
    privacy: 'Confidentialité et sécurité',
    changePassword: 'Changer le mot de passe',
    appearance: 'Apparence',
    language: 'Langue et région',
    preferences: 'Préférences',
    twoFA: 'Authentification à deux facteurs',
    dangerZone: 'Zone dangereuse',
    signIn: 'Se connecter avec Google',
    welcomeBack: 'Bon retour',
    signInSub: 'Connectez-vous pour continuer votre préparation',
    lastUpdated: 'Dernière mise à jour: Aujourd\'hui',
    dashboard: 'Tableau de bord',
    practiceAI: 'Pratiquez avec des entretiens simulés IA',
    edit: 'Modifier →', view: 'Voir →', change: 'Changer →',
    select: 'Sélectionner →', configure: 'Configurer →', setup: 'Configurer →', delete: 'Supprimer →',
  },
};

export const tr = (lang: string, key: string): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['English (US)'][key] || key;
};

// ─── Context Types ────────────────────────────────────────────────────────────
interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  userPhoto: string;
  setUserPhoto: (url: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

// ─── Apply dark mode to document ─────────────────────────────────────────────
const applyDark = (enabled: boolean) => {
  const root = document.documentElement;
  if (enabled) {
    root.classList.add('dark');
    root.style.setProperty('--bg', '#0f172a');
    root.style.setProperty('--text', '#f1f5f9');
    document.body.style.backgroundColor = '#0f172a';
    document.body.style.color = '#f1f5f9';
  } else {
    root.classList.remove('dark');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--text');
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'English (US)');
  const [userPhoto, setUserPhotoState] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored).photoURL || '';
    return auth.currentUser?.photoURL || '';
  });
  const [userName, setUserNameState] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored).displayName || '';
    return auth.currentUser?.displayName || '';
  });

  // Apply dark mode on mount
  useEffect(() => { 
  applyDark(darkMode); 
}, [darkMode]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
    applyDark(next);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setUserPhoto = (url: string) => {
    setUserPhotoState(url);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem('user', JSON.stringify({ ...parsed, photoURL: url }));
    }
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem('user', JSON.stringify({ ...parsed, displayName: name }));
    }
  };

  const t = (key: string) => tr(language, key);

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      language, setLanguage,
      userPhoto, setUserPhoto,
      userName, setUserName,
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;