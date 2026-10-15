import React, { useMemo } from 'react';
import { Music, Calendar, MapPin, ArrowRight, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConcertStage3D } from '../components/3d/ConcertStage3D';
import { EventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';

export const ConcertsPage: React.FC = () => {
  const concertEvents = useMemo(() => {
    return [
      ...EventService.getEventsByCategory('concerts'),
      ...EventService.getEventsByCategory('festivals')
    ];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-electric-400">
          <Music className="w-3.5 h-3.5" />
          The Live Stage Arena
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Arena Concerts & Global Festivals
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          From legendary stadium rock tours to desert electronic music festivals. Immerse yourself in the sonic spectacle with priority pit and VIP passes.
        </p>
      </div>

      {/* 3D Live Concert Stage */}
      <ConcertStage3D />

      {/* Concert Lineup Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">Live Tours & Lineups</h2>
          <span className="text-xs font-mono text-slate-400">
            {concertEvents.length} {concertEvents.length === 1 ? 'tour' : 'tours'} active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concertEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>
    </div>
  );
};
