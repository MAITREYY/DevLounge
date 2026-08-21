import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Search, Filter, ShieldCheck, Check } from 'lucide-react';

export default function Dashboard({ toolsList, setActiveTool, searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Utilities' },
    { id: 'typography', label: 'Typography' },
    { id: 'container', label: 'Layout & Containers' },
    { id: 'design', label: 'Glass & Shadows' },
  ];

  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [toolsList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Hero Header Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/50 border border-amber-800/60 text-xs text-amber-300 shadow-lg shadow-amber-950/40"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Developer Utility Suite & Code Generators v2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight"
        >
          Modern Web Developer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-purple-400">
            Fluid Toolbox
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Precision developer tools with zero setup. Generate responsive typography, container layouts, glass surfaces, and shadows in seconds.
        </motion.p>

        {/* Live Filter Category Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold shadow-md shadow-emerald-950/40'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800/90 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Section Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Active Developer Tools ({filteredTools.length})
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Real-time Client Calculations</span>
        </div>

        {/* Tools Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="tool-card glass-panel rounded-3xl p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group cursor-pointer"
                onClick={() => setActiveTool(tool.id)}
              >
                {/* Background Ambient Glow */}
                <div className={`absolute top-0 right-0 w-36 h-36 opacity-20 blur-[60px] pointer-events-none rounded-full ${tool.glowBg}`}></div>

                <div className="space-y-4">
                  {/* Top Row: Icon + Badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center p-3 shadow-md bg-black ${tool.borderAccent}`}>
                        <IconComponent className={`w-7 h-7 ${tool.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                            {tool.name}
                          </h3>
                          {tool.version && (
                            <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
                              {tool.version}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-mono mt-0.5 ${tool.color}`}>{tool.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/80 border border-zinc-800/80 text-[11px] text-zinc-400 mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Production Ready
                  </span>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition-all shadow-md group-hover:shadow-lg">
                    <span>Launch {tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
