import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Search, Code2, Cpu, Wrench } from 'lucide-react';

export default function Header({ activeTool, setActiveTool, toolsList, searchQuery, setSearchQuery }) {
  return (
    <nav className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer flex items-center gap-2.5 group"
            onClick={() => setActiveTool('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1.5 shadow-md shadow-emerald-950/40 relative overflow-hidden group-hover:border-emerald-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/icon/fuildtool.svg" alt="FluidTools Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  FluidTools
                </span>
                <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-800/60 text-emerald-300 font-semibold tracking-wide">
                  v2.0 PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">Modern Web Developer Toolbox</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Nav Tools Bar */}
        <div className="hidden lg:flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/90 shadow-inner">
          <button
            onClick={() => setActiveTool('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTool === 'dashboard'
                ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </button>
          
          {toolsList.map((t) => {
            const IconComponent = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${t.color}`} />
                <span>{t.name}</span>
                {t.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. clamp)..."
              className="w-full bg-zinc-950 border border-zinc-800/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toolsList.length} Active Tools</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
