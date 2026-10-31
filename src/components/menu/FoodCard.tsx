import React, { useState } from 'react';
import { Plus, Check, Eye, Ban, ArrowRight } from 'lucide-react';
import { MenuItem } from '../../types';
import { VegBadge, NonVegBadge, ChefSpecialBadge, SpiceBadge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useCart } from '../../context/CartContext';

interface FoodCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  compact?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onSelect, compact = false }) => {
  const { addToCart, items } = useCart();
  const [isJustAdded, setIsJustAdded] = useState(false);

  const cartItem = items.find((i) => i.menuItemId === item.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isAvailable = item.isAvailable !== false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(item, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 900);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      data-cursor="INSPECT"
      className={`group relative flex flex-col bg-[#12141C] rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-1 ${
        isAvailable
          ? 'border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]'
          : 'border-white/5 opacity-70'
      }`}
    >
      {/* Image Showcase Frame (30%+ Photography Area) */}
      <div className={`relative w-full overflow-hidden bg-neutral-950 ${compact ? 'h-40' : 'h-52 sm:h-56'}`}>
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-105 ${
            !isAvailable ? 'grayscale-[50%]' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-black/40 pointer-events-none" />

        {/* Dietary / Special Badges Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
          {item.isVeg ? <VegBadge /> : <NonVegBadge />}
          {item.isChefSpecial && <ChefSpecialBadge />}
        </div>

        {/* Top-Right Badges: Sold Out or Spice */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {!isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-rose-600 text-white shadow-md">
              <Ban className="w-3 h-3 text-white" />
              <span>Sold Out</span>
            </span>
          ) : (
            item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />
          )}
        </div>

        {/* Quick View Pill on Desktop Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/50 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#090A0E] text-[#F4F0E8] border border-[#D4AF37]/40 shadow-lg font-bold">
            <Eye className="w-3.5 h-3.5 text-[#E5B869]" />
            Inspect Creation
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F4F0E8] group-hover:text-[#E5B869] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="font-serif font-black text-[#E5B869] text-base sm:text-lg whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
            {item.categoryName || 'Culinary Lab'}
          </span>

          {isAvailable && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickAdd}
                data-cursor="ADD"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  isJustAdded
                    ? 'bg-emerald-600 text-white'
                    : currentQuantityInCart > 0
                    ? 'bg-[#1E222D] text-[#E5B869] border border-[#E5B869]/40'
                    : 'bg-[#1E222D] hover:bg-[#E5B869] text-neutral-200 hover:text-black border border-white/10'
                }`}
                title="Quick Add to Cart"
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </>
                ) : currentQuantityInCart > 0 ? (
                  <>
                    <Check className="w-3 h-3 text-[#E5B869]" />
                    <span>In Cart ({currentQuantityInCart})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 text-[#E5B869]" />
                    <span>Add</span>
                  </>
                )}
              </button>

              {/* Circular Arrow Button (Matches Design Board) */}
              <div
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 group-hover:bg-[#E5B869] group-hover:text-black group-hover:border-[#E5B869] transition-all"
                title="Inspect Dish Details"
              >
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
