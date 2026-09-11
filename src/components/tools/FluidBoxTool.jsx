import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { triggerCopyConfetti } from "../../utils/helpers";
import {
  Smartphone,
  Laptop,
  Sliders,
  Eye,
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Info,
  Layers,
  Zap,
  XCircle,
} from "lucide-react";

export default function FluidBoxTool() {
  // 1. Mobile Spec State (4 Fields)
  const [mobScreenWidth, setMobScreenWidth] = useState(440); // 1. Figma Canvas / Frame size
  const [mobContainerWidth, setMobContainerWidth] = useState(360); // 2. Figma Container size
  const [mobSidePad, setMobSidePad] = useState(40); // 3. Mobile side padding
  const [mobVPad, setMobVPad] = useState(16); // 4. Mobile top & bottom padding

  // 2. Desktop Spec State (4 Fields)
  const [pcScreenWidth, setPcScreenWidth] = useState(1440); // 1. Figma Desktop Canvas size
  const [pcContainerWidth, setPcContainerWidth] = useState(1280); // 2. Figma Desktop Container size
  const [pcSidePad, setPcSidePad] = useState(80); // 3. Desktop side padding
  const [pcVPad, setPcVPad] = useState(32); // 4. Desktop top & bottom padding

  // Options & Simulator
  const [includeVPad, setIncludeVPad] = useState(true);
  const [activeTab, setActiveTab] = useState("css");
  const [simWidth, setSimWidth] = useState(1440);
  const [copiedKey, setCopiedKey] = useState(null);

  // Helper calculation
  const round = (n, d = 3) => {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
  };

  // Safe Number Parsing
  const mobScreenPx = parseFloat(mobScreenWidth) || 440;
  const mobContainerPx = parseFloat(mobContainerWidth) || 360;
  const mobSidePx = parseFloat(mobSidePad) || 0;
  const mobVPx = parseFloat(mobVPad) || 0;

  const pcScreenPx = parseFloat(pcScreenWidth) || 1440;
  const pcContainerPx = parseFloat(pcContainerWidth) || 1280;
  const pcSidePx = parseFloat(pcSidePad) || 0;
  const pcVPx = parseFloat(pcVPad) || 0;

  // Horizontal Padding Calculations
  const mobTotalSidePadPx = mobSidePx * 2;
  const mobInnerContentPx = mobContainerPx - mobTotalSidePadPx;

  const pcTotalSidePadPx = pcSidePx * 2;
  const pcInnerContentPx = pcContainerPx - pcTotalSidePadPx;

  // Rem Conversions
  const mobTotalGutterRem = round(mobTotalSidePadPx / 16);
  const pcMaxRem = round(pcContainerPx / 16);
  const mobVRem = round(mobVPx / 16);
  const pcVRem = round(pcVPx / 16);
  const mobSideRem = round(mobSidePx / 16);
  const pcSideRem = round(pcSidePx / 16);

  // Comprehensive Validation Logic & Error Flag Checks
  const errors = useMemo(() => {
    const errList = [];

    // Mobile Validation Checks
    if (mobScreenPx <= 0) errList.push("Mobile frame width must be greater than 0.");
    if (mobContainerPx <= 0) errList.push("Mobile container width must be greater than 0.");
    if (mobContainerPx > mobScreenPx)
      errList.push(`Mobile container (${mobContainerPx}px) exceeds Figma mobile frame (${mobScreenPx}px)!`);
    if (mobTotalSidePadPx >= mobContainerPx)
      errList.push(`Mobile side padding (${mobSidePx}px × 2 = ${mobTotalSidePadPx}px) exceeds container width (${mobContainerPx}px)! No inner content space left.`);
    if (mobContainerPx + mobTotalSidePadPx > mobScreenPx)
      errList.push(`Invalid Mobile Geometry: Container (${mobContainerPx}px) + Total Padding (${mobTotalSidePadPx}px) = ${mobContainerPx + mobTotalSidePadPx}px, which exceeds Figma frame (${mobScreenPx}px)!`);

    // Desktop Validation Checks
    if (pcScreenPx <= 0) errList.push("Desktop frame width must be greater than 0.");
    if (pcContainerPx <= 0) errList.push("Desktop container width must be greater than 0.");
    if (pcContainerPx > pcScreenPx)
      errList.push(`Desktop container (${pcContainerPx}px) exceeds Figma desktop frame (${pcScreenPx}px)!`);
    if (pcTotalSidePadPx >= pcContainerPx)
      errList.push(`Desktop side padding (${pcSidePx}px × 2 = ${pcTotalSidePadPx}px) exceeds container width (${pcContainerPx}px)! No inner content space left.`);
    if (pcContainerPx + pcTotalSidePadPx > pcScreenPx)
      errList.push(`Invalid Desktop Geometry: Container (${pcContainerPx}px) + Total Padding (${pcTotalSidePadPx}px) = ${pcContainerPx + pcTotalSidePadPx}px, which exceeds Figma frame (${pcScreenPx}px)!`);

    // Cross-Viewport Geometry Checks
    if (mobScreenPx >= pcScreenPx)
      errList.push(`Mobile frame width (${mobScreenPx}px) must be smaller than Desktop frame width (${pcScreenPx}px).`);
    if (mobContainerPx > pcContainerPx)
      errList.push(`Mobile container width (${mobContainerPx}px) cannot be larger than Desktop container width (${pcContainerPx}px).`);

    return errList;
  }, [mobScreenPx, mobContainerPx, mobSidePx, pcScreenPx, pcContainerPx, pcSidePx, mobTotalSidePadPx, pcTotalSidePadPx]);

  const hasErrors = errors.length > 0;

  // Individual Field Error Flags for Red Border & Background Highlights
  const isMobScreenErr = mobScreenPx <= 0 || mobScreenPx >= pcScreenPx || mobContainerPx > mobScreenPx || mobContainerPx + mobTotalSidePadPx > mobScreenPx;
  const isMobContainerErr = mobContainerPx <= 0 || mobContainerPx > mobScreenPx || mobTotalSidePadPx >= mobContainerPx || mobContainerPx > pcContainerPx || mobContainerPx + mobTotalSidePadPx > mobScreenPx;
  const isMobSidePadErr = mobSidePx < 0 || mobTotalSidePadPx >= mobContainerPx || mobContainerPx + mobTotalSidePadPx > mobScreenPx;

  const isPcScreenErr = pcScreenPx <= 0 || pcScreenPx <= mobScreenPx || pcContainerPx > pcScreenPx || pcContainerPx + pcTotalSidePadPx > pcScreenPx;
  const isPcContainerErr = pcContainerPx <= 0 || pcContainerPx > pcScreenPx || pcTotalSidePadPx >= pcContainerPx || mobContainerPx > pcContainerPx || pcContainerPx + pcTotalSidePadPx > pcScreenPx;
  const isPcSidePadErr = pcSidePx < 0 || pcTotalSidePadPx >= pcContainerPx || pcContainerPx + pcTotalSidePadPx > pcScreenPx;

  // Quick Auto Fix
  const autoFixGeometry = () => {
    const safeMobScreen = 440;
    const safePcScreen = 1440;
    setMobScreenWidth(safeMobScreen);
    setPcScreenWidth(safePcScreen);
    setMobContainerWidth(360);
    setPcContainerWidth(1280);
    setMobSidePad(32);
    setPcSidePad(80);
    setMobVPad(16);
    setPcVPad(32);
  };

  // Generated Code Bundle
  const generatedCode = useMemo(() => {
    let cssLines = [];
    cssLines.push(`width: calc(100% - ${mobTotalGutterRem}rem);`);
    cssLines.push(`max-width: ${pcMaxRem}rem;`);
    cssLines.push(`margin-inline: auto;`);
    if (includeVPad && mobVPx > 0) {
      cssLines.push(`padding-block: ${mobVRem}rem;`);
    }

    let cssMQ = "";
    if (includeVPad && pcVPx !== mobVPx) {
      cssMQ = `\n\n@media (min-width: 1024px) {\n  .main-container {\n    padding-block: ${pcVRem}rem;\n  }\n}`;
    }
    const cssCode = `/* Generated from Figma Specs: Mobile (${mobScreenPx}px / ${mobContainerPx}px) & Desktop (${pcScreenPx}px / ${pcContainerPx}px) */\n.main-container {\n  ${cssLines.join(
      "\n  "
    )}\n}${cssMQ}`;

    // Tailwind CSS
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
    const twCode = `<!-- Tailwind CSS Container -->\n<div class="${twClasses.join(
      " "
    )}">\n  <!-- Your fluid content here -->\n</div>`;

    // Bootstrap
    const bsCode = `/* Bootstrap 5 Custom Fluid Container */\n.main-container {\n  ${cssLines.join(
      "\n  "
    )}\n}${cssMQ}`;

    if (activeTab === "tw") return twCode;
    if (activeTab === "bs") return bsCode;
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

  // Copy helper
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerCopyConfetti();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Viewport Simulator Interpolation Calculations
  let currentSidePx = mobSidePx;
  let currentVPx = mobVPx;
  let deviceTag = "📱 Mobile";
  if (simWidth >= 1024) {
    currentSidePx = pcSidePx;
    currentVPx = pcVPx;
    deviceTag = "💻 Desktop";
  } else if (simWidth >= 768) {
    const factor = (simWidth - 768) / (1024 - 768);
    currentSidePx = Math.round(mobSidePx + (pcSidePx - mobSidePx) * factor);
    currentVPx = Math.round(mobVPx + (pcVPx - mobVPx) * factor);
    deviceTag = "📑 Tablet";
  } else if (simWidth <= 440) {
    currentSidePx = mobSidePx;
    currentVPx = mobVPx;
    deviceTag = "📱 Mobile";
  }

  const actualContainerW = Math.min(simWidth, pcContainerPx);
  const containerPct =
    simWidth > 0 ? Math.max(10, Math.min(100, (actualContainerW / simWidth) * 100)) : 100;
  const innerContentWidth = Math.max(0, actualContainerW - currentSidePx * 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-1 font-mono">
          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
          <span>Figma Container & Layout Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Fluid Layout <code className="mono text-zinc-300 font-semibold">Container</code>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Configure Mobile and Desktop Figma artboard parameters to generate responsive container CSS with precise padding calculations.
        </p>
      </header>

      {/* Main Card Container */}
      <div className="bg-black border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Controls Section: Stacked Up and Down (Row 1 Mobile, Row 2 Desktop) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> Figma Artboard & Container Specifications
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              Stacked Layout: Mobile Specs (Top) • Desktop Specs (Bottom)
            </span>
          </div>

          {/* SECTION 1: MOBILE CONFIGURATIONS (STACKED ON TOP) */}
          <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1. Mobile Viewport Configurations</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Configure Figma mobile frame size, container width, side padding & vertical padding
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                Total Side Gutter: {mobTotalSidePadPx}px ({mobTotalGutterRem}rem)
              </span>
            </div>

            {/* 4 Fields Grid for Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 1: Figma Canvas / Frame Size */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>1. Figma Mobile Frame</span>
                  <Smartphone className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mobScreenWidth}
                    onChange={(e) => setMobScreenWidth(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      isMobScreenErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-zinc-800 focus:border-emerald-500/80"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Total mobile screen/canvas width in Figma (e.g. 440px or 390px)
                </p>
              </div>

              {/* Field 2: Figma Container Size */}
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                  <span>2. Mobile Container Width</span>
                  <Layers className="w-3 h-3 text-emerald-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mobContainerWidth}
                    onChange={(e) => setMobContainerWidth(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none transition-colors ${
                      isMobContainerErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-emerald-500/40 focus:border-emerald-400"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs mono font-semibold">px</span>
                </div>
                <p className="text-[10px] text-emerald-400/80 mt-1 leading-tight">
                  Nominal width of layout container frame in Figma
                </p>
              </div>

              {/* Field 3: Mobile Side Padding */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>3. Mobile Side Padding</span>
                  <Sliders className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mobSidePad}
                    onChange={(e) => setMobSidePad(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      isMobSidePadErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-zinc-800 focus:border-emerald-500/80"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Left & Right padding per side ({mobSidePx}px × 2 = {mobTotalSidePadPx}px total)
                </p>
              </div>

              {/* Field 4: Mobile Top & Bottom Padding */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>4. Mobile Top/Bottom Pad</span>
                  <Sliders className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mobVPad}
                    onChange={(e) => setMobVPad(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-emerald-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Vertical block padding for top & bottom spacing
                </p>
              </div>
            </div>

            {/* Mobile Calculation & Padding Info Box */}
            <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 font-semibold text-zinc-300">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile Padding Calculation:</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Figma Frame ({mobScreenPx}px) ➔ Container ({mobContainerPx}px) with {mobSidePx}px side padding on each side ({mobTotalSidePadPx}px total side gutter).
                <span className="text-emerald-300 block mt-0.5 font-semibold">
                  • Net Inner Content Width: {mobInnerContentPx}px ({mobContainerPx}px container - {mobTotalSidePadPx}px side padding).
                </span>
              </p>
            </div>
          </div>

          {/* SECTION 2: DESKTOP CONFIGURATIONS (STACKED BELOW) */}
          <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2. Desktop Viewport Configurations</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Configure Figma desktop frame size, container width, side padding & vertical padding
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-sky-400 font-semibold px-2.5 py-1 bg-sky-500/10 rounded-full border border-sky-500/20">
                Max Container: {pcContainerPx}px ({pcMaxRem}rem)
              </span>
            </div>

            {/* 4 Fields Grid for Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 1: Figma Desktop Canvas / Frame Size */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>1. Figma Desktop Frame</span>
                  <Laptop className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pcScreenWidth}
                    onChange={(e) => setPcScreenWidth(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      isPcScreenErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-zinc-800 focus:border-sky-500/80"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Total desktop screen/canvas width in Figma (e.g. 1440px or 1920px)
                </p>
              </div>

              {/* Field 2: Figma Desktop Container Size */}
              <div>
                <label className="block text-xs font-semibold text-sky-400 mb-1 flex items-center justify-between">
                  <span>2. Desktop Container Max</span>
                  <Layers className="w-3 h-3 text-sky-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pcContainerWidth}
                    onChange={(e) => setPcContainerWidth(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none transition-colors ${
                      isPcContainerErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-sky-500/40 focus:border-sky-400"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 text-xs mono font-semibold">px</span>
                </div>
                <p className="text-[10px] text-sky-400/80 mt-1 leading-tight">
                  Maximum width limit for desktop container in Figma
                </p>
              </div>

              {/* Field 3: Desktop Side Padding */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>3. Desktop Side Padding</span>
                  <Sliders className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pcSidePad}
                    onChange={(e) => setPcSidePad(e.target.value)}
                    className={`mono w-full bg-black border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      isPcSidePadErr
                        ? "border-red-500/80 bg-red-950/30 text-red-200 focus:border-red-500"
                        : "border-zinc-800 focus:border-sky-500/80"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Left & Right padding per side ({pcSidePx}px × 2 = {pcTotalSidePadPx}px total)
                </p>
              </div>

              {/* Field 4: Desktop Top & Bottom Padding */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>4. Desktop Top/Bottom Pad</span>
                  <Sliders className="w-3 h-3 text-zinc-500" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pcVPad}
                    onChange={(e) => setPcVPad(e.target.value)}
                    className="mono w-full bg-black border border-zinc-800 focus:border-sky-500/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs mono">px</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                  Vertical block padding for top & bottom desktop spacing
                </p>
              </div>
            </div>

            {/* Desktop Calculation & Padding Info Box */}
            <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 font-semibold text-zinc-300">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Desktop Padding Calculation:</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Figma Frame ({pcScreenPx}px) ➔ Container ({pcContainerPx}px) with {pcSidePx}px side padding on each side ({pcTotalSidePadPx}px total side gutter).
                <span className="text-sky-300 block mt-0.5 font-semibold">
                  • Net Inner Content Width: {pcInnerContentPx}px ({pcContainerPx}px container - {pcTotalSidePadPx}px side padding).
                </span>
              </p>
            </div>
          </div>

          {/* Dynamic Validation Errors & Auto-Fix Banner (Red Highlight) */}
          {hasErrors ? (
            <div className="p-5 rounded-2xl border border-red-500/60 bg-red-950/40 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                  <XCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>Geometry Validation Errors Detected ({errors.length}):</span>
                </div>
                <ul className="space-y-1 text-xs text-red-300 pl-7 list-disc">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={autoFixGeometry}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Auto-Fix All Errors</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-3 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Geometry Validation Approved</span>
                <span className="text-emerald-300/80">
                  All Figma frame, container, and side padding specifications fit cleanly across viewports.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FULL-WIDTH COLOR-CODED VIEWPORT SIMULATOR */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" /> Full-Width Color-Coded Viewport Simulator
            </span>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">Screen Width Slider:</span>
              <span className="font-bold px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-white">
                {simWidth}px
              </span>
              <span className="text-amber-400 font-semibold">{deviceTag}</span>
            </div>
          </div>

          {/* Slider across mobile (320px) to desktop (1920px) */}
          <input
            type="range"
            min={320}
            max={1920}
            value={simWidth}
            onChange={(e) => setSimWidth(Number(e.target.value))}
            className="w-full cursor-pointer accent-amber-400"
          />

          {/* Color Legend Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono bg-zinc-950 border border-zinc-800/80 px-4 py-3 rounded-xl gap-2 shadow-inner">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50 inline-block"></span>
                Padding (X: {currentSidePx}px, Y: {includeVPad ? currentVPx : 0}px)
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-3 h-3 rounded-sm bg-indigo-500/20 border border-indigo-500/50 inline-block"></span>
                Container Bounds ({actualContainerW}px)
              </span>
            </div>
            <span className="text-zinc-500 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500/10 border border-indigo-400/30 inline-block"></span>
              Inner Content Width: <strong className="text-white">{innerContentWidth}px</strong>
            </span>
          </div>

          {/* FULL WIDTH SIMULATION CANVAS */}
          <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 min-h-[300px] flex flex-col justify-center relative overflow-hidden shadow-2xl">
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(zinc-500 1px, transparent 1px), linear-gradient(90deg, zinc-500 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-4 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                Simulated Viewport Canvas ({simWidth}px)
              </span>
              <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-amber-400/80">{deviceTag}</span>
            </div>

            {/* Screen Frame Box (The Browser Window) */}
            <div className="w-full bg-black/80 border border-zinc-700/50 rounded-xl p-4 sm:p-8 flex justify-center relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-sm z-10 my-4">
              
              {/* Scaled Container Box (Futuristic Dashed Border) */}
              <div
                className="transition-all duration-300 flex flex-col items-center justify-center rounded border border-dashed border-indigo-500/60 bg-indigo-950/20 relative shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                style={{
                  width: `${containerPct}%`,
                }}
              >
                {/* Top Padding Block (Green) */}
                {includeVPad && currentVPx > 0 && (
                  <div
                    className="w-full bg-emerald-500/10 border-b border-emerald-500/40 flex items-center justify-center overflow-hidden transition-all duration-300"
                    style={{ height: `${Math.max(24, currentVPx)}px` }}
                  >
                    <span className="text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest">Top: {currentVPx}px</span>
                  </div>
                )}

                {/* Middle Row (Left Pad + Content + Right Pad) */}
                <div className="flex w-full items-stretch flex-1 min-h-[100px]">
                  {/* Left Side Padding Block (Green) */}
                  <div
                    className="bg-emerald-500/10 border-r border-emerald-500/40 flex items-center justify-center shrink-0 transition-all duration-300 overflow-hidden relative group"
                    style={{ width: `${Math.max(30, currentSidePx)}px` }}
                  >
                    <span className="text-[9px] font-mono text-emerald-400/80 rotate-[-90deg] sm:rotate-0 whitespace-nowrap absolute">
                      {currentSidePx}px
                    </span>
                  </div>

                  {/* Center Fluid Content Area (Indigo) */}
                  <div className="flex-1 bg-indigo-500/10 border border-indigo-400/20 m-1 rounded-sm flex flex-col items-center justify-center p-2 relative overflow-hidden backdrop-blur-md">
                    {/* Inner minimal grid lines */}
                    <div className="absolute inset-0 border border-indigo-500/10 m-1 rounded-sm pointer-events-none"></div>
                    
                    <span className="text-[10px] sm:text-xs font-bold text-indigo-200 z-10 tracking-[0.2em] uppercase">Content Area</span>
                    <span className="text-[10px] text-indigo-300/80 z-10 font-mono mt-1.5 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/20">
                      W: {innerContentWidth}px
                    </span>
                  </div>

                  {/* Right Side Padding Block (Green) */}
                  <div
                    className="bg-emerald-500/10 border-l border-emerald-500/40 flex items-center justify-center shrink-0 transition-all duration-300 overflow-hidden relative group"
                    style={{ width: `${Math.max(30, currentSidePx)}px` }}
                  >
                    <span className="text-[9px] font-mono text-emerald-400/80 rotate-[90deg] sm:rotate-0 whitespace-nowrap absolute">
                      {currentSidePx}px
                    </span>
                  </div>
                </div>

                {/* Bottom Padding Block (Green) */}
                {includeVPad && currentVPx > 0 && (
                  <div
                    className="w-full bg-emerald-500/10 border-t border-emerald-500/40 flex items-center justify-center overflow-hidden transition-all duration-300"
                    style={{ height: `${Math.max(24, currentVPx)}px` }}
                  >
                    <span className="text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest">Btm: {currentVPx}px</span>
                  </div>
                )}

                {/* Container Boundary Tag */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                  <div className="text-[9px] font-mono text-indigo-300 bg-black/90 px-2.5 py-1 border border-indigo-500/40 rounded-full shadow-lg flex items-center gap-1.5">
                    <Layers className="w-2.5 h-2.5 text-indigo-400" />
                    Container: {actualContainerW}px
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Quick Copy Chips & Full Bundle Exporter */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Individual Property Quick Copy
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("css")}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "css"
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Full CSS
              </button>
              <button
                onClick={() => setActiveTab("tw")}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "tw"
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Tailwind CSS
              </button>
              <button
                onClick={() => setActiveTab("bs")}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "bs"
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Bootstrap
              </button>
            </div>
          </div>

          {/* Render dynamic chips based on Active Tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs">
            {activeTab === "tw" ? (
              <>
                <button
                  onClick={() => copyToClipboard(`w-[calc(100%-${mobTotalGutterRem}rem)]`, "tw-w")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Fluid Width</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">
                      w-[calc(100%-{mobTotalGutterRem}rem)]
                    </code>
                  </div>
                  {copiedKey === "tw-w" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                <button
                  onClick={() => copyToClipboard(`max-w-[${pcMaxRem}rem]`, "tw-maxw")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Max Width Bound</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">
                      max-w-[{pcMaxRem}rem]
                    </code>
                  </div>
                  {copiedKey === "tw-maxw" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                <button
                  onClick={() => copyToClipboard(`mx-auto`, "tw-mx")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Centered Margin</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">mx-auto</code>
                  </div>
                  {copiedKey === "tw-mx" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                {includeVPad && mobVPx > 0 && (
                  <button
                    onClick={() => copyToClipboard(`py-[${mobVRem}rem]`, "tw-mobv")}
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-zinc-500 block">Mobile Y-Padding</span>
                      <code className="text-zinc-200 group-hover:text-amber-200 truncate">py-[{mobVRem}rem]</code>
                    </div>
                    {copiedKey === "tw-mobv" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                  </button>
                )}
                {includeVPad && pcVPx !== mobVPx && (
                  <button
                    onClick={() => copyToClipboard(`lg:py-[${pcVRem}rem]`, "tw-pcv")}
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-zinc-500 block">Desktop Y-Padding</span>
                      <code className="text-zinc-200 group-hover:text-amber-200 truncate">lg:py-[{pcVRem}rem]</code>
                    </div>
                    {copiedKey === "tw-pcv" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => copyToClipboard(`width: calc(100% - ${mobTotalGutterRem}rem);`, "css-w")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Fluid Width</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">
                      width: calc(100% - {mobTotalGutterRem}rem);
                    </code>
                  </div>
                  {copiedKey === "css-w" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                <button
                  onClick={() => copyToClipboard(`max-width: ${pcMaxRem}rem;`, "css-maxw")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Max Width Bound</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">
                      max-width: {pcMaxRem}rem;
                    </code>
                  </div>
                  {copiedKey === "css-maxw" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                <button
                  onClick={() => copyToClipboard(`margin-inline: auto;`, "css-mx")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-zinc-500 block">Centered Margin</span>
                    <code className="text-zinc-200 group-hover:text-amber-200 truncate">margin-inline: auto;</code>
                  </div>
                  {copiedKey === "css-mx" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                </button>
                {includeVPad && mobVPx > 0 && (
                  <button
                    onClick={() => copyToClipboard(`padding-block: ${mobVRem}rem;`, "css-mobv")}
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all group flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-zinc-500 block">Mobile Block Padding</span>
                      <code className="text-zinc-200 group-hover:text-amber-200 truncate">padding-block: {mobVRem}rem;</code>
                    </div>
                    {copiedKey === "css-mobv" ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Full Code Bundle View */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Full Generated Bundle</span>
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
            <pre className="mono bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[96px] text-zinc-200 selection:bg-zinc-700/50 selection:text-white whitespace-pre-wrap mb-3">
              <code>{generatedCode}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(generatedCode, "full-bundle")}
              disabled={hasErrors}
              className="w-full bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black transition-all text-xs sm:text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {copiedKey === "full-bundle" ? (
                <Check className="w-4 h-4 text-black" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>
                {copiedKey === "full-bundle" ? "Full Bundle Copied to Clipboard!" : "Copy Full Code Bundle"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
