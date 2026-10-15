import { describe, it, expect } from 'vitest';
import { EVENTS_DATA } from '../data/events';
import { EventService } from '../services/eventService';

describe('Event Catalogue Data Integrity', () => {
  it('should contain a diverse catalogue of demonstration events', () => {
    expect(EVENTS_DATA.length).toBeGreaterThanOrEqual(8);
  });

  it('should ensure each event has unique ID, valid title, venue, and date in 2026+', () => {
    const ids = new Set<string>();
    EVENTS_DATA.forEach((e) => {
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      expect(e.title.trim().length).toBeGreaterThan(0);
      expect(e.venue.trim().length).toBeGreaterThan(0);
      expect(e.city.trim().length).toBeGreaterThan(0);
      expect(e.date).toMatch(/^202[6-9]-\d{2}-\d{2}$/);
      expect(e.ticketTiers.length).toBeGreaterThan(0);
    });
  });

  it('should ensure all ticket tiers have positive pricing and available capacity', () => {
    EVENTS_DATA.forEach((e) => {
      e.ticketTiers.forEach((tier) => {
        expect(tier.price).toBeGreaterThan(0);
        expect(tier.available).toBeGreaterThanOrEqual(0);
        expect(tier.total).toBeGreaterThan(0);
      });
    });
  });

  it('should support searching events by query across title and venue', () => {
    const hits = EventService.searchEvents({ query: 'Coldplay' });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title).toContain('Coldplay');
  });

  it('should filter events by category', () => {
    const sports = EventService.searchEvents({ category: 'sports' });
    expect(sports.length).toBeGreaterThan(0);
    sports.forEach((s) => {
      expect(s.category).toBe('sports');
    });
  });
});
