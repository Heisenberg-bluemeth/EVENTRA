import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Trash2,
  Download,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useEventra } from '../context/EventraContext';
import { HolographicTicket3D } from '../components/3d/HolographicTicket3D';
import { Booking } from '../types/event';

export const TicketsPage: React.FC = () => {
  const { bookings, cancelBooking } = useEventra();
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(
    bookings[0]?.reference || null
  );
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetCancelRef, setTargetCancelRef] = useState<string | null>(null);

  const selectedBooking = bookings.find((b) => b.reference === selectedBookingRef) || bookings[0];

  const handleOpenCancel = (ref: string) => {
    setTargetCancelRef(ref);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (targetCancelRef) {
      cancelBooking(targetCancelRef);
      setCancelModalOpen(false);
      setTargetCancelRef(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyber-cyan">
          <Ticket className="w-3.5 h-3.5" />
          The Spatial Passholder Vault
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          My 3D Ticket Wallet
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Inspect your verified 3D holographic digital passes. Hover and tilt each pass in real time to verify details and seating barcodes.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (7 cols): List of Booked Passes */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-mono uppercase text-slate-400 font-bold tracking-wider">
              Issued Passes ({bookings.length})
            </h3>

            <div className="space-y-4">
              {bookings.map((booking) => {
                const isSelected = selectedBooking?.reference === booking.reference;
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div
                    key={booking.reference}
                    onClick={() => setSelectedBookingRef(booking.reference)}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-midnight-900 border-cyber-cyan shadow-glow-cyan ring-1 ring-cyber-cyan'
                        : 'bg-midnight-900/80 border-midnight-700/80 hover:border-slate-600'
                    } ${isCancelled ? 'opacity-50' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-electric-500/20 text-electric-300 border border-electric-500/30">
                            {booking.eventCategory}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {booking.reference}
                          </span>
                          {isCancelled && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/30">
                              Cancelled
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-lg text-white">
                          {booking.eventTitle}
                        </h4>

                        <p className="text-xs font-mono text-slate-400">
                          📅 {booking.eventDate} at {booking.eventTime} • 📍 {booking.venue}, {booking.city}
                        </p>

                        <div className="text-xs font-mono text-cyber-cyan pt-1">
                          Tier: {booking.tierName} • Seats:{' '}
                          {booking.seats.length > 0 ? booking.seats.join(', ') : `Qty: ${booking.quantity}`}
                        </div>
                      </div>

                      {/* Cancel Action */}
                      {!isCancelled && (
                        <div className="flex items-center gap-2 sm:self-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCancel(booking.reference);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-rose-800/60 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 text-xs font-mono transition-colors"
                          >
                            Cancel Pass
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 cols): 3D Holographic Pass Viewer */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <h3 className="text-sm font-mono uppercase text-slate-400 font-bold tracking-wider">
              3D Hologram Inspection
            </h3>

            {selectedBooking && (
              <div className="space-y-4">
                <HolographicTicket3D booking={selectedBooking} className="h-[480px]" />
                <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Attendee:</span>
                    <strong className="text-white">{selectedBooking.attendee.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-slate-300">{selectedBooking.attendee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Demo Cost:</span>
                    <span className="text-cyber-cyan font-bold">
                      ₹{selectedBooking.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty Wallet */
        <div className="p-16 text-center rounded-3xl bg-midnight-900/40 border border-midnight-800 space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-display font-bold text-white">Your Ticket Wallet is Empty</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Book any live concert, sports championship, or movie experience to generate simulated 3D passes in your wallet.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyber-cyan to-electric-500 text-midnight-950 font-mono font-bold text-xs uppercase"
          >
            <span>Discover Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Demo Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setCancelModalOpen(false)}
          />
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-midnight-900 border border-midnight-700 shadow-2xl z-10 space-y-5">
            <h3 className="font-display font-bold text-lg text-white">
              Cancel Simulated Booking?
            </h3>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Are you sure you want to cancel booking <strong>{targetCancelRef}</strong>? Your seats will be released back to the demo availability pool.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-midnight-700 text-slate-300 text-xs font-mono"
              >
                Keep Ticket
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
