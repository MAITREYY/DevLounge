import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti, getContrastRatio } from '../../utils/helpers';
import { Type, Sparkles, Sliders, Eye, Check, Copy, RotateCcw, ShieldCheck, Heading, AlignLeft, CheckCircle2, AlertTriangle, XCircle, Monitor, Smartphone, Tablet, Laptop, ChevronRight, ChevronLeft, Palette } from 'lucide-react';

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
  const [selectedElem, setSelectedElem] = useState('p');
  const [copied, setCopied] = useState(false);

  // WCAG Color Contrast Audit State
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');

  // Helper
  const round = (n, d = 4) => {
    if (isNaN(n)) return 0;
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
  };

  // Safe Number Converters
  const minVPx = parseFloat(minW) || 320;
  const mobVPx = parseFloat(mobileW) || 440;
  const deskVPx = parseFloat(desktopW) || 1440;
  const maxVPx = parseFloat(maxW) || 1920;
  const mobFPx = parseFloat(mobileFont) || 16;
  const deskFPx = parseFloat(desktopFont) || 24;

  // Validation Flags
  const widthDiff = deskVPx - mobVPx;
  const isWidthInvalid = widthDiff <= 0;
  const isInverse = mobFPx > deskFPx;

  // Core Math Calculation
  const calculation = useMemo(() => {
    if (isWidthInvalid) return null;

    const slope = (deskFPx - mobFPx) / widthDiff;
    const intercept = mobFPx - slope * mobVPx;
    const fontAt = (w) => slope * (parseFloat(w) || 0) + intercept;

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
    if (!calculation) return mobFPx;
    const fontPx = calculation.fontAt(previewSlider);
    return isNaN(fontPx) ? mobFPx : Math.max(0, fontPx);
  }, [calculation, previewSlider, mobFPx]);

  // Presets
  const applyPreset = (presetKey) => {
    const presetMap = {
      'h1-display': { mobF: 36, deskF: 72 },
      'h1': { mobF: 32, deskF: 56 },
      'h2': { mobF: 24, deskF: 40 },
      'h3': { mobF: 20, deskF: 32 },
      'h4': { mobF: 18, deskF: 24 },
      'h5': { mobF: 16, deskF: 20 },
      'h6': { mobF: 14, deskF: 16 },
      'lead': { mobF: 18, deskF: 22 },
      'body': { mobF: 14, deskF: 18 },
      'small': { mobF: 12, deskF: 14 },
      'caption': { mobF: 11, deskF: 13 },
      'micro': { mobF: 10, deskF: 12 },
    };

    if (presetMap[presetKey]) {
      setMobileFont(presetMap[presetKey].mobF);
      setDesktopFont(presetMap[presetKey].deskF);
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
    setTextColor('#ffffff');
    setBgColor('#000000');
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
      if (maxVPx <= minVPx) return xMin;
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

    if (isNaN(ptMin.x) || isNaN(ptMin.y) || isNaN(ptMob.x) || isNaN(ptMob.y) || isNaN(ptDesk.x) || isNaN(ptDesk.y) || isNaN(ptMax.x) || isNaN(ptMax.y)) {
      return null;
    }

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
      trackerX: isNaN(trackerX) ? xMin : trackerX,
      trackerY: isNaN(trackerY) ? yMin : trackerY,
      trackerPx: isNaN(trackerPx) ? mobFPx : trackerPx,
      lowPx,
      highPx,
    };
  }, [calculation, minVPx, mobVPx, deskVPx, maxVPx, mobFPx, deskFPx, previewSlider]);

  // Accessibility Audit Evaluator
  const evaluateViewportSize = (elem, fontPx, viewportType) => {
    const f = parseFloat(fontPx) || 0;
    if (f <= 0) return { status: 'fail', msg: 'Font size cannot be zero or negative.' };

    if (elem === 'p') {
      if (f < 12) return { status: 'fail', msg: 'Unreadable (<12px). Violates WCAG legibility guidelines.' };
      if (f < 14) return { status: 'warn', msg: 'Suboptimal (12-14px). Small on mobile; 16px is ideal.' };
      if (f >= 16) return { status: 'pass', msg: 'Optimal body size. Prevents iOS Safari input auto-zoom.' };
      return { status: 'pass', msg: 'Acceptable body text legibility.' };
    }

    if (elem === 'h1') {
      if (viewportType === 'mobile' && f < 20) return { status: 'fail', msg: 'Too small for H1 heading (<20px) on mobile.' };
      if (viewportType === 'desktop' && f < 28) return { status: 'warn', msg: 'Suboptimal H1 contrast on desktop (<28px).' };
      if (f > 96) return { status: 'warn', msg: 'Very large heading (>96px). Ensure no viewport overflow.' };
      return { status: 'pass', msg: 'Strong heading hierarchy and visual impact.' };
    }

    if (elem === 'h2') {
      if (f < 18) return { status: 'warn', msg: 'H2 text is under 18px; may blend in with body copy.' };
      return { status: 'pass', msg: 'Good section heading contrast and readability.' };
    }

    if (elem === 'h3') {
      if (f < 16) return { status: 'warn', msg: 'H3 text under 16px lacks distinct subtitle hierarchy.' };
      return { status: 'pass', msg: 'Well-proportioned subtitle font size.' };
    }

    if (elem === 'button') {
      if (f < 12) return { status: 'fail', msg: 'Illegible button text (<12px) for touch interfaces.' };
      if (f < 14) return { status: 'warn', msg: 'Button text (12-14px) is small for touch targets.' };
      return { status: 'pass', msg: 'Excellent touch target & label legibility.' };
    }

    if (elem === 'small') {
      if (f < 10) return { status: 'fail', msg: 'Illegible small text (<10px). Violates WCAG contrast/size criteria.' };
      if (f < 12) return { status: 'warn', msg: 'Fine print (10-12px); suitable for secondary captions.' };
      return { status: 'pass', msg: 'Clear small text readability.' };
    }

    return { status: 'pass', msg: 'Valid font size.' };
  };

  const tabletFont = calculation ? calculation.fontAt(768) : 19.4;
  const mobAudit = evaluateViewportSize(selectedElem, mobFPx, 'mobile');
  const tabAudit = evaluateViewportSize(selectedElem, tabletFont, 'tablet');
  const deskAudit = evaluateViewportSize(selectedElem, deskFPx, 'desktop');

  // Overall Audit Banner State
  const getOverallAuditBanner = () => {
    if (isWidthInvalid) {
      return {
        type: 'danger',
        title: 'Invalid Viewport Range Warning',
        desc: 'Mobile viewport width must be smaller than Desktop viewport width.',
      };
    }
    if (isInverse) {
      return {
        type: 'warning',
        title: 'Inverse Scaling Warning',
        desc: 'Mobile font size is larger than desktop font size (Negative Slope). Font will shrink as viewport width increases.',
      };
    }
    if (mobAudit.status === 'fail' || deskAudit.status === 'fail' || tabAudit.status === 'fail') {
      return {
        type: 'danger',
        title: 'WCAG Accessibility Violation Detected',
        desc: 'One or more viewports fall below WCAG legibility limits for the selected element.',
      };
    }
    if (mobAudit.status === 'warn' || deskAudit.status === 'warn' || tabAudit.status === 'warn') {
      return {
        type: 'warning',
        title: 'Suboptimal Legibility / Hierarchy Warning',
        desc: 'Configuration is usable but may have contrast or legibility trade-offs on smaller devices.',
      };
    }
    return {
      type: 'success',
      title: 'WCAG 2.1 Compliant & Ergonomically Sound',
      desc: 'Font sizes meet WCAG readability standards and provide optimal typography scaling across all screen sizes.',
    };
  };

  const overallAudit = getOverallAuditBanner();

  // Color Contrast Audit Score
  const contrastResult = useMemo(() => {
    return getContrastRatio(textColor, bgColor);
  }, [textColor, bgColor]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-8">
      {/* Header Section */}
      <header className="mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-1 font-mono">
          <Type className="w-3.5 h-3.5 text-zinc-400" />
          <span>Fluid Typography Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Responsive CSS <code className="mono text-zinc-300 font-semibold">clamp()</code>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Create minimal, seamless font size scaling across mobile and desktop viewports without media queries.
        </p>
      </header>

      {/* Quick Presets Bar */}
      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-amber-400" /> Typography Quick Presets (H1-H6 & Paragraphs)
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">Click to apply configuration</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {[
            { id: 'h1-display', label: 'H1 Display', range: '36 ➔ 72px', isHead: true },
            { id: 'h1', label: 'H1 Page Title', range: '32 ➔ 56px', isHead: true },
            { id: 'h2', label: 'H2 Section', range: '24 ➔ 40px', isHead: true },
            { id: 'h3', label: 'H3 Sub-section', range: '20 ➔ 32px', isHead: true },
            { id: 'h4', label: 'H4 Card Title', range: '18 ➔ 24px', isHead: true },
            { id: 'h5', label: 'H5 Header', range: '16 ➔ 20px', isHead: true },
            { id: 'h6', label: 'H6 Small Title', range: '14 ➔ 16px', isHead: true },
            { id: 'lead', label: 'Lead Paragraph', range: '18 ➔ 22px', isHead: false },
            { id: 'body', label: 'Body Regular', range: '14 ➔ 18px', isHead: false },
            { id: 'small', label: 'Body Small', range: '12 ➔ 14px', isHead: false },
            { id: 'caption', label: 'Caption / Badge', range: '11 ➔ 13px', isHead: false },
            { id: 'micro', label: 'Micro Label', range: '10 ➔ 12px', isHead: false },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="px-2.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 group-hover:text-amber-200">
                <span className="truncate">{preset.label}</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 mt-1">
                {preset.range}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Card Container */}
      <div className="bg-black border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Viewport & Font Parameters Input Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> Viewport & Font Parameters (Figma Design Sync)
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              Row 1: Mobile Baseline • Row 2: Desktop Baseline
            </span>
          </div>

          {/* ROW 1: MOBILE PARAMETERS */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 font-mono">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Design Parameters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              {/* 1. Min Viewport */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Min Viewport</span>
                  <Smartphone className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minW}
                    onChange={(e) => setMinW(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-emerald-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Lowest width limit where text stops scaling down
                </p>
              </div>

              {/* 2. Figma Mobile Viewport Width */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Figma Mobile Width</span>
                  <Smartphone className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mobileW}
                    onChange={(e) => setMobileW(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-emerald-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Figma mobile design frame/canvas width (e.g. 440px)
                </p>
              </div>

              {/* 3. Figma Mobile Font Size */}
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                  <span>Mobile Font Size</span>
                  <Type className="w-3 h-3 text-emerald-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={mobileFont}
                    onChange={(e) => setMobileFont(e.target.value)}
                    className="mono w-full bg-black border border-emerald-500/40 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs mono font-semibold">px</span>
                </div>
                <p className="text-[10px] text-emerald-400/80 mt-1 leading-tight">
                  Font size set in Figma mobile design frame
                </p>
              </div>
            </div>
          </div>

          {/* ROW 2: DESKTOP PARAMETERS */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 font-mono">
              <Laptop className="w-3.5 h-3.5 text-sky-400" />
              <span>Desktop Design Parameters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              {/* 4. Max Viewport */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Max Viewport</span>
                  <Monitor className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxW}
                    onChange={(e) => setMaxW(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-sky-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Maximum width limit until which text scales up
                </p>
              </div>

              {/* 5. Figma Desktop Viewport Width */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Figma Desktop Width</span>
                  <Laptop className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={desktopW}
                    onChange={(e) => setDesktopW(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-sky-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Figma desktop design frame/canvas width (e.g. 1440px)
                </p>
              </div>

              {/* 6. Figma Desktop Font Size */}
              <div>
                <label className="block text-xs font-semibold text-sky-400 mb-1 flex items-center justify-between">
                  <span>Desktop Font Size</span>
                  <Type className="w-3 h-3 text-sky-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={desktopFont}
                    onChange={(e) => setDesktopFont(e.target.value)}
                    className="mono w-full bg-black border border-sky-500/40 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 text-xs mono font-semibold">px</span>
                </div>
                <p className="text-[10px] text-sky-400/80 mt-1 leading-tight">
                  Font size set in Figma desktop design frame
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator & Growth Curve */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" /> Interactive Live Preview
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
            className="w-full cursor-pointer"
          />

          <div
            className="border border-zinc-800 rounded-xl h-36 flex items-center justify-center overflow-hidden p-6 relative group transition-colors"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest opacity-60 font-mono">
              Simulated Viewport Output
            </div>
            <span
              className="font-semibold text-center tracking-tight leading-tight transition-all duration-75 px-4 select-none"
              style={{ fontSize: `${currentFontPx}px` }}
            >
              Scales smoothly across viewports
            </span>
          </div>

          {/* Fluid Growth Curve Visualizer SVG */}
          {svgData && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Fluid Growth Curve Visualizer
                </span>
                <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white"></span> Curve Path</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span> Active Slider</span>
                </span>
              </div>

              <div className="w-full h-44 relative">
                <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="50" y1="25" x2="560" y2="25" stroke="#27272a" strokeDasharray="3,3" strokeWidth="1" />
                  <line x1="50" y1="90" x2="560" y2="90" stroke="#18181b" strokeDasharray="3,3" strokeWidth="1" />
                  <line x1="50" y1="155" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />
                  <line x1="50" y1="25" x2="50" y2="155" stroke="#27272a" strokeWidth="1" />
                  <line x1="560" y1="25" x2="560" y2="155" stroke="#27272a" strokeWidth="1" />

                  <path d={svgData.dArea} fill="url(#curveGradient)" />
                  <path d={svgData.dPath} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                  <line x1={svgData.ptMob.x} y1="25" x2={svgData.ptMob.x} y2="155" stroke="#3f3f46" strokeDasharray="2,2" strokeWidth="1" />
                  <circle cx={svgData.ptMob.x} cy={svgData.ptMob.y} r="4.5" fill="#000000" stroke="#a1a1aa" strokeWidth="2" />
                  <text x={svgData.ptMob.x} y={svgData.ptMob.y - 10} fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    Mobile {mobFPx}px
                  </text>

                  <line x1={svgData.ptDesk.x} y1="25" x2={svgData.ptDesk.x} y2="155" stroke="#3f3f46" strokeDasharray="2,2" strokeWidth="1" />
                  <circle cx={svgData.ptDesk.x} cy={svgData.ptDesk.y} r="4.5" fill="#000000" stroke="#a1a1aa" strokeWidth="2" />
                  <text x={svgData.ptDesk.x} y={svgData.ptDesk.y - 10} fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    Desktop {deskFPx}px
                  </text>

                  <line x1={svgData.trackerX} y1="25" x2={svgData.trackerX} y2="155" stroke="#ffffff" strokeDasharray="3,3" strokeWidth="1.5" />
                  <circle cx={svgData.trackerX} cy={svgData.trackerY} r="6" fill="#ffffff" opacity="0.25" />
                  <circle cx={svgData.trackerX} cy={svgData.trackerY} r="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                  <text x={svgData.trackerX} y={svgData.trackerY + 16} fill="#ffffff" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono" textAnchor="middle">
                    {Math.round(previewSlider)}px ({round(svgData.trackerPx, 1)}px)
                  </text>

                  <text x="42" y="28" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{round(svgData.highPx, 1)}px</text>
                  <text x="42" y="158" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{round(svgData.lowPx, 1)}px</text>
                  <text x="50" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="start">{minVPx}px</text>
                  <text x="560" y="172" fill="#71717a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{maxVPx}px</text>
                </svg>
              </div>
            </div>
          )}
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

          {isWidthInvalid ? (
            <div className="mono bg-rose-950/30 border border-rose-900/50 rounded-xl p-4 text-xs sm:text-sm text-rose-300/90 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400/80" />
              <span>Mobile and Desktop widths must be different (Mobile &lt; Desktop).</span>
            </div>
          ) : (
            <pre className="mono bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[76px] text-zinc-200 select-all whitespace-pre-wrap">
              <code>{activeTab === 'css' ? calculation?.cssCode : activeTab === 'tw' ? calculation?.twCode : calculation?.bsCode}</code>
            </pre>
          )}

          <button
            onClick={handleCopy}
            disabled={isWidthInvalid}
            className="w-full bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black transition-all text-xs sm:text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Generated Code'}</span>
          </button>
        </div>

        {/* Calculated Font Extrapolation Grid */}
        <div className="pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 block flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-zinc-400" /> Calculated Font Extrapolation
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center justify-between">
                <span>Min Bound</span>
                <ChevronLeft className="w-3 h-3 text-zinc-600" />
              </div>
              <div className="mono text-xs sm:text-sm text-zinc-300">
                {calculation ? `${round(calculation.fontAtMin, 1)}px / ${round(calculation.fontAtMin / 16, 3)}rem` : 'N/A'}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                <span>Mobile Point</span>
                <Smartphone className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">
                {mobFPx}px / {round(mobFPx / 16, 3)}rem
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                <span>Desktop Point</span>
                <Laptop className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="mono text-xs sm:text-sm text-white font-medium">
                {deskFPx}px / {round(deskFPx / 16, 3)}rem
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
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
        <div className="pt-6 border-t border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-300" /> Typography Accessibility Audit
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

          {/* Overall Audit Banner */}
          <div className="p-4 rounded-xl border flex items-start gap-3 transition-colors bg-zinc-950 border-zinc-800 text-zinc-300">
            {overallAudit.type === 'danger' ? (
              <XCircle className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
            ) : overallAudit.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-white mt-0.5 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-semibold text-sm mb-0.5 text-white">{overallAudit.title}</div>
              <div className="text-zinc-400 leading-relaxed">{overallAudit.desc}</div>
            </div>
          </div>

          {/* Cards Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-zinc-500" /> Mobile (320-440px)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                  mobAudit.status === 'pass'
                    ? 'bg-zinc-900 text-white border-zinc-700'
                    : mobAudit.status === 'warn'
                    ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {mobAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(mobFPx, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{mobAudit.msg}</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-zinc-500" /> Tablet (768px)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                  tabAudit.status === 'pass'
                    ? 'bg-zinc-900 text-white border-zinc-700'
                    : tabAudit.status === 'warn'
                    ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {tabAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(tabletFont, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{tabAudit.msg}</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-zinc-500" /> Desktop (1440px+)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                  deskAudit.status === 'pass'
                    ? 'bg-zinc-900 text-white border-zinc-700'
                    : deskAudit.status === 'warn'
                    ? 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {deskAudit.status.toUpperCase()}
                </span>
              </div>
              <div className="mono text-xs font-semibold text-white">{round(deskFPx, 1)}px</div>
              <div className="text-[11px] text-zinc-400 leading-snug">{deskAudit.msg}</div>
            </div>
          </div>

          {/* Color Contrast Audit Sub-Section */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">WCAG 2.1 Color Contrast Ratio Audit</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <label className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Text:</span>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-white font-bold">{textColor}</span>
                </label>

                <label className="flex items-center gap-1.5">
                  <span className="text-zinc-400">BG:</span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-white font-bold">{bgColor}</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-zinc-400">Contrast Ratio:</span>
                <span className="mono font-bold text-sm text-white bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  {contrastResult.ratio} : 1
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className={`px-2.5 py-1 rounded-full border font-bold ${
                  contrastResult.passAA ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  WCAG AA (Normal Text {'>='} 4.5:1): {contrastResult.passAA ? 'PASS' : 'FAIL'}
                </span>

                <span className={`px-2.5 py-1 rounded-full border font-bold ${
                  contrastResult.passAAA ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  WCAG AAA (Normal Text {'>='} 7:1): {contrastResult.passAAA ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
