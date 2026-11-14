export type EventCategory = 'PREMIERE_GALA' | 'AUDIO_LAUNCH' | 'FAN_MEET' | 'FESTIVAL_SCREENING' | 'PRESS_CONFERENCE';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  totalSeats: number;
  availableSeats: number;
  colorHex: string;
}

export interface CinemaEvent {
  id: string;
  title: string;
  movieId?: string;
  movieTitle?: string;
  category: EventCategory;
  tagline: string;
  description: string;
  bannerUrl: string;
  eventDate: string; // ISO string or readable date
  eventTime: string;
  venueName: string;
  city: string;
  mapCoordinates?: string;
  celebrityGuests: string[];
  organizer: string;
  ticketTiers: TicketTier[];
  status: 'UPCOMING' | 'SELLING_FAST' | 'HOUSEFULL' | 'COMPLETED';
}

export interface BookedTicketPass {
  bookingId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  city: string;
  tierId: string;
  tierName: string;
  ticketCount: number;
  totalAmount: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookingTimestamp: string;
  paymentMethod: 'UPI_QR' | 'CREDIT_CARD' | 'NET_BANKING';
  paymentReference: string;
  ticketHash: string;
  qrPayload: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'REFUND_REQUESTED' | 'REFUNDED';
}

export const INITIAL_EVENTS: CinemaEvent[] = [
  {
    id: 'evt-kalki-premiere',
    title: 'Kalki 2898 AD: Chapter 2 — Global IMAX Red Carpet Premiere',
    movieId: 'mv-001',
    movieTitle: 'Kalki 2898 AD: Chapter 2',
    category: 'PREMIERE_GALA',
    tagline: 'Witness the epochal world premiere with the director and ensemble cast.',
    description: 'The monumental world premiere of Kalki 2898 AD Part 2 at Prasads IMAX Hyderabad. Features live acoustic orchestral prelude by Santhosh Narayanan, holographic visual stage, and red carpet walk with the primary cast.',
    bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    eventDate: '2026-12-16',
    eventTime: '06:00 PM IST',
    venueName: 'Prasads IMAX Large Screen, Screen 1',
    city: 'Hyderabad, India',
    celebrityGuests: ['Nag Ashwin', 'Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
    organizer: 'Vyjayanthi Cinematic Citadel',
    status: 'SELLING_FAST',
    ticketTiers: [
      {
        id: 'tier-standard',
        name: 'Standard IMAX Pass',
        price: 999,
        perks: ['Single Entry', 'IMAX 70mm Digital Screen', 'Commemorative Film Lanyard'],
        totalSeats: 300,
        availableSeats: 48,
        colorHex: '#38BDF8'
      },
      {
        id: 'tier-fan-pit',
        name: 'Fan Pit & Stage Access',
        price: 2499,
        perks: ['Prime Center Row Seating', 'Red Carpet Fan Enclosure Access', 'Exclusive Collector Poster Book'],
        totalSeats: 150,
        availableSeats: 18,
        colorHex: '#F59E0B'
      },
      {
        id: 'tier-vip-carpet',
        name: 'VIP Red Carpet Premiere Suite',
        price: 5999,
        perks: ['Direct Red Carpet Walk', 'Pre-Show Executive Lounge Banquet', 'Official After-Party Invite with Cast'],
        totalSeats: 50,
        availableSeats: 6,
        colorHex: '#9333EA'
      }
    ]
  },
  {
    id: 'evt-vantaara-launch',
    title: 'Vantaara: The Blackwood Symphony — Live Audio & Trailer Launch',
    movieId: 'mv-002',
    movieTitle: 'Vantaara: Whispers of the Blackwood',
    category: 'AUDIO_LAUNCH',
    tagline: 'Immersive 7.1.4 Dolby Atmos orchestral concert and theatrical trailer unveil.',
    description: 'An acoustic soundscape immersion featuring 40 live tribal instruments, classical strings, and the premier theatrical trailer projection on a 120-foot outdoor screen.',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    eventDate: '2026-11-24',
    eventTime: '07:30 PM IST',
    venueName: 'Gachibowli Stadium Open Amphitheatre',
    city: 'Hyderabad, India',
    celebrityGuests: ['Kiran Sharma', 'Aditi Rao', 'Vikram Menon', 'AR Rahman Sound Ensemble'],
    organizer: 'CineVantaara Studio Originals',
    status: 'UPCOMING',
    ticketTiers: [
      {
        id: 'tier-lawn',
        name: 'Open Lawn Acoustic Pass',
        price: 499,
        perks: ['Open Amphitheatre Seating', 'Live Concert Access'],
        totalSeats: 1000,
        availableSeats: 340,
        colorHex: '#10B981'
      },
      {
        id: 'tier-stage-vip',
        name: 'Stage Front Acoustic Pass',
        price: 1499,
        perks: ['Front 5 Rows Seating', 'Spatial Audio Headphones Demo', 'Exclusive Soundtrack Vinyl Voucher'],
        totalSeats: 250,
        availableSeats: 52,
        colorHex: '#F59E0B'
      }
    ]
  },
  {
    id: 'evt-salaar-fanmeet',
    title: 'Salaar Part 2: Khansaar War Council — Fan Meet & Stunt Breakdown',
    movieId: 'mv-003',
    movieTitle: 'Salaar Part 2: Shouryaanga Parvam',
    category: 'FAN_MEET',
    tagline: 'Live stunt exhibition with the Hollywood action crew and director Prashanth Neel.',
    description: 'Exclusive masterclass and behind-the-scenes showcase featuring live stunt demonstrations, wirework rigging analysis, and high-octane dialogue teasers with the action choreographers.',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
    eventDate: '2026-11-18',
    eventTime: '05:00 PM IST',
    venueName: 'JRC Convention Center, Hall 1',
    city: 'Hyderabad, India',
    celebrityGuests: ['Prashanth Neel', 'Prabhas', 'Bhuvan Gowda', 'Stunt Masters Guild'],
    organizer: 'Hombale Films Escrow',
    status: 'SELLING_FAST',
    ticketTiers: [
      {
        id: 'tier-action-arena',
        name: 'Action Arena Stalls',
        price: 799,
        perks: ['Arena Floor Seating', 'Action Choreography Handbook', 'Q&A Participation'],
        totalSeats: 500,
        availableSeats: 85,
        colorHex: '#EF4444'
      },
      {
        id: 'tier-guild-vip',
        name: 'Guild Front Row VIP',
        price: 2999,
        perks: ['Front Row Table', 'Meet & Greet Photo with Stunt Team', 'Commemorative Khansaar Dagger Replica'],
        totalSeats: 80,
        availableSeats: 9,
        colorHex: '#F59E0B'
      }
    ]
  }
];

export function getStoredEvents(): CinemaEvent[] {
  try {
    const raw = localStorage.getItem('cv_cinema_events');
    if (!raw) {
      localStorage.setItem('cv_cinema_events', JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENTS;
  } catch (e) {
    return INITIAL_EVENTS;
  }
}

export function saveEvent(ev: CinemaEvent): CinemaEvent {
  const current = getStoredEvents();
  const idx = current.findIndex(e => e.id === ev.id);
  let updated: CinemaEvent[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = ev;
  } else {
    updated = [ev, ...current];
  }
  try {
    localStorage.setItem('cv_cinema_events', JSON.stringify(updated));
  } catch (e) {}
  return ev;
}

export function deleteEvent(id: string): boolean {
  const current = getStoredEvents();
  const next = current.filter(e => e.id !== id);
  try {
    localStorage.setItem('cv_cinema_events', JSON.stringify(next));
    return true;
  } catch (e) {
    return false;
  }
}

// =========================================================================
// TICKET BOOKINGS & PASS WALLET
// =========================================================================

export function getUserTicketPasses(userEmail?: string): BookedTicketPass[] {
  try {
    const raw = localStorage.getItem('cv_event_bookings');
    const all: BookedTicketPass[] = raw ? JSON.parse(raw) : [];
    if (!userEmail) return all;
    return all.filter(t => t.attendeeEmail.toLowerCase() === userEmail.toLowerCase().trim());
  } catch (e) {
    return [];
  }
}

export function bookTicketPass(
  event: CinemaEvent,
  tier: TicketTier,
  count: number,
  attendee: { name: string; email: string; phone: string },
  paymentMethod: 'UPI_QR' | 'CREDIT_CARD' | 'NET_BANKING'
): BookedTicketPass {
  const bookingId = `CV-PASS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const ticketHash = `SHA256_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  const qrPayload = JSON.stringify({
    passId: bookingId,
    eventId: event.id,
    eventTitle: event.title,
    venue: event.venueName,
    date: event.eventDate,
    time: event.eventTime,
    tier: tier.name,
    count: count,
    attendee: attendee.name,
    hash: ticketHash,
    citadelCertified: true
  });

  const newPass: BookedTicketPass = {
    bookingId,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.eventDate,
    eventTime: event.eventTime,
    venueName: event.venueName,
    city: event.city,
    tierId: tier.id,
    tierName: tier.name,
    ticketCount: count,
    totalAmount: tier.price * count,
    attendeeName: attendee.name,
    attendeeEmail: attendee.email,
    attendeePhone: attendee.phone,
    bookingTimestamp: new Date().toISOString(),
    paymentMethod,
    paymentReference: `PAY-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`,
    ticketHash,
    qrPayload,
    status: 'CONFIRMED'
  };

  try {
    const raw = localStorage.getItem('cv_event_bookings');
    const all: BookedTicketPass[] = raw ? JSON.parse(raw) : [];
    all.unshift(newPass);
    localStorage.setItem('cv_event_bookings', JSON.stringify(all));

    // Decrement available seats in event
    const events = getStoredEvents();
    const evIdx = events.findIndex(e => e.id === event.id);
    if (evIdx >= 0) {
      const tierIdx = events[evIdx].ticketTiers.findIndex(t => t.id === tier.id);
      if (tierIdx >= 0) {
        events[evIdx].ticketTiers[tierIdx].availableSeats = Math.max(
          0,
          events[evIdx].ticketTiers[tierIdx].availableSeats - count
        );
        saveEvent(events[evIdx]);
      }
    }
  } catch (e) {}

  return newPass;
}

export function requestTicketRefund(bookingId: string): boolean {
  try {
    const raw = localStorage.getItem('cv_event_bookings');
    const all: BookedTicketPass[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(b => b.bookingId === bookingId);
    if (idx >= 0) {
      all[idx].status = 'REFUND_REQUESTED';
      localStorage.setItem('cv_event_bookings', JSON.stringify(all));
      return true;
    }
  } catch (e) {}
  return false;
}

export function validateTicketQr(qrData: string): { valid: boolean; pass?: BookedTicketPass; message: string } {
  try {
    let payload = JSON.parse(qrData);
    const passId = payload.passId || payload.bookingId;
    const all = getUserTicketPasses();
    const pass = all.find(p => p.bookingId === passId);
    if (!pass) {
      return { valid: false, message: 'Invalid Ticket QR. No matching pass found in Citadel Ledger.' };
    }
    if (pass.status === 'REFUNDED' || pass.status === 'REFUND_REQUESTED') {
      return { valid: false, pass, message: `Access Denied: Ticket was cancelled or refunded (${pass.status}).` };
    }
    if (pass.status === 'CHECKED_IN') {
      return { valid: false, pass, message: 'Warning: This ticket pass has ALREADY BEEN CHECKED IN.' };
    }
    
    // Mark as checked in
    pass.status = 'CHECKED_IN';
    localStorage.setItem('cv_event_bookings', JSON.stringify(all));
    return { valid: true, pass, message: `Access Approved! Welcome, ${pass.attendeeName} (${pass.tierName} x ${pass.ticketCount}).` };
  } catch (e) {
    return { valid: false, message: 'Corrupted or unreadable QR code payload.' };
  }
}
