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
