import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Calendar as CalendarIcon,
  Trophy,
  Film,
  Music,
  Ticket,
  Heart,
  MapPin,
  Box,
  Menu,
  X,
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useEventra } from '../context/EventraContext';
import { CITIES_LIST } from '../data/events';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const location = useLocation();
  const { selectedCity, setSelectedCity, wishlist, bookings, is3DEnabled, toggle3DEnabled } = useEventra();

  const navLinks = [
    { to: '/', label: 'Universe', icon: Compass },
    { to: '/explore', label: 'Explore', icon: Sparkles },
    { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { to: '/sports', label: 'Sports', icon: Trophy },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/concerts', label: 'Concerts', icon: Music },
    { to: '/tickets', label: 'My Tickets', icon: Ticket, badge: bookings.length },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-midnight-700/60 bg-midnight-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan via-electric-500 to-electric-700 p-0.5 shadow-glow-violet transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-electric-400 text-lg">
                    E
                  </span>
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white group-hover:text-cyber-cyan transition-colors">
                  EVENT<span className="text-electric-400">RA</span>
                </span>
                <span className="block text-[9px] tracking-widest uppercase text-slate-400 font-mono -mt-1">
                  3D Ticket Universe
                </span>
              </div>
            </Link>

            {/* City Selection Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-900/90 border border-midnight-700 hover:border-electric-500/40 text-xs font-mono text-slate-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 rounded-2xl bg-midnight-900 border border-midnight-700 shadow-2xl z-50 py-1.5 divide-y divide-midnight-800">
                  {CITIES_LIST.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-mono transition-colors ${
                        selectedCity === city
                          ? 'bg-electric-500/20 text-cyber-cyan font-bold'
                          : 'text-slate-300 hover:bg-midnight-850 hover:text-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'text-white bg-midnight-800 border border-electric-500/30 shadow-glow-violet'
                      : 'text-slate-300 hover:text-white hover:bg-midnight-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-electric-500/30 text-electric-300 border border-electric-500/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Tools: 3D toggle, Wishlist, Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* 3D Engine Mode Toggle */}
            <button
              onClick={toggle3DEnabled}
              title={is3DEnabled ? '3D Engine Active (Click to switch to 2D Mode)' : '2D Fast Mode Active (Click to switch to 3D)'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                is3DEnabled
                  ? 'border-cyber-cyan/50 text-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20'
                  : 'border-slate-700 text-slate-400 bg-midnight-900 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{is3DEnabled ? '3D Active' : '2D Mode'}</span>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-midnight-900 transition-colors"
              title="Saved Experiences"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </Link>

            {/* Profile / Account */}
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-cyber-cyan text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-glow-violet transform hover:-translate-y-0.5"
            >
              Demo Pass
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggle3DEnabled}
              className="p-2 rounded-xl border border-midnight-700 text-xs text-cyber-cyan"
              title="Toggle 3D"
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-midnight-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-midnight-800 bg-midnight-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {/* City Selector in Mobile Drawer */}
          <div className="p-2 bg-midnight-900 rounded-xl mb-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Selected City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-cyber-cyan font-bold focus:outline-none"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-midnight-950 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'text-white bg-midnight-850 border border-electric-500/40 shadow-glow-violet'
                    : 'text-slate-300 hover:bg-midnight-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-electric-500/30 text-electric-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 flex gap-2">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-xl bg-midnight-900 text-slate-300 text-xs font-semibold"
            >
              Wishlist ({wishlist.length})
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-xl bg-electric-600 text-white text-xs font-bold"
            >
              My Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
