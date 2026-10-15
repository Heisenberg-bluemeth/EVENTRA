import React, { useMemo } from 'react';
import { Trophy, Calendar, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Stadium3DScene } from '../components/3d/Stadium3DScene';
import { EventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';

export const SportsPage: React.FC = () => {
  const sportsEvents = useMemo(() => EventService.getEventsByCategory('sports'), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
          <Trophy className="w-3.5 h-3.5" />
          The Stadium Universe
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Live Sports & Stadium Fixtures
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Experience the deafening roar of the crowd. Secure your vantage point in the grandstands for cricket championships, football derbies, and grand slams.
        </p>
      </div>

      {/* 3D Interactive Stadium Scene */}
      <Stadium3DScene />

      {/* Demonstration Notice Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs font-mono text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          Sample Schedule • All fixtures, player rosters, and ticket tiers below are simulated demonstration events for testing 3D seat reservation.
        </span>
      </div>

      {/* Match Listings Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">Upcoming Fixtures</h2>
          <span className="text-xs font-mono text-slate-400">
            {sportsEvents.length} {sportsEvents.length === 1 ? 'fixture' : 'fixtures'} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsEvents.map((evt) => (
            <div
              key={evt.id}
              className="group rounded-3xl bg-midnight-900 border border-midnight-700 hover:border-emerald-500/50 p-6 flex flex-col justify-between space-y-5 transition-all hover:shadow-glow-card"
            >
              {/* Teams Header */}
              {evt.teams ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-midnight-950 border border-midnight-800">
                  <div className="text-center">
                    <span className="text-2xl block mb-1">{evt.teams.homeLogo}</span>
                    <span className="text-xs font-display font-bold text-white block truncate max-w-[100px]">
                      {evt.teams.home}
                    </span>
                  </div>
                  <div className="text-center px-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30">
                      VS
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl block mb-1">{evt.teams.awayLogo}</span>
                    <span className="text-xs font-display font-bold text-white block truncate max-w-[100px]">
                      {evt.teams.away}
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-40 object-cover rounded-2xl"
                />
              )}

              {/* Title & Metadata */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {evt.teams?.tournament || evt.subcategory}
                </span>
                <Link to={`/event/${evt.id}`}>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {evt.title}
                  </h3>
                </Link>
                <div className="flex flex-col gap-1 text-xs font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {evt.date} • {evt.startTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {evt.venue}, {evt.city}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-midnight-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Tickets From</span>
                  <span className="text-sm font-display font-bold text-white">
                    ₹{Math.min(...evt.ticketTiers.map((t) => t.price)).toLocaleString()}
                  </span>
                </div>
                <Link
                  to={`/event/${evt.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-midnight-950 font-mono font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Select Seats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
