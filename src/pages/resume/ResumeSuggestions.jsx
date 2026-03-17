import { useState } from "react";
import { colors, fonts, globalCss } from "../../styles/theme";
import Navbar from "../../components/layout/Navbar";
import ResumeComparison from "../../components/resume/ResumeComparison";

const MOCK_DIFFS = [
  {
    section: "Professional Summary",
    original: "Experienced software engineer with 5 years of experience. Good at building web applications and working with teams.",
    improved: "Results-driven Software Engineer with 5+ years building high-scale web applications. Delivered 3 production systems serving 500K+ daily users, collaborating across cross-functional teams in fast-paced startup environments.",
  },
  {
    section: "Work Experience — Key Bullet",
    original: "Worked on improving the performance of the backend API.",
    improved: "Reduced backend API latency by 62% (800ms → 310ms) by re-architecting database query logic and introducing Redis caching, directly improving user retention by 18%.",
  },
  {
    section: "Skills Section",
    original: "JavaScript, React, Node.js, SQL, Git, Problem-solving, Team player",
    improved: "TypeScript · React · Node.js · PostgreSQL · Redis · AWS (EC2, Lambda, S3) · Docker · CI/CD (GitHub Actions) · System Design · Agile/Scrum",
  },
  {
    section: "Education",
    original: "B.Tech in Computer Science, ABC University, 2019",
    improved: "B.Tech, Computer Science · ABC University · 2019 | Relevant: Distributed Systems, Algorithms, Database Engineering | GPA: 8.4/10",
  },
];

const MATCH_SCORES = [
  { label: "Keyword Match", score: 48, improved: 83, icon: "🔑" },
  { label: "ATS Compatibility", score: 61, improved: 91, icon: "🤖" },
  { label: "Impact Language", score: 35, improved: 88, icon: "💥" },
  { label: "Quantification", score: 22, improved: 79, icon: "📊" },
];

export default function ResumeSuggestions({ onBack, onProceed }) {
  const [activeTab, setActiveTab] = useState("compare");

  return (
    <>
      <style>{globalCss}</style>
      <div style={{ minHeight: "100vh", background: colors.bg }}>
        <Navbar />

        {/* Top banner */}
        <div style={{
          background: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          padding: "24px 48px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <button onClick={onBack} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: colors.muted, padding: 0,
                }}>← Back</button>
                <span style={{ color: colors.border }}>|</span>
                <div style={{
                  background: colors.greenLight, color: colors.green,
                  padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                }}>✨ Analysis Complete</div>
              </div>
              <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 24 }}>
                Resume Suggestions
              </h1>
              <p style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>
                Analyzing against: <strong style={{ color: colors.ink }}>Senior Software Engineer @ Google</strong>
              </p>
            </div>

            <button onClick={onProceed} style={{
              background: colors.orange, color: "#fff",
              border: "none", padding: "12px 28px",
              borderRadius: 9, fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: fonts.display,
            }}>
              Apply All & Continue →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

          {/* Score overview cards */}
          <div className="fade-up" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36,
          }}>
            {MATCH_SCORES.map((s, i) => (
              <div key={i} style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: 12, padding: "18px 20px",
              }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#e53e3e", fontWeight: 700, textDecoration: "line-through" }}>
                    {s.score}%
                  </span>
                  <span style={{ fontSize: 20, fontFamily: fonts.display, fontWeight: 800, color: colors.green }}>
                    {s.improved}%
                  </span>
                </div>
                <div style={{ height: 4, background: colors.bg, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    background: `linear-gradient(90deg, ${colors.orange}, ${colors.green})`,
                    width: `${s.improved}%`, transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="fade-up" style={{
            display: "flex", gap: 4, marginBottom: 24,
            background: colors.white, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: 4, width: "fit-content",
          }}>
            {[
              { key: "compare", label: "📝 Side-by-Side Diff" },
              { key: "keywords", label: "🔑 Missing Keywords" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: "8px 18px", borderRadius: 7, border: "none",
                background: activeTab === t.key ? colors.dark : "transparent",
                color: activeTab === t.key ? "#fff" : colors.muted,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Compare tab */}
          {activeTab === "compare" && (
            <div className="fade-up">
              <ResumeComparison diffs={MOCK_DIFFS} />
            </div>
          )}

          {/* Keywords tab */}
          {activeTab === "keywords" && (
            <div className="fade-up" style={{
              background: colors.white, border: `1px solid ${colors.border}`,
              borderRadius: 14, padding: 28,
            }}>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
                Keywords from JD missing in your resume
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
                {["distributed systems", "Kubernetes", "gRPC", "SLO/SLA", "on-call", "microservices", "Golang", "Spanner", "data pipelines", "observability"].map(k => (
                  <div key={k} style={{
                    background: "#fff5f5", border: "1px solid #fdd",
                    borderRadius: 7, padding: "6px 14px",
                    fontSize: 13, fontWeight: 500, color: "#c53030",
                  }}>{k}</div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 20 }}>
                <h4 style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                  Keywords you already have ✓
                </h4>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["React", "Node.js", "PostgreSQL", "AWS", "CI/CD", "Docker", "TypeScript"].map(k => (
                    <div key={k} style={{
                      background: colors.greenLight, border: `1px solid #b2f0d6`,
                      borderRadius: 7, padding: "6px 14px",
                      fontSize: 13, fontWeight: 500, color: colors.green,
                    }}>{k}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}