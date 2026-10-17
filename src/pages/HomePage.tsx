import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, QrCode, Calendar, Sparkles, ChevronRight, Award, Compass, Wine, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FoodCard } from '../components/menu/FoodCard';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { Lightbox } from '../components/ui/Lightbox';
import { FadeIn } from '../components/motion/FadeIn';
import { MenuItem, GalleryImage } from '../types';
import { api } from '../services/api';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    title: 'An Illusion of Taste',
    subtitle: 'Where ancient Indian recipes surrender to modern molecular gastronomy.'
  },
  {
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1600&auto=format&fit=crop',
    title: 'Progressive Culinary Alchemy',
    subtitle: 'Sensory deception, theatrical textures, and unapologetic flavor.'
  },
  {
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop',
    title: 'The Alchemical Bar',
    subtitle: 'Smoked botanicals, liquid nitrogen infusions, and bespoke mixology.'
  }
];

export const HomePage: React.FC = () => {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [signatureItems, setSignatureItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-advance hero carousel with restrained timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % HERO_IMAGES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Fetch signature dishes & gallery
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [menuData, galData] = await Promise.all([
          api.getMenu({ isChefSpecial: true }),
          api.getGallery()
        ]);
        setSignatureItems(menuData.slice(0, 6));
        setGalleryImages(galData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="relative">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-charcoal-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroIdx}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={HERO_IMAGES[currentHeroIdx].url}
              alt={HERO_IMAGES[currentHeroIdx].title}
              className="w-full h-full object-cover"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-black/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-charcoal-950/40 to-charcoal-950/80" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Modern Indian Gastronomy & Mixology Lab</span>
          </motion.div>

          <motion.h1
            key={`title-${currentHeroIdx}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-ivory-50 mb-6 leading-[1.05]"
          >
            {HERO_IMAGES[currentHeroIdx].title}
          </motion.h1>

          <motion.p
            key={`sub-${currentHeroIdx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-ivory-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            {HERO_IMAGES[currentHeroIdx].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/menu">
              <Button variant="gold" size="lg" icon={<Compass className="w-5 h-5" />}>
                Explore Full Menu
              </Button>
            </Link>
            <Link to="/menu?table=T04">
              <Button variant="outline" size="lg" icon={<QrCode className="w-5 h-5" />}>
                Scan Digital Table Menu
              </Button>
            </Link>
            <Link to="/reservation">
              <Button variant="subtle" size="lg" icon={<Calendar className="w-5 h-5" />}>
                Reserve Table
              </Button>
            </Link>
          </motion.div>

          {/* Hero Indicator Pills */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHeroIdx(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  i === currentHeroIdx ? 'w-8 bg-gold-400' : 'w-2 bg-charcoal-700 hover:bg-charcoal-600'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE FARZI ILLUSION PHILOSOPHY */}
      <section className="py-24 bg-charcoal-900 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                The Culinary Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory-50 mt-2 mb-6 leading-tight">
                Farzi is Arabic for <span className="gold-gradient-text italic font-normal">illusion</span>. We trick the senses to liberate the flavor.
              </h2>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-light mb-6">
                Progressive cuisine isn’t about altering what tastes sublime — it’s about subverting expectations. Traditional Dal Chawal reimagined as golden Italian Arancini with paper-thin papad tuiles. Awadhi Galouti kebabs transformed into silk pâté over inverted tawa wafers.
              </p>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-light mb-8">
                Every plate leaves our culinary laboratory as an optical paradox and arrives at your table as pure nostalgia, heightened by liquid nitrogen spectacles, culinary mist, and charcoal aromas.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-charcoal-800">
                <div>
                  <span className="block font-serif text-3xl font-bold text-gold-400">18+</span>
                  <span className="text-xs text-charcoal-400">Indigenous Spices</span>
                </div>
                <div>
                  <span className="block font-serif text-3xl font-bold text-gold-400">-196°C</span>
                  <span className="text-xs text-charcoal-400">Liquid Nitrogen</span>
                </div>
                <div>
                  <span className="block font-serif text-3xl font-bold text-gold-400">100%</span>
                  <span className="text-xs text-charcoal-400">Culinary Craft</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl relative">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
                    alt="Chef plating molecular dish"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-charcoal-950/95 border border-gold-500/30 p-5 rounded-xl shadow-2xl max-w-xs backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 border border-gold-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-ivory-100 text-sm">Gourmet Laboratory</h4>
                      <p className="text-[11px] text-charcoal-400">Masterminded by avant-garde culinary artists</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE LAB CREATIONS */}
      <section className="py-24 bg-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                Culinary Centerpiece
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory-50 mt-2">
                Signature Laboratory Creations
              </h2>
            </div>
            <Link to="/menu" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-gold-400 hover:text-gold-300">
              <span>View 16+ Curated Dishes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 bg-charcoal-900 animate-pulse rounded-2xl border border-charcoal-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {signatureItems.map((dish) => (
                <FadeIn key={dish.id}>
                  <FoodCard item={dish} onSelect={(item) => setSelectedDish(item)} />
                </FadeIn>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/menu?table=T04">
              <Button variant="gold" size="lg" icon={<QrCode className="w-5 h-5" />}>
                Launch Digital Table Menu & Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. THE MIXOLOGY & AMBIENCE THEATER */}
      <section className="py-24 bg-charcoal-900 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left" className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800&auto=format&fit=crop"
                  alt="Cocktail Bar"
                  className="rounded-xl object-cover h-64 w-full border border-charcoal-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop"
                  alt="Chef Table"
                  className="rounded-xl object-cover h-64 w-full border border-charcoal-800 mt-6"
                />
              </div>
            </FadeIn>

            <FadeIn direction="right" className="order-1 lg:order-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                Liquid Alchemy & Spatial Design
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory-50 mt-2 mb-6 leading-tight">
                Immersive Ambience & Avant-Garde Cocktails
              </h2>
              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-light mb-6">
                From the amber-lit acoustics of the Main Chamber to the botanical terrace, every corner is calibrated for intimacy and sensory intrigue.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-charcoal-800 text-gold-400 mt-1">
                    <Wine className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ivory-100">Dry-Ice & Oak Smoke Bell Jars</h4>
                    <p className="text-xs text-charcoal-400">Our signature cocktails infuse wood aromas at the moment of pouring.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-charcoal-800 text-gold-400 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ivory-100">Private Dining & Chef’s Table</h4>
                    <p className="text-xs text-charcoal-400">Exclusive 8-course paired tasting menus curated by the Executive Chef.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. GUEST EXPERIENCES & REVIEWS */}
      <section className="py-24 bg-charcoal-950 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              Guest Impressions
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory-50 mt-2">
              Words From Our Diners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Devika Singhania',
                rating: 5,
                comment: 'An unbelievable gastronomic spectacle. The Dal Chawal Arancini and Chuski Margarita redefine Indian cuisine without losing its soul.',
                source: 'Google Review'
              },
              {
                name: 'Marcus Vance',
                rating: 5,
                comment: 'World-class progressive cooking. The smoked lamb pate and dry-ice illusions match 3-star Michelin theater. Extraordinary experience.',
                source: 'TripAdvisor'
              },
              {
                name: 'Priya & Rahul Kapoor',
                rating: 5,
                comment: 'Celebrated our anniversary at the Chef’s Table. The attention to detail, warm hospitality, and the Rasmalai Tres Leches were sublime.',
                source: 'Dineout Verified'
              }
            ].map((rev, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="bg-charcoal-900/80 border border-charcoal-800 p-8 rounded-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-1 text-gold-400 mb-4">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <p className="text-sm text-ivory-200 leading-relaxed italic font-light mb-6">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-ivory-100">{rev.name}</span>
                    <span className="text-charcoal-500 font-mono">{rev.source}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL GALLERY TEASER */}
      <section className="py-24 bg-charcoal-900 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                Visual Anthology
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory-50 mt-2">
                Editorial Atmosphere & Moments
              </h2>
            </div>
            <Link to="/gallery" className="mt-4 md:mt-0 text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 flex items-center gap-1">
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer border border-charcoal-800"
              >
                <ImageWithFallback
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-3 left-3 right-3 text-xs text-ivory-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-serif font-medium truncate">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RESERVATION CALLOUT */}
      <section className="py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Secure Your Table
          </span>
          <h2 className="text-3xl sm:text-6xl font-serif font-bold text-ivory-50 mt-3 mb-6">
            An Unforgettable Evening Awaits
          </h2>
          <p className="text-sm sm:text-base text-ivory-300 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Reserve your table for an evening of modern Indian culinary illusions, artisanal smoke mixology, and genuine hospitality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reservation">
              <Button variant="gold" size="lg" icon={<Calendar className="w-5 h-5" />}>
                Instant Table Reservation
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Private Dining Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dish Detail Modal */}
      <FoodDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      {/* Image Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
