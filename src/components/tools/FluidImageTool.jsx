import React, { useState, useRef, useMemo } from 'react';
import { triggerCopyConfetti } from '../../utils/helpers';
import {
  Upload,
  Image as ImageIcon,
  Download,
  Copy,
  Plus,
  Trash2,
  ArrowLeftRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function FluidImageTool() {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);

  // Simple Target Format State
  const [format, setFormat] = useState('image/webp');
  const [splitPos, setSplitPos] = useState(50);
  const [copiedId, setCopiedId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const addMoreRef = useRef(null);

  // Clean, human-readable format choices
  const FORMAT_OPTIONS = [
    { label: 'WebP', value: 'image/webp', ext: 'webp', desc: 'Modern web format' },
    { label: 'JPG', value: 'image/jpeg', ext: 'jpg', desc: 'Universal compatibility' },
    { label: 'PNG', value: 'image/png', ext: 'png', desc: 'Transparent & lossless' },
    { label: 'AVIF', value: 'image/avif', ext: 'avif', desc: 'Next-gen compact' },
  ];

  // Helper to format bytes into clean approx size
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '~0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const rawVal = bytes / Math.pow(k, i);
    const rounded = rawVal >= 10 ? Math.round(rawVal) : parseFloat(rawVal.toFixed(1));
    return `~${rounded} ${sizes[i]}`;
  };

  // Helper to check format browser canvas support
  const isFormatSupported = (mimeType) => {
    try {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      return c.toDataURL(mimeType).startsWith(`data:${mimeType}`);
    } catch (e) {
      return false;
    }
  };

  // Convert image format via HTML5 Canvas
  const processImage = async (fileItem, targetFormat) => {
    return new Promise((resolve) => {
      const img = new Image();
      const origUrl = URL.createObjectURL(fileItem.file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill white background for JPEG (no transparency in JPEG)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality defaults (0.85 for webp/jpeg for optimal conversion fidelity)
        const qVal = 0.85;

        let encodeFormat = targetFormat;
        if (!isFormatSupported(targetFormat)) {
          encodeFormat = isFormatSupported('image/webp') ? 'image/webp' : 'image/jpeg';
        }

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(origUrl);
            if (!blob) {
              canvas.toBlob(
                (fbBlob) => {
                  resolve({
                    compBlob: fbBlob,
                    compUrl: URL.createObjectURL(fbBlob),
                    compSize: fbBlob ? fbBlob.size : fileItem.size,
                  });
                },
                'image/jpeg',
                qVal
              );
              return;
            }
            resolve({
              compBlob: blob,
              compUrl: URL.createObjectURL(blob),
              compSize: blob.size,
            });
          },
          encodeFormat,
          qVal
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(origUrl);
        resolve(null);
      };

      img.src = origUrl;
    });
  };

  // Add Files
  const handleAddFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);

    const newItems = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/') && !file.name.match(/\.(png|jpe?g|webp|avif|bmp|gif)$/i)) continue;

      const previewUrl = URL.createObjectURL(file);
      const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      const item = {
        id,
        file,
        name: file.name,
        origSize: file.size,
        previewUrl,
        compBlob: null,
        compUrl: null,
        compSize: 0,
      };

      const res = await processImage(item, format);
      if (res) {
        item.compBlob = res.compBlob;
        item.compUrl = res.compUrl;
        item.compSize = res.compSize;
      }

      newItems.push(item);
    }

    setFiles((prev) => {
      const updated = [...prev, ...newItems];
      if (updated.length > 0 && !selectedFileId) {
        setSelectedFileId(updated[0].id);
      }
      return updated;
    });

    setIsProcessing(false);
  };

  // Reprocess when target format changes
  const reprocess = async (targetFormat = format) => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updated = await Promise.all(
      files.map(async (item) => {
        if (item.compUrl) URL.revokeObjectURL(item.compUrl);
        const res = await processImage(item, targetFormat);
        if (res) {
          return {
            ...item,
            compBlob: res.compBlob,
            compUrl: res.compUrl,
            compSize: res.compSize,
          };
        }
        return item;
      })
    );

    setFiles(updated);
    setIsProcessing(false);
  };

  // Remove Single File
  const handleRemove = (id) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.compUrl) URL.revokeObjectURL(item.compUrl);
      }
      const next = prev.filter((f) => f.id !== id);
      if (selectedFileId === id) {
        setSelectedFileId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  // Clear All
  const handleClear = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.compUrl) URL.revokeObjectURL(f.compUrl);
    });
    setFiles([]);
    setSelectedFileId(null);
  };

  // Download Single Converted File
  const handleDownloadSingle = (item) => {
    if (!item || !item.compUrl) return;
    const ext = FORMAT_OPTIONS.find((f) => f.value === format)?.ext || 'webp';
    const nameWithoutExt = item.name.replace(/\.[^/.]+$/, '');

    const link = document.createElement('a');
    link.href = item.compUrl;
    link.download = `${nameWithoutExt}_converted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerCopyConfetti();
  };

  // Download All Files
  const handleDownloadAll = () => {
    files.forEach((item, i) => {
      setTimeout(() => handleDownloadSingle(item), i * 200);
    });
  };

  // Copy Image to Clipboard
  const handleCopyClipboard = async (item) => {
    if (!item || !item.compBlob) return;
    try {
      let blobToCopy = item.compBlob;
      if (item.compBlob.type !== 'image/png') {
        const img = new Image();
        const url = URL.createObjectURL(item.compBlob);
        await new Promise((res) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((pngBlob) => {
              blobToCopy = pngBlob;
              URL.revokeObjectURL(url);
              res();
            }, 'image/png');
          };
          img.src = url;
        });
      }

      await navigator.clipboard.write([
        new ClipboardItem({ [blobToCopy.type]: blobToCopy }),
      ]);

      setCopiedId(item.id);
      triggerCopyConfetti();
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Active Selected File
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === selectedFileId) || files[0] || null;
  }, [files, selectedFileId]);

  // Size difference calculation
  const sizeDiffPct = activeFile && activeFile.origSize > 0
    ? Math.round(((activeFile.origSize - activeFile.compSize) / activeFile.origSize) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">FluidImage</h1>
            <p className="text-xs text-zinc-400">Instant Image Format Converter & Size Inspector</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Private (Browser Engine)
        </span>
      </div>

      {/* Main Content */}
      {files.length === 0 ? (
        /* Minimalist Dropzone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleAddFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-black rounded-2xl p-12 text-center cursor-pointer transition-all space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleAddFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Drop images here or <span className="text-white font-semibold underline">browse</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">Convert instantly to WebP, JPG, PNG & AVIF</p>
          </div>
        </div>
      ) : (
        /* 2-Column Minimal Format Converter */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* LEFT COLUMN: Input File & Target Format Choice */}
          <div className="space-y-5">
            {/* Input Card */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Input Image</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={addMoreRef}
                    onChange={(e) => handleAddFiles(e.target.files)}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => addMoreRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Add Images</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Thumbnails Row if multiple files */}
              {files.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {files.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFileId(f.id)}
                      className={`w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0 transition-all ${
                        f.id === activeFile?.id ? 'border-white ring-1 ring-white' : 'border-zinc-800 opacity-60'
                      }`}
                    >
                      <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Active Image Preview & Original Size */}
              {activeFile && (
                <div className="space-y-2">
                  <div className="h-52 bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-center overflow-hidden">
                    <img src={activeFile.previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono px-3.5 py-2.5 bg-zinc-950 rounded-xl border border-zinc-900 text-zinc-400">
                    <span>Approx. Original Size:</span>
                    <span className="text-white font-bold">{formatBytes(activeFile.origSize)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Target Format Selector Box */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block">Convert Format To</span>
              <div className="grid grid-cols-2 gap-2.5">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFormat(opt.value);
                      reprocess(opt.value);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      format === opt.value
                        ? 'bg-zinc-900 border-zinc-600 text-white shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold font-mono">{opt.label}</span>
                      {format === opt.value && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-[11px] text-zinc-500 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Converted Output & Size Comparison */}
          {activeFile && (
            <div className="space-y-5">
              <div className="bg-black border border-zinc-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Converted Image Output</span>
                  {isProcessing && <span className="text-zinc-400 font-mono text-[11px] animate-pulse">Converting...</span>}
                </div>

                {/* Split Slider Preview */}
                <div className="relative h-56 bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden select-none">
                  <img src={activeFile.compUrl || activeFile.previewUrl} alt="Converted" className="absolute inset-0 w-full h-full object-contain" />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${splitPos}%` }}>
                    <img src={activeFile.previewUrl} alt="Original" className="absolute inset-0 max-w-none w-full h-full object-contain" />
                  </div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none" style={{ left: `${splitPos}%` }}>
                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
                      <ArrowLeftRight className="w-3 h-3" />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(parseInt(e.target.value))}
                    className="absolute bottom-2 inset-x-4 w-[calc(100%-2rem)] opacity-40 hover:opacity-100 cursor-pointer"
                  />
                </div>

                {/* Size Comparison Box */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Approx. Before</span>
                      <span className="text-sm font-bold text-zinc-400 font-mono mt-0.5 block">{formatBytes(activeFile.origSize)}</span>
                    </div>

                    <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Approx. After</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{formatBytes(activeFile.compSize)}</span>
                    </div>

                    <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Approx. Change</span>
                      <span className={`text-sm font-bold font-mono mt-0.5 block ${sizeDiffPct >= 0 ? 'text-white' : 'text-zinc-300'}`}>
                        {sizeDiffPct >= 0 ? `-${sizeDiffPct}%` : `+${Math.abs(sizeDiffPct)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleCopyClipboard(activeFile)}
                      className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {copiedId === activeFile.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === activeFile.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadSingle(activeFile)}
                      className="py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Batch Download Button if multiple files */}
                {files.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All Converted ({files.length})</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
