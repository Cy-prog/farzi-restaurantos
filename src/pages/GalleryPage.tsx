import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../types';
import { api } from '../services/api';
import { Lightbox } from '../components/ui/Lightbox';
import { PageTransition } from '../components/motion/PageTransition';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setImages(data || []);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Ambience', 'Culinary Art', 'Mixology'];

  const filteredImages = images.filter((img) => {
    if (activeCategory === 'All') return true;
    return img.categoryName?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <PageTransition className="pt-28 pb-24 bg-[#FAF9F5] text-[#12141A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative text-center max-w-3xl mx-auto mb-12">
          <div className="hidden lg:flex absolute -right-16 -top-4 w-24 h-24 rounded-full border border-black/15 items-center justify-center p-1.5 animate-spin-slow pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#D4AF37] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathGallery" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathGallery" startOffset="0%">
                  FARZI CAFÉ · AMBIENCE & LAB ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#D4AF37] text-xs">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-[#D4AF37] text-[10px] font-mono uppercase tracking-[0.25em] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>VISUAL ANTHOLOGY · PLATING & MIXOLOGY ARCHIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-black tracking-tight uppercase mb-4">
            EDITORIAL <span className="text-stroke">MOMENTS</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
            Glimpses into our dining chambers, kinetic plating stations, and molecular cocktail experiments.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-black text-white font-bold shadow-md'
                    : 'bg-white text-neutral-700 border border-black/10 hover:border-black hover:text-black shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 rounded-2xl skeleton-shimmer border border-black/5 bg-white" />
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                data-cursor="EXPAND"
                className="group relative rounded-2xl overflow-hidden border border-black/10 hover:border-black bg-white aspect-[4/3] cursor-pointer transition-all shadow-sm hover:shadow-xl"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[10px] text-[#D4AF37] bg-black/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                    [ 0{idx + 1} ]
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block font-semibold">
                      {img.categoryName || 'Lab'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-white drop-shadow-sm">
                      {img.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-black/20 flex items-center justify-center text-black group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-black/10 text-neutral-600 font-mono text-xs shadow-sm">
            No gallery imagery cataloged under this category.
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </PageTransition>
  );
};

export default GalleryPage;
