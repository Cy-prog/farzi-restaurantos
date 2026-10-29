import React, { useState } from 'react';
import { Plus, Check, Eye, Ban, Flame } from 'lucide-react';
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
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
        isAvailable
          ? 'border-black/10 hover:border-black/30'
          : 'border-black/5 opacity-75'
      }`}
    >
      {/* Image Showcase Frame (30%+ Photography Area) */}
      <div className={`relative w-full overflow-hidden bg-neutral-900 ${compact ? 'h-40' : 'h-52 sm:h-56'}`}>
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-105 ${
            !isAvailable ? 'grayscale-[40%]' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-black text-white border border-white/20 shadow-lg font-bold">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            Inspect Creation
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-serif font-black text-base sm:text-lg text-black group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="font-serif font-black text-[#D4AF37] text-base sm:text-lg whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-black/10 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
            {item.categoryName || 'Culinary Lab'}
          </span>

          {isAvailable && (
            <button
              onClick={handleQuickAdd}
              data-cursor="ADD"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isJustAdded
                  ? 'bg-emerald-600 text-white'
                  : currentQuantityInCart > 0
                  ? 'bg-[#FAF9F5] text-black border border-black'
                  : 'bg-black hover:bg-[#D4AF37] text-white hover:text-black'
              }`}
            >
              {isJustAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : currentQuantityInCart > 0 ? (
                <>
                  <Check className="w-3 h-3 text-[#D4AF37]" />
                  <span>In Cart ({currentQuantityInCart})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 text-[#D4AF37]" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
