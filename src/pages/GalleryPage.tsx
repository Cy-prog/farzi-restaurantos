import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../types';
import { api } from '../services/api';
import { Lightbox } from '../components/ui/Lightbox';
import { PageTransition } from '../components/motion/PageTransition';

const REAL_FARZI_GALLERY: GalleryImage[] = [
  {
    id: 101,
    title: '#FarziAfied Neon Bar & Mixology Lounge',
    categoryName: 'Ambience',
    imageUrl: '/dining-ambience.jpg',
    description: 'High-energy backlit mixology lounge with liquid nitrogen cocktail stations.',
    isVideo: false,
    displayOrder: 1
  },
  {
    id: 102,
    title: 'The Flagship Façade & Botanical Entrance',
    categoryName: 'Ambience',
    imageUrl: '/farzi-storefront-clean.jpg',
    description: 'Ornate backlit bistro entrance framed by tropical palm fronds.',
    isVideo: false,
    displayOrder: 2
  },
  {
    id: 103,
    title: 'Deconstructed Dal Chawal Arancini',
    categoryName: 'Culinary Art',
    imageUrl: '/arancini.jpg',
    description: 'Golden spiced lentil and rice arancini spheres with pickled achar foam.',
    isVideo: false,
    displayOrder: 3
  },
  {
    id: 104,
    title: 'Tandoor Smoked Paneer Tikka Tuile',
    categoryName: 'Culinary Art',
    imageUrl: '/paneer-tikka.jpg',
    description: 'Clay-oven charred cottage cheese crowned with delicate coriander lace tuile.',
    isVideo: false,
    displayOrder: 4
  },
  {
    id: 105,
    title: 'Molecular Plating & Chef Presentation',
    categoryName: 'Culinary Art',
    imageUrl: '/chef-plating.jpg',
    description: 'Intricate micro-herb garnishing and tableside sensory dining theatre.',
    isVideo: false,
    displayOrder: 5
  },
  {
    id: 106,
    title: 'Smoked Cloche Culinary Reveal',
    categoryName: 'Culinary Art',
    imageUrl: '/cloche-dish.jpg',
    description: 'Tableside cloche reveal spilling aromatic applewood smoke and ember char.',
    isVideo: false,
    displayOrder: 6
  },
  {
    id: 107,
    title: 'Molten Truffle Naan Bomb',
    categoryName: 'Culinary Art',
    imageUrl: '/naan-bomb.jpg',
    description: 'Mini tandoori naans filled with molten aged cheddar and black truffle butter.',
    isVideo: false,
    displayOrder: 7
  },
  {
    id: 108,
    title: 'Lush Botanical Terrace & Outdoor Seating',
    categoryName: 'Ambience',
    imageUrl: '/storefront.jpg',
    description: 'Cushioned banquettes nestled within tropical foliage and glass canopies.',
    isVideo: false,
    displayOrder: 8
  },
  {
    id: 109,
    title: 'Grand Farzi Velvet Chamber',
    categoryName: 'Ambience',
    imageUrl: '/herofarzi-main.jpg',
    description: 'Warm ambient lighting over plush velvet dining banquettes and marble.',
    isVideo: false,
    displayOrder: 9
  },
  {
    id: 110,
    title: 'Liquid Nitrogen Apple Foamintini',
    categoryName: 'Mixology',
    imageUrl: '/apple-foamintini.jpg',
    description: 'Infused botanical gin with cold-pressed green apple and -196°C cryo mint foam.',
    isVideo: false,
    displayOrder: 10
  },
  {
    id: 111,
    title: 'Ras Malai Tres Leches & Saffron Foam',
    categoryName: 'Culinary Art',
    imageUrl: '/tres-leches.jpg',
    description: 'Bengali cardamom cottage cheese soaked in three-milk bath with gold flakes.',
    isVideo: false,
    displayOrder: 11
  },
  {
    id: 112,
    title: 'Gilded Molecular Elixir Bar',
    categoryName: 'Mixology',
    imageUrl: '/farzi-marquee-golden.jpg',
    description: 'The illuminated bar counter under golden ambient typography and cryo smoke.',
    isVideo: false,
    displayOrder: 12
  }
];

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        // Merge API gallery items with our authentic real Farzi photos
        const combined = [...REAL_FARZI_GALLERY, ...(data || []).filter(d => !REAL_FARZI_GALLERY.some(r => r.imageUrl === d.imageUrl))];
        setImages(combined);
      } catch (err) {
        console.error('Failed to load gallery:', err);
        setImages(REAL_FARZI_GALLERY);
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
    <PageTransition className="pt-28 pb-24 bg-[#090A0E] text-[#F4F0E8] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative text-center max-w-3xl mx-auto mb-12">
          <div className="hidden lg:flex absolute -right-16 -top-4 w-24 h-24 rounded-full border border-[#D4AF37]/30 bg-[#12141C] items-center justify-center p-1.5 animate-spin-slow pointer-events-none shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathGallery" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathGallery" startOffset="0%">
                  FARZI CAFÉ · AMBIENCE & LAB ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#E5B869] text-xs font-bold">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#12141C] text-[#E5B869] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VISUAL ANTHOLOGY · PLATING & MIXOLOGY ARCHIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#F4F0E8] tracking-tight uppercase mb-4">
            EDITORIAL <span className="gold-text-gradient">MOMENTS</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
            Glimpses into our dining chambers, kinetic plating stations, authentic flagship bistros, and molecular cocktail experiments.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-[#12141C] text-neutral-300 border border-white/10 hover:border-[#D4AF37]/40 hover:text-white shadow-sm'
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
              <div key={n} className="h-72 rounded-2xl bg-[#12141C] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => setLightboxIndex(idx)}
                data-cursor="EXPAND"
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 bg-[#12141C] aspect-[4/3] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[10px] text-[#E5B869] bg-[#090A0E]/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                    [ 0{idx + 1} ]
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#E5B869] block font-semibold">
                      {img.categoryName || 'Lab'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#F4F0E8] drop-shadow-sm group-hover:text-[#E5B869] transition-colors">
                      {img.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 group-hover:bg-[#E5B869] group-hover:text-black transition-colors flex-shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12141C] border border-white/10 space-y-3">
            <Sparkles className="w-8 h-8 text-[#E5B869] mx-auto opacity-80" />
            <h3 className="font-serif font-bold text-lg text-[#F4F0E8]">No images found</h3>
            <p className="text-xs text-neutral-400">Select another category.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredImages.length > 0 && (
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
