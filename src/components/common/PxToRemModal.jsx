import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Copy,
  Check,
  Calculator,
  Code2,
  Zap,
  Box,
  RotateCcw,
  AlertTriangle,
  Type,
} from "lucide-react";

// Helper to compute Tailwind step & text class from PX font size
const getTailwindInfo = (pxVal) => {
  const num = parseFloat(pxVal);
  if (isNaN(num) || num <= 0) return { val: "text-0", isExact: true, closest: "0", twClass: "text-0" };

  const exactRatio = num / 4;
  const standardSteps = [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
  ];

  const isExact = standardSteps.includes(exactRatio);

  let closest = standardSteps[0];
  let minDiff = Math.abs(exactRatio - closest);
  for (let i = 1; i < standardSteps.length; i++) {
    const diff = Math.abs(exactRatio - standardSteps[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = standardSteps[i];
    }
  }

  const twClass = isExact ? `text-${exactRatio}` : `text-${closest}`;

  return {
    exactRatio,
    isExact,
    closest,
    valToCopy: twClass,
    twClass,
  };
};

export default function PxToRemModal({ isOpen, onClose, initialPx = "16" }) {
  const [pxValue, setPxValue] = useState(initialPx);
  const [basePx, setBasePx] = useState(16);
  const [copiedBtn, setCopiedBtn] = useState(null); // 'css' | 'tailwind' | 'bootstrap'

  useEffect(() => {
    if (initialPx) {
      // Clean up initial px
      const cleaned = initialPx.toString().replace(/[^0-9.]/g, "");
      setPxValue(cleaned || "16");
    }
  }, [initialPx]);

  if (!isOpen) return null;

  // Sanitizer for typing or pasting from Figma (e.g., "16px", "font-size: 16px;")
  const handlePxChange = (rawVal) => {
    const cleaned = rawVal.replace(/[^0-9.]/g, "");
    setPxValue(cleaned);
  };

  // Calculation
  const numPx = parseFloat(pxValue);
  const remNumber =
    isNaN(numPx) || numPx < 0
      ? 0
      : parseFloat((numPx / (basePx || 16)).toFixed(4));
  const remString = `${remNumber}rem`;
  const tailwindInfo = getTailwindInfo(numPx);

  const handleCopy = (type) => {
    let textToCopy = remString;

    if (type === "tailwind") {
      textToCopy = tailwindInfo.valToCopy;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedBtn(type);
    setTimeout(() => {
      setCopiedBtn(null);
    }, 1800);
  };

  const quickPresets = [8, 12, 14, 16, 18, 20, 24, 28, 32, 36, 44, 48, 64, 96];

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
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                PX ➔ REM Tool
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold uppercase">
                  Text Sizing Only
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Convert pixel font sizes to REM specifically for text sizing (<code className="text-amber-400/90 font-mono">font-size</code>)
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
            {/* Input 1: Text PX Value */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Text PX Input (from Figma)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pxValue}
                  onChange={(e) => handlePxChange(e.target.value)}
                  placeholder="e.g. 16, 24, 28"
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
                Calculated Text REM
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={remString}
                  className="w-full bg-zinc-900/90 border border-amber-500/40 rounded-xl px-3 py-2 text-sm font-mono text-amber-400 font-bold focus:outline-none select-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
              Text Font Presets (px):
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

          {/* Divider & Copy Actions */}
          <div className="border-t border-zinc-800/80 pt-4 space-y-3">
            <span className="text-xs font-bold text-zinc-300 block flex items-center justify-between">
              <span>Copy Text Size</span>
              <span className="text-[10px] font-normal font-mono text-zinc-500">
                Copies exact value cleanly (e.g. {remString})
              </span>
            </span>

            {/* 2 Copy Buttons (CSS & Tailwind) */}
            <div className="grid grid-cols-2 gap-3">
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
                    <span className="text-zinc-400">{remString}</span>
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
                    <span className="text-zinc-400">{tailwindInfo.valToCopy}</span>
                  )}
                </div>
              </button>
            </div>

            {/* Non-Standard Tailwind Warning Box */}
            {!tailwindInfo.isExact && !isNaN(numPx) && numPx > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tailwind Scale Non-Standard Value Warning</span>
                </div>
                <p className="leading-relaxed text-amber-200/90 text-[11px]">
                  <strong>{pxValue}px</strong> ({remString}) does not map to an exact standard step on Tailwind's default spacing scale (approx step <strong>{tailwindInfo.exactRatio}</strong>). Clicking Tailwind will copy the closest standard step: <strong>{tailwindInfo.closest}</strong> ({tailwindInfo.closest * 4}px).
                </p>
                <p className="text-[10px] text-amber-400/80 font-medium pt-0.5">
                  💡 <em>Tip: For custom fluid font scaling without losing exact Figma precision, try the <strong>Fluid Clamp Generator</strong> tool.</em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

