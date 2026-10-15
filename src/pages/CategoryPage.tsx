import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';
import { EventCategory } from '../types/event';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { cat } = useParams<{ cat: string }>();
  const categoryId = (cat || 'comedy') as EventCategory;

  const events = useMemo(() => {
    return EventService.getEventsByCategory(categoryId);
  }, [categoryId]);

  const categoryTitles: Record<string, { title: string; subtitle: string; color: string }> = {
    comedy: { title: 'Standup Comedy & Specials', subtitle: 'Live arena tapings, comedy clubs, and international headliner tours.', color: 'text-amber-400' },
    theatre: { title: 'Theatre & Broadway Shows', subtitle: 'Grand musicals, classical drama, and West End productions.', color: 'text-rose-400' },
    gaming: { title: 'Gaming & Esports Tournaments', subtitle: 'Championship finals, LAN challenges, and creator conventions.', color: 'text-cyber-cyan' },
    festivals: { title: 'Festivals & Cultural Fests', subtitle: 'Multi-day celebrations of sound, art, gastronomy, and cinema.', color: 'text-electric-400' },
    workshops: { title: 'Masterclasses & Summits', subtitle: 'Hands-on creative tech, filmmaking, and spatial design intensives.', color: 'text-emerald-400' }
  };

  const meta = categoryTitles[categoryId] || {
    title: 'Curated Experiences',
    subtitle: 'Explore exceptional live events in this category.',
    color: 'text-white'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Experiences
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
          Category Portal
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          {meta.title}
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{meta.subtitle}</p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-midnight-900 border border-midnight-800 text-slate-400 space-y-3">
          <p>No experiences currently scheduled in this category.</p>
          <Link
            to="/explore"
            className="inline-block px-5 py-2.5 rounded-xl bg-electric-600 text-white text-xs font-mono font-bold"
          >
            Explore Other Categories
          </Link>
        </div>
      )}
    </div>
  );
};
