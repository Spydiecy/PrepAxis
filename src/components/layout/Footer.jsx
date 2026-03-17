import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070b14]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:text-left lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-white">PrepAxis</h3>
          <p className="mt-2 text-sm text-slate-400">
            AI Interview Coach for smarter preparation, better resumes, and
            stronger confidence.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            © 2026 PrepAxis. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a href="/" className="transition hover:text-cyan-400">
            <Github size={20} />
          </a>
          <a href="/" className="transition hover:text-cyan-400">
            <Linkedin size={20} />
          </a>
          <a href="/" className="transition hover:text-cyan-400">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}