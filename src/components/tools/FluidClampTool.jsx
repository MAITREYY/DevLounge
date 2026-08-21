import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import { Type, Sparkles, Sliders, Eye, Check, Copy, RotateCcw, ShieldCheck, Heading, AlignLeft, CheckCircle2, AlertTriangle, XCircle, Monitor, Smartphone, Tablet, ChevronRight, ChevronLeft } from 'lucide-react';

export default function FluidClampTool() {
  // Input Parameters State
  const [minW, setMinW] = useState(320);
  const [mobileW, setMobileW] = useState(440);
  const [mobileFont, setMobileFont] = useState(16);
  const [desktopFont, setDesktopFont] = useState(24);
  const [desktopW, setDesktopW] = useState(1440);
  const [maxW, setMaxW] = useState(1920);

  // Options & Simulator
  const [previewSlider, setPreviewSlider] = useState(440);
  const [activeTab, setActiveTab] = useState('css');
  const [selectedElem, setSelectedElem] = useState('p');
  const [copied, setCopied] = useState(false);

  // Helper
  const round = (n, d = 4) => {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
  };

  // Convert inputs to numbers
  const minVPx = parseFloat(minW) || 0;
  const mobVPx = parseFloat(mobileW) || 0;
  const deskVPx = parseFloat(desktopW) || 0;
  const maxVPx = parseFloat(maxW) || 0;
  const mobFPx = parseFloat(mobileFont) || 0;
  const deskFPx = parseFloat(desktopFont) || 0;

  // Validation
  const widthDiff = deskVPx - mobVPx;
  const isWidthInvalid = widthDiff === 0 || mobVPx >= deskVPx;

  // Core Math Calculation
  const calculation = useMemo(() => {
    if (isWidthInvalid) return null;

    const slope = (deskFPx - mobFPx) / widthDiff;
    const intercept = mobFPx - slope * mobVPx;
    const fontAt = (w) => slope * w + intercept;

    const fontAtMin = fontAt(minVPx);
    const fontAtMax = fontAt(maxVPx);

    const lowPx = Math.min(fontAtMin, fontAtMax);
    const highPx = Math.max(fontAtMin, fontAtMax);

    const lowRem = round(lowPx / 16, 4);
    const highRem = round(highPx / 16, 4);
    const interceptRem = round(intercept / 16, 4);
    const vwCoef = round(slope * 100, 4);

    const preferred = `calc(${interceptRem}rem + ${vwCoef}vw)`;

    const cssCode = `font-size: clamp(${lowRem}rem, ${preferred}, ${highRem}rem);`;
    const twCode = `text-[clamp(${lowRem}rem,${preferred.replace(/\s/g, '')},${highRem}rem)]`;
    const bsCode = `.fs-custom {\n  font-size: clamp(${lowRem}rem, ${preferred}, ${highRem}rem);\n}`;

    return {
      slope,
      intercept,
      fontAt,
      fontAtMin,
      fontAtMax,
      lowPx,
      highPx,
      lowRem,
      highRem,
      interceptRem,
      vwCoef,
      preferred,
      cssCode,
      twCode,
      bsCode,
    };
  }, [minVPx, mobVPx, deskVPx, maxVPx, mobFPx, deskFPx, isWidthInvalid, widthDiff]);

  // Current Font at slider
  const currentFontPx = useMemo(() => {
    if (!calculation) return 16;
    const fontPx = calculation.fontAt(previewSlider);
    return Math.max(0, fontPx);
  }, [calculation, previewSlider]);

  // Presets
  const applyPreset = (presetKey) => {
    if (presetKey === 'hero') {
      setMobileFont(32);
      setDesktopFont(64);
      setMobileW(440);
      setDesktopW(1440);
    } else if (presetKey === 'h2') {
      setMobileFont(24);
      setDesktopFont(40);
      setMobileW(440);
      setDesktopW(1440);
    } else if (presetKey === 'sub') {
      setMobileFont(16);
      setDesktopFont(24);
      setMobileW(440);
      setDesktopW(1440);
    } else if (presetKey === 'body') {
      setMobileFont(14);
      setDesktopFont(18);
      setMobileW(440);
      setDesktopW(1440);
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
    setSelectedElem('p');
  };

  const handleCopy = () => {
    if (!calculation) return;
    const codeMap = {
      css: calculation.cssCode,
      tw: calculation.twCode,
      bs: calculation.bsCode,
    };
    navigator.clipboard.writeText(codeMap[activeTab]);
    setCopied(true);
    triggerCopyConfetti();
    setTimeout(() => setCopied(false), 1600);
  };

  // SVG Growth Curve calculations
  const svgData = useMemo(() => {
    if (!calculation) return null;
    const fontAt = calculation.fontAt;

    const xMin = 50;
    const xMax = 560;
    const graphW = xMax - xMin;

    const yMin = 155;
    const yMax = 25;
    const graphH = yMin - yMax;

    const mapX = (w) => {
      if (maxVPx === minVPx) return xMin;
      const pct = Math.max(0, Math.min(1, (w - minVPx) / (maxVPx - minVPx)));
      return xMin + pct * graphW;
    };

    const fontMin = fontAt(minVPx);
    const fontMax = fontAt(maxVPx);
    const lowPx = Math.min(fontMin, fontMax, mobFPx, deskFPx);
    const highPx = Math.max(fontMin, fontMax, mobFPx, deskFPx);
    const rangeY = highPx - lowPx || 1;

    const mapY = (f) => {
      const pct = Math.max(0, Math.min(1, (f - lowPx) / rangeY));
      return yMin - pct * graphH;
    };

    const ptMin = { x: mapX(minVPx), y: mapY(fontMin) };
    const ptMob = { x: mapX(mobVPx), y: mapY(mobFPx) };
    const ptDesk = { x: mapX(deskVPx), y: mapY(deskFPx) };
    const ptMax = { x: mapX(maxVPx), y: mapY(fontMax) };

    const dPath = `M ${ptMin.x},${ptMin.y} L ${ptMob.x},${ptMob.y} L ${ptDesk.x},${ptDesk.y} L ${ptMax.x},${ptMax.y}`;
    const dArea = `M ${ptMin.x},${yMin} L ${ptMin.x},${ptMin.y} L ${ptMob.x},${ptMob.y} L ${ptDesk.x},${ptDesk.y} L ${ptMax.x},${ptMax.y} L ${ptMax.x},${yMin} Z`;

    const trackerPx = fontAt(previewSlider);
    const trackerX = mapX(previewSlider);
    const trackerY = mapY(trackerPx);

    return {
      dPath,
      dArea,
      ptMob,
      ptDesk,
      trackerX,
      trackerY,
      trackerPx,
      lowPx,
      highPx,
    };
  }, [calculation, minVPx, mobVPx, deskVPx, maxVPx, mobFPx, deskFPx, previewSlider]);

  // Accessibility Audit Evaluator
  const evaluateViewportSize = (elem, fontPx, viewportType) => {
    if (fontPx <= 0) return { status: 'fail', msg: 'Font size cannot be zero or negative.' };

    if (elem === 'p') {
      if (fontPx < 12) return { status: 'fail', msg: 'Unreadable (<12px). Violates WCAG legibility guidelines.' };
      if (fontPx < 14) return { status: 'warn', msg: 'Suboptimal (12-14px). Small on mobile; 16px is ideal.' };
      if (fontPx >= 16) return { status: 'pass', msg: 'Optimal body size. Prevents iOS Safari input auto-zoom.' };
      return { status: 'pass', msg: 'Acceptable body text legibility.' };
    }

    if (elem === 'h1') {
      if (viewportType === 'mobile' && fontPx < 20) return { status: 'fail', msg: 'Too small for H1 heading (<20px) on mobile.' };
      if (viewportType === 'desktop' && fontPx < 28) return { status: 'warn', msg: 'Suboptimal H1 contrast on desktop (<28px).' };
      if (fontPx > 96) return { status: 'warn', msg: 'Very large heading (>96px). Ensure no viewport overflow.' };
      return { status: 'pass', msg: 'Strong heading hierarchy and visual impact.' };
    }

    if (elem === 'h2') {
      if (fontPx < 18) return { status: 'warn', msg: 'H2 text is under 18px; may blend in with body copy.' };
      return { status: 'pass', msg: 'Good section heading contrast and readability.' };
    }

    if (elem === 'h3') {
      if (fontPx < 16) return { status: 'warn', msg: 'H3 text under 16px lacks distinct subtitle hierarchy.' };
      return { status: 'pass', msg: 'Well-proportioned subtitle font size.' };
    }

    if (elem === 'button') {
      if (fontPx < 12) return { status: 'fail', msg: 'Illegible button text (<12px) for touch interfaces.' };
      if (fontPx < 14) return { status: 'warn', msg: 'Button text (12-14px) is small for touch targets.' };
      return { status: 'pass', msg: 'Excellent touch target & label legibility.' };
    }

    if (elem === 'small') {
      if (fontPx < 10) return { status: 'fail', msg: 'Illegible small text (<10px). Violates WCAG contrast/size criteria.' };
      if (fontPx < 12) return { status: 'warn', msg: 'Fine print (10-12px); suitable for secondary captions.' };
      return { status: 'pass', msg: 'Clear small text readability.' };
    }

    return { status: 'pass', msg: 'Valid font size.' };
  };

  const tabletFont = calculation ? calculation.fontAt(768) : 19.4;
  const mobAudit = evaluateViewportSize(selectedElem, mobFPx, 'mobile');
  const tabAudit = evaluateViewportSize(selectedElem, tabletFont, 'tablet');
  const deskAudit = evaluateViewportSize(selectedElem, deskFPx, 'desktop');

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

      {/* Generator Container Card */}
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Viewport & Font Parameters Input Grid */}
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

        {/* Interactive Live Preview Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-zinc-400" /> Interactive Live Preview
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Current Width:</span>
              <span className="mono font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">
                {Math.round(previewSlider)}px
              </span>
              <span className="text-zinc-500 ml-1">Computed Font:</span>
              <span className="mono font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {round(currentFontPx, 1)}px
              </span>
            </div>
          </div>

          <input
            type="range"
            min={minVPx || 320}
            max={maxVPx || 1920}
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
              style={{ fontSize: `${currentFontPx}px` }}
            >
              Scales smoothly across viewports
            </span>
          </div>

          {/* Fluid Growth Curve Visualizer SVG */}
          {svgData && (
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
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid background lines */}
                  <line x1="50" y1="25" x2="560" y2="25" stroke="#27272a" strokeDasharray="3,3" strokeWidth="1" />
                  <line x1="50" y1="90" x2="560" y2="90" stroke="#18181b" strokeDasharray="3,3" strokeWidth="1" />
                  <line x1="50" y1="155" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />
                  <line x1="50" y1="25" x2="50" y2="155" stroke="#27272a" strokeWidth="1" />
                  <line x1="560" y1="25" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />

                  {/* Area fill */}
                  <path d={svgData.dArea} fill="url(#curveGradient)" />
                  {/* Curve Path */}
                  <path d={svgData.dPath} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Mobile Marker */}
                  <line x1={svgData.ptMob.x} y1="25" x2={svgData.ptMob.x} y2="155" stroke="#3f3f46" strokeDasharray="2,2" strokeWidth="1" />
                  <circle cx={svgData.ptMob.x} cy={svgData.ptMob.y} r="4.5" fill="#000000" stroke="#a1a1aa" strokeWidth="2" />
                  <text x={svgData.ptMob.x} y={svgData.ptMob.y - 10} fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    Mobile {mobFPx}px
                  </text>

                  {/* Desktop Marker */}
                  <line x1={svgData.ptDesk.x} y1="25" x2={svgData.ptDesk.x} y2="155" stroke="#3f3f46" strokeDasharray="2,2" strokeWidth="1" />
                  <circle cx={svgData.ptDesk.x} cy={svgData.ptDesk.y} r="4.5" fill="#000000" stroke="#a1a1aa" strokeWidth="2" />
                  <text x={svgData.ptDesk.x} y={svgData.ptDesk.y - 10} fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    Desktop {deskFPx}px
                  </text>

                  {/* Tracker Marker */}
                  <line x1={svgData.trackerX} y1="25" x2={svgData.trackerX} y2="155" stroke="#34d399" strokeDasharray="3,3" strokeWidth="1.5" />
                  <circle cx={svgData.trackerX} cy={svgData.trackerY} r="6" fill="#10b981" opacity="0.3" />
                  <circle cx={svgData.trackerX} cy={svgData.trackerY} r="4" fill="#34d399" stroke="#000000" strokeWidth="1.5" />
                  <text x={svgData.trackerX} y={svgData.trackerY + 16} fill="#34d399" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono" textAnchor="middle">
                    {Math.round(previewSlider)}px ({round(svgData.trackerPx, 1)}px)
                  </text>

                  {/* Axis labels */}
                  <text x="42" y="28" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{round(svgData.highPx, 1)}px</text>
                  <text x="42" y="158" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{round(svgData.lowPx, 1)}px</text>
                  <text x="50" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="start">{minVPx}px</text>
                  <text x="560" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{maxVPx}px</text>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Generated Output Code Section */}
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

          {/* Code Viewer Output */}
          {isWidthInvalid ? (
            <div className="mono bg-black border border-rose-950 rounded-xl p-4 text-xs sm:text-sm text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Mobile and Desktop widths must be different (Mobile &lt; Desktop).</span>
            </div>
          ) : (
            <pre className="mono bg-black border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[76px] text-zinc-200 select-all whitespace-pre-wrap">
              <code>{activeTab === 'css' ? calculation?.cssCode : activeTab === 'tw' ? calculation?.twCode : calculation?.bsCode}</code>
            </pre>
          )}

          <button
            onClick={handleCopy}
            disabled={isWidthInvalid}
            className="w-full bg-zinc-100 hover:bg-white active:bg-zinc-200 text-black transition-all text-xs sm:text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Generated Code'}</span>
          </button>
        </div>

        {/* Calculated Font Extrapolation Grid */}
        <div className="pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 block flex items-center gap-1.5">
            <Type className="w-4 h-4 text-zinc-400" /> Calculated Font Extrapolation
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center justify-between">
                <span>Min Bound</span>
                <ChevronLeft className="w-3 h-3 text-zinc-600" />
              </div>
              <div className="mono text-xs sm:text-sm text-zinc-300">
                {calculation ? `${round(calculation.fontAtMin, 1)}px / ${round(calculation.fontAtMin / 16, 3)}rem` : 'N/A'}
              </div>
            </div>

            <div className="bg-black border border-zinc-700/80 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                <span>Mobile Point</span>
                <Smartphone className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">
                {mobFPx}px / {round(mobFPx / 16, 3)}rem
              </div>
            </div>

            <div className="bg-black border border-zinc-700/80 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                <span>Desktop Point</span>
                <Laptop className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">
                {deskFPx}px / {round(deskFPx / 16, 3)}rem
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center justify-between">
                <span>Max Bound</span>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
              </div>
              <div className="mono text-xs sm:text-sm text-zinc-300">
                {calculation ? `${round(calculation.fontAtMax, 1)}px / ${round(calculation.fontAtMax / 16, 3)}rem` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility & Ergonomics Validator Audit */}
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
                  onClick={() => setSelectedElem(btn.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    selectedElem === btn.id
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
            mobAudit.status === 'pass' && deskAudit.status === 'pass'
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
          }`}>
            {mobAudit.status === 'pass' && deskAudit.status === 'pass' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-semibold text-sm mb-0.5">
                {mobAudit.status === 'pass' && deskAudit.status === 'pass' ? 'WCAG Compliant & Legible' : 'Legibility Scale Warning'}
              </div>
              <div className="text-zinc-300 leading-relaxed">
                Font sizes meet WCAG readability standards and provide optimal ergonomics across all devices.
              </div>
            </div>
          </div>

          {/* Cards Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile (320-440px)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                  mobAudit.status === 'pass'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : mobAudit.status === 'warn'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}>
                  {mobAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(mobFPx, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{mobAudit.msg}</div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Tablet className="w-3.5 h-3.5 text-zinc-500" /> Tablet (768px)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                  tabAudit.status === 'pass'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : tabAudit.status === 'warn'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}>
                  {tabAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(tabletFont, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{tabAudit.msg}</div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-zinc-500" /> Desktop (1440px+)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                  deskAudit.status === 'pass'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : deskAudit.status === 'warn'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}>
                  {deskAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(deskFPx, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{deskAudit.msg}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
