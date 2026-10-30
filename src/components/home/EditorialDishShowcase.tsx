import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface EditorialDishShowcaseProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

export const EditorialDishShowcase: React.FC<EditorialDishShowcaseProps> = ({ dishes, onSelectDish }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();
  if (!dishes.length) return null;

  const dish = dishes[activeIdx] || dishes[0];
  const quickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(dish, 1);
    setAddedId(dish.id);
    window.setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section className="bg-[#fbfaf6] px-4 py-20 text-[#202019] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-[#202019]/15 pb-5 sm:mb-14 sm:pb-7">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#a74326]">Straight from our kitchen</p>
            <h2 className="font-serif text-4xl leading-none tracking-[-0.04em] sm:text-6xl">A few favourites</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-2 pb-1 text-sm hover:text-[#a74326]">See the whole menu <ArrowUpRight size={16} /></Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 lg:order-1 lg:col-span-5">
            {dishes.slice(0, 5).map((item, index) => (
              <button key={item.id} onClick={() => setActiveIdx(index)} className={`group flex w-full items-start justify-between gap-5 border-b border-[#202019]/15 py-5 text-left transition ${activeIdx === index ? 'text-[#a74326]' : 'text-[#202019] hover:text-[#a74326]'}`}>
                <span className="flex items-start gap-4">
                  <span className="mt-1 text-[10px] tracking-[0.12em] text-[#8b897f]">0{index + 1}</span>
                  <span>
                    <span className="block font-serif text-xl leading-tight sm:text-2xl">{item.name}</span>
                    <span className="mt-1 block text-xs text-[#77756b]">{item.categoryName || 'From the chef'} · {item.isVeg ? 'Vegetarian' : 'Chef’s selection'}</span>
                  </span>
                </span>
                <span className="pt-1 text-sm text-[#202019]">₹{item.price}</span>
              </button>
            ))}
          </div>

          <div className="relative order-1 min-h-[420px] overflow-hidden bg-[#312b22] lg:order-2 lg:col-span-7 lg:min-h-[580px]">
            <AnimatePresence mode="wait">
              <motion.img key={dish.id} src={dish.imageUrl} alt={dish.name} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-5 text-white sm:flex-row sm:items-end sm:p-8">
              <div className="max-w-xl">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/70">{dish.categoryName || 'Farzi favourite'}</p>
                <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{dish.name}</h3>
                {dish.description && <p className="mt-2 line-clamp-2 max-w-lg text-sm leading-6 text-white/75">{dish.description}</p>}
                <button onClick={() => onSelectDish(dish)} className="mt-4 border-b border-white/70 pb-1 text-sm hover:border-white">Discover this dish</button>
              </div>
              <button onClick={quickAdd} className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#f2ead9] px-5 py-3 text-sm text-[#202019] transition hover:bg-white">
                {addedId === dish.id ? <><Check size={16} /> Added</> : <><Plus size={16} /> Add · ₹{dish.price}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
