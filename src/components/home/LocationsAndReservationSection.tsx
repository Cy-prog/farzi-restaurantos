import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Users, Clock, Check, ChevronDown, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { soundFX } from '../../utils/soundEffects';

interface LocationItem {
  id: string;
  city: string;
  area: string;
  image: string;
}

const LOCATIONS: LocationItem[] = [
  {
    id: 'delhi',
    city: 'Delhi',
    area: 'Cyber Hub, Gurugram',
    image: '/farzi-storefront-clean.jpg'
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    area: 'BKC',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    area: 'UB City',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'
  }
];

export const LocationsAndReservationSection: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<LocationItem>(LOCATIONS[0]);
  const [date, setDate] = useState('Fri, 30 Oct 2026');
  const [guests, setGuests] = useState('2 Guests');
  const [time, setTime] = useState('8:00 PM');
  const [isReserved, setIsReserved] = useState(false);
  const navigate = useNavigate();

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChime();
    setIsReserved(true);
    setTimeout(() => {
      navigate('/reservation');
    }, 900);
  };

  return (
    <section id="locations-section" className="py-20 sm:py-28 bg-[#090A0E] text-[#F4F0E8] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 7 COLS: "Our Locations" (Matching middle-right in design board) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#D4AF37]/25 bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                <h3 className="font-serif italic font-normal text-2xl sm:text-3xl text-[#E5B869] gold-glow">
                  Our Locations
                </h3>
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  FLAGSHIP HUBS
                </span>
              </div>

              {/* Split inside Locations: Storefront Image (Left) + Interactive List (Right) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Storefront Visual */}
                <div className="sm:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-lg">
                  <ImageWithFallback
                    src={activeLocation.image}
                    alt={activeLocation.city}
                    className="w-full h-full object-cover filter contrast-105"
                    fallbackSrc="/storefront.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block">
                      FARZI CAFÉ · {activeLocation.city.toUpperCase()}
                    </span>
                    <span className="text-xs text-white font-serif font-bold">
                      {activeLocation.area}
                    </span>
                  </div>
                </div>

                {/* Locations Selector List */}
                <div className="sm:col-span-6 space-y-2.5">
                  {LOCATIONS.map((loc) => {
                    const isSelected = activeLocation.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setActiveLocation(loc);
                          soundFX.playWhoosh();
                        }}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#181C26] border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                            : 'bg-[#10121A] border-white/5 hover:border-white/20 hover:bg-[#141722]'
                        }`}
                      >
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white">
                            {loc.city}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                            {loc.area}
                          </span>
                        </div>

                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-neutral-400'
                        }`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <span>GLOBAL PRESENCE: LONDON · DUBAI · INDIA</span>
              <Link to="/contact" className="text-[#D4AF37] hover:underline">
                View All Outlets →
              </Link>
            </div>
          </div>

          {/* RIGHT 5 COLS: "Reserve a Table" (Matching middle-right end of design board) */}
          <div id="reserve-section" className="lg:col-span-5 rounded-3xl border border-[#D4AF37]/25 bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="mb-6 pb-3 border-b border-white/10">
                <h3 className="font-serif italic font-normal text-2xl sm:text-3xl text-[#E5B869] gold-glow">
                  Reserve a Table
                </h3>
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  IMMERSIVE GASTRONOMY DESK
                </span>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleReserve} className="space-y-4">
                
                {/* Date Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Date
                  </label>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#161922] border border-white/10 hover:border-[#D4AF37]/40 transition-colors cursor-pointer">
                    <span className="text-xs font-mono text-white font-medium">{date}</span>
                    <Calendar className="w-4 h-4 text-[#E5B869]" />
                  </div>
                </div>

                {/* Guests Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Guests
                  </label>
                  <div className="relative">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161922] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="6 Guests">6 Guests</option>
                      <option value="8+ Guests">Chef's Reserve (8+ Guests)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#E5B869] absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Time Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Time
                  </label>
                  <div className="relative">
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161922] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                    >
                      <option value="12:30 PM">12:30 PM (Lunch)</option>
                      <option value="1:30 PM">1:30 PM (Lunch)</option>
                      <option value="7:30 PM">7:30 PM (Dinner)</option>
                      <option value="8:00 PM">8:00 PM (Dinner)</option>
                      <option value="9:00 PM">9:00 PM (Dinner)</option>
                      <option value="10:00 PM">10:00 PM (Late Alchemy)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#E5B869] absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Reserve Now Button (Matching warm gold button in design) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#C59F6D] text-black font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                  >
                    {isReserved ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span>Opening Table Chamber...</span>
                      </>
                    ) : (
                      <span>Reserve Now</span>
                    )}
                  </button>
                </div>

              </form>
            </div>

            <div className="pt-4 text-center">
              <span className="text-[9.5px] font-mono text-neutral-400 uppercase tracking-widest">
                Complimentary Valet Parking Available
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

