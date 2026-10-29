import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, Check, Sparkles, Flame, Eye } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

interface EditorialDishShowcaseProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

export const EditorialDishShowcase: React.FC<EditorialDishShowcaseProps> = ({ dishes, onSelectDish }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();

  // If no dishes passed, return null
  if (!dishes || dishes.length === 0) return null;

  const currentDish = dishes[activeIdx] || dishes[0];

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setAddedId(dish.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F5] text-[#12141A] overflow-hidden editorial-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 editorial-border-b">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase mb-4 shadow-sm">
              <span>✦</span>
              <span>CURATED SIGNATURE ANTHOLOGY</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight leading-[0.92] text-black">
              AVANT-GARDE <br />
              <span className="text-stroke">CREATIONS</span>
            </h2>
          </div>

          <Link to="/menu" data-cursor="VIEW">
            <button className="px-6 py-3 rounded-xl border border-black/20 hover:border-black bg-white hover:bg-black text-xs font-mono tracking-widest uppercase text-black hover:text-white transition-all flex items-center gap-2 shadow-sm">
              <span>View Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </Link>
        </div>

        {/* Editorial Split Layout: Left Index (5 cols) & Right Canvas (7 cols - 30%+ Imagery) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Interactive Dish Index */}
          <div className="lg:col-span-5 space-y-3">
            {dishes.slice(0, 6).map((dish, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={dish.id}
                  onClick={() => setActiveIdx(idx)}
                  data-cursor="INSPECT"
                  className={`group p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-white border-2 border-black shadow-xl ring-2 ring-black/5'
                      : 'bg-white/80 border-black/10 hover:border-black/30 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-400 font-bold">
                        [0{idx + 1}]
                      </span>
                      <div>
                        <h3 className="font-serif font-black text-base sm:text-lg text-black">
                          {dish.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                            {dish.categoryName || 'Chef Special'}
                          </span>
                          <span className="text-neutral-400">·</span>
                          <span className={`text-[10px] font-mono font-bold ${dish.isVeg ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {dish.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-black text-base text-[#D4AF37]">
                        ₹{dish.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Oversized Editorial Visual Frame & Actions */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden border border-black/15 bg-neutral-950 shadow-2xl group min-h-[460px] sm:min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDish.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentDish.imageUrl}
                    alt={currentDish.name}
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Dish Meta Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase">
                    {currentDish.categoryName || 'Culinary Creation'}
                  </span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">
                    ₹{currentDish.price}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2 uppercase">
                    {currentDish.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl line-clamp-2">
                    {currentDish.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectDish(currentDish)}
                    data-cursor="INSPECT"
                    className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Details</span>
                  </button>

                  <button
                    onClick={(e) => handleQuickAdd(e, currentDish)}
                    data-cursor="ADD"
                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md ${
                      addedId === currentDish.id
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#D4AF37] hover:bg-[#EEB446] text-black hover:scale-[1.02]'
                    }`}
                  >
                    {addedId === currentDish.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-black" />
                        <span>Add To Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
