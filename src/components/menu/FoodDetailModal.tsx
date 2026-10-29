import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Flame, ShieldAlert, Sparkles, ShoppingBag, Ban, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types';
import { VegBadge, NonVegBadge, ChefSpecialBadge, SpiceBadge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useCart } from '../../context/CartContext';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  if (!item) return null;

  const isAvailable = item.isAvailable !== false;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(item, quantity, instructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#12141A]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-black hover:text-[#D4AF37] border border-black/10 transition-colors shadow-lg"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            {/* Image Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.name}
                className={`w-full h-full object-cover filter contrast-105 ${!isAvailable ? 'grayscale-[40%]' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10 flex-wrap">
                {item.isVeg ? <VegBadge size="md" /> : <NonVegBadge size="md" />}
                {item.isChefSpecial && <ChefSpecialBadge />}
                {item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />}
                {!isAvailable && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-rose-600 text-white shadow-md">
                    <Ban className="w-3.5 h-3.5 text-white" />
                    <span>Sold Out</span>
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold block mb-1">
                    {item.categoryName || 'Culinary Creation'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-black">
                    {item.name}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl sm:text-3xl font-serif font-black text-[#D4AF37]">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold mb-2">
                  Gastronomy & Plating Story
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Ingredients & Allergens */}
              {(item.ingredients || item.allergens) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-black/10 text-xs">
                  {item.ingredients && (
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase block mb-1">
                        Ingredients & Spices:
                      </span>
                      <p className="text-neutral-700 font-normal">{item.ingredients}</p>
                    </div>
                  )}
                  {item.allergens && (
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase font-bold block mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-500" />
                        <span>Allergen Transparency:</span>
                      </span>
                      <p className="text-neutral-700 font-normal">{item.allergens}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Special Instructions Note Input */}
              {isAvailable && (
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase font-bold block mb-2">
                    Chef Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, dressing on the side, nut allergy..."
                    className="w-full bg-[#FAF9F5] border border-black/15 rounded-xl p-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          {isAvailable && (
            <div className="p-4 sm:p-6 bg-white border-t border-black/10 flex items-center justify-between gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center gap-2 bg-[#FAF9F5] rounded-xl border border-black/10 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-neutral-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-neutral-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                data-cursor="ADD"
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/10 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-[#D4AF37] text-white hover:text-black active:scale-[0.98]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Table Order</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                    <span>Add To Order · ₹{item.price * quantity}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
