import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Download,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEventra } from '../context/EventraContext';
import { HolographicTicket3D } from '../components/3d/HolographicTicket3D';

export const ConfirmationPage: React.FC = () => {
  const { bookingRef } = useParams<{ bookingRef: string }>();
  const { bookings } = useEventra();

  const booking = bookings.find((b) => b.reference === bookingRef) || bookings[0];

  useEffect(() => {
    // Fire celebratory confetti on mount
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Booking Reference Not Found</h2>
        <Link to="/tickets" className="text-cyber-cyan hover:underline font-mono text-sm">
          Go to My Tickets
        </Link>
      </div>
    );
  }

  const handleDownloadPass = () => {
    const textContent = `
========================================
       EVENTRA 3D PASS CONFIRMATION      
========================================
Reference: ${booking.reference}
Event: ${booking.eventTitle}
Date & Time: ${booking.eventDate} at ${booking.eventTime}
Venue: ${booking.venue}, ${booking.city}
Tier: ${booking.tierName}
Seats: ${booking.seats.length > 0 ? booking.seats.join(', ') : `Qty: ${booking.quantity}`}
Primary Attendee: ${booking.attendee.fullName} (${booking.attendee.email})
Total Paid: ₹${booking.total.toLocaleString()}

NOTICE: This is a demonstration booking pass issued by EVENTRA.
Invalid for actual real-world venue entry.
========================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVENTRA-PASS-${booking.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative z-10">
      {/* Success Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-cyan mb-2">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Demo Booking Confirmed!
        </h1>
        <p className="text-sm font-mono text-cyber-cyan">
          Confirmation Reference: <strong>{booking.reference}</strong>
        </p>
      </div>

      {/* 3D Holographic Pass Presentation */}
      <div className="max-w-md mx-auto">
        <HolographicTicket3D booking={booking} className="h-[460px]" />
      </div>

      {/* Demonstration Notice Alert */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span>
          <strong>Demonstration Notice:</strong> This digital pass is simulated for testing the EVENTRA 3D booking experience. It does not confer admission to any actual real-world venue or event.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={handleDownloadPass}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-midnight-900 hover:bg-midnight-850 border border-midnight-700 text-slate-200 text-xs font-mono font-bold transition-all"
        >
          <Download className="w-4 h-4 text-cyber-cyan" />
          <span>Download Pass (.txt)</span>
        </button>

        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-cyber-cyan text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-glow-violet"
        >
          <Ticket className="w-4 h-4" />
          <span>Open My 3D Ticket Wallet</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
