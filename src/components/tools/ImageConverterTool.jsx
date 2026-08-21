import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerCopyConfetti } from '../../utils/helpers';
import { Upload, Download, FileImage, Image as ImageIcon, Sparkles, Sliders, RefreshCw, Check, ArrowRight, Zap, Trash2 } from 'lucide-react';

export default function ImageConverterTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(0.85);
  const [scaleRatio, setScaleRatio] = useState(1);
  
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);

  // Available Output Formats
  const formats = [
    { label: 'WEBP (High Compression)', mime: 'image/webp', ext: 'webp' },
    { label: 'PNG (Lossless & Alpha)', mime: 'image/png', ext: 'png' },
    { label: 'JPG / JPEG (Standard)', mime: 'image/jpeg', ext: 'jpg' },
    { label: 'BMP (Bitmap)', mime: 'image/bmp', ext: 'bmp' },
  ];

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result;
      setImagePreview(imgUrl);
      convertImage(imgUrl, targetFormat, quality, scaleRatio, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Convert Image via Canvas
  const convertImage = (dataUrl, format, imgQuality, scale, fileName) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetWidth = Math.round(img.width * scale);
      const targetHeight = Math.round(img.height * scale);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      
      // If JPG, fill white background to avoid transparent black artifact
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
          }
          setIsProcessing(false);
        },
        format,
        imgQuality
      );
    };
  };

  // Live Settings Update
  const handleFormatChange = (newFormat) => {
    setTargetFormat(newFormat);
    if (imagePreview) {
      convertImage(imagePreview, newFormat, quality, scaleRatio);
    }
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    if (imagePreview) {
      convertImage(imagePreview, targetFormat, newQuality, scaleRatio);
    }
  };

  const handleScaleChange = (newScale) => {
    setScaleRatio(newScale);
    if (imagePreview) {
      convertImage(imagePreview, targetFormat, quality, newScale);
    }
  };

  // Download converted file
  const handleDownload = () => {
    if (!convertedUrl) return;
    const selectedFmtObj = formats.find(f => f.mime === targetFormat);
    const ext = selectedFmtObj ? selectedFmtObj.ext : 'img';
    
    const baseName = selectedFile ? selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) : 'converted-image';
    const downloadName = `${baseName}_converted.${ext}`;

    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerCopyConfetti();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setConvertedUrl(null);
    setOriginalSize(0);
    setConvertedSize(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-950/40 via-zinc-950 to-zinc-950 border border-teal-800/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-800/60 text-xs text-teal-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Universal Client-Side Image Converter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Any-to-Any Format Image Converter
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Convert PNG, JPG, WebP, BMP, and GIF to any modern format with zero quality loss and 100% browser privacy.
          </p>
        </div>

        {convertedUrl && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Converted Image</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Options (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Zone */}
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-400" /> Upload Image File
            </h2>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-800 hover:border-teal-500/60 bg-black/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <FileImage className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Click or drag image to convert</p>
                  <p className="text-[11px] text-zinc-500 font-mono">PNG, JPG, WEBP, GIF, BMP, SVG</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[200px]">{selectedFile?.name}</span>
                  <button
                    onClick={resetImage}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-zinc-900 pt-2">
                  <span>Original Size:</span>
                  <span className="text-teal-400 font-bold">{formatBytes(originalSize)}</span>
                </div>
              </div>
            )}

            {/* Target Format Selector */}
            <div className="space-y-3 border-t border-zinc-800/80 pt-4">
              <span className="text-xs font-semibold text-zinc-300 block">Select Target Output Format</span>
              <div className="grid grid-cols-1 gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.mime}
                    onClick={() => handleFormatChange(fmt.mime)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      targetFormat === fmt.mime
                        ? 'bg-teal-950/60 border-teal-500 text-white font-bold shadow-md'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <span className="text-xs">{fmt.label}</span>
                    <span className="text-[10px] mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-teal-400">
                      .{fmt.ext}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Compression Slider */}
            <div className="space-y-2 border-t border-zinc-800/80 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Compression Quality:</span>
                <span className="mono text-teal-400 font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full cursor-pointer accent-teal-400"
              />
            </div>

            {/* Scale Dimension Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Resolution Scale:</span>
                <span className="mono text-teal-400 font-bold">{scaleRatio}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
                {[0.25, 0.5, 0.75, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleScaleChange(s)}
                    className={`py-1 rounded border text-center transition-all ${
                      scaleRatio === s
                        ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Comparison Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-400" /> Live Preview & Conversion Output
            </h2>

            {/* Side-by-side or Canvas display */}
            <div className="w-full bg-black rounded-2xl border border-zinc-800/90 p-6 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              {convertedUrl ? (
                <div className="space-y-6 w-full flex flex-col items-center">
                  <div className="relative group max-h-72 overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
                    <img
                      src={convertedUrl}
                      alt="Converted Output Preview"
                      className="max-h-72 object-contain rounded-xl"
                    />
                  </div>

                  {/* Size Comparison Card */}
                  <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Original</span>
                      <span className="text-white font-bold">{formatBytes(originalSize)}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-teal-400" />

                    <div>
                      <span className="text-zinc-500 block text-[10px]">Converted</span>
                      <span className="text-teal-400 font-extrabold">{formatBytes(convertedSize)}</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold">
                      {originalSize > 0
                        ? `${Math.round(((originalSize - convertedSize) / originalSize) * 100)}% Saved`
                        : 'Done'}
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full max-w-md py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Converted File</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2 text-zinc-500">
                  <FileImage className="w-12 h-12 mx-auto text-zinc-700 animate-pulse" />
                  <p className="text-xs">Upload an image to start instant conversion</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
