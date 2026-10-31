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
  Flame,
  Clock,
  CheckCircle2
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
    if (!candidate.startsWith('T')) {
      candidate = `T${candidate.padStart(2, '0')}`;
    }
    if (AVAILABLE_TABLES.includes(candidate)) {
      if (candidate !== tableNumber) {
        setTableNumber(candidate);
      }
    } else {
      setTableNotice(`Table station "${tableParam}" is not in service. Defaulting to station T04.`);
      setTableNumber('T04');
    }
  }, [tableParam, tableNumber, setTableNumber]);

  const loadMenuData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [cats, items] = await Promise.all([
        api.getCategories(),
        api.getMenu()
      ]);
      setCategories(cats || []);
      setMenuItems(items || []);
    } catch (err: unknown) {
      console.error('Failed to load in-restaurant table menu:', err);
      setLoadError('Unable to connect to the Farzi Kitchen station. Please try again.');
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
    setTableNotice(null);
  };

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat && item.categoryId !== cat.id) return false;
    }
    if (dietFilter === 'veg' && !item.isVeg) return false;
    if (dietFilter === 'non-veg' && item.isVeg) return false;
    if (dietFilter === 'special' && !item.isChefSpecial) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchIngredients = item.ingredients?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchIngredients) return false;
    }
    return true;
  });

  return (
    <PageTransition className="min-h-screen bg-[#090A0E] pb-32 text-[#F4F0E8] selection:bg-[#D4AF37]/30 selection:text-white">
      {/* 1. DEDICATED IN-RESTAURANT EDITORIAL MOBILE HEADER */}
      <div className="sticky top-0 z-30 bg-[#090A0E]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" title="Return to Farzi Main Experience">
            <div className="w-9 h-9 rounded-full bg-[#12141C] border border-[#D4AF37]/30 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <img src="/farzi-logo.svg" alt="Farzi Café" className="w-full h-full object-contain filter invert" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black tracking-[0.22em] text-sm text-[#F4F0E8] uppercase group-hover:text-[#E5B869] transition-colors">
                FARZI <span className="gold-text-gradient">CAFÉ</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#E5B869] font-bold uppercase -mt-0.5">
                Digital Table Menu
              </span>
            </div>
          </Link>

          {/* Interactive Table Badge with Change Dialog */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTableModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#12141C] border border-[#D4AF37]/40 hover:border-[#D4AF37] px-3 py-1.5 rounded-full text-xs font-mono font-bold text-[#E5B869] shadow-md transition-all cursor-pointer"
              title="Click to switch assigned dining station"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <TableIcon className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>Table {tableNumber}</span>
            </motion.button>

            {/* Quick Cart Trigger if items present */}
            {totalCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-[#12141C] border border-white/10 text-white hover:border-[#D4AF37] shadow-md cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#E5B869]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px] font-bold">
                  {totalCount}
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Search & Dietary Bar */}
        <div className="max-w-md mx-auto mt-2.5 space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search molecular dishes, spices, truffle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#181B26] border border-white/10 text-xs text-[#F4F0E8] placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters (All / Veg / Non-Veg / Chef Specials) */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all cursor-pointer ${
                dietFilter === 'all'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black shadow-md'
                  : 'bg-[#12141C] text-neutral-300 border border-white/10 hover:border-white/30'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all cursor-pointer ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#12141C] text-neutral-300 border border-white/10 hover:border-white/30'
              }`}
            >
              <VegBadge size="sm" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all cursor-pointer ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#12141C] text-neutral-300 border border-white/10 hover:border-white/30'
              }`}
            >
              <NonVegBadge size="sm" />
              <span>Non-Veg</span>
            </button>
            <button
              onClick={() => setDietFilter('special')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all cursor-pointer ${
                dietFilter === 'special'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black shadow-md'
                  : 'bg-[#12141C] text-neutral-300 border border-white/10 hover:border-white/30'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#E5B869]" />
              <span>Chef's Lab</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Carousel */}
        <div className="max-w-md mx-auto flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none border-t border-white/10 mt-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#E5B869] text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Curations
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.slug)}
              className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap font-bold transition-all cursor-pointer ${
                activeCategory === c.slug
                  ? 'bg-[#E5B869] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Table Notice if invalid query param provided */}
        {tableNotice && (
          <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-between">
            <span>{tableNotice}</span>
            <button onClick={() => setTableNotice(null)} className="text-amber-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* In-Restaurant Status Card */}
        <div className="bg-[#12141C] border border-[#D4AF37]/25 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5B869] font-bold">
                In-Restaurant Table Order
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-serif font-black text-[#F4F0E8] mt-0.5">
              Station {tableNumber} • Kitchen Connected
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
              Tap any dish to inspect molecular ingredients or add directly.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#181B26] border border-white/10 flex items-center justify-center text-[#E5B869] flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Dish List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-[#12141C] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : loadError ? (
          <div className="p-8 text-center bg-[#12141C] border border-white/10 rounded-2xl space-y-3 shadow-xl">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs text-neutral-300">{loadError}</p>
            <button
              onClick={loadMenuData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37] text-black font-mono text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading Menu</span>
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-[#12141C] border border-white/10 rounded-2xl shadow-xl">
            <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-xs text-neutral-400">No dishes match your active filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#E5B869] underline font-mono font-bold"
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
                  className={`bg-[#12141C] border rounded-2xl p-3 flex gap-3 cursor-pointer shadow-xl active:scale-[0.99] transition-all duration-300 ${
                    isAvailable
                      ? 'border-white/10 hover:border-[#D4AF37]/50'
                      : 'border-white/5 opacity-60'
                  }`}
                >
                  {/* Left: Thumbnail with Fallback */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
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
                  <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-serif font-bold text-sm text-[#F4F0E8] line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="font-serif font-black text-[#E5B869] text-sm whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-tight font-light">
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600 text-white">
                            <Ban className="w-3 h-3 text-white" />
                            <span>Sold Out</span>
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center gap-2 bg-[#181B26] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 shadow-md">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-neutral-300 hover:text-[#E5B869] p-0.5 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </motion.button>
                            <span className="font-mono text-xs font-bold text-[#E5B869] min-w-[16px] text-center">
                              {qty}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-neutral-300 hover:text-[#E5B869] p-0.5 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(item, 1)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black transition-all shadow-md cursor-pointer"
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
        <div className="pt-6 pb-4 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] font-mono text-[#E5B869]">
            Station {tableNumber} • Farzi Progressive Gastronomy
          </p>
          <p className="text-[10px] text-neutral-400">
            Standard 5% GST included on order calculation • For sommelier pairings or table service, request your floor server.
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-flex items-center gap-1 text-[11px] text-[#E5B869] hover:text-white font-mono font-bold transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>Explore Main Restaurant Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. FLOATING BOTTOM CART BAR */}
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
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold border border-[#D4AF37] transition-all cursor-pointer shadow-[#D4AF37]/25"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-black text-[#E5B869] flex items-center justify-center font-mono text-xs font-bold shadow-md">
                  {totalCount}
                </div>
                <span className="text-sm font-bold tracking-wide">Review Table Order</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-base text-black">₹{total}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TABLE STATION SELECTOR MODAL */}
      <AnimatePresence>
        {isTableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl text-[#F4F0E8]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-[#E5B869]" />
                  <h3 className="font-serif font-black text-base text-[#F4F0E8]">
                    Select Dining Station
                  </h3>
                </div>
                <button
                  onClick={() => setIsTableModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 mt-2 mb-4 text-left font-light">
                Choose the station number printed on your table acrylic stand (T01 - T12):
              </p>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {AVAILABLE_TABLES.map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => handleSelectTable(tbl)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      tableNumber === tbl
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-black border-[#D4AF37] shadow-lg'
                        : 'bg-[#181B26] text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsTableModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
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

export default QRMenuPage;
