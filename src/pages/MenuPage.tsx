import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, QrCode, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuItem, MenuCategory } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/menu/FoodCard';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { VegBadge, NonVegBadge } from '../components/ui/Badge';
import { useCart } from '../context/CartContext';
import { PageTransition } from '../components/motion/PageTransition';

export const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tableNumber } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, items] = await Promise.all([
          api.getCategories(),
          api.getMenu()
        ]);
        setCategories(cats || []);
        setMenuItems(items || []);
      } catch (err) {
        console.error('Failed to load menu data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat && item.categoryId !== cat.id) return false;
    }

    // Dietary filter
    if (dietaryFilter === 'veg' && !item.isVeg) return false;
    if (dietaryFilter === 'non-veg' && item.isVeg) return false;
    if (dietaryFilter === 'special' && !item.isChefSpecial) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIngredients = item.ingredients?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchIngredients) return false;
    }

    return true;
  });

  return (
    <PageTransition className="pt-28 pb-24 bg-[#090A0E] text-[#F4F0E8] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Circular Stamp */}
        <div className="relative text-center max-w-3xl mx-auto mb-12">
          <div className="hidden lg:flex absolute -right-16 -top-4 w-24 h-24 rounded-full border border-[#D4AF37]/30 bg-[#12141C] items-center justify-center p-1.5 animate-spin-slow pointer-events-none shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathMenu" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathMenu" startOffset="0%">
                  FARZI CAFÉ · MOLECULAR TAPAS ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#E5B869] text-xs font-bold">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#12141C] text-[#E5B869] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PROGRESSIVE INDIAN DINING · CHEF ZORAWAR KALRA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#F4F0E8] tracking-tight uppercase mb-2">
            A LA CARTE <span className="gold-text-gradient">CURATIONS</span>
          </h1>
          <p className="font-serif italic text-2xl text-[#E5B869] mb-4">Our Menu</p>

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
            Reinterpreting traditional Indian heritage through the prism of modern culinary illusion, molecular techniques, and seasonal harvests.
          </p>

          {/* Quick link to table QR experience */}
          <div className="mt-5 inline-flex items-center gap-2">
            <Link
              to={`/menu?table=${tableNumber || 'T04'}`}
              className="inline-flex items-center gap-2 text-xs text-[#E5B869] hover:text-white font-mono bg-[#12141C] px-4 py-2 rounded-full border border-white/10 hover:border-[#D4AF37]/50 transition-all shadow-md"
            >
              <QrCode className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>Ordering at Table? Switch to Station {tableNumber || 'T04'} View</span>
            </Link>
          </div>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search creations, spices, truffles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-[#F4F0E8] placeholder-neutral-400 focus:outline-none focus:border-[#D4AF37] shadow-inner transition-colors"
              />
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-[#181B26] text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-[#181B26] text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                <VegBadge size="sm" />
                <span>Vegetarian</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-600 text-white font-bold shadow-md'
                    : 'bg-[#181B26] text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                <NonVegBadge size="sm" />
                <span>Non-Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('special')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  dietaryFilter === 'special'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold shadow-md'
                    : 'bg-[#181B26] text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5B869]" />
                <span>Chef Specials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills (Matches Design Board Top-Center) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold border-[#D4AF37] shadow-lg'
                : 'bg-[#12141C] text-neutral-300 border-white/10 hover:text-white hover:border-[#D4AF37]/40 shadow-sm'
            }`}
          >
            All Curations ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.categoryId === cat.id).length;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black font-bold border-[#D4AF37] shadow-lg'
                    : 'bg-[#12141C] text-neutral-300 border-white/10 hover:text-white hover:border-[#D4AF37]/40 shadow-sm'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Counter & Active Category Note */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-6 pb-2 border-b border-white/10">
          <span>Displaying {filteredItems.length} creations</span>
          <span className="text-[#E5B869]">Farzi Molecular Kitchen</span>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-[#12141C] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={(dish) => setSelectedDish(dish)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12141C] border border-white/10 space-y-3 shadow-2xl">
            <Sparkles className="w-8 h-8 text-[#E5B869] mx-auto opacity-80" />
            <h3 className="font-serif font-black text-lg text-[#F4F0E8]">No creations match your filter</h3>
            <p className="text-xs text-neutral-400 font-light">
              Try adjusting your dietary filter or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase transition-all shadow-md cursor-pointer hover:bg-[#E5B869]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Dish Modal */}
      {selectedDish && (
        <FoodDetailModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </PageTransition>
  );
};

export default MenuPage;
