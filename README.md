# PrepAxis — AI Interview Coach

<div align="center">
  <img src="public/logo.png" alt="PrepAxis Logo" width="120" height="120">
</div>

An intelligent interview preparation platform that helps users improve their interview skills through AI-powered feedback, resume analysis, and mock interviews. Built as a college project to demonstrate modern web development practices and AI integration.

## ✨ Features

- 🎤 **Voice & Text Interviews** - Practice interviews with AI-powered mock scenarios
- 📝 **Resume Analysis** - Upload PDFs for AI-powered resume analysis with ATS scoring and personalized suggestions  
- 📊 **Performance Tracking** - Track all resume reviews with timestamps and history
- 👤 **Secure Authentication** - Google Sign-In with Firebase Authentication 
- 🤖 **Gemini AI Integration** - Real-time analysis using Google Gemini 2.5 Flash model
- 💾 **Cloud Storage** - Persistent data storage with Firestore
- 📱 **Responsive Design** - Mobile and desktop optimized UI

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest UI library with hooks for state management
- **TypeScript** - Type-safe development for better code quality
- **React Router 7** - Client-side routing with nested routes
- **Tailwind CSS 4** - Utility-first CSS for responsive design
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icon library

### Backend & Services
- **Firebase Authentication** - Secure user management with Google Sign-In provider
- **Cloud Firestore** - NoSQL database for real-time data sync
- **Google Gemini 2.5 Flash API** - AI model for resume analysis and interview feedback

### Build & Development
- **Create React App** - Zero-configuration React setup
- **Vite** - Lightning-fast build tool (configured via CRA)
- **npm** - Package management

## 📋 Project Structure

```
src/
├── pages/
│   ├── Dashboard.tsx           # Main layout with sidebar & navigation
│   ├── auth/
│   │   ├── Login.tsx          # Google Sign-In page
│   │   └── Register.tsx       # Registration page
│   ├── dashboard/
│   │   ├── DashboardHome.tsx  # Home with recent reviews (DYNAMIC)
│   │   ├── InterviewPage.tsx  # Voice/Text interview selector
│   │   ├── ResumePage.tsx     # Resume upload & analysis (FULLY FUNCTIONAL)
│   │   ├── AnalyticsPage.tsx  # Performance tracking (placeholder)
│   │   └── SettingsPage.tsx   # User settings & preferences
│   └── interview/
│       ├── VoiceInterview.tsx
│       ├── TextInterview.tsx
│       └── Report.jsx
├── services/
│   ├── firebase.ts            # Firestore database initialization
│   ├── geminiService.ts       # Gemini API integration for resume analysis
│   └── firestoreService.ts    # Database operations (CRUD + queries)
├── components/
│   ├── ui/                    # Radix UI primitives (Label, Sheet, Dialog, etc.)
│   ├── interview/             # Interview-specific UI components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── resume/                # Resume analysis components
├── lib/
│   ├── firebase.ts            # Firebase app & Auth initialization
│   └── utils.ts               # Utility functions (cn for Tailwind merging)
├── styles/
│   └── theme.js               # Color & design tokens
├── App.tsx                    # Route configuration
└── index.tsx                  # React entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Google Gemini API Key ([Get it here](https://aistudio.google.com))
- Firebase Project ([Create here](https://firebase.google.com))

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd prepaxis
   npm install
   ```

2. **Environment Setup**
   Create `.env` and add:
   ```
   REACT_APP_GEMINI_API_KEY=your_key_here
   
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=xxx
   REACT_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=xxx
   REACT_APP_FIREBASE_STORAGE_BUCKET=xxx.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
   REACT_APP_FIREBASE_APP_ID=xxx
   REACT_APP_FIREBASE_MEASUREMENT_ID=xxx
   ```

3. **Firebase Setup**
   - Create Firestore collection: `resumeReviews`
   - Add composite index:
     - Collection: `resumeReviews`
     - Fields: `userId` (Ascending), `timestamp` (Descending)
   - Set Security Rules:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /resumeReviews/{document=**} {
           allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
           allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
         }
       }
     }
     ```

4. **Start Development**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

### Available Scripts

```bash
npm start          # Development server with hot reload
npm test           # Run test suite
npm run build      # Production build
npm run eject      # Expose CRA configuration (one-way)
```

## 🎨 Design & Development Practices

### Code Style
- **TypeScript** - All components typed for safety
- **Functional Components** - React hooks (useState, useEffect, useCallback)
- **Comments** - Every service function documented with step-by-step explanations
- **Simple Logic** - No complex abstractions; code is readable and maintainable

### Styling
- **Tailwind CSS** - Utility classes for consistency
- **Orange Theme** - Primary accent color `#FF6B2C`
- **Responsive** - Mobile-first design with `md:` breakpoints
- **Spacing** - Compact: `gap-3`, `p-4`, `mb-3` throughout

### State Management
- **React Hooks** - useState for local state, useEffect for side effects
- **No Redux** - Simple enough to not need external state
- **Prop Drilling** - Used when necessary (consider Context API if grows)

### API Integration
- **Async/Await** - Modern promise handling in services
- **Try-Catch** - Error handling throughout
- **Firestore Queries** - Optimized with indexes and user filtering
- **Gemini API** - Base64 PDF encoding, JSON response parsing

### Data Flow
1. **DashboardHome** → Fetches recent reviews from Firestore (user-filtered)
2. **ResumePage** → PDF upload → Gemini API → Firestore storage → display + history
3. **Previous Reviews** → Click to open modal → View stored data

### Security
- **Firebase Auth** - Only authenticated users can access
- **Firestore Rules** - Users can only read/write their own data
- **PDF Handling** - Files analyzed in-memory, not stored
- **API Keys** - Environment variables only

## 🔑 Key Implementation Details

### Resume Analysis Flow
1. User uploads PDF file
2. File validated (must be PDF)
3. Converted to base64 format
4. Sent to Gemini API with prompt
5. Response parsed for ATS score, summary, suggestions
6. Stored in Firestore with timestamp & user ID
7. Results displayed on page
8. History refreshed dynamically

### Firestore Schema
```
resumeReviews/
└── document (auto-generated ID)
    ├── userId: string          // User ID from Firebase Auth
    ├── timestamp: Timestamp    // When review was created
    ├── atsScore: number        // 0-100
    ├── fileName: string        // PDF file name
    ├── summary: string         // ATS details from Gemini
    └── suggestions: array      // 5-7 improvement suggestions
```

### Gemini Integration
- **Model** - `gemini-2.5-flash` (fast & efficient)
- **Input** - Text prompt + base64 PDF inline data
- **Output** - JSON with atsScore, atsDetails, suggestions, updates
- **Parsing** - Regex match for JSON in response

## 🚧 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Resume Review | ✅ Complete | Full PDF upload → Gemini API → Firestore |
| Dashboard Home | ✅ Complete | Dynamic recent reviews display |
| Authentication | ✅ Complete | Google Sign-In via Firebase |
| Resume History | ✅ Complete | Modal popup with previous reviews |
| Voice Interviews | 🚧 Pending | UI shell ready, Web Audio API needed |
| Text Interviews | 🚧 Pending | UI shell ready, logic pending |
| Analytics | 🚧 Pending | UI shell ready, data aggregation pending |

## 📝 Environment Variables

All variables must be in `.env`:
- `REACT_APP_GEMINI_API_KEY` - Google Gemini API key
- `REACT_APP_FIREBASE_*` - All Firebase config (7 variables)

**Important** - Never commit `.env` to git; add to `.gitignore`

## 🤝 Contributing

This is a college project. For improvements:
1. Keep code simple and well-commented
2. Follow existing patterns (no new abstractions)
3. Update README for new features
4. Test thoroughly before pushing

## 📄 License

MIT License - Created as educational project