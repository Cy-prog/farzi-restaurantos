import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FarziIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const FarziIntro: React.FC<FarziIntroProps> = ({ onComplete, forcePlay = false }) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (forcePlay) return true;
    const hasSeen = sessionStorage.getItem('farzi_intro_shown_v2');
    return !hasSeen;
  });

  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Snappy auto-advance (~1.8 seconds)
    const timer = setTimeout(() => {
      handleClose();
    }, 1900);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleClose = () => {
    sessionStorage.setItem('farzi_intro_shown_v2', 'true');
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
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080A] text-[#F4F0E8] overflow-hidden select-none cursor-pointer"
        >
          {/* Subtle ambient glow in center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,159,39,0.12)_0%,transparent_60%)] pointer-events-none" />

          {/* Top skip prompt */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 right-6 z-30"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#F4F0E8]/70 hover:text-white hover:border-[#E09F27] transition-colors"
            >
              Skip Intro [Esc] →
            </button>
          </motion.div>

          {/* Left / Right Editorial Curtain Panels */}
          <motion.div
            exit={{ x: '-100%', transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#07080A] border-r border-white/5 pointer-events-none"
          />
          <motion.div
            exit={{ x: '100%', transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#07080A] border-l border-white/5 pointer-events-none"
          />

          {/* Central Logo & Masked Reveal */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-xl text-center">
            {/* The Mandala Labyrinth Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-[#E09F27]/30 animate-spin-slow" />
              <img
                src="/farzi-logo.svg"
                alt="Farzi Labyrinth Emblem"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter invert drop-shadow-[0_0_15px_rgba(224,159,39,0.5)]"
              />
            </motion.div>

            {/* Video or wordmark */}
            {!videoError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="overflow-hidden rounded-xl"
              >
                <video
                  src="/introfarzi.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-64 h-24 sm:w-80 sm:h-28 object-contain"
                />
              </motion.div>
            ) : null}

            {/* Editorial Title Mask */}
            <div className="overflow-hidden mt-3">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-2xl sm:text-3xl tracking-[0.25em] uppercase text-white"
              >
                FARZI CAFÉ
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-2 flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#E09F27] uppercase"
            >
              <span>✦</span>
              <span>CREATING AN ILLUSION</span>
              <span>✦</span>
            </motion.div>

            {/* Precision Loading Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="mt-6 h-[1.5px] bg-[#E09F27] rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 text-[9px] font-mono tracking-[0.3em] uppercase text-white/40"
          >
            Click anywhere to enter · Modern Indian Gastronomy
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
