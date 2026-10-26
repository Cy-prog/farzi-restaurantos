import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FarziIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const FarziIntro: React.FC<FarziIntroProps> = ({ onComplete, forcePlay = false }) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (forcePlay) return true;
    // Check if already shown in this session
    const hasSeen = sessionStorage.getItem('farzi_intro_shown');
    return !hasSeen;
  });

  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    // Sequence phases
    const t1 = setTimeout(() => setPhase(1), 300);   // Logo & Ring emerge
    const t2 = setTimeout(() => setPhase(2), 1100);  // Name & Wordmark reveal
    const t3 = setTimeout(() => setPhase(3), 1900);  // "Creating an Illusion" tagline
    const t4 = setTimeout(() => handleClose(), 3300); // Complete & fade out

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isVisible]);

  const handleClose = () => {
    sessionStorage.setItem('farzi_intro_shown', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="farzi-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030505] text-ivory-100 overflow-hidden select-none"
        >
          {/* Ambient Cinematic Light Glows */}
          <div className="absolute inset-0 bg-radial-ambient opacity-60 pointer-events-none" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.25 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gold-500/15 blur-3xl pointer-events-none"
          />

          {/* Top Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleClose}
            className="absolute top-6 right-6 z-20 px-3.5 py-1 rounded-full bg-charcoal-900/80 border border-gold-500/30 text-gold-300 hover:text-white hover:border-gold-400 text-xs font-mono uppercase tracking-widest transition-all"
          >
            Skip Intro →
          </motion.button>

          {/* Central Logo & Brand Animation Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl">
            {/* 1. Official Farzi Round Seal / Emblem with Golden Rings */}
            <div className="relative mb-6">
              {/* Expanding Pulse Ring */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={phase >= 1 ? { scale: [0.9, 1.3, 1.1], opacity: [0, 0.6, 0.2] } : {}}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="absolute -inset-4 rounded-full border border-gold-400/40"
              />

              {/* Second Golden Ambient Halo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 0.8 } : {}}
                transition={{ duration: 1 }}
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-gold-500/30 via-copper-500/20 to-gold-400/30 blur-md"
              />

              {/* Round Emblem Container */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
                animate={phase >= 1 ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-charcoal-900 border-2 border-gold-500/60 p-3 shadow-2xl shadow-gold-500/30 flex items-center justify-center overflow-hidden"
              >
                <img
                  src="/farzi-logo.svg"
                  alt="Farzi Cafe Seal"
                  className="w-full h-full object-contain filter invert drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                />
              </motion.div>
            </div>

            {/* 2. "FARZI CAFÉ" Name Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-[0.28em] text-ivory-50 uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                FARZI <span className="gold-gradient-text">CAFÉ</span>
              </h1>
            </motion.div>

            {/* 3. Official Tagline: "CREATING AN ILLUSION" */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 flex flex-col items-center"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-serif italic text-gold-300 font-medium tracking-widest">
                <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-gold-400" />
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="tracking-[0.2em] uppercase font-mono text-[11px] sm:text-xs">
                  Creating an illusion
                </span>
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-gold-400" />
              </div>

              <p className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.3em] text-charcoal-400 mt-2">
                Progressive Modern Indian Bistro
              </p>
            </motion.div>

            {/* 4. Luxury Progress / Loading Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '160px', opacity: 1 }}
              transition={{ duration: 2.8, ease: 'easeInOut' }}
              className="mt-8 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            />
          </div>

          {/* Bottom subtle brand credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 text-[10px] font-mono tracking-widest text-charcoal-500 uppercase"
          >
            Farzi Culinary Laboratory • Zorawar Kalra
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
