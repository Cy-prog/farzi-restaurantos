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
    <PageTransition className="pt-28 pb-24 bg-[#FAF9F5] text-[#12141A] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Circular Stamp */}
        <div className="relative text-center max-w-2xl mx-auto mb-12">
          <div className="hidden lg:flex absolute -right-24 -top-6 w-24 h-24 rounded-full border border-black/15 items-center justify-center p-1.5 animate-spin-slow pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#D4AF37] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathRes" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathRes" startOffset="0%">
                  FARZI CAFÉ · CONCIERGE TABLE ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#D4AF37] text-xs">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TABLE CONCIERGE DESK · SERVICE OPEN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-black tracking-tight uppercase mb-4">
            RESERVE A <span className="text-stroke">CHAMBER</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Reserve your intimate seating, private culinary enclave, or group celebration. Our concierge ensures your molecular dining journey is seamless and memorable.
          </p>

          {/* Live Availability Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 text-xs font-mono shadow-sm">
            <span className={`w-2 h-2 rounded-full ${availability.available ? 'bg-emerald-500' : 'bg-rose-500'} ${availability.checking ? 'animate-ping' : ''}`} />
            <span className="text-neutral-700">
              {availability.checking ? 'Checking table availability...' : availability.message}
            </span>
          </div>
        </div>

        {confirmedBooking ? (
          /* Confirmation Card */
          <div className="bg-white border border-[#D4AF37] rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block mb-1 font-semibold">
                Reservation Reference #{confirmedBooking.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-black">
                Booking Request Received!
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto font-light leading-relaxed">
              Thank you, <strong className="text-black">{confirmedBooking.name}</strong>. Your table for <strong className="text-[#D4AF37]">{confirmedBooking.guests} Guests</strong> on <strong className="text-black">{confirmedBooking.reservationDate}</strong> at <strong className="text-[#D4AF37]">{confirmedBooking.reservationTime}</strong> has been logged in RestaurantOS.
            </p>

            <div className="max-w-md mx-auto bg-[#FAF9F5] p-6 rounded-2xl border border-black/10 text-left space-y-3 text-xs shadow-inner">
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-neutral-500">Status</span>
                <span className="font-mono font-bold text-amber-700">PENDING CONCIERGE CONFIRMATION</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-neutral-500">Contact Phone</span>
                <span className="font-mono text-black font-semibold">{confirmedBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Special Notes</span>
                <span className="text-black italic">{confirmedBooking.specialRequest || 'None'}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-6 py-3 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-md"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-white border border-black/10 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Party Size & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-2 flex items-center gap-1.5 font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Number of Guests</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                        guests === num
                          ? 'bg-black text-white border-black shadow'
                          : 'bg-[#FAF9F5] text-neutral-700 border-black/10 hover:border-black'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-2 flex items-center gap-1.5 font-semibold">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Reservation Date</span>
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-3 flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Select Dining Time</span>
              </label>
              <div className="space-y-4">
                {TIME_SLOTS.map((slot) => (
                  <div key={slot.label}>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2 font-medium">
                      {slot.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setReservationTime(time)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                            reservationTime === time
                              ? 'bg-black text-white font-bold border-black shadow'
                              : 'bg-[#FAF9F5] text-neutral-700 border-black/10 hover:border-black'
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10">
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-1.5 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Zorawar Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-1.5 font-semibold">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-1.5 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="zorawar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Seating Preference & Special Request */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-2 font-semibold">
                  Chamber Seating Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Main Dining Chamber', 'Mixology Lounge', 'Private Enclave'].map((pref) => (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => setSeatingPreference(pref)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono border text-left transition-all ${
                        seatingPreference === pref
                          ? 'bg-black border-black text-white font-medium shadow'
                          : 'bg-[#FAF9F5] border-black/10 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 block mb-1.5 font-semibold">
                  Special Notes / Dietary Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Celebrating an anniversary, window table, strict vegetarian party..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
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
