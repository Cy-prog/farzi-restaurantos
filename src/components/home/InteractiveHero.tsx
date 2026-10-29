import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Calendar, Compass, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const InteractiveHero: React.FC = () => {
  const { tableNumber } = useCart();
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Pointer responsive parallax physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const rotateX = useTransform(springY, [-300, 300], [4, -4]);
  const rotateY = useTransform(springX, [-300, 300], [-4, 4]);
  const moveImageX = useTransform(springX, [-400, 400], [-15, 15]);
  const moveImageY = useTransform(springY, [-400, 400], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 flex flex-col justify-between bg-[#FAF9F5] text-[#12141A] overflow-hidden select-none"
    >
      {/* Background Ambient Warm Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(212,175,55,0.08)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-20" />

      {/* Top Editorial Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="flex items-center justify-between py-2 text-[10px] font-mono tracking-[0.28em] text-neutral-600 uppercase editorial-border-b">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-800">KITCHEN LAB OPERATIONAL · SERVICE LIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span>CHEF ZORAWAR KALRA</span>
            <span>·</span>
            <span>MOLECULAR PROGRESSIVE BISTRO</span>
          </div>
          <div className="text-[#D4AF37] font-bold">
            TABLES: ACTIVE
          </div>
        </div>
      </div>

      {/* Main Hero Staging Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Typography & Actions (7 Cols) */}
          <motion.div
            style={{ rotateX, rotateY }}
            className="lg:col-span-7 space-y-8 z-10"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-black/10 bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase shadow-sm">
              <img src="/farzi-logo.svg" alt="Farzi Logo" className="w-3.5 h-3.5" />
              <span>THE ILLUSION STARTS HERE</span>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-black uppercase tracking-tight leading-[0.88] text-black">
              CREATING <br />
              <span className="text-stroke hover:text-[#D4AF37] transition-colors duration-500">
                AN ILLUSION
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-700 font-normal max-w-xl leading-relaxed">
              Where centuries of royal Indian recipes surrender to avant-garde molecular science, sensory deception, and liquid nitrogen theatre.
            </p>

            {/* Unified Action Cluster */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/menu" data-cursor="EXPLORE">
                <button className="px-8 py-4 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-black/10 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                  <span>Explore Menu</span>
                </button>
              </Link>

              <Link to={`/menu?table=${tableNumber || 'T04'}`} data-cursor="TABLE">
                <button className="px-7 py-4 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs uppercase tracking-[0.18em] border border-black/20 hover:border-black transition-all duration-300 shadow-sm flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  <span>Table QR Menu</span>
                </button>
              </Link>

              <Link to="/reservation" data-cursor="RESERVE">
                <button className="px-6 py-4 rounded-xl text-neutral-700 hover:text-black font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 border border-black/10 hover:border-black bg-white/60">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Layered Visual Composition & Parallax Frame (5 Cols - 30%+ Visuals) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              style={{ x: moveImageX, y: moveImageY }}
              className="relative w-full aspect-[4/5] max-h-[560px] rounded-2xl overflow-hidden border border-black/10 bg-neutral-900 shadow-2xl group"
            >
              {/* Primary Visual Image */}
              <img
                src="/herofarzi2-Tu5MyXUR.jpg"
                alt="Farzi Cafe Theatrical Gastronomy"
                className="w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Live Badge Bottom Left */}
              <div className="absolute bottom-5 left-5 z-20 max-w-[240px] p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-black/10 shadow-xl">
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block mb-0.5">
                  ✦ SIGNATURE ILLUSION
                </span>
                <p className="text-xs font-serif font-black text-black">
                  Liquid Nitrogen Smoke & Spherified Chutneys
                </p>
              </div>

              {/* Rotating Circular Stamp Top Right */}
              <div className="absolute top-5 right-5 z-20 w-20 h-20 rounded-full border border-black/15 bg-white/90 backdrop-blur-md flex items-center justify-center animate-spin-slow pointer-events-none shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-black font-mono text-[8px] uppercase tracking-[0.25em]">
                  <path id="circleHero" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text>
                    <textPath href="#circleHero" startOffset="0%">
                      FARZI CAFÉ · MOLECULAR LAB ·
                    </textPath>
                  </text>
                </svg>
                <span className="absolute text-[#D4AF37] text-xs font-bold">✦</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Editorial Coordinates & Scroll Cue */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest editorial-border-t pt-4">
          <div>
            <span>COORDINATES: 28.4595° N, 77.0266° E</span>
          </div>

          <div className="flex items-center gap-2 text-black hover:text-[#D4AF37] transition-colors cursor-pointer font-bold">
            <span>SCROLL TO DISCOVER</span>
            <span className="animate-bounce">↓</span>
          </div>

          <div>
            <span>CURATION [01 / 07]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
