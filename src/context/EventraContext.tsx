import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Booking, CartState, EventItem, Seat, TicketTier } from '../types/event';
import { StorageService } from '../services/storageService';
import { EventService } from '../services/eventService';

interface EventraContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  wishlist: string[];
  toggleWishlist: (eventId: string) => boolean;
  isWishlisted: (eventId: string) => boolean;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (reference: string) => boolean;
  cart: CartState;
  setCartEvent: (event: EventItem) => void;
  setCartTier: (tier: TicketTier) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  toggleSeat: (seat: Seat) => void;
  setQuantity: (qty: number) => void;
  applyCouponCode: (code: string) => { valid: boolean; message: string };
  clearCart: () => void;
  is3DEnabled: boolean;
  toggle3DEnabled: () => void;
  refreshData: () => void;
}

const initialCart: CartState = {
  event: null,
  tier: null,
  selectedSeats: [],
  quantity: 1,
  couponCode: '',
  discountPercent: 0
};

const EventraContext = createContext<EventraContextType | undefined>(undefined);

export const EventraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>('All Cities');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [is3DEnabled, setIs3DEnabledState] = useState<boolean>(true);
  const [cart, setCart] = useState<CartState>(initialCart);

  const loadLocalState = () => {
    setSelectedCityState(StorageService.getSelectedCity());
    setWishlist(StorageService.getWishlist());
    setBookings(StorageService.getBookings());
    setIs3DEnabledState(StorageService.is3DEnabled());
  };

  useEffect(() => {
    loadLocalState();

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('eventra_')) {
        loadLocalState();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setSelectedCity = (city: string) => {
    StorageService.setSelectedCity(city);
    setSelectedCityState(city);
  };

  const toggleWishlist = (eventId: string): boolean => {
    const res = StorageService.toggleWishlist(eventId);
    setWishlist(StorageService.getWishlist());
    return res;
  };

  const isWishlisted = (eventId: string): boolean => {
    return wishlist.includes(eventId);
  };

  const addBooking = (booking: Booking) => {
    StorageService.saveBooking(booking);
    setBookings(StorageService.getBookings());
  };

  const cancelBooking = (reference: string): boolean => {
    const res = StorageService.cancelBooking(reference);
    if (res) {
      setBookings(StorageService.getBookings());
    }
    return res;
  };

  const toggle3DEnabled = () => {
    const nextVal = !is3DEnabled;
    StorageService.set3DEnabled(nextVal);
    setIs3DEnabledState(nextVal);
  };

  // Cart operations
  const setCartEvent = (event: EventItem) => {
    setCart({
      ...initialCart,
      event,
      tier: event.ticketTiers[0] || null
    });
  };

  const setCartTier = (tier: TicketTier) => {
    setCart((prev) => ({
      ...prev,
      tier,
      selectedSeats: [] // clear seats if switching tiers
    }));
  };

  const setSelectedSeats = (seats: Seat[]) => {
    setCart((prev) => ({
      ...prev,
      selectedSeats: seats,
      quantity: seats.length > 0 ? seats.length : prev.quantity
    }));
  };

  const toggleSeat = (seat: Seat) => {
    setCart((prev) => {
      const exists = prev.selectedSeats.some((s) => s.id === seat.id);
      let updatedSeats: Seat[];
      if (exists) {
        updatedSeats = prev.selectedSeats.filter((s) => s.id !== seat.id);
      } else {
        if (prev.selectedSeats.length >= 8) {
          alert('Maximum 8 tickets permitted per demo order.');
          return prev;
        }
        updatedSeats = [...prev.selectedSeats, { ...seat, status: 'selected' }];
      }
      return {
        ...prev,
        selectedSeats: updatedSeats,
        quantity: updatedSeats.length > 0 ? updatedSeats.length : 1
      };
    });
  };

  const setQuantity = (qty: number) => {
    setCart((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, qty))
    }));
  };

  const applyCouponCode = (code: string) => {
    const res = EventService.applyCoupon(code);
    if (res.valid) {
      setCart((prev) => ({
        ...prev,
        couponCode: code.toUpperCase(),
        discountPercent: res.discountPercent
      }));
    }
    return { valid: res.valid, message: res.message };
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  const value = useMemo(
    () => ({
      selectedCity,
      setSelectedCity,
      wishlist,
      toggleWishlist,
      isWishlisted,
      bookings,
      addBooking,
      cancelBooking,
      cart,
      setCartEvent,
      setCartTier,
      setSelectedSeats,
      toggleSeat,
      setQuantity,
      applyCouponCode,
      clearCart,
      is3DEnabled,
      toggle3DEnabled,
      refreshData: loadLocalState
    }),
    [selectedCity, wishlist, bookings, cart, is3DEnabled]
  );

  return <EventraContext.Provider value={value}>{children}</EventraContext.Provider>;
};

export const useEventra = (): EventraContextType => {
  const context = useContext(EventraContext);
  if (!context) {
    throw new Error('useEventra must be used within an EventraProvider');
  }
  return context;
};
