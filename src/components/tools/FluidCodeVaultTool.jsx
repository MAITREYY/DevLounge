import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, ArrowLeft, Sparkles, Construction } from 'lucide-react';

export default function FluidCodeVaultTool() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-8">
      {/* Icon Badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Construction className="w-4 h-4 text-white" />
        </span>
      </div>

      {/* Pill Badge */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Work in Progress • Launching Soon</span>
        </div>
      </div>

      {/* Heading & Description */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Code Vault is Under Development
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          We are building a robust pre-edit code safety vault with local version history and emergency 1-click restore for FTP developers.
        </p>
      </div>

      {/* Feature Highlights Preview */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
          Upcoming Features
        </span>
        <ul className="space-y-2 text-xs text-zinc-300 font-mono">
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Encrypted local storage version control</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Side-by-side code diff inspector for PHP, CSS & JS</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <span>1-Click emergency FTP backup restore clipboard</span>
          </li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
