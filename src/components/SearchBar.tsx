import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { EventItem } from '../types/event';

export const SearchBar: React.FC<{
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (q: string) => void;
}> = ({
  placeholder = 'Search concerts, cricket matches, movies, comedy tours...',
  className = '',
  onSearchSubmit
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState<EventItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 1) {
      const results = EventService.searchEvents({ query: query.trim() }).slice(0, 5);
      setMatches(results);
      setIsOpen(true);
    } else {
      setMatches([]);
      setIsOpen(false);
    }
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearchSubmit) {
        onSearchSubmit(query.trim());
      } else {
        navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelect = (eventId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/event/${eventId}`);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-cyber-cyan">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 rounded-2xl bg-midnight-900/90 border border-midnight-700 hover:border-electric-500/50 focus:border-cyber-cyan text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 backdrop-blur-xl transition-all shadow-inner"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-midnight-900/95 border border-midnight-700 shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-midnight-800">
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-midnight-950/80">
            Suggested Experiences
          </div>

          <div className="max-h-80 overflow-y-auto">
            {matches.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center gap-3.5 p-3.5 hover:bg-midnight-850 cursor-pointer transition-colors group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-xl shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.city}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyber-cyan transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>

          <div
            onClick={handleSubmit}
            className="p-3 text-center text-xs font-mono font-bold text-cyber-cyan hover:bg-midnight-850 cursor-pointer transition-colors"
          >
            Press Enter to explore all matching results in Explore Gallery →
          </div>
        </div>
      )}
    </div>
  );
};
