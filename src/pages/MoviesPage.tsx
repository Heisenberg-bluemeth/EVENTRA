import React, { useMemo } from 'react';
import { Film, Clock, MapPin, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CinemaMarquee3D } from '../components/3d/CinemaMarquee3D';
import { EventService } from '../services/eventService';

export const MoviesPage: React.FC = () => {
  const movieEvents = useMemo(() => EventService.getEventsByCategory('movies'), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400">
          <Film className="w-3.5 h-3.5" />
          The Cinema Dimension
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          IMAX 3D, Premieres & 70mm Laser
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Step beyond standard cinema. Discover laser-projected masterpieces with 12-channel spatial audio, VIP recliners, and limited-edition 70mm prints.
        </p>
      </div>

      {/* 3D Cinema Marquee Scene */}
      <CinemaMarquee3D />

      {/* Demo Notice */}
      <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-xs font-mono text-rose-300">
        <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
        <span>
          Sample Showtimes • The movies and screening schedules listed below are simulated demonstration listings for testing IMAX seat selection.
        </span>
      </div>

      {/* Movie Showtimes Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {movieEvents.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl bg-midnight-900 border border-midnight-700 hover:border-rose-500/50 p-6 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-glow-card"
          >
            <img
              src={evt.image}
              alt={evt.title}
              className="w-full sm:w-44 h-64 object-cover rounded-2xl shadow-xl flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                    {evt.movieDetails?.certification || 'PG-13'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{evt.duration}</span>
                </div>

                <Link to={`/event/${evt.id}`}>
                  <h3 className="font-display font-bold text-xl text-white hover:text-rose-300 transition-colors">
                    {evt.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                <p className="text-xs font-mono text-slate-500">
                  📍 {evt.venue}, {evt.city}
                </p>

                {/* Formats badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {evt.movieDetails?.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-midnight-950 border border-midnight-800 text-slate-300"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes Selector */}
              {evt.movieDetails && (
                <div className="space-y-1.5 pt-2 border-t border-midnight-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Select Showtime:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evt.movieDetails.showtimes.map((st) => (
                      <Link
                        key={st}
                        to={`/event/${evt.id}`}
                        className="px-3 py-1.5 rounded-xl bg-midnight-800 hover:bg-rose-500 hover:text-midnight-950 text-slate-200 text-xs font-mono font-bold border border-midnight-700 transition-all"
                      >
                        {st}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
