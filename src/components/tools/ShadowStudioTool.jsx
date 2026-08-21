import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import CodeModal from '../common/CodeModal';
import { Layers, Sparkles, Sliders, Code, Check, Copy, Sun } from 'lucide-react';

export default function ShadowStudioTool() {
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [yOffset, setYOffset] = useState(20);
  const [opacity, setOpacity] = useState(30);
  const [shadowColor, setShadowColor] = useState('#10b981');

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shadowCssValue = `0px ${yOffset}px ${blur}px ${spread}px ${shadowColor}${Math.round((opacity / 100) * 255).toString(16).padStart(2, '0')}`;

  const snippets = {
    css: `.card-shadow {\n  box-shadow: ${shadowCssValue};\n}`,
    tailwind: `className="shadow-[${shadowCssValue}]"`,
    scss: `$shadow-val: ${shadowCssValue};\n.elevated-card {\n  box-shadow: $shadow-val;\n}`,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/60 text-xs text-emerald-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Layered Ambient Shadow & Glow Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Box Shadow & Glow Generator
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Multi-layered realistic elevation shadows and colorful ambient neon glow builder.
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
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
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
              <Sliders className="w-4 h-4 text-emerald-400" /> Elevation Sliders
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Y Offset (Vertical):</span>
                <span className="mono text-emerald-400 font-bold">{yOffset}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={yOffset}
                onChange={(e) => setYOffset(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Blur Radius:</span>
                <span className="mono text-emerald-400 font-bold">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Spread Radius:</span>
                <span className="mono text-emerald-400 font-bold">{spread}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Shadow Color & Glow:</span>
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-400" /> Interactive Elevated Card
            </h2>

            <div className="w-full h-80 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center p-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="w-64 h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 transition-all"
                style={{
                  boxShadow: shadowCssValue,
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">
                  ★
                </div>
                <div className="text-sm font-bold text-white">Elevated Card</div>
                <div className="text-[11px] text-zinc-500 font-mono">box-shadow preview</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={snippets}
        title="Box Shadow CSS Export"
      />
    </div>
  );
}
