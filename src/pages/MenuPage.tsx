import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, QrCode } from 'lucide-react';
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
        setCategories(cats);
        setMenuItems(items);
      } catch (err) {
        console.error('Failed to load menu data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    // Category match
    if (activeCategory !== 'all') {
      const cat = categories.find(c => c.slug === activeCategory);
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
    <PageTransition className="pt-28 pb-24 bg-charcoal-950 text-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Progressive Modern Indian Menu</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 tracking-tight mb-4">
            A La Carte Curations
          </h1>
          <p className="text-sm sm:text-base text-ivory-300 font-light max-w-xl mx-auto leading-relaxed">
            Reinterpreting traditional Indian flavors through the prism of modern culinary illusion, molecular techniques, and seasonal harvests.
          </p>

          {/* Quick link to table QR experience */}
          <div className="mt-4 inline-flex items-center gap-2">
            <Link
              to={`/menu?table=${tableNumber || 'T04'}`}
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-mono bg-charcoal-900 px-3 py-1.5 rounded-full border border-gold-500/30"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Switch to Mobile Table Ordering View (Table {tableNumber || 'T04'})</span>
            </Link>
          </div>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="bg-charcoal-900/90 border border-charcoal-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type="text"
                placeholder="Search dishes, ingredients, truffles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-800/90 border border-charcoal-700 text-xs sm:text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  dietaryFilter === 'all'
                    ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-md'
                    : 'bg-charcoal-800 text-ivory-300 hover:text-white border border-charcoal-700'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-500 text-charcoal-950 font-semibold shadow-md'
                    : 'bg-charcoal-800 text-ivory-300 hover:text-white border border-charcoal-700'
                }`}
              >
                <VegBadge size="sm" />
                <span>Vegetarian</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-500 text-white font-semibold shadow-md'
                    : 'bg-charcoal-800 text-ivory-300 hover:text-white border border-charcoal-700'
                }`}
              >
                <NonVegBadge size="sm" />
                <span>Non-Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('special')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  dietaryFilter === 'special'
                    ? 'bg-gradient-to-r from-gold-400 to-copper-500 text-charcoal-950 font-semibold shadow-md'
                    : 'bg-charcoal-800 text-gold-300 hover:text-gold-200 border border-gold-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Chef Specials</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-charcoal-800/80 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-charcoal-800 text-gold-400 border border-gold-500/40 font-semibold'
                  : 'text-ivory-400 hover:text-ivory-200 hover:bg-charcoal-800/50'
              }`}
            >
              Full Menu ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter(i => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-charcoal-800 text-gold-400 border border-gold-500/40 font-semibold'
                      : 'text-ivory-400 hover:text-ivory-200 hover:bg-charcoal-800/50'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-charcoal-900 rounded-2xl animate-pulse border border-charcoal-800" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-12 text-center text-ivory-400">
            <Filter className="w-12 h-12 text-charcoal-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-ivory-200 mb-1">No Dishes Found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
              Try adjusting your search criteria or resetting dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setActiveCategory('all');
              }}
              className="text-xs text-gold-400 underline font-mono"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={(dish) => setSelectedDish(dish)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dish Detail Modal */}
      <FoodDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </PageTransition>
  );
};
