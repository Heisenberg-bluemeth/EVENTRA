import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Users,
  AlertCircle,
  Sparkles,
  Ticket
} from 'lucide-react';
import { EventService } from '../services/eventService';
import { useEventra } from '../context/EventraContext';
import { Stadium3DScene } from '../components/3d/Stadium3DScene';
import { CinemaMarquee3D } from '../components/3d/CinemaMarquee3D';
import { ConcertStage3D } from '../components/3d/ConcertStage3D';
import { EventCard } from '../components/EventCard';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist, setCartEvent, setCartTier } = useEventra();
  const [copied, setCopied] = useState(false);

  const event = EventService.getEventById(id || '');
  const saved = event ? isWishlisted(event.id) : false;

  // Selected tier state
  const [selectedTierId, setSelectedTierId] = useState<string>(
    event?.ticketTiers[0]?.id || ''
  );

  const relatedEvents = event
    ? EventService.getEventsByCategory(event.category)
        .filter((e) => e.id !== event.id)
        .slice(0, 3)
    : [];

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Experience Not Found</h2>
        <p className="text-slate-400">The requested event could not be located in our universe.</p>
        <Link to="/explore" className="text-cyber-cyan hover:underline font-mono text-sm">
          Return to Explore Gallery
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookNow = () => {
    const tier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0];
    setCartEvent(event);
    setCartTier(tier);

    if (event.hasSeatSelection) {
      navigate(`/venue/${event.id}`);
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero 3D Backdrop / Artwork Header */}
      <div className="space-y-6">
        {event.category === 'sports' ? (
          <Stadium3DScene className="h-64 sm:h-80" />
        ) : event.category === 'movies' ? (
          <CinemaMarquee3D className="h-64 sm:h-80" />
        ) : (
          <ConcertStage3D className="h-64 sm:h-80" />
        )}
      </div>

      {/* Main Grid: Details + Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col (8 cols): Event Description, Performers, Rules, Venue */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 border border-electric-500/40 uppercase">
                {event.subcategory}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-cyber-cyan">{event.city}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{event.duration}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              {event.title}
            </h1>
            <p className="text-lg text-slate-300 font-sans">{event.tagline}</p>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-midnight-900 border border-midnight-700/80 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-midnight-800 text-cyber-cyan">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DATE & TIME</span>
                <span className="text-white font-bold">{event.date} • {event.startTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-midnight-800 text-electric-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">VENUE</span>
                <span className="text-white font-bold truncate block">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-midnight-800 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">RATING</span>
                <span className="text-white font-bold">
                  {event.rating.toFixed(1)} / 5.0 ({event.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* About / Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider font-mono">
              About This Experience
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {event.description}
            </p>
          </div>

          {/* Highlight Callout */}
          {event.highlight && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-electric-950/60 to-midnight-900 border border-electric-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-cyan uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Special Feature</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200">{event.highlight}</p>
            </div>
          )}

          {/* Performers or Teams */}
          {event.performers && event.performers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
                Featured Artists & Performers
              </h3>
              <div className="flex flex-wrap gap-4">
                {event.performers.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-midnight-900 border border-midnight-700"
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          <div className="p-6 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>Event Guidelines & Age Limit</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Age Restriction: <strong className="text-slate-200">{event.ageRestriction}</strong>
            </p>
            <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
              {event.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col (4 cols): Sticky Ticket Selection & Checkout CTA */}
        <div className="lg:col-span-4 sticky top-28 space-y-5">
          <div className="p-6 rounded-3xl bg-midnight-900/95 border border-midnight-700 shadow-2xl space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Starting at</span>
                <span className="text-2xl font-display font-extrabold text-white">
                  ₹{Math.min(...event.ticketTiers.map((t) => t.price)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(event.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    saved
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-midnight-800 border-midnight-700 text-slate-400 hover:text-white'
                  }`}
                  title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-rose-400' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-midnight-800 border border-midnight-700 text-slate-400 hover:text-white transition-colors"
                  title="Share link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Select Ticket Tier */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Select Ticket Tier:
              </span>

              <div className="space-y-2.5">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-electric-500/15 border-cyber-cyan ring-1 ring-cyber-cyan shadow-sm'
                          : 'bg-midnight-950 border-midnight-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold text-white">
                          {tier.name}
                        </span>
                        <span className="text-sm font-mono font-bold text-cyber-cyan">
                          ₹{tier.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{tier.description}</p>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                        {tier.available} tickets left
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan via-electric-500 to-electric-600 hover:from-white hover:to-cyber-cyan text-midnight-950 font-display font-extrabold text-sm tracking-wider uppercase transition-all shadow-glow-cyan transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>{event.hasSeatSelection ? 'Select 3D Seats' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] font-mono text-slate-500 text-center">
              🛡️ Demo Reservation • No credit card required
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Carousel */}
      {relatedEvents.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-midnight-800">
          <h3 className="text-2xl font-display font-bold text-white">
            Similar Experiences You Might Enjoy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
