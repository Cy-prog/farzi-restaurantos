import React, { useState, useEffect } from 'react';
import { MenuItem, GalleryImage } from '../types';
import { api } from '../services/api';
import { InteractiveHero } from '../components/home/InteractiveHero';
import { KineticMarquee } from '../components/ui/KineticMarquee';
import { EditorialDishShowcase } from '../components/home/EditorialDishShowcase';
import { FarziExperienceSection } from '../components/home/FarziExperienceSection';
import { IllusionLabMixer } from '../components/home/IllusionLabMixer';
import { RealFarziStoriesSection } from '../components/home/RealFarziStoriesSection';
import { LocationsAndReservationSection } from '../components/home/LocationsAndReservationSection';
import { FarziKineticStory } from '../components/home/FarziKineticStory';
import { EditorialGallerySection } from '../components/home/EditorialGallerySection';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { Lightbox } from '../components/ui/Lightbox';
import { PageTransition } from '../components/motion/PageTransition';

export const HomePage: React.FC = () => {
  const [signatureItems, setSignatureItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <PageTransition className="relative bg-[#090A0E] text-[#F4F0E8] overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* 1. Cloche Reveal & Gilded Hero (Matches Top-Left Design Board) */}
      <InteractiveHero />

      {/* 2. Kinetic Gold Marquee */}
      <KineticMarquee
        phrases={[
          'CONTEMPORARY INDIAN BISTRO',
          'TRADITION REIMAGINED',
          'CLOCHE REVEAL THEATRE',
          'MOLECULAR SCIENCE',
          'SPHERIFIED CAVIAR',
          '-196°C CRYO VAPOUR'
        ]}
      />

      {/* 3. "Our Menu" Interactive Filterable Showcase (Matches Top-Middle Design Board) */}
      <EditorialDishShowcase
        dishes={signatureItems}
        onSelectDish={(dish) => setSelectedDish(dish)}
      />

      {/* 4. "The Farzi Experience" Editorial Section (Matches Middle-Left Design Board) */}
      <FarziExperienceSection />

      {/* 5. "Drag to Infuse" Molecular Lab Mixer (Effect B: Newmix Drag-to-Mix adapted for Farzi) */}
      <IllusionLabMixer />

      {/* 6. Authentic Farzi Moments & Reels Grid (14 Real Captured Photos from User Reel) */}
      <RealFarziStoriesSection
        onOpenImage={(src, title) => {
          // If user clicks, open in lightbox or log
          const foundIdx = galleryImages.findIndex(g => g.imageUrl === src);
          if (foundIdx >= 0) setLightboxIndex(foundIdx);
        }}
      />

      {/* 6. "Our Locations" & "Reserve a Table" Desk (Matches Middle-Right Design Board) */}
      <LocationsAndReservationSection />

      {/* 6. Kinetic Scroll Manifesto & Terroir Chapters (Soil, Cryo, Sphere, Farzi) */}
      <FarziKineticStory />

      {/* 7. Reverse Stroked Kinetic Marquee */}
      <KineticMarquee
        reverse={true}
        outline={true}
        phrases={[
          'DAL CHAWAL ARANCINI',
          'RAS MALAI TRES LECHES',
          'APPLE FOAMINTINI',
          'AMRITSARI PANEER TIKKA',
          'TRUFFLE NAAN BOMB'
        ]}
      />

      {/* 8. The Visual Gallery & Ambience Archive */}
      <EditorialGallerySection
        images={galleryImages}
        onOpenLightbox={(idx) => setLightboxIndex(idx)}
      />

      {/* 9. Top-Right Dish Detail Modal (Matches Top-Right Design Board) */}
      {selectedDish && (
        <FoodDetailModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}

      {/* Full-Screen Lightbox */}
      {lightboxIndex !== null && galleryImages.length > 0 && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </PageTransition>
  );
};

export default HomePage;
