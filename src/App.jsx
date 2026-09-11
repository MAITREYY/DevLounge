import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import QuickToolsSidebar from "./components/common/QuickToolsSidebar";
import Dashboard from "./components/Dashboard";
import FluidClampTool from "./components/tools/FluidClampTool";
import FluidBoxTool from "./components/tools/FluidBoxTool";
import FluidImageTool from "./components/tools/FluidImageTool";
import FluidVideoTool from "./components/tools/FluidVideoTool";
import FluidCodeVaultTool from "./components/tools/FluidCodeVaultTool";
import FluidTailwindTool from "./components/tools/FluidTailwindTool";
import FluidSvgTool from "./components/tools/FluidSvgTool";
import FluidFontTool from "./components/tools/FluidFontTool";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white relative">
      {/* Scroll to Top helper on route change */}
      <ScrollToTop />

      {/* Floating Quick Tools Sidebar Switcher on right edge */}
      <QuickToolsSidebar />

      {/* Subtle Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-zinc-800/15 blur-[140px] pointer-events-none rounded-full"></div>

      {/* Global Minimalist Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-grid-pattern">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fluidfont" element={<FluidFontTool />} />
          <Route path="/font-converter" element={<FluidFontTool />} />
          <Route path="/font-subsetter" element={<FluidFontTool />} />
          <Route path="/fluidsvg" element={<FluidSvgTool />} />
          <Route path="/svg-converter" element={<FluidSvgTool />} />
          <Route path="/fluidclamp" element={<FluidClampTool />} />
          <Route path="/fluid-clamp" element={<FluidClampTool />} />
          <Route path="/fluidbox" element={<FluidBoxTool />} />
          <Route path="/fluid-box" element={<FluidBoxTool />} />
          <Route path="/fluidimage" element={<FluidImageTool />} />
          <Route path="/image-converter" element={<FluidImageTool />} />
          <Route path="/fluidvideo" element={<FluidVideoTool />} />
          <Route path="/video-converter" element={<FluidVideoTool />} />
          <Route path="/fluidcodevault" element={<FluidCodeVaultTool />} />
          <Route path="/code-vault" element={<FluidCodeVaultTool />} />
          <Route path="/fluidtailwind" element={<FluidTailwindTool />} />
          <Route path="/tailwind-extractor" element={<FluidTailwindTool />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
}
