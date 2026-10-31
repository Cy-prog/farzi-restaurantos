import React, { useState } from 'react';
import { X, Plus, Minus, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { soundFX } from '../../utils/soundEffects';

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
  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(item, quantity, instructions);
    soundFX.playChime();
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0F1117] border border-[#D4AF37]/30 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-[#F4F0E8]"
        >
          {/* Top Bar: "FARZI CAFÉ" & "✕" Close Button (Matching top-right design) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0C10]">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-[0.2em] text-sm font-bold uppercase text-[#FFF5DE]">
                FARZI <span className="text-[#D4AF37]">CAFÉ</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase">
                · DISH ANTHOLOGY
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Split Body (Left: Zoomed Food Photo | Right: Typography & Actions) */}
          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto max-h-[80vh]">
            
            {/* Left Column: Zoomed High-Res Photography */}
            <div className="md:col-span-6 relative aspect-square md:aspect-auto min-h-[300px] md:min-h-[440px] bg-neutral-950 overflow-hidden">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover object-center filter contrast-105"
                fallbackSrc="/arancini.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0F1117]" />
            </div>

            {/* Right Column: Title, Description, Badges, Stepper, Add to Cart */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Dish Title (Large Serif) */}
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
                  {item.name}
                </h2>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Badges: [● Vegetarian] [★ Chef's Special] (Matching top-right design) */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-neutral-300">
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  </div>

                  {item.isChefSpecial && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono tracking-wider uppercase text-[#E5B869] font-bold">
                      <Star className="w-3 h-3 text-[#E5B869] fill-[#E5B869]" />
                      <span>Chef's Special</span>
                    </div>
                  )}
                </div>

                {/* Special Instructions Note */}
                <div className="pt-2">
                  <label htmlFor="cooking-notes" className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1.5">
                    Cooking Notes / Dietary Requests
                  </label>
                  <input
                    id="cooking-notes"
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, curry foam on side..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161922] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Bottom Actions Row: Price + Stepper [- 1 +] + Add to Cart Button */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-black text-2xl sm:text-3xl text-[#E5B869]">
                    ₹{totalPrice}
                  </span>

                  {/* Sleek Dark Stepper [- 1 +] */}
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#161922] border border-white/15 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-full text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold w-4 text-center text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Gold Button (Matching "Add to Cart ₹695" in design) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-black'
                      : isAvailable
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#C59F6D] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.98]'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Added to Your Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart ₹{totalPrice}</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
