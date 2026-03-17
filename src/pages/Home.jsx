import {
  Mic,
  FileText,
  BarChart3,
  ShieldCheck,
  MessageSquareText,
  Brain,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { colors, fonts } from "../styles/theme";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const features = [
  {
    icon: <Mic size={28} />,
    title: "Voice & Text Mock Interviews",
    description:
      "Practice realistic interview rounds through both voice and text modes. Improve your fluency, confidence, and clarity under pressure.",
  },
  {
    icon: <FileText size={28} />,
    title: "AI Resume Analysis",
    description:
      "Upload your resume and receive smart suggestions on formatting, impact, keyword usage, and role-specific improvements.",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Performance Tracking",
    description:
      "Track interview scores, communication growth, confidence trends, and weak areas through detailed performance reports.",
  },
  {
    icon: <MessageSquareText size={28} />,
    title: "Interactive Feedback",
    description:
      "Get instant feedback on your answers, tone, structure, and communication so every practice session becomes measurable progress.",
  },
  {
    icon: <Brain size={28} />,
    title: "AI-Powered Coaching",
    description:
      "PrepAxis acts like a personal interview coach that identifies weaknesses and helps you prepare smarter, not just harder.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure User Authentication",
    description:
      "Login and signup system with protected access to your dashboard, reports, and personalized interview preparation history.",
  },
];

const highlights = [
  "Role-based interview practice",
  "Resume improvement suggestions",
  "Detailed report generation",
  "Clean dashboard for tracking growth",
  "AI-powered experience",
  "Built for students and job seekers",
];

const stats = [
  { value: "24/7", label: "AI Practice Access" },
  { value: "Instant", label: "Feedback Response" },
  { value: "Voice + Text", label: "Interview Modes" },
  { value: "Personalized", label: "Resume Insights" },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, width: "100%", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: "60px 24px", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", marginBottom: 60 }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: colors.orangeLight,
              color: colors.orange,
              padding: "8px 16px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 24,
              fontFamily: fonts.display,
            }}>
              ✨ AI Interview Preparation
            </div>

            <h1 style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              color: colors.dark,
              fontFamily: fonts.display,
              marginBottom: 24,
            }}>
              Master Interviews with <span style={{ color: colors.orange }}>PrepAI</span>
            </h1>

            <p style={{
              fontSize: 16,
              color: colors.muted,
              lineHeight: 1.6,
              marginBottom: 32,
              fontFamily: fonts.body,
            }}>
              PrepAI is an intelligent interview preparation platform that helps you improve interview performance through AI-powered mock interviews, resume analysis, detailed feedback, and progress tracking — all in one place.
            </p>

            <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
              <a href="/register" style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: colors.orange,
                color: colors.white,
                padding: "12px 28px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: fonts.display,
                transition: "all 0.2s",
              }}>
                Start Preparing <ArrowRight size={18} />
              </a>
              <a href="/login" style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: colors.white,
                color: colors.dark,
                padding: "12px 28px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: fonts.display,
                border: `1px solid ${colors.border}`,
                transition: "all 0.2s",
              }}>
                Login
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {highlights.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  background: colors.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: colors.dark,
                  fontFamily: fonts.body,
                }}>
                  <CheckCircle2 size={16} color={colors.orange} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Card */}
          <div style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}>
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${colors.border}` }}>
              <p style={{ fontSize: 12, color: colors.muted, fontWeight: 600, marginBottom: 4 }}>LIVE INTERVIEW</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.dark, fontFamily: fonts.display }}>
                Google Behavioral
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{
                background: colors.orangeLight,
                padding: 12,
                borderRadius: 8,
                textAlign: "center",
              }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: colors.orange, fontFamily: fonts.display }}>84%</p>
                <p style={{ fontSize: 11, color: colors.orange, marginTop: 4 }}>Overall Score</p>
              </div>
              <div style={{
                background: colors.greenLight,
                padding: 12,
                borderRadius: 8,
                textAlign: "center",
              }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: colors.green, fontFamily: fonts.display }}>8 min</p>
                <p style={{ fontSize: 11, color: colors.green, marginTop: 4 }}>Avg Response</p>
              </div>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.muted, fontFamily: fonts.body }}>
              <p style={{ marginBottom: 12 }}>
                "Great answers! Your STAR framework was clear and well-structured. Focus on quantifying results more."
              </p>
              <p style={{ fontWeight: 600, color: colors.dark }}>Next: Tell me about a conflict you resolved...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "60px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 24,
        marginBottom: 80,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}>
            <p style={{
              fontSize: 32,
              fontWeight: 800,
              color: colors.orange,
              fontFamily: fonts.display,
              marginBottom: 8,
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: 14, color: colors.muted }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", background: colors.white, borderTop: `1px solid ${colors.border}`, width: "100%", overflowX: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div id="features" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              display: "inline-block",
              background: colors.orangeLight,
              color: colors.orange,
              padding: "6px 12px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: fonts.display,
            }}>
              KEY FEATURES
            </div>
            <h2 style={{
              fontSize: 40,
              fontWeight: 800,
              color: colors.dark,
              fontFamily: fonts.display,
              marginBottom: 16,
            }}>
              Everything You Need to Ace Interviews
            </h2>
            <p style={{
              fontSize: 16,
              color: colors.muted,
              maxWidth: 500,
              margin: "0 auto",
              fontFamily: fonts.body,
            }}>
              Comprehensive tools designed to help you prepare for any interview challenge.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 28,
                transition: "all 0.2s",
              }}>
                <div style={{ color: colors.orange, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.dark,
                  marginBottom: 10,
                  fontFamily: fonts.display,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: colors.muted,
                  lineHeight: 1.6,
                  fontFamily: fonts.body,
                }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: colors.bg, borderTop: `1px solid ${colors.border}`, width: "100%", overflowX: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{
              display: "inline-block",
              background: colors.orangeLight,
              color: colors.orange,
              padding: "6px 12px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: fonts.display,
            }}>
              HOW IT WORKS
            </div>
            <h2 style={{
              fontSize: 40,
              fontWeight: 800,
              color: colors.dark,
              fontFamily: fonts.display,
            }}>
              A simple flow, built for serious preparation
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { num: "01", title: "Create your account", desc: "Sign up securely and access your personalized interview prep dashboard." },
              { num: "02", title: "Practice & upload", desc: "Attempt AI-powered mock interviews and upload your resume for role-specific suggestions." },
              { num: "03", title: "Track improvement", desc: "Review reports, find weak areas, and improve with structured feedback over time." },
            ].map((step, i) => (
              <div key={i} style={{
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 28,
              }}>
                <p style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: colors.orange,
                  fontFamily: fonts.display,
                  marginBottom: 16,
                }}>
                  {step.num}
                </p>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.dark,
                  marginBottom: 10,
                  fontFamily: fonts.display,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: colors.muted,
                  lineHeight: 1.6,
                  fontFamily: fonts.body,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={{ padding: "80px 24px", background: colors.bg, width: "100%", overflowX: "hidden" }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          padding: 48,
        }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            color: colors.dark,
            fontFamily: fonts.display,
            marginBottom: 16,
          }}>
            Ready to Ace Your Interviews?
          </h2>
          <p style={{
            fontSize: 16,
            color: colors.muted,
            marginBottom: 32,
            fontFamily: fonts.body,
          }}>
            Join thousands of students and job seekers preparing smarter with PrepAI.
          </p>
          <a href="/register" style={{
            display: "inline-block",
            background: colors.orange,
            color: colors.white,
            padding: "12px 32px",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
            cursor: "pointer",
            fontFamily: fonts.display,
            fontSize: 14,
            transition: "all 0.2s",
          }}>
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-[#10182a] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Target size={18} className="text-cyan-400" />
                    <p className="font-semibold">AI Suggestion</p>
                  </div>
                  <p className="text-slate-300">
                    Your technical answers are strong, but behavioral answers
                    need better structure. Use the STAR method for higher
                    clarity and impact.
                  </p>
                </div>
              </div>

              <div className="absolute -left-8 -top-8 hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl md:block">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-400">Realtime Feedback</p>
                    <p className="font-semibold">During practice sessions</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-6 hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl md:block">
                <div className="flex items-center gap-3">
                  <Brain className="text-purple-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-400">AI Coach</p>
                    <p className="font-semibold">Personalized preparation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center"
            >
              <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
              <p className="mt-2 text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Platform Features
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to prepare for interviews in one place
          </h2>
          <p className="mt-4 text-slate-400">
            PrepAxis is designed to help students, freshers, and professionals
            practice smarter through intelligent tools that simulate real
            interview preparation workflows.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-[#111a2d] p-8 lg:p-12">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              How It Works
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              A simple flow, built for serious preparation
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="mb-4 text-3xl font-bold text-cyan-400">01</div>
              <h3 className="text-xl font-semibold">Create your account</h3>
              <p className="mt-3 text-slate-400">
                Sign up securely and access your personalized interview prep
                dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="mb-4 text-3xl font-bold text-cyan-400">02</div>
              <h3 className="text-xl font-semibold">Practice and upload</h3>
              <p className="mt-3 text-slate-400">
                Attempt AI-powered mock interviews and upload your resume for
                role-specific suggestions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="mb-4 text-3xl font-bold text-cyan-400">03</div>
              <h3 className="text-xl font-semibold">Track improvement</h3>
              <p className="mt-3 text-slate-400">
                Review reports, find weak areas, and improve with structured
                feedback over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center lg:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to prepare smarter with AI?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Start building confidence, improving your resume, and practicing
            interviews with intelligent feedback designed for real growth.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:border-cyan-400"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
