import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-midnight-800 bg-midnight-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 mt-24 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-cyan via-electric-500 to-electric-700 p-0.5 shadow-glow-violet">
              <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center font-display font-black text-cyber-cyan text-sm">
                E
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white">
              EVENT<span className="text-electric-400">RA</span>
            </span>
          </Link>

          <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-sm">
            “Discover the Moment. Experience the Extraordinary.”
            <br />
            Next-generation 3D ticket booking universe for global concerts, high-stakes sports, cinematic IMAX premieres, and live festivals.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan pt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WebGL 3D Spatial Computing Engine</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Experiences
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sports" className="hover:text-cyber-cyan transition-colors">Sports & Stadium</Link></li>
            <li><Link to="/concerts" className="hover:text-cyber-cyan transition-colors">Concerts & Live</Link></li>
            <li><Link to="/movies" className="hover:text-cyber-cyan transition-colors">Cinema & IMAX</Link></li>
            <li><Link to="/category/comedy" className="hover:text-cyber-cyan transition-colors">Standup Comedy</Link></li>
            <li><Link to="/category/festivals" className="hover:text-cyber-cyan transition-colors">EDM Festivals</Link></li>
            <li><Link to="/category/gaming" className="hover:text-cyber-cyan transition-colors">Esports Arena</Link></li>
          </ul>
        </div>

        {/* Portals & Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-cyber-cyan transition-colors">3D Discovery Gallery</Link></li>
            <li><Link to="/calendar" className="hover:text-cyber-cyan transition-colors">The Time Dimension</Link></li>
            <li><Link to="/tickets" className="hover:text-cyber-cyan transition-colors">My 3D Ticket Wallet</Link></li>
            <li><Link to="/wishlist" className="hover:text-cyber-cyan transition-colors">Saved Experiences</Link></li>
            <li><Link to="/about" className="hover:text-cyber-cyan transition-colors">About & Support</Link></li>
          </ul>
        </div>

        {/* Simulation Notice & Policy */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Demonstration Policy
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            EVENTRA is an interactive demonstration web application. All tickets, fixtures, showtimes, and booking references generated are simulated demo passes and invalid for actual real-world venue entry.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Payment Credentials Collected</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-midnight-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
        <p>© {new Date().getFullYear()} EVENTRA Inc. All rights reserved. Built for extraordinary discovery.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Three.js
        </p>
      </div>
    </footer>
  );
};
