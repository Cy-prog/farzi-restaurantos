import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../ui/ImageWithFallback';

export const FarziExperienceSection: React.FC = () => {
  return (
    <section id="story-section" className="py-20 sm:py-28 bg-[#090A0E] text-[#F4F0E8] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The Farzi Experience Layout (Matching middle-left of design board) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Warm Parchment Card */}
          <div className="lg:col-span-5 bg-[#E8E1D3] text-[#12141A] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Ambient watermark pattern */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <span className="font-serif font-black text-9xl">✦</span>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] font-mono tracking-[0.25em] text-[#937122] uppercase font-bold">
                <span>✦</span>
                <span>CULINARY PHILOSOPHY</span>
              </div>

              <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-[#12141A] leading-[1.05]">
                The <br />
                Farzi <br />
                Experience
              </h2>

              <p className="text-sm sm:text-base text-neutral-800 font-normal leading-relaxed max-w-sm">
                A modern Indian bistro where familiar flavours meet unexpected form.
              </p>
            </div>

            {/* Circular Dark Arrow Button (Matching "→" in design board) */}
            <div className="pt-8 relative z-10">
              <Link
                to="/about"
                className="w-12 h-12 rounded-full bg-[#12141A] text-white hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110"
                aria-label="Explore the Farzi Philosophy"
              >
                <ArrowRight className="w-5 h-5 text-current" />
              </Link>
            </div>
          </div>

          {/* Right Collage: 3 Staggered Dark Photos */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Top-Left: Moody Dining Ambience with Pendants (7 Cols) */}
            <div className="sm:col-span-7 relative rounded-3xl overflow-hidden border border-white/10 bg-[#12141C] min-h-[220px] sm:min-h-[260px] group shadow-xl">
              <ImageWithFallback
                src="/dining-ambience.jpg"
                alt="Farzi Dining Ambience"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                fallbackSrc="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5B869] font-bold block">
                  ✦ CHAMBER OF ILLUSIONS
                </span>
                <span className="text-xs text-neutral-300 font-serif">
                  Moody Ambiance & Amber Illumination
                </span>
              </div>
            </div>

            {/* Top-Right: Glowing FARZI Neon Marquee (5 Cols) */}
            <div className="sm:col-span-5 relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-[#13151D] min-h-[220px] sm:min-h-[260px] flex items-center justify-center shadow-xl group p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
              <div className="relative text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-black/60 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl tracking-[0.2em] text-[#E5B869] gold-glow uppercase">
                  FARZI
                </h3>
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400 block">
                  PROGRESSIVE BISTRO
                </span>
              </div>
            </div>

            {/* Bottom Row: Chef's Hands Plating Delicately with Tweezers (12 Cols) */}
            <div className="sm:col-span-12 relative rounded-3xl overflow-hidden border border-white/10 bg-[#12141C] min-h-[200px] sm:min-h-[240px] group shadow-xl">
              <ImageWithFallback
                src="/chef-plating.jpg"
                alt="Chef Tweezers Plating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                fallbackSrc="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5B869] font-bold block mb-1">
                    ✦ PRECISION PLATING
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                    Centuries of Heritage surrendered to Tweezer Precision
                  </h4>
                </div>
                <span className="hidden sm:inline font-mono text-xs text-neutral-400">
                  EST. 2014
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

