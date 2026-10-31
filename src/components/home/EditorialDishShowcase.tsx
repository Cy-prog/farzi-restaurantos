import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, Plus, Check } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { soundFX } from '../../utils/soundEffects';

interface EditorialDishShowcaseProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

const CATEGORIES = [
  'All',
  'Small Plates',
  'Mains',
  'Cocktails',
  'Desserts'
];

export const EditorialDishShowcase: React.FC<EditorialDishShowcaseProps> = ({ dishes, onSelectDish }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();

  // Curated fallback dishes matching the design board if API list is loading
  const defaultDishes: MenuItem[] = [
    {
      id: 1,
      name: 'Dal Chawal Arancini',
      slug: 'dal-chawal-arancini',
      description: "A playful take on India's comfort classic — spiced lentil and rice arancini, crisp outside, creamy within, served with house curry foam.",
      price: 695,
      imageUrl: '/arancini.jpg',
      categoryId: 1,
      categoryName: 'Small Plates',
      isVeg: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      spiceLevel: 'MILD',
      displayOrder: 1,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Ras Malai Tres Leches',
      slug: 'ras-malai-tres-leches',
      description: 'Classic Bengali ras malai soaked in Mexican three-milk bath with saffron foam and crushed pistachios.',
      price: 545,
      imageUrl: '/tres-leches.jpg',
      categoryId: 5,
      categoryName: 'Desserts',
      isVeg: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      spiceLevel: 'NONE',
      displayOrder: 2,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Apple Foamintini',
      slug: 'apple-foamintini',
      description: 'Green apple elixir infused with botanical gin, elderflower mist, and a silky liquid nitrogen aromatic foam.',
      price: 645,
      imageUrl: '/apple-foamintini.jpg',
      categoryId: 6,
      categoryName: 'Cocktails',
      isVeg: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      spiceLevel: 'NONE',
      displayOrder: 3,
      isAvailable: true
    },
    {
      id: 4,
      name: 'Amritsari Paneer Tikka',
      slug: 'amritsari-paneer-tikka',
      description: 'Clay-oven smoked cottage cheese marinated in ajwain and yellow mustard, crowned with spherified mint chutney.',
      price: 645,
      imageUrl: '/paneer-tikka.jpg',
      categoryId: 1,
      categoryName: 'Small Plates',
      isVeg: true,
      isChefSpecial: false,
      isRecommended: true,
      isPopular: true,
      spiceLevel: 'MEDIUM',
      displayOrder: 4,
      isAvailable: true
    },
    {
      id: 5,
      name: 'Truffle Naan Bomb',
      slug: 'truffle-naan-bomb',
      description: 'Mini tandoori naans filled with molten aged cheddar and black truffle butter, served with cryo-smoked dip.',
      price: 725,
      imageUrl: '/naan-bomb.jpg',
      categoryId: 4,
      categoryName: 'Mains',
      isVeg: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      spiceLevel: 'MILD',
      displayOrder: 5,
      isAvailable: true
    }
  ];

  const sourceDishes = dishes && dishes.length > 0 ? dishes : defaultDishes;

  const filteredDishes = sourceDishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Small Plates' && (dish.categoryName?.includes('Plate') || dish.categoryName?.includes('Starter') || dish.categoryId === 1 || dish.categoryId === 2)) ||
      (selectedCategory === 'Mains' && (dish.categoryName?.includes('Main') || dish.categoryName?.includes('Bread') || dish.categoryId === 3 || dish.categoryId === 4)) ||
      (selectedCategory === 'Cocktails' && (dish.categoryName?.includes('Cocktail') || dish.categoryName?.includes('Mixology') || dish.categoryId === 6)) ||
      (selectedCategory === 'Desserts' && (dish.categoryName?.includes('Dessert') || dish.categoryName?.includes('Sweet') || dish.categoryId === 5));

    const matchesSearch =
      searchQuery === '' ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setAddedId(dish.id);
    soundFX.playChime();
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="menu-section" className="py-20 sm:py-28 bg-[#090A0E] text-[#F4F0E8] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row with Arrow, Centered "Our Menu" & Search (Matching top-middle design) */}
        <div className="relative flex items-center justify-between mb-8 pb-4">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('story-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2 rounded-full border border-white/10 hover:border-[#D4AF37]/50 text-neutral-400 hover:text-white transition-colors"
            aria-label="Previous Section"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5B869]" />
          </button>

          {/* Centered Italic Serif Title: Our Menu */}
          <div className="text-center">
            <h2 className="font-serif italic font-normal text-3xl sm:text-5xl tracking-wide text-[#E5B869] gold-glow">
              Our Menu
            </h2>
          </div>

          {/* Search Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-2 rounded-full border border-white/10 hover:border-[#D4AF37]/50 text-neutral-400 hover:text-white transition-colors"
              aria-label="Search Menu"
            >
              <Search className="w-4 h-4 text-[#E5B869]" />
            </button>
          </div>
        </div>

        {/* Search Input Bar (collapsible) */}
        <AnimatePresence>
          {showSearchInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-8 overflow-hidden"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dishes, ingredients or molecular styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 rounded-full bg-[#12141C] border border-[#D4AF37]/30 text-white text-xs font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3 text-xs text-neutral-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter Pills (Matching exact pills: All, Small Plates, Mains, Cocktails, Desserts) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  soundFX.playWhoosh();
                }}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-sans tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5B869] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-[#12141C] border border-white/10 hover:border-[#D4AF37]/30 text-neutral-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dish Showcase Cards Grid (Matching the 3 cards in top-middle: Arancini, Tres Leches, Apple Foamintini) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDishes.map((dish) => (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              onClick={() => onSelectDish(dish)}
              className="group relative rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C] hover:border-[#D4AF37]/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Dish Visual Header */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <ImageWithFallback
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  fallbackSrc="/arancini.jpg"
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-black/20 pointer-events-none" />

                {/* Dietary badge on top left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider uppercase text-neutral-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{dish.isVeg ? 'VEGETARIAN' : 'NON-VEG'}</span>
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-[#E5B869] transition-colors leading-snug">
                    {dish.name}
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>

                {/* Bottom Row: Price + Circular Arrow Button (Matching exact top-middle design) */}
                <div className="pt-3 flex items-center justify-between border-t border-white/10">
                  <span className="font-serif font-bold text-lg text-[#E5B869]">
                    ₹{dish.price}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Quick Add to Cart button */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, dish)}
                      className={`p-2 rounded-full transition-all ${
                        addedId === dish.id
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 hover:bg-[#D4AF37] hover:text-black text-neutral-300'
                      }`}
                      title="Quick Add to Cart"
                    >
                      {addedId === dish.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    {/* Circular Gold Arrow Button (opens details) */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F6D] text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <ArrowRight className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-sm font-mono">No dishes found matching your selection.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 rounded-full bg-[#12141C] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
