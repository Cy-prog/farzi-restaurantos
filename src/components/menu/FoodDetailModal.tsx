import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Flame, ShieldAlert, Sparkles, ShoppingBag, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types';
import { VegBadge, NonVegBadge, ChefSpecialBadge, SpiceBadge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Button } from '../ui/Button';
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
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-charcoal-900 border border-charcoal-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-charcoal-950/80 text-ivory-200 hover:text-gold-400 hover:bg-charcoal-900 transition-colors border border-charcoal-700/80 shadow-lg"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            {/* Image Banner */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-charcoal-950">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.name}
                className={`w-full h-full object-cover ${!isAvailable ? 'grayscale-[40%] contrast-90' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10 flex-wrap">
                {item.isVeg ? <VegBadge size="md" /> : <NonVegBadge size="md" />}
                {item.isChefSpecial && <ChefSpecialBadge />}
                {item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />}
                {!isAvailable && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-rose-950/90 text-rose-300 border border-rose-800/80 shadow-md">
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sold Out</span>
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                    {item.categoryName || 'Culinary Illusion'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-1">
                    {item.name}
                  </h2>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400">
                  ₹{item.price}
                </div>
              </div>

              <p className="text-sm sm:text-base text-ivory-300 leading-relaxed font-light">
                {item.description}
              </p>

              {/* Meta Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-charcoal-800">
                {item.preparationTimeMinutes && (
                  <div className="flex items-center gap-2 text-xs text-ivory-300">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>~{item.preparationTimeMinutes} mins prep</span>
                  </div>
                )}
                {item.calories && (
                  <div className="flex items-center gap-2 text-xs text-ivory-300">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{item.calories} kcal</span>
                  </div>
                )}
                {item.isChefSpecial && (
                  <div className="flex items-center gap-2 text-xs text-ivory-300">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Lab Special</span>
                  </div>
                )}
              </div>

              {/* Ingredients & Allergens */}
              {(item.ingredients || item.allergens) && (
                <div className="space-y-3 bg-charcoal-850/60 p-4 rounded-xl border border-charcoal-800">
                  {item.ingredients && (
                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-wider text-ivory-400 mb-1">
                        Culinary Composition
                      </h4>
                      <p className="text-xs text-ivory-200">{item.ingredients}</p>
                    </div>
                  )}
                  {item.allergens && (
                    <div className="flex items-start gap-2 pt-2 border-t border-charcoal-800/80">
                      <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-amber-300">Allergen Notice: </span>
                        <span className="text-xs text-ivory-300">{item.allergens}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Special Instructions Input (only active if available) */}
              {isAvailable ? (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ivory-400 mb-2">
                    Special Chef Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, dressing on the side..."
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-800/90 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>This dish has sold out for the current dining service. Check back next service.</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-charcoal-800">
                {isAvailable ? (
                  <>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-charcoal-800 px-3.5 py-1.5 rounded-full border border-charcoal-700">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 rounded-full text-ivory-400 hover:text-white hover:bg-charcoal-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-sm font-semibold text-ivory-100 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 rounded-full text-ivory-400 hover:text-white hover:bg-charcoal-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add Button */}
                    <Button
                      onClick={handleAddToCart}
                      variant={isAdded ? 'copper' : 'gold'}
                      size="lg"
                      className="flex-1"
                      icon={isAdded ? <Sparkles className="w-5 h-5 animate-pulse" /> : <ShoppingBag className="w-5 h-5" />}
                    >
                      {isAdded ? 'Added to Order!' : `Add to Order • ₹${item.price * quantity}`}
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    size="lg"
                    className="w-full opacity-60 cursor-not-allowed border-charcoal-700 text-charcoal-400"
                  >
                    Sold Out for Current Service
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
