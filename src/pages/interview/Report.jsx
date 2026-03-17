import { useState } from "react";
import { colors, fonts, globalCss } from "../../styles/theme";
import Navbar from "../../components/layout/Navbar";
import ScoreCard from "../../components/interview/ScoreCard";

const SCORES = [
  { metric: "Overall Score", score: 78, icon: "🏆", detail: "Strong performance — a few more targeted sessions will get you to 90+." },
  { metric: "Clarity", score: 82, icon: "💬", detail: "Your answers were well-structured and easy to follow throughout the session." },
  { metric: "STAR Format", score: 74, icon: "⭐", detail: "Good use of STAR in Q1 & Q3. Q2 lacked a clear Result — quantify outcomes." },
  { metric: "Relevance", score: 70, icon: "🎯", detail: "Most answers were on-topic. Watch for tangents — stay focused on the core question." },
  { metric: "Confidence", score: 85, icon: "💪", detail: "Tone was assertive and composed. No excessive hedging detected." },
  { metric: "Conciseness", score: 65, icon: "⏱", detail: "Answers averaged ~3.5 min. Aim for 2–2.5 min for behavioral questions." },
];

const FEEDBACK_SECTIONS = [
  {
    question: "Tell me about a time you had to make a critical decision with incomplete information.",
    score: 80,
    strength: "You clearly laid out the context and your decision-making process. The Situation and Task parts were excellent.",
    improvement: "Your Result was vague — 'it worked out well' is not enough. Add concrete metrics: 'we shipped on time and reduced churn by 12%'.",
    improved_answer: "In Q3 2024, our production system started degrading 20 mins before a major launch. With only partial logs, I made the call to roll back the last deploy. The system recovered in 4 minutes, we launched on time, and post-incident analysis confirmed my diagnosis. This reduced customer-facing errors by 94%.",
  },
  {
    question: "Describe a situation where you disagreed with your manager. How did you handle it?",
    score: 72,
    strength: "You demonstrated psychological safety and professional communication. Good use of data to make your case.",
    improvement: "You focused too much on being 'right'. Interviewers want to see collaboration — mention how you incorporated your manager's perspective even while disagreeing.",
    improved_answer: "I disagreed with my manager on a feature prioritization call. Instead of just pushing back, I wrote a short doc with user research data supporting my view, shared it async, and requested a 15-min sync. We ultimately found a middle ground — we ran a small experiment that validated my hypothesis, but my manager's risk-aversion led us to a phased rollout, which actually worked better.",
  },
];

export default function Report({ onRetry }) {
  const [activeTab, setActiveTab] = useState("overview");
  const overall = SCORES[0];

  const getGrade = (score) => {
    if (score >= 90) return { label: "A+", color: colors.green };
    if (score >= 80) return { label: "A", color: colors.green };
    if (score >= 70) return { label: "B", color: colors.orange };
    return { label: "C", color: "#e53e3e" };
  };

  const grade = getGrade(overall.score);

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg }}>
        <Navbar />

        {/* Report header */}
        <div style={{
          background: colors.white, borderBottom: `1px solid ${colors.border}`,
          padding: "32px 48px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
                  color: colors.muted, marginBottom: 8,
                }}>Interview Report</div>
                <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
                  Google · Behavioral · SWE L4
                </h1>
                <p style={{ color: colors.muted, fontSize: 14 }}>
                  Completed March 9, 2026 · 3 questions · 24 minutes
                </p>
              </div>

              {/* Grade badge */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: colors.bg, border: `1px solid ${colors.border}`,
                borderRadius: 16, padding: "20px 32px",
              }}>
                <div style={{
                  fontFamily: fonts.display, fontWeight: 900,
                  fontSize: 52, color: grade.color, lineHeight: 1,
                }}>{grade.label}</div>
                <div style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
                  {overall.score}/100
                </div>
              </div>
            </div>

            {/* Summary pills */}
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {[
                { label: "3 Questions Answered", icon: "✅" },
                { label: "2 Follow-ups Handled", icon: "🔄" },
                { label: "Avg Answer: 3.2 min", icon: "⏱" },
                { label: "STAR Used: 2/3", icon: "⭐" },
              ].map(p => (
                <div key={p.label} style={{
                  background: colors.bg, border: `1px solid ${colors.border}`,
                  borderRadius: 99, padding: "6px 14px",
                  fontSize: 13, color: colors.ink, display: "flex", alignItems: "center", gap: 6,
                }}>
                  {p.icon} {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 28,
            background: colors.white, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: 4, width: "fit-content",
          }}>
            {[
              { key: "overview", label: "📊 Score Overview" },
              { key: "feedback", label: "💬 Question Feedback" },
              { key: "next", label: "🚀 Next Steps" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: "8px 18px", borderRadius: 7, border: "none",
                background: activeTab === t.key ? colors.dark : "transparent",
                color: activeTab === t.key ? "#fff" : colors.muted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="fade-up">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                {SCORES.map((s, i) => (
                  <ScoreCard key={i} metric={s.metric} score={s.score} icon={s.icon} detail={s.detail} />
                ))}
              </div>
              <div style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: 14, padding: 28,
              }}>
                <h3 style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
                  Score Breakdown
                </h3>
                {SCORES.slice(1).map((s, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 14, color: colors.ink, fontWeight: 500 }}>
                        {s.icon} {s.metric}
                      </span>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: s.score >= 80 ? colors.green : s.score >= 65 ? colors.orange : "#e53e3e",
                      }}>{s.score}%</span>
                    </div>
                    <div style={{ height: 8, background: colors.bg, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        background: s.score >= 80
                          ? `linear-gradient(90deg, ${colors.green}, #48c78e)`
                          : s.score >= 65
                          ? `linear-gradient(90deg, ${colors.orange}, #ff8c5a)`
                          : `linear-gradient(90deg, #e53e3e, #fc8181)`,
                        width: `${s.score}%`,
                        transition: "width 0.8s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback tab */}
          {activeTab === "feedback" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {FEEDBACK_SECTIONS.map((f, i) => (
                <div key={i} style={{
                  background: colors.white, border: `1px solid ${colors.border}`,
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "18px 24px", borderBottom: `1px solid ${colors.border}`,
                    background: "#faf9f7", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: colors.muted, marginBottom: 4 }}>
                        Question {i + 1}
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: colors.ink }}>"{f.question}"</p>
                    </div>
                    <div style={{
                      background: f.score >= 80 ? colors.greenLight : colors.orangeLight,
                      color: f.score >= 80 ? colors.green : colors.orange,
                      padding: "5px 14px", borderRadius: 99,
                      fontSize: 14, fontWeight: 700, flexShrink: 0, marginLeft: 16,
                    }}>{f.score}/100</div>
                  </div>

                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{
                      background: colors.greenLight, border: `1px solid #b2f0d6`,
                      borderRadius: 10, padding: "14px 18px",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 6 }}>✅ Strength</div>
                      <p style={{ fontSize: 14, color: "#1a4a2e", lineHeight: 1.6 }}>{f.strength}</p>
                    </div>

                    <div style={{
                      background: colors.orangeLight, border: `1px solid ${colors.orangeMid}`,
                      borderRadius: 10, padding: "14px 18px",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, marginBottom: 6 }}>🔧 Improve</div>
                      <p style={{ fontSize: 14, color: "#7a3010", lineHeight: 1.6 }}>{f.improvement}</p>
                    </div>

                    <div style={{
                      background: "#f8f7ff", border: "1px solid #ddd6fe",
                      borderRadius: 10, padding: "14px 18px",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>✨ Model Answer</div>
                      <p style={{ fontSize: 14, color: "#3b2270", lineHeight: 1.7, fontStyle: "italic" }}>
                        "{f.improved_answer}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next steps tab */}
          {activeTab === "next" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: 14, padding: 28,
              }}>
                <h3 style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                  Your personalized action plan
                </h3>
                {[
                  { priority: "High", icon: "🔴", action: "Practice quantifying results — add numbers/% to every story you tell.", tag: "STAR · Result" },
                  { priority: "High", icon: "🔴", action: "Record yourself answering Q2 again and aim for under 2.5 minutes.", tag: "Conciseness" },
                  { priority: "Med", icon: "🟡", action: "Prepare 2 more 'disagreement' stories — interviewers love testing this.", tag: "Story Bank" },
                  { priority: "Med", icon: "🟡", action: "Review Google's Leadership Principles and tie each story to one.", tag: "Company Fit" },
                  { priority: "Low", icon: "🟢", action: "Your opening and clarity were strong — keep doing what you're doing!", tag: "Strength" },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 0", borderBottom: i < 4 ? `1px solid ${colors.border}` : "none",
                  }}>
                    <span style={{ fontSize: 18, marginTop: 2 }}>{a.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, color: colors.ink, lineHeight: 1.6, marginBottom: 4 }}>{a.action}</p>
                      <span style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: 1,
                        textTransform: "uppercase", color: colors.muted,
                      }}>{a.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <button onClick={onRetry} style={{
                  padding: "16px", background: colors.orange, color: "#fff",
                  border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: fonts.display,
                }}>
                  🔁 Practice Again
                </button>
                <button style={{
                  padding: "16px", background: colors.white, color: colors.ink,
                  border: `1.5px solid ${colors.border}`, borderRadius: 12, fontSize: 15, fontWeight: 600,
                  cursor: "pointer",
                }}>
                  📤 Export PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}