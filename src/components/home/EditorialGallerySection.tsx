import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ArrowRight } from 'lucide-react';
import { GalleryImage } from '../../types';
import { Link } from 'react-router-dom';

interface EditorialGallerySectionProps {
  images: GalleryImage[];
  onOpenLightbox: (index: number) => void;
}

export const EditorialGallerySection: React.FC<EditorialGallerySectionProps> = ({
  images,
  onOpenLightbox,
}) => {
  const displayImages = images.length > 0 ? images.slice(0, 4) : [
    {
      id: 1,
      imageUrl: '/herofarzi2-Tu5MyXUR.jpg',
      title: 'The Entrance Portal',
      categoryName: 'Chambers',
      description: 'The dramatic threshold into sensory deception'
    },
    {
      id: 2,
      imageUrl: '/reservatiobg-DoLRoJlO.jpg',
      title: 'Tandoor & Liquid Nitrogen Bar',
      categoryName: 'Theatre',
      description: 'Where 200°C tandoor heat meets -196°C cryo vapor'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      title: 'The Alchemist Mixology Lab',
      categoryName: 'Botanicals',
      description: 'Smoked botanicals and reverse-spherified elixirs'
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      title: 'Plating Architecture',
      categoryName: 'Gastronomy',
      description: 'Geometric balance of spice, texture, and optical riddles'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-white text-[#12141A] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 editorial-border-b">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-[#FAF9F5] text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase mb-4 shadow-sm">
              <span>✦</span>
              <span>VISUAL ARCHIVE & AMBIENCE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight leading-[0.92] text-black">
              THE THEATRE OF <br />
              <span className="text-stroke">EXPERIENCE</span>
            </h2>
          </div>

          <Link to="/gallery" data-cursor="EXPLORE">
            <button className="px-6 py-3 rounded-xl border border-black/20 hover:border-black bg-white hover:bg-black text-xs font-mono tracking-widest uppercase text-black hover:text-white transition-all flex items-center gap-2 shadow-sm">
              <span>Full Archive</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </Link>
        </div>

        {/* Asymmetric Editorial Grid (Large Hero Left, Staggered Right - 30%+ Photography) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Showcase (7 Cols) */}
          <div
            onClick={() => onOpenLightbox(0)}
            data-cursor="EXPAND"
            className="md:col-span-7 relative rounded-2xl overflow-hidden border border-black/15 bg-neutral-950 min-h-[420px] sm:min-h-[500px] cursor-pointer group shadow-2xl"
          >
            <img
              src={displayImages[0].imageUrl}
              alt={displayImages[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            <div className="absolute top-5 left-5">
              <span className="font-mono text-xs text-[#D4AF37] font-bold bg-white/95 px-3 py-1 rounded-md border border-black/10 shadow-md">
                [ 01 / 04 ]
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                  {displayImages[0].categoryName || 'Ambience'}
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
                  {displayImages[0].title}
                </h3>
                <p className="text-xs text-neutral-300 font-light mt-1">
                  {displayImages[0].description}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-lg">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Secondary Stack (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {displayImages.slice(1, 3).map((img, idx) => (
              <div
                key={img.id}
                onClick={() => onOpenLightbox(idx + 1)}
                data-cursor="EXPAND"
                className="relative flex-1 rounded-2xl overflow-hidden border border-black/15 bg-neutral-950 min-h-[220px] cursor-pointer group shadow-xl"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="font-mono text-[10px] text-neutral-800 font-bold bg-white/95 px-2.5 py-1 rounded border border-black/10 shadow-sm">
                    [ 0{idx + 2} / 04 ]
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                      {img.categoryName || 'Lab'}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                      {img.title}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
