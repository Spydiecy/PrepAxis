import { Link } from "react-router-dom";
import {
  Mic,
  FileText,
  BarChart3,
  ShieldCheck,
  MessageSquareText,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Clock3,
} from "lucide-react";
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
  "Modern AI-first user experience",
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
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                <Sparkles size={16} />
                AI Interview Preparation Platform
              </div>

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Master Interviews with
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  PrepAxis
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                PrepAxis is an intelligent interview preparation platform that
                helps users improve interview performance through AI-powered
                mock interviews, resume analysis, detailed feedback, and
                progress tracking — all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Start Preparing
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-800"
                >
                  Login
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-slate-200"
                  >
                    <CheckCircle2 size={18} className="text-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Interview Summary</p>
                    <h3 className="text-2xl font-semibold">
                      Software Engineer Mock
                    </h3>
                  </div>
                  <div className="rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-300">
                    AI Evaluated
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-[#10182a] p-4">
                    <p className="text-sm text-slate-400">Confidence Score</p>
                    <p className="mt-2 text-3xl font-bold text-cyan-400">88%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#10182a] p-4">
                    <p className="text-sm text-slate-400">Answer Clarity</p>
                    <p className="mt-2 text-3xl font-bold text-blue-400">91%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#10182a] p-4">
                    <p className="text-sm text-slate-400">Resume Match</p>
                    <p className="mt-2 text-3xl font-bold text-purple-400">
                      84%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#10182a] p-4">
                    <p className="text-sm text-slate-400">Improvement Areas</p>
                    <p className="mt-2 text-lg font-semibold text-slate-200">
                      HR + Technical
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