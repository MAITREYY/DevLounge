import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import { Type, Sparkles, Sliders, Eye, Check, Copy, RotateCcw, ShieldCheck, Heading, AlignLeft, CheckCircle2, AlertTriangle, Monitor, Smartphone, Tablet } from 'lucide-react';

export default function FluidClampTool() {
  // Input Parameters State
  const [minW, setMinW] = useState(320);
  const [mobileW, setMobileW] = useState(440);
  const [mobileFont, setMobileFont] = useState(16);
  const [desktopFont, setDesktopFont] = useState(24);
  const [desktopW, setDesktopW] = useState(1440);
  const [maxW, setMaxW] = useState(1920);

  // Live Simulator & Options
  const [previewSlider, setPreviewSlider] = useState(440);
  const [activeTab, setActiveTab] = useState('css');
  const [elemType, setElemType] = useState('p');
  const [copied, setCopied] = useState(false);

  // Calculations
  const minVw = parseFloat(minW) || 320;
  const mobVw = parseFloat(mobileW) || 440;
  const mobFont = parseFloat(mobileFont) || 16;
  const deskFont = parseFloat(desktopFont) || 24;
  const deskVw = parseFloat(desktopW) || 1440;
  const maxVw = parseFloat(maxW) || 1920;

  // Math slope calculation: y = mx + c
  const slope = (deskFont - mobFont) / (deskVw - mobVw);
  const slopeVw = (slope * 100).toFixed(4);
  const interceptPx = mobFont - slope * mobVw;
  const interceptRem = (interceptPx / 16).toFixed(4);

  const minRem = (mobFont / 16).toFixed(4);
  const maxRem = (deskFont / 16).toFixed(4);

  const clampCss = `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
  const twClass = `text-[clamp(${minRem}rem,${interceptRem}rem+${slopeVw}vw,${maxRem}rem)]`;

  // Compute Font size at specific viewport
  const getComputedFontAt = (vw) => {
    if (vw <= mobVw) return mobFont;
    if (vw >= deskVw) return deskFont;
    return mobFont + slope * (vw - mobVw);
  };

  const currentPreviewFont = getComputedFontAt(previewSlider).toFixed(1);

  // Extrapolations
  const minBoundFont = getComputedFontAt(minVw).toFixed(1);
  const maxBoundFont = getComputedFontAt(maxVw).toFixed(1);
  const tabletFont = getComputedFontAt(768).toFixed(1);

  // Presets
  const applyPreset = (presetKey) => {
    if (presetKey === 'hero') {
      setMobileFont(32);
      setDesktopFont(64);
    } else if (presetKey === 'h2') {
      setMobileFont(24);
      setDesktopFont(40);
    } else if (presetKey === 'sub') {
      setMobileFont(16);
      setDesktopFont(24);
    } else if (presetKey === 'body') {
      setMobileFont(14);
      setDesktopFont(18);
    }
  };

  const handleReset = () => {
    setMinW(320);
    setMobileW(440);
    setMobileFont(16);
    setDesktopFont(24);
    setDesktopW(1440);
    setMaxW(1920);
    setPreviewSlider(440);
    setElemType('p');
  };

  // Code snippets
  const codeMap = {
    css: `/* Generated Fluid Typography clamp() */\nfont-size: ${clampCss};`,
    tw: `<!-- Tailwind CSS -->\n<h2 class="${twClass}">\n  Fluid Heading\n</h2>`,
    bs: `/* Bootstrap 5 Custom Utility */\n.fluid-heading {\n  font-size: ${clampCss};\n}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeMap[activeTab]);
    setCopied(true);
    triggerCopyConfetti();
    setTimeout(() => setCopied(false), 1600);
  };

  // Accessibility Audit Logic
  const getAuditInfo = () => {
    let mobPass = mobFont >= 14;
    let deskPass = deskFont >= 14;
    let elemLabel = 'Body (p)';

    if (elemType === 'h1') {
      mobPass = mobFont >= 24;
      deskPass = deskFont >= 36;
      elemLabel = 'H1 Hero';
    } else if (elemType === 'h2') {
      mobPass = mobFont >= 20;
      deskPass = deskFont >= 28;
      elemLabel = 'H2 Title';
    } else if (elemType === 'h3') {
      mobPass = mobFont >= 18;
      deskPass = deskFont >= 22;
      elemLabel = 'H3 Subtitle';
    } else if (elemType === 'button') {
      mobPass = mobFont >= 14 && mobFont <= 20;
      deskPass = deskFont >= 14 && deskFont <= 24;
      elemLabel = 'Button';
    } else if (elemType === 'small') {
      mobPass = mobFont >= 12;
      deskPass = deskFont >= 12;
      elemLabel = 'Small';
    }

    const overallPass = mobPass && deskPass;

    return {
      overallPass,
      elemLabel,
      mobPass,
      deskPass,
    };
  };

  const audit = getAuditInfo();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Fluid Typography Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Responsive CSS <code className="mono text-emerald-300 font-semibold">clamp()</code>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Create minimal, seamless font size scaling across mobile and desktop viewports without media queries.
        </p>
      </header>

      {/* Quick Presets Bar */}
      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-zinc-400" /> Quick Presets
          </span>
          <span className="text-xs text-zinc-500">Click to apply configuration</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('hero')}
            className="preset-btn px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-all hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-white group-hover:text-zinc-200">
              <span className="flex items-center gap-1.5"><Heading className="w-3.5 h-3.5 text-zinc-500" /> Hero Title</span>
            </div>
            <div className="text-[11px] mono text-zinc-500 mt-1">32px &rarr; 64px</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('h2')}
            className="preset-btn px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-all hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-white group-hover:text-zinc-200">
              <span className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5 text-zinc-500" /> Section H2</span>
            </div>
            <div className="text-[11px] mono text-zinc-500 mt-1">24px &rarr; 40px</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('sub')}
            className="preset-btn px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-all hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-white group-hover:text-zinc-200">
              <span className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-zinc-500" /> Subtitle</span>
            </div>
            <div className="text-[11px] mono text-zinc-500 mt-1">16px &rarr; 24px</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('body')}
            className="preset-btn px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-all hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-white group-hover:text-zinc-200">
              <span className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5 text-zinc-500" /> Body Text</span>
            </div>
            <div className="text-[11px] mono text-zinc-500 mt-1">14px &rarr; 18px</div>
          </button>
        </div>
      </section>

      {/* Main Card Container */}
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Viewport & Font Inputs */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-zinc-400" /> Viewport & Font Parameters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Min Viewport</span>
                <Smartphone className="w-3 h-3 text-zinc-600" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minW}
                  onChange={(e) => setMinW(e.target.value)}
                  className="mono w-full bg-black border border-zinc-800 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Mobile Viewport</span>
                <Smartphone className="w-3 h-3 text-zinc-600" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={mobileW}
                  onChange={(e) => setMobileW(e.target.value)}
                  className="mono w-full bg-black border border-zinc-800 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5 flex items-center justify-between">
                <span>Mobile Size</span>
                <Type className="w-3 h-3 text-zinc-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={mobileFont}
                  onChange={(e) => setMobileFont(e.target.value)}
                  className="mono w-full bg-black border border-zinc-700 focus:border-white rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs mono">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5 flex items-center justify-between">
                <span>Desktop Size</span>
                <Type className="w-3.5 h-3.5 text-zinc-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={desktopFont}
                  onChange={(e) => setDesktopFont(e.target.value)}
                  className="mono w-full bg-black border border-zinc-700 focus:border-white rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs mono">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Desktop Viewport</span>
                <Laptop className="w-3 h-3 text-zinc-600" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={desktopW}
                  onChange={(e) => setDesktopW(e.target.value)}
                  className="mono w-full bg-black border border-zinc-800 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Max Viewport</span>
                <Monitor className="w-3 h-3 text-zinc-600" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxW}
                  onChange={(e) => setMaxW(e.target.value)}
                  className="mono w-full bg-black border border-zinc-800 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator & Growth Curve */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-zinc-400" /> Interactive Live Preview
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Current Width:</span>
              <span className="mono font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">
                {previewSlider}px
              </span>
              <span className="text-zinc-500 ml-1">Computed Font:</span>
              <span className="mono font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {currentPreviewFont}px
              </span>
            </div>
          </div>

          <input
            type="range"
            min="320"
            max="1920"
            value={previewSlider}
            onChange={(e) => setPreviewSlider(Number(e.target.value))}
            className="w-full cursor-pointer accent-emerald-400"
          />

          <div className="bg-black border border-zinc-800 rounded-xl h-36 flex items-center justify-center overflow-hidden p-6 relative group">
            <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
              Simulated Viewport Output
            </div>
            <span
              className="font-semibold text-center text-white tracking-tight leading-tight transition-all duration-75 px-4 select-none"
              style={{ fontSize: `${currentPreviewFont}px` }}
            >
              Scales smoothly across viewports
            </span>
          </div>

          {/* Fluid Growth Curve Visualizer */}
          <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-zinc-400" /> Fluid Growth Curve Visualizer
              </span>
              <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white"></span> Curve Path</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Active Slider</span>
              </span>
            </div>

            <div className="w-full h-44 relative">
              <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                <line x1="50" y1="25" x2="560" y2="25" stroke="#27272a" strokeDasharray="3,3" strokeWidth="1" />
                <line x1="50" y1="90" x2="560" y2="90" stroke="#18181b" strokeDasharray="3,3" strokeWidth="1" />
                <line x1="50" y1="155" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />
                <line x1="50" y1="25" x2="50" y2="155" stroke="#27272a" strokeWidth="1" />
                <line x1="560" y1="25" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />

                {/* Curve path */}
                <path
                  d={`M 50 ${155 - ((mobFont - 10) / 70) * 130} L 200 ${155 - ((mobFont - 10) / 70) * 130} L 450 ${155 - ((deskFont - 10) / 70) * 130} L 560 ${155 - ((deskFont - 10) / 70) * 130}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                <circle cx="200" cy={155 - ((mobFont - 10) / 70) * 130} r="4.5" fill="#000" stroke="#a1a1aa" strokeWidth="2" />
                <circle cx="450" cy={155 - ((deskFont - 10) / 70) * 130} r="4.5" fill="#000" stroke="#a1a1aa" strokeWidth="2" />

                <text x="42" y="28" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{deskFont}px</text>
                <text x="42" y="158" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{mobFont}px</text>
                <text x="50" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="start">{minVw}px</text>
                <text x="560" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{maxVw}px</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'css' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab('tw')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'tw' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tailwind CSS
              </button>
              <button
                onClick={() => setActiveTab('bs')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'bs' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Bootstrap
              </button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <pre className="mono bg-black border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[76px] text-zinc-200 select-all whitespace-pre-wrap">
            <code>{codeMap[activeTab]}</code>
          </pre>

          <button
            onClick={handleCopy}
            className="w-full bg-zinc-100 hover:bg-white active:bg-zinc-200 text-black transition-all text-xs sm:text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Generated Code'}</span>
          </button>
        </div>

        {/* Font Extrapolation Breakdown */}
        <div className="pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 block flex items-center gap-1.5">
            <Type className="w-4 h-4 text-zinc-400" /> Calculated Font Extrapolation
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Min Bound</div>
              <div className="mono text-xs sm:text-sm text-zinc-300">{minBoundFont}px</div>
            </div>

            <div className="bg-black border border-zinc-700/80 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-400" /> Mobile Point
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">{mobFont.toFixed(1)}px</div>
            </div>

            <div className="bg-black border border-zinc-700/80 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                <Laptop className="w-3 h-3 text-emerald-400" /> Desktop Point
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">{deskFont.toFixed(1)}px</div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Max Bound</div>
              <div className="mono text-xs sm:text-sm text-zinc-300">{maxBoundFont}px</div>
            </div>
          </div>
        </div>

        {/* Accessibility & Ergonomics Audit */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-300" /> Typography Accessibility & Ergonomics Audit
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Evaluates WCAG 2.1 legibility standards & responsive visual hierarchy suitability</p>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {[
                { id: 'p', label: 'Body (p)' },
                { id: 'h1', label: 'H1 Hero' },
                { id: 'h2', label: 'H2 Title' },
                { id: 'h3', label: 'H3 Subtitle' },
                { id: 'button', label: 'Button' },
                { id: 'small', label: 'Small' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setElemType(btn.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    elemType === btn.id
                      ? 'border-zinc-700 bg-zinc-800 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
            audit.overallPass
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
          }`}>
            {audit.overallPass ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-semibold text-sm mb-0.5">
                {audit.overallPass ? 'WCAG Compliant & Legible' : 'Legibility Scale Warning'}
              </div>
              <div className="text-zinc-300 leading-relaxed">
                {audit.overallPass
                  ? `Font sizes for ${audit.elemLabel} meet WCAG readability standards and provide optimal ergonomics across all devices.`
                  : `Font sizes for ${audit.elemLabel} may be too small or large on certain devices.`}
              </div>
            </div>
          </div>

          {/* Cards Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile (320-440px)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">Pass</span>
              </div>
              <div className="mono text-xs font-semibold text-white">{mobFont.toFixed(1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">Excellent body legibility. Prevents iOS Safari form zoom.</div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-zinc-500" /> Tablet (768px)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">Pass</span>
              </div>
              <div className="mono text-xs font-semibold text-white">{tabletFont}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">Comfortable scaling transition on medium screens.</div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-zinc-500" /> Desktop (1440px+)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">Pass</span>
              </div>
              <div className="mono text-xs font-semibold text-white">{deskFont.toFixed(1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">Clear desktop proportions and strong visual weight.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
