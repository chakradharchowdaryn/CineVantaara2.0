import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getStoredEvents,
  getUserTicketPasses,
  bookTicketPass,
  requestTicketRefund,
  validateTicketQr,
  CinemaEvent,
  TicketTier,
  BookedTicketPass
} from '../services/eventBookingService';
import { QrCodeSvg } from '../components/common/QrCodeSvg';
import confetti from 'canvas-confetti';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  X,
  Search,
  Filter,
  Eye,
  Check,
  ScanLine
} from 'lucide-react';

export const EventBookingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentSkinConfig } = useTheme();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active top tab: "EVENTS" or "WALLET" or "SCANNER"
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'WALLET' | 'SCANNER'>(() => {
    return searchParams.get('tab') === 'wallet' ? 'WALLET' : 'EVENTS';
  });

  const [events, setEvents] = useState<CinemaEvent[]>(() => getStoredEvents());
  const [myTickets, setMyTickets] = useState<BookedTicketPass[]>(() =>
    getUserTicketPasses(currentUser?.email)
  );

  // Selected event for booking modal
  const [bookingEvent, setBookingEvent] = useState<CinemaEvent | null>(null);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState(currentUser?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(currentUser?.email || '');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'CREDIT_CARD' | 'NET_BANKING'>('UPI_QR');

  // Checkout modal stages: "DETAILS" | "PAYMENT" | "SUCCESS"
  const [checkoutStep, setCheckoutStep] = useState<'DETAILS' | 'PAYMENT' | 'SUCCESS'>('DETAILS');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<BookedTicketPass | null>(null);

  // QR Gate Scanner State
  const [scannerInput, setScannerInput] = useState('');
  const [scannerResult, setScannerResult] = useState<{ valid: boolean; message: string; pass?: BookedTicketPass } | null>(null);

  // If query parameter eventId is provided, auto-open booking modal
  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (eventId) {
      const target = events.find(e => e.id === eventId);
      if (target) {
        setBookingEvent(target);
        setSelectedTier(target.ticketTiers[0]);
        setCheckoutStep('DETAILS');
      }
    }
  }, [searchParams, events]);

  // Refresh my tickets
  const reloadTickets = () => {
    setMyTickets(getUserTicketPasses(currentUser?.email));
    setEvents(getStoredEvents());
  };

  const startBooking = (ev: CinemaEvent) => {
    setBookingEvent(ev);
    setSelectedTier(ev.ticketTiers[0]);
    setTicketQuantity(1);
    setAttendeeName(currentUser?.name || '');
    setAttendeeEmail(currentUser?.email || '');
    setCheckoutStep('DETAILS');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEvent || !selectedTier) return;
    setCheckoutStep('PAYMENT');
  };

  const handleExecutePayment = async () => {
    if (!bookingEvent || !selectedTier) return;
    setIsProcessingPayment(true);

    // Simulate authentic payment processing with gateway handshake
    await new Promise(res => setTimeout(res, 1400));

    const pass = bookTicketPass(
      bookingEvent,
      selectedTier,
      ticketQuantity,
      {
        name: attendeeName || 'CinePass Attendee',
        email: attendeeEmail || 'attendee@gmail.com',
        phone: attendeePhone || '+91 98765 43210'
      },
      paymentMethod
    );

    setIsProcessingPayment(false);
    setGeneratedPass(pass);
    setCheckoutStep('SUCCESS');
    reloadTickets();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleRefund = (bookingId: string) => {
    if (window.confirm('Are you sure you want to request a full refund for this pass?')) {
      requestTicketRefund(bookingId);
      reloadTickets();
    }
  };

  const handleScanTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;
    const res = validateTicketQr(scannerInput.trim());
    setScannerResult(res);
    reloadTickets();
  };

  return (
    <div className="min-h-screen pb-24 text-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
      
      {/* 1. TOP HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-black"
              style={{ backgroundColor: currentSkinConfig.primary }}
            >
              PHASE 9 • TICKETING LEDGER
            </span>
            <span className="text-xs text-gray-400 font-mono">Real-Time Escrow & QR Passes</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-cinematic uppercase tracking-wide text-white">
            Pre-Release Gala & Events
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Book official audio launches, red-carpet world premieres, fan meets, and festival screenings with instant cryptographic QR tickets.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'EVENTS'
                ? 'text-black shadow-lg font-cinematic'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
            style={{
              backgroundColor: activeTab === 'EVENTS' ? currentSkinConfig.primary : undefined
            }}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Galas ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('WALLET')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'WALLET'
                ? 'text-black shadow-lg font-cinematic'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
            style={{
              backgroundColor: activeTab === 'WALLET' ? currentSkinConfig.primary : undefined
            }}
          >
            <Ticket className="w-4 h-4" />
            <span>My Cinema Passes ({myTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'SCANNER'
                ? 'text-black shadow-lg font-cinematic'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
            style={{
              backgroundColor: activeTab === 'SCANNER' ? currentSkinConfig.primary : undefined
            }}
          >
            <ScanLine className="w-4 h-4" />
            <span>Gate Validator</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: EVENT LISTINGS */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map(ev => {
              const lowestPrice = Math.min(...ev.ticketTiers.map(t => t.price));
              const totalRemaining = ev.ticketTiers.reduce((acc, t) => acc + t.availableSeats, 0);

              return (
                <div
                  key={ev.id}
                  className="rounded-3xl bg-[#0b0c10] border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xl group hover:-translate-y-1.5"
                  style={{
                    boxShadow: `0 10px 30px -10px ${currentSkinConfig.primary}20`
                  }}
                >
                  {/* Event Banner */}
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={ev.bannerUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300 uppercase shadow">
                        {ev.category.replace('_', ' ')}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-black shadow"
                        style={{ backgroundColor: currentSkinConfig.primary }}
                      >
                        From ₹{lowestPrice}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-xs text-gray-300 font-mono flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.eventDate} • {ev.eventTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold font-cinematic uppercase tracking-wide text-white group-hover:text-amber-300 transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-amber-400/90 italic font-serif">
                        "{ev.tagline}"
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    {/* Venue & Guests */}
                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{ev.venueName}, {ev.city}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">Guests: {ev.celebrityGuests.join(', ')}</span>
                      </div>
                    </div>

                    {/* Tiers Preview & Booking Button */}
                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-gray-400">Seats Available</span>
                        <span className="text-emerald-400 font-bold">{totalRemaining} Passes Left</span>
                      </div>

                      <button
                        onClick={() => startBooking(ev)}
                        className="w-full py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center space-x-2 transition-all hover:brightness-110 shadow-lg"
                        style={{ backgroundColor: currentSkinConfig.primary }}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Reserve Passes Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB 2: MY CINEMA PASSES WALLET */}
      {activeTab === 'WALLET' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-cinematic font-bold uppercase text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Digital Cinema Passes Wallet ({myTickets.length})</span>
            </h2>
            <button
              onClick={reloadTickets}
              className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              Refresh Passes
            </button>
          </div>

          {myTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTickets.map(pass => (
                <div
                  key={pass.bookingId}
                  className="rounded-3xl bg-[#0e0f14] border border-amber-500/30 p-6 space-y-5 shadow-2xl relative overflow-hidden"
                  style={{
                    boxShadow: `0 10px 30px -10px ${currentSkinConfig.primary}30`
                  }}
                >
                  {/* Watermark Logo */}
                  <div className="absolute -right-8 -bottom-8 opacity-5 text-9xl font-black font-cinematic text-white pointer-events-none">
                    CV
                  </div>

                  {/* Top Header */}
                  <div className="flex items-start justify-between border-b border-dashed border-white/15 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                        CineVantaara Official Pass
                      </span>
                      <h3 className="text-lg font-bold font-cinematic text-white uppercase mt-0.5">
                        {pass.eventTitle}
                      </h3>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span>{pass.eventDate}</span>
                        <span>•</span>
                        <span>{pass.eventTime}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      pass.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : pass.status === 'CHECKED_IN'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {pass.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Pass Details + QR Code Side by Side */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* SVG QR Pass */}
                    <div className="flex flex-col items-center space-y-1">
                      <QrCodeSvg
                        value={pass.qrPayload}
                        size={120}
                        fgColor={currentSkinConfig.primary}
                        bgColor="#070709"
                      />
                      <span className="text-[9px] font-mono text-gray-500 uppercase">
                        Gate Scan Token
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 text-xs flex-1 min-w-0">
                      <div>
                        <span className="text-gray-500 font-mono block text-[10px] uppercase">Tier & Seats</span>
                        <span className="font-bold text-amber-300">{pass.tierName} • {pass.ticketCount} Attendee(s)</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-mono block text-[10px] uppercase">Venue Location</span>
                        <span className="text-gray-200 truncate block">{pass.venueName}, {pass.city}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-mono block text-[10px] uppercase">Attendee Name</span>
                        <span className="font-bold text-white">{pass.attendeeName} ({pass.attendeeEmail})</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-mono block text-[10px] uppercase">Booking ID & Reference</span>
                        <span className="text-gray-400 font-mono text-[11px]">{pass.bookingId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pass Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-dashed border-white/15">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Amount Paid: ₹{pass.totalAmount.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Print Pass</span>
                      </button>

                      {pass.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleRefund(pass.bookingId)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/30 transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Cancel & Refund</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-3">
              <Ticket className="w-12 h-12 text-gray-600 mx-auto" />
              <div className="text-base font-bold text-white">Your Pass Wallet is Empty</div>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                You haven't reserved any cinema passes yet. Explore upcoming pre-release galas to book your digital ticket!
              </p>
              <button
                onClick={() => setActiveTab('EVENTS')}
                className="mt-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-black font-cinematic"
                style={{ backgroundColor: currentSkinConfig.primary }}
              >
                Browse Upcoming Events
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 3: GATE SCANNER / VALIDATOR */}
      {activeTab === 'SCANNER' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e0f14] border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ScanLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cinematic uppercase text-white">
                  Citadel Gate Security Entry Scanner
                </h3>
                <p className="text-xs text-gray-400">
                  Event organizers can paste or scan any ticket QR payload or Booking ID to verify access live.
                </p>
              </div>
            </div>

            <form onSubmit={handleScanTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                  Paste Ticket QR Code Payload / Booking ID
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder='Paste the QR JSON payload (e.g. {"passId":"CV-PASS-..."}) or simply enter the Booking ID...'
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center space-x-2 transition shadow-lg"
                style={{ backgroundColor: currentSkinConfig.primary }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Gate Clearance</span>
              </button>
            </form>

            {scannerResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                scannerResult.valid
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scannerResult.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span>{scannerResult.message}</span>
                </div>

                {scannerResult.pass && (
                  <div className="pt-2 border-t border-white/10 text-xs space-y-1 font-mono">
                    <div>Attendee: <strong className="text-white">{scannerResult.pass.attendeeName}</strong></div>
                    <div>Event: <strong className="text-white">{scannerResult.pass.eventTitle}</strong></div>
                    <div>Tier: <strong className="text-amber-300">{scannerResult.pass.tierName}</strong></div>
                    <div>Total Seats: <strong className="text-white">{scannerResult.pass.ticketCount}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TICKET BOOKING & CHECKOUT MODAL */}
      {bookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/20 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setBookingEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                Official Reservation Gateway
              </span>
              <h2 className="text-xl font-bold font-cinematic uppercase tracking-wide text-white mt-0.5">
                {bookingEvent.title}
              </h2>
              <div className="text-xs text-gray-400 mt-1">
                {bookingEvent.eventDate} • {bookingEvent.eventTime} • {bookingEvent.venueName}
              </div>
            </div>

            {/* STEP 1: SELECTION & ATTENDEE FORM */}
            {checkoutStep === 'DETAILS' && (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                
                {/* Tier Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                    1. Select Ticket Tier
                  </label>
                  <div className="space-y-2">
                    {bookingEvent.ticketTiers.map(tier => (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedTier?.id === tier.id
                            ? 'bg-amber-500/15 border-amber-400 shadow-md'
                            : 'bg-black/40 border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{tier.name}</span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {tier.availableSeats} Left
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {tier.perks.join(' • ')}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-amber-300 font-mono">₹{tier.price.toLocaleString()}</div>
                          <span className="text-[10px] text-gray-500">per ticket</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                    2. Quantity (Max 5)
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-bold text-amber-400">{ticketQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(q => Math.min(5, q + 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Attendee Form */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                    3. Attendee Information
                  </label>
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Gmail Address (Ticket Pass Dispatched Here)"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone Number (+91 ...)"
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Subtotal & Proceed Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Grand Total</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      ₹{selectedTier ? (selectedTier.price * ticketQuantity).toLocaleString() : 0}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center space-x-2 transition shadow-lg hover:brightness-110"
                    style={{ backgroundColor: currentSkinConfig.primary }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT GATEWAY SIMULATION */}
            {checkoutStep === 'PAYMENT' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Selected Event</span>
                    <span className="font-bold text-white">{bookingEvent.title}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Pass Tier</span>
                    <span className="font-bold text-amber-300">{selectedTier?.name} x {ticketQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 font-mono">
                    <span className="text-gray-300">Total Payable</span>
                    <span className="text-emerald-400">₹{selectedTier ? (selectedTier.price * ticketQuantity).toLocaleString() : 0}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                    Select Secure Payment Rail
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UPI_QR', label: 'UPI / QR', icon: QrCode },
                      { id: 'CREDIT_CARD', label: 'Card / EMI', icon: CreditCard },
                      { id: 'NET_BANKING', label: 'NetBanking', icon: ShieldCheck }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === m.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span className="text-[11px] font-mono">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Visual Mock */}
                {paymentMethod === 'UPI_QR' && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center space-y-2">
                    <QrCodeSvg
                      value={`upi://pay?pa=cinevantaara@icici&pn=CineVantaara&am=${selectedTier?.price! * ticketQuantity}&cu=INR`}
                      size={110}
                      fgColor="#10B981"
                      bgColor="#000"
                    />
                    <span className="text-[10px] text-gray-400 font-mono">
                      Scan using Google Pay, PhonePe, or Paytm
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('DETAILS')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-gray-400 hover:text-white"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleExecutePayment}
                    className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center space-x-2 transition shadow-lg hover:brightness-110"
                    style={{ backgroundColor: currentSkinConfig.primary }}
                  >
                    {isProcessingPayment ? (
                      <span>Verifying Escrow Payment...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize ₹{selectedTier ? (selectedTier.price * ticketQuantity).toLocaleString() : 0}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TICKET PASS CONFIRMED */}
            {checkoutStep === 'SUCCESS' && generatedPass && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-cinematic text-white uppercase">
                    Pass Confirmed & Issued!
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Your official ticket pass has been added to your Cinema Pass Wallet.
                  </p>
                </div>

                {/* Pass Preview Stub */}
                <div className="p-5 rounded-2xl bg-[#14151b] border border-amber-500/40 text-left space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-dashed border-white/10 pb-3">
                    <div>
                      <span className="text-amber-400 font-mono text-[10px] block">Booking Ref</span>
                      <strong className="text-white font-mono">{generatedPass.bookingId}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      VERIFIED PASS
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <QrCodeSvg
                      value={generatedPass.qrPayload}
                      size={100}
                      fgColor={currentSkinConfig.primary}
                      bgColor="#000"
                    />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white">{generatedPass.eventTitle}</div>
                      <div className="text-[11px] text-amber-300 font-mono">{generatedPass.tierName} • {generatedPass.ticketCount} Seat(s)</div>
                      <div className="text-[11px] text-gray-400">{generatedPass.eventDate} at {generatedPass.eventTime}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setBookingEvent(null);
                      setActiveTab('WALLET');
                    }}
                    className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black transition shadow-lg hover:brightness-110"
                    style={{ backgroundColor: currentSkinConfig.primary }}
                  >
                    View in Pass Wallet
                  </button>
                  <button
                    onClick={() => setBookingEvent(null)}
                    className="px-5 py-3 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
