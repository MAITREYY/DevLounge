import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import { Smartphone, Laptop, Sliders, Eye, Check, Copy, AlertTriangle, CheckCircle2, Wand2 } from 'lucide-react';

export default function FluidBoxTool() {
  // Mobile Spec State
  const [mobScreenWidth, setMobScreenWidth] = useState(440);
  const [mobContainerWidth, setMobContainerWidth] = useState(360);
  const [mobSidePad, setMobSidePad] = useState(40);
  const [mobSideUnit, setMobSideUnit] = useState('px');
  const [mobVPad, setMobVPad] = useState(16);
  const [mobVUnit, setMobVUnit] = useState('px');

  // PC Spec State
  const [pcScreenWidth, setPcScreenWidth] = useState(1920);
  const [pcContainerWidth, setPcContainerWidth] = useState(1440);
  const [pcSidePad, setPcSidePad] = useState(240);
  const [pcSideUnit, setPcSideUnit] = useState('px');
  const [pcVPad, setPcVPad] = useState(48);
  const [pcVUnit, setPcVUnit] = useState('px');

  // Options & Tabs
  const [includeVPad, setIncludeVPad] = useState(true);
  const [activeTab, setActiveTab] = useState('css');
  const [simWidth, setSimWidth] = useState(1440);
  const [copied, setCopied] = useState(false);

  // Helper calculation
  const getPx = (val, unit) => {
    const num = parseFloat(val) || 0;
    return unit === 'rem' ? num * 16 : num;
  };

  const round = (n, d = 3) => {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
  };

  // Convert inputs to numbers
  const mobScreenPx = parseFloat(mobScreenWidth) || 440;
  const mobContainerPx = parseFloat(mobContainerWidth) || 360;
  const mobSidePx = getPx(mobSidePad, mobSideUnit);
  const mobVPx = getPx(mobVPad, mobVUnit);

  const pcScreenPx = parseFloat(pcScreenWidth) || 1920;
  const pcContainerPx = parseFloat(pcContainerWidth) || 1440;
  const pcSidePx = getPx(pcSidePad, pcSideUnit);
  const pcVPx = getPx(pcVPad, pcVUnit);

  // Gutter & Rem calculations
  const mobTotalGutterPx = mobSidePx * 2;
  const mobTotalGutterRem = round(mobTotalGutterPx / 16);
  const pcMaxRem = round(pcContainerPx / 16);
  const mobVRem = round(mobVPx / 16);
  const pcVRem = round(pcVPx / 16);

  // Geometry Overflow Hazard Check
  const mobNeeded = mobContainerPx + mobSidePx * 2;
  const pcNeeded = pcContainerPx + pcSidePx * 2;
  const mobOverflow = mobNeeded - mobScreenPx;
  const pcOverflow = pcNeeded - pcScreenPx;
  const hasHazard = mobOverflow > 0 || pcOverflow > 0;

  // Auto Fix Geometry
  const autoFixGeometry = () => {
    const safeMobContainer = Math.max(0, mobScreenPx - mobSidePx * 2);
    setMobContainerWidth(safeMobContainer);
    const safePcContainer = Math.max(0, pcScreenPx - pcSidePx * 2);
    setPcContainerWidth(safePcContainer);
  };

  // Presets
  const applyPresetUser = () => {
    setMobScreenWidth(440);
    setMobContainerWidth(360);
    setMobSidePad(40);
    setMobSideUnit('px');
    setMobVPad(16);
    setMobVUnit('px');
    setPcScreenWidth(1920);
    setPcContainerWidth(1440);
    setPcSidePad(240);
    setPcSideUnit('px');
    setPcVPad(48);
    setPcVUnit('px');
  };

  const applyPresetStd = () => {
    setMobScreenWidth(390);
    setMobContainerWidth(358);
    setMobSidePad(16);
    setMobSideUnit('px');
    setMobVPad(16);
    setMobVUnit('px');
    setPcScreenWidth(1440);
    setPcContainerWidth(1280);
    setPcSidePad(80);
    setPcSideUnit('px');
    setPcVPad(32);
    setPcVUnit('px');
  };

  // Code Exporters
  const generatedCode = useMemo(() => {
    // 1. Vanilla CSS
    let cssLines = [];
    cssLines.push(`width: calc(100% - ${mobTotalGutterRem}rem);`);
    cssLines.push(`max-width: ${pcMaxRem}rem;`);
    cssLines.push(`margin-inline: auto;`);
    if (includeVPad && mobVPx > 0) {
      cssLines.push(`padding-block: ${mobVRem}rem;`);
    }

    let cssMQ = '';
    if (includeVPad && pcVPx !== mobVPx) {
      cssMQ = `\n\n@media (min-width: 1024px) {\n  .main-container {\n    padding-block: ${pcVRem}rem;\n  }\n}`;
    }
    const cssCode = `/* Generated from Figma: Mobile (${mobScreenPx}px / ${mobContainerPx}px) & PC (${pcScreenPx}px / ${pcContainerPx}px) */\n.main-container {\n  ${cssLines.join('\n  ')}\n}${cssMQ}`;

    // 2. Tailwind CSS
    let twClasses = [];
    twClasses.push(`w-[calc(100%-${mobTotalGutterRem}rem)]`);
    twClasses.push(`max-w-[${pcMaxRem}rem]`);
    twClasses.push(`mx-auto`);
    if (includeVPad && mobVPx > 0) {
      twClasses.push(`py-[${mobVRem}rem]`);
    }
    if (includeVPad && pcVPx !== mobVPx) {
      twClasses.push(`lg:py-[${pcVRem}rem]`);
    }
    const twCode = `<!-- Tailwind CSS Container -->\n<div class="${twClasses.join(' ')}">\n  <!-- Your fluid content here -->\n</div>`;

    // 3. Bootstrap 5
    const bsCode = `/* Bootstrap 5 Custom Fluid Container */\n.main-container {\n  ${cssLines.join('\n  ')}\n}${cssMQ}\n\n<!-- HTML Markup -->\n<div class="main-container">\n  <!-- Your content here -->\n</div>`;

    if (activeTab === 'tw') return twCode;
    if (activeTab === 'bs') return bsCode;
    return cssCode;
  }, [
    activeTab,
    mobTotalGutterRem,
    pcMaxRem,
    includeVPad,
    mobVPx,
    mobVRem,
    pcVPx,
    pcVRem,
    mobScreenPx,
    mobContainerPx,
    pcScreenPx,
    pcContainerPx,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    triggerCopyConfetti();
    setTimeout(() => setCopied(false), 1600);
  };

  // Simulator Calculations
  let currentSidePx = mobSidePx;
  let currentVPx = mobVPx;
  let deviceTag = '📱 Mobile';
  if (simWidth >= 1024) {
    currentSidePx = pcSidePx;
    currentVPx = pcVPx;
    deviceTag = '💻 Desktop';
  } else if (simWidth >= 768) {
    const factor = (simWidth - 768) / (1024 - 768);
    currentSidePx = Math.round(mobSidePx + (pcSidePx - mobSidePx) * factor);
    currentVPx = Math.round(mobVPx + (pcVPx - mobVPx) * factor);
    deviceTag = '📑 Tablet';
  }

  const actualContainerW = Math.min(simWidth, pcContainerPx);
  const containerPct = simWidth > 0 ? Math.max(15, Math.min(100, (actualContainerW / simWidth) * 100)) : 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-1 font-mono">
          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
          <span>Figma Container Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Fluid Layout <code className="mono text-zinc-300 font-semibold">Container</code>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Control side & top/bottom padding for Mobile and PC to generate responsive <code className="mono text-zinc-200">calc(100% - X)</code> container CSS.
        </p>
      </header>

      {/* Main Generator Card */}
      <div className="bg-black border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Controls Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" /> Responsive Figma & Padding Controls
            </h2>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={applyPresetUser}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] mono font-medium hover:bg-zinc-800 transition-colors"
              >
                440px / 360px (40px Side)
              </button>
              <button
                type="button"
                onClick={applyPresetStd}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-400 border border-zinc-800 text-[11px] mono hover:text-white transition-colors"
              >
                390px / 358px (16px Side)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Mobile Viewport Spec */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-zinc-900 pb-2">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-zinc-400" /> Mobile Viewport Spec
                </span>
                <span className="mono text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Total Gutter: {mobTotalGutterRem}rem ({mobTotalGutterPx}px)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Figma Screen</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={mobScreenWidth}
                      onChange={(e) => setMobScreenWidth(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-7 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 mono">px</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Container</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={mobContainerWidth}
                      onChange={(e) => setMobContainerWidth(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-7 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 mono">px</span>
                  </div>
                </div>
              </div>

              {/* Mobile Paddings Row */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-zinc-900">
                <div>
                  <label className="text-[11px] text-zinc-300 font-medium block mb-1">Mobile Side Pad</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={mobSidePad}
                      onChange={(e) => setMobSidePad(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-14 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                      <select
                        value={mobSideUnit}
                        onChange={(e) => setMobSideUnit(e.target.value)}
                        className="dec-select pl-1.5 pr-3 py-0.5 rounded text-[10px] text-zinc-300 mono cursor-pointer bg-zinc-950 border border-zinc-800"
                      >
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 font-medium block mb-1">Mobile Top/Bottom</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={mobVPad}
                      onChange={(e) => setMobVPad(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-14 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                      <select
                        value={mobVUnit}
                        onChange={(e) => setMobVUnit(e.target.value)}
                        className="dec-select pl-1.5 pr-3 py-0.5 rounded text-[10px] text-zinc-300 mono cursor-pointer bg-zinc-950 border border-zinc-800"
                      >
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PC / Desktop Viewport Spec */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-zinc-900 pb-2">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-zinc-400" /> PC / Desktop Viewport Spec
                </span>
                <span className="mono text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Max: {pcContainerPx}px ({pcMaxRem}rem)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Figma Screen</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pcScreenWidth}
                      onChange={(e) => setPcScreenWidth(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-7 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 mono">px</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Container Max</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pcContainerWidth}
                      onChange={(e) => setPcContainerWidth(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-7 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 mono">px</span>
                  </div>
                </div>
              </div>

              {/* PC Paddings Row */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-zinc-900">
                <div>
                  <label className="text-[11px] text-zinc-300 font-medium block mb-1">PC Side Pad</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={pcSidePad}
                      onChange={(e) => setPcSidePad(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-14 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                      <select
                        value={pcSideUnit}
                        onChange={(e) => setPcSideUnit(e.target.value)}
                        className="dec-select pl-1.5 pr-3 py-0.5 rounded text-[10px] text-zinc-300 mono cursor-pointer bg-zinc-950 border border-zinc-800"
                      >
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 font-medium block mb-1">PC Top/Bottom</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={pcVPad}
                      onChange={(e) => setPcVPad(e.target.value)}
                      className="mono w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2.5 pr-14 py-1.5 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                      <select
                        value={pcVUnit}
                        onChange={(e) => setPcVUnit(e.target.value)}
                        className="dec-select pl-1.5 pr-3 py-0.5 rounded text-[10px] text-zinc-300 mono cursor-pointer bg-zinc-950 border border-zinc-800"
                      >
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geometry Ergonomics & Safety Warning Banner */}
          {hasHazard ? (
            <div className="mt-4 p-4 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-300/90 transition-all duration-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400/80 mt-0.5 shrink-0" />
                <div className="flex-1 text-xs space-y-1.5">
                  <div className="font-semibold text-sm text-rose-300">Screen Overflow Geometry Hazard</div>
                  <div className="text-zinc-300/80 leading-relaxed">
                    {mobOverflow > 0 && pcOverflow > 0
                      ? `Both Mobile & PC containers overflow screen limits! Mobile exceeds by ${mobOverflow}px, and PC exceeds by ${pcOverflow}px.`
                      : mobOverflow > 0
                      ? `Mobile container (${mobContainerPx}px) + side padding (${mobSidePx * 2}px) = ${mobNeeded}px, which exceeds screen (${mobScreenPx}px) by ${mobOverflow}px!`
                      : `PC container (${pcContainerPx}px) + side padding (${pcSidePx * 2}px) = ${pcNeeded}px, which exceeds screen (${pcScreenPx}px) by ${pcOverflow}px!`}
                  </div>
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={autoFixGeometry}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 font-semibold text-xs border border-rose-900/60 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-xs text-rose-300" />
                      <span>Auto-Fix Container & Padding Geometry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 text-emerald-300/90 transition-all duration-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400/80 mt-0.5 shrink-0" />
                <div className="flex-1 text-xs space-y-1">
                  <div className="font-semibold text-sm text-emerald-300">Responsive Geometry Approved</div>
                  <div className="text-zinc-300/80 leading-relaxed">
                    All side paddings and container widths fit cleanly inside Mobile ({mobScreenPx}px) and PC ({pcScreenPx}px) viewports with safe side gutters.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Screen Simulator */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" /> Interactive Viewport Simulator
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Screen Width:</span>
              <span className="mono font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">
                {simWidth}px
              </span>
              <span className="mono text-zinc-400 ml-1">{deviceTag}</span>
            </div>
          </div>

          <input
            type="range"
            min={320}
            max={1920}
            value={simWidth}
            onChange={(e) => setSimWidth(Number(e.target.value))}
            className="w-full cursor-pointer"
          />

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 min-h-[160px] flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
              Simulated Screen ({simWidth}px)
            </div>

            <div
              className="border border-zinc-700 bg-zinc-900/90 rounded-lg p-4 transition-all duration-150 flex flex-col justify-between relative shadow-md"
              style={{
                width: `${containerPct}%`,
                paddingLeft: `${currentSidePx}px`,
                paddingRight: `${currentSidePx}px`,
                paddingTop: `${includeVPad ? currentVPx : 16}px`,
                paddingBottom: `${includeVPad ? currentVPx : 16}px`,
              }}
            >
              <div className="text-[11px] mono text-zinc-400 flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>Container: {actualContainerW}px</span>
                <span>Sides: {currentSidePx}px</span>
              </div>
              <div className="text-xs text-white font-medium text-center py-4">
                Fluid Content Area
              </div>
            </div>
          </div>
        </div>

        {/* Code Exporter */}
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

            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVPad}
                onChange={(e) => setIncludeVPad(e.target.checked)}
                className="rounded accent-white bg-zinc-900 border-zinc-700"
              />
              <span>Include Vertical Padding</span>
            </label>
          </div>

          <pre className="mono bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[96px] text-zinc-200 select-all whitespace-pre-wrap">
            <code>{generatedCode}</code>
          </pre>

          <button
            onClick={handleCopy}
            className="w-full bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black transition-all text-xs sm:text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Container Code'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
