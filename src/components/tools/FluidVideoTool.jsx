import React, { useState, useRef, useEffect, useMemo } from "react";
import { triggerCopyConfetti } from "../../utils/helpers";
import {
  Upload,
  Video,
  Film,
  VolumeX,
  Volume2,
  Sliders,
  Download,
  Copy,
  Trash2,
  Check,
  Zap,
  ShieldCheck,
  Scissors,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Calculator,
} from "lucide-react";

/**
 * Lightweight Client-Side Animated GIF Encoder
 * Encodes RGBA canvas frames into a valid GIF89a Blob in memory.
 */
class SimpleGifEncoder {
  constructor(width, height, delayMs = 100) {
    this.width = width;
    this.height = height;
    this.delayMs = delayMs;
    this.data = [];
    this.writeHeader();
  }

  writeByte(b) {
    this.data.push(b & 0xff);
  }

  writeShort(s) {
    this.writeByte(s & 0xff);
    this.writeByte((s >> 8) & 0xff);
  }

  writeString(str) {
    for (let i = 0; i < str.length; i++) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  writeHeader() {
    this.writeString("GIF89a");
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x70);
    this.writeByte(0);
    this.writeByte(0);
  }

  addFrame(rgbaPixels) {
    const { palette, indexedPixels } = this.quantizePixels(rgbaPixels);

    this.writeByte(0x21);
    this.writeByte(0xf9);
    this.writeByte(4);
    this.writeByte(0x04);
    const delayUnits = Math.max(1, Math.round(this.delayMs / 10));
    this.writeShort(delayUnits);
    this.writeByte(0);
    this.writeByte(0);

    this.writeByte(0x2c);
    this.writeShort(0);
    this.writeShort(0);
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x87);

    for (let i = 0; i < 256; i++) {
      if (i < palette.length) {
        this.writeByte(palette[i][0]);
        this.writeByte(palette[i][1]);
        this.writeByte(palette[i][2]);
      } else {
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
      }
    }

    this.writeLzw(indexedPixels, 8);
  }

  quantizePixels(rgbaPixels) {
    const pixelCount = this.width * this.height;
    const palette = [];
    const colorMap = new Map();
    const indexedPixels = new Uint8Array(pixelCount);

    for (let i = 0; i < pixelCount; i++) {
      const r = rgbaPixels[i * 4];
      const g = rgbaPixels[i * 4 + 1];
      const b = rgbaPixels[i * 4 + 2];

      const qr = (r >> 3) << 3;
      const qg = (g >> 3) << 3;
      const qb = (b >> 3) << 3;
      const key = (qr << 16) | (qg << 8) | qb;

      let idx = colorMap.get(key);
      if (idx === undefined) {
        if (palette.length < 256) {
          idx = palette.length;
          palette.push([qr, qg, qb]);
          colorMap.set(key, idx);
        } else {
          idx = 0;
          let minDist = Infinity;
          for (let p = 0; p < palette.length; p++) {
            const dr = qr - palette[p][0];
            const dg = qg - palette[p][1];
            const db = qb - palette[p][2];
            const dist = dr * dr + dg * dg + db * db;
            if (dist < minDist) {
              minDist = dist;
              idx = p;
            }
          }
        }
      }
      indexedPixels[i] = idx;
    }

    while (palette.length < 2) {
      palette.push([0, 0, 0]);
    }

    return { palette, indexedPixels };
  }

  writeLzw(indexedPixels, minCodeSize) {
    this.writeByte(minCodeSize);
    const clearCode = 1 << minCodeSize;
    const eofCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let maxCode = (1 << codeSize) - 1;

    const dict = new Map();
    let nextCode = eofCode + 1;

    const resetDict = () => {
      dict.clear();
      codeSize = minCodeSize + 1;
      maxCode = (1 << codeSize) - 1;
      nextCode = eofCode + 1;
    };

    let accum = 0;
    let bits = 0;
    const subBlocks = [];

    const outputCode = (c) => {
      accum |= c << bits;
      bits += codeSize;
      while (bits >= 8) {
        subBlocks.push(accum & 0xff);
        accum >>= 8;
        bits -= 8;
      }
    };

    outputCode(clearCode);

    let prefix = indexedPixels[0];
    for (let i = 1; i < indexedPixels.length; i++) {
      const k = indexedPixels[i];
      const key = (prefix << 16) | k;

      if (dict.has(key)) {
        prefix = dict.get(key);
      } else {
        outputCode(prefix);
        if (nextCode <= 4095) {
          dict.set(key, nextCode++);
          if (nextCode > maxCode && codeSize < 12) {
            codeSize++;
            maxCode = (1 << codeSize) - 1;
          }
        } else {
          outputCode(clearCode);
          resetDict();
        }
        prefix = k;
      }
    }
    outputCode(prefix);
    outputCode(eofCode);

    if (bits > 0) {
      subBlocks.push(accum & 0xff);
    }

    let idx = 0;
    while (idx < subBlocks.length) {
      const len = Math.min(255, subBlocks.length - idx);
      this.writeByte(len);
      for (let i = 0; i < len; i++) {
        this.writeByte(subBlocks[idx + i]);
      }
      idx += len;
    }
    this.writeByte(0);
  }

  finish() {
    this.writeByte(0x3b);
    return new Blob([new Uint8Array(this.data)], { type: "image/gif" });
  }
}

export default function FluidVideoTool() {
  // Video Source File & Metadata
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [meta, setMeta] = useState({
    duration: 0,
    width: 0,
    height: 0,
    size: 0,
    name: "",
    hasAudio: true,
  });

  // Target Format & Audio Toggle
  const [targetFormat, setTargetFormat] = useState("webm"); // 'webm' | 'mp4' | 'gif'
  const [muteAudio, setMuteAudio] = useState(true);

  // Settings State - Default to ORIGINAL native resolution of input video!
  const [resolutionPreset, setResolutionPreset] = useState("original");
  const [targetFps, setTargetFps] = useState(30);
  const [targetBitrateKbps, setTargetBitrateKbps] = useState(2500); // 2.5 Mbps
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // Individual Collapsible Accordion Sections (Closed by default)
  const [openResSection, setOpenResSection] = useState(false);
  const [openBitrateSection, setOpenBitrateSection] = useState(false);
  const [openTrimmerSection, setOpenTrimmerSection] = useState(false);

  // Trimmer Clip Loop Player State
  const [isPreviewingClip, setIsPreviewingClip] = useState(false);

  // Processing & Output State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [outputResult, setOutputResult] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Player & Canvas References
  const sourceVideoRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isConvertingRef = useRef(false);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (outputResult?.url) URL.revokeObjectURL(outputResult.url);
    };
  }, [videoUrl, outputResult]);

  // Format Helper
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const rawVal = bytes / Math.pow(k, i);
    const rounded =
      rawVal >= 10 ? Math.round(rawVal) : parseFloat(rawVal.toFixed(1));
    return `${rounded} ${sizes[i]}`;
  };

  const formatSeconds = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const remainderS = s % 60;
    return `${m}:${remainderS < 10 ? "0" : ""}${remainderS}`;
  };

  // Handle Video Upload
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputResult?.url) URL.revokeObjectURL(outputResult.url);

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setOutputResult(null);

    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration || 0;
      const w = tempVideo.videoWidth || 1920;
      const h = tempVideo.videoHeight || 1080;

      setMeta({
        duration: dur,
        width: w,
        height: h,
        size: file.size,
        name: file.name,
        hasAudio: true,
      });

      // Default to Original Resolution and Full Video Duration
      setResolutionPreset("original");
      setStartTime(0);
      setEndTime(dur);
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Compute Target Dimensions based on Resolution Preset
  const targetDimensions = useMemo(() => {
    if (!meta.width || !meta.height) return { w: 1920, h: 1080 };
    const aspect = meta.width / meta.height;

    switch (resolutionPreset) {
      case "1080p":
        return { w: 1920, h: Math.round(1920 / aspect) };
      case "720p":
        return { w: 1280, h: Math.round(1280 / aspect) };
      case "480p":
        return { w: 854, h: Math.round(854 / aspect) };
      case "360p":
        return { w: 640, h: Math.round(640 / aspect) };
      case "original":
      default:
        return { w: meta.width, h: meta.height };
    }
  }, [resolutionPreset, meta]);

  // Live Dynamic Approx File Size Calculation (Before Conversion)
  const estimatedOutputSize = useMemo(() => {
    if (!meta.duration || !meta.size) return 0;
    const clipDuration = Math.max(0.5, endTime - startTime);

    if (targetFormat === "gif") {
      const pixels = targetDimensions.w * targetDimensions.h;
      const bytesPerFrame = pixels * 0.12;
      return Math.round(bytesPerFrame * targetFps * clipDuration);
    } else {
      let bitrateBits = targetBitrateKbps * 1000;
      if (!muteAudio) bitrateBits += 128000;
      const rawEst = (bitrateBits * clipDuration) / 8;
      if (
        resolutionPreset === "original" &&
        !muteAudio &&
        clipDuration >= meta.duration - 0.5
      ) {
        return Math.min(meta.size, Math.round(rawEst));
      }
      return Math.round(rawEst);
    }
  }, [
    meta,
    targetFormat,
    muteAudio,
    resolutionPreset,
    targetDimensions,
    targetFps,
    targetBitrateKbps,
    startTime,
    endTime,
  ]);

  // Synchronize player position when user scrubs trimmer sliders
  const handleStartSeek = (val) => {
    setStartTime(val);
    if (sourceVideoRef.current) {
      sourceVideoRef.current.currentTime = val;
    }
  };

  const handleEndSeek = (val) => {
    setEndTime(val);
    if (sourceVideoRef.current) {
      sourceVideoRef.current.currentTime = val;
    }
  };

  // Clip Preview Loop Toggle
  const toggleClipLoopPreview = () => {
    const vid = sourceVideoRef.current;
    if (!vid) return;

    if (isPreviewingClip) {
      vid.pause();
      setIsPreviewingClip(false);
    } else {
      vid.currentTime = startTime;
      vid.play();
      setIsPreviewingClip(true);
    }
  };

  // Monitor Video Player Time to loop strictly within clip boundary when previewing
  const handlePlayerTimeUpdate = () => {
    const vid = sourceVideoRef.current;
    if (!vid || !isPreviewingClip) return;

    if (vid.currentTime >= endTime || vid.currentTime < startTime) {
      vid.currentTime = startTime;
    }
  };

  // Video & GIF Conversion Logic
  const handleStartConversion = async () => {
    if (!videoUrl || !hiddenVideoRef.current || !hiddenCanvasRef.current)
      return;

    setIsProcessing(true);
    isConvertingRef.current = true;
    setProgress(0);
    setStatusMessage("Preparing video decoder...");
    setOutputResult(null);

    const vid = hiddenVideoRef.current;
    const canvas = hiddenCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const { w, h } = targetDimensions;
    canvas.width = w;
    canvas.height = h;

    const clipDuration = Math.max(0.5, endTime - startTime);

    if (targetFormat === "gif") {
      setStatusMessage("Sampling frames for GIF animation...");
      const fps = Math.min(30, Math.max(5, targetFps));
      const frameInterval = 1 / fps;
      const totalFrames = Math.max(1, Math.floor(clipDuration * fps));

      const encoder = new SimpleGifEncoder(w, h, Math.round(1000 / fps));
      let frameCount = 0;

      const processNextFrame = () => {
        if (!isConvertingRef.current) return;

        if (frameCount >= totalFrames || vid.currentTime > endTime + 0.1) {
          vid.onseeked = null;
          setStatusMessage("Finalizing GIF color table & LZW compression...");
          const gifBlob = encoder.finish();
          const outUrl = URL.createObjectURL(gifBlob);

          const baseName = meta.name.replace(/\.[^/.]+$/, "");
          setOutputResult({
            url: outUrl,
            size: gifBlob.size,
            format: "gif",
            name: `${baseName}_animated.gif`,
          });

          setIsProcessing(false);
          isConvertingRef.current = false;
          setProgress(100);
          setStatusMessage("GIF Conversion Complete!");
          triggerCopyConfetti();
          return;
        }

        ctx.drawImage(vid, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        encoder.addFrame(imgData.data);

        frameCount++;
        const pct = Math.min(99, Math.round((frameCount / totalFrames) * 100));
        setProgress(pct);
        setStatusMessage(
          `Encoding GIF frame ${frameCount} of ${totalFrames} (${pct}%)...`,
        );

        const nextTime = startTime + frameCount * frameInterval;
        if (nextTime <= endTime) {
          vid.currentTime = nextTime;
        } else {
          vid.currentTime = endTime + 0.2;
        }
      };

      vid.onseeked = () => {
        if (isConvertingRef.current) {
          processNextFrame();
        }
      };

      if (Math.abs(vid.currentTime - startTime) < 0.05) {
        processNextFrame();
      } else {
        vid.currentTime = startTime;
      }
    } else {
      setStatusMessage("Setting up MediaRecorder stream...");

      const mimeCandidates =
        targetFormat === "mp4"
          ? ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=h264"]
          : ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

      let selectedMime =
        mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) ||
        "video/webm";

      const canvasStream = canvas.captureStream(targetFps);
      const recordedChunks = [];

      let combinedStream = canvasStream;
      if (!muteAudio && vid.captureStream) {
        try {
          const origStream = vid.captureStream();
          const audioTrack = origStream.getAudioTracks()[0];
          if (audioTrack) {
            combinedStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              audioTrack,
            ]);
          }
        } catch (err) {
          console.warn(
            "Audio track capturing not supported, using silent stream.",
          );
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: targetBitrateKbps * 1000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: selectedMime });
        const outUrl = URL.createObjectURL(videoBlob);
        const ext =
          targetFormat === "mp4" && selectedMime.includes("mp4")
            ? "mp4"
            : "webm";
        const baseName = meta.name.replace(/\.[^/.]+$/, "");

        setOutputResult({
          url: outUrl,
          size: videoBlob.size,
          format: ext,
          name: `${baseName}_${resolutionPreset}_${muteAudio ? "muted" : "audio"}.${ext}`,
        });

        setIsProcessing(false);
        isConvertingRef.current = false;
        setProgress(100);
        setStatusMessage("Video Conversion Complete!");
        triggerCopyConfetti();
      };

      vid.muted = true;

      const beginRecording = () => {
        if (recorder.state === "inactive") {
          recorder.start(100);
        }
        vid.play();

        const checkProgress = setInterval(() => {
          if (!isConvertingRef.current) {
            clearInterval(checkProgress);
            vid.pause();
            if (recorder.state !== "inactive") recorder.stop();
            return;
          }

          if (!vid.paused && vid.currentTime < endTime) {
            ctx.drawImage(vid, 0, 0, w, h);
            const currentClip = vid.currentTime - startTime;
            const pct = Math.min(
              99,
              Math.round((currentClip / clipDuration) * 100),
            );
            setProgress(pct);
            setStatusMessage(`Rendering & Encoding Video (${pct}%)...`);
          } else {
            clearInterval(checkProgress);
            vid.pause();
            if (recorder.state !== "inactive") {
              recorder.stop();
            }
          }
        }, 1000 / targetFps);
      };

      if (Math.abs(vid.currentTime - startTime) < 0.05) {
        beginRecording();
      } else {
        vid.onseeked = () => {
          vid.onseeked = null;
          beginRecording();
        };
        vid.currentTime = startTime;
      }
    }
  };

  // Copy Result Link
  const handleCopyUrl = () => {
    if (!outputResult?.url) return;
    navigator.clipboard.writeText(outputResult.url);
    setCopiedUrl(true);
    triggerCopyConfetti();
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const isFullVideoTrim =
    startTime === 0 && Math.abs(endTime - meta.duration) < 0.5;

  return (
    <div className="space-y-8">
      {/* Hidden processing elements */}
      <video
        ref={hiddenVideoRef}
        src={videoUrl || ""}
        className="hidden"
        preload="auto"
        muted
        playsInline
        crossOrigin="anonymous"
      />
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              FluidVideo
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mono font-semibold">
              v1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Convert MP4/WebM videos, strip audio tracks, compress file sizes,
            and generate animated GIFs natively in your browser. 100% private.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Local Browser Engine</span>
        </div>
      </div>

      {/* Main Upload / Converter Layout */}
      {!videoFile ? (
        /* Empty Upload State */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950 hover:bg-zinc-900/50 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 group space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
          />
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-zinc-700 transition-all">
            <Upload className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Drag & drop your video file here
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Supports MP4, WebM, MOV, AVI, MKV up to 500MB
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              MP4 ➔ WebM
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Video ➔ GIF
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Mute Audio
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Compress Bitrate
            </span>
          </div>
        </div>
      ) : (
        /* Video Loaded & Controls Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Settings & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* File Overview Header */}
            <div className="bg-black border border-zinc-800 p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <Film className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {meta.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                    <span>{formatBytes(meta.size)}</span>
                    <span>•</span>
                    <span>
                      {meta.width}×{meta.height}
                    </span>
                    <span>•</span>
                    <span>{formatSeconds(meta.duration)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setVideoFile(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Remove File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* 1. UPFRONT FORMAT SELECTION TABS */}
            <div className="bg-black border border-zinc-800 p-5 rounded-2xl space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-emerald-400" /> Target Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTargetFormat("webm")}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    targetFormat === "webm"
                      ? "bg-emerald-950/40 border-emerald-700 text-white shadow-sm"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-bold">WebM</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    Web Optimized
                  </span>
                </button>
                <button
                  onClick={() => setTargetFormat("mp4")}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    targetFormat === "mp4"
                      ? "bg-emerald-950/40 border-emerald-700 text-white shadow-sm"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-bold">MP4</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    Universal H.264
                  </span>
                </button>
                <button
                  onClick={() => setTargetFormat("gif")}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    targetFormat === "gif"
                      ? "bg-emerald-950/40 border-emerald-700 text-white shadow-sm"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-bold">Animated GIF</span>
                  <span className="text-[10px] font-normal text-zinc-400">
                    Looping Image
                  </span>
                </button>
              </div>

              {/* Mute Audio Quick Toggle */}
              {targetFormat !== "gif" && (
                <div className="pt-2 flex items-center justify-between border-t border-zinc-900">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    {muteAudio ? (
                      <VolumeX className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>
                      {muteAudio
                        ? "Audio Muted (Silent Video)"
                        : "Keep Audio Track"}
                    </span>
                  </div>
                  <button
                    onClick={() => setMuteAudio(!muteAudio)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      muteAudio
                        ? "bg-emerald-950/50 border-emerald-700 text-emerald-300"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    {muteAudio ? "Muted" : "Keep Audio"}
                  </button>
                </div>
              )}
            </div>

            {/* INDIVIDUAL COLLAPSIBLE ADVANCED SECTIONS */}

            {/* 2. RESOLUTION & FPS SECTION */}
            <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenResSection(!openResSection)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-950/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />{" "}
                    Resolution & Frame Rate
                  </div>
                  <p className="text-xs font-mono text-zinc-300">
                    {resolutionPreset === "original"
                      ? `Original Native (${meta.width}×{meta.height}px)`
                      : `${resolutionPreset} (${targetDimensions.w}×${targetDimensions.h}px)`}{" "}
                    • {targetFps} FPS
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {openResSection ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {openResSection && (
                <div className="p-5 pt-0 border-t border-zinc-900 space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">
                        Target Resolution
                      </label>
                      <select
                        value={resolutionPreset}
                        onChange={(e) => setResolutionPreset(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="original">
                          Original Native ({meta.width}×{meta.height})
                        </option>
                        <option value="1080p">
                          1080p Full HD (1920px width)
                        </option>
                        <option value="720p">720p HD (1280px width)</option>
                        <option value="480p">480p SD (854px width)</option>
                        <option value="360p">360p Compact (640px width)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">
                        Frame Rate (FPS)
                      </label>
                      <select
                        value={targetFps}
                        onChange={(e) => setTargetFps(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value={60}>60 FPS (Ultra Smooth)</option>
                        <option value={30}>30 FPS (Standard Web)</option>
                        <option value={24}>24 FPS (Cinematic)</option>
                        <option value={15}>15 FPS (Ideal for GIF)</option>
                        <option value={10}>10 FPS (Compact GIF)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. BITRATE & COMPRESSION SECTION (For WebM / MP4) */}
            {targetFormat !== "gif" && (
              <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenBitrateSection(!openBitrateSection)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-950/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Bitrate &
                      Compression
                    </div>
                    <p className="text-xs font-mono text-zinc-300">
                      {targetBitrateKbps >= 1000
                        ? `${(targetBitrateKbps / 1000).toFixed(1)} Mbps`
                        : `${targetBitrateKbps} Kbps`}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {openBitrateSection ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {openBitrateSection && (
                  <div className="p-5 pt-0 border-t border-zinc-900 space-y-4 mt-2">
                    <input
                      type="range"
                      min={250}
                      max={8000}
                      step={250}
                      value={targetBitrateKbps}
                      onChange={(e) =>
                        setTargetBitrateKbps(parseInt(e.target.value))
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <button
                        onClick={() => setTargetBitrateKbps(500)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      >
                        Max Compression (500k)
                      </button>
                      <button
                        onClick={() => setTargetBitrateKbps(2500)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      >
                        Balanced (2.5M)
                      </button>
                      <button
                        onClick={() => setTargetBitrateKbps(5000)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                      >
                        High Quality (5M)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. VIDEO CLIP TRIMMER SECTION */}
            <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenTrimmerSection(!openTrimmerSection)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-950/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400" /> Video
                    Clip Trimmer
                  </div>
                  <p className="text-xs font-mono text-zinc-300">
                    {isFullVideoTrim
                      ? "Full Video Duration"
                      : `Clip: ${formatSeconds(startTime)} ➔ ${formatSeconds(endTime)} (${formatSeconds(endTime - startTime)})`}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {openTrimmerSection ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {openTrimmerSection && (
                <div className="p-5 pt-0 border-t border-zinc-900 space-y-4 mt-2">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Live Player Synchronization:
                    </span>
                    <button
                      onClick={toggleClipLoopPreview}
                      className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-semibold flex items-center gap-1.5 hover:bg-emerald-900/60 transition-colors"
                    >
                      {isPreviewingClip ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isPreviewingClip
                          ? "Pause Clip Loop"
                          : "Play Trimmed Clip"}
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-mono">
                        Start Time: {formatSeconds(startTime)}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, endTime - 0.5)}
                        step={0.5}
                        value={startTime}
                        onChange={(e) =>
                          handleStartSeek(parseFloat(e.target.value))
                        }
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-mono">
                        End Time: {formatSeconds(endTime)}
                      </label>
                      <input
                        type="range"
                        min={startTime + 0.5}
                        max={meta.duration}
                        step={0.5}
                        value={endTime}
                        onChange={(e) =>
                          handleEndSeek(parseFloat(e.target.value))
                        }
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Start Conversion Action Button */}
            <button
              disabled={isProcessing}
              onClick={handleStartConversion}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                isProcessing
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-white hover:bg-zinc-200 text-black shadow-emerald-950/20"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Video... ({progress}%)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Convert & Export Video</span>
                </>
              )}
            </button>

            {/* Live Progress Bar */}
            {isProcessing && (
              <div className="space-y-2 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Player & Live Approximate Size Statistics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Input Video Player */}
            <div className="bg-black border border-zinc-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Video Preview
                  Player
                </h4>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                  {formatSeconds(startTime)} ➔ {formatSeconds(endTime)}
                </span>
              </div>
              <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 relative flex items-center justify-center">
                {videoUrl && (
                  <video
                    ref={sourceVideoRef}
                    src={videoUrl}
                    controls
                    onTimeUpdate={handlePlayerTimeUpdate}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* LIVE DYNAMIC APPROX FILE SIZE ESTIMATOR CARD (BEFORE CONVERSION) */}
            <div className="bg-black border border-zinc-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Live
                  File Size Inspector
                </h4>
                <span className="text-[10px] font-mono text-nowrap px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Pre-Export Est.
                </span>
              </div>

              {/* Side-by-Side Current vs Est. Output Size */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                    Current Size
                  </span>
                  <p className="text-sm font-bold text-white">
                    {formatBytes(meta.size)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                    Est. Output Size
                  </span>
                  <p className="text-sm font-bold text-emerald-400">
                    ~{formatBytes(estimatedOutputSize)}
                  </p>
                </div>
              </div>

              {/* Configuration Badge Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
                <span>
                  Output Format:{" "}
                  <strong className="text-white uppercase">
                    {targetFormat}
                  </strong>
                </span>
                <span>
                  Canvas:{" "}
                  <strong className="text-white">
                    {targetDimensions.w}×{targetDimensions.h}
                  </strong>
                </span>
              </div>
            </div>

            {/* Output Processed Result Card (AFTER CONVERSION) */}
            {outputResult && (
              <div className="bg-black border border-emerald-800/80 p-5 rounded-2xl space-y-5 shadow-xl shadow-emerald-950/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Converted Output Ready
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {outputResult.format}
                  </span>
                </div>

                {/* Converted Output Media Preview */}
                <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 relative flex items-center justify-center">
                  {outputResult.format === "gif" ? (
                    <img
                      src={outputResult.url}
                      alt="Converted GIF"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video
                      src={outputResult.url}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* File Size Savings Statistics */}
                <div className="grid grid-cols-2 gap-3 bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl text-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                      Original Size
                    </span>
                    <p className="text-sm font-bold text-zinc-300">
                      {formatBytes(meta.size)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                      Actual Export Size
                    </span>
                    <p className="text-sm font-bold text-emerald-400">
                      {formatBytes(outputResult.size)}
                    </p>
                  </div>
                </div>

                {/* Bandwidth Savings Badge */}
                {meta.size > outputResult.size && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-0.5">
                    <span className="text-xs text-emerald-300 font-medium">
                      Reduced file size by{" "}
                      <strong className="text-emerald-400 font-bold">
                        {(
                          ((meta.size - outputResult.size) / meta.size) *
                          100
                        ).toFixed(1)}
                        %
                      </strong>
                      !
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <a
                    href={outputResult.url}
                    download={outputResult.name}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {outputResult.name}</span>
                  </a>

                  <button
                    onClick={handleCopyUrl}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {copiedUrl ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>
                      {copiedUrl ? "Blob URL Copied!" : "Copy Media Blob URL"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
