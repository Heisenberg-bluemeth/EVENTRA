import { describe, it, expect } from 'vitest';
import { EventService } from '../services/eventService';

describe('Booking Engine & Seating Logic', () => {
  it('should validate and apply coupons accurately', () => {
    const valid10 = EventService.applyCoupon('EXTRAORDINARY10');
    expect(valid10.valid).toBe(true);
    expect(valid10.discountPercent).toBe(10);

    const valid15 = EventService.applyCoupon('WELCOME2026');
    expect(valid15.valid).toBe(true);
    expect(valid15.discountPercent).toBe(15);

    const invalid = EventService.applyCoupon('FAKEDISCOUNT99');
    expect(invalid.valid).toBe(false);
    expect(invalid.discountPercent).toBe(0);
  });

  it('should generate valid unique booking references with EVT-2026 prefix', () => {
    const ref1 = EventService.generateBookingReference();
    const ref2 = EventService.generateBookingReference();
    expect(ref1).toMatch(/^EVT-2026-[A-Z0-9]{5}$/);
    expect(ref2).toMatch(/^EVT-2026-[A-Z0-9]{5}$/);
    expect(ref1).not.toBe(ref2);
  });

  it('should generate deterministic seat map with available and reserved seats', () => {
    const seats = EventService.generateVenueSeats('evt-ipl-clash-2026');
    expect(seats.length).toBe(72); // 6 rows * 12 seats
    const available = seats.filter((s) => s.status === 'available');
    const reserved = seats.filter((s) => s.status === 'reserved');
    expect(available.length).toBeGreaterThan(0);
    expect(reserved.length).toBeGreaterThan(0);
  });
});
