import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, Maximize2, Camera } from 'lucide-react';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RealFarziImage {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

const REAL_FARZI_IMAGES: RealFarziImage[] = [
  {
    id: 1,
    src: '/arancini.jpg',
    title: 'Dal Chawal Arancini on Slate',
    category: 'Signature Tapas',
    description: 'Crisp golden lentil & rice arancini served on natural stone slate with house curry foam.'
  },
  {
    id: 2,
    src: '/dining-ambience.jpg',
    title: '#FarziAfied Amber Bar',
    category: 'Mixology Chamber',
    description: 'The illuminated bar counter under warm neon ambient glow.'
  },
  {
    id: 3,
    src: '/cloche-dish.jpg',
    title: 'Smoked Cloche Culinary Reveal',
    category: 'Progressive Mains',
    description: 'Aromatic applewood smoke reveal tableside with delicate charred garnishes.'
  },
  {
    id: 4,
    src: '/paneer-tikka.jpg',
    title: 'Paneer Tikka & Coral Lace Tuile',
    category: 'Tandoor Art',
    description: 'Smoked cottage cheese crowned with delicate saffron coral lace tuile.'
  },
  {
    id: 5,
    src: '/chef-plating.jpg',
    title: 'Molecular Plating Theatre',
    category: 'Molecular Science',
    description: 'Precision tweezers and micro-herbs applied to deconstructed royal recipes.'
  },
  {
    id: 6,
    src: '/naan-bomb.jpg',
    title: 'Truffle Naan Bomb',
    category: 'Tandoor Reinvented',
    description: 'Mini tandoori naans filled with molten aged cheddar and black truffle butter.'
  },
  {
    id: 7,
    src: '/farzi-storefront-clean.jpg',
    title: 'The Flagship Façade & Entrance',
    category: 'Patio & Garden',
    description: 'Lush tropical botanical canopy and backlit bistro signage.'
  },
  {
    id: 8,
    src: '/tres-leches.jpg',
    title: 'Ras Malai Tres Leches & Saffron Foam',
    category: 'Sweet Illusion',
    description: 'Delicate cardamom cottage cheese soaked in three-milk bath with gold dust.'
  },
  {
    id: 9,
    src: '/herofarzi-main.jpg',
    title: 'Grand Velvet Art Chamber',
    category: 'Ambience',
    description: 'Plush velvet booth seating with contemporary bespoke Indian surrealist art.'
  },
  {
    id: 10,
    src: '/apple-foamintini.jpg',
    title: 'Botanical Nitrogen Cocktail',
    category: 'Mixology',
    description: 'Citrus botanicals with aromatic liquid nitrogen vapor and warm bar glow.'
  }
];

interface RealFarziStoriesSectionProps {
  onOpenImage?: (src: string, title: string) => void;
}

export const RealFarziStoriesSection: React.FC<RealFarziStoriesSectionProps> = ({ onOpenImage }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.story-card');

    // GSAP ScrollTrigger Stagger Reveal with clip-path
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#08090C] text-[#F4F0E8] overflow-hidden editorial-border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#12141A] text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase mb-4 shadow-sm">
              <Camera className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>LIVE FROM THE BISTRO · REAL FARZI TALES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black uppercase tracking-tight text-white leading-none">
              AUTHENTIC <br />
              <span className="text-gold-gradient italic font-normal">MOMENTS & REELS</span>
            </h2>
          </div>

          {/* Instagram Reel Direct Link */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/reel/DM2KRoUPbpH/?utm_source=ig_web_copy_link&vrfl=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F6D] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Watch Reel on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Real Farzi Photos Grid (2 to 5 columns responsive) */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {REAL_FARZI_IMAGES.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenImage && onOpenImage(item.src, item.title)}
              className="story-card group relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C] aspect-square cursor-pointer hover:border-[#D4AF37]/70 hover:shadow-[0_12px_30px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <ImageWithFallback
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter contrast-105"
                fallbackSrc="/arancini.jpg"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

              {/* Top Category Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="text-[8.5px] font-mono tracking-wider uppercase text-[#E5B869] font-bold bg-black/70 px-2 py-0.5 rounded border border-[#D4AF37]/30 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Zoom Trigger Button Top Right */}
              <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3 h-3 text-[#E5B869]" />
              </div>

              {/* Bottom Meta */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-white group-hover:text-[#E5B869] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Coordinates Strip */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          <span>SOURCE: OFFICIAL FARZI CAFÉ DIGITAL REELS & ARCHIVE</span>
          <span className="text-[#D4AF37]">#FARZIFIED · MODERN GASTRONOMY</span>
        </div>

      </div>
    </section>
  );
};
