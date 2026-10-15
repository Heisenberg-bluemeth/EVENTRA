import React from 'react';
import { Seat } from '../types/event';

interface SeatMap2DProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  maxSelection?: number;
}

export const SeatMap2D: React.FC<SeatMap2DProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  maxSelection = 8
}) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatColor = (seat: Seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      return 'bg-cyber-cyan text-midnight-950 font-bold border-cyber-cyan shadow-glow-cyan scale-105';
    }
    if (seat.status === 'reserved') {
      return 'bg-amber-950/40 text-amber-500/40 border-amber-900/50 cursor-not-allowed opacity-40';
    }
    if (seat.status === 'unavailable') {
      return 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed opacity-30';
    }
    // Available
    return 'bg-midnight-900 text-slate-300 border-midnight-700 hover:border-cyber-cyan hover:text-white cursor-pointer';
  };

  return (
    <div className="space-y-6 select-none">
      {/* Curved Screen / Stage indicator */}
      <div className="text-center space-y-2">
        <div className="w-3/4 max-w-md mx-auto h-2 rounded-t-full bg-gradient-to-r from-electric-500 via-cyber-cyan to-electric-500 shadow-glow-cyan" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          STAGE / FIELD / SCREEN DIRECTION
        </span>
      </div>

      {/* Grid of Seats */}
      <div className="overflow-x-auto pb-4 scrollbar-none flex justify-center">
        <div className="min-w-[420px] space-y-2.5">
          {rows.map((rowLetter) => {
            const rowSeats = seats.filter((s) => s.row === rowLetter);
            return (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-5 text-xs font-mono font-bold text-slate-400 text-center">
                  {rowLetter}
                </span>

                <div className="flex items-center gap-1.5">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isDisabled = seat.status === 'reserved' || seat.status === 'unavailable';

                    return (
                      <button
                        key={seat.id}
                        disabled={isDisabled}
                        onClick={() => onToggleSeat(seat)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[11px] font-mono flex items-center justify-center transition-all ${getSeatColor(
                          seat
                        )}`}
                        title={`Seat ${seat.id} • ₹${seat.price} • ${seat.status}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                <span className="w-5 text-xs font-mono font-bold text-slate-400 text-center">
                  {rowLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legends */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-midnight-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border border-midnight-700 bg-midnight-900" />
          <span className="text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-cyber-cyan border border-cyber-cyan shadow-sm" />
          <span className="text-white font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-950/40 border border-amber-900/50" />
          <span className="text-slate-500">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-900 border border-slate-800" />
          <span className="text-slate-500">Unavailable</span>
        </div>
      </div>
    </div>
  );
};
