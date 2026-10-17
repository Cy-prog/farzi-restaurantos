import React, { useState } from 'react';
import { Plus, Check, Eye, Ban } from 'lucide-react';
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

  const cartItem = items.find(i => i.menuItemId === item.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isAvailable = item.isAvailable !== false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(item, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 800);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative flex flex-col bg-charcoal-900/90 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 cursor-pointer ${
        isAvailable
          ? 'border-charcoal-800 hover:border-gold-500/40'
          : 'border-charcoal-800/60 opacity-85'
      }`}
    >
      {/* Image Container with Hover Zoom */}
      <div className={`relative w-full overflow-hidden bg-charcoal-950 ${compact ? 'h-44' : 'h-52 sm:h-56'}`}>
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
            !isAvailable ? 'grayscale-[40%] contrast-90' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-black/30 pointer-events-none" />

        {/* Dietary / Special Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
          {item.isVeg ? <VegBadge /> : <NonVegBadge />}
          {item.isChefSpecial && <ChefSpecialBadge />}
        </div>

        {/* Top-Right Badges: Sold Out or Spice */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {!isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-rose-950/90 text-rose-300 border border-rose-800/80 shadow-md backdrop-blur-sm">
              <Ban className="w-3 h-3 text-rose-400" />
              <span>Sold Out</span>
            </span>
          ) : (
            item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />
          )}
        </div>

        {/* Quick View Pill (revealed on desktop hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-charcoal-950/90 text-gold-300 border border-gold-500/30 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            Explore Creation
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="font-serif font-bold text-gold-400 text-base sm:text-lg whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-ivory-400 line-clamp-2 leading-relaxed mb-4 font-light">
            {item.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-charcoal-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-charcoal-500 uppercase">
            {item.categoryName || 'Lab Curation'}
          </span>

          {/* Quick Add Button or Sold Out indicator */}
          {!isAvailable ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-charcoal-500 bg-charcoal-850 border border-charcoal-800">
              Unavailable
            </span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 ${
                isJustAdded
                  ? 'bg-emerald-500 text-charcoal-950 scale-105'
                  : currentQuantityInCart > 0
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 hover:bg-gold-500 hover:text-charcoal-950'
                  : 'bg-charcoal-800 text-ivory-200 border border-charcoal-700 hover:bg-gold-500 hover:text-charcoal-950 hover:border-gold-500'
              }`}
              aria-label={`Add ${item.name} to order`}
            >
              {isJustAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : currentQuantityInCart > 0 ? (
                <>
                  <span className="w-4 h-4 rounded-full bg-gold-400 text-charcoal-950 flex items-center justify-center text-[10px] font-bold">
                    {currentQuantityInCart}
                  </span>
                  <span>In Cart</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
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
