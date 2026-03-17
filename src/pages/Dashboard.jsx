
import {
  TrendingUp,
  Mic,
  MessageSquareText,
  FileText,
  BarChart3,
  Clock3,
  ArrowRight,
  Brain,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { colors, fonts } from "../styles/theme";
import Sidebar from "../components/layout/Sidebar";

const stats = [
  {
    title: "Mock Interviews Completed",
    value: "24",
    change: "+12% this month",
    icon: MessageSquareText,
  },
  {
    title: "Resume Score",
    value: "84%",
    change: "+8% improvement",
    icon: FileText,
  },
  {
    title: "Confidence Rating",
    value: "88%",
    change: "+10% growth",
    icon: TrendingUp,
  },
  {
    title: "Average Performance",
    value: "91/100",
    change: "Strong progress",
    icon: BarChart3,
  },
];

const quickActions = [
  {
    title: "Start Text Interview",
    description:
      "Practice technical, HR, or role-based questions in chat format.",
    icon: MessageSquareText,
    path: "/interview/text",
  },
  {
    title: "Start Voice Interview",
    description:
      "Simulate a real-time interview and improve verbal communication.",
    icon: Mic,
    path: "/interview/voice",
  },
  {
    title: "Upload Resume",
    description:
      "Get AI-powered suggestions to strengthen impact and relevance.",
    icon: FileText,
    path: "/resume/upload",
  },
];

const recentActivity = [
  {
    title: "Frontend Developer Mock Interview",
    time: "Today, 10:30 AM",
    status: "Completed",
    score: "89/100",
  },
  {
    title: "Resume Analysis for SDE Role",
    time: "Yesterday, 7:15 PM",
    status: "Reviewed",
    score: "84%",
  },
  {
    title: "HR Behavioral Interview Session",
    time: "2 days ago",
    status: "Completed",
    score: "91/100",
  },
];

const strengths = [
  "Good technical answer accuracy",
  "Strong confidence in structured questions",
  "Improving consistency in mock rounds",
];

const focusAreas = [
  "Behavioral storytelling needs improvement",
  "Some answers are too lengthy",
  "More practice needed in voice fluency",
];

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, display: "flex" }}>
      <Sidebar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px" }}>
          {/* Top Bar */}
          <div style={{
            marginBottom: 32,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 24,
            alignItems: "center",
          }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: colors.orangeLight,
                color: colors.orange,
                padding: "6px 12px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 12,
                fontFamily: fonts.display,
              }}>
                ✨ AI-Powered Workspace
              </div>
              <h1 style={{
                fontSize: 32,
                fontWeight: 800,
                color: colors.dark,
                fontFamily: fonts.display,
                marginBottom: 12,
              }}>
                Welcome back, Deepanshi
              </h1>
              <p style={{
                fontSize: 14,
                color: colors.muted,
                lineHeight: 1.6,
                maxWidth: 500,
                fontFamily: fonts.body,
              }}>
                Track your interview growth, improve your resume, and practice smarter. Your dashboard shows your complete preparation progress.
              </p>
            </div>

            <div style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <CalendarDays size={18} color={colors.orange} />
              <div>
                <p style={{ fontSize: 11, color: colors.muted, fontFamily: fonts.body }}>Today's Goal</p>
                <p style={{ fontWeight: 600, color: colors.dark, fontSize: 13, fontFamily: fonts.display }}>
                  Complete 1 mock + review
                </p>
              </div>
            </div>
          </div>

          {/* Hero Insight */}
          <section style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
            <div style={{
              background: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
            }}>
              <p style={{
                fontSize: 11,
                color: colors.orange,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: fonts.display,
                marginBottom: 12,
              }}>
                PERFORMANCE INSIGHT
              </p>
              <h2 style={{
                fontSize: 24,
                fontWeight: 800,
                color: colors.dark,
                fontFamily: fonts.display,
                marginBottom: 12,
              }}>
                You are improving consistently
              </h2>
              <p style={{
                fontSize: 14,
                color: colors.muted,
                lineHeight: 1.7,
                marginBottom: 20,
                fontFamily: fonts.body,
              }}>
                Your recent interview sessions show strong technical capability and rising confidence. Focus on behavioral communication — clearer storytelling and impact statements.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Technical Accuracy", value: "92%", color: colors.orange },
                  { label: "Communication", value: "86%", color: colors.green },
                  { label: "Behavioral", value: "79%", color: colors.yellow },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    padding: 12,
                  }}>
                    <p style={{ fontSize: 11, color: colors.muted, fontFamily: fonts.body }}>
                      {item.label}
                    </p>
                    <p style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: item.color,
                      fontFamily: fonts.display,
                      marginTop: 8,
                    }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  background: colors.orangeLight,
                  padding: 8,
                  borderRadius: 6,
                  color: colors.orange,
                }}>
                  <Brain size={20} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: colors.muted, fontFamily: fonts.body }}>AI Recommendation</p>
                  <p style={{ fontWeight: 600, color: colors.dark, fontSize: 13, fontFamily: fonts.display }}>
                    Next Best Action
                  </p>
                </div>
              </div>

              <p style={{
                fontSize: 14,
                color: colors.muted,
                lineHeight: 1.7,
                marginBottom: 16,
                fontFamily: fonts.body,
              }}>
                Attempt one behavioral mock interview focusing on the STAR method and reducing unnecessary explanations.
              </p>

              <a href="/interview/text" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: colors.orange,
                color: colors.white,
                padding: "10px 20px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
                fontFamily: fonts.display,
              }}>
                Start Practice <ArrowRight size={16} />
              </a>
            </div>
          </section>

          {/* Stats */}
          <section style={{
            marginBottom: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}>
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 12, color: colors.muted, fontFamily: fonts.body }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: colors.dark,
                      fontFamily: fonts.display,
                      marginTop: 8,
                    }}>
                      {item.value}
                    </p>
                    <p style={{
                      fontSize: 12,
                      color: colors.orange,
                      fontWeight: 600,
                      marginTop: 4,
                      fontFamily: fonts.body,
                    }}>
                      {item.change}
                    </p>
                  </div>
                  <div style={{ color: colors.orange }}>
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 11,
                color: colors.orange,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: fonts.display,
                marginBottom: 8,
              }}>
                QUICK ACTIONS
              </p>
              <h2 style={{
                fontSize: 20,
                fontWeight: 800,
                color: colors.dark,
                fontFamily: fonts.display,
              }}>
                Continue your preparation
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.path}
                    style={{
                      background: colors.white,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: 20,
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ color: colors.orange, marginBottom: 12 }}>
                      <Icon size={24} />
                    </div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.dark,
                      fontFamily: fonts.display,
                      marginBottom: 6,
                    }}>
                      {action.title}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: colors.muted,
                      fontFamily: fonts.body,
                    }}>
                      {action.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 11,
                color: colors.orange,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: fonts.display,
                marginBottom: 8,
              }}>
                RECENT ACTIVITY
              </p>
              <h2 style={{
                fontSize: 20,
                fontWeight: 800,
                color: colors.dark,
                fontFamily: fonts.display,
              }}>
                Your preparation journey
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
                {recentActivity.map((item, i) => (
                  <div key={i} style={{
                    paddingBottom: 16,
                    borderBottom: i < recentActivity.length - 1 ? `1px solid ${colors.border}` : "none",
                    marginBottom: 16,
                  }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.dark, fontFamily: fonts.display }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: 12, color: colors.muted, marginTop: 4, fontFamily: fonts.body }}>
                      {item.time}
                    </p>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <span style={{
                        display: "inline-block",
                        background: colors.greenLight,
                        color: colors.green,
                        padding: "4px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: fonts.display,
                      }}>
                        {item.status}
                      </span>
                      <span style={{
                        display: "inline-block",
                        background: colors.orangeLight,
                        color: colors.orange,
                        padding: "4px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: fonts.display,
                      }}>
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: colors.dark,
                    fontFamily: fonts.display,
                    marginBottom: 12,
                  }}>
                    STRENGTHS
                  </p>
                  {strengths.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <CheckCircle2 size={16} color={colors.green} />
                      <p style={{ fontSize: 13, color: colors.muted, fontFamily: fonts.body }}>
                        {s}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: colors.dark,
                    fontFamily: fonts.display,
                    marginBottom: 12,
                  }}>
                    FOCUS AREAS
                  </p>
                  {focusAreas.map((s, i) => (
                    <p key={i} style={{
                      fontSize: 13,
                      color: colors.muted,
                      fontFamily: fonts.body,
                      marginBottom: 10,
                    }}>
                      • {s}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const stats = [
  {
    title: "Mock Interviews Completed",
    value: "24",
    change: "+12% this month",
    icon: MessageSquareText,
  },
  {
    title: "Resume Score",
    value: "84%",
    change: "+8% improvement",
    icon: FileText,
  },
  {
    title: "Confidence Rating",
    value: "88%",
    change: "+10% growth",
    icon: TrendingUp,
  },
  {
    title: "Average Performance",
    value: "91/100",
    change: "Strong progress",
    icon: BarChart3,
  },
];

const quickActions = [
  {
    title: "Start Text Interview",
    description:
      "Practice technical, HR, or role-based questions in chat format.",
    icon: MessageSquareText,
    path: "/interview/text",
  },
  {
    title: "Start Voice Interview",
    description:
      "Simulate a real-time interview and improve verbal communication.",
    icon: Mic,
    path: "/interview/voice",
  },
  {
    title: "Upload Resume",
    description:
      "Get AI-powered suggestions to strengthen impact and relevance.",
    icon: FileText,
    path: "/resume/upload",
  },
];

const recentActivity = [
  {
    title: "Frontend Developer Mock Interview",
    time: "Today, 10:30 AM",
    status: "Completed",
    score: "89/100",
  },
  {
    title: "Resume Analysis for SDE Role",
    time: "Yesterday, 7:15 PM",
    status: "Reviewed",
    score: "84%",
  },
  {
    title: "HR Behavioral Interview Session",
    time: "2 days ago",
    status: "Completed",
    score: "91/100",
  },
];

const strengths = [
  "Good technical answer accuracy",
  "Strong confidence in structured questions",
  "Improving consistency in mock rounds",
];

const focusAreas = [
  "Behavioral storytelling needs improvement",
  "Some answers are too lengthy",
  "More practice needed in voice fluency",
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#07101f] text-white lg:flex">
      <Sidebar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                <Sparkles size={16} />
                AI-Powered Career Preparation Workspace
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome back, Deepanshi
              </h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Track your interview growth, improve your resume, and practice
                smarter with PrepAxis. Your dashboard gives you a complete view
                of your preparation progress.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1728] px-5 py-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-cyan-400" size={20} />
                <div>
                  <p className="text-sm text-slate-400">Today's Goal</p>
                  <p className="font-semibold text-white">
                    Complete 1 mock + review feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Insight */}
          <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-purple-500/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Performance Insight
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                You are improving consistently across interviews
              </h2>
              <p className="mt-4 max-w-3xl text-slate-300 leading-7">
                Your recent interview sessions show strong technical capability
                and rising confidence. The next major improvement area is
                behavioral communication — especially concise storytelling and
                clearer impact statements.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Technical Accuracy</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-400">92%</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Communication</p>
                  <p className="mt-2 text-2xl font-bold text-blue-400">86%</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Behavioral Structure</p>
                  <p className="mt-2 text-2xl font-bold text-purple-400">
                    79%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
                  <Brain size={22} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">AI Recommendation</p>
                  <h3 className="text-lg font-semibold">Next Best Action</h3>
                </div>
              </div>

              <p className="text-slate-300 leading-7">
                Attempt one behavioral mock interview and then compare your
                answers using the report page. Focus on using the STAR method
                and reducing unnecessary explanation.
              </p>

              <Link
                to="/interview/text"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Start Practice
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{item.title}</p>
                      <h3 className="mt-3 text-3xl font-bold">{item.value}</h3>
                      <p className="mt-2 text-sm text-cyan-400">{item.change}</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Quick Actions
              </p>
              <h2 className="mt-2 text-2xl font-bold">Continue your preparation</h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={index}
                    to={action.path}
                    className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {action.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-400">
                      {action.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-cyan-400">
                      Continue
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Activity + Insights */}
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Recent Activity
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Your latest sessions
                  </h2>
                </div>
                <Clock3 className="text-slate-500" size={22} />
              </div>

              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-[#0d1728] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">{item.time}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                          {item.status}
                        </span>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="text-xl font-semibold">Strengths</h3>
                </div>

                <div className="space-y-3">
                  {strengths.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-800 bg-[#0d1728] px-4 py-3 text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                    <Target size={22} />
                  </div>
                  <h3 className="text-xl font-semibold">Focus Areas</h3>
                </div>

                <div className="space-y-3">
                  {focusAreas.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-800 bg-[#0d1728] px-4 py-3 text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
