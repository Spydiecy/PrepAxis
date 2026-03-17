import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/resume/ResumeUpload';
import TextInterview from './pages/interview/TextInterview';
import VoiceInterview from './pages/interview/VoiceInterview';
import Report from './pages/interview/Report';
import ResumeSuggestions from './pages/resume/ResumeSuggestions';

<<<<<<< HEAD
// PrepAxis — AI Interview Coach
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume/upload" element={<ResumeUpload />} />
          <Route path="/resume/suggestions" element={<ResumeSuggestions />} />
          <Route path="/interview/text" element={<TextInterview />} />
          <Route path="/interview/voice" element={<VoiceInterview />} />
          <Route path="/interview/report" element={<Report />} />
        </Routes>
      </Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Hello World!</h1>
      </div>
    </>
  );
}

export default App;
=======
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/upload" element={<ResumeUpload />} />
        <Route path="/resume/suggestions" element={<ResumeSuggestions />} />
        <Route path="/interview/text" element={<TextInterview />} />
        <Route path="/interview/voice" element={<VoiceInterview />} />
        <Route path="/interview/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> bavan
