import { useState, useEffect, useRef } from "react";
import { colors, fonts, globalCss } from "../../styles/theme";
import Navbar from "../../components/layout/Navbar";
import MicButton from "../../components/interview/MicButton";
import Transcript from "../../components/interview/Transcript";

const QUESTIONS = [
  "Tell me about yourself and why you're interested in this role at Meta.",
  "Describe a time you had to influence a decision without direct authority.",
  "Walk me through a project you're most proud of.",
];

const WAVEFORM_BARS = 36;

export default function VoiceInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [waveHeights, setWaveHeights] = useState(Array(WAVEFORM_BARS).fill(4));
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveHeights(Array.from({ length: WAVEFORM_BARS }, (_, i) => {
          const base = Math.sin(Date.now() / 200 + i * 0.5) * 10 + 14;
          return Math.max(4, base + Math.random() * 14);
        }));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setWaveHeights(Array(WAVEFORM_BARS).fill(4));
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleToggle = async () => {
    if (phase === "intro") {
      setPhase("listening");
      setIsRecording(true);
      setTranscript([{ role: "ai", text: QUESTIONS[0], ts: "0:00" }]);
    } else if (isRecording) {
      setIsRecording(false);
      setPhase("processing");

      const userAnswers = [
        "Sure! I've been working as a product manager for about 4 years, mostly in fintech. I'm really excited about Meta's mission to connect people, and I think my experience building social features aligns well with what your team is doing.",
        "At my last company, I had to convince the engineering team to deprioritize a feature they were excited about. I used data from user interviews to show that the impact would be lower than expected.",
      ];

      const userText = userAnswers[questionIndex] || "That's a great question. Let me think through this carefully...";

      await new Promise(r => setTimeout(r, 1200));

      setTranscript(prev => [...prev, {
        role: "user", text: userText, ts: formatTime(timer),
      }]);

      setPhase("ai_speaking");
      await new Promise(r => setTimeout(r, 2000));

      if (questionIndex + 1 < QUESTIONS.length) {
        const nextQ = QUESTIONS[questionIndex + 1];
        setTranscript(prev => [...prev, { role: "ai", text: nextQ, ts: formatTime(timer + 3) }]);
        setQuestionIndex(i => i + 1);
        setPhase("listening");
        setIsRecording(true);
      } else {
        setTranscript(prev => [...prev, {
          role: "ai",
          text: "Excellent session! You've answered all questions. Head to the Report page for your detailed feedback and scores.",
          ts: formatTime(timer + 3),
        }]);
        setPhase("done");
      }
    }
  };

  const phaseLabels = {
    intro: "Press mic to start your voice interview",
    listening: "I'm listening — speak your answer clearly",
    processing: "Processing your response...",
    ai_speaking: "AI is preparing the next question...",
    done: "Session complete! View your Report for detailed feedback.",
  };

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg }}>
        <Navbar />

        {/* Session info bar */}
        <div style={{
          background: colors.white, borderBottom: `1px solid ${colors.border}`,
          padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 16 }}>
              🎙 Voice Interview
            </div>
            <div style={{
              background: colors.greenLight, color: colors.green,
              padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            }}>Meta · PM · Round 1</div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ fontSize: 13, color: colors.muted }}>
              Question <strong style={{ color: colors.ink }}>{Math.min(questionIndex + 1, QUESTIONS.length)}</strong> of {QUESTIONS.length}
            </div>
            {isRecording && (
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 16, color: colors.orange }}>
                ● {formatTime(timer)}
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

            {/* Main mic area */}
            <div style={{
              background: colors.white, border: `1px solid ${colors.border}`,
              borderRadius: 20, padding: "48px 40px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
            }}>
              {/* Current question */}
              <div style={{
                background: colors.bg, borderRadius: 12,
                padding: "20px 24px", width: "100%", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: colors.muted, marginBottom: 10 }}>
                  Current Question
                </div>
                <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.55, color: colors.ink }}>
                  "{QUESTIONS[Math.min(questionIndex, QUESTIONS.length - 1)]}"
                </p>
              </div>

              {/* Waveform */}
              <div style={{
                height: 60, display: "flex", alignItems: "center",
                gap: 3, width: "100%", justifyContent: "center",
              }}>
                {waveHeights.map((h, i) => (
                  <div key={i} style={{
                    width: 4, height: h,
                    background: isRecording ? colors.orange : colors.border,
                    borderRadius: 2,
                    transition: isRecording ? "height 0.08s ease" : "height 0.3s ease",
                  }} />
                ))}
              </div>

              {/* Mic button */}
              <MicButton
                isRecording={isRecording}
                onToggle={handleToggle}
                size="lg"
              />

              {/* Status label */}
              <div style={{
                textAlign: "center", maxWidth: 360,
                fontSize: 14, color: phase === "done" ? colors.green : colors.muted,
                lineHeight: 1.5, fontWeight: phase === "done" ? 600 : 400,
              }}>
                {phaseLabels[phase]}
              </div>

              {(phase === "processing" || phase === "ai_speaking") && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="spin" style={{ display: "inline-block", fontSize: 18 }}>⟳</span>
                  <span style={{ fontSize: 13, color: colors.muted }}>
                    {phase === "processing" ? "Transcribing..." : "Preparing next question..."}
                  </span>
                </div>
              )}

              {/* Question dots */}
              <div style={{ display: "flex", gap: 8 }}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i < questionIndex ? colors.green
                      : i === questionIndex ? colors.orange
                      : colors.border,
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            </div>

            {/* Transcript sidebar */}
            <div style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
              <Transcript entries={transcript} isLive={isRecording} />
            </div>
          </div>

          {/* Tips row */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 24,
          }}>
            {[
              { icon: "🎤", tip: "Speak at a normal pace — the AI follows along in real-time" },
              { icon: "⭐", tip: "Use the STAR method: Situation → Task → Action → Result" },
              { icon: "🔇", tip: "Find a quiet space — background noise can affect transcription" },
            ].map((t, i) => (
              <div key={i} style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: 10, padding: "14px 18px",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.55 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}