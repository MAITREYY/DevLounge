import React from 'react';
import { Heart, Sparkles, Command, ShieldCheck, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-black/90 py-8 px-4 text-xs text-zinc-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/icon/fuildtool.svg" alt="FluidTools" className="w-5 h-5 opacity-70" />
          <span className="font-semibold text-zinc-300">FluidTools Suite v2.0</span>
          <span>— Precision Developer Generators & Fluid UI Tools</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400/90">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Command className="w-3.5 h-3.5 text-zinc-500" /> Fast Keyboard Controls
          </span>
        </div>
      </div>
    </footer>
  );
}
