import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { Booking } from '../types/event';

// Polyfill localStorage for node environment
if (typeof globalThis.localStorage === 'undefined') {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: 0
  } as any;
}

describe('StorageService (LocalStorage Persistence)', () => {
  beforeEach(() => {
    StorageService.clearAllDemoData();
  });

  it('should toggle wishlist events correctly', () => {
    expect(StorageService.isWishlisted('evt-coldplay-cosmic-2026')).toBe(false);

    const added = StorageService.toggleWishlist('evt-coldplay-cosmic-2026');
    expect(added).toBe(true);
    expect(StorageService.isWishlisted('evt-coldplay-cosmic-2026')).toBe(true);
    expect(StorageService.getWishlist()).toContain('evt-coldplay-cosmic-2026');

    const removed = StorageService.toggleWishlist('evt-coldplay-cosmic-2026');
    expect(removed).toBe(false);
    expect(StorageService.isWishlisted('evt-coldplay-cosmic-2026')).toBe(false);
  });

  it('should save booking and support demo cancellation', () => {
    const mockBooking: Booking = {
      reference: 'EVT-2026-TEST1',
      eventId: 'evt-ipl-clash-2026',
      eventTitle: 'IPL Champions Clash',
      eventCategory: 'sports',
      eventDate: '2026-10-28',
      eventTime: '19:30',
      venue: 'Wankhede Stadium',
      city: 'Mumbai',
      tierName: 'Sunil Gavaskar Stand',
      seats: ['A1', 'A2'],
      quantity: 2,
      attendee: { fullName: 'Test User', email: 'test@domain.com', phone: '1234567890' },
      subtotal: 3600,
      fees: 150,
      discount: 0,
      total: 3750,
      bookingDate: Date.now(),
      status: 'confirmed',
      qrCode: 'EVT-QR-TEST1'
    };

    StorageService.saveBooking(mockBooking);
    expect(StorageService.getBookings().length).toBe(1);

    const retrieved = StorageService.getBookingByReference('EVT-2026-TEST1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe('confirmed');

    const cancelled = StorageService.cancelBooking('EVT-2026-TEST1');
    expect(cancelled).toBe(true);
    expect(StorageService.getBookingByReference('EVT-2026-TEST1')?.status).toBe('cancelled');
  });

  it('should persist selected city preference', () => {
    expect(StorageService.getSelectedCity()).toBe('All Cities');
    StorageService.setSelectedCity('London');
    expect(StorageService.getSelectedCity()).toBe('London');
  });
});
