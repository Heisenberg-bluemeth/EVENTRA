import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useEventra } from '../context/EventraContext';
import { EventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useEventra();

  const savedEvents = useMemo(() => {
    return wishlist
      .map((id) => EventService.getEventById(id))
      .filter(Boolean) as ReturnType<typeof EventService.getAllEvents>;
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400">
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
          Saved Encounters
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          My Wishlist
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Your bookmarked experiences saved in local browser storage. Jump directly into ticket tier selection anytime.
        </p>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-midnight-900/40 border border-midnight-800 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-display font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Click the heart icon on any concert, stadium match, or movie card to save it for later.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-electric-600 to-electric-500 text-white font-mono font-bold text-xs uppercase"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
