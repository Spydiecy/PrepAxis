import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileUp,
  FileText,
  MessageSquareText,
  Mic,
  BarChart3,
  UserCircle2,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Resume Upload",
    icon: FileUp,
    path: "/resume/upload",
  },
  {
    label: "Resume Suggestions",
    icon: FileText,
    path: "/resume/suggestions",
  },
  {
    label: "Text Interview",
    icon: MessageSquareText,
    path: "/interview/text",
  },
  {
    label: "Voice Interview",
    icon: Mic,
    path: "/interview/voice",
  },
  {
    label: "Interview Report",
    icon: BarChart3,
    path: "/interview/report",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-[#0b1120] lg:flex lg:flex-col">
      <div className="border-b border-slate-800 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-400">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PrepAxis</h1>
            <p className="text-sm text-slate-400">AI Interview Coach</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>

        <nav className="mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  className={`transition ${
                    isActive
                      ? "text-slate-950"
                      : "text-slate-400 group-hover:text-cyan-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 p-5">
          <p className="text-sm font-semibold text-white">AI Coaching Tip</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Focus on structured answers. Strong interview performance is not
            only about knowledge — it is also about clarity, confidence, and
            communication.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-3">
          <div className="rounded-full bg-slate-800 p-2 text-cyan-400">
            <UserCircle2 size={22} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Deepanshi</p>
            <p className="text-xs text-slate-400">Student Dashboard</p>
          </div>
          <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}