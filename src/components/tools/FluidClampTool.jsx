import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateFluidClamp, getInterpolatedFontSize, getContrastRatio, triggerCopyConfetti } from '../../utils/helpers';
import CodeModal from '../common/CodeModal';
import { Type, Sparkles, Sliders, Eye, Check, Copy, Code, HelpCircle, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function FluidClampTool() {
  const [minPx, setMinPx] = useState(16);
  const [maxPx, setMaxPx] = useState(36);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1280);
  const [rootFont, setRootFont] = useState(16);

  // Live viewport simulator
  const [simVw, setSimVw] = useState(768);

  // WCAG audit custom text/bg
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculated Clamp Data
  const clampData = useMemo(() => {
    return calculateFluidClamp(minPx, maxPx, minVw, maxVw, rootFont);
  }, [minPx, maxPx, minVw, maxVw, rootFont]);

  // Current calculated size at simulated viewport
  const currentSimulatedSize = useMemo(() => {
    return getInterpolatedFontSize(minPx, maxPx, minVw, maxVw, simVw);
  }, [minPx, maxPx, minVw, maxVw, simVw]);

  // Contrast score
  const contrastInfo = useMemo(() => {
    return getContrastRatio(textColor, bgColor);
  }, [textColor, bgColor]);

  // Copy CSS Clamp
  const handleQuickCopy = () => {
    if (clampData.clampCss) {
      navigator.clipboard.writeText(`font-size: ${clampData.clampCss};`);
      setCopied(true);
      triggerCopyConfetti();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Preset scales
  const applyPreset = (min, max, label) => {
    setMinPx(min);
    setMaxPx(max);
  };

  const snippets = {
    css: `font-size: ${clampData.clampCss};`,
    tailwind: `className="${clampData.tailwindValue}"`,
    scss: `$fluid-font: ${clampData.clampCss};\nfont-size: $fluid-font;`,
    bootstrap: `.fluid-heading {\n  font-size: ${clampData.clampCss};\n}`,
    vars: `:root {\n  --fluid-font-size: ${clampData.clampCss};\n}\n\n.target-element {\n  font-size: var(--fluid-font-size);\n}`,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/60 text-xs text-emerald-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fluid Clamp Calculator & Analyzer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fluid Clamp Typography Generator
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Mathematical font scaling without media queries using CSS <code className="mono text-emerald-300 bg-zinc-900 px-1.5 py-0.5 rounded">clamp()</code>.
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

      {/* Main Grid: Controls + Live SVG Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sliders & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Typography & Viewport Range
            </h2>

            {/* Min Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Min Font Size:</span>
                <span className="mono text-emerald-400 font-bold">{minPx}px ({(minPx / rootFont).toFixed(2)}rem)</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={minPx}
                onChange={(e) => setMinPx(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Max Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Max Font Size:</span>
                <span className="mono text-emerald-400 font-bold">{maxPx}px ({(maxPx / rootFont).toFixed(2)}rem)</span>
              </div>
              <input
                type="range"
                min="16"
                max="120"
                value={maxPx}
                onChange={(e) => setMaxPx(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="border-t border-zinc-800/80 pt-4 space-y-4">
              {/* Min Viewport Width */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300">Min Viewport Width:</span>
                  <span className="mono text-zinc-300">{minVw}px</span>
                </div>
                <input
                  type="range"
                  min="280"
                  max="768"
                  value={minVw}
                  onChange={(e) => setMinVw(Number(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Max Viewport Width */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300">Max Viewport Width:</span>
                  <span className="mono text-zinc-300">{maxVw}px</span>
                </div>
                <input
                  type="range"
                  min="768"
                  max="2560"
                  value={maxVw}
                  onChange={(e) => setMaxVw(Number(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-400"
                />
              </div>
            </div>

            {/* Typography Scale Presets */}
            <div className="border-t border-zinc-800/80 pt-4 space-y-2">
              <span className="text-xs font-semibold text-zinc-400 block">Typography Presets</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => applyPreset(14, 20)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors"
                >
                  Body Text (14px ➔ 20px)
                </button>
                <button
                  onClick={() => applyPreset(18, 32)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors"
                >
                  Subheading (18px ➔ 32px)
                </button>
                <button
                  onClick={() => applyPreset(24, 48)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors"
                >
                  Main Header (24px ➔ 48px)
                </button>
                <button
                  onClick={() => applyPreset(32, 80)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors"
                >
                  Hero Display (32px ➔ 80px)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic SVG Curve + Output Box + Live Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Generated Code Output Display */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Code className="w-4 h-4" /> Calculated CSS clamp() Code
              </span>
              <span className="text-[11px] text-zinc-500 mono">Slope: {clampData.slopeVw}vw</span>
            </div>

            <div className="relative group">
              <pre className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-sm sm:text-base text-emerald-300 overflow-x-auto select-all shadow-inner">
                <code>font-size: {clampData.clampCss};</code>
              </pre>
            </div>
          </div>

          {/* Interactive Fluid Curve SVG Graph */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Fluid Typography Curve Graph
              </h2>
              <span className="text-xs mono text-zinc-400">{minVw}px ➔ {maxVw}px</span>
            </div>

            {/* SVG Graph Canvas */}
            <div className="w-full h-48 bg-black/80 rounded-xl border border-zinc-800/90 p-4 relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="#27272a" strokeDasharray="4" />
                <line x1="0" y1="75" x2="400" y2="75" stroke="#27272a" strokeDasharray="4" />
                <line x1="0" y1="120" x2="400" y2="120" stroke="#27272a" strokeDasharray="4" />

                {/* Curve Line */}
                <path
                  d={`M 20 ${140 - Math.min(110, (minPx / 80) * 110)} Q 200 75 380 ${140 - Math.min(110, (maxPx / 80) * 110)}`}
                  fill="none"
                  stroke="url(#gradientCurve)"
                  strokeWidth="3"
                />

                {/* SVG Gradient */}
                <defs>
                  <linearGradient id="gradientCurve" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>

                {/* Start Point */}
                <circle cx="20" cy={140 - Math.min(110, (minPx / 80) * 110)} r="5" fill="#10b981" />
                {/* End Point */}
                <circle cx="380" cy={140 - Math.min(110, (maxPx / 80) * 110)} r="5" fill="#34d399" />
              </svg>
            </div>
          </div>

          {/* Real-time Viewport Simulator */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" /> Interactive Viewport Simulator
              </h2>
              <span className="text-xs mono font-bold text-emerald-400">
                Simulated Screen: {simVw}px ➔ {currentSimulatedSize}px
              </span>
            </div>

            <input
              type="range"
              min={Math.max(280, minVw - 100)}
              max={Math.min(2560, maxVw + 200)}
              value={simVw}
              onChange={(e) => setSimVw(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-400"
            />

            {/* Live Text Preview Box */}
            <div
              className="p-6 rounded-xl border border-zinc-800 transition-all overflow-hidden flex items-center justify-center min-h-[140px]"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <span
                className="font-extrabold tracking-tight text-center leading-tight transition-all duration-75"
                style={{ fontSize: `${currentSimulatedSize}px` }}
              >
                Responsive Typography
              </span>
            </div>

            {/* WCAG 2.1 Audit Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Contrast Ratio:
                </span>
                <span className="mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {contrastInfo.ratio} : 1
                </span>
                {contrastInfo.passAA ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
                    WCAG AA Pass
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-mono">
                    WCAG Warning
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <label className="flex items-center gap-1">
                  Text:
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                  />
                </label>
                <label className="flex items-center gap-1">
                  BG:
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={snippets}
        title="FluidClamp CSS Code Export"
      />
    </div>
  );
}
