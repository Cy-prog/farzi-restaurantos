import React, { useState, useEffect } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { GalleryImage } from '../types';
import { api } from '../services/api';
import { Lightbox } from '../components/ui/Lightbox';
import { PageTransition } from '../components/motion/PageTransition';
import { FadeIn } from '../components/motion/FadeIn';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Ambience', 'Culinary Art', 'Mixology'];

  const filteredImages = images.filter(img => {
    if (activeCategory === 'All') return true;
    return img.categoryName?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <PageTransition className="pt-28 pb-24 bg-charcoal-950 text-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Visual Anthology</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 tracking-tight mb-4">
            Editorial Moments & Ambience
          </h1>
          <p className="text-sm sm:text-base text-ivory-300 font-light max-w-xl mx-auto leading-relaxed">
            Glimpses into our dining chambers, kinetic plating stations, and molecular cocktail experiments.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-lg shadow-gold-500/20'
                    : 'bg-charcoal-900 text-ivory-300 border border-charcoal-700/80 hover:text-white hover:bg-charcoal-800'
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
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-72 bg-charcoal-900 rounded-2xl animate-pulse border border-charcoal-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <FadeIn key={img.id} delay={idx * 0.08}>
                <div
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-charcoal-800 bg-charcoal-900 shadow-lg hover:border-gold-500/40 transition-all duration-300"
                >
                  <ImageWithFallback
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                  {/* Overlay Info */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <span className="p-2 rounded-full bg-charcoal-950/80 text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity border border-charcoal-700">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>

                    <div>
                      {img.categoryName && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                          {img.categoryName}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-lg text-ivory-100 group-hover:text-gold-200 transition-colors mt-0.5">
                        {img.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Component */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </PageTransition>
  );
};
