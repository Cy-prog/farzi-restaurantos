import React, { useState, useEffect } from 'react';
import { MenuItem, GalleryImage } from '../types';
import { api } from '../services/api';
import { InteractiveHero } from '../components/home/InteractiveHero';
import { EditorialDishShowcase } from '../components/home/EditorialDishShowcase';
import { EditorialGallerySection, fallbackGalleryImages } from '../components/home/EditorialGallerySection';
import { CulinaryManifestoSection } from '../components/home/CulinaryManifestoSection';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { Lightbox } from '../components/ui/Lightbox';
import { PageTransition } from '../components/motion/PageTransition';
import { FadeIn } from '../components/motion/FadeIn';
import { KineticMarquee } from '../components/ui/KineticMarquee';

export const HomePage: React.FC = () => {
  const [signatureItems, setSignatureItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch signature dishes & gallery
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [menuData, galData] = await Promise.all([
          api.getMenu({ isChefSpecial: true }),
          api.getGallery()
        ]);
        setSignatureItems(menuData || []);
        setGalleryImages(galData || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    loadHomeData();
  }, []);

  return (
    <PageTransition className="relative overflow-hidden bg-[#fbfaf6] text-[#202019]">
      {/* 1. Interactive Hero with Pointer Parallax & Expressive Typography */}
      <InteractiveHero />

      <KineticMarquee phrases={['INDIAN AT HEART', 'FARZI BY NATURE', 'TRADITION REIMAGINED', 'A LITTLE UNEXPECTED']} speed="slow" />

      <FadeIn><section className="bg-[#fbfaf6] px-4 py-20 text-[#202019] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-8 border-b border-[#202019]/15 pb-12 md:grid-cols-12 md:items-end md:gap-12 md:pb-16">
          <div className="md:col-span-7">
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#a74326]">The art of the unexpected</p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Nothing is new.<br /><span className="italic text-[#a74326]">Until it is Farzi.</span></h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-[#626057] md:col-span-5 md:justify-self-end sm:text-lg sm:leading-8">
            We take the flavours that feel like home and give them room to surprise you. Familiar spices, playful ideas, and a table made for sharing.
          </p>
        </div>
      </section></FadeIn>

      {/* A considered selection of the kitchen's signature dishes */}
      <FadeIn><EditorialDishShowcase
        dishes={signatureItems}
        onSelectDish={(dish) => setSelectedDish(dish)}
      /></FadeIn>

      {/* A glimpse into the dining room */}
      <FadeIn><EditorialGallerySection
        images={galleryImages}
        onOpenLightbox={(idx) => setLightboxIndex(idx)}
      /></FadeIn>

      {/* Our story and table reservations */}
      <FadeIn><CulinaryManifestoSection /></FadeIn>

      {/* Dish Inspection Modal */}
      {selectedDish && (
        <FoodDetailModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}

      {/* Full-Screen Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages.length ? galleryImages : fallbackGalleryImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </PageTransition>
  );
};

export default HomePage;
