import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Calendar, Sparkles, Compass } from 'lucide-react';
import { MolecularSphereCanvas } from '../3d/MolecularSphereCanvas';
import { Card3DTilt } from '../3d/Card3DTilt';
import { useCart } from '../../context/CartContext';

interface NewmixScrollHeroProps {
  onExploreMenu?: () => void;
}

export const NewmixScrollHero: React.FC<NewmixScrollHeroProps> = ({ onExploreMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tableNumber } = useCart();

  // Track scroll position within this 240vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // 1. Scale down animation ("see how its animated getting small")
  // Starts full width (1.0) and shrinks down to 0.74 with rounded corners, surrounded by dark backdrop
  const cardScale = useTransform(smoothProgress, [0, 0.45, 0.85], [1.0, 0.82, 0.74]);
  const cardBorderRadius = useTransform(smoothProgress, [0, 0.35, 0.75], [0, 24, 36]);
  const cardBorderOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 0.35]);

  // 2. Center dashed line height & opacity (matching Image 1)
  const lineScaleY = useTransform(smoothProgress, [0, 0.35], [1, 0.4]);
  const lineOpacity = useTransform(smoothProgress, [0, 0.25], [0.8, 0.2]);

  // 3. Top title "Nothing is traditional" fade and move up
  const topTextY = useTransform(smoothProgress, [0, 0.3], [0, -40]);
  const topTextOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);

  // 4. Huge architectural typography "START WITH FARZI" parallax (matching Image 2)
  const bigTextX = useTransform(smoothProgress, [0, 0.8], [0, -220]);
  const bigTextOpacity = useTransform(smoothProgress, [0, 0.5, 0.8], [0.9, 0.5, 0.15]);

  // 5. Revealed content below card when it shrinks (matching Image 3)
  const bottomContentOpacity = useTransform(smoothProgress, [0.4, 0.75], [0, 1]);
  const bottomContentY = useTransform(smoothProgress, [0.4, 0.75], [40, 0]);

  // 6. 3D Floating sphere presence
  const sphereScale = useTransform(smoothProgress, [0, 0.4, 0.85], [0.85, 1.1, 1.0]);
  const sphereOpacity = useTransform(smoothProgress, [0, 0.3], [0.9, 1]);

  return (
    <div ref={containerRef} className="relative h-[240vh] bg-[#0A0B0E] text-[#F3EFE6]">
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Grain & Deep Dark Ambience */}
        <div className="absolute inset-0 bg-radial-gradient from-charcoal-900 via-[#0A0B0E] to-[#0A0B0E] pointer-events-none" />
        <div className="absolute inset-0 grain-overlay opacity-15 pointer-events-none" />

        {/* --- ELEMENT 1: Center Dashed Connecting Line (From Image 1) --- */}
        <motion.div
          style={{ scaleY: lineScaleY, opacity: lineOpacity }}
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[1px] h-20 border-l border-dashed border-[#D4AF37]/50 origin-top z-20 pointer-events-none"
        />

        {/* --- ELEMENT 2: Top Minimal Editorial Title "Nothing is traditional." (Image 1) --- */}
        <motion.div
          style={{ y: topTextY, opacity: topTextOpacity }}
          className="absolute top-24 left-0 right-0 text-center z-20 pointer-events-none px-4"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              Farzi Progressive Indian
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white">
            Nothing is traditional.
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 mt-1 uppercase">
            The new begins with the known.
          </p>
        </motion.div>

        {/* --- ELEMENT 3: Massive Oversized Background Typography (Image 2) --- */}
        <motion.div
          style={{ x: bigTextX, opacity: bigTextOpacity }}
          className="absolute top-14 sm:top-10 left-[-5%] whitespace-nowrap z-0 select-none pointer-events-none"
        >
          <span className="font-display font-black text-[14vw] sm:text-[16vw] text-white/[0.08] tracking-tighter leading-none block">
            START WITH FARZI • MODERN ILLUSION •
          </span>
        </motion.div>

        {/* --- ELEMENT 4: The Scroll-Shrinking Card Container ("getting small") --- */}
        <motion.div
          style={{
            scale: cardScale,
            borderRadius: cardBorderRadius,
          }}
          className="relative z-10 w-full max-w-6xl h-[62vh] sm:h-[70vh] shadow-2xl overflow-hidden bg-[#12141A] transition-shadow duration-500"
        >
          {/* Subtle Golden Frame Border */}
          <motion.div
            style={{
              opacity: cardBorderOpacity,
              borderRadius: cardBorderRadius,
            }}
            className="absolute inset-0 border border-[#D4AF37] pointer-events-none z-20"
          />

          {/* Background High-Contrast Hero Image (Matching newmix dramatic studio contrast) */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop"
              alt="Farzi Progressive Fine Dining"
              className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.85]"
            />
            {/* Cinematic Radial Vignette & Vignette Shadows (Image 3 look) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
          </div>

          {/* Dynamic 3D Molecular WebGL Sphere Floating Overlay */}
          <motion.div
            style={{ scale: sphereScale, opacity: sphereOpacity }}
            className="absolute top-1/2 right-4 sm:right-12 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 z-20 pointer-events-auto"
          >
            <MolecularSphereCanvas className="w-full h-full" />
          </motion.div>

          {/* Card Inner Typography & Sub-text (Matching "The new begins with the known" in Image 1 & 3) */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 z-10 pointer-events-none">
            {/* Top Left Indicator inside card */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30">
                Culinary Illusion Lab • Live
              </span>
            </div>

            {/* Center Caption (Just like the user's uploaded Image 1: "The new begins with the known.") */}
            <div className="text-center max-w-xl mx-auto my-auto pointer-events-none">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-wide drop-shadow-lg">
                The illusion begins with heritage.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light mt-2 max-w-md mx-auto leading-relaxed">
                Ancient Awadhi gravies, Himalayan herbs, and Chettinad spices reimagined through cryogenic -196°C physics and reverse spherification.
              </p>
            </div>

            {/* Bottom Bar inside card */}
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[#D4AF37]">✦ LEVEL 2, CONNAUGHT PLACE</span>
                <span className="hidden sm:inline text-neutral-600">|</span>
                <span className="hidden sm:inline">MOLECULAR GASTRONOMY</span>
              </div>
              <span className="text-[#D4AF37]">TABLE {tableNumber} AVAILABLE</span>
            </div>
          </div>
        </motion.div>

        {/* --- ELEMENT 5: Revealed Action Controls when card is small (Image 3) --- */}
        <motion.div
          style={{ opacity: bottomContentOpacity, y: bottomContentY }}
          className="absolute bottom-8 left-0 right-0 z-30 flex flex-wrap items-center justify-center gap-3 px-4"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C57D56] text-[#0A0B0E] font-semibold text-xs tracking-wider uppercase shadow-xl hover:shadow-[#D4AF37]/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Menu</span>
          </Link>

          <Link
            to={`/menu?table=${tableNumber || 'T04'}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#12141A]/90 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs tracking-wider uppercase backdrop-blur-md hover:bg-[#D4AF37] hover:text-[#0A0B0E] hover:scale-105 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Table QR</span>
          </Link>

          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-xs tracking-wider uppercase backdrop-blur-md hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve Table</span>
          </Link>
        </motion.div>

        {/* Scroll down mouse indicator */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.2], [1, 0]) }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[10px] font-mono tracking-widest text-neutral-500 uppercase pointer-events-none"
        >
          <span>Scroll to Shrink & Explore</span>
          <div className="w-4 h-7 rounded-full border border-neutral-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 rounded-full bg-[#D4AF37]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewmixScrollHero;
