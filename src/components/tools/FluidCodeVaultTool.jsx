import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Upload,
  Download,
  Copy,
  Check,
  AlertTriangle,
  History,
  GitCompare,
  PlusCircle,
  Trash2,
  FileCode,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileDown,
  FileUp,
  RefreshCcw,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "devlounge_code_vault_snapshots_v1";

// Demo starter snapshot if empty
const DEMO_SNAPSHOT = {
  id: "demo-snapshot-1",
  fileName: "functions.php",
  versionTag: "v1.0.0-initial",
  notes: "Initial WordPress theme setup backup prior to adding custom header hook",
  timestamp: new Date().toISOString(),
  code: `<?php
// WordPress Theme Setup
function devlounge_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'devlounge'),
    ));
}
add_action('after_setup_theme', 'devlounge_theme_setup');
?>`,
};

export default function FluidCodeVaultTool() {
  const [snapshots, setSnapshots] = useState([]);
  const [fileName, setFileName] = useState("functions.php");
  const [versionTag, setVersionTag] = useState("v1.0.0");
  const [notes, setNotes] = useState("Pre-edit FTP code snapshot");
  const [activeCode, setActiveCode] = useState(DEMO_SNAPSHOT.code);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(null);
  
  // Diff View State
  const [diffOriginalId, setDiffOriginalId] = useState(null);
  const [diffCompareCode, setDiffCompareCode] = useState("");
  const [viewMode, setViewMode] = useState("vault"); // 'vault' | 'diff' | 'ftp-snippet'
  
  // Copy feedback
  const [copiedId, setCopiedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
          setSelectedSnapshotId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load snapshots from LocalStorage:", e);
    }
    // Fallback to demo snapshot
    setSnapshots([DEMO_SNAPSHOT]);
    setSelectedSnapshotId(DEMO_SNAPSHOT.id);
  }, []);

  // Save to localStorage whenever snapshots change
  const saveSnapshotsToStorage = (newSnapshots) => {
    setSnapshots(newSnapshots);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshots));
    } catch (e) {
      console.error("Failed to save snapshots:", e);
    }
  };

  // Handle Save New Snapshot
  const handleSaveSnapshot = () => {
    if (!activeCode.trim()) {
      setStatusMsg("Code content cannot be empty.");
      setTimeout(() => setStatusMsg(""), 3000);
      return;
    }

    const newSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fileName: fileName.trim() || "untitled-code.txt",
      versionTag: versionTag.trim() || `v1.${snapshots.length}`,
      notes: notes.trim() || "Snapshot backup",
      timestamp: new Date().toISOString(),
      code: activeCode,
    };

    const updated = [newSnapshot, ...snapshots];
    saveSnapshotsToStorage(updated);
    setSelectedSnapshotId(newSnapshot.id);
    setStatusMsg("Snapshot safely saved to LocalStorage Vault!");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  // Handle File Upload into active editor
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setActiveCode(evt.target.result || "");
      setStatusMsg(`Loaded ${file.name} into editor.`);
      setTimeout(() => setStatusMsg(""), 3000);
    };
    reader.readAsText(file);
  };

  // Delete Snapshot
  const handleDeleteSnapshot = (id) => {
    const updated = snapshots.filter((s) => s.id !== id);
    saveSnapshotsToStorage(updated);
    if (selectedSnapshotId === id) {
      setSelectedSnapshotId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Selected snapshot details
  const selectedSnapshot = useMemo(() => {
    return snapshots.find((s) => s.id === selectedSnapshotId) || snapshots[0] || null;
  }, [snapshots, selectedSnapshotId]);

  // Compute Diff between Code A (selected snapshot or original) and Code B (active draft or comparison code)
  const diffLines = useMemo(() => {
    const orig = selectedSnapshot ? selectedSnapshot.code : "";
    const comp = diffCompareCode || activeCode;

    const linesA = orig.split("\n");
    const linesB = comp.split("\n");
    const maxLen = Math.max(linesA.length, linesB.length);

    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const lineA = linesA[i];
      const lineB = linesB[i];

      if (lineA === lineB) {
        result.push({ type: "same", lineNum: i + 1, contentA: lineA, contentB: lineB });
      } else {
        if (lineA !== undefined && lineB !== undefined) {
          result.push({ type: "modified", lineNum: i + 1, contentA: lineA, contentB: lineB });
        } else if (lineA !== undefined) {
          result.push({ type: "deleted", lineNum: i + 1, contentA: lineA, contentB: "" });
        } else {
          result.push({ type: "added", lineNum: i + 1, contentA: "", contentB: lineB });
        }
      }
    }
    return result;
  }, [selectedSnapshot, diffCompareCode, activeCode]);

  // Export JSON Vault Backup
  const handleExportVault = () => {
    const blob = new Blob([JSON.stringify(snapshots, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Vault Backup
  const handleImportVault = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          const merged = [...imported, ...snapshots];
          // deduplicate by id
          const unique = merged.filter(
            (v, idx, a) => a.findIndex((t) => t.id === v.id) === idx
          );
          saveSnapshotsToStorage(unique);
          setStatusMsg(`Successfully imported ${imported.length} snapshots!`);
          setTimeout(() => setStatusMsg(""), 3000);
        }
      } catch (err) {
        alert("Invalid JSON vault file format.");
      }
    };
    reader.readAsText(file);
  };

  // Copy helper
  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WordPress FTP Emergency Snippet
  const wpEmergencySnippet = `<?php
/**
 * Emergency Local FTP Pre-Edit Safety Net
 * Add this temporary snippet at the top of your WordPress functions.php
 * It auto-backs up your functions.php to functions.php.bak before editing!
 */
$target_file = __FILE__;
$backup_file = __FILE__ . '.bak';

if (!file_exists($backup_file) || (filemtime($target_file) > filemtime($backup_file))) {
    @copy($target_file, $backup_file);
}
?>`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Beta Tool Banner & Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                BETA TOOL
              </span>
              <h2 className="text-sm font-bold text-amber-200">
                Code Vault & FTP Safety Net (Experimental)
              </h2>
            </div>
            <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
              This tool is currently in active Beta testing and will be fully released in an upcoming suite update. Always verify backups before overwriting production FTP files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleExportVault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-medium transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" /> Export JSON
          </button>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-medium cursor-pointer transition-colors">
            <FileUp className="w-3.5 h-3.5" /> Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportVault}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted LocalStorage Code Backup & Diff Tool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Code Vault <span className="text-zinc-500 font-normal">v0.9 Beta</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Safely snapshot PHP, CSS, JS & HTML files before editing WordPress or live FTP code. Store version history locally with side-by-side code diffs.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 gap-1">
          <button
            onClick={() => setViewMode("vault")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "vault"
                ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vault & Editor</span>
          </button>

          <button
            onClick={() => setViewMode("diff")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "diff"
                ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-sky-400" />
            <span>Diff Inspector</span>
          </button>

          <button
            onClick={() => setViewMode("ftp-snippet")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "ftp-snippet"
                ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>FTP Safety Net</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* VIEW MODE 1: Vault & Editor */}
      {viewMode === "vault" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Code Editor & Snapshot Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Code Snapshot Editor
                  </span>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 mb-1 block">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. functions.php or style.css"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 mb-1 block">
                    Version Tag
                  </label>
                  <input
                    type="text"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                    placeholder="e.g. v1.0-pre-edit"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 mb-1 block">
                  Snapshot Notes / Description
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Saved before updating navigation bar logic"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              {/* Code Area */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                  <span>Code Content ({activeCode.split("\n").length} Lines)</span>
                  <button
                    onClick={() => copyText(activeCode, "activeEditor")}
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedId === "activeEditor" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === "activeEditor" ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={activeCode}
                  onChange={(e) => setActiveCode(e.target.value)}
                  placeholder="Paste or write your PHP, CSS, JS, HTML, or JSON code here..."
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 leading-relaxed resize-y"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveSnapshot}
                  className="flex-1 py-3 px-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Save Snapshot to Local Vault
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Vault Snapshot History (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Vault Snapshots ({snapshots.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  Stored in Browser Memory
                </span>
              </div>

              {snapshots.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center py-6">
                  No snapshots saved yet. Save a snippet above to build version history.
                </p>
              ) : (
                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                  {snapshots.map((snap) => {
                    const isSelected = snap.id === selectedSnapshotId;
                    return (
                      <div
                        key={snap.id}
                        onClick={() => setSelectedSnapshotId(snap.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? "bg-zinc-900 border-zinc-700 text-white shadow-sm"
                            : "bg-black border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white font-mono">
                              {snap.fileName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-emerald-400 font-semibold">
                              {snap.versionTag}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCode(snap.code);
                                setFileName(snap.fileName);
                                setVersionTag(snap.versionTag);
                                setNotes(snap.notes);
                                setStatusMsg(`Restored snapshot ${snap.versionTag} into editor.`);
                                setTimeout(() => setStatusMsg(""), 3000);
                              }}
                              title="Restore code into editor"
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyText(snap.code, snap.id);
                              }}
                              title="Copy snapshot code"
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            >
                              {copiedId === snap.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSnapshot(snap.id);
                              }}
                              title="Delete snapshot"
                              className="p-1 rounded bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {snap.notes}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(snap.timestamp).toLocaleString()}
                          </span>
                          <span>{snap.code.split("\n").length} Lines</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Side-by-Side Diff Inspector */}
      {viewMode === "diff" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-sky-400" /> Code Version Diff Inspector
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Comparing selected snapshot <span className="font-mono text-emerald-400">{selectedSnapshot?.versionTag || "N/A"}</span> against current active draft.
                </p>
              </div>

              {/* Selector for Snapshot to Compare */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Snapshot:</span>
                <select
                  value={selectedSnapshotId || ""}
                  onChange={(e) => setSelectedSnapshotId(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-700"
                >
                  {snapshots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fileName} ({s.versionTag})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diff View Box */}
            <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-12 bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-[11px] text-zinc-400 font-semibold">
                <span className="col-span-1">Line</span>
                <span className="col-span-5 border-r border-zinc-800 pr-2">Original Snapshot Code</span>
                <span className="col-span-6 pl-2">Current Active / Draft Code</span>
              </div>

              {diffLines.map((item, idx) => {
                let bgClass = "hover:bg-zinc-900/50 text-zinc-300";
                if (item.type === "modified") bgClass = "bg-amber-950/30 text-amber-200";
                if (item.type === "added") bgClass = "bg-emerald-950/40 text-emerald-300";
                if (item.type === "deleted") bgClass = "bg-red-950/40 text-red-300";

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 px-4 py-1 border-b border-zinc-900/60 transition-colors ${bgClass}`}
                  >
                    <span className="col-span-1 text-zinc-600 text-[10px] select-none">
                      {item.lineNum}
                    </span>
                    <span className="col-span-5 border-r border-zinc-800/80 pr-2 truncate">
                      {item.contentA || <span className="opacity-20">-</span>}
                    </span>
                    <span className="col-span-6 pl-2 truncate">
                      {item.contentB || <span className="opacity-20">-</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FTP Safety Net Snippet */}
      {viewMode === "ftp-snippet" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" /> WordPress FTP Emergency Safety Net
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Paste this snippet at the top of your theme's <code className="font-mono text-amber-300">functions.php</code> before making live changes over FTP.
                </p>
              </div>

              <button
                onClick={() => copyText(wpEmergencySnippet, "wpEmergency")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors"
              >
                {copiedId === "wpEmergency" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === "wpEmergency" ? "Copied!" : "Copy Snippet"}</span>
              </button>
            </div>

            <pre className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs text-amber-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {wpEmergencySnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
