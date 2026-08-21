import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import CodeModal from '../common/CodeModal';
import { Grid, Sparkles, Sliders, Code, Check, Copy, LayoutGrid } from 'lucide-react';

export default function CssGridTool() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(16);
  const [itemsCount, setItemsCount] = useState(6);

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const snippets = {
    css: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${cols}, minmax(0, 1fr));\n  grid-template-rows: repeat(${rows}, minmax(0, 1fr));\n  gap: ${gap}px;\n}`,
    tailwind: `className="grid grid-cols-${cols} gap-[${gap}px]"`,
    scss: `$grid-cols: ${cols};\n$grid-gap: ${gap}px;\n.layout-grid {\n  display: grid;\n  grid-template-columns: repeat($grid-cols, 1fr);\n  gap: $grid-gap;\n}`,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-zinc-950 to-zinc-950 border border-purple-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800/60 text-xs text-purple-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>CSS Grid & Flexbox Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            CSS Grid Layout Generator
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Interactive grid column, row, and gap builder with live responsive grid visualizer.
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
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <Code className="w-4 h-4" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Grid Controls
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Columns:</span>
                <span className="mono text-purple-400 font-bold">{cols} Cols</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="w-full cursor-pointer accent-purple-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Gap Spacing:</span>
                <span className="mono text-purple-400 font-bold">{gap}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full cursor-pointer accent-purple-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Number of Items:</span>
                <span className="mono text-purple-400 font-bold">{itemsCount} Items</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
                className="w-full cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-purple-400" /> Live Grid Canvas Preview
            </h2>

            <div
              className="bg-black p-6 rounded-2xl border border-zinc-800 min-h-[300px] transition-all"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: itemsCount }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 shadow-md hover:border-purple-500 transition-colors"
                >
                  <span className="text-xs font-bold text-purple-300 mono">Box {idx + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={snippets}
        title="CSS Grid Code Export"
      />
    </div>
  );
}
