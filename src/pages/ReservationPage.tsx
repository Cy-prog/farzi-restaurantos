import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Music,
  Wine,
  Flame,
  Award,
  Gift,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Reservation, FarziEvent } from '../types';
import { PageTransition } from '../components/motion/PageTransition';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { soundFX } from '../utils/soundEffects';

const FARZI_SIGNATURE_EVENTS: FarziEvent[] = [
  {
    id: 'sufi-night',
    title: 'Farzi Sufi Nights — Live Acoustic & Fusion Band',
    category: 'LIVE MUSIC & SUFI FUSION',
    tag: 'MOST POPULAR · EVERY FRIDAY',
    dateText: 'Every Friday Night',
    time: '21:00',
    description: 'High-energy live Sufi fusion musicians with dhol, percussion, and soulful Awadhi acoustic vocals alongside progressive tapas and cryo cocktail service.',
    inclusions: [
      'Stage-view table priority',
      'Complimentary cryogenic welcome elixir',
      'Curated chef tapas menu access'
    ],
    priceText: 'Complimentary entry with table booking (₹1,500 min spend)',
    image: '/dining-ambience.jpg',
    badgeColor: '#E5B869'
  },
  {
    id: 'mixology-masterclass',
    title: 'Molecular Mixology & Cryo Masterclass',
    category: 'HANDS-ON WORKSHOP',
    tag: 'LIMITED 12 GUESTS · SUNDAYS',
    dateText: 'Every Sunday Afternoon',
    time: '17:00',
    description: 'Hands-on bar alchemy session with Farzi chief mixologist. Craft smoke-infused elixirs, edible spherification caviar, and -196°C cryo foams.',
    inclusions: [
      '3 craft molecular cocktails created by you',
      'Hands-on spherification & liquid nitrogen tools',
      'Farzi Mixology Monograph & certificate'
    ],
    priceText: '₹1,850 per guest (Includes ingredients & tasting flight)',
    image: '/apple-foamintini.jpg',
    badgeColor: '#60A5FA'
  },
  {
    id: 'chefs-illusion-table',
    title: "Chef Zorawar's Sensory Illusion Table",
    category: "CHEF'S TASTING THEATRE",
    tag: 'EXCLUSIVE 8-COURSE JOURNEY',
    dateText: 'Daily Dinner Service',
    time: '20:00',
    description: 'An intimate 8-course culinary illusion journey curated with tableside cloche reveals, dry ice theatre, and deconstructed royal recipes.',
    inclusions: [
      '8-course bespoke sensory tasting menu',
      'Tableside cloche reveals & chef interactions',
      'Paired molecular beverage flights'
    ],
    priceText: '₹2,950 per guest (Strict reservation required)',
    image: '/chef-plating.jpg',
    badgeColor: '#34D399'
  },
  {
    id: 'vip-celebration',
    title: 'Bespoke Celebration & Anniversary Gala',
    category: 'PRIVATE DINING & CELEBRATIONS',
    tag: 'VIP HOSPITALITY',
    dateText: 'Custom Date & Time',
    time: '20:00',
    description: 'Turn your milestone celebration into pure sensory theatre with personalized nitrogen dessert presentation, floral table setup, and custom menus.',
    inclusions: [
      'Complimentary Farzi cryogenic celebration dessert',
      'Reserved private alcove or mezzanine chamber',
      'Personalized commemorative menu prints'
    ],
    priceText: 'A la carte dining with complimentary VIP celebration setup',
    image: '/tres-leches.jpg',
    badgeColor: '#F472B6'
  }
];

export const ReservationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'dining' | 'events'>(
    tabParam === 'events' || eventParam ? 'events' : 'dining'
  );
  const [selectedEvent, setSelectedEvent] = useState<FarziEvent | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reservationDate, setReservationDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [reservationTime, setReservationTime] = useState('20:00');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState('Main Dining Chamber');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Standard Dining');
  const [specialRequest, setSpecialRequest] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle URL pre-selection of event
  useEffect(() => {
    if (eventParam) {
      const match = FARZI_SIGNATURE_EVENTS.find(
        (ev) => ev.id === eventParam || ev.title.toLowerCase().includes(eventParam.toLowerCase())
      );
      if (match) {
        handleSelectEvent(match);
      }
    }
  }, [eventParam]);

  // Live Availability Check
  const [availability, setAvailability] = useState<{
    checking: boolean;
    available: boolean;
    count: number;
    message: string;
  }>({
    checking: false,
    available: true,
    count: 12,
    message: 'Tables available for your selected party'
  });

  useEffect(() => {
    let isCurrent = true;
    const checkSlot = async () => {
      setAvailability((prev) => ({ ...prev, checking: true }));
      try {
        const res = await api.checkTableAvailability(reservationDate, reservationTime, guests);
        if (isCurrent) {
          setAvailability({
            checking: false,
            available: res.available,
            count: res.suitableTablesCount,
            message: res.message
          });
        }
      } catch {
        if (isCurrent) {
          setAvailability((prev) => ({ ...prev, checking: false }));
        }
      }
    };
    checkSlot();
    return () => {
      isCurrent = false;
    };
  }, [reservationDate, reservationTime, guests]);

  const TIME_SLOTS = [
    { label: 'Lunch Service', times: ['12:30', '13:00', '13:30', '14:00', '14:30'] },
    { label: 'Dinner & Mixology', times: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'] },
  ];

  const handleSelectEvent = (event: FarziEvent) => {
    setSelectedEvent(event);
    setSelectedOccasion(event.title);
    setReservationTime(event.time);
    if (event.id === 'sufi-night') {
      setSeatingPreference('Stage-Facing Live Chamber');
    } else if (event.id === 'mixology-masterclass') {
      setSeatingPreference('Mixology Alchemy Bar');
    } else if (event.id === 'chefs-illusion-table') {
      setSeatingPreference('Private Enclave');
    }
    soundFX.playWhoosh();

    // Scroll smoothly down to the booking form
    setTimeout(() => {
      const formEl = document.getElementById('booking-form-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClearEvent = () => {
    setSelectedEvent(null);
    setSelectedOccasion('Standard Dining');
    setSeatingPreference('Main Dining Chamber');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !reservationDate || !reservationTime || !guests) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const occasionPrefix = selectedOccasion && selectedOccasion !== 'Standard Dining'
        ? `[Experience: ${selectedOccasion}]`
        : '';
      const preferencePrefix = seatingPreference
        ? `[Chamber: ${seatingPreference}]`
        : '';
      const fullRequest = [occasionPrefix, preferencePrefix, specialRequest].filter(Boolean).join(' ');

      const res = await api.createReservation({
        name,
        phone,
        email,
        reservationDate,
        reservationTime,
        guests,
        specialRequest: fullRequest,
        eventType: selectedEvent ? 'SUFI_NIGHT' : 'DINING',
        eventName: selectedEvent?.title || (selectedOccasion !== 'Standard Dining' ? selectedOccasion : undefined),
        seatingPreference
      });
      setConfirmedBooking(res);
      soundFX.playChime();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="pt-28 pb-24 bg-[#090A0E] text-[#F4F0E8] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Circular Stamp */}
        <div className="relative text-center max-w-2xl mx-auto mb-10">
          <div className="hidden lg:flex absolute -right-24 -top-6 w-24 h-24 rounded-full border border-[#D4AF37]/30 bg-[#12141C] items-center justify-center p-1.5 animate-spin-slow pointer-events-none shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathRes" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathRes" startOffset="0%">
                  FARZI CAFÉ · CONCIERGE TABLE ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#E5B869] text-xs font-bold">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#12141C] text-[#E5B869] text-[10px] font-mono uppercase tracking-widest mb-4 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TABLE CONCIERGE DESK · SERVICE OPEN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#F4F0E8] tracking-tight uppercase mb-2">
            RESERVE A <span className="gold-text-gradient">CHAMBER</span>
          </h1>
          <p className="font-serif italic text-2xl text-[#E5B869] mb-4">
            Curated Dining & Signature Events
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            From intimate molecular dinners to weekly live Sufi fusion nights and cryo masterclasses. Reserve your place in the Farzi universe.
          </p>

          {/* Live Availability Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C] border border-white/10 text-xs font-mono shadow-md">
            <span className={`w-2 h-2 rounded-full ${availability.available ? 'bg-emerald-400' : 'bg-rose-500'} ${availability.checking ? 'animate-ping' : ''}`} />
            <span className="text-neutral-300">
              {availability.checking ? 'Checking table availability...' : availability.message}
            </span>
          </div>
        </div>

        {/* =========================================================================
            EXPERIENCE NAVIGATION TABS: [ Table Dining ] vs [ Signature Events ]
           ========================================================================= */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-[#12141C] border border-[#D4AF37]/30 shadow-xl inline-flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dining');
                soundFX.playWhoosh();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dining'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold shadow-lg'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>A La Carte Dining</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('events');
                soundFX.playWhoosh();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold shadow-lg'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Signature Events & Masterclasses</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            EVENTS SHOWCASE SECTION (Visible when Events Tab active or as quick browse)
           ========================================================================= */}
        {activeTab === 'events' && (
          <div className="mb-14 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-bold block">
                ✦ LIVE ENTERTAINMENT & CULINARY WORKSHOPS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                Upcoming Farzi Café Events
              </h2>
              <p className="text-xs text-neutral-400 font-light">
                Select any experience below to book your table or reserve your workshop pass.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FARZI_SIGNATURE_EVENTS.map((event) => {
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <div
                    key={event.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden bg-[#12141C] flex flex-col justify-between shadow-xl group ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]'
                        : 'border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Event Image Banner with Badge */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                        fallbackSrc="/dining-ambience.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-[#12141C]/40 to-transparent" />

                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-[#E5B869] font-bold">
                        ✦ {event.tag}
                      </div>

                      <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block mb-1">
                          {event.category}
                        </span>
                        <h3 className="font-serif font-black text-lg sm:text-xl text-white leading-snug">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Event Body & Details */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-neutral-300 font-light leading-relaxed">
                        {event.description}
                      </p>

                      {/* Inclusions List */}
                      <div className="space-y-1.5 py-2 border-y border-white/5">
                        <span className="text-[9.5px] font-mono tracking-wider uppercase text-neutral-400 font-bold block">
                          Experience Inclusions:
                        </span>
                        {event.inclusions.map((inc, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                            <Sparkles className="w-3 h-3 text-[#E5B869] shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-2 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-mono tracking-wider uppercase text-neutral-400 block">
                            Pricing / Entry
                          </span>
                          <span className="text-xs font-mono font-semibold text-[#E5B869]">
                            {event.priceText}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectEvent(event)}
                          className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                              : 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black shadow-md hover:scale-105'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <span>Reserve Event</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            RESERVATION FORM & CONFIRMATION
           ========================================================================= */}
        <div id="booking-form-section">
          {confirmedBooking ? (
            /* Confirmation Card */
            <div className="bg-[#12141C] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#E5B869] mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#E5B869] block mb-1 font-semibold">
                  Reservation Reference #{confirmedBooking.id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#F4F0E8]">
                  Booking Request Confirmed!
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
                Thank you, <strong className="text-white">{confirmedBooking.name}</strong>. Your reservation for{' '}
                <strong className="text-[#E5B869]">{confirmedBooking.guests} Guests</strong> on{' '}
                <strong className="text-white">{confirmedBooking.reservationDate}</strong> at{' '}
                <strong className="text-[#E5B869]">{confirmedBooking.reservationTime}</strong> has been logged in Farzi RestaurantOS.
              </p>

              {/* Event Badge in Confirmation */}
              {confirmedBooking.eventName && (
                <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#E5B869] flex items-center justify-center gap-2">
                  <Music className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    Signature Experience: <strong>{confirmedBooking.eventName}</strong>
                  </span>
                </div>
              )}

              <div className="max-w-md mx-auto bg-[#181B26] p-6 rounded-2xl border border-white/10 text-left space-y-3 text-xs shadow-inner">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Status</span>
                  <span className="font-mono font-bold text-[#E5B869]">PENDING CONCIERGE CONFIRMATION</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Contact Phone</span>
                  <span className="font-mono text-white font-semibold">{confirmedBooking.phone}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Seating Chamber</span>
                  <span className="font-mono text-white">{confirmedBooking.seatingPreference || 'Main Dining Chamber'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Special Notes</span>
                  <span className="text-white italic">{confirmedBooking.specialRequest || 'None'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  setSelectedEvent(null);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-lg cursor-pointer"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            /* Form Container */
            <form onSubmit={handleSubmit} className="bg-[#12141C] border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              
              {/* Active Event Banner (If user selected an event) */}
              {selectedEvent && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1E222D] to-[#161922] border border-[#D4AF37]/50 shadow-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5B869] shrink-0">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block">
                        ✦ EVENT EXPERIENCE ACTIVE
                      </span>
                      <h4 className="font-serif font-bold text-white text-sm">
                        {selectedEvent.title}
                      </h4>
                      <p className="text-[11px] text-neutral-300">
                        {selectedEvent.time} · {selectedEvent.priceText}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearEvent}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Remove event preference"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Occasion / Experience Type Selector */}
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-2 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>Dining Occasion or Event Experience</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Standard Dining',
                    'Farzi Sufi Night (Live Band)',
                    'Molecular Mixology Masterclass',
                    "Chef's Sensory Illusion Table",
                    'Birthday / Anniversary Celebration',
                    'Corporate Dinner & Gala'
                  ].map((occ) => {
                    const isSelected = selectedOccasion === occ || selectedEvent?.title === occ;
                    return (
                      <button
                        type="button"
                        key={occ}
                        onClick={() => {
                          setSelectedOccasion(occ);
                          if (occ.includes('Sufi')) {
                            setReservationTime('21:00');
                            setSeatingPreference('Stage-Facing Live Chamber');
                          } else if (occ.includes('Mixology')) {
                            setReservationTime('17:00');
                            setSeatingPreference('Mixology Alchemy Bar');
                          } else if (occ.includes("Chef's")) {
                            setReservationTime('20:00');
                            setSeatingPreference('Private Enclave');
                          }
                        }}
                        className={`p-2.5 rounded-xl text-xs font-mono border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E222D] border-[#D4AF37] text-[#E5B869] font-bold shadow-md'
                            : 'bg-[#181B26] border-white/10 text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Party Size & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-2 flex items-center gap-1.5 font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#E5B869]" />
                    <span>Number of Guests</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                          guests === num
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black border-[#D4AF37] shadow-lg'
                            : 'bg-[#181B26] text-neutral-300 border-white/10 hover:border-[#D4AF37]/50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-2 flex items-center gap-1.5 font-semibold">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#E5B869]" />
                    <span>Reservation Date</span>
                  </label>
                  <input
                    type="date"
                    value={reservationDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-3 flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>Select Time Slot</span>
                </label>
                <div className="space-y-4">
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot.label}>
                      <span className="text-[10px] font-mono text-[#E5B869] uppercase tracking-widest block mb-2 font-medium">
                        {slot.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {slot.times.map((time) => (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setReservationTime(time)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                              reservationTime === time
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold border-[#D4AF37] shadow-md'
                                : 'bg-[#181B26] text-neutral-300 border-white/10 hover:border-[#D4AF37]/50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Zorawar Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="zorawar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Seating Preference & Special Request */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-2 font-semibold">
                    Chamber Seating Preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Main Dining Chamber',
                      'Stage-Facing Live Chamber',
                      'Mixology Alchemy Bar',
                      'Private Enclave'
                    ].map((pref) => (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => setSeatingPreference(pref)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono border text-left transition-all cursor-pointer ${
                          seatingPreference === pref
                            ? 'bg-[#1E222D] border-[#E5B869] text-[#E5B869] font-medium shadow'
                            : 'bg-[#181B26] border-white/10 text-neutral-300 hover:border-white/30'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                    Special Notes / Dietary Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Celebrating an anniversary, window table, strict vegetarian party..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] resize-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer shadow-[#D4AF37]/20"
              >
                {isLoading ? (
                  <span>Transmitting Reservation Request...</span>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {selectedEvent
                        ? `Submit Event Booking Request (${selectedEvent.title})`
                        : 'Submit Reservation Request'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </PageTransition>
  );
};

export default ReservationPage;
