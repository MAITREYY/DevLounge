import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Code,
  Video as VideoIcon,
  Image as ImageIcon,
  Type,
  BoxSelect,
  Zap,
  ShieldCheck,
  ChevronLeft,
  Layers,
  Search,
  Check,
  FlaskConical,
  Home,
  X,
} from "lucide-react";

const ALL_TOOLS = [
  {
    id: "fluidsvg",
    path: "/fluidsvg",
    altPaths: ["/svg-converter"],
    name: "Fluid SVG",
    version: "v1.0",
    category: "media",
    isBeta: false,
    renderIcon: () => <Code className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: "fluidvideo",
    path: "/fluidvideo",
    altPaths: ["/video-converter"],
    name: "Video Converter",
    version: "v1.0",
    category: "media",
    isBeta: false,
    renderIcon: () => <VideoIcon className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "fluidimage",
    path: "/fluidimage",
    altPaths: ["/image-converter"],
    name: "Image Converter",
    version: "v1.0",
    category: "media",
    isBeta: false,
    renderIcon: () => <ImageIcon className="w-4 h-4 text-indigo-400" />,
  },
  {
    id: "fluidclamp",
    path: "/fluidclamp",
    altPaths: ["/fluid-clamp"],
    name: "Fluid Clamp",
    version: "v1.2",
    category: "typography",
    isBeta: false,
    renderIcon: () => <Type className="w-4 h-4 text-pink-400" />,
  },
  {
    id: "fluidbox",
    path: "/fluidbox",
    altPaths: ["/fluid-box"],
    name: "Fluid Box",
    version: "v1.0",
    category: "container",
    isBeta: false,
    renderIcon: () => <BoxSelect className="w-4 h-4 text-purple-400" />,
  },
  {
    id: "fluidfont",
    path: "/fluidfont",
    altPaths: ["/font-converter", "/font-subsetter"],
    name: "Fluid Font Studio",
    version: "BETA",
    category: "media",
    isBeta: true,
    renderIcon: () => <Type className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "fluidtailwind",
    path: "/fluidtailwind",
    altPaths: ["/tailwind-extractor"],
    name: "Tailwind Extractor",
    version: "BETA",
    category: "container",
    isBeta: true,
    renderIcon: () => <Zap className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "fluidcodevault",
    path: "/fluidcodevault",
    altPaths: ["/code-vault"],
    name: "Code Vault",
    version: "BETA",
    category: "container",
    isBeta: true,
    renderIcon: () => <ShieldCheck className="w-4 h-4 text-amber-400" />,
  },
];

export default function QuickToolsSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isHome = location.pathname === "/";

  // Auto-collapse sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (isHome) return null; // Only show on single tool pages

  const filteredTools = ALL_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stableTools = filteredTools.filter((t) => !t.isBeta);
  const betaTools = filteredTools.filter((t) => t.isBeta);

  const isCurrentTool = (tool) => {
    return (
      location.pathname === tool.path ||
      (tool.altPaths && tool.altPaths.includes(location.pathname))
    );
  };

  const portalContent = (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[99999] flex items-center group font-sans"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Sticky Collapsed Label Trigger Pill attached to extreme right screen edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 py-3.5 px-2.5 rounded-l-2xl border-l border-y border-zinc-800 bg-zinc-950/95 text-zinc-300 hover:text-white shadow-2xl transition-all duration-300 ${
          isOpen ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        }`}
        title="Hover or click to switch tools"
      >
        <ChevronLeft className="w-4 h-4 text-amber-400 animate-pulse" />
        <div className="flex flex-col items-center gap-1 font-mono text-[10px] tracking-wider uppercase writing-mode-vertical">
          <span className="text-white font-bold">Tools</span>
          <span className="text-zinc-500">Switch</span>
        </div>
        <Layers className="w-4 h-4 text-zinc-400" />
      </button>

      {/* Expanded Quick Sidebar Drawer attached flush right */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 w-80 bg-zinc-950/98 backdrop-blur-2xl border-l border-y border-zinc-800/90 rounded-l-2xl p-4 shadow-2xl transition-all duration-300 transform ease-out max-h-[90vh] flex flex-col justify-between ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Header & Close */}
        <div className="space-y-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight">Quick Tools Switcher</h3>
                <p className="text-[10px] font-mono text-zinc-500">Switch tools instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tools List (Scrollable) */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1 pr-1 font-mono text-xs">
          {/* Stable Tools Section */}
          {stableTools.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 block">
                Stable Tools
              </span>
              <div className="space-y-1">
                {stableTools.map((tool) => {
                  const active = isCurrentTool(tool);
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        active
                          ? "bg-zinc-800 border-zinc-700 text-white shadow-sm font-semibold"
                          : "bg-black/60 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                          {tool.renderIcon()}
                        </div>
                        <span className="truncate max-w-[140px]">{tool.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {tool.version}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Beta Tools Section */}
          {betaTools.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider px-2 flex items-center gap-1">
                <FlaskConical className="w-3 h-3 text-amber-400" /> Beta Tools
              </span>
              <div className="space-y-1">
                {betaTools.map((tool) => {
                  const active = isCurrentTool(tool);
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        active
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-sm font-semibold"
                          : "bg-black/60 border-amber-500/20 hover:border-amber-500/40 text-zinc-400 hover:text-amber-200 hover:bg-amber-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-950 border border-amber-500/30">
                          {tool.renderIcon()}
                        </div>
                        <span className="truncate max-w-[140px]">{tool.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                          BETA
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Home Shortcut */}
        <div className="pt-3 border-t border-zinc-800/80">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(portalContent, document.body);
}
