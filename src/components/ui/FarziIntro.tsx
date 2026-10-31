import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface FarziIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const FarziIntro: React.FC<FarziIntroProps> = ({ onComplete, forcePlay = false }) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (forcePlay) return true;
    if (typeof window !== 'undefined' && window.location.search.includes('intro=true')) return true;
    const hasSeen = sessionStorage.getItem('farzi_intro_shown_v3');
    return !hasSeen;
  });

  const [videoError, setVideoError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress through theatrical steps
  useEffect(() => {
    if (!isVisible) return;

    const stepTimer1 = setTimeout(() => setActiveStep(1), 800);
    const stepTimer2 = setTimeout(() => setActiveStep(2), 1800);
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 4600);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(autoCloseTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const handleClose = () => {
    sessionStorage.setItem('farzi_intro_shown_v3', 'true');
    if (soundEnabled) {
      soundFX.playWhoosh();
      soundFX.playChime();
    }
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="farzi-cinematic-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080A] text-[#FAF8F5] overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Golden Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.14)_0%,transparent_60%)] pointer-events-none" />
          
          {/* Liquid Nitrogen Floating Mist / Smoke Animation Simulation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-gradient-to-t from-[#D4AF37]/20 to-transparent blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-gradient-to-t from-white/10 to-transparent blur-2xl animate-float" />
          </div>

          {/* Top Control Bar: Audio Toggle & Skip Intro */}
          <div className="absolute top-6 left-6 right-6 z-40 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span>FARZI ILLUSION PORTAL</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                }}
                className="p-2 rounded-full border border-white/10 bg-black/40 text-neutral-400 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="px-4 py-1.5 rounded-full border border-white/20 bg-black/50 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-300 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Enter Bistro [Esc] →
              </button>
            </div>
          </div>

          {/* Left Curtain Panel (Gilded Grand Velvet Doors) */}
          <motion.div
            exit={{ x: '-100%', transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#07080A] border-r border-[#D4AF37]/30 pointer-events-none shadow-2xl z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
          </motion.div>

          {/* Right Curtain Panel (Gilded Grand Velvet Doors) */}
          <motion.div
            exit={{ x: '100%', transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#07080A] border-l border-[#D4AF37]/30 pointer-events-none shadow-2xl z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
          </motion.div>

          {/* Central Theatrical Experience */}
          <div className="relative z-20 flex flex-col items-center justify-center px-6 max-w-2xl text-center">
            
            {/* The Mandala Labyrinth Emblem with Orbital Glow */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 flex items-center justify-center cursor-pointer group"
              onClick={handleClose}
            >
              {/* Outer Golden Astrological Ring */}
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-spin-slow group-hover:border-[#D4AF37] transition-colors" />
              <div className="absolute -inset-2 rounded-full border border-dashed border-[#D4AF37]/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '35s' }} />
              
              {/* Core Seal */}
              <div className="relative w-20 h-20 rounded-full bg-black/90 border border-[#D4AF37]/40 p-3 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
                <img
                  src="/farzi-logo.svg"
                  alt="Farzi Seal"
                  className="w-full h-full object-contain filter invert drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                />
              </div>
            </motion.div>

            {/* Video Chamber or Wordmark */}
            {!videoError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="overflow-hidden rounded-2xl border border-[#D4AF37]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-black/60 backdrop-blur-md mb-4 p-1 max-w-xs sm:max-w-sm"
              >
                <video
                  src="/introfarzi.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-24 sm:h-28 object-contain rounded-xl"
                />
              </motion.div>
            ) : null}

            {/* Editorial Title Mask */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-3xl sm:text-5xl tracking-[0.22em] uppercase text-white drop-shadow-md"
              >
                FARZI CAFÉ
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-2 text-xs sm:text-sm font-mono tracking-[0.35em] text-[#D4AF37] uppercase font-semibold flex items-center justify-center gap-3"
            >
              <span>✦</span>
              <span>MODERN INDIAN BISTRO</span>
              <span>✦</span>
            </motion.div>

            {/* Farzi Philosophy Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 text-xs sm:text-sm text-neutral-300 font-light max-w-lg leading-relaxed italic"
            >
              "The word 'Farzi' can have many connotations, but at Farzi Café, it has only one: creating an illusion."
            </motion.p>

            {/* Theatrical Staged Words Progression */}
            <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className={`px-2.5 py-1 rounded transition-colors ${activeStep >= 0 ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30' : 'text-neutral-600'}`}>
                01. SOIL & HERITAGE
              </span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2.5 py-1 rounded transition-colors ${activeStep >= 1 ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30' : 'text-neutral-600'}`}>
                02. CRYO MOLECULAR
              </span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2.5 py-1 rounded transition-colors ${activeStep >= 2 ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30' : 'text-neutral-600'}`}>
                03. THE ILLUSION
              </span>
            </div>

            {/* Enter The Illusion Action CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <button
                type="button"
                onClick={handleClose}
                className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E09F27] hover:from-[#E09F27] hover:to-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
                <span>ENTER THE ILLUSION</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Timed Progress Line */}
            <div className="mt-8 w-44 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className="h-full bg-[#D4AF37]"
              />
            </div>
            <span className="mt-2 text-[9px] font-mono uppercase tracking-widest text-neutral-500">
              Auto-advancing to Dining Chamber · Click anywhere to skip
            </span>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
