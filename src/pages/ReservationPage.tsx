import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
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

  const TIME_SLOTS = [
    { label: 'Lunch', times: ['12:30', '13:00', '13:30', '14:00', '14:30'] },
    { label: 'Dinner', times: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'] },
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
    <PageTransition className="pt-28 pb-24 bg-charcoal-950 text-ivory-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Hospitality Concierge</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 tracking-tight mb-4">
            Table Reservations
          </h1>
          <p className="text-sm sm:text-base text-ivory-300 font-light leading-relaxed">
            Reserve your intimate seating or group celebration. Our concierge ensures your molecular dining experience is seamless.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Card */
          <div className="bg-charcoal-900 border border-gold-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-mono tracking-widest text-gold-400">
              Reservation Reference #{confirmedBooking.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-1 mb-2">
              Booking Request Received!
            </h2>
            <p className="text-sm text-ivory-300 max-w-md mx-auto mb-8 font-light">
              Thank you, <strong className="text-gold-300">{confirmedBooking.name}</strong>. Your table for <strong className="text-gold-300">{confirmedBooking.guests} Guests</strong> on <strong className="text-gold-300">{confirmedBooking.reservationDate}</strong> at <strong className="text-gold-300">{confirmedBooking.reservationTime}</strong> has been logged in RestaurantOS Pro.
            </p>

            <div className="max-w-md mx-auto bg-charcoal-950 p-6 rounded-2xl border border-charcoal-800 text-left space-y-3 mb-8 text-xs">
              <div className="flex justify-between border-b border-charcoal-800 pb-2">
                <span className="text-charcoal-400">Status</span>
                <span className="font-mono font-bold text-amber-400">PENDING CONCIERGE CONFIRMATION</span>
              </div>
              <div className="flex justify-between border-b border-charcoal-800 pb-2">
                <span className="text-charcoal-400">Contact Phone</span>
                <span className="text-ivory-200">{confirmedBooking.phone}</span>
              </div>
              <div className="flex justify-between border-b border-charcoal-800 pb-2">
                <span className="text-charcoal-400">Confirmation Sent To</span>
                <span className="text-ivory-200">{confirmedBooking.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Special Notes</span>
                <span className="text-ivory-300 italic">{confirmedBooking.specialRequest || 'None'}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setConfirmedBooking(null);
                setName('');
                setPhone('');
                setEmail('');
                setSpecialRequest('');
              }}
              variant="outline"
              size="md"
            >
              Book Another Table
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <form
            onSubmit={handleSubmit}
            className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
          >
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date, Time & Guests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Number of Guests *</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest (Solo Tasting)' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Seating Section</span>
                </label>
                <select
                  value={seatingPreference}
                  onChange={(e) => setSeatingPreference(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                >
                  <option value="Main Dining Chamber">Main Dining Chamber</option>
                  <option value="Terrace Garden">Terrace Garden</option>
                  <option value="Chef's Table">Chef’s Tasting Table (Reserve)</option>
                  <option value="Cocktail Lounge">Cocktail & Smoke Lounge</option>
                </select>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-gold-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Select Dining Slot *</span>
              </label>
              <div className="space-y-4">
                {TIME_SLOTS.map((group) => (
                  <div key={group.label} className="bg-charcoal-950/70 p-4 rounded-2xl border border-charcoal-800">
                    <span className="text-[11px] font-mono uppercase text-charcoal-400 block mb-2">
                      {group.label} Service
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setReservationTime(t)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                            reservationTime === t
                              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-lg shadow-gold-500/20'
                              : 'bg-charcoal-850 text-ivory-300 border border-charcoal-700 hover:border-gold-500/40 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-charcoal-800">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-ivory-400 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-ivory-400 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98112 34567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-ivory-400 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-ivory-400 mb-2">
                Special Requests or Dietary Requirements (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Anniversary celebration, dietary restrictions, quiet corner, specific wine pairing..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Confirm Reservation Request
            </Button>
          </form>
        )}
      </div>
    </PageTransition>
  );
};
