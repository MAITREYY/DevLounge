import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Code, Sparkles, Terminal } from 'lucide-react';
import { triggerCopyConfetti } from '../../utils/helpers';

export default function CodeModal({ isOpen, onClose, codeSnippets, title = "Export Code" }) {
  const [activeTab, setActiveTab] = useState('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = codeSnippets[activeTab] || Object.values(codeSnippets)[0] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    triggerCopyConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'css', label: 'CSS standard' },
    { id: 'tailwind', label: 'Tailwind CSS' },
    { id: 'scss', label: 'SCSS / SASS' },
    { id: 'bootstrap', label: 'Bootstrap 5' },
    { id: 'vars', label: 'CSS Variables' },
  ].filter(tab => codeSnippets[tab.id]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                <Code className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base tracking-tight">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-zinc-900 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-white text-white bg-zinc-900/60'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Viewer Body */}
          <div className="p-6 space-y-4">
            <div className="relative group">
              <pre className="bg-black border border-zinc-800/90 rounded-xl p-4 font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto leading-relaxed shadow-inner max-h-72 select-all">
                <code>{currentSnippet}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" /> Ready for production stylesheets & frameworks
              </span>
              <span>UTF-8 • Clean Output</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
