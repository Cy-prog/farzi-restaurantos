import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Wind, Flame, Eye, Droplet, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { soundFX } from '../../utils/soundEffects';

interface ElementChapter {
  id: string;
  name: string;
  hindi: string;
  subtitle: string;
  headline: string;
  description: string;
  appearingWords: string[];
  metrics: { label: string; value: string }[];
  image: string;
  fallbackImage: string;
  color: string;
}

const CHAPTERS: ElementChapter[] = [
  {
    id: 'soil',
    name: 'SOIL',
    hindi: 'मिट्टी',
    subtitle: 'TERROIR & SACRED ORIGIN',
    headline: 'Every deception begins with genuine truth.',
    description:
      'We source directly from centuries-old Himalayan valleys and Malabar spice hills. Mineral-rich terroir provides the authentic soul before our chefs begin the molecular alchemy.',
    appearingWords: [
      'SOIL',
      'KASHMIRI SAFFRON',
      'HIMALAYAN BLACK SALT',
      'MALABAR PEPPER',
      'GUNTUR CHILLI',
      'CLAY TANDOOR EMBERS'
    ],
    metrics: [
      { label: 'Terroir Elevation', value: '2,200m' },
      { label: 'Spice Purity', value: '100% Single-Origin' },
      { label: 'Clay Firing Temp', value: '480°C' }
    ],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop',
    color: '#D4AF37'
  },
  {
    id: 'cryo',
    name: 'CRYO',
    hindi: 'शीत',
    subtitle: 'LIQUID NITROGEN -196°C',
    headline: 'Sub-zero physics meets ancient Indian spice.',
    description:
      'At -196°C, liquid nitrogen flash-freezes volatile spice oils into micro-crystals, releasing an ethereal cascade of aromatic mist that spills across your table.',
    appearingWords: [
      'CRYO',
      '-196°C NITROGEN',
      'INSTANT FREEZE',
      'SUBLIMATION',
      'THEATRICAL VAPOUR',
      'AROMATIC AURA'
    ],
    metrics: [
      { label: 'Cryo Temp', value: '-196°C' },
      { label: 'Aroma Retention', value: '99.4%' },
      { label: 'Vapour Duration', value: '45 Seconds' }
    ],
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
    color: '#60A5FA'
  },
  {
    id: 'sphere',
    name: 'SPHERE',
    hindi: 'माया',
    subtitle: 'MOLECULAR SPHERIFICATION',
    headline: 'What you see is not what you taste.',
    description:
      'Using precise calcium baths and sodium alginate, we suspend complex liquid chutneys and chilled street-food broths inside delicate, shimmering translucent caviar spheres.',
    appearingWords: [
      'SPHERE',
      'SODIUM ALGINATE',
      'CALCIUM BATH',
      'PANI PURI CAVIAR',
      'BURST ON TONGUE',
      'OPTICAL RIDDLE'
    ],
    metrics: [
      { label: 'Membrane Thickness', value: '0.12mm' },
      { label: 'Burst Pressure', value: '0.4 PSI' },
      { label: 'Sphere Diameter', value: '24mm & 4mm' }
    ],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    color: '#34D399'
  },
  {
    id: 'farzi',
    name: 'ILLUSION',
    hindi: 'फ़र्ज़ी',
    subtitle: 'THE MODERN BISTRO',
    headline: 'Royal heritage surrenders to avant-garde wonder.',
    description:
      'Dal Chawal transformed into crisp Italian arancini. Butter chicken encased in cloud-soft steamed bao. Parle-G turned into liquid nitrogen cheesecake. An illusion so compelling it becomes reality.',
    appearingWords: [
      'FARZI',
      'DAL CHAWAL ARANCINI',
      'SMOKED BUTTER CHICKEN',
      'PARLE-G CHEESECAKE',
      'ROYAL HERITAGE',
      'AVANT-GARDE'
    ],
    metrics: [
      { label: 'Signature Dishes', value: '42 Creations' },
      { label: 'Global Bistros', value: '12 Locations' },
      { label: 'Founded By', value: 'Zorawar Kalra' }
    ],
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop',
    color: '#E09F27'
  }
];

const MANIFESTO_WORDS = [
  'NOTHING', 'IS', 'AS', 'IT', 'SEEMS.',
  'IN', 'THE', 'SOIL', 'OF', 'ROYAL', 'INDIA,',
  'CENTURIES', 'OF', 'SPICE', 'MET', 'FLAME.',
  'AT', 'FARZI,', 'WE', 'FREEZE', 'TRADITION', 'AT', '-196°C,',
  'SHATTER', 'EXPECTATIONS,', 'AND', 'RECONSTRUCT', 'MEMORY',
  'INTO', 'PURE', 'CULINARY', 'DECEPTION.',
  'THIS', 'IS', 'MODERN', 'INDIAN', 'GASTRONOMY.'
];

export const FarziKineticStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  // Scroll tracking for manifesto word-by-word reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const activeChapter = CHAPTERS[activeChapterIdx];

  return (
    <section
      id="farzi-kinetic-story"
      ref={containerRef}
      className="relative bg-[#0A0B0E] text-[#FAF8F5] py-24 sm:py-36 overflow-hidden selection:bg-[#D4AF37] selection:text-black"
    >
      {/* Background Ambience & Nitrogen Vapor Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-bold">
              [ THE ALCHEMY ANTHOLOGY · KINETIC SCROLL ]
            </span>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            INSPIRED BY TERROIR & AVANT-GARDE SCIENCE
          </div>
        </div>

        {/* 1. SCROLL-DRIVEN WORD-BY-WORD MANIFESTO (Like New Mix Coffee's story reveal) */}
        <div className="max-w-4xl mx-auto text-center py-12 sm:py-20">
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-[#D4AF37] block mb-6 font-bold">
            ✦ PHILOSOPHY IN MOTION
          </span>

          <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-5 gap-y-2 sm:gap-y-3 font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-snug">
            {MANIFESTO_WORDS.map((word, idx) => {
              const start = 0.08 + (idx / MANIFESTO_WORDS.length) * 0.35;
              const isHighlight = ['SOIL', '-196°C,', 'DECEPTION.', 'FARZI,', 'GASTRONOMY.'].includes(word);

              return (
                <WordReveal
                  key={`${word}-${idx}`}
                  word={word}
                  progress={scrollYProgress}
                  start={start}
                  isHighlight={isHighlight}
                />
              );
            })}
          </div>
          <p className="mt-8 text-xs sm:text-sm font-mono tracking-widest uppercase text-neutral-400">
            ↓ Scroll through the elemental chapters of our illusion
          </p>
        </div>

        {/* 2. THE 4 ELEMENT CHAPTERS (SOIL · CRYO · SPHERE · ILLUSION) */}
        <div className="mt-16 pt-12 border-t border-white/10">
          
          {/* Chapter Quick Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
            {CHAPTERS.map((chap, idx) => {
              const isSelected = activeChapterIdx === idx;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(idx);
                    soundFX.playWhoosh();
                  }}
                  className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-serif text-[#D4AF37]">
                      {chap.hindi}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-white">
                    {chap.name}
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase mt-1 truncate">
                    {chap.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Chapter Deep-Dive Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Narrative & Kinetic Appearing Words (6 Cols) */}
            <div className="lg:col-span-6 space-y-8">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
                  <span>CHAPTER 0{activeChapterIdx + 1}</span>
                  <span>·</span>
                  <span>{activeChapter.subtitle}</span>
                </div>

                <div className="flex items-baseline gap-4">
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white">
                    {activeChapter.name}
                  </h2>
                  <span className="text-2xl sm:text-4xl font-serif text-[#D4AF37]/60">
                    {activeChapter.hindi}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-200">
                  {activeChapter.headline}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {activeChapter.description}
              </p>

              {/* APPEARING WORDS ON SCROLL (As requested: words like "SOIL", "SAFFRON", "CRYO", etc.) */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-bold block">
                  ✦ ACTIVE KINETIC INGREDIENTS & TERMS
                </span>

                <div className="flex flex-wrap gap-2">
                  {activeChapter.appearingWords.map((word, wIdx) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: wIdx * 0.08, duration: 0.4 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${
                        wIdx === 0
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-white/10 text-white border-white/15 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Lab Metrics Strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {activeChapter.metrics.map((m) => (
                  <div key={m.label} className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">
                      {m.label}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-black text-white">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Theatrical Visual Card (6 Cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[580px] rounded-3xl overflow-hidden border border-white/20 bg-neutral-900 shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <ImageWithFallback
                      src={activeChapter.image}
                      alt={activeChapter.name}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                      fallbackSrc={activeChapter.fallbackImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Corner Glass Badge */}
                <div className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                  MOLECULAR EVIDENCE [0{activeChapterIdx + 1}]
                </div>

                {/* Bottom Overlay Summary */}
                <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                      {activeChapter.subtitle}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase">
                      FARZI MOLECULAR ARCHIVE
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-lg text-white">
                    {activeChapter.headline}
                  </h4>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. FLOATING KINETIC WORDS STREAM (Horizontal marquee that glides on scroll) */}
        <div className="mt-20 pt-10 border-t border-white/10 overflow-hidden">
          <div className="text-[10px] font-mono tracking-[0.35em] uppercase text-center text-neutral-500 mb-6">
            ✦ CONTINUOUS GASTRONOMIC LEXICON ✦
          </div>

          <div className="relative w-full overflow-hidden flex whitespace-nowrap py-3">
            <div className="flex gap-8 animate-marquee font-display font-black text-3xl sm:text-4xl uppercase tracking-wider text-neutral-500/40">
              <span>SOIL</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>KASHMIRI SAFFRON</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>-196°C LIQUID NITROGEN</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>SPHERIFIED CAVIAR</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>DECONSTRUCTED ARANCINI</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>SMOKED CHARCOAL</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>THEATRICAL ALCHEMY</span>
              <span className="text-[#D4AF37]">✦</span>
            </div>

            <div className="flex gap-8 animate-marquee font-display font-black text-3xl sm:text-4xl uppercase tracking-wider text-neutral-500/40" aria-hidden="true">
              <span>SOIL</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>KASHMIRI SAFFRON</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>-196°C LIQUID NITROGEN</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>SPHERIFIED CAVIAR</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>DECONSTRUCTED ARANCINI</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>SMOKED CHARCOAL</span>
              <span className="text-[#D4AF37]">✦</span>
              <span>THEATRICAL ALCHEMY</span>
              <span className="text-[#D4AF37]">✦</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// Subcomponent for Word-by-Word Scroll Reveal
interface WordRevealProps {
  word: string;
  progress: import('framer-motion').MotionValue<number>;
  start: number;
  isHighlight: boolean;
}

const WordReveal: React.FC<WordRevealProps> = ({ word, progress, start, isHighlight }) => {
  const opacity = useTransform(progress, [start, start + 0.05], [0.18, 1]);
  const y = useTransform(progress, [start, start + 0.05], [6, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block transition-colors duration-300 ${
        isHighlight
          ? 'text-[#D4AF37] font-black drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]'
          : 'text-white'
      }`}
    >
      {word}
    </motion.span>
  );
};

