import React, { useState, useEffect } from 'react';
import { MenuItem, GalleryImage } from '../types';
import { api } from '../services/api';
import { InteractiveHero } from '../components/home/InteractiveHero';
import { KineticMarquee } from '../components/ui/KineticMarquee';
import { IllusionLabMixer } from '../components/home/IllusionLabMixer';
import { EditorialDishShowcase } from '../components/home/EditorialDishShowcase';
import { EditorialGallerySection } from '../components/home/EditorialGallerySection';
import { CulinaryManifestoSection } from '../components/home/CulinaryManifestoSection';
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
    <PageTransition className="relative bg-[#FAF9F5] text-[#12141A] overflow-hidden">
      {/* 1. Interactive Hero with Pointer Parallax & Expressive Typography */}
      <InteractiveHero />

      {/* 2. Top Editorial Kinetic Marquee (Bold Amber) */}
      <KineticMarquee
        phrases={[
          'MODERN INDIAN GASTRONOMY',
          'TRADITION REIMAGINED',
          'UNEXPECTED BY DESIGN',
          'THE ART OF ILLUSION',
          'AVANT-GARDE FLAVORS',
          'MOLECULAR SCIENCE'
        ]}
      />

      {/* 3. The Signature Centerpiece: "The Farzi Illusion Lab" (Drag to Infuse) */}
      <IllusionLabMixer />

      {/* 4. Second Editorial Marquee (Outlined / Stroked Reverse) */}
      <KineticMarquee
        reverse={true}
        outline={true}
        phrases={[
          '-196°C CRYO LIQUID NITROGEN',
          'SPHERIFIED CHUTNEY CAVIAR',
          'APPLEWOOD CHARCOAL EMBERS',
          'SAVORY DECONSTRUCTIONS',
          'SENSORY GASTRONOMY'
        ]}
      />

      {/* 5. Editorial Food Presentation & Asymmetric Dish Showcase */}
      <EditorialDishShowcase
        dishes={signatureItems}
        onSelectDish={(dish) => setSelectedDish(dish)}
      />

      {/* 6. The Theatre of Experience: Asymmetric Visual Gallery */}
      <EditorialGallerySection
        images={galleryImages}
        onOpenLightbox={(idx) => setLightboxIndex(idx)}
      />

      {/* 7. Culinary Manifesto & Table Reservation Desk */}
      <CulinaryManifestoSection />

      {/* Dish Inspection Modal */}
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
