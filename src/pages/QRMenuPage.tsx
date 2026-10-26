import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Table as TableIcon,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  AlertCircle,
  RefreshCw,
  Ban,
  X,
  ChevronLeft,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, MenuCategory } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { VegBadge, NonVegBadge, ChefSpecialBadge, SpiceBadge } from '../components/ui/Badge';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { PageTransition } from '../components/motion/PageTransition';

const AVAILABLE_TABLES = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'];

export const QRMenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  const {
    items: cartItems,
    tableNumber,
    setTableNumber,
    addToCart,
    updateQuantity,
    setIsCartOpen,
    total,
    totalCount
  } = useCart();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'special'>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tableNotice, setTableNotice] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Validate and synchronize table station
  useEffect(() => {
    let candidate = (tableParam || tableNumber || 'T04').trim().toUpperCase();
    
    // Strict validation for valid table stations (T01 - T12 or TABLE 1-12)
    const isValid = /^T(0[1-9]|1[0-2])$/.test(candidate) || /^TABLE\s*(0?[1-9]|1[0-2])$/i.test(candidate);
    
    if (tableParam && !isValid) {
      setTableNotice(`Table station "${tableParam}" not recognized. Connected to Table T04.`);
      candidate = 'T04';
    } else {
      setTableNotice(null);
    }

    setTableNumber(candidate);
    api.logQRScan(candidate);
  }, [tableParam, setTableNumber, tableNumber]);

  const loadMenuData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [cats, dishes] = await Promise.all([
        api.getCategories(),
        api.getMenu()
      ]);
      setCategories(cats || []);
      setMenuItems(dishes || []);
    } catch (err: unknown) {
      console.error('Failed to load QR menu:', err);
      setLoadError('Unable to connect to the restaurant kitchen service. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  const handleSelectTable = (tbl: string) => {
    setTableNumber(tbl);
    setSearchParams({ table: tbl });
    setIsTableModalOpen(false);
    api.logQRScan(tbl);
  };

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat && item.categoryId !== cat.id) return false;
    }
    if (dietFilter === 'veg' && !item.isVeg) return false;
    if (dietFilter === 'non-veg' && item.isVeg) return false;
    if (dietFilter === 'special' && !item.isChefSpecial) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.ingredients && item.ingredients.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <PageTransition className="min-h-screen bg-charcoal-975 pb-32 text-ivory-100">
      {/* Dedicated In-Restaurant Mobile Header */}
      <div className="sticky top-0 z-30 bg-charcoal-950/95 backdrop-blur-xl border-b border-charcoal-800/80 px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" title="Return to Farzi Main Experience">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-copper-600 flex items-center justify-center text-charcoal-950 font-serif font-black text-sm shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-[0.22em] text-sm text-ivory-50 uppercase group-hover:text-gold-300 transition-colors">
                FARZI
              </span>
              <span className="text-[8px] font-mono tracking-widest text-gold-400/90 uppercase -mt-0.5">
                Digital Table Menu
              </span>
            </div>
          </Link>

          {/* Interactive Table Badge with Change Dialog */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTableModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-charcoal-900 border border-gold-500/40 hover:border-gold-400 px-3 py-1 rounded-full text-xs font-mono font-bold text-gold-300 shadow-sm transition-all"
              title="Click to change assigned table"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <TableIcon className="w-3.5 h-3.5 text-gold-400" />
              <span>Table {tableNumber}</span>
            </motion.button>

            {/* Quick Cart Trigger if items present */}
            {totalCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-charcoal-900 border border-charcoal-700 text-gold-400 hover:text-white"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-400 text-charcoal-950 flex items-center justify-center text-[10px] font-bold">
                  {totalCount}
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Search & Dietary Bar */}
        <div className="max-w-md mx-auto mt-2.5 space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-500" />
            <input
              type="text"
              placeholder="Search molecular dishes, spices, truffle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                dietFilter === 'all'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                dietFilter === 'veg'
                  ? 'bg-emerald-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800'
              }`}
            >
              <VegBadge size="sm" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800'
              }`}
            >
              <NonVegBadge size="sm" />
              <span>Non-Veg</span>
            </button>
            <button
              onClick={() => setDietFilter('special')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                dietFilter === 'special'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Chef's Lab</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Carousel */}
        <div className="max-w-md mx-auto flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none border-t border-charcoal-800/80 mt-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-charcoal-850 text-gold-300 font-bold border border-gold-500/40 shadow-sm'
                : 'text-ivory-400 hover:text-white'
            }`}
          >
            All Curations
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.slug)}
              className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap font-medium transition-all ${
                activeCategory === c.slug
                  ? 'bg-charcoal-850 text-gold-300 font-bold border border-gold-500/40 shadow-sm'
                  : 'text-ivory-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Table Notice if invalid query param provided */}
        {tableNotice && (
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-between">
            <span>{tableNotice}</span>
            <button onClick={() => setTableNotice(null)} className="text-amber-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Welcome Table Banner */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-gold-500/20 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                Live In-Restaurant Dining
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-serif font-bold text-ivory-50 mt-0.5">
              Station {tableNumber} • Farzi Kitchen Online
            </h2>
            <p className="text-[11px] text-ivory-400 mt-0.5 font-light">
              Tap any dish to inspect molecular ingredients or add directly.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Dish List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-28 rounded-2xl skeleton-shimmer border border-charcoal-800" />
            ))}
          </div>
        ) : loadError ? (
          <div className="p-8 text-center bg-charcoal-900 border border-charcoal-800 rounded-2xl space-y-3 shadow-xl">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-xs text-ivory-300">{loadError}</p>
            <button
              onClick={loadMenuData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 text-charcoal-950 font-mono text-xs font-bold shadow-md hover:bg-gold-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading Menu</span>
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-charcoal-900 border border-charcoal-800 rounded-2xl shadow-xl">
            <AlertCircle className="w-8 h-8 text-charcoal-500 mx-auto mb-2" />
            <p className="text-xs text-ivory-300">No dishes match your active filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-gold-400 underline font-mono"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const inCart = cartItems.find(i => i.menuItemId === item.id);
              const qty = inCart ? inCart.quantity : 0;
              const isAvailable = item.isAvailable !== false;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDish(item)}
                  className={`bg-charcoal-900/90 border rounded-2xl p-3 flex gap-3 cursor-pointer shadow-lg active:scale-[0.99] transition-all duration-300 ${
                    isAvailable
                      ? 'border-charcoal-800 hover:border-gold-500/40 hover:shadow-black/50'
                      : 'border-charcoal-800/60 opacity-80'
                  }`}
                >
                  {/* Left: Thumbnail with Fallback */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-charcoal-950 flex-shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                        !isAvailable ? 'grayscale-[40%] contrast-90' : ''
                      }`}
                    />
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {item.isVeg ? <VegBadge size="sm" /> : <NonVegBadge size="sm" />}
                    </div>
                  </div>

                  {/* Right: Info & Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-serif font-bold text-sm text-ivory-100 line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="font-serif font-bold text-gold-400 text-sm whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-ivory-400 line-clamp-2 leading-tight font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        {item.isChefSpecial && <ChefSpecialBadge />}
                        {item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />}
                      </div>

                      {/* Add / Quantity Counter or Sold Out State */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {!isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                            <Ban className="w-3 h-3 text-rose-400" />
                            <span>Sold Out</span>
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center gap-2 bg-charcoal-950 px-2 py-0.5 rounded-full border border-gold-500/40 shadow-sm">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-ivory-300 hover:text-white p-0.5"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </motion.button>
                            <span className="font-mono text-xs font-bold text-gold-300 min-w-[16px] text-center">
                              {qty}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-ivory-300 hover:text-white p-0.5"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(item, 1)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-charcoal-800 text-ivory-100 hover:bg-gold-500 hover:text-charcoal-950 border border-charcoal-700 transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* In-Restaurant Minimal Dining Footer */}
        <div className="pt-6 pb-4 border-t border-charcoal-800/80 text-center space-y-2">
          <p className="text-[11px] font-mono text-charcoal-400">
            Station {tableNumber} • Farzi Progressive Gastronomy
          </p>
          <p className="text-[10px] text-charcoal-500">
            Standard 5% GST included on order calculation • For sommelier pairings or table service, request your floor server.
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 font-mono transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Explore Main Restaurant Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-gold-500 via-gold-400 to-copper-500 text-charcoal-950 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-semibold border border-gold-300/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-charcoal-950 text-gold-400 flex items-center justify-center font-mono text-xs font-bold shadow-inner">
                  {totalCount}
                </div>
                <span className="text-sm font-bold tracking-wide">Review Table Order</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-base">₹{total}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Station Selector Modal */}
      <AnimatePresence>
        {isTableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-bold text-base text-ivory-100">
                    Select Dining Station
                  </h3>
                </div>
                <button
                  onClick={() => setIsTableModalOpen(false)}
                  className="text-ivory-400 hover:text-white p-1 rounded-full hover:bg-charcoal-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-charcoal-400 mt-2 mb-4">
                Choose the station number printed on your table acrylic stand (T01 - T12):
              </p>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {AVAILABLE_TABLES.map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => handleSelectTable(tbl)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      tableNumber === tbl
                        ? 'bg-gold-500 text-charcoal-950 border-gold-400 shadow-md'
                        : 'bg-charcoal-850 text-ivory-300 border-charcoal-700 hover:border-gold-500/40 hover:text-white'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsTableModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-charcoal-800 text-ivory-200 text-xs font-medium hover:bg-charcoal-700 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <FoodDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </PageTransition>
  );
};
