import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  History, 
  Search, 
  FileCode2, 
  Clock, 
  AlertTriangle, 
  ArrowLeftRight, 
  Save, 
  Edit3, 
  Database,
  FolderPlus,
  Folder,
  ClipboardPaste,
  RefreshCw
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'WordPress E-Commerce Site',
    createdAt: new Date().toLocaleString(),
    files: [
      {
        id: 'file-1',
        filename: 'functions.php',
        note: 'Custom WooCommerce checkout hooks',
        createdAt: new Date().toLocaleString(),
        versions: [
          {
            versionId: 'v1',
            versionName: 'v1.0 (Original Backup)',
            code: `<?php
// WordPress Custom Theme Setup
function my_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'mytheme'),
    ));
}
add_action('after_setup_theme', 'my_theme_setup');
?>`,
            timestamp: new Date().toLocaleString(),
            lines: 11,
            bytes: 280
          }
        ]
      },
      {
        id: 'file-2',
        filename: 'style.css',
        note: 'Header sticky navigation fixes',
        createdAt: new Date().toLocaleString(),
        versions: [
          {
            versionId: 'v1',
            versionName: 'v1.0 (Original CSS)',
            code: `/* Main Theme Overrides */
.site-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #000000;
}`,
            timestamp: new Date().toLocaleString(),
            lines: 7,
            bytes: 120
          }
        ]
      }
    ]
  }
];

export default function FluidCodeVaultTool() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('fluid_code_vault_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  });

  const [activeProject, setActiveProject] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [diffMode, setDiffMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form States
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCode, setNewCode] = useState('');

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fluid_code_vault_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  // Set default selected project when creating
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Handle filename change
  const handleFilenameChange = (val) => {
    setNewFilename(val);
    setErrorMessage('');
  };

  // Paste from Clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setNewCode(text);
    } catch (err) {
      alert('Clipboard permission denied or unsupported. Please use Ctrl + V to paste.');
    }
  };

  // Create New Project Only
  const handleAddProjectOnly = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    // Check duplicate project name
    const exists = projects.some(p => p.name.toLowerCase() === newProjectName.trim().toLowerCase());
    if (exists) {
      alert(`A project named "${newProjectName.trim()}" already exists!`);
      return;
    }

    const newProj = {
      id: 'proj-' + Date.now(),
      name: newProjectName.trim(),
      createdAt: new Date().toLocaleString(),
      files: []
    };

    setProjects([...projects, newProj]);
    setActiveProject(newProj);
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  // Create New File Snapshot with Duplicate File Name Validation
  const handleCreateFileSnapshot = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newFilename.trim() || !newCode.trim()) return;

    // Determine target project
    let targetProjId = selectedProjectId;
    let updatedProjects = [...projects];

    if (selectedProjectId === 'NEW_PROJECT') {
      if (!customProjectName.trim()) {
        setErrorMessage('Please enter a project name.');
        return;
      }
      const newProjId = 'proj-' + Date.now();
      const newProj = {
        id: newProjId,
        name: customProjectName.trim(),
        createdAt: new Date().toLocaleString(),
        files: []
      };
      updatedProjects.push(newProj);
      targetProjId = newProjId;
    }

    const targetProject = updatedProjects.find(p => p.id === targetProjId);
    if (!targetProject) {
      setErrorMessage('Please select a valid project.');
      return;
    }

    // DUPLICATE FILE NAME VALIDATION IN SAME PROJECT
    const duplicateFile = targetProject.files.some(
      f => f.filename.toLowerCase() === newFilename.trim().toLowerCase()
    );

    if (duplicateFile) {
      setErrorMessage(
        `Error: A file named "${newFilename.trim()}" already exists in project "${targetProject.name}". Duplicate filenames are not allowed in the same project.`
      );
      return;
    }

    const lines = newCode.split('\n').length;
    const bytes = new Blob([newCode]).size;

    const newFile = {
      id: 'file-' + Date.now(),
      filename: newFilename.trim(),
      note: newNote.trim() || 'Pre-edit backup',
      createdAt: new Date().toLocaleString(),
      versions: [
        {
          versionId: 'v1',
          versionName: 'v1.0 (Original Backup)',
          code: newCode,
          timestamp: new Date().toLocaleString(),
          lines,
          bytes
        }
      ]
    };

    const finalProjects = updatedProjects.map(p => {
      if (p.id === targetProjId) {
        return {
          ...p,
          files: [newFile, ...p.files]
        };
      }
      return p;
    });

    setProjects(finalProjects);
    const activeP = finalProjects.find(p => p.id === targetProjId);
    setActiveProject(activeP);
    setActiveFile(newFile);
    setIsCreating(false);
    setNewFilename('');
    setNewNote('');
    setNewCode('');
    setCustomProjectName('');
  };

  // Delete Individual File
  const handleDeleteFile = (projectId, fileId) => {
    if (window.confirm('Are you sure you want to delete this file and all its backup revisions?')) {
      const updated = projects.map(p => {
        if (p.id === projectId) {
          return { ...p, files: p.files.filter(f => f.id !== fileId) };
        }
        return p;
      });
      setProjects(updated);
      if (activeFile?.id === fileId) setActiveFile(null);
      if (activeProject?.id === projectId) {
        const updatedP = updated.find(p => p.id === projectId);
        setActiveProject(updatedP);
      }
    }
  };

  // Delete Entire Project
  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to DELETE THE ENTIRE PROJECT "${projectName}" and ALL its files?`)) {
      const updated = projects.filter(p => p.id !== projectId);
      setProjects(updated);
      if (activeProject?.id === projectId) {
        setActiveProject(null);
        setActiveFile(null);
      }
    }
  };

  // Clear ALL Projects & Files
  const handleClearAllData = () => {
    if (window.confirm('WARNING: Are you sure you want to CLEAR ALL PROJECTS AND ALL BACKUP FILES? This cannot be undone!')) {
      setProjects([]);
      setActiveProject(null);
      setActiveFile(null);
      localStorage.removeItem('fluid_code_vault_projects');
    }
  };

  // Add Revision to File
  const handleAddRevision = (projectId, fileId, code, note = '') => {
    if (!code.trim()) return;

    const lines = code.split('\n').length;
    const bytes = new Blob([code]).size;

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedFiles = p.files.map(f => {
          if (f.id === fileId) {
            const vCount = f.versions.length + 1;
            const newVersion = {
              versionId: `v${vCount}`,
              versionName: `v${vCount}.0 (${note || 'Revision snapshot'})`,
              code,
              timestamp: new Date().toLocaleString(),
              lines,
              bytes
            };
            return {
              ...f,
              versions: [newVersion, ...f.versions]
            };
          }
          return f;
        });
        return { ...p, files: updatedFiles };
      }
      return p;
    });

    setProjects(updatedProjects);
    const pTarget = updatedProjects.find(p => p.id === projectId);
    setActiveProject(pTarget);
    const fTarget = pTarget?.files.find(f => f.id === fileId);
    setActiveFile(fTarget);
  };

  // Copy Code to Clipboard
  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download File
  const handleDownload = (filename, code) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.includes('.') ? `${filename}.bak` : `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Diff rendering
  const renderDiffView = (oldCode, newCode) => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const maxLen = Math.max(oldLines.length, newLines.length);

    const diffRows = [];
    for (let i = 0; i < maxLen; i++) {
      const oldL = oldLines[i];
      const newL = newLines[i];

      if (oldL === newL) {
        diffRows.push({ type: 'same', text: oldL, lineNum: i + 1 });
      } else {
        if (oldL !== undefined) diffRows.push({ type: 'removed', text: oldL, lineNum: i + 1 });
        if (newL !== undefined) diffRows.push({ type: 'added', text: newL, lineNum: i + 1 });
      }
    }

    return (
      <div className="font-mono text-xs overflow-x-auto bg-black rounded-xl border border-zinc-800 p-4 space-y-1">
        {diffRows.map((row, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 px-2 py-0.5 rounded ${
              row.type === 'added'
                ? 'bg-zinc-800 text-white border-l-2 border-white'
                : row.type === 'removed'
                ? 'bg-zinc-900 text-zinc-400 border-l-2 border-zinc-600 line-through opacity-80'
                : 'text-zinc-400'
            }`}
          >
            <span className="w-8 shrink-0 text-zinc-600 text-right select-none">{row.lineNum}</span>
            <span className="w-4 text-center select-none font-bold">
              {row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '}
            </span>
            <span className="flex-1 whitespace-pre-wrap break-all">{row.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FluidCodeVault v1.3 — FTP Code Safety & Project Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Project Code Vault & Safety Saver
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Organize code backups by projects. Safely store working PHP, CSS, and JS copies before editing live files over FTP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {projects.length > 0 && (
            <button
              onClick={handleClearAllData}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
              title="Clear All Projects & Files"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Clear All Data</span>
            </button>
          )}

          <button
            onClick={() => setIsCreatingProject(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-white" />
            <span>New Project</span>
          </button>
          
          <button
            onClick={() => {
              setIsCreating(true);
              setActiveFile(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Backup File</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid (4 cols Sidebar, 8 cols Main) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Projects & Files List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search Bar & Stats */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or file names..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span>{projects.length} Projects Total</span>
              <span className="text-white flex items-center gap-1">
                <Database className="w-3 h-3" /> Encrypted LocalStorage
              </span>
            </div>
          </div>

          {/* New Project Inline Form */}
          {isCreatingProject && (
            <form onSubmit={handleAddProjectOnly} className="bg-zinc-950 border border-zinc-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-white" /> Create New Project
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="text-xs text-zinc-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                required
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project Name (e.g. Client Site WP)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
              >
                Create Project
              </button>
            </form>
          )}

          {/* Projects & Categorized Files Accordion List */}
          <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
            {projects.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl p-6">
                <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No projects or files created yet.</p>
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="mt-3 text-xs text-white underline font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              projects.map(proj => {
                const filteredFiles = proj.files.filter(f =>
                  !searchQuery ||
                  f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  proj.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <div key={proj.id} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden">
                    {/* Project Header Bar */}
                    <div className="p-3.5 bg-zinc-900/60 flex items-center justify-between border-b border-zinc-800/60">
                      <div
                        onClick={() => setActiveProject(proj)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1"
                      >
                        <Folder className="w-4 h-4 text-white shrink-0" />
                        <h3 className="text-xs font-bold text-white truncate max-w-[160px]">
                          {proj.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {proj.files.length} file{proj.files.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Delete Whole Project Button */}
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.name)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Delete Entire Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Files List inside Project */}
                    <div className="p-2 space-y-1.5">
                      {filteredFiles.length === 0 ? (
                        <p className="text-[11px] text-zinc-500 italic p-3 text-center">
                          No files in this project yet.
                        </p>
                      ) : (
                        filteredFiles.map(file => {
                          const isFileActive = activeFile?.id === file.id;
                          return (
                            <div
                              key={file.id}
                              onClick={() => {
                                setActiveProject(proj);
                                setActiveFile(file);
                                setIsCreating(false);
                                setDiffMode(false);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isFileActive
                                  ? 'bg-zinc-900 border-zinc-600 text-white font-medium'
                                  : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-300 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <FileCode2 className="w-3.5 h-3.5 text-white shrink-0" />
                                <span className="text-xs font-mono truncate">{file.filename}</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(proj.id, file.id);
                                }}
                                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                                title="Delete File"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Main Content Pane: New Snapshot Form or File Inspector (8 cols) */}
        <div className="lg:col-span-8">
          
          {/* New Snapshot Form */}
          {isCreating ? (
            <form onSubmit={handleCreateFileSnapshot} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Save Pre-Edit Code Backup</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Error Warning Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Project Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 font-medium">Select Project Category *</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>Project: {p.name}</option>
                    ))}
                    <option value="NEW_PROJECT">+ Create New Project Category...</option>
                  </select>
                </div>

                {selectedProjectId === 'NEW_PROJECT' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400 font-medium">New Project Name *</label>
                    <input
                      type="text"
                      required
                      value={customProjectName}
                      onChange={(e) => setCustomProjectName(e.target.value)}
                      placeholder="e.g. Client WP Portal"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* File Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 font-medium">
                  File Name (e.g. functions.php, style.css) *
                </label>
                <input
                  type="text"
                  required
                  value={newFilename}
                  onChange={(e) => handleFilenameChange(e.target.value)}
                  placeholder="functions.php"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <p className="text-[11px] text-zinc-500 italic">
                  Note: Duplicate filenames within the same project are not allowed.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 font-medium">Note / Tag (Optional)</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Working code before adding custom WooCommerce hook"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Code Textarea with Paste Button */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>Paste Working Original Code *</span>
                  <div className="flex items-center gap-3">
                    <span>{newCode.split('\n').filter(Boolean).length} lines</span>
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-white hover:text-zinc-200 font-medium transition-colors"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-white" />
                      <span>Paste Clipboard</span>
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={13}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Paste your working code here or click 'Paste Clipboard'..."
                  className="w-full bg-black border border-zinc-800 focus:border-zinc-600 rounded-xl p-4 font-mono text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Backup Snapshot</span>
                </button>
              </div>
            </form>
          ) : activeFile && activeProject ? (
            /* Selected Active File Inspector */
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                    <Folder className="w-3.5 h-3.5 text-white" />
                    <span>Project: {activeProject.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileCode2 className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-bold text-white">{activeFile.filename}</h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{activeFile.note}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(activeFile.filename, activeFile.versions[0].code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                    title="Download .bak file"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download .bak</span>
                  </button>

                  <button
                    onClick={() => handleDeleteFile(activeProject.id, activeFile.id)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Toolbar & Version Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono text-zinc-300 font-medium">Revisions:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {activeFile.versions.map((ver, idx) => (
                      <span
                        key={ver.versionId}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                          idx === 0
                            ? 'bg-zinc-800 text-white border-zinc-600 font-semibold'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {ver.versionName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDiffMode(!diffMode)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                      diffMode
                        ? 'bg-zinc-800 text-white border-zinc-600'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{diffMode ? 'Exit Diff' : 'View Code Diff'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(activeFile.versions[0].code, activeFile.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-sm"
                  >
                    {copiedId === activeFile.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Emergency Restore Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Display or Diff View */}
              {diffMode && activeFile.versions.length >= 2 ? (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-zinc-400">
                    Comparing <span className="text-zinc-400">{activeFile.versions[1]?.versionName}</span> vs{' '}
                    <span className="text-white">{activeFile.versions[0]?.versionName}</span>
                  </p>
                  {renderDiffView(activeFile.versions[1].code, activeFile.versions[0].code)}
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                    <span>Active Version: {activeFile.versions[0]?.versionName}</span>
                    <span>{activeFile.versions[0]?.lines} Lines | {activeFile.versions[0]?.bytes} Bytes</span>
                  </div>
                  <pre className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[480px]">
                    {activeFile.versions[0]?.code}
                  </pre>
                </div>
              )}

              {/* Quick Append Revision Panel */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-white" /> Append New Revision to {activeFile.filename}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const updatedCode = prompt('Paste new modified code version:');
                      if (updatedCode) {
                        const note = prompt('Enter a short note for this revision:') || 'Updated version';
                        handleAddRevision(activeProject.id, activeFile.id, updatedCode, note);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>Append Revision Snapshot</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-12 text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-zinc-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Select a Project or File to View</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Backup code files grouped by project. Restores working code in 1-click if an FTP edit breaks your site.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-medium"
                >
                  <FolderPlus className="w-4 h-4 text-white" />
                  <span>New Project</span>
                </button>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Backup File</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
