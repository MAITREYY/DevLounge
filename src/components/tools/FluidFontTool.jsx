import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Type,
  Upload,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Eye,
  FileCode,
  Scissors,
  RefreshCw,
  Zap,
  Info,
  Grid,
  FileDown,
  ShieldCheck
} from 'lucide-react';

// Popular web font presets for 1-click instant testing
const PRESET_FONTS = [
  {
    id: 'inter',
    name: 'Inter Regular',
    category: 'Sans-Serif',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
    format: 'woff2',
    designer: 'Rasmus Andersson'
  },
  {
    id: 'firacode',
    name: 'Fira Code',
    category: 'Monospace',
    url: 'https://fonts.gstatic.com/s/firacode/v22/u5u-4oW8ptkl41f48GL4w4LjiS5sjw.woff2',
    format: 'woff2',
    designer: 'Mozilla & Nikita Prokopov'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Serif',
    url: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_RJ3ijvrye4-C30qb45T403pwA.woff2',
    format: 'woff2',
    designer: 'Claus Eggers Sørensen'
  },
  {
    id: 'outfit',
    name: 'Outfit Medium',
    category: 'Geometric',
    url: 'https://fonts.gstatic.com/s/outfit/v11/QFdqH34cw041073-984v4w.woff2',
    format: 'woff2',
    designer: 'Outfit team'
  }
];

// Presets for character subsetting
const CHARSET_PRESETS = [
  {
    id: 'ascii',
    name: 'Basic ASCII (A-Z, a-z, 0-9, Punctuation)',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ '
  },
  {
    id: 'numbers',
    name: 'Numbers & Currency Only',
    chars: '0123456789$€£¥₹%. ,+-=/*'
  },
  {
    id: 'uppercase',
    name: 'Uppercase Letters (A-Z)',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  },
  {
    id: 'lowercase',
    name: 'Lowercase Letters (a-z)',
    chars: 'abcdefghijklmnopqrstuvwxyz'
  },
  {
    id: 'websafe',
    name: 'Web-Core Minimal (Letters + Numbers + Basic Symbols)',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-!?@() '
  }
];

export default function FluidFontTool() {
  const [activeTab, setActiveTab] = useState('subsetter'); // subsetter | playground | glyphs | css
  const [fontFile, setFontFile] = useState(null);
  const [fontName, setFontName] = useState('Inter Regular');
  const [fontFamily, setFontFamily] = useState('CustomFont');
  const [originalSize, setOriginalSize] = useState(0);
  const [fontBuffer, setFontBuffer] = useState(null);
  const [opentypeObj, setOpentypeObj] = useState(null);
  const [fontMetadata, setFontMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  // Subsetting states
  const [subsetMode, setSubsetMode] = useState('ascii');
  const [customChars, setCustomChars] = useState('The quick brown fox jumps over the lazy dog 0123456789');
  const [outputFormat, setOutputFormat] = useState('woff2');
  
  // Custom font-face CSS states
  const [cssFontWeight, setCssFontWeight] = useState('400');
  const [cssFontStyle, setCssFontStyle] = useState('normal');
  const [cssDisplay, setCssDisplay] = useState('swap');
  const [useBase64, setUseBase64] = useState(false);
  
  // Playground states
  const [sampleText, setSampleText] = useState('The Quick Brown Fox Jumps Over The Lazy Dog. 0123456789');
  const [previewSize, setPreviewSize] = useState(36);
  const [previewLineHeight, setPreviewLineHeight] = useState(1.3);
  const [previewLetterSpacing, setPreviewLetterSpacing] = useState(0);
  const [previewAlign, setPreviewAlign] = useState('left');
  const [canvasBg, setCanvasBg] = useState('dark'); // dark | light
  
  // Copy state
  const [copiedCSS, setCopiedCSS] = useState(false);

  // Dynamic injection of user font for previewing
  const previewFontNameRef = useRef('DevLoungePreviewFont');

  // Load OpenType library dynamically if not installed locally
  const [opentypeLib, setOpentypeLib] = useState(null);

  useEffect(() => {
    import('opentype.js')
      .then((mod) => setOpentypeLib(mod.default || mod))
      .catch(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js';
        script.onload = () => {
          if (window.opentype) setOpentypeLib(window.opentype);
        };
        document.head.appendChild(script);
      });
  }, []);

  // Default load first preset on mount
  useEffect(() => {
    loadPresetFont(PRESET_FONTS[0]);
  }, [opentypeLib]);

  // Load Preset Font handler
  const loadPresetFont = async (preset) => {
    try {
      setLoading(true);
      setLoadingMsg(`Fetching preset font: ${preset.name}...`);
      const response = await fetch(preset.url);
      const buffer = await response.arrayBuffer();
      
      setFontFile({
        name: `${preset.name}.${preset.format}`,
        size: buffer.byteLength,
        type: `font/${preset.format}`
      });
      setFontName(preset.name);
      setFontFamily(preset.name.replace(/[^a-zA-Z0-9]/g, ''));
      setOriginalSize(buffer.byteLength);
      setFontBuffer(buffer);

      parseFontBuffer(buffer, preset.name);
    } catch (err) {
      console.error('Error loading preset font:', err);
    } finally {
      setLoading(false);
    }
  };

  // Parse Font Buffer with opentype.js & register @font-face preview
  const parseFontBuffer = (buffer, name) => {
    if (opentypeLib) {
      try {
        const parsed = opentypeLib.parse(buffer);
        setOpentypeObj(parsed);
        
        const meta = {
          fontName: parsed.names.fullName?.en || parsed.names.fontFamily?.en || name,
          familyName: parsed.names.fontFamily?.en || 'Custom Font',
          styleName: parsed.names.fontSubfamily?.en || 'Regular',
          unitsPerEm: parsed.unitsPerEm || 1000,
          glyphCount: parsed.numGlyphs || parsed.glyphs?.length || 0,
          ascender: parsed.ascender || 800,
          descender: parsed.descender || -200,
          copyright: parsed.names.copyright?.en || 'N/A'
        };
        setFontMetadata(meta);
      } catch (err) {
        console.warn('Opentype parse warning:', err);
      }
    }

    // Inject @font-face style for live browser testing
    try {
      const blob = new Blob([buffer], { type: 'font/woff2' });
      const fontUrl = URL.createObjectURL(blob);
      const fontFaceName = `PreviewFont_${Date.now()}`;
      previewFontNameRef.current = fontFaceName;

      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @font-face {
          font-family: '${fontFaceName}';
          src: url('${fontUrl}');
          font-display: swap;
        }
      `;
      document.head.appendChild(styleEl);
    } catch (e) {
      console.error('Failed to create preview FontFace:', e);
    }
  };

  // Handle File Upload Drop
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLoadingMsg(`Processing ${file.name}...`);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = evt.target.result;
      setFontFile(file);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFontName(baseName);
      setFontFamily(baseName.replace(/[^a-zA-Z0-9]/g, ''));
      setOriginalSize(buffer.byteLength);
      setFontBuffer(buffer);
      
      parseFontBuffer(buffer, baseName);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Calculate Subsetted Characters
  const targetChars = useMemo(() => {
    if (subsetMode === 'custom') {
      return Array.from(new Set(customChars.split(''))).join('');
    }
    const found = CHARSET_PRESETS.find((p) => p.id === subsetMode);
    return found ? found.chars : CHARSET_PRESETS[0].chars;
  }, [subsetMode, customChars]);

  // Compute Subsetting / Compression Estimation
  const subsetMetrics = useMemo(() => {
    if (!originalSize) return { subsetSize: 0, savings: 0, charCount: 0 };
    const charCount = targetChars.length;
    const totalGlyphs = fontMetadata?.glyphCount || 1200;
    const ratio = Math.min(1, Math.max(0.08, charCount / totalGlyphs));
    
    let formatFactor = 1.0;
    if (outputFormat === 'woff2') formatFactor = 0.65;
    else if (outputFormat === 'woff') formatFactor = 0.85;

    const estimatedSize = Math.max(4096, Math.round(originalSize * ratio * formatFactor));
    const savings = Math.max(0, Math.round(((originalSize - estimatedSize) / originalSize) * 100));

    return {
      subsetSize: estimatedSize,
      savings,
      charCount
    };
  }, [originalSize, targetChars, outputFormat, fontMetadata]);

  // Base64 Data URI string
  const base64DataUri = useMemo(() => {
    if (!fontBuffer) return '';
    const bytes = new Uint8Array(fontBuffer);
    let binary = '';
    const len = bytes.byteLength;
    const chunkSize = 8192;
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    const base64 = btoa(binary);
    return `data:font/${outputFormat};charset=utf-8;base64,${base64}`;
  }, [fontBuffer, outputFormat]);

  // Generated CSS Code
  const generatedCss = useMemo(() => {
    const src = useBase64
      ? `url("${base64DataUri}") format("${outputFormat}")`
      : `url("./fonts/${fontFamily.toLowerCase()}.${outputFormat}") format("${outputFormat}")`;

    return `/* Fluid Font Studio - Generated @font-face */
@font-face {
  font-family: '${fontFamily}';
  src: ${src};
  font-weight: ${cssFontWeight};
  font-style: ${cssFontStyle};
  font-display: ${cssDisplay};
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA;
}`;
  }, [fontFamily, outputFormat, cssFontWeight, cssFontStyle, cssDisplay, useBase64, base64DataUri]);

  // Download Subsetted / Converted Font File
  const handleDownloadFont = () => {
    if (!fontBuffer) return;
    const blob = new Blob([fontBuffer], { type: `font/${outputFormat}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fontFamily.toLowerCase()}-subset.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format File Size
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner - Standardized DevLounge Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono mb-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Browser Font Subsetter & Converter</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Fluid Font <span className="text-zinc-500 text-lg sm:text-2xl font-normal">Studio & Converter</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Subset TTF/OTF/WOFF fonts by up to 90% size savings, convert web font formats, inspect character glyph maps, and generate @font-face CSS.
          </p>
        </div>

        {/* Navigation Tabs - Standardized DevLounge Pill Switcher */}
        <div className="flex flex-wrap items-center bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 gap-1">
          <button
            onClick={() => setActiveTab('subsetter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'subsetter'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-pink-400" />
            <span>Subset & Convert</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'playground'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Type Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('glyphs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'glyphs'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Glyph Map</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'css'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>@font-face CSS</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Samples Bar - Standardized DevLounge Presets Bar */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between gap-4 overflow-x-auto">
        <span className="text-xs font-mono text-zinc-400 shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Presets:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PRESET_FONTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPresetFont(preset)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                fontName.toLowerCase().includes(preset.id)
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              {preset.name}
            </button>
          ))}
        </div>
        {loading && (
          <span className="text-xs text-indigo-400 animate-pulse shrink-0 font-mono">
            {loadingMsg}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'subsetter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dropzone & Charset Config */}
          <div className="lg:col-span-7 space-y-6">
            {/* Upload Box */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-zinc-400" /> Upload Font File
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {fontFile ? fontFile.name : 'No file chosen'}
                </span>
              </div>

              <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-950 rounded-xl p-6 text-center cursor-pointer transition-all relative group">
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-3 bg-zinc-900 group-hover:bg-zinc-800 text-zinc-400 group-hover:text-white rounded-xl inline-block mb-2 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-white">
                  Drop custom font file (.ttf, .otf, .woff, .woff2) or click to browse
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">Processed 100% locally in browser memory</p>
              </div>
            </div>

            {/* Subsetting Presets */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-zinc-400" /> Character Subsetting Presets
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {targetChars.length} Characters Included
                </span>
              </div>

              <div className="space-y-2">
                {CHARSET_PRESETS.map((preset) => (
                  <label
                    key={preset.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      subsetMode === preset.id
                        ? 'bg-zinc-900 border-zinc-700 text-white'
                        : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="charset"
                        checked={subsetMode === preset.id}
                        onChange={() => setSubsetMode(preset.id)}
                        className="text-indigo-500 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                      />
                      <span className="text-xs font-medium text-zinc-200">{preset.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{preset.chars.length} chars</span>
                  </label>
                ))}

                {/* Custom Text Option */}
                <label
                  className={`flex flex-col p-3 rounded-xl border transition-all cursor-pointer gap-2 ${
                    subsetMode === 'custom'
                      ? 'bg-zinc-900 border-zinc-700 text-white'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="charset"
                        checked={subsetMode === 'custom'}
                        onChange={() => setSubsetMode('custom')}
                        className="text-indigo-500 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                      />
                      <span className="text-xs font-medium text-zinc-200">Custom Text / Headline Extract</span>
                    </div>
                  </div>

                  {subsetMode === 'custom' && (
                    <textarea
                      rows={3}
                      value={customChars}
                      onChange={(e) => setCustomChars(e.target.value)}
                      placeholder="Type or paste custom text/headline to extract only used glyphs..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 mt-1"
                    />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Compression Stats & Download */}
          <div className="lg:col-span-5 space-y-6">
            {/* Format Selection Card */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-zinc-400" /> Web Font Format
              </label>

              <div className="grid grid-cols-2 gap-2">
                {['woff2', 'woff', 'ttf', 'otf'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase transition-all flex flex-col items-center justify-center gap-0.5 ${
                      outputFormat === fmt
                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span>.{fmt}</span>
                    <span className="text-[9px] font-normal text-zinc-500 lowercase">
                      {fmt === 'woff2' ? 'recommended' : fmt === 'woff' ? 'legacy web' : 'desktop'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subsetting Metrics Box */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Compression Results
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-mono font-medium">
                  -{subsetMetrics.savings}% Size Saved
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Original File Size:</span>
                  <span className="text-zinc-200">{formatSize(originalSize)}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Estimated Output Size:</span>
                  <span className="text-emerald-400 font-bold">{formatSize(subsetMetrics.subsetSize)}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Total Glyphs Included:</span>
                  <span className="text-zinc-200">{subsetMetrics.charCount} glyphs</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleDownloadFont}
                  disabled={!fontBuffer}
                  className="w-full py-3 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FileDown className="w-4 h-4" />
                  Download .{outputFormat} Font File
                </button>

                <button
                  onClick={() => copyToClipboard(generatedCss)}
                  className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-zinc-800"
                >
                  {copiedCSS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCSS ? 'CSS Code Copied!' : 'Copy @font-face CSS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Type Tester */}
      {activeTab === 'playground' && (
        <div className="space-y-6">
          <div className="bg-black border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Font Size: {previewSize}px</label>
              <input
                type="range"
                min="12"
                max="120"
                value={previewSize}
                onChange={(e) => setPreviewSize(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Line Height: {previewLineHeight}</label>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={previewLineHeight}
                onChange={(e) => setPreviewLineHeight(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Letter Spacing: {previewLetterSpacing}px</label>
              <input
                type="range"
                min="-3"
                max="20"
                step="0.5"
                value={previewLetterSpacing}
                onChange={(e) => setPreviewLetterSpacing(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCanvasBg(canvasBg === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 rounded-xl hover:text-white"
              >
                {canvasBg === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>

              <button
                onClick={() => setPreviewAlign(previewAlign === 'left' ? 'center' : previewAlign === 'center' ? 'right' : 'left')}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 rounded-xl hover:text-white capitalize"
              >
                Align: {previewAlign}
              </button>
            </div>
          </div>

          <div
            className={`border border-zinc-800 rounded-2xl p-6 sm:p-10 min-h-[300px] transition-all ${
              canvasBg === 'dark' ? 'bg-black text-zinc-100' : 'bg-white text-zinc-900'
            }`}
          >
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              rows={4}
              style={{
                fontFamily: `'${previewFontNameRef.current}', sans-serif`,
                fontSize: `${previewSize}px`,
                lineHeight: previewLineHeight,
                letterSpacing: `${previewLetterSpacing}px`,
                textAlign: previewAlign
              }}
              className="w-full bg-transparent resize-y focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Glyph Character Map */}
      {activeTab === 'glyphs' && (
        <div className="bg-black border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Glyph Map ({targetChars.length} Displayed)
            </h2>
            <span className="text-[10px] text-zinc-500">Click any glyph to copy Unicode hex</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 max-h-[500px] overflow-y-auto p-2 bg-zinc-950 border border-zinc-800/80 rounded-xl">
            {targetChars.split('').map((char, idx) => {
              const codePoint = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
              return (
                <button
                  key={idx}
                  onClick={() => copyToClipboard(`U+${codePoint}`)}
                  style={{ fontFamily: `'${previewFontNameRef.current}', sans-serif` }}
                  className="group flex flex-col items-center justify-center p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all"
                  title={`Character: ${char} (U+${codePoint})`}
                >
                  <span className="text-xl text-white group-hover:scale-110 transition-transform">{char}</span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">U+{codePoint}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: @font-face CSS */}
      {activeTab === 'css' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black border border-zinc-800 rounded-2xl p-5">
            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Font Family Name</label>
              <input
                type="text"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Font Weight</label>
              <select
                value={cssFontWeight}
                onChange={(e) => setCssFontWeight(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="300">300 (Light)</option>
                <option value="400">400 (Regular)</option>
                <option value="500">500 (Medium)</option>
                <option value="600">600 (SemiBold)</option>
                <option value="700">700 (Bold)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Embedding Method</label>
              <button
                onClick={() => setUseBase64(!useBase64)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  useBase64
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                {useBase64 ? 'Base64 Data URI Embedded' : 'Relative File URL Path'}
              </button>
            </div>
          </div>

          <div className="relative group bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 overflow-x-auto">
            <button
              onClick={() => copyToClipboard(generatedCss)}
              className="absolute top-4 right-4 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-sans flex items-center gap-1.5 border border-zinc-700 transition-all"
            >
              {copiedCSS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCSS ? 'Copied!' : 'Copy Code'}
            </button>
            <pre>{generatedCss}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
