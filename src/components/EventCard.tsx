import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../types/event';
import { useEventra } from '../context/EventraContext';

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const { isWishlisted, toggleWishlist } = useEventra();
  const saved = isWishlisted(event.id);

  const lowestPrice = Math.min(...event.ticketTiers.map((t) => t.price));

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(event.id);
  };

  const statusStyles: Record<EventItem['status'], { text: string; bg: string; border: string }> = {
    'selling-fast': { text: 'text-amber-300', bg: 'bg-amber-950/80', border: 'border-amber-500/40' },
    'almost-full': { text: 'text-rose-300', bg: 'bg-rose-950/80', border: 'border-rose-500/40' },
    'upcoming': { text: 'text-cyan-300', bg: 'bg-cyan-950/80', border: 'border-cyan-500/40' },
    'sold-out': { text: 'text-slate-400', bg: 'bg-slate-900', border: 'border-slate-700' }
  };

  const statusInfo = statusStyles[event.status];

  return (
    <div className="group relative flex flex-col rounded-3xl bg-midnight-900/90 border border-midnight-700/80 hover:border-electric-500/50 transition-all duration-300 hover:shadow-glow-card overflow-hidden">
      {/* Top Media Artwork */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-midnight-950">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-midnight-950/80 border border-white/20 text-white backdrop-blur-md">
          {event.subcategory}
        </span>

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-12 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold capitalize backdrop-blur-md border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
        >
          {event.status.replace('-', ' ')}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
              : 'bg-midnight-950/60 text-slate-400 hover:text-white border border-white/10'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Rating overlay pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight-950/90 border border-midnight-700 text-xs text-amber-400 font-mono backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-bold">{event.rating.toFixed(1)}</span>
          <span className="text-slate-500 text-[10px]">({event.reviewsCount})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Date & Location */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-electric-300">
            <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
            {event.date} • {event.startTime}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {event.city}
          </span>
        </div>

        {/* Title */}
        <Link to={`/event/${event.id}`}>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-cyber-cyan transition-colors line-clamp-1">
            {event.title}
          </h3>
        </Link>

        {/* Tagline / Venue */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {event.tagline || event.description}
        </p>

        {/* Price & Action Strip */}
        <div className="pt-3 mt-auto border-t border-midnight-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Starts at</span>
            <span className="text-sm font-display font-bold text-white">
              ₹{lowestPrice.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/event/${event.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-cyber-cyan text-white text-xs font-bold font-mono tracking-wider transition-all shadow-glow-violet transform hover:-translate-y-0.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
