import { useState, useRef, useEffect } from "react";
import { colors, fonts, globalCss } from "../../styles/theme";
import Navbar from "../../components/layout/Navbar";
import ChatBubble from "../../components/interview/ChatBubble";

const COMPANIES = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix", "Stripe", "OpenAI"];
const TYPES = ["Behavioral", "Technical", "System Design", "PM"];

const INITIAL_MESSAGES = [
  {
    role: "ai",
    text: "Hi! I'm your AI interviewer today. I'll be simulating a Google Behavioral interview. Feel free to take your time with each answer — I'll ask follow-ups just like a real interviewer would. Ready to begin?",
    ts: "Just now",
  },
];

const FOLLOW_UPS = [
  "Interesting! Can you tell me more about the specific challenges you faced?",
  "That's a great example. What would you do differently if you faced this situation again?",
  "Good answer. How did you measure the success of that outcome?",
  "I see. Who else was involved, and how did you manage those stakeholders?",
  "Can you walk me through your decision-making process in more detail?",
];

const QUESTIONS = [
  "Tell me about a time you had to make a critical decision with incomplete information.",
  "Describe a situation where you disagreed with your manager. How did you handle it?",
  "Give me an example of a time you took ownership of a project beyond your role.",
];

export default function TextInterview() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [company, setCompany] = useState("Google");
  const [interviewType, setInterviewType] = useState("Behavioral");
  const [sessionDone, setSessionDone] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = {
      role: "user",
      text: input.trim(),
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1400 + Math.random() * 800));

    let aiReply;
    if (!started) {
      setStarted(true);
      aiReply = QUESTIONS[0];
      setQuestionIndex(0);
    } else if (followUpCount < 1) {
      aiReply = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
      setFollowUpCount(f => f + 1);
    } else if (questionIndex + 1 < QUESTIONS.length) {
      const next = questionIndex + 1;
      setQuestionIndex(next);
      setFollowUpCount(0);
      aiReply = `Good answer! Let's move on. ${QUESTIONS[next]}`;
    } else {
      aiReply = "Great session! You've completed all questions. I'll now generate your detailed performance report. Check the Report page for your scores.";
      setSessionDone(true);
    }

    setMessages(prev => [...prev, {
      role: "ai",
      text: aiReply,
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setIsTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", flexDirection: "column" }}>
        <Navbar />

        {/* Session header */}
        <div style={{
          background: colors.white, borderBottom: `1px solid ${colors.border}`,
          padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: colors.dark, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18,
            }}>🤖</div>
            <div>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15 }}>
                AI Interviewer
              </div>
              <div style={{ fontSize: 12, color: colors.muted }}>
                {company} · {interviewType} Interview
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: colors.greenLight, color: colors.green,
              padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, marginLeft: 8,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green, animation: "blink 1s infinite" }} />
              Live Session
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <select value={company} onChange={e => setCompany(e.target.value)} style={{
              padding: "7px 12px", borderRadius: 7, border: `1px solid ${colors.border}`,
              background: colors.bg, fontSize: 13, fontWeight: 500, color: colors.ink,
              cursor: "pointer", outline: "none",
            }}>
              {COMPANIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={interviewType} onChange={e => setInterviewType(e.target.value)} style={{
              padding: "7px 12px", borderRadius: 7, border: `1px solid ${colors.border}`,
              background: colors.bg, fontSize: 13, fontWeight: 500, color: colors.ink,
              cursor: "pointer", outline: "none",
            }}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Chat area + sidebar */}
        <div style={{
          flex: 1, display: "grid", gridTemplateColumns: "1fr 280px",
          maxWidth: 1100, width: "100%", margin: "0 auto",
          padding: "24px 24px 0", gap: 20, alignItems: "start",
        }}>
          {/* Chat column */}
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)" }}>
            <div style={{
              flex: 1, overflowY: "auto", padding: "8px 4px 16px",
              scrollbarWidth: "thin", scrollbarColor: `${colors.border} transparent`,
            }}>
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} timestamp={m.ts} />
              ))}
              {isTyping && <ChatBubble role="ai" isTyping />}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{
              background: colors.white,
              border: `1.5px solid ${colors.border}`,
              borderRadius: 14, padding: "12px 16px",
              display: "flex", gap: 10, alignItems: "flex-end",
              marginBottom: 20,
              boxShadow: "0 -2px 16px rgba(0,0,0,0.04)",
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={isTyping || sessionDone}
                placeholder={sessionDone ? "Session complete — check your Report!" : "Type your answer... (Enter to send, Shift+Enter for new line)"}
                rows={2}
                style={{
                  flex: 1, border: "none", outline: "none", resize: "none",
                  fontSize: 14, lineHeight: 1.6, fontFamily: fonts.body,
                  color: colors.ink, background: "transparent",
                  maxHeight: 120, overflowY: "auto",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping || sessionDone}
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: input.trim() && !isTyping && !sessionDone ? colors.orange : colors.border,
                  border: "none", cursor: input.trim() && !isTyping && !sessionDone ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0, transition: "all 0.15s",
                }}
              >
                {isTyping ? <span className="spin" style={{ display: "inline-block", fontSize: 14 }}>⟳</span> : "↑"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
              background: colors.white, border: `1px solid ${colors.border}`,
              borderRadius: 12, padding: "18px 20px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: colors.muted, marginBottom: 12 }}>
                Progress
              </div>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: i < questionIndex ? colors.green : i === questionIndex ? colors.orange : colors.border,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: i <= questionIndex ? "#fff" : colors.muted,
                  }}>
                    {i < questionIndex ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize: 12, color: i === questionIndex ? colors.ink : colors.muted,
                    fontWeight: i === questionIndex ? 600 : 400, lineHeight: 1.4,
                  }}>
                    Q{i + 1}: {q.slice(0, 38)}...
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              background: colors.orangeLight, border: `1px solid ${colors.orangeMid}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, marginBottom: 10 }}>
                💡 STAR Reminder
              </div>
              {["Situation", "Task", "Action", "Result"].map((s) => (
                <div key={s} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: colors.orange, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, flexShrink: 0,
                  }}>{s[0]}</div>
                  <span style={{ fontSize: 12, color: "#a04020" }}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: colors.white, border: `1px solid ${colors.border}`,
              borderRadius: 12, padding: "14px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontFamily: fonts.display, fontWeight: 800 }}>
                {messages.filter(m => m.role === "user").length}
              </div>
              <div style={{ fontSize: 12, color: colors.muted }}>responses given</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}