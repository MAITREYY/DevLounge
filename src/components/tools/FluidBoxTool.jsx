import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import CodeModal from '../common/CodeModal';
import { Box, Sparkles, Sliders, Monitor, Smartphone, Tablet, Laptop, Code, Check, Copy, Layers, Layout } from 'lucide-react';

export default function FluidBoxTool() {
  const [artboardWidth, setArtboardWidth] = useState(1512);
  const [artboardHeight, setArtboardHeight] = useState(982);
  const [sidePadding, setSidePadding] = useState(64);
  const [verticalPadding, setVerticalPadding] = useState(80);
  const [useContainerQueries, setUseContainerQueries] = useState(false);

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate inner container width
  const containerWidth = useMemo(() => {
    return Math.max(0, artboardWidth - sidePadding * 2);
  }, [artboardWidth, sidePadding]);

  // Artboard Presets
  const presets = [
    { name: 'iPhone 15 Pro', width: 393, height: 852, icon: Smartphone, type: 'Mobile' },
    { name: 'iPad Pro 11"', width: 834, height: 1194, icon: Tablet, type: 'Tablet' },
    { name: 'MacBook Pro 14"', width: 1512, height: 982, icon: Laptop, type: 'Laptop' },
    { name: 'Desktop 4K', width: 2560, height: 1440, icon: Monitor, type: 'Desktop' },
  ];

  const applyPreset = (preset) => {
    setArtboardWidth(preset.width);
    setArtboardHeight(preset.height);
  };

  const snippets = {
    css: `.container {\n  width: 100%;\n  max-width: ${containerWidth}px;\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: ${sidePadding}px;\n  padding-right: ${sidePadding}px;\n  padding-top: ${verticalPadding}px;\n  padding-bottom: ${verticalPadding}px;\n}`,
    tailwind: `className="w-full max-w-[${containerWidth}px] mx-auto px-[${sidePadding}px] py-[${verticalPadding}px]"`,
    scss: `$container-max-width: ${containerWidth}px;\n.layout-wrapper {\n  max-width: $container-max-width;\n  margin: 0 auto;\n  padding: ${verticalPadding}px ${sidePadding}px;\n}`,
    bootstrap: `<div class="container-fluid px-sm-${Math.round(sidePadding / 16)} py-${Math.round(verticalPadding / 16)}">\n  <div className="mx-auto" style="max-width: ${containerWidth}px;">...</div>\n</div>`,
    vars: `:root {\n  --container-max-w: ${containerWidth}px;\n  --container-px: ${sidePadding}px;\n  --container-py: ${verticalPadding}px;\n}`,
  };

  const handleQuickCopy = () => {
    navigator.clipboard.writeText(snippets.css);
    setCopied(true);
    triggerCopyConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-zinc-950 border border-amber-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-800/60 text-xs text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Figma Artboard Container Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FluidBox Container & Artboard Studio
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Proportional layout containers and Figma artboard side/vertical padding code generator.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickCopy}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-300" />}
            <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Code className="w-4 h-4" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Visual Artboard Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sliders & Figma Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Artboard & Padding Controls
            </h2>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-400">Figma Artboard Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => {
                  const IconComp = p.icon;
                  const isSelected = artboardWidth === p.width;
                  return (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <div>
                        <div className="text-xs font-bold">{p.name}</div>
                        <div className="text-[10px] mono text-zinc-500">{p.width} × {p.height}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side Padding Slider */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Side Padding (X-Axis):</span>
                <span className="mono text-amber-400 font-bold">{sidePadding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={sidePadding}
                onChange={(e) => setSidePadding(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-400"
              />
            </div>

            {/* Vertical Padding Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Vertical Padding (Y-Axis):</span>
                <span className="mono text-amber-400 font-bold">{verticalPadding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={verticalPadding}
                onChange={(e) => setVerticalPadding(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-400"
              />
            </div>

            {/* Output Summary Card */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Artboard Width:</span>
                <span className="text-white">{artboardWidth}px</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold">
                <span>Max Container Width:</span>
                <span>{containerWidth}px</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Side Gaps (Total):</span>
                <span className="text-white">{sidePadding * 2}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Layout Canvas Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Device Frame */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-400" /> Interactive Artboard Simulator
              </h2>
              <span className="text-xs mono font-bold text-amber-400">
                Inner Content Width: {containerWidth}px
              </span>
            </div>

            {/* Visual Canvas Representation */}
            <div className="w-full bg-black rounded-2xl border border-zinc-800/90 p-6 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
              {/* Simulated Artboard Outer Box */}
              <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 shadow-2xl relative">
                {/* Padding Visualization Highlight */}
                <div
                  className="border-2 border-dashed border-amber-500/50 bg-amber-500/10 rounded-lg transition-all duration-150 flex flex-col items-center justify-center text-center p-6 space-y-3"
                  style={{
                    paddingLeft: `${Math.min(60, sidePadding / 4)}px`,
                    paddingRight: `${Math.min(60, sidePadding / 4)}px`,
                    paddingTop: `${Math.min(40, verticalPadding / 4)}px`,
                    paddingBottom: `${Math.min(40, verticalPadding / 4)}px`,
                  }}
                >
                  <div className="w-full bg-zinc-900 border border-zinc-700/80 rounded-md p-4 space-y-2">
                    <div className="h-3 w-3/4 bg-amber-400/80 rounded animate-pulse"></div>
                    <div className="h-2 w-1/2 bg-zinc-700 rounded"></div>
                    <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CSS Output Snippet */}
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Code className="w-4 h-4" /> Generated Tailwind CSS Class
            </span>
            <pre className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto select-all shadow-inner">
              <code>{snippets.tailwind}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Code Modal */}
      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={snippets}
        title="FluidBox Container Code Export"
      />
    </div>
  );
}
