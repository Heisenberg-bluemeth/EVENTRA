import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Heart
} from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { EventService, EventSortOption } from '../services/eventService';
import { CATEGORIES_LIST, CITIES_LIST } from '../data/events';
import { EventCategory, EventItem } from '../types/event';
import { useEventra } from '../context/EventraContext';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isWishlisted, toggleWishlist, selectedCity: globalCity } = useEventra();

  // Query params
  const qParam = searchParams.get('q') || '';
  const catParam = (searchParams.get('cat') as EventCategory | 'all') || 'all';
  const cityParam = searchParams.get('city') || (globalCity !== 'All Cities' ? globalCity : 'All Cities');
  const monthParam = searchParams.get('month') || '';
  const sortParam = (searchParams.get('sort') as EventSortOption) || 'popularity';

  const [query, setQuery] = useState(qParam);
  const [category, setCategory] = useState<EventCategory | 'all'>(catParam);
  const [city, setCity] = useState(cityParam);
  const [month, setMonth] = useState(monthParam);
  const [sortBy, setSortBy] = useState<EventSortOption>(sortParam);
  const [hasSeatSelection, setHasSeatSelection] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'all') params.set('cat', category);
    if (city !== 'All Cities') params.set('city', city);
    if (month) params.set('month', month);
    if (sortBy !== 'popularity') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [query, category, city, month, sortBy, setSearchParams]);

  const filteredEvents = useMemo(() => {
    return EventService.searchEvents({
      query,
      category,
      city,
      month: month || undefined,
      hasSeatSelection: hasSeatSelection || undefined,
      sortBy
    });
  }, [query, category, city, month, hasSeatSelection, sortBy]);

  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(0, visibleCount);
  }, [filteredEvents, visibleCount]);

  const handleReset = () => {
    setQuery('');
    setCategory('all');
    setCity('All Cities');
    setMonth('');
    setSortBy('popularity');
    setHasSeatSelection(false);
    setVisibleCount(8);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyber-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
          The Discovery Matrix
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Explore Experiences
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Filter and discover live concerts, sports championships, film retrospectives, and immersive festivals.
        </p>
      </div>

      {/* Control Strip */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(8);
              }}
              placeholder="Search by artist, venue, team, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-midnight-900 border border-midnight-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          {/* City Filter */}
          <div className="relative sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setVisibleCount(8);
              }}
              className="w-full pl-9 pr-8 py-3 rounded-2xl bg-midnight-900 border border-midnight-700 text-white text-xs font-mono appearance-none cursor-pointer focus:border-cyber-cyan"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="relative sm:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setVisibleCount(8);
              }}
              className="w-full pl-9 pr-8 py-3 rounded-2xl bg-midnight-900 border border-midnight-700 text-white text-xs font-mono appearance-none cursor-pointer focus:border-cyber-cyan"
            >
              <option value="">All Months</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-12">December 2026</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative sm:w-48">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as EventSortOption)}
                className="w-full pl-9 pr-8 py-3 rounded-2xl bg-midnight-900 border border-midnight-700 text-white text-xs font-mono appearance-none cursor-pointer focus:border-cyber-cyan"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="date-asc">Date: Upcoming First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-midnight-900 border border-midnight-700 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-midnight-800 text-cyber-cyan' : 'text-slate-400'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'list' ? 'bg-midnight-800 text-cyber-cyan' : 'text-slate-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Interactive Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-midnight-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id as any);
                  setVisibleCount(8);
                }}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                  category === cat.id
                    ? 'bg-electric-500 text-white shadow-glow-violet'
                    : 'bg-midnight-900 text-slate-400 border border-midnight-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <label className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSeatSelection}
                onChange={(e) => {
                  setHasSeatSelection(e.target.checked);
                  setVisibleCount(8);
                }}
                className="w-4 h-4 rounded border-midnight-700 bg-midnight-900 text-cyber-cyan focus:ring-0"
              />
              <span>Interactive 3D Seating Only</span>
            </label>

            {(query || category !== 'all' || city !== 'All Cities' || month || hasSeatSelection) && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-mono text-cyber-cyan hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="text-xs font-mono text-slate-400">
        Showing <strong className="text-white">{displayedEvents.length}</strong> of{' '}
        <strong className="text-white">{filteredEvents.length}</strong> live experiences
      </div>

      {/* Events Grid or List */}
      {displayedEvents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedEvents.map((evt) => {
              const lowestPrice = Math.min(...evt.ticketTiers.map((t) => t.price));
              const saved = isWishlisted(evt.id);
              return (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-3xl bg-midnight-900 border border-midnight-700 hover:border-electric-500/50 transition-all group"
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full sm:w-44 h-32 object-cover rounded-2xl shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-cyber-cyan px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                        {evt.subcategory}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {evt.date} • {evt.startTime}
                      </span>
                    </div>

                    <Link to={`/event/${evt.id}`}>
                      <h3 className="text-lg font-display font-bold text-white group-hover:text-cyber-cyan transition-colors truncate">
                        {evt.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                    <p className="text-xs font-mono text-slate-500">
                      📍 {evt.venue}, {evt.city}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-midnight-800 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">From</span>
                      <span className="text-base font-display font-bold text-white">
                        ₹{lowestPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(evt.id)}
                        className={`p-2 rounded-xl border ${
                          saved ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'text-slate-400 border-midnight-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${saved ? 'fill-rose-400' : ''}`} />
                      </button>
                      <Link
                        to={`/event/${evt.id}`}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 text-white text-xs font-bold font-mono tracking-wider"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 rounded-3xl bg-midnight-900/40 border border-midnight-800 space-y-4">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-display font-bold text-white">No Experiences Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Try adjusting your search keywords, city selection, or resetting your active filters.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-mono text-xs font-bold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredEvents.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-8 py-3 rounded-2xl bg-midnight-900 hover:bg-midnight-850 border border-midnight-700 text-white text-xs font-mono font-bold transition-all"
          >
            Load More Experiences ({filteredEvents.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
