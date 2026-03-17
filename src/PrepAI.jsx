import { useState } from "react";
import { globalCss, colors, fonts } from "./styles/theme";
import ResumeUpload from "./pages/resume/ResumeUpload";
import ResumeSuggestions from "./pages/resume/ResumeSuggestions";
import TextInterview from "./pages/interview/TextInterview";
import VoiceInterview from "./pages/interview/VoiceInterview";
import Report from "./pages/interview/Report";

const PAGES = [
  { id: "text-interview",     label: "💬 Text Interview" },
  { id: "voice-interview",    label: "🎙 Voice Interview" },
  { id: "report",             label: "📊 Interview Report" },
  { id: "resume-upload",      label: "📄 Resume Upload" },
  { id: "resume-suggestions", label: "✨ Resume Suggestions" },
];

export default function PrepAI() {
  const [currentPage, setCurrentPage] = useState("text-interview");

  const renderPage = () => {
    switch (currentPage) {
      case "text-interview":     return <TextInterview />;
      case "voice-interview":    return <VoiceInterview />;
      case "report":             return <Report onRetry={() => setCurrentPage("text-interview")} />;
      case "resume-upload":      return <ResumeUpload onSubmit={() => setCurrentPage("resume-suggestions")} />;
      case "resume-suggestions": return <ResumeSuggestions onBack={() => setCurrentPage("resume-upload")} onProceed={() => setCurrentPage("text-interview")} />;
      default:                   return <TextInterview />;
    }
  };

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg }}>

        {/* Page content */}
        <div style={{ paddingBottom: 100 }}>
          {renderPage()}
        </div>

        {/* Bottom page switcher */}
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
          background: "#111", borderRadius: 14, padding: "10px 14px",
          display: "flex", gap: 6, zIndex: 9999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setCurrentPage(p.id)}
              style={{
                padding: "8px 14px", borderRadius: 9, border: "none",
                background: currentPage === p.id ? colors.orange : "rgba(255,255,255,0.08)",
                color: currentPage === p.id ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: fonts.display, transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}