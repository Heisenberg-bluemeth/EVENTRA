import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Trophy,
  Film,
  Music,
  ArrowRight,
  Flame,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Ticket
} from 'lucide-react';
import { EventUniversePortals } from '../components/3d/EventUniversePortals';
import { SearchBar } from '../components/SearchBar';
import { EventCard } from '../components/EventCard';
import { EventService } from '../services/eventService';
import { useEventra } from '../context/EventraContext';

export const HomePage: React.FC = () => {
  const { selectedCity } = useEventra();
  const featuredEvents = useMemo(() => EventService.getFeaturedEvents(), []);
  const trendingEvents = useMemo(() => EventService.getTrendingEvents(), []);
  const allEvents = useMemo(() => EventService.getAllEvents(), []);

  // Filter based on selected city if active
  const cityFiltered = useMemo(() => {
    if (selectedCity === 'All Cities') return allEvents;
    return allEvents.filter((e) => e.city.toLowerCase() === selectedCity.toLowerCase());
  }, [selectedCity, allEvents]);

  return (
    <div className="space-y-24 pb-20 relative z-10">
      {/* Hero Section with 3D Portals Universe */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-950/80 border border-electric-500/40 text-electric-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-glow-violet">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Next-Gen Spatial Ticket Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            Discover the Moment. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-electric-400 to-rose-500">
              Experience the Extraordinary.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Step into the 3D universe of live entertainment. Book premier sports matches, arena concerts, 70mm IMAX screenings, and global festivals in full interactive spatial immersion.
          </p>
        </div>

        {/* Global Autocomplete Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Trending tags:</span>
            {['IPL 2026', 'Coldplay', 'Wembley Derby', 'Interstellar 70mm', 'Vir Das'].map((tag) => (
              <Link
                key={tag}
                to={`/explore?q=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-xl bg-midnight-900 border border-midnight-700 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* 3D Universe of Portals */}
        <EventUniversePortals />
      </section>

      {/* Featured Masterpieces Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyber-cyan mb-2">
              <Zap className="w-4 h-4 text-cyber-cyan" />
              Global Headliners
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Featured 3D Experiences
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top-tier arena tours, international sports fixtures, and blockbuster premieres.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-cyan hover:text-white transition-colors"
          >
            Explore All Experiences ({allEvents.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} featured />
          ))}
        </div>
      </section>

      {/* 3D Timeline / Horizon Rail */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-midnight-900 via-midnight-850 to-midnight-900 border border-midnight-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono text-cyber-cyan bg-cyan-950/80 border border-cyan-500/30">
              The Time Dimension
            </span>
            <h3 className="text-3xl font-display font-bold text-white">
              Plan Ahead Across Months & Continents
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Navigate our interactive 3D chronological continuum. Discover what is happening across the remainder of 2026 in London, Mumbai, New York, Tokyo, and Dubai with instant seat reservation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/calendar"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-electric-500 hover:from-white hover:to-cyber-cyan text-midnight-950 font-bold text-xs uppercase tracking-wider font-mono shadow-glow-cyan transition-all"
              >
                Launch Time Dimension
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-200 border border-midnight-600 text-xs font-semibold transition-all"
              >
                Browse by Month
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now in Live Entertainment */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 mb-2">
              <Flame className="w-4 h-4 text-rose-500" />
              High Velocity Demand
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Trending Experiences
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            View More →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Pillar Guarantees */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-midnight-900/60 border border-midnight-800 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-electric-500/10 text-electric-400 border border-electric-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">Full-Page 3D Immersion</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Persistent atmospheric spatial computing layer with category-specific 3D stadiums, cinema halls, and concert stages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">3D Holographic Wallet</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dynamic 3D metallic ticket passes with real-time gyroscopic tilt, verified demo references, and instant cancellations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">Interactive 3D Seating</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clickable 3D seating bowl with real-time seat states, pricing breakdowns, and accessible 2D layout alternative.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
