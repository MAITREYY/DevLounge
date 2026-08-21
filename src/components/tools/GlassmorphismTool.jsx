import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import CodeModal from '../common/CodeModal';
import { Sliders, Sparkles, Code, Check, Copy, Layers, Eye, Image as ImageIcon } from 'lucide-react';

export default function GlassmorphismTool() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(25);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [bgHue, setBgHue] = useState(240);
  const [previewBg, setPreviewBg] = useState('mesh');

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const snippets = {
    css: `.glass-card {\n  background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});\n  backdrop-filter: blur(${blur}px);\n  -webkit-backdrop-filter: blur(${blur}px);\n  border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});\n  border-radius: 16px;\n}`,
    tailwind: `className="bg-white/${opacity} backdrop-blur-[${blur}px] border border-white/${borderOpacity} rounded-2xl"`,
    scss: `$glass-bg: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});\n$glass-blur: ${blur}px;\n.glass-surface {\n  background: $glass-bg;\n  backdrop-filter: blur($glass-blur);\n  border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});\n}`,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-zinc-950 to-zinc-950 border border-blue-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-xs text-blue-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Frosted Glass & Glassmorphism Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Glassmorphism UI Generator
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Real-time backdrop blur, opacity, and glass border styling generator with live interactive preview.
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
            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Code className="w-4 h-4" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Glass Parameters
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Backdrop Blur:</span>
                <span className="mono text-blue-400 font-bold">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Glass Opacity:</span>
                <span className="mono text-blue-400 font-bold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Border Sheen Opacity:</span>
                <span className="mono text-blue-400 font-bold">{borderOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Right Canvas Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" /> Live Frosted Preview Card
            </h2>

            {/* Interactive Preview Canvas */}
            <div className="w-full h-80 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
              {/* Decorative Animated Blobs */}
              <div className="absolute top-4 left-6 w-36 h-36 bg-cyan-400 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 right-6 w-40 h-40 bg-amber-400 rounded-full blur-xl animate-bounce"></div>

              {/* Glass Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full max-w-sm p-6 rounded-2xl shadow-2xl relative z-10 space-y-4 text-white"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Glassmorphic Card</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Ultra-smooth frosted glass effect computed with modern hardware-accelerated backdrop filters.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={snippets}
        title="Glassmorphism CSS Export"
      />
    </div>
  );
}
