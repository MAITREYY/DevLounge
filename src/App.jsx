import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './components/Dashboard';
import FluidClampTool from './components/tools/FluidClampTool';
import FluidBoxTool from './components/tools/FluidBoxTool';
import GlassmorphismTool from './components/tools/GlassmorphismTool';
import CssGridTool from './components/tools/CssGridTool';
import ShadowStudioTool from './components/tools/ShadowStudioTool';

import { Type, Box, Sparkles, Grid, Layers, Sun } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Tools Registry
  const toolsList = [
    {
      id: 'fluidclamp',
      name: 'FluidClamp',
      subtitle: 'Typography & CSS clamp()',
      category: 'typography',
      version: 'v2.0',
      description: 'Create minimal, seamless font size scaling across mobile and desktop viewports without media queries using CSS clamp().',
      tags: ['CSS clamp()', 'PX ➔ REM', 'Fluid Curve SVG', 'Tailwind & Bootstrap', 'WCAG Audit'],
      icon: Type,
      color: 'text-emerald-400',
      glowBg: 'bg-emerald-500',
      borderAccent: 'border-emerald-800/80',
    },
    {
      id: 'fluidbox',
      name: 'FluidBox',
      subtitle: 'Figma Container Generator',
      category: 'container',
      version: 'v2.0',
      description: 'Generate perfectly proportioned layout containers for Mobile and PC Figma artboards with controlled side and vertical padding.',
      tags: ['Figma Artboards', 'Side & Vertical Pad', 'Live Simulator', 'Tailwind & Bootstrap', 'Container Queries'],
      icon: Box,
      color: 'text-amber-400',
      glowBg: 'bg-amber-500',
      borderAccent: 'border-amber-800/80',
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      subtitle: 'Frosted Glass Architect',
      category: 'design',
      version: 'v1.0',
      description: 'Design ultra-smooth frosted glass surfaces with real-time backdrop blur, opacity, and border sheen controls.',
      tags: ['Backdrop Blur', 'Opacity', 'Glass Border Sheen', 'CSS Backdrop Filter'],
      icon: Sparkles,
      color: 'text-blue-400',
      glowBg: 'bg-blue-500',
      borderAccent: 'border-blue-800/80',
    },
    {
      id: 'cssgrid',
      name: 'CSS Grid Architect',
      subtitle: 'Visual Layout Grid Builder',
      category: 'container',
      version: 'v1.0',
      description: 'Drag-and-snap CSS Grid columns, rows, and gap spacing with live interactive preview.',
      tags: ['Grid Template Cols', 'Gap Spacing', 'Tailwind Grid', 'CSS Grid'],
      icon: Grid,
      color: 'text-purple-400',
      glowBg: 'bg-purple-500',
      borderAccent: 'border-purple-800/80',
    },
    {
      id: 'shadowstudio',
      name: 'Box Shadow Studio',
      subtitle: 'Layered Ambient Glow',
      category: 'design',
      version: 'v1.0',
      description: 'Multi-layered realistic elevation shadows and colorful ambient neon glow builder.',
      tags: ['Box Shadow', 'Elevation', 'Neon Glow', 'Blur Radius'],
      icon: Sun,
      color: 'text-emerald-400',
      glowBg: 'bg-emerald-500',
      borderAccent: 'border-emerald-800/80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300 relative">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-emerald-950/20 blur-[150px] pointer-events-none rounded-full"></div>

      {/* Global Header */}
      <Header
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        toolsList={toolsList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-grid-pattern">
        <AnimatePresence mode="wait">
          {activeTool === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard
                toolsList={toolsList}
                setActiveTool={setActiveTool}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </motion.div>
          )}

          {activeTool === 'fluidclamp' && (
            <motion.div
              key="fluidclamp"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <FluidClampTool />
            </motion.div>
          )}

          {activeTool === 'fluidbox' && (
            <motion.div
              key="fluidbox"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <FluidBoxTool />
            </motion.div>
          )}

          {activeTool === 'glassmorphism' && (
            <motion.div
              key="glassmorphism"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <GlassmorphismTool />
            </motion.div>
          )}

          {activeTool === 'cssgrid' && (
            <motion.div
              key="cssgrid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CssGridTool />
            </motion.div>
          )}

          {activeTool === 'shadowstudio' && (
            <motion.div
              key="shadowstudio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ShadowStudioTool />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
