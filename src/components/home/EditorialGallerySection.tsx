import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ArrowRight, Sparkles } from 'lucide-react';
import { GalleryImage } from '../../types';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Card3DTilt } from '../3d/Card3DTilt';

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
      imageUrl: '/farzi-storefront-clean.jpg',
      title: 'The Flagship Façade & Botanical Entrance',
      categoryName: 'Chambers',
      description: 'Ornate backlit bistro entrance framed by tropical palm fronds'
    },
    {
      id: 2,
      imageUrl: '/dining-ambience.jpg',
      title: '#FarziAfied Neon Bar & Mixology Lounge',
      categoryName: 'Theatre',
      description: 'Where 200°C tandoor heat meets -196°C cryo vapor'
    },
    {
      id: 3,
      imageUrl: '/storefront.jpg',
      title: 'Botanical Terrace & Dining Pavilions',
      categoryName: 'Botanicals',
      description: 'Smoked botanicals and reverse-spherified elixirs'
    },
    {
      id: 4,
      imageUrl: '/arancini.jpg',
      title: 'Deconstructed Dal Chawal Arancini',
      categoryName: 'Gastronomy',
      description: 'Geometric balance of spice, texture, and optical riddles'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#0A0B0E] text-[#F3EFE6] overflow-hidden border-b border-[#1E222D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#1E222D]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#12141A] text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VISUAL ARCHIVE & AMBIENCE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight leading-[0.92] text-white">
              THE THEATRE OF <br />
              <span className="text-stroke gold-gradient-text italic font-normal">EXPERIENCE</span>
            </h2>
          </div>

          <Link to="/gallery">
            <button className="px-6 py-3 rounded-full border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#12141A] hover:bg-[#D4AF37] text-xs font-mono tracking-widest uppercase text-white hover:text-black transition-all flex items-center gap-2 shadow-sm">
              <span>Full Archive</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </Link>
        </div>

        {/* Asymmetric 3D Editorial Grid (Large Hero Left, Staggered Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Showcase (7 Cols) with 3D Tilt */}
          <div className="md:col-span-7">
            <Card3DTilt
              maxTilt={12}
              onClick={() => onOpenLightbox(0)}
              className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-neutral-950 min-h-[440px] sm:min-h-[520px] cursor-pointer group shadow-2xl h-full"
            >
              <ImageWithFallback
                src={displayImages[0].imageUrl}
                alt={displayImages[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-[1.08] brightness-[0.88]"
                fallbackSrc="/cloche-dish.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              <div
                style={{ transform: 'translateZ(30px)' }}
                className="absolute top-5 left-5 pointer-events-none"
              >
                <span className="font-mono text-xs text-[#D4AF37] font-bold bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-md">
                  [ 01 / 04 ]
                </span>
              </div>

              <div
                style={{ transform: 'translateZ(35px)' }}
                className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none"
              >
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
                <div className="w-10 h-10 rounded-full bg-[#12141A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </Card3DTilt>
          </div>

          {/* Secondary Stack (5 Cols) with 3D Tilt Cards */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {displayImages.slice(1, 3).map((img, idx) => (
              <div key={img.id} className="flex-1">
                <Card3DTilt
                  maxTilt={10}
                  onClick={() => onOpenLightbox(idx + 1)}
                  className="relative h-full rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-neutral-950 min-h-[230px] cursor-pointer group shadow-xl"
                >
                  <ImageWithFallback
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-[1.08] brightness-[0.88]"
                    fallbackSrc="/arancini.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

                  <div
                    style={{ transform: 'translateZ(20px)' }}
                    className="absolute top-4 left-4 pointer-events-none"
                  >
                    <span className="font-mono text-[10px] text-[#D4AF37] font-bold bg-black/80 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 shadow-sm">
                      [ 0{idx + 2} / 04 ]
                    </span>
                  </div>

                  <div
                    style={{ transform: 'translateZ(25px)' }}
                    className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none"
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                        {img.categoryName || 'Lab'}
                      </span>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                        {img.title}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#12141A] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card3DTilt>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default EditorialGallerySection;
