import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const CulinaryManifestoSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F5] text-[#12141A] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Narrative Manifesto (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase shadow-sm">
              <span>✦</span>
              <span>PHILOSOPHY OF ILLUSION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight leading-[0.94] text-black">
              WHAT YOU WITNESS <br />
              IS A RIDDLE. <br />
              <span className="text-stroke">WHAT YOU TASTE</span> <br />
              IS HERITAGE.
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 font-normal leading-relaxed max-w-xl">
              In Arabic, <strong className="text-black font-bold">Farzi</strong> translates to an illusion or mimicry. To our culinary brigade, it represents a sacred pact: what arrives at your table will deceive your eyes, but the very first bite returns you directly to the royal warmth of Indian culinary memory.
            </p>

            {/* Metrics Triad (10% Gold, 10% Black) */}
            <div className="grid grid-cols-3 gap-6 pt-4 editorial-border-t">
              <div>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#D4AF37] block">
                  -196°C
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Cryo Nitrogen Lab
                </span>
              </div>

              <div>
                <span className="font-display font-black text-3xl sm:text-4xl text-black block">
                  24K
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Edible Gold & Soil
                </span>
              </div>

              <div>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#D4AF37] block">
                  18+
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Crushed Spice Blends
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link to="/about" data-cursor="READ">
                <button className="px-6 py-3.5 rounded-xl border border-black/20 hover:border-black bg-white hover:bg-black text-xs font-mono tracking-widest uppercase text-black hover:text-white transition-all flex items-center gap-2 shadow-sm">
                  <span>Our Culinary Manifesto</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </Link>

              <Link to="/reservation" data-cursor="RESERVE">
                <button className="px-7 py-3.5 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                  <span>Reserve Table</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Reservation Card & Atmospheric Image (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-white p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 editorial-border-b">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-700 font-bold">
                    RESERVATIONS DESK
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  TODAY · LUNCH & DINNER
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif font-black text-2xl text-black">
                  Experience The Illusion In-House
                </h3>
                <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                  Join us for our signature molecular tasting menus, liquid nitrogen mixology chambers, or private dining enclaves.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-black/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-700">
                  <span className="font-bold">DINING HOURS:</span>
                  <span className="text-[#D4AF37] font-bold">12:00 PM – 12:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-700">
                  <span className="font-bold">DRESS CODE:</span>
                  <span>Smart Casual Elegance</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-700">
                  <span className="font-bold">CHEF TABLE:</span>
                  <span className="text-emerald-700 font-bold">Available on Request</span>
                </div>
              </div>

              <Link to="/reservation" className="block w-full">
                <button className="w-full py-4 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Calendar className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                  <span>Select Table & Time</span>
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
