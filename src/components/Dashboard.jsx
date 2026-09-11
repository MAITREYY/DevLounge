import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Type,
  BoxSelect,
  Image as ImageIcon,
  Video as VideoIcon,
  ShieldCheck,
  Zap,
  Search,
  ArrowRight,
  Layers,
  Check,
  Code,
  AlertTriangle,
  FlaskConical,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Production / Stable tools list
  const stableTools = [
    {
      id: "fluidsvg",
      path: "/fluidsvg",
      name: "Fluid SVG",
      version: "v1.0",
      category: "media",
      isBeta: false,
      subtitle: "SVG Image-to-Code & Code-to-Image Studio",
      renderIcon: () => <Code className="w-5 h-5 text-white" />,
      description:
        "Bi-directional SVG Studio! Convert SVG files to clean React JSX/TSX, Vue 3, Svelte, Base64 & CSS code, or render SVG code to PNG, JPEG & WebP images.",
      tags: [
        "SVG ➔ React JSX / TSX",
        "SVG ➔ Vue & Svelte",
        "Code ➔ PNG / WebP / JPG",
        "SVGO Optimizer",
      ],
    },
    {
      id: "fluidvideo",
      path: "/fluidvideo",
      name: "Video Converter",
      version: "v1.0",
      category: "media",
      isBeta: false,
      subtitle: "Video Converter & Smart Compressor",
      renderIcon: () => <VideoIcon className="w-5 h-5 text-white" />,
      description:
        "Convert MP4, WebM, MOV & AVI videos locally to WebM, MP4 or Animated GIF. Mute audio, tune bitrates, rescale resolutions (1080p/720p/480p), and trim clips.",
      tags: [
        "MP4 ➔ WebM / GIF",
        "Mute / Strip Audio",
        "Target Bitrate Slider",
        "100% Private Browser API",
      ],
    },
    {
      id: "fluidimage",
      path: "/fluidimage",
      name: "Image Converter",
      version: "v1.0",
      category: "media",
      isBeta: false,
      subtitle: "Image Format Converter & Smart Compressor",
      renderIcon: () => <ImageIcon className="w-5 h-5 text-white" />,
      description:
        "Convert PNG, JPEG, WebP, AVIF & BMP images locally with live quality tuning, dimensional scaling, and side-by-side comparison. 100% private.",
      tags: [
        "WebP / AVIF / PNG / JPG",
        "Batch Converter",
        "Quality Slider",
        "100% Private Browser API",
      ],
    },
    {
      id: "fluidclamp",
      path: "/fluidclamp",
      name: "Fluid Clamp",
      version: "v1.2",
      category: "typography",
      isBeta: false,
      subtitle: "Fluid Typography & CSS clamp()",
      renderIcon: () => <Type className="w-5 h-5 text-white" />,
      description:
        "Create minimal, seamless font size scaling across mobile and desktop viewports without media queries using mathematical CSS clamp().",
      tags: [
        "CSS clamp()",
        "PX ➔ REM Converter",
        "Fluid Curve SVG",
        "WCAG 2.1 Audit",
      ],
    },
    {
      id: "fluidbox",
      path: "/fluidbox",
      name: "Fluid Box",
      version: "v1.0",
      category: "container",
      isBeta: false,
      subtitle: "Figma Container & Layout Generator",
      renderIcon: () => <BoxSelect className="w-5 h-5 text-white" />,
      description:
        "Generate perfectly proportioned layout containers for Mobile and PC Figma artboards with controlled side and top/bottom padding.",
      tags: [
        "Figma Artboards",
        "Side & Vertical Pad",
        "Live Device Simulator",
        "Ergonomics Audit",
      ],
    },
  ];

  // Beta / Experimental tools list (smaller compact card layout, positioned at bottom)
  const betaTools = [
    {
      id: "fluidfont",
      path: "/fluidfont",
      name: "Fluid Font Studio",
      version: "BETA",
      category: "media",
      isBeta: true,
      subtitle: "Font Subsetter, Format Converter & Type Tester",
      renderIcon: () => <Type className="w-4 h-4 text-amber-400" />,
      description:
        "Subset TTF/OTF/WOFF2 fonts to reduce payload size by up to 90%. Convert font formats, generate @font-face CSS snippets, and test live typography.",
      tags: ["Font Subsetter (-90%)", "WOFF / WOFF2", "@font-face CSS"],
    },
    {
      id: "fluidtailwind",
      path: "/fluidtailwind",
      name: "Tailwind Extractor",
      version: "BETA",
      category: "container",
      isBeta: true,
      subtitle: "CDN-to-Production CSS Compiler",
      renderIcon: () => <Zap className="w-4 h-4 text-amber-400" />,
      description:
        "Scan 20+ WordPress PHP/HTML files, extract unique utility classes, and compile a minified production CSS bundle instantly.",
      tags: ["Class Extractor", "CDN ➔ CSS", "Multi-File Upload"],
    },
    {
      id: "fluidcodevault",
      path: "/fluidcodevault",
      name: "Code Vault",
      version: "BETA",
      category: "container",
      isBeta: true,
      subtitle: "FTP Code Safety & Version Saver",
      renderIcon: () => <ShieldCheck className="w-4 h-4 text-amber-400" />,
      description:
        "Safely backup PHP, CSS & JS code before editing WordPress files over FTP. Stores version history locally with side-by-side diffs.",
      tags: ["LocalStorage Vault", "Version History", "Side-by-Side Diff"],
    },
  ];

  // Search & Filter matching for Stable tools
  const filteredStableTools = useMemo(() => {
    if (filter === "beta") return [];
    return stableTools.filter((t) => {
      const matchCategory = filter === "all" || filter === "stable" || t.category === filter;
      const matchSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [stableTools, filter, searchQuery]);

  // Search & Filter matching for Beta tools
  const filteredBetaTools = useMemo(() => {
    if (filter === "stable") return [];
    return betaTools.filter((t) => {
      const matchCategory = filter === "all" || filter === "beta" || t.category === filter;
      const matchSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [betaTools, filter, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <header className="text-center space-y-4 max-w-2xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono tracking-wide">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>DevLounge Utility Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          DevLounge <br />
          <span className="text-zinc-400 font-normal">Developer Suite</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Lightweight, zero-dependency developer tools to generate responsive
          typography, screen containers, image optimization, and layout code in
          seconds.
        </p>

        {/* Live Search Bar */}
        <div className="pt-4 relative max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, tag, or keyword (e.g. font, tailwind, vault)..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === "all"
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => setFilter("stable")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === "stable"
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Stable Tools
            </button>
            <button
              onClick={() => setFilter("beta")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                filter === "beta"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-zinc-950 text-amber-400/80 border-amber-500/20 hover:text-amber-300"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              <span>Beta Testing Lab</span>
            </button>
            <button
              onClick={() => setFilter("media")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === "media"
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Media & Images
            </button>
            <button
              onClick={() => setFilter("typography")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === "typography"
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Typography
            </button>
            <button
              onClick={() => setFilter("container")}
              className={`px-3 py-1 rounded-lg border font-medium transition-all ${
                filter === "container"
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Containers & Layout
            </button>
          </div>
        </div>
      </header>

      {/* Production / Stable Tools Section */}
      {filteredStableTools.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Stable Production Tools
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Showing {filteredStableTools.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStableTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-black border border-zinc-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon + Title */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <Link
                        to={tool.path}
                        className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 group-hover:border-zinc-700 transition-colors block"
                      >
                        {tool.renderIcon()}
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                            <Link to={tool.path}>{tool.name}</Link>
                          </h3>
                          <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                            {tool.version}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-zinc-400 mt-0.5">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Production Ready
                  </span>
                  <Link
                    to={tool.path}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-sm"
                  >
                    <span>Launch {tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Beta Tools Section (Positioned at the Bottom with Warning Banner & Compact Cards Layout) */}
      {filteredBetaTools.length > 0 && (
        <section className="pt-6 border-t border-zinc-800/80 space-y-6">
          {/* Prominent Warning & Info Banner for Beta Tools */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Beta & Experimental Lab
                  </span>
                  <span className="text-xs text-amber-300/80 font-mono">
                    Under Active Testing • Full Release Coming Soon
                  </span>
                </div>
                <h3 className="text-base font-bold text-amber-200 tracking-tight mt-0.5">
                  Experimental Developer Tools (Use with Caution)
                </h3>
              </div>
            </div>
            <p className="text-xs text-amber-300/80 leading-relaxed pl-0 sm:pl-12">
              The tools in this section (Fluid Font Studio, Tailwind Extractor, Code Vault) are currently undergoing active beta testing. While fully operational, output data or generated code may occasionally contain edge-case inaccuracies. Please review results before pushing directly to production environments.
            </p>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-400" /> Beta Tools Collection
            </h2>
            <span className="text-xs text-amber-400/80 font-mono">
              Showing {filteredBetaTools.length} compact beta tools
            </span>
          </div>

          {/* Compact / Smaller Card Layout for Beta Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredBetaTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-zinc-950/80 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group transition-all"
              >
                <div className="space-y-3">
                  {/* Top Row: Icon + Title + Beta Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={tool.path}
                        className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors block shrink-0"
                      >
                        {tool.renderIcon()}
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                            <Link to={tool.path}>{tool.name}</Link>
                          </h3>
                          <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold uppercase">
                            BETA
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-0.5 line-clamp-1">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>

                  {/* Micro Feature Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tool.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-[10px] text-zinc-400 mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compact Card Footer Action */}
                <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between">
                  <span className="text-[10px] text-amber-400/80 mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Experimental
                  </span>
                  <Link
                    to={tool.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-sm"
                  >
                    <span>Test Beta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
