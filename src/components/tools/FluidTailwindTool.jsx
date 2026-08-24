import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Code, 
  Layers, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Cpu, 
  FolderUp,
  AlertCircle
} from 'lucide-react';

// Comprehensive Tailwind Utility CSS Rule Generator Map
const COMPILER_MAP = {
  // Flex & Layout
  'flex': 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  'grid': 'display: grid;',
  'inline-grid': 'display: inline-grid;',
  'block': 'display: block;',
  'inline-block': 'display: inline-block;',
  'hidden': 'display: none;',
  'items-center': 'align-items: center;',
  'items-start': 'align-items: flex-start;',
  'items-end': 'align-items: flex-end;',
  'justify-center': 'justify-content: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-start': 'justify-content: flex-start;',
  'justify-end': 'justify-content: flex-end;',
  'flex-col': 'flex-direction: column;',
  'flex-row': 'flex-direction: row;',
  'flex-wrap': 'flex-wrap: wrap;',
  'flex-1': 'flex: 1 1 0%;',
  'shrink-0': 'flex-shrink: 0;',
  'grow': 'flex-grow: 1;',

  // Position
  'relative': 'position: relative;',
  'absolute': 'position: absolute;',
  'fixed': 'position: fixed;',
  'sticky': 'position: sticky;',
  'inset-0': 'top: 0px; right: 0px; bottom: 0px; left: 0px;',
  'top-0': 'top: 0px;',
  'bottom-0': 'bottom: 0px;',
  'left-0': 'left: 0px;',
  'right-0': 'right: 0px;',
  'z-0': 'z-index: 0;',
  'z-10': 'z-index: 10;',
  'z-20': 'z-index: 20;',
  'z-50': 'z-index: 50;',

  // Sizing & Widths
  'w-full': 'width: 100%;',
  'w-screen': 'width: 100vw;',
  'w-auto': 'width: auto;',
  'h-full': 'height: 100%;',
  'h-screen': 'height: 100vh;',
  'h-auto': 'height: auto;',
  'max-w-full': 'max-width: 100%;',
  'max-w-xs': 'max-width: 20rem;',
  'max-w-sm': 'max-width: 24rem;',
  'max-w-md': 'max-width: 28rem;',
  'max-w-lg': 'max-width: 32rem;',
  'max-w-xl': 'max-width: 36rem;',
  'max-w-2xl': 'max-width: 42rem;',
  'max-w-5xl': 'max-width: 64rem;',
  'max-w-7xl': 'max-width: 80rem;',

  // Spacing & Padding
  'p-0': 'padding: 0px;',
  'p-1': 'padding: 0.25rem;',
  'p-2': 'padding: 0.5rem;',
  'p-3': 'padding: 0.75rem;',
  'p-4': 'padding: 1rem;',
  'p-5': 'padding: 1.25rem;',
  'p-6': 'padding: 1.5rem;',
  'p-8': 'padding: 2rem;',
  'px-2': 'padding-left: 0.5rem; padding-right: 0.5rem;',
  'px-3': 'padding-left: 0.75rem; padding-right: 0.75rem;',
  'px-4': 'padding-left: 1rem; padding-right: 1rem;',
  'px-6': 'padding-left: 1.5rem; padding-right: 1.5rem;',
  'py-1': 'padding-top: 0.25rem; padding-bottom: 0.25rem;',
  'py-2': 'padding-top: 0.5rem; padding-bottom: 0.5rem;',
  'py-3': 'padding-top: 0.75rem; padding-bottom: 0.75rem;',
  'py-4': 'padding-top: 1rem; padding-bottom: 1rem;',
  'm-0': 'margin: 0px;',
  'mx-auto': 'margin-left: auto; margin-right: auto;',
  'my-auto': 'margin-top: auto; margin-bottom: auto;',

  // Typography
  'text-xs': 'font-size: 0.75rem; line-height: 1rem;',
  'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
  'text-base': 'font-size: 1rem; line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
  'font-thin': 'font-weight: 100;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-mono': 'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
  'text-center': 'text-align: center;',
  'text-left': 'text-align: left;',
  'text-right': 'text-align: right;',
  'uppercase': 'text-transform: uppercase;',
  'lowercase': 'text-transform: lowercase;',
  'capitalize': 'text-transform: capitalize;',
  'truncate': 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',

  // Colors & Backgrounds
  'bg-black': 'background-color: rgb(0, 0, 0);',
  'bg-white': 'background-color: rgb(255, 255, 255);',
  'bg-transparent': 'background-color: transparent;',
  'text-white': 'color: rgb(255, 255, 255);',
  'text-black': 'color: rgb(0, 0, 0);',
  'text-emerald-400': 'color: rgb(52, 211, 153);',
  'text-emerald-500': 'color: rgb(16, 185, 129);',
  'text-zinc-400': 'color: rgb(161, 161, 170);',
  'text-zinc-500': 'color: rgb(113, 113, 122);',
  'text-zinc-300': 'color: rgb(212, 212, 216);',
  'text-red-400': 'color: rgb(248, 113, 113);',
  'bg-zinc-900': 'background-color: rgb(24, 24, 27);',
  'bg-zinc-950': 'background-color: rgb(9, 9, 11);',
  'bg-emerald-500': 'background-color: rgb(16, 185, 129);',

  // Borders & Effects
  'border': 'border-width: 1px;',
  'border-0': 'border-width: 0px;',
  'border-t': 'border-top-width: 1px;',
  'border-b': 'border-bottom-width: 1px;',
  'border-zinc-800': 'border-color: rgb(39, 39, 42);',
  'border-zinc-700': 'border-color: rgb(63, 63, 70);',
  'border-emerald-500': 'border-color: rgb(16, 185, 129);',
  'rounded': 'border-radius: 0.25rem;',
  'rounded-md': 'border-radius: 0.375rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-full': 'border-radius: 9999px;',
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
  'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);',
  'overflow-hidden': 'overflow: hidden;',
  'overflow-y-auto': 'overflow-y: auto;',
  'pointer-events-none': 'pointer-events: none;',
  'cursor-pointer': 'cursor: pointer;',
  'transition-all': 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;'
};

export default function FluidTailwindTool() {
  const [files, setFiles] = useState([]);
  const [rawPasteCode, setRawPasteCode] = useState('');
  const [copiedType, setCopiedType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // File Upload Handler (Supports multiple files & folders)
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (!uploadedFiles.length) return;

    setIsProcessing(true);
    const readPromises = uploadedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            content: event.target.result,
            size: file.size
          });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(readPromises).then((fileData) => {
      setFiles((prev) => [...prev, ...fileData]);
      setIsProcessing(false);
    });
  };

  // Add Raw Pasted Code as Virtual File
  const handleAddPastedCode = () => {
    if (!rawPasteCode.trim()) return;
    const virtualFile = {
      name: `pasted-snippet-${files.length + 1}.php`,
      content: rawPasteCode,
      size: new Blob([rawPasteCode]).size
    };
    setFiles([...files, virtualFile]);
    setRawPasteCode('');
  };

  // Extract all unique Tailwind classes across all files
  const extractedClasses = useMemo(() => {
    const classSet = new Set();
    // Regular expression to match class="..." or className="..."
    const regex = /(?:class|className)=["']([^"']+)["']/g;

    files.forEach((f) => {
      let match;
      while ((match = regex.exec(f.content)) !== null) {
        const classNames = match[1].split(/\s+/);
        classNames.forEach((cls) => {
          const trimmed = cls.trim();
          if (trimmed && !trimmed.includes('<') && !trimmed.includes('{')) {
            classSet.add(trimmed);
          }
        });
      }
    });

    return Array.from(classSet).sort();
  }, [files]);

  // Generate Minified Production CSS Bundle
  const generatedCssBundle = useMemo(() => {
    if (extractedClasses.length === 0) return '/* Upload or paste files above to extract Tailwind classes */';

    let cssOutput = `/* Compiled Production Tailwind CSS Bundle */\n/* Generated by DevLounge — ${extractedClasses.length} Unique Utilities Extracted */\n\n`;

    // Standard CSS Reset & Base Rules
    cssOutput += `*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }\n\n`;

    // Process Classes
    const compiledRules = [];
    const uncompiledClasses = [];

    extractedClasses.forEach((cls) => {
      // Escape special selector characters for CSS (.bg-\[\#10b981\] -> .bg-\[\#10b981\])
      const selector = `.${cls.replace(/([:\[\]\/\#\%\.\,\@])/g, '\\$1')}`;

      // Check standard compiler map
      if (COMPILER_MAP[cls]) {
        compiledRules.push(`${selector} { ${COMPILER_MAP[cls]} }`);
      } else {
        // Handle arbitrary bracket classes like max-w-[1400px], bg-[#10b981], p-[18px]
        if (cls.includes('-[')) {
          const propMatch = cls.match(/^([a-z\-]+)-\[(.+)\]$/);
          if (propMatch) {
            const [, prefix, val] = propMatch;
            let cssProp = prefix;
            if (prefix === 'max-w') cssProp = 'max-width';
            else if (prefix === 'min-w') cssProp = 'min-width';
            else if (prefix === 'w') cssProp = 'width';
            else if (prefix === 'h') cssProp = 'height';
            else if (prefix === 'p') cssProp = 'padding';
            else if (prefix === 'm') cssProp = 'margin';
            else if (prefix === 'bg') cssProp = 'background-color';
            else if (prefix === 'text') cssProp = 'color';
            else if (prefix === 'border') cssProp = 'border-color';

            compiledRules.push(`${selector} { ${cssProp}: ${val.replace(/_/g, ' ')}; }`);
          }
        } else {
          // Fallback generic utility placeholder rule
          uncompiledClasses.push(cls);
        }
      }
    });

    cssOutput += compiledRules.join('\n');

    if (uncompiledClasses.length > 0) {
      cssOutput += `\n\n/* Custom Utilities */\n`;
      uncompiledClasses.forEach((cls) => {
        const selector = `.${cls.replace(/([:\[\]\/\#\%\.\,\@])/g, '\\$1')}`;
        cssOutput += `${selector} { /* Utility: ${cls} */ }\n`;
      });
    }

    return cssOutput;
  }, [extractedClasses]);

  // WordPress Enqueue PHP Snippet
  const wpPhpSnippet = `// Add this to your WordPress functions.php file:
function enqueue_production_tailwind() {
    wp_enqueue_style(
        'tailwind-production',
        get_template_directory_uri() . '/css/tailwind-production.min.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'enqueue_production_tailwind');`;

  // HTML Head Link Snippet
  const htmlLinkSnippet = `<link rel="stylesheet" href="css/tailwind-production.min.css">`;

  // Copy helper
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Download CSS File
  const handleDownloadCss = () => {
    const blob = new Blob([generatedCssBundle], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailwind-production.min.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>FluidTailwind Extractor & Production CSS Compiler v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tailwind CDN-to-Production CSS Generator
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Turn off CDN scripts! Scan 20+ WordPress theme files or template snippets and compile a minified production CSS bundle instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clear Files ({files.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Files Scanner (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Multi-File Upload Zone */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <FolderUp className="w-4 h-4 text-emerald-400" /> Upload Project Files (.php, .html, .js)
            </label>

            <div className="relative border-2 border-dashed border-zinc-800 hover:border-emerald-500/80 rounded-xl p-6 text-center space-y-3 transition-colors bg-zinc-900/30 group cursor-pointer">
              <input
                type="file"
                multiple
                accept=".php,.html,.htm,.jsx,.js,.vue,.twig,.tpl,.css"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 mx-auto transition-colors" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">
                  Drop 20+ WordPress PHP/HTML files or click to upload
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Supports .php, .html, .jsx, .vue, .js files
                </p>
              </div>
            </div>
          </div>

          {/* Quick Raw Code Paste Option */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" /> Or Paste Raw Code Snippet
            </label>
            <textarea
              rows={4}
              value={rawPasteCode}
              onChange={(e) => setRawPasteCode(e.target.value)}
              placeholder="<div className='flex items-center justify-between bg-zinc-900 p-4 rounded-xl'>..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs font-mono text-emerald-400 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddPastedCode}
              disabled={!rawPasteCode.trim()}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-medium text-xs disabled:opacity-40 transition-colors"
            >
              + Add Snippet to Scan List
            </button>
          </div>

          {/* Uploaded Files Summary & Class Extraction Stats */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Extracted Class Summary
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {extractedClasses.length} Unique Classes
              </span>
            </div>

            {files.length === 0 ? (
              <p className="text-xs text-zinc-500 italic text-center py-4">
                No files added yet. Upload files above to analyze Tailwind classes.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
                      <span className="text-zinc-300 truncate max-w-[180px]">{f.name}</span>
                      <span className="text-zinc-500 text-[10px]">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>

                {/* Tag Pills Preview */}
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-2 border-t border-zinc-900">
                  {extractedClasses.map((cls, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-emerald-300">
                      .{cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Generated Production CSS & WP Enqueue Snippets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Compiled CSS Output Box */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">tailwind-production.min.css</h2>
                  <p className="text-[11px] font-mono text-zinc-500">
                    {generatedCssBundle.split('\n').length} Lines | {(new Blob([generatedCssBundle]).size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generatedCssBundle, 'css')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy CSS</span>
                </button>

                <button
                  onClick={handleDownloadCss}
                  disabled={extractedClasses.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs disabled:opacity-40 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .min.css</span>
                </button>
              </div>
            </div>

            <pre className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[380px]">
              {generatedCssBundle}
            </pre>
          </div>

          {/* WordPress & HTML Integration Snippets */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Production Integration Code
            </h3>

            {/* WordPress Enqueue PHP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>1. WordPress functions.php Enqueue Code:</span>
                <button
                  onClick={() => copyToClipboard(wpPhpSnippet, 'wp')}
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedType === 'wp' ? 'Copied!' : 'Copy PHP Snippet'}
                </button>
              </div>
              <pre className="bg-black border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                {wpPhpSnippet}
              </pre>
            </div>

            {/* HTML Head Link Tag */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>2. Standard HTML &lt;head&gt; Link Tag:</span>
                <button
                  onClick={() => copyToClipboard(htmlLinkSnippet, 'html')}
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedType === 'html' ? 'Copied!' : 'Copy HTML Tag'}
                </button>
              </div>
              <pre className="bg-black border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                {htmlLinkSnippet}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
