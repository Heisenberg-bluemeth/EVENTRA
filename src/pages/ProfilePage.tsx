import React from 'react';
import { User, MapPin, Ticket, Heart, Box, Shield, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventra } from '../context/EventraContext';
import { StorageService } from '../services/storageService';
import { CITIES_LIST } from '../data/events';

export const ProfilePage: React.FC = () => {
  const { selectedCity, setSelectedCity, wishlist, bookings, is3DEnabled, toggle3DEnabled, refreshData } = useEventra();

  const handleClearData = () => {
    if (window.confirm('Clear all demo tickets and wishlists from your browser?')) {
      StorageService.clearAllDemoData();
      refreshData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex items-center gap-5 p-6 rounded-3xl bg-midnight-900 border border-midnight-700 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-cyan via-electric-500 to-electric-700 p-0.5 shadow-glow-violet flex-shrink-0">
          <div className="w-full h-full bg-midnight-950 rounded-[14px] flex items-center justify-center font-display font-bold text-cyber-cyan text-xl">
            EP
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-white">Guest Passholder</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-electric-500/20 text-electric-300 border border-electric-500/40">
              Demo Account
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400">demo.passholder@eventra.universe</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-midnight-900 border border-midnight-800">
          <span className="text-slate-400 block text-[10px]">ACTIVE TICKETS</span>
          <span className="text-cyber-cyan font-bold text-xl">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-midnight-900 border border-midnight-800">
          <span className="text-slate-400 block text-[10px]">SAVED EXPERIENCES</span>
          <span className="text-rose-400 font-bold text-xl">{wishlist.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-midnight-900 border border-midnight-800">
          <span className="text-slate-400 block text-[10px]">SELECTED CITY</span>
          <span className="text-white font-bold text-sm truncate block">{selectedCity}</span>
        </div>
        <div className="p-4 rounded-2xl bg-midnight-900 border border-midnight-800">
          <span className="text-slate-400 block text-[10px]">GRAPHICS ENGINE</span>
          <span className="text-electric-400 font-bold text-sm block">
            {is3DEnabled ? '3D WebGL' : '2D Fast'}
          </span>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-midnight-900 border border-midnight-700 space-y-6">
        <h3 className="font-display font-bold text-lg text-white">Experience Preferences</h3>

        <div className="space-y-4 text-xs font-mono">
          {/* Default City */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-midnight-800">
            <div>
              <span className="text-white font-bold block">Primary City Hub</span>
              <span className="text-slate-400 text-[11px]">Filter events automatically by your home city</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-xs font-mono"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 3D Engine Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-midnight-800">
            <div>
              <span className="text-white font-bold block">Spatial 3D Graphics Engine</span>
              <span className="text-slate-400 text-[11px]">
                Toggle between WebGL 3D immersion and lightweight 2D performance mode
              </span>
            </div>
            <button
              onClick={toggle3DEnabled}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                is3DEnabled
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan'
                  : 'bg-midnight-950 border-midnight-700 text-slate-400'
              }`}
            >
              {is3DEnabled ? '3D Active' : '2D Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Local Storage Privacy Notice & Reset */}
      <div className="p-6 rounded-3xl bg-midnight-950 border border-midnight-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Shield className="w-4 h-4" />
          <span>Local Storage Privacy</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          EVENTRA does not require real user authentication or remote tracking. Your simulated passes, wishlist, and interface preferences reside solely inside your browser’s `localStorage`.
        </p>
        <button
          onClick={handleClearData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 text-rose-300 text-xs font-mono transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Local Demo Data</span>
        </button>
      </div>
    </div>
  );
};
