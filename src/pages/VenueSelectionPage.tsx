import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, Box, Grid } from 'lucide-react';
import { EventService } from '../services/eventService';
import { useEventra } from '../context/EventraContext';
import { VenueBowl3D } from '../components/3d/VenueBowl3D';
import { SeatMap2D } from '../components/SeatMap2D';
import { Seat } from '../types/event';

export const VenueSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, setSelectedSeats, toggleSeat, setCartEvent } = useEventra();

  const event = EventService.getEventById(id || '') || cart.event;
  const [activeView, setActiveView] = useState<'3d' | '2d'>('3d');
  const [activeSection, setActiveSection] = useState('sec-vip');

  // Generate deterministic seats for this event
  const seats = useMemo(() => {
    return event ? EventService.generateVenueSeats(event.id) : [];
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <Link to="/explore" className="text-cyber-cyan hover:underline font-mono text-sm">
          Return to Explore
        </Link>
      </div>
    );
  }

  const selectedSeatIds = cart.selectedSeats.map((s) => s.id);
  const seatsSubtotal = cart.selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceedToCheckout = () => {
    if (cart.selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed to checkout.');
      return;
    }
    setCartEvent(event);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event Details
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {event.title} — Seating Selection
          </h1>
          <p className="text-xs font-mono text-slate-400">
            📍 {event.venue}, {event.city} • {event.date}
          </p>
        </div>

        {/* 3D vs 2D View Mode Switcher */}
        <div className="flex items-center bg-midnight-900 border border-midnight-700 p-1 rounded-2xl">
          <button
            onClick={() => setActiveView('3d')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeView === '3d'
                ? 'bg-cyber-cyan text-midnight-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Bowl</span>
          </button>
          <button
            onClick={() => setActiveView('2d')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeView === '2d'
                ? 'bg-cyber-cyan text-midnight-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>2D Seat Map</span>
          </button>
        </div>
      </div>

      {/* Main Seating Layout & Live Booking Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): 3D View or 2D Interactive Seat Grid */}
        <div className="lg:col-span-8 space-y-6">
          {activeView === '3d' ? (
            <div className="space-y-6">
              <VenueBowl3D
                selectedSectionId={activeSection}
                onSelectSection={(sec) => {
                  setActiveSection(sec.id);
                  setActiveView('2d'); // zoom into seat map on click
                }}
              />
              <div className="p-4 rounded-2xl bg-midnight-900/70 border border-midnight-800 text-center text-xs font-mono text-slate-400">
                💡 Tip: Click any colored section in the 3D bowl to zoom into its individual row seating.
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-midnight-800 text-xs font-mono">
                <span className="text-white font-bold">Main Pavilion • Rows A–F</span>
                <span className="text-slate-400">Max 8 seats per order</span>
              </div>
              <SeatMap2D
                seats={seats}
                selectedSeatIds={selectedSeatIds}
                onToggleSeat={toggleSeat}
              />
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Live Order Summary Card */}
        <div className="lg:col-span-4 sticky top-28 space-y-5">
          <div className="p-6 rounded-3xl bg-midnight-900/95 border border-midnight-700 shadow-2xl space-y-6 backdrop-blur-xl">
            <h3 className="font-display font-bold text-lg text-white pb-3 border-b border-midnight-800">
              Seat Selection Summary
            </h3>

            {/* Selected Seats List */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Selected Seats ({cart.selectedSeats.length} of 8):
              </span>

              {cart.selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cart.selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-2.5 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <span>Seat {seat.id}</span>
                      <button
                        onClick={() => toggleSeat(seat)}
                        className="text-slate-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 text-xs text-slate-500 font-mono text-center">
                  Click seats on the map above to select them
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-midnight-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Seats Subtotal:</span>
                <span className="text-white">₹{seatsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Demo Fee:</span>
                <span className="text-emerald-400">FREE (Demo)</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-midnight-800">
                <span className="text-white">Total Amount:</span>
                <span className="text-cyber-cyan font-mono text-base">
                  ₹{seatsSubtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={handleProceedToCheckout}
              disabled={cart.selectedSeats.length === 0}
              className={`w-full py-4 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                cart.selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-cyber-cyan via-electric-500 to-electric-600 text-midnight-950 shadow-glow-cyan hover:from-white hover:to-cyber-cyan'
                  : 'bg-midnight-800 text-slate-500 cursor-not-allowed border border-midnight-700'
              }`}
            >
              <span>Confirm Seats & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
