import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Type, BoxSelect, Search, ArrowRight, Layers, Check } from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const tools = [
    {
      id: 'fluidclamp',
      path: '/fluidclamp',
      name: 'FluidClamp',
      version: 'v1.2',
      category: 'typography',
      subtitle: 'Fluid Typography & CSS clamp()',
      renderIcon: () => <Type className="w-5 h-5 text-white" />,
      description: 'Create minimal, seamless font size scaling across mobile and desktop viewports without media queries using mathematical CSS clamp().',
      tags: ['CSS clamp()', 'PX ➔ REM Converter', 'Fluid Curve SVG', 'Tailwind & Bootstrap', 'WCAG 2.1 Audit'],
    },
    {
      id: 'fluidbox',
      path: '/fluidbox',
      name: 'FluidBox',
      version: 'v1.0',
      category: 'container',
      subtitle: 'Figma Container & Layout Generator',
      renderIcon: () => <BoxSelect className="w-5 h-5 text-white" />,
      description: 'Generate perfectly proportioned layout containers for Mobile and PC Figma artboards with controlled side and top/bottom padding.',
      tags: ['Figma Artboards', 'Side & Vertical Pad', 'Live Device Simulator', 'Tailwind & Bootstrap', 'Ergonomics Audit'],
    },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchCategory = filter === 'all' || t.category === filter;
      const matchSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [tools, filter, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <header className="text-center space-y-4 max-w-2xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono tracking-wide">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>Developer Utility Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Modern Web Developer <br />
          <span className="text-zinc-400 font-normal">Toolbox</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Lightweight, zero-dependency developer tools to generate responsive typography, screen containers, and layout code in seconds.
        </p>

        {/* Live Search Bar */}
        <div className="pt-4 relative max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, tag, or keyword (e.g. clamp, container)..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
          {/* Category Filter Chips */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === 'all'
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => setFilter('typography')}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === 'typography'
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              Typography
            </button>
            <button
              onClick={() => setFilter('container')}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === 'container'
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              Containers & Layout
            </button>
          </div>
        </div>
      </header>

      {/* Tools Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" /> Active Tools
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Showing {filteredTools.length} tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-black border border-zinc-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                {/* Top Row: Icon + Title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Link to={tool.path} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 group-hover:border-zinc-700 transition-colors block">
                      {tool.renderIcon()}
                    </Link>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                          <Link to={tool.path}>{tool.name}</Link>
                        </h3>
                        <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                          {tool.version}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">{tool.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {tool.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-zinc-400" /> Production Ready
                </span>
                <Link
                  to={tool.path}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-sm"
                >
                  <span>Launch {tool.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
