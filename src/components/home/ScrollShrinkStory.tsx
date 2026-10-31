import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Eye, Flame, Compass, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card3DTilt } from '../3d/Card3DTilt';

interface StoryScene {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  tag: string;
  specs: { label: string; value: string }[];
}

const SCENES: StoryScene[] = [
  {
    id: 'scene-1',
    number: '01',
    eyebrow: 'DECONSTRUCTED HERITAGE',
    title: 'The Sphere of Sensation',
    headline: 'What begins as illusion ends in pure soul.',
    description:
      'Sodium alginate membrane meets chilled spiced mint water. Upon contact with the palate, 0.12mm calcium walls dissolve instantaneously, flooding the senses with authentic street-food ecstasy.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    tag: 'SODIUM ALGINATE SPHERE',
    specs: [
      { label: 'Membrane Wall', value: '0.12mm' },
      { label: 'Chilled Temp', value: '3.8°C' },
      { label: 'Burst Velocity', value: 'Instant' },
    ],
  },
  {
    id: 'scene-2',
    number: '02',
    eyebrow: 'CRYOGENIC SUB-ZERO PHYSICS',
    title: 'The -196°C Nitrogen Mist',
    headline: 'Sub-zero vapor locks essential aromatic oils.',
    description:
      'Liquid nitrogen flash-freezes cardamom and saffron mist into delicate culinary snow. As the cold vapor spills across your table, volatile top-notes are released directly into the olfactory senses.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
    tag: '-196°C LIQUID NITROGEN',
    specs: [
      { label: 'Cryo Point', value: '-196°C' },
      { label: 'Aroma Extraction', value: '99.4%' },
      { label: 'Table Theatre', value: '45 Sec' },
    ],
  },
  {
    id: 'scene-3',
    number: '03',
    eyebrow: 'CROSS-CULTURAL ALCHEMY',
    title: 'The Dal Chawal Arancini',
    headline: 'Centuries of comforting daal turned Sicilian crisp.',
    description:
      'Slow-tempered yellow lentils and short-grain risotto rice rolled in dehydrated papad crumbs, fried to amber perfection, and crowned with a spherified tomato punch sphere and mint emulsion.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
    tag: 'ARBORIO & MOONG DAL',
    specs: [
      { label: 'Slow Cook', value: '6 Hours' },
      { label: 'Crisp Crust', value: 'Papad Crumbs' },
      { label: 'Crowning', value: 'Saffron Sphere' },
    ],
  },
];

export const ScrollShrinkStory: React.FC = () => {
  return (
    <section className="bg-[#0A0B0E] text-[#F3EFE6] relative overflow-hidden">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-[0.25em] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scroll-Driven Sensory Transformations</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tight text-white">
          THE ILLUSION <span className="gold-gradient-text italic font-normal">DEEPENS</span>
        </h2>
        <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 mt-2 uppercase">
          Each creation contracts from landscape to centerpiece as you journey down.
        </p>
      </div>

      {/* Individual Pinned Shrink Scenes */}
      {SCENES.map((scene, index) => (
        <SingleShrinkSection key={scene.id} scene={scene} index={index} />
      ))}
    </section>
  );
};

const SingleShrinkSection: React.FC<{ scene: StoryScene; index: number }> = ({ scene, index }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Scale down animation: starts full width (1.0), shrinks smoothly down to 0.75 (image 3 look!)
  const scale = useTransform(smooth, [0, 0.45, 0.85], [1.0, 0.84, 0.72]);
  const borderRadius = useTransform(smooth, [0, 0.4, 0.8], [0, 24, 36]);
  const borderOpacity = useTransform(smooth, [0.1, 0.5], [0, 0.4]);

  // Dashed line from top
  const lineScale = useTransform(smooth, [0, 0.3], [1, 0.3]);
  const lineOpacity = useTransform(smooth, [0, 0.2], [0.7, 0]);

  // Oversized background index number [01], [02], [03]
  const numberY = useTransform(smooth, [0, 0.8], [0, -120]);
  const numberOpacity = useTransform(smooth, [0, 0.4, 0.8], [0.12, 0.08, 0.03]);

  // Revealed metrics info below when card shrinks
  const metricsOpacity = useTransform(smooth, [0.35, 0.75], [0, 1]);
  const metricsY = useTransform(smooth, [0.35, 0.75], [30, 0]);

  return (
    <div ref={targetRef} className="relative h-[200vh] bg-[#0A0B0E]">
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8">
        {/* Center Dashed Connecting Line (From User Image 1) */}
        <motion.div
          style={{ scaleY: lineScale, opacity: lineOpacity }}
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-16 border-l border-dashed border-[#D4AF37]/50 origin-top z-20 pointer-events-none"
        />

        {/* Oversized Background Number Watermark */}
        <motion.div
          style={{ y: numberY, opacity: numberOpacity }}
          className="absolute top-10 right-4 sm:right-16 z-0 select-none pointer-events-none"
        >
          <span className="font-display font-black text-[22vw] text-white leading-none">
            {scene.number}
          </span>
        </motion.div>

        {/* Top Minimal Scene Header */}
        <div className="text-center z-20 mb-4 max-w-xl pointer-events-none">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">
              CHAPTER {scene.number} • {scene.eyebrow}
            </span>
          </div>
          <h3 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            {scene.title}
          </h3>
        </div>

        {/* The Shrinking Card Container (Directly Replicating Image 1 -> 3 Shrinking Motion) */}
        <motion.div
          style={{
            scale,
            borderRadius,
          }}
          className="relative z-10 w-full max-w-5xl h-[56vh] sm:h-[62vh] shadow-2xl overflow-hidden bg-[#12141A]"
        >
          {/* Golden Border Edge */}
          <motion.div
            style={{
              borderRadius,
              opacity: borderOpacity,
            }}
            className="absolute inset-0 border border-[#D4AF37] pointer-events-none z-20"
          />

          {/* Full-Bleed Studio Photo */}
          <img
            src={scene.image}
            alt={scene.title}
            className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.88]"
          />

          {/* Dark Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/75" />

          {/* Inside Card Text Overlays (Matching Image 1 & 3) */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-10 pointer-events-none">
            {/* Top Tag Pill */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 uppercase">
                {scene.tag}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                [FARZI LAB SPEC {scene.number}]
              </span>
            </div>

            {/* Bottom Inner Headline */}
            <div className="max-w-lg">
              <h4 className="text-lg sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                {scene.headline}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1.5 line-clamp-2 leading-relaxed">
                {scene.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Revealed Metrics & Action Bar below the card when shrunk (Image 3) */}
        <motion.div
          style={{ opacity: metricsOpacity, y: metricsY }}
          className="relative z-20 mt-6 w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 px-2"
        >
          {/* Tech Specs */}
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {scene.specs.map((spec, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  {spec.label}
                </span>
                <span className="font-serif font-bold text-sm sm:text-base text-[#D4AF37]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E222D] hover:bg-[#D4AF37] text-white hover:text-[#0A0B0E] border border-neutral-700 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <span>Tasting Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollShrinkStory;
