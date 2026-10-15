import { EVENTS_DATA } from '../data/events';
import { EventCategory, EventItem, Seat } from '../types/event';

export type EventSortOption = 'popularity' | 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';

export interface EventFilterOptions {
  query?: string;
  category?: EventCategory | 'all';
  city?: string;
  month?: string; // YYYY-MM
  maxPrice?: number;
  status?: string;
  hasSeatSelection?: boolean;
  sortBy?: EventSortOption;
}

export const EventService = {
  getAllEvents(): EventItem[] {
    return [...EVENTS_DATA];
  },

  getEventById(id: string): EventItem | undefined {
    return EVENTS_DATA.find((e) => e.id === id || e.slug === id);
  },

  getFeaturedEvents(): EventItem[] {
    return EVENTS_DATA.filter((e) => e.featured);
  },

  getTrendingEvents(): EventItem[] {
    return EVENTS_DATA.filter((e) => e.trending);
  },

  getEventsByCategory(category: EventCategory): EventItem[] {
    return EVENTS_DATA.filter((e) => e.category === category);
  },

  getEventsByDate(dateStr: string): EventItem[] {
    return EVENTS_DATA.filter((e) => e.date === dateStr);
  },

  searchEvents(options: EventFilterOptions): EventItem[] {
    let list = [...EVENTS_DATA];

    // Filter by text query
    if (options.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.subcategory.toLowerCase().includes(q) ||
          (e.performers && e.performers.some((p) => p.name.toLowerCase().includes(q))) ||
          (e.teams && (e.teams.home.toLowerCase().includes(q) || e.teams.away.toLowerCase().includes(q)))
      );
    }

    // Filter by category
    if (options.category && options.category !== 'all') {
      list = list.filter((e) => e.category === options.category);
    }

    // Filter by city
    if (options.city && options.city !== 'All Cities') {
      list = list.filter((e) => e.city.toLowerCase() === options.city!.toLowerCase());
    }

    // Filter by month (YYYY-MM)
    if (options.month) {
      list = list.filter((e) => e.date.startsWith(options.month!));
    }

    // Filter by max price
    if (options.maxPrice !== undefined && options.maxPrice > 0) {
      list = list.filter((e) => {
        const lowestPrice = Math.min(...e.ticketTiers.map((t) => t.price));
        return lowestPrice <= options.maxPrice!;
      });
    }

    // Filter by seat selection availability
    if (options.hasSeatSelection) {
      list = list.filter((e) => e.hasSeatSelection);
    }

    // Sorting
    switch (options.sortBy) {
      case 'date-asc':
        list.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case 'date-desc':
        list.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'price-asc':
        list.sort((a, b) => {
          const minA = Math.min(...a.ticketTiers.map((t) => t.price));
          const minB = Math.min(...b.ticketTiers.map((t) => t.price));
          return minA - minB;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          const maxA = Math.max(...a.ticketTiers.map((t) => t.price));
          const maxB = Math.max(...b.ticketTiers.map((t) => t.price));
          return maxB - maxA;
        });
        break;
      case 'popularity':
      default:
        list.sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
        break;
    }

    return list;
  },

  // Generates a mock venue seating map for an event
  generateVenueSeats(eventId: string, sectionName = 'Prime Tier'): Seat[] {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 12;

    // Use eventId characters to deterministically reserve certain seats
    rows.forEach((row, rIndex) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        const seatId = `${row}${num}`;
        // Deterministic mock status
        const pseudoRandom = (eventId.charCodeAt(0) * (rIndex + 1) + num * 7) % 10;
        let status: Seat['status'] = 'available';
        if (pseudoRandom === 1 || pseudoRandom === 4) {
          status = 'reserved';
        } else if (pseudoRandom === 8) {
          status = 'unavailable';
        }

        const basePrice = rIndex < 2 ? 2500 : rIndex < 4 ? 1800 : 1200;

        seats.push({
          id: seatId,
          section: sectionName,
          row,
          number: num,
          price: basePrice,
          status
        });
      }
    });

    return seats;
  },

  // Coupon validator
  applyCoupon(code: string): { valid: boolean; discountPercent: number; message: string } {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'EXTRAORDINARY10') {
      return { valid: true, discountPercent: 10, message: '10% Extraordinary Discount Applied!' };
    }
    if (normalized === 'WELCOME2026') {
      return { valid: true, discountPercent: 15, message: '15% Welcome 2026 Discount Applied!' };
    }
    return { valid: false, discountPercent: 0, message: 'Invalid or expired coupon code.' };
  },

  // Unique reference generator
  generateBookingReference(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `EVT-2026-${code}`;
  }
};
