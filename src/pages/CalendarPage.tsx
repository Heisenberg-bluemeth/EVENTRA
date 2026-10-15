import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChronosTimeRing3D } from '../components/3d/ChronosTimeRing3D';
import { EventService } from '../services/eventService';
import { EventItem } from '../types/event';
import { EventCard } from '../components/EventCard';

export const CalendarPage: React.FC = () => {
  // Calendar current browsing state (defaults to October 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 1-indexed: 10 = Oct
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-10-28');
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

  const allEvents = useMemo(() => EventService.getAllEvents(), []);

  // Format month name
  const monthName = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', { month: 'long' });
  }, [currentYear, currentMonth]);

  // Navigate month
  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar Math: days in month, starting day of week
  const { daysInMonth, startWeekday } = useMemo(() => {
    const days = new Date(currentYear, currentMonth, 0).getDate();
    const startDay = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sunday
    return { daysInMonth: days, startWeekday: startDay };
  }, [currentYear, currentMonth]);

  // Map of events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    allEvents.forEach((evt) => {
      if (!map[evt.date]) {
        map[evt.date] = [];
      }
      map[evt.date].push(evt);
    });
    return map;
  }, [allEvents]);

  // Filter events for the selected date or current month
  const activeEvents = useMemo(() => {
    if (selectedDate) {
      return allEvents.filter((e) => e.date === selectedDate);
    }
    const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return allEvents.filter((e) => e.date.startsWith(monthPrefix));
  }, [selectedDate, currentYear, currentMonth, allEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative z-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
          <CalendarIcon className="w-3.5 h-3.5" />
          The Time Dimension
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Timeline & Calendar
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Traverse time and plan your schedule across months and years. Select any date to inspect scheduled stadium matches, festivals, and showtimes.
        </p>
      </div>

      {/* 3D Chronos Continuum Scene */}
      <ChronosTimeRing3D />

      {/* Calendar Navigation & Month Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-midnight-900 border border-midnight-700">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-white transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            {monthName} <span className="text-amber-400">{currentYear}</span>
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-white transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View mode toggle & reset date */}
        <div className="flex items-center gap-3">
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              Clear Date Filter
            </button>
          )}

          <div className="flex items-center bg-midnight-950 p-1 rounded-xl border border-midnight-800">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'month' ? 'bg-amber-500 text-midnight-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'agenda' ? 'bg-amber-500 text-midnight-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Conventional Calendar Grid */}
      {viewMode === 'month' ? (
        <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700 shadow-2xl space-y-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-400 pb-2 border-b border-midnight-800">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start padding */}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-2xl bg-midnight-950/40 opacity-20" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = eventsByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-24 sm:h-28 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                      : dayEvents.length > 0
                      ? 'bg-midnight-850 border-midnight-700 hover:border-amber-500/50 hover:bg-midnight-800'
                      : 'bg-midnight-950/70 border-midnight-800/80 hover:bg-midnight-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-amber-300' : 'text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    )}
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="text-[9px] font-mono truncate px-1.5 py-0.5 rounded bg-midnight-950/90 text-amber-300 border border-amber-500/30"
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-mono text-slate-400 block text-right">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="space-y-4">
          {activeEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between p-5 rounded-2xl bg-midnight-900 border border-midnight-700 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-midnight-800 text-amber-400 font-mono text-center min-w-[70px]">
                  <span className="text-sm font-bold block">{evt.date.slice(8)}</span>
                  <span className="text-[10px] uppercase text-slate-400">{evt.date.slice(5, 7)}/26</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white">{evt.title}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {evt.startTime} • {evt.venue}, {evt.city}
                  </p>
                </div>
              </div>

              <Link
                to={`/event/${evt.id}`}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-midnight-950 font-mono text-xs font-bold"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Selected Date Events Showcase */}
      <section className="space-y-6 pt-6 border-t border-midnight-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-display font-bold text-white">
              {selectedDate ? `Experiences on ${selectedDate}` : `All Events in ${monthName}`}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {activeEvents.length} {activeEvents.length === 1 ? 'event' : 'events'} scheduled
            </p>
          </div>
        </div>

        {activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-3xl bg-midnight-900/40 border border-midnight-800 text-slate-400 text-sm">
            No events scheduled on this date. Click another day in the calendar to discover experiences.
          </div>
        )}
      </section>
    </div>
  );
};
