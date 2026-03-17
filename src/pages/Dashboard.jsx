import { Link } from "react-router-dom";
import {
  TrendingUp,
  Mic,
  MessageSquareText,
  FileText,
  BarChart3,
  Clock3,
  ArrowRight,
  Target,
  Brain,
  CheckCircle2,
  Sparkles,
  CalendarDays,
} from "lucide-react";
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