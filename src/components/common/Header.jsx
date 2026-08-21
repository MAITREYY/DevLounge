import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Type, BoxSelect, Layers } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isClamp = location.pathname === '/fluidclamp';
  const isBox = location.pathname === '/fluidbox';

  return (
    <nav className="border-b border-zinc-800/60 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white transition-all duration-200 group-hover:border-zinc-700">
            {isClamp ? (
              <Type className="w-4 h-4 text-white" />
            ) : isBox ? (
              <BoxSelect className="w-4 h-4 text-white" />
            ) : (
              <Layers className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              {isClamp ? 'FluidClamp' : isBox ? 'FluidBox' : 'FluidTools'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mono tracking-wider">
              {isClamp ? 'v1.2' : isBox ? 'v1.0' : 'v1.0'}
            </span>
          </div>
        </Link>

        {/* Minimalist Back Button for Tool Pages */}
        {!isHome && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
            <span>Back</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
