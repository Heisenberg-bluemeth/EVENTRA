import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  AlertCircle,
  Ticket
} from 'lucide-react';
import { useEventra } from '../context/EventraContext';
import { EventService } from '../services/eventService';
import { Booking } from '../types/event';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, applyCouponCode, setQuantity, addBooking, clearCart } = useEventra();

  // Attendee form state
  const [fullName, setFullName] = useState('Alex Rivers');
  const [email, setEmail] = useState('alex.rivers@demo.eventra.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const event = cart.event;
  const tier = cart.tier || event?.ticketTiers[0];

  if (!event || !tier) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-slate-400">Please select an experience to book demo tickets.</p>
        <Link
          to="/explore"
          className="inline-block px-6 py-2.5 rounded-xl bg-electric-600 text-white text-xs font-mono font-bold"
        >
          Explore All Experiences
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const hasSelectedSeats = cart.selectedSeats.length > 0;
  const effectiveQty = hasSelectedSeats ? cart.selectedSeats.length : cart.quantity;
  const unitPrice = hasSelectedSeats
    ? cart.selectedSeats.reduce((acc, s) => acc + s.price, 0) / effectiveQty
    : tier.price;
  const subtotal = effectiveQty * unitPrice;
  const demoFee = 150; // Clearly labeled demo processing fee
  const discountAmount = Math.round((subtotal * cart.discountPercent) / 100);
  const finalTotal = subtotal + demoFee - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMessage({ text: res.message, success: res.valid });
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg('Please enter a valid full attendee name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment transaction delay
    setTimeout(() => {
      const reference = EventService.generateBookingReference();
      const newBooking: Booking = {
        reference,
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        eventDate: event.date,
        eventTime: event.startTime,
        venue: event.venue,
        city: event.city,
        tierId: tier.id,
        tierName: tier.name,
        seats: cart.selectedSeats.map((s) => s.id),
        quantity: effectiveQty,
        attendee: { fullName, email, phone },
        subtotal,
        fees: demoFee,
        discount: discountAmount,
        couponCode: cart.couponCode || undefined,
        total: finalTotal,
        bookingDate: Date.now(),
        status: 'confirmed',
        qrCode: `EVENTRA-DEMO-PASS-${reference}-${event.id}`
      };

      addBooking(newBooking);
      clearCart();
      setIsProcessing(false);
      navigate(`/confirmation/${reference}`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
      <Link
        to={`/event/${event.id}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Event Details
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Simulated Ticket Checkout
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Review your selection, enter attendee information, and confirm your simulated pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Attendee Form & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Attendee Details Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight-900 border border-midnight-700 space-y-5">
            <h3 className="font-display font-bold text-lg text-white">Attendee Information</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Full Name (Primary Guest)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                  placeholder="e.g. Maya Thorne"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Email Address (For Digital Pass)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                    placeholder="name@domain.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Phone Number (SMS Updates)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                    placeholder="+1 555-0199"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector if no specific seats */}
          {!hasSelectedSeats && (
            <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-sm">Ticket Quantity</h4>
                <p className="text-xs font-mono text-slate-400">Standard Tier Admission</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(cart.quantity - 1)}
                  disabled={cart.quantity <= 1}
                  className="w-9 h-9 rounded-xl bg-midnight-800 text-white font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="font-mono font-bold text-lg text-white w-6 text-center">
                  {cart.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(cart.quantity + 1)}
                  disabled={cart.quantity >= 10}
                  className="w-9 h-9 rounded-xl bg-midnight-800 text-white font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Simulated Payment Method Selection */}
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight-900 border border-midnight-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">Payment Method (Simulation)</h3>
              <span className="text-[10px] font-mono text-emerald-400">Sandbox Test Mode</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'upi', label: 'Instant UPI', desc: 'GPay / PhonePe' },
                { id: 'card', label: 'Credit Card', desc: 'Visa / Mastercard' },
                { id: 'wallet', label: 'Digital Wallet', desc: 'Apple Pay / PayPal' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === m.id
                      ? 'bg-electric-500/20 border-cyber-cyan shadow-sm'
                      : 'bg-midnight-950 border-midnight-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-white block">{m.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{m.desc}</span>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-midnight-950 border border-midnight-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Simulated Payment Gateway: No real credit card or bank details are requested.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary, Coupon & Confirm */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight-900/95 border border-midnight-700 shadow-2xl space-y-6 backdrop-blur-xl">
            <h3 className="font-display font-bold text-lg text-white pb-3 border-b border-midnight-800">
              Order Summary
            </h3>

            {/* Event Summary Card */}
            <div className="flex gap-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-18 h-20 object-cover rounded-xl shadow-md flex-shrink-0"
              />
              <div className="min-w-0 space-y-1">
                <span className="text-[10px] font-mono text-cyber-cyan uppercase font-bold">
                  {event.subcategory}
                </span>
                <h4 className="font-display font-bold text-sm text-white truncate">{event.title}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  {event.date} • {event.startTime}
                </p>
                <p className="text-xs text-slate-500 truncate">📍 {event.venue}, {event.city}</p>
              </div>
            </div>

            {/* Selected Seats info */}
            {hasSelectedSeats && (
              <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 text-xs font-mono">
                <span className="text-slate-400 block mb-1">Reserved Seats ({cart.selectedSeats.length}):</span>
                <span className="text-cyber-cyan font-bold">
                  {cart.selectedSeats.map((s) => s.id).join(', ')}
                </span>
              </div>
            )}

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon: EXTRAORDINARY10"
                  className="flex-1 px-3 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-200 text-xs font-mono font-bold border border-midnight-700"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <span
                  className={`text-[11px] font-mono block ${
                    couponMessage.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {couponMessage.text}
                </span>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-4 border-t border-midnight-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>
                  {tier.name} × {effectiveQty}:
                </span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Demo Fee:</span>
                <span className="text-white">₹{demoFee}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({cart.discountPercent}%):</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-midnight-800">
                <span className="text-white">Final Total:</span>
                <span className="text-cyber-cyan font-mono text-lg">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Demo Booking Button */}
            <button
              onClick={handleCompleteOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan via-electric-500 to-electric-600 hover:from-white hover:to-cyber-cyan text-midnight-950 font-display font-extrabold text-sm tracking-wider uppercase transition-all shadow-glow-cyan transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Generating Demo Pass...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-midnight-950" />
                  <span>Confirm Demo Booking (₹{finalTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
