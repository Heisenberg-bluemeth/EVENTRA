export type EventCategory =
  | 'concerts'
  | 'sports'
  | 'movies'
  | 'comedy'
  | 'theatre'
  | 'festivals'
  | 'gaming'
  | 'workshops';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  total: number;
  perks?: string[];
}

export interface Seat {
  id: string;
  section: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'selected' | 'reserved' | 'unavailable';
}

export interface Performer {
  name: string;
  role: string;
  avatar: string;
}

export interface MatchTeams {
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  tournament: string;
  round: string;
}

export interface MovieDetails {
  director: string;
  certification: string;
  language: string;
  formats: string[];
  showtimes: string[];
  screen: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: EventCategory;
  subcategory: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. '19:00'
  endTime?: string;
  city: string;
  venue: string;
  address: string;
  description: string;
  highlight: string;
  image: string;
  bannerImage: string;
  ticketTiers: TicketTier[];
  hasSeatSelection: boolean;
  status: 'upcoming' | 'selling-fast' | 'almost-full' | 'sold-out';
  featured: boolean;
  trending: boolean;
  rating: number;
  reviewsCount: number;
  ageRestriction: string;
  duration: string;
  rules: string[];
  performers?: Performer[];
  teams?: MatchTeams;
  movieDetails?: MovieDetails;
}

export interface AttendeeInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface Booking {
  reference: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  tierId?: string;
  tierName: string;
  seats: string[];
  quantity: number;
  attendee: AttendeeInfo;
  subtotal: number;
  fees: number;
  discount: number;
  couponCode?: string;
  total: number;
  bookingDate: number; // unix timestamp
  status: 'confirmed' | 'cancelled';
  qrCode: string;
}

export interface CartState {
  event: EventItem | null;
  tier: TicketTier | null;
  selectedSeats: Seat[];
  quantity: number;
  couponCode: string;
  discountPercent: number;
}
