import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, Sparkles, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Reservation } from '../types';
import { PageTransition } from '../components/motion/PageTransition';

export const ReservationPage: React.FC = () => {
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
  const [specialRequest, setSpecialRequest] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

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
    return () => { isCurrent = false; };
  }, [reservationDate, reservationTime, guests]);

  const TIME_SLOTS = [
    { label: 'Lunch Service', times: ['12:30', '13:00', '13:30', '14:00', '14:30'] },
    { label: 'Dinner & Mixology', times: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'] },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !reservationDate || !reservationTime || !guests) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const fullRequest = seatingPreference
        ? `[Preference: ${seatingPreference}] ${specialRequest}`
        : specialRequest;

      const res = await api.createReservation({
        name,
        phone,
        email,
        reservationDate,
        reservationTime,
        guests,
        specialRequest: fullRequest
      });
      setConfirmedBooking(res);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="pt-28 pb-24 bg-[#090A0E] text-[#F4F0E8] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Circular Stamp */}
        <div className="relative text-center max-w-2xl mx-auto mb-12">
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
          <p className="font-serif italic text-2xl text-[#E5B869] mb-4">Reserve a Table</p>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Reserve your intimate seating, private culinary enclave, or group celebration. Our concierge ensures your molecular dining journey is seamless and memorable.
          </p>

          {/* Live Availability Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C] border border-white/10 text-xs font-mono shadow-md">
            <span className={`w-2 h-2 rounded-full ${availability.available ? 'bg-emerald-400' : 'bg-rose-500'} ${availability.checking ? 'animate-ping' : ''}`} />
            <span className="text-neutral-300">
              {availability.checking ? 'Checking table availability...' : availability.message}
            </span>
          </div>
        </div>

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
                Booking Request Received!
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
              Thank you, <strong className="text-white">{confirmedBooking.name}</strong>. Your table for <strong className="text-[#E5B869]">{confirmedBooking.guests} Guests</strong> on <strong className="text-white">{confirmedBooking.reservationDate}</strong> at <strong className="text-[#E5B869]">{confirmedBooking.reservationTime}</strong> has been logged in RestaurantOS.
            </p>

            <div className="max-w-md mx-auto bg-[#181B26] p-6 rounded-2xl border border-white/10 text-left space-y-3 text-xs shadow-inner">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400">Status</span>
                <span className="font-mono font-bold text-[#E5B869]">PENDING CONCIERGE CONFIRMATION</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400">Contact Phone</span>
                <span className="font-mono text-white font-semibold">{confirmedBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Special Notes</span>
                <span className="text-white italic">{confirmedBooking.specialRequest || 'None'}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-[#12141C] border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                <span>Select Dining Time</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Main Dining Chamber', 'Mixology Lounge', 'Private Enclave'].map((pref) => (
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
                  <span>Submit Reservation Request</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </PageTransition>
  );
};

export default ReservationPage;
