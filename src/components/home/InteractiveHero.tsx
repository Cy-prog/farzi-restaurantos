import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Plus, Volume2, VolumeX, Play, Pause, Box, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { soundFX } from '../../utils/soundEffects';
import { ShaderDistortionCanvas } from '../effects/ShaderDistortionCanvas';
import { Interactive3DMolecularSphere } from '../effects/Interactive3DMolecularSphere';

interface HeroSlide {
  index: string;
  category: string;
  dishName: string;
  tagline: string;
  price: number;
  image: string;
  isVeg: boolean;
  temp: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    index: '01',
    category: 'CONTEMPORARY INDIAN BISTRO',
    dishName: 'Dal Chawal Arancini',
    tagline: 'Lentil & rice arancini encased in golden crust with house curry foam',
    price: 695,
    image: '/cloche-dish.jpg',
    isVeg: true,
    temp: 'HOT SMOKE'
  },
  {
    index: '02',
    category: 'SWEET ILLUSIONS',
    dishName: 'Ras Malai Tres Leches',
    tagline: 'Bengali ras malai soaked in Mexican three-milk bath with saffron foam',
    price: 545,
    image: '/tres-leches.jpg',
    isVeg: true,
    temp: 'CHILLED 4°C'
  },
  {
    index: '03',
    category: 'MOLECULAR MIXOLOGY',
    dishName: 'Apple Foamintini',
    tagline: 'Botanical gin elixir infused with elderflower and liquid nitrogen foam',
    price: 645,
    image: '/apple-foamintini.jpg',
    isVeg: true,
    temp: 'CRYO -196°C'
  },
  {
    index: '04',
    category: 'TANDOOR REINVENTED',
    dishName: 'Truffle Naan Bomb',
    tagline: 'Mini tandoori naans filled with molten aged cheddar and black truffle butter',
    price: 725,
    image: '/naan-bomb.jpg',
    isVeg: true,
    temp: 'EMBER 240°C'
  }
];

export const InteractiveHero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isClocheLifted, setIsClocheLifted] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'cloche' | '3d-shader' | '3d-sphere'>('cloche');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToCart } = useCart();

  const current = HERO_SLIDES[activeIdx];

  // Subtle interactive parallax physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 100 });
  const rotateX = useTransform(springY, [-300, 300], [2.5, -2.5]);
  const rotateY = useTransform(springX, [-300, 300], [-2.5, 2.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSlideSelect = (idx: number) => {
    setActiveIdx(idx);
    setIsClocheLifted(false);
    soundFX.playWhoosh();
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) soundFX.playChime();
  };

  const handleQuickAdd = () => {
    addToCart(
      {
        id: activeIdx + 1,
        name: current.dishName,
        slug: current.dishName.toLowerCase().replace(/\s+/g, '-'),
        price: current.price,
        imageUrl: current.image,
        description: current.tagline,
        isVeg: current.isVeg,
        categoryId: 1,
        isAvailable: true,
        isChefSpecial: true,
        isRecommended: true,
        isPopular: true,
        spiceLevel: 'MILD',
        displayOrder: activeIdx + 1
      },
      1
    );
    setAddedSuccess(true);
    soundFX.playChime();
    setTimeout(() => setAddedSuccess(false), 1400);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[94vh] lg:min-h-screen pt-28 pb-16 flex flex-col justify-between bg-[#090A0E] text-[#F4F0E8] overflow-hidden select-none"
    >
      {/* 1. CINEMATIC BACKGROUND VIDEO STREAM (From authentic Farzi Cafe reel & promo footage) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          ref={videoRef}
          src="/introfarzi.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover filter brightness-[0.38] contrast-125 transition-opacity duration-1000"
        />
        {/* Luxury dark gold film vignette and gradient falloff */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-[#090A0E]/80 to-[#090A0E]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(212,175,55,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(197,125,86,0.10)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none opacity-25" />
      </div>

      {/* Top Ambient Reel Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 relative z-10">
        <div className="flex items-center justify-between py-2 text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-semibold">FARZI BISTRO FILM · SERVICE STREAM LIVE</span>
          </div>

          {/* Video Controls: Pause / Play & Mute */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVideoPlay}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title={isVideoPlaying ? 'Pause Ambient Video' : 'Play Ambient Video'}
            >
              {isVideoPlaying ? <Pause className="w-3 h-3 text-[#E5B869]" /> : <Play className="w-3 h-3 text-[#E5B869]" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Enable Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#E5B869]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6 lg:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Vertical Slider Index + Headline + CTA */}
          <div className="lg:col-span-6 flex gap-6 sm:gap-8 items-start">
            
            {/* 1. VERTICAL INDICATOR: 01, 02, 03, 04 (Matching exact top-left design) */}
            <div className="flex flex-col items-center gap-3 pt-3">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={slide.index}
                    type="button"
                    onClick={() => handleSlideSelect(idx)}
                    className="group flex flex-col items-center gap-1 focus:outline-none cursor-pointer"
                    aria-label={`View slide ${slide.index}`}
                  >
                    <span
                      className={`text-xs font-mono transition-all duration-300 ${
                        isActive
                          ? 'text-[#E5B869] font-bold scale-110'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {slide.index}
                    </span>
                    <span
                      className={`w-[1.5px] transition-all duration-300 rounded-full ${
                        isActive
                          ? 'h-6 bg-[#E5B869] shadow-[0_0_8px_rgba(229,184,105,0.8)]'
                          : 'h-3 bg-white/15 group-hover:bg-white/30'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* 2. MAIN TYPOGRAPHY & ACTIONS */}
            <motion.div
              style={{ rotateX, rotateY }}
              className="space-y-6 flex-1"
            >
              {/* Category Subheading */}
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-sans font-medium tracking-[0.28em] uppercase text-[#E5B869]">
                  {current.category}
                </span>
              </div>

              {/* Huge Golden Brand Title: FARZI */}
              <div className="overflow-visible">
                <h1 className="font-serif tracking-[0.12em] font-normal text-6xl sm:text-8xl lg:text-9xl uppercase text-gold-metallic gold-glow leading-none">
                  FARZI
                </h1>
              </div>

              {/* Subheading: TRADITION REIMAGINED */}
              <div>
                <p className="font-sans font-medium text-sm sm:text-base tracking-[0.3em] uppercase text-[#F4F0E8]/90">
                  TRADITION REIMAGINED
                </p>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-md leading-relaxed">
                  Where centuries of royal recipes surrender to avant-garde molecular science, cloche reveals, and sensory deception.
                </p>
              </div>

              {/* Explore Menu CTA Button (Matching "→ Explore Menu" in design) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#menu-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#D4AF37]/40 bg-[#161922]/80 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-white hover:text-black transition-all duration-300 shadow-lg text-xs font-mono uppercase tracking-[0.2em] font-semibold"
                >
                  <span className="text-[#D4AF37] group-hover:text-black group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                  <span>Explore Menu</span>
                </a>

                {/* 3D Mode Switcher Pills */}
                <div className="inline-flex items-center gap-1.5 bg-[#12141C]/80 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode('cloche')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      viewMode === 'cloche' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Cloche
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d-shader')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      viewMode === '3d-shader' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    WebGL Shader
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d-sphere')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      viewMode === '3d-sphere' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    3D Sphere
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: The Cloche Dome Reveal & Dish Showcase OR Three.js WebGL View */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-lg mx-auto aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#D4AF37]/25 bg-[#12141C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
              
              {/* Mode 1: Cloche Reveal */}
              {viewMode === 'cloche' && (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.dishName}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <ImageWithFallback
                        src={current.image}
                        alt={current.dishName}
                        className="w-full h-full object-cover object-center filter contrast-105"
                        fallbackSrc="/herofarzi-main.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-black/30 pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Animated Culinary Vapor / Nitrogen Mist Layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                      animate={{
                        opacity: isClocheLifted ? [0.2, 0.6, 0.3] : [0.15, 0.35, 0.15],
                        scale: isClocheLifted ? [1, 1.25, 1.1] : [1, 1.1, 1],
                        y: isClocheLifted ? [-5, -35, -20] : [0, -10, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute bottom-8 left-1/3 w-64 h-48 rounded-full bg-gradient-to-t from-white/20 via-white/5 to-transparent blur-2xl"
                    />
                  </div>

                  {/* Interactive Cloche Lift Toggle on Top Right */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={() => {
                        setIsClocheLifted(!isClocheLifted);
                        soundFX.playWhoosh();
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[10px] font-mono tracking-widest uppercase text-[#E5B869] shadow-lg cursor-pointer transition-all hover:scale-105"
                    >
                      <Sparkles className="w-3 h-3 text-[#E5B869] animate-spin-slow" />
                      <span>{isClocheLifted ? 'Lower Cloche' : 'Lift Cloche'}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Mode 2: Three.js Interactive WebGL Shader Distortion Canvas */}
              {viewMode === '3d-shader' && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#07080A]">
                  <ShaderDistortionCanvas className="w-full h-full" variant="gold-mist" />
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[9px] font-mono text-[#E5B869] uppercase tracking-wider">
                    ✦ Interactive WebGL Fluid Shader (Move Cursor)
                  </div>
                </div>
              )}

              {/* Mode 3: Three.js Interactive 3D Molecular Sphere */}
              {viewMode === '3d-sphere' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080A] p-4">
                  <Interactive3DMolecularSphere size={320} />
                  <span className="text-[9px] font-mono tracking-widest text-[#E5B869] uppercase mt-2">
                    Click & Drag to Rotate Molecular Geometry
                  </span>
                </div>
              )}

              {/* Bottom Card Overlay Details */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 bg-gradient-to-t from-[#090A0E] via-[#090A0E]/90 to-transparent">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block">
                      ✦ {current.temp}
                    </span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                      {current.dishName}
                    </h3>
                    <p className="text-xs text-neutral-300 font-light max-w-xs line-clamp-1">
                      {current.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-serif font-black text-xl text-[#E5B869]">
                      ₹{current.price}
                    </span>
                    
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F6D] text-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                      title="Add to order"
                    >
                      {addedSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 font-bold" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BANNER: Floating Circular Badge + Coordinates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 relative z-10 flex items-center justify-between">
        
        {/* Floating Circular Badge: "FARZI · SCROLL ·" (Matching bottom-left in design) */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#D4AF37]/30 bg-[#12141C]/80 backdrop-blur-md flex items-center justify-center animate-spin-slow shadow-lg">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[8px] uppercase tracking-[0.28em]">
            <path id="circleHero" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
            <text>
              <textPath href="#circleHero" startOffset="0%">
                FARZI · SCROLL · REVEAL ·
              </textPath>
            </text>
          </svg>
          <span className="absolute text-[#D4AF37] text-xs font-bold">✦</span>
        </div>

        {/* Center / Right Coordinates & Indicator */}
        <div className="flex items-center gap-6 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          <span className="hidden sm:inline">PROGRESSIVE MOLECULAR LAB</span>
          <span className="text-[#D4AF37]">✦</span>
          <span>EST. 2014 · WORLDWIDE</span>
        </div>

      </div>

      {/* Decorative Gold Silk Ribbon Wave Sweep (SVG) across bottom */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none opacity-20 z-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-20 text-[#D4AF37]">
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="url(#goldGradientWave)"
          />
          <defs>
            <linearGradient id="goldGradientWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFF0D0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

    </section>
  );
};
