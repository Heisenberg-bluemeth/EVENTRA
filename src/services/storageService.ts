import { Booking } from '../types/event';

const STORAGE_KEYS = {
  WISHLIST: 'eventra_wishlist',
  BOOKINGS: 'eventra_bookings',
  SELECTED_CITY: 'eventra_selected_city',
  THREE_D_ENABLED: 'eventra_3d_enabled',
};

export const StorageService = {
  // Wishlist
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isWishlisted(eventId: string): boolean {
    return this.getWishlist().includes(eventId);
  },

  toggleWishlist(eventId: string): boolean {
    const list = this.getWishlist();
    const index = list.indexOf(eventId);
    let isNowSaved = false;
    if (index >= 0) {
      list.splice(index, 1);
      isNowSaved = false;
    } else {
      list.push(eventId);
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    return isNowSaved;
  },

  // Bookings (Ticket Wallet)
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooking(booking: Booking): void {
    const list = this.getBookings();
    list.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
  },

  getBookingByReference(reference: string): Booking | undefined {
    return this.getBookings().find((b) => b.reference === reference);
  },

  cancelBooking(reference: string): boolean {
    const list = this.getBookings();
    const target = list.find((b) => b.reference === reference);
    if (target) {
      target.status = 'cancelled';
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  // City Preference
  getSelectedCity(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CITY) || 'All Cities';
  },

  setSelectedCity(city: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITY, city);
  },

  // 3D Quality Toggle
  is3DEnabled(): boolean {
    const val = localStorage.getItem(STORAGE_KEYS.THREE_D_ENABLED);
    if (val === null) {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return !prefersReduced;
      }
      return true;
    }
    return val === 'true';
  },

  set3DEnabled(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.THREE_D_ENABLED, String(enabled));
  },

  // Clear demo data
  clearAllDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  }
};
