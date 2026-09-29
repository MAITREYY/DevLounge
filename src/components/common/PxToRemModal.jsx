import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  Code2,
  Zap,
  Box,
  RotateCcw,
} from "lucide-react";

export default function PxToRemModal({ isOpen, onClose, initialPx = "16" }) {
  const [pxValue, setPxValue] = useState(initialPx);
  const [basePx, setBasePx] = useState(16);
  const [copiedBtn, setCopiedBtn] = useState(null); // 'css' | 'tailwind' | 'bootstrap'

  useEffect(() => {
    if (initialPx) {
      setPxValue(initialPx);
    }
  }, [initialPx]);

  if (!isOpen) return null;

  // Calculation
  const numPx = parseFloat(pxValue);
  const remNumber =
    isNaN(numPx) || numPx < 0
      ? 0
      : parseFloat((numPx / (basePx || 16)).toFixed(4));
  const remString = `${remNumber}rem`;

  const handleCopy = (type) => {
    // Only copy the number + rem string e.g. "12rem" or "28rem"
    navigator.clipboard.writeText(remString);
    setCopiedBtn(type);
    setTimeout(() => {
      setCopiedBtn(null);
    }, 1800);
  };

  const quickPresets = [8, 12, 14, 16, 20, 24, 28, 32, 44, 48, 64, 96, 192, 448];

  const modalContent = (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                PX ➔ REM Tool
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                  Quick Converter
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Convert pixels to REM & copy for CSS, Tailwind & Bootstrap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Base PX & Reset bar */}
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-2.5 px-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Base Font Size:</span>
              <div className="flex items-center gap-1 bg-black border border-zinc-800 rounded-lg px-2 py-0.5">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={basePx}
                  onChange={(e) => setBasePx(Math.max(1, parseInt(e.target.value) || 16))}
                  className="w-10 bg-transparent text-xs font-mono text-center text-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-500 font-mono">px</span>
              </div>
            </div>
            <button
              onClick={() => {
                setPxValue("16");
                setBasePx(16);
              }}
              className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Reset to 16px base"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input 1: PX Value */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Input PX
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pxValue}
                  onChange={(e) => setPxValue(e.target.value)}
                  placeholder="e.g. 16, 28, 448"
                  className="w-full bg-black border border-zinc-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none transition-all"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 pointer-events-none">
                  px
                </span>
              </div>
            </div>

            {/* Input 2: Calculated REM Result */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Calculated Result
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={remString}
                  className="w-full bg-zinc-900/90 border border-amber-500/40 rounded-xl px-3 py-2 text-sm font-mono text-amber-400 font-bold focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-amber-400/70 font-semibold pointer-events-none">
                  rem
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
              Quick Presets (px):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPxValue(preset.toString())}
                  className={`px-2 py-1 rounded-lg text-xs font-mono transition-all border ${
                    pxValue === preset.toString()
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {preset}px
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800/80 pt-4">
            <span className="text-xs font-bold text-zinc-300 block mb-2.5 flex items-center justify-between">
              <span>Copy REM Output</span>
              <span className="text-[10px] font-normal font-mono text-zinc-500">
                Copies exact rem string (e.g. {remString})
              </span>
            </span>

            {/* 3 Copy Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* 1. Custom CSS */}
              <button
                onClick={() => handleCopy("css")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                  copiedBtn === "css"
                    ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                    : "bg-zinc-900 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold">Custom CSS</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {copiedBtn === "css" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                      <span className="text-zinc-400">{remString}</span>
                    </>
                  )}
                </div>
              </button>

              {/* 2. Tailwind */}
              <button
                onClick={() => handleCopy("tailwind")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                  copiedBtn === "tailwind"
                    ? "bg-sky-500/20 border-sky-500/60 text-sky-300"
                    : "bg-zinc-900 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-bold">Tailwind</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {copiedBtn === "tailwind" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-sky-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                      <span className="text-zinc-400">{remString}</span>
                    </>
                  )}
                </div>
              </button>

              {/* 3. Bootstrap */}
              <button
                onClick={() => handleCopy("bootstrap")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                  copiedBtn === "bootstrap"
                    ? "bg-purple-500/20 border-purple-500/60 text-purple-300"
                    : "bg-zinc-900 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Box className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-bold">Bootstrap</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {copiedBtn === "bootstrap" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-purple-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                      <span className="text-zinc-400">{remString}</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
