import React, { useState, useMemo, useRef } from 'react';
import {
  Code,
  Image as ImageIcon,
  Upload,
  Download,
  Copy,
  Check,
  Sparkles,
  FileCode2,
  Settings2,
  Trash2,
  RefreshCw,
  Eye,
  Sliders,
  Zap,
  AlertTriangle,
  FileDown
} from 'lucide-react';

// Preset sample SVGs for 1-click instant testing
const PRESET_SVGS = [
  {
    id: 'badge',
    name: 'Cyber Shield Badge',
    category: 'Badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
  <path d="m9 12 2 2 4-4" stroke="#c084fc" stroke-width="2" />
</svg>`
  },
  {
    id: 'user-icon',
    name: 'User Profile Icon',
    category: 'Icons',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="8" r="5" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6"/>
  <path d="M20 21a8 8 0 0 0-16 0" stroke="#60a5fa"/>
</svg>`
  },
  {
    id: 'sparkle',
    name: 'Sparkle Gem',
    category: 'Graphics',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="url(#sparkle-grad)" stroke="#38bdf8" stroke-width="1"/>
  <defs>
    <linearGradient id="sparkle-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
</svg>`
  },
  {
    id: 'wave-divider',
    name: 'Smooth Wave Divider',
    category: 'Divider',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#18181b"></path>
</svg>`
  },
  {
    id: 'react-logo',
    name: 'Atomic React Symbol',
    category: 'Logos',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
  <g stroke="#61dafb" stroke-width="1" fill="none">
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </g>
</svg>`
  }
];

// Helper to convert kebab-case SVG attributes to camelCase JSX properties
function convertSvgToJsx(svgString, componentName = 'SvgIcon', isTsx = false) {
  let cleaned = svgString
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Convert HTML/SVG attributes to React camelCase
  const attrReplacements = {
    'class=': 'className=',
    'stroke-width=': 'strokeWidth=',
    'stroke-linecap=': 'strokeLinecap=',
    'stroke-linejoin=': 'strokeLinejoin=',
    'stroke-miterlimit=': 'strokeMiterlimit=',
    'stroke-dasharray=': 'strokeDasharray=',
    'stroke-dashoffset=': 'strokeDashoffset=',
    'stroke-opacity=': 'strokeOpacity=',
    'fill-rule=': 'fillRule=',
    'fill-opacity=': 'fillOpacity=',
    'clip-rule=': 'clipRule=',
    'clip-path=': 'clipPath=',
    'color-interpolation=': 'colorInterpolation=',
    'color-interpolation-filters=': 'colorInterpolationFilters=',
    'stop-color=': 'stopColor=',
    'stop-opacity=': 'stopOpacity=',
    'gradientunits=': 'gradientUnits=',
    'gradienttransform=': 'gradientTransform=',
    'spreadmethod=': 'spreadMethod=',
    'patternunits=': 'patternUnits=',
    'patterntransform=': 'patternTransform=',
    'preserveaspectratio=': 'preserveAspectRatio=',
    'viewbox=': 'viewBox=',
    'xmlns:xlink=': 'xmlnsXlink=',
    'xlink:href=': 'xlinkHref=',
    'xml:space=': 'xmlSpace=',
    'tabindex=': 'tabIndex=',
    'crossorigin=': 'crossOrigin='
  };

  Object.entries(attrReplacements).forEach(([kebab, camel]) => {
    const regex = new RegExp(kebab, 'gi');
    cleaned = cleaned.replace(regex, camel);
  });

  // Inject props forwarding on root <svg>
  if (cleaned.startsWith('<svg')) {
    cleaned = cleaned.replace('<svg', '<svg {...props}');
  }

  const propsType = isTsx ? ': React.SVGProps<SVGSVGElement>' : '';
  const reactImport = isTsx ? "import React from 'react';\n\n" : "import React from 'react';\n\n";

  return `${reactImport}export const ${componentName} = (props${propsType}) => (
  ${cleaned.split('\n').join('\n  ')}
);

export default ${componentName};`;
}

// Vue 3 SFC generator
function convertSvgToVue(svgString) {
  let cleaned = svgString
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  return `<template>
  ${cleaned.split('\n').join('\n  ')}
</template>

<script setup>
// Component definition
</script>`;
}

// Svelte generator
function convertSvgToSvelte(svgString) {
  let cleaned = svgString
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  if (cleaned.startsWith('<svg')) {
    cleaned = cleaned.replace('<svg', '<svg {...$$restProps}');
  }

  return cleaned;
}

// Flutter generator
function convertSvgToFlutter(svgString, componentName = 'SvgIcon') {
  return `import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ${componentName} extends StatelessWidget {
  final double? width;
  final double? height;
  final Color? color;

  const ${componentName}({Key? key, this.width, this.height, this.color}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(
      '''${svgString}''',
      width: width,
      height: height,
      colorFilter: color != null ? ColorFilter.mode(color!, BlendMode.srcIn) : null,
    );
  }
}`;
}

export default function FluidSvgTool() {
  const [activeTab, setActiveTab] = useState('imageToCode'); // 'imageToCode' | 'codeToImage'
  
  // Image to Code State
  const [svgInput, setSvgInput] = useState(PRESET_SVGS[0].svg);
  const [codeTarget, setCodeTarget] = useState('jsx'); // 'jsx' | 'tsx' | 'vue' | 'svelte' | 'base64' | 'css' | 'minified' | 'flutter'
  const [componentName, setComponentName] = useState('SvgIcon');
  const [removeDimensions, setRemoveDimensions] = useState(true);
  const [stripComments, setStripComments] = useState(true);
  const [minifyCode, setMinifyCode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Code to Image State
  const [codeEditorInput, setCodeEditorInput] = useState(PRESET_SVGS[0].svg);
  const [bgStyle, setBgStyle] = useState('darkGrid'); // 'darkGrid' | 'lightGrid' | 'transparent' | 'solid' | 'cyberpunk' | 'midnight' | 'sunset'
  const [solidBgColor] = useState('#09090b');
  const [canvasPadding, setCanvasPadding] = useState(32);
  const [exportScale, setExportScale] = useState(2); // 1, 2, 3, 4
  const [imageShadow, setImageShadow] = useState(true);
  const [imageCopyFeedback, setImageCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState('');

  // Synchronize initial input on preset pick
  const handleSelectPreset = (preset) => {
    setSvgInput(preset.svg);
    setCodeEditorInput(preset.svg);
  };

  // SVG Optimizer / Sanitizer Function
  const processedSvg = useMemo(() => {
    let svg = svgInput || '';
    
    if (stripComments) {
      svg = svg.replace(/<!--[\s\S]*?-->/g, '');
      svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, '');
      svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
    }

    if (removeDimensions) {
      // Remove width="..." height="..." from <svg ...> tag if viewBox exists
      svg = svg.replace(/<svg([^>]*)\b(width|height)\s*=\s*(['"])[^'"]*\3/gi, '<svg$1');
    }

    if (minifyCode) {
      svg = svg.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    }

    return svg.trim();
  }, [svgInput, stripComments, removeDimensions, minifyCode]);

  // Code Output Generator based on selected format
  const generatedCode = useMemo(() => {
    if (!processedSvg) return '';
    const safeName = componentName.replace(/[^a-zA-Z0-9]/g, '') || 'SvgIcon';

    switch (codeTarget) {
      case 'jsx':
        return convertSvgToJsx(processedSvg, safeName, false);
      case 'tsx':
        return convertSvgToJsx(processedSvg, safeName, true);
      case 'vue':
        return convertSvgToVue(processedSvg);
      case 'svelte':
        return convertSvgToSvelte(processedSvg);
      case 'base64': {
        const b64 = window.btoa(unescape(encodeURIComponent(processedSvg)));
        return `data:image/svg+xml;base64,${b64}`;
      }
      case 'css': {
        const encoded = encodeURIComponent(processedSvg)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");
        return `/* CSS Background Image */
.svg-bg {
  background-image: url("data:image/svg+xml,${encoded}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

/* CSS Mask (Icon Styling) */
.svg-icon {
  width: 24px;
  height: 24px;
  background-color: currentColor;
  -webkit-mask: url("data:image/svg+xml,${encoded}") no-repeat center / contain;
  mask: url("data:image/svg+xml,${encoded}") no-repeat center / contain;
}`;
      }
      case 'flutter':
        return convertSvgToFlutter(processedSvg, safeName);
      case 'minified':
        return processedSvg;
      default:
        return processedSvg;
    }
  }, [processedSvg, codeTarget, componentName]);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === 'string') {
        setSvgInput(text);
        setCodeEditorInput(text);
      }
    };
    reader.readAsText(file);
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.includes('svg') || file.name.endsWith('.svg'))) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === 'string') {
          setSvgInput(text);
          setCodeEditorInput(text);
        }
      };
      reader.readAsText(file);
    }
  };

  // Copy code handler
  const handleCopyCode = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Size calculation stats
  const originalSize = useMemo(() => new Blob([svgInput]).size, [svgInput]);
  const processedSize = useMemo(() => new Blob([processedSvg]).size, [processedSvg]);
  const sizeSavings = useMemo(() => {
    if (!originalSize) return 0;
    const diff = originalSize - processedSize;
    return Math.round((diff / originalSize) * 100);
  }, [originalSize, processedSize]);

  // Render SVG onto Canvas for Image Export (Code ➔ Image)
  const renderSvgToCanvas = (format = 'png', scaleMultiplier = exportScale) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      const img = new Image();
      const svgBlob = new Blob([codeEditorInput], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const padding = canvasPadding * scaleMultiplier;
        const svgWidth = (img.width || 400) * scaleMultiplier;
        const svgHeight = (img.height || 400) * scaleMultiplier;

        canvas.width = svgWidth + padding * 2;
        canvas.height = svgHeight + padding * 2;

        // Draw background
        if (bgStyle === 'transparent' && format !== 'jpeg') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (bgStyle === 'solid' || format === 'jpeg') {
          ctx.fillStyle = solidBgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgStyle === 'cyberpunk') {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#581c87');
          grad.addColorStop(1, '#831843');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgStyle === 'midnight') {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#09090b');
          grad.addColorStop(1, '#1e1b4b');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgStyle === 'sunset') {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#451a03');
          grad.addColorStop(0.5, '#7c2d12');
          grad.addColorStop(1, '#881337');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgStyle === 'lightGrid') {
          ctx.fillStyle = '#f4f4f5';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // darkGrid
          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw subtle Drop Shadow if enabled
        if (imageShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 24 * scaleMultiplier;
          ctx.shadowOffsetY = 12 * scaleMultiplier;
        }

        // Draw Image centered
        ctx.drawImage(img, padding, padding, svgWidth, svgHeight);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    });
  };

  // Export Image file download
  const handleExportImage = async (format) => {
    try {
      if (format === 'svg') {
        const blob = new Blob([codeEditorInput], { type: 'image/svg+xml' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `exported-graphic.svg`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setDownloadFeedback('svg');
        setTimeout(() => setDownloadFeedback(''), 2000);
        return;
      }

      const canvas = await renderSvgToCanvas(format);
      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `exported-graphic.${format}`;
      a.click();

      setDownloadFeedback(format);
      setTimeout(() => setDownloadFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to export image:', err);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    try {
      const canvas = await renderSvgToCanvas('png');
      canvas.toBlob((blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        setImageCopyFeedback(true);
        setTimeout(() => setImageCopyFeedback(false), 2000);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Bi-directional SVG Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Fluid SVG <span className="text-zinc-500 text-lg sm:text-2xl font-normal">Converter & Studio</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Convert SVG images to clean React, Vue, Svelte & CSS code, or convert SVG/JSX code to high-res PNG, WebP & JPEG images.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('imageToCode')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'imageToCode'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-400" />
            <span>SVG Image ➔ Code</span>
          </button>
          <button
            onClick={() => setActiveTab('codeToImage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'codeToImage'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Code ➔ Image File</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Samples Bar */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between gap-4 overflow-x-auto">
        <span className="text-xs font-mono text-zinc-400 shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Quick Presets:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PRESET_SVGS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SVG IMAGE TO CODE */}
      {/* ========================================================================= */}
      {activeTab === 'imageToCode' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Upload / Paste Raw SVG */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-zinc-400" /> Upload or Paste SVG
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {originalSize ? `${originalSize} Bytes` : '0 Bytes'}
                  </span>
                </div>

                {/* Drag & Drop File Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-950 rounded-xl p-6 text-center cursor-pointer transition-all relative group"
                >
                  <input
                    type="file"
                    accept=".svg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <FileCode2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">
                      Drag & Drop SVG file here, or <span className="text-white underline">browse</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">Supports standard .svg vector files</p>
                  </div>
                </div>

                {/* Raw SVG Textarea Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Raw SVG Code Input</span>
                    <button
                      onClick={() => {
                        setSvgInput('');
                        setCodeEditorInput('');
                      }}
                      className="text-zinc-500 hover:text-red-400 text-[10px] font-mono flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <textarea
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="<svg ...> Paste your SVG markup code here ... </svg>"
                    rows={8}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 font-mono text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Optimization Controls */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-zinc-400" /> Optimizer Settings
                    </span>
                    {sizeSavings > 0 && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                        -{sizeSavings}% Size Saved
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-zinc-400">
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <span>Strip DOCTYPE & Comments</span>
                      <input
                        type="checkbox"
                        checked={stripComments}
                        onChange={(e) => setStripComments(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <span>Remove width/height (Responsive ViewBox)</span>
                      <input
                        type="checkbox"
                        checked={removeDimensions}
                        onChange={(e) => setRemoveDimensions(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <span>Minify Output Code</span>
                      <input
                        type="checkbox"
                        checked={minifyCode}
                        onChange={(e) => setMinifyCode(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                      />
                    </label>
                  </div>
                </div>

                {/* Live SVG Visual Thumbnail Preview */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-zinc-400" /> Vector Preview
                  </span>
                  <div className="w-full h-32 bg-zinc-900/60 border border-zinc-800/60 rounded-lg flex items-center justify-center p-4 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                    {processedSvg ? (
                      <div
                        className="max-w-full max-h-full flex items-center justify-center text-white"
                        dangerouslySetInnerHTML={{ __html: processedSvg }}
                      />
                    ) : (
                      <span className="text-xs text-zinc-600 font-mono">No valid SVG input</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Generator Outputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
                {/* Target Format Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'jsx', label: 'React JSX' },
                      { id: 'tsx', label: 'React TSX' },
                      { id: 'vue', label: 'Vue 3' },
                      { id: 'svelte', label: 'Svelte' },
                      { id: 'base64', label: 'Base64' },
                      { id: 'css', label: 'CSS Rules' },
                      { id: 'minified', label: 'Minified SVG' },
                      { id: 'flutter', label: 'Flutter' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCodeTarget(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          codeTarget === t.id
                            ? 'bg-zinc-800 text-white border border-zinc-700'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(generatedCode)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-sm"
                    >
                      {copyFeedback ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Component Name Config for JSX / TSX / Flutter */}
                {(codeTarget === 'jsx' || codeTarget === 'tsx' || codeTarget === 'flutter') && (
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs">
                    <span className="text-zinc-400 font-mono">Component Name:</span>
                    <input
                      type="text"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                )}

                {/* Output Code Window */}
                <div className="relative group">
                  <pre className="w-full bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[480px] leading-relaxed selection:bg-zinc-800">
                    <code>{generatedCode || '// Select or upload an SVG to generate code...'}</code>
                  </pre>
                </div>

                {/* Output Info Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                  <span>Output Size: {new Blob([generatedCode]).size} Bytes</span>
                  <span className="text-zinc-400">Ready for Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CODE TO IMAGE (SVG/JSX CODE EXPORTER) */}
      {/* ========================================================================= */}
      {activeTab === 'codeToImage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: SVG Code Editor */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-400" /> SVG Code Editor
                  </label>
                  <button
                    onClick={() => setCodeEditorInput(PRESET_SVGS[0].svg)}
                    className="text-zinc-500 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Sample
                  </button>
                </div>

                <textarea
                  value={codeEditorInput}
                  onChange={(e) => setCodeEditorInput(e.target.value)}
                  placeholder="<svg ...> Paste or write SVG code here </svg>"
                  rows={14}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 font-mono text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none transition-colors"
                />

                {/* Canvas Render Controls */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-4">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-sky-400" /> Canvas Styling Controls
                  </span>

                  {/* Canvas Background Options */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-zinc-400">Background Pattern / Style</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'darkGrid', label: 'Dark Grid' },
                        { id: 'lightGrid', label: 'Light Grid' },
                        { id: 'transparent', label: 'Transparent' },
                        { id: 'cyberpunk', label: 'Cyberpunk' },
                        { id: 'midnight', label: 'Midnight' },
                        { id: 'sunset', label: 'Sunset' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setBgStyle(style.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                            bgStyle === style.id
                              ? 'bg-zinc-800 text-white border border-zinc-700'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding & Export Resolution Scale */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                        <span>Padding</span>
                        <span>{canvasPadding}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="96"
                        step="8"
                        value={canvasPadding}
                        onChange={(e) => setCanvasPadding(Number(e.target.value))}
                        className="w-full accent-zinc-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                        <span>Export Scale</span>
                        <span>{exportScale}x (HD)</span>
                      </div>
                      <select
                        value={exportScale}
                        onChange={(e) => setExportScale(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                      >
                        <option value={1}>1x Standard</option>
                        <option value={2}>2x High Res (HD)</option>
                        <option value={3}>3x Retina</option>
                        <option value={4}>4x Ultra HD (4K)</option>
                      </select>
                    </div>
                  </div>

                  {/* Shadow Toggle */}
                  <label className="flex items-center justify-between text-xs text-zinc-400 cursor-pointer pt-1">
                    <span>Graphic Drop Shadow</span>
                    <input
                      type="checkbox"
                      checked={imageShadow}
                      onChange={(e) => setImageShadow(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Live Visual Canvas & Exporter */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-sky-400" /> Live Interactive Canvas
                  </span>

                  <button
                    onClick={handleCopyImageToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-sm"
                  >
                    {imageCopyFeedback ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied PNG to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Canvas Visual Viewport */}
                <div
                  className={`w-full min-h-[380px] rounded-xl border border-zinc-800/80 flex items-center justify-center p-8 overflow-hidden relative transition-all ${
                    bgStyle === 'cyberpunk'
                      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900'
                      : bgStyle === 'midnight'
                      ? 'bg-gradient-to-br from-zinc-950 via-indigo-950 to-slate-900'
                      : bgStyle === 'sunset'
                      ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-rose-950'
                      : bgStyle === 'lightGrid'
                      ? 'bg-zinc-100 text-zinc-900'
                      : bgStyle === 'transparent'
                      ? 'bg-transparent'
                      : 'bg-zinc-950'
                  }`}
                  style={{ padding: `${canvasPadding}px` }}
                >
                  {/* Grid background overlay for grid modes */}
                  {(bgStyle === 'darkGrid' || bgStyle === 'lightGrid') && (
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                  )}

                  {codeEditorInput ? (
                    <div
                      className={`max-w-full max-h-full flex items-center justify-center transition-all ${
                        imageShadow ? 'drop-shadow-2xl' : ''
                      }`}
                      dangerouslySetInnerHTML={{ __html: codeEditorInput }}
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="text-xs text-zinc-500 font-mono">Paste SVG code on the left to render</p>
                    </div>
                  )}
                </div>

                {/* Multi-format Download Export Bar */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Graphic Files
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">100% Client-Side Render</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'png', label: 'PNG Image', ext: '.png' },
                      { id: 'jpeg', label: 'JPEG Image', ext: '.jpg' },
                      { id: 'webp', label: 'WebP Image', ext: '.webp' },
                      { id: 'svg', label: 'SVG Vector', ext: '.svg' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => handleExportImage(fmt.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          downloadFeedback === fmt.id
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200 hover:text-white'
                        }`}
                      >
                        <FileDown className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{fmt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
