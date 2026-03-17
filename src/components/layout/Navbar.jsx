import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0f1c]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <div className="rounded-xl bg-cyan-400/15 p-2 text-cyan-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PrepAxis</h1>
            <p className="text-xs text-slate-400">AI Interview Coach</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-slate-300 transition hover:text-cyan-400">
            Features
          </a>
          <a href="#how-it-works" className="text-slate-300 transition hover:text-cyan-400">
            How it Works
          </a>
          <a href="#cta" className="text-slate-300 transition hover:text-cyan-400">
            Get Started
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#login"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400"
          >
            Login
          </a>
          <a
            href="#register"
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}