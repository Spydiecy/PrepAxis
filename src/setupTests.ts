// src/setupTests.ts
import '@testing-library/jest-dom';

// ─── Mock Firebase Auth ────────────────────────────────────────────────────────
jest.mock('./lib/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      email: 'test@gmail.com',
      displayName: 'Test User',
      photoURL: 'https://photo.url',
    },
  },
  db: {},
  googleProvider: {},
}));

// ─── Mock Firebase Auth Functions ─────────────────────────────────────────────
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth: any, callback: any) => {
    callback({
      uid: 'test-user-123',
      email: 'test@gmail.com',
      displayName: 'Test User',
      photoURL: 'https://photo.url',
    });
    return jest.fn();
  }),
  GoogleAuthProvider: jest.fn(),
  getAuth: jest.fn(),
}));

// ─── Mock Firestore ────────────────────────────────────────────────────────────
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id-123' })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(() => Promise.resolve()),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

// ─── Mock Framer Motion ────────────────────────────────────────────────────────
jest.mock('framer-motion', () => {
  const mockReact = require('react');

  const stripMotionProps = ({
    whileHover, whileTap, whileFocus, whileDrag, whileInView,
    initial, animate, exit, transition, variants,
    layout, layoutId, drag, dragConstraints,
    onAnimationStart, onAnimationComplete,
    ...rest
  }: any) => rest;

  const createMotionComponent = (tag: string) =>
    mockReact.forwardRef(({ children, ...props }: any, ref: any) =>
      mockReact.createElement(tag, { ...stripMotionProps(props), ref }, children)
    );

  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      p: createMotionComponent('p'),
      span: createMotionComponent('span'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      ul: createMotionComponent('ul'),
      li: createMotionComponent('li'),
      a: createMotionComponent('a'),
      section: createMotionComponent('section'),
    },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
    useMotionValue: (val: any) => ({ get: () => val, set: jest.fn() }),
  };
});

// ─── Mock AppContext with REAL translations ────────────────────────────────────
// IMPORTANT: t() must return actual text, not the key.
// Component uses pattern: t('key') || 'fallback'
// If t() returns the key string (truthy), fallback never shows!
jest.mock('./AppContext', () => ({
  useApp: () => ({
    darkMode: false,
    t: (key: string) => {
      const translations: Record<string, string> = {
        // DashboardHome
        welcomeSub: 'Welcome to PrepAxis. Start your interview preparation journey with AI-powered practice.',
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
        // LoginPage
        welcomeBack: 'Welcome Back',
        signInSub: 'Sign in to continue your interview preparation',
        signIn: 'Sign In with Google',
        // AnalyticsPage
        resumeReviewAnalytics: 'Resume Review Analytics',
        interviewAnalytics: 'Interview Analytics',
        // ResumePage
        uploadResume: 'Upload Resume',
        uploadSub: 'Upload your PDF resume for AI analysis',
        selectFile: 'Select PDF File',
        analyzeBtn: 'Analyze Resume',
        analyzing: 'Analyzing...',
        previousReviews: 'Your Previous Reviews',
        atsScore: 'ATS Score',
        suggestions: 'Suggestions',
        analyzeAnother: 'Analyze Another Resume',
      };
      return translations[key] || key;
    },
  }),
}));

// ─── Mock window.speechSynthesis ──────────────────────────────────────────────
Object.defineProperty(window, 'speechSynthesis', {
  value: { speak: jest.fn(), cancel: jest.fn() },
  writable: true,
});

// ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });