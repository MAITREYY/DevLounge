import React from 'react';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-black py-6 text-center text-xs text-zinc-500 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>FluidTools Suite — Minimalist Developer Tools</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 font-mono text-[11px]">React 18 & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
