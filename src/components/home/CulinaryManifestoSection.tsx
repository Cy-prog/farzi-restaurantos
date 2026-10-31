import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { Card3DTilt } from '../3d/Card3DTilt';

export const CulinaryManifestoSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#0A0B0E] text-[#F3EFE6] overflow-hidden border-t border-[#1E222D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Narrative Manifesto (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>PHILOSOPHY OF ILLUSION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black uppercase tracking-tight leading-[0.94] text-white">
              WHAT YOU WITNESS <br />
              IS A RIDDLE. <br />
              <span className="gold-gradient-text italic font-normal">WHAT YOU TASTE</span> <br />
              IS HERITAGE.
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl">
              In Arabic, <strong className="text-white font-semibold">Farzi</strong> translates to an illusion or mimicry. To our culinary brigade, it represents a sacred pact: what arrives at your table will deceive your eyes, but the very first bite returns you directly to the royal warmth of Indian culinary memory.
            </p>

            {/* Metrics Triad */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1E222D]">
              <div>
                <span className="font-serif font-black text-3xl sm:text-4xl text-[#D4AF37] block">
                  -196°C
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Cryo Nitrogen Lab
                </span>
              </div>

              <div>
                <span className="font-serif font-black text-3xl sm:text-4xl text-white block">
                  24K
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Edible Gold & Soil
                </span>
              </div>

              <div>
                <span className="font-serif font-black text-3xl sm:text-4xl text-[#D4AF37] block">
                  18+
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1 block font-semibold">
                  Crushed Spice Blends
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <Link to="/about" data-cursor="READ">
                <button className="px-6 py-3.5 rounded-xl border border-neutral-700 hover:border-[#D4AF37] bg-[#12141A] hover:bg-[#1A1D24] text-xs font-mono tracking-widest uppercase text-white transition-all flex items-center gap-2 shadow-sm">
                  <span>Our Culinary Manifesto</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </Link>

              <Link to="/reservation" data-cursor="RESERVE">
                <button className="px-7 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#e6c457] text-[#0A0B0E] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0A0B0E]" />
                  <span>Reserve Table</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Reservation Card & Atmospheric Image (5 Cols) with 3D Tilt */}
          <div className="lg:col-span-5 relative">
            <Card3DTilt
              maxTilt={12}
              scaleOnHover={1.02}
              className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#12141A] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E222D]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-300 font-bold">
                    RESERVATIONS DESK
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  TODAY · LUNCH & DINNER
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif font-black text-2xl text-white">
                  Experience The Illusion In-House
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Join us for our signature molecular tasting menus, liquid nitrogen mixology chambers, or private dining enclaves.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0B0E] border border-[#1E222D] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="font-bold text-neutral-300">DINING HOURS:</span>
                  <span className="text-[#D4AF37] font-bold">12:00 PM – 12:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="font-bold text-neutral-300">DRESS CODE:</span>
                  <span>Smart Casual Elegance</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="font-bold text-neutral-300">CHEF TABLE:</span>
                  <span className="text-emerald-400 font-bold">Available on Request</span>
                </div>
              </div>

              <Link to="/reservation" className="block w-full">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C57D56] text-[#0A0B0E] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98]">
                  <Calendar className="w-4 h-4 text-[#0A0B0E]" />
                  <span>Select Table & Time</span>
                </button>
              </Link>
            </Card3DTilt>
          </div>

        </div>

      </div>
    </section>
  );
};
