import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check, Wind, Flame, Droplets, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/soundEffects';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface LabDish {
  id: number;
  name: string;
  tagline: string;
  category: string;
  price: number;
  isVeg: boolean;
  baseImage: string;
  infusedImage: string;
  smokeColor: string;
  temperature: string;
  spiceLevel: string;
  scienceNotes: string;
  tastingNotes: string[];
  elements: {
    name: string;
    icon: string;
    desc: string;
    color: string;
  }[];
}

const LAB_DISHES: LabDish[] = [
  {
    id: 101,
    name: 'Deconstructed Dal Chawal Arancini',
    tagline: 'North Indian comfort meets Sicilian arancini theatre',
    category: 'Molecular Tapas',
    price: 695,
    isVeg: true,
    baseImage: '/arancini.jpg',
    infusedImage: '/cloche-dish.jpg',
    smokeColor: 'rgba(212, 175, 55, 0.45)',
    temperature: '-196°C Cryo Smoke',
    spiceLevel: 'Mild',
    scienceNotes: 'Lentil risotto spheres crusted with roasted cumin pappadum crumbs, topped with reverse-spherified sweet-tangy raw mango chutney pearls and aromatic curry foam.',
    tastingNotes: ['Crunchy Pappadum Shell', 'Velvet Moong Lentils', 'Achar Emulsion', 'Aromatic Mint Mist'],
    elements: [
      { name: 'Cryo Mist', icon: '🧪', desc: '-196°C liquid nitrogen bath', color: '#68B0FF' },
      { name: 'Achar Pearls', icon: '🥭', desc: 'Calcium lactate mango spherification', color: '#E09F27' },
      { name: 'Pappadum Soil', icon: '🌾', desc: 'Dehydrated lentil crunch', color: '#D44A1E' },
      { name: 'Truffle Ghee', icon: '✨', desc: 'Smoked clarified butter aroma', color: '#F5C86E' },
    ]
  },
  {
    id: 102,
    name: 'Smoked Butter Chicken Sphere',
    tagline: 'Old Delhi makhani encased in a fragile edible bell jar',
    category: 'Culinary Theatre',
    price: 645,
    isVeg: false,
    baseImage: '/cloche-dish.jpg',
    infusedImage: '/paneer-tikka.jpg',
    smokeColor: 'rgba(212, 74, 30, 0.45)',
    temperature: '85°C Smoked Enclosure',
    spiceLevel: 'Medium',
    scienceNotes: 'Tandoor-charred pulled chicken enclosed in an applewood smoke bell jar, served alongside micro garlic naan tuile and fenugreek dust.',
    tastingNotes: ['Hickory Smoke', 'Slow-Simmered San Marzano Makhani', 'Kasuri Methi Fragrance', 'Charred Naan Crisp'],
    elements: [
      { name: 'Applewood Smoke', icon: '💨', desc: 'Dense aromatic vapor capture', color: '#BF7854' },
      { name: 'Makhani Foam', icon: '🍅', desc: 'Siphon-whipped butter emulsion', color: '#D44A1E' },
      { name: 'Fenugreek Snow', icon: '❄️', desc: 'Flash-frozen dried herb essence', color: '#6B8576' },
      { name: 'Charcoal Glow', icon: '🔥', desc: 'Tandoor embers finish', color: '#E09F27' },
    ]
  },
  {
    id: 103,
    name: 'Ras Malai Tres Leches & Nitrogen Foam',
    tagline: 'Classic Bengali confection immersed in Mexican three-milk bath',
    category: 'Sweet Illusion',
    price: 545,
    isVeg: true,
    baseImage: '/tres-leches.jpg',
    infusedImage: '/apple-foamintini.jpg',
    smokeColor: 'rgba(224, 159, 39, 0.5)',
    temperature: '4°C Chilled Sublimation',
    spiceLevel: 'Sweet',
    scienceNotes: 'Cardamom cottage cheese discs soaked in evaporated milk, sweetened condensed milk, and heavy cream, crowned with flash-frozen saffron foam and pistachio dust.',
    tastingNotes: ['Pistachio Praline', 'Saffron Caviar', 'Caramelized Cardamom Cream', 'Crisp Wafer Disc'],
    elements: [
      { name: 'Saffron Mist', icon: '🌸', desc: 'Aromatic cryogenic vapor', color: '#E09F27' },
      { name: 'Milk Caviar', icon: '🥛', desc: 'Sodium alginate pearls', color: '#FAF8F5' },
      { name: 'Gold Flake', icon: '✨', desc: '24 Karat edible leaf accent', color: '#F5C86E' },
      { name: 'Rose Cryo', icon: '🌹', desc: 'Cryo-crystallized rose petals', color: '#D44A1E' },
    ]
  }
];

export const IllusionLabMixer: React.FC = () => {
  const [selectedDishIdx, setSelectedDishIdx] = useState(0);
  const [infusionLevel, setInfusionLevel] = useState(60); // 0 to 100
  const [activeElements, setActiveElements] = useState<string[]>(['Cryo Mist', 'Achar Pearls']);
  const [isAdded, setIsAdded] = useState(false);
  const [droppedCount, setDroppedCount] = useState(2);
  const dishZoneRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const currentDish = LAB_DISHES[selectedDishIdx];

  const handleDragDrop = (elemName: string) => {
    if (!activeElements.includes(elemName)) {
      setActiveElements((prev) => [...prev, elemName]);
      setDroppedCount((prev) => prev + 1);
      setInfusionLevel((prev) => Math.min(100, prev + 20));
      soundFX.playChime();
    } else {
      soundFX.playWhoosh();
    }
  };

  const toggleElement = (elemName: string) => {
    if (activeElements.includes(elemName)) {
      setActiveElements(activeElements.filter((e) => e !== elemName));
      setInfusionLevel(Math.max(15, infusionLevel - 20));
    } else {
      setActiveElements([...activeElements, elemName]);
      setInfusionLevel(Math.min(100, infusionLevel + 20));
      soundFX.playChime();
    }
  };

  const handleAddToCart = () => {
    const item: MenuItem = {
      id: currentDish.id,
      name: currentDish.name,
      slug: currentDish.name.toLowerCase().replace(/\s+/g, '-'),
      price: currentDish.price,
      imageUrl: currentDish.infusedImage,
      description: currentDish.scienceNotes,
      categoryId: 1,
      categoryName: currentDish.category,
      isVeg: currentDish.isVeg,
      isAvailable: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      spiceLevel: currentDish.spiceLevel === 'Mild' ? 'MILD' : 'MEDIUM',
      displayOrder: 1,
    };

    addToCart(item, 1, `Lab Infused (${activeElements.join(', ')})`);
    setIsAdded(true);
    soundFX.playChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#E5B869', '#FFF0D0'],
    });

    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section id="3d-lab" className="relative py-24 sm:py-32 bg-[#090A0E] text-[#F4F0E8] overflow-hidden editorial-border-t editorial-border-b">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Newmix Inspired "Drag to Mix" Eyebrow */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#12141C] text-[#E5B869] text-[10px] font-mono tracking-[0.3em] font-bold uppercase mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#E5B869]" />
              <span>THEATRICAL GASTRONOMY LAB · DRAG TO INFUSE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif font-black tracking-tight uppercase leading-[0.92] text-white">
              THE ALCHEMY OF <br />
              <span className="text-gold-gradient italic font-normal">ILLUSION</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Inspired by Newmix Coffee's "Drag to mix" interaction: drag & drop molecular ingredient vials directly onto the plate to unlock cryo smoke and watch the dish transform in real-time.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#E5B869] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-ping" />
              <span>INTERACTIVE PLATTER · SPRING PHYSICS ENABLED</span>
            </div>
          </div>
        </div>

        {/* Dish Selector Tabs (01, 02, 03) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {LAB_DISHES.map((dish, idx) => (
            <button
              key={dish.id}
              onClick={() => {
                setSelectedDishIdx(idx);
                setInfusionLevel(50);
                soundFX.playWhoosh();
              }}
              className={`p-4 text-left rounded-2xl transition-all duration-300 border cursor-pointer ${
                selectedDishIdx === idx
                  ? 'bg-[#161922] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                  : 'bg-[#10121A] border-white/10 hover:border-white/25 hover:bg-[#141722]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
                <span>0{idx + 1} / 03</span>
                <span className={dish.isVeg ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {dish.isVeg ? '● VEG' : '▲ NON-VEG'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white line-clamp-1">
                {dish.name}
              </h3>
              <p className="text-[12px] text-[#E5B869] font-mono font-bold mt-1">₹{dish.price}</p>
            </button>
          ))}
        </div>

        {/* Interactive Staging Grid: Left Platter Drop Zone | Right Controls & Draggable Tokens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: The Molecular Platter (Interactive Drop Target) (7 Cols) */}
          <div ref={dishZoneRef} className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-[#12141C] shadow-[0_20px_60px_rgba(0,0,0,0.9)] aspect-[4/3] sm:aspect-[16/11]">
              
              {/* Infused Dish Layer (Revealed proportionally by infusionLevel) */}
              <div className="absolute inset-0 overflow-hidden">
                <ImageWithFallback
                  src={currentDish.infusedImage}
                  alt={currentDish.name}
                  className="w-full h-full object-cover filter contrast-105"
                  fallbackSrc="/arancini.jpg"
                />
              </div>

              {/* Base Raw Dish Layer (Clipped based on infusion scrub) */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-500 pointer-events-none"
                style={{
                  clipPath: `polygon(${infusionLevel}% 0, 100% 0, 100% 100%, ${infusionLevel}% 100%)`
                }}
              >
                <ImageWithFallback
                  src={currentDish.baseImage}
                  alt="Base Formulation"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                  fallbackSrc="/cloche-dish.jpg"
                />
              </div>

              {/* Interactive Split Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#E5B869] shadow-[0_0_15px_#E5B869] pointer-events-none"
                style={{ left: `${infusionLevel}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-[#E5B869] flex items-center justify-center text-[#E5B869] text-xs font-mono shadow-xl">
                  ↔
                </div>
              </div>

              {/* Dynamic Cryo Mist & Particle Smoke Burst */}
              <AnimatePresence>
                {infusionLevel > 25 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (infusionLevel / 100) * 0.75 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, ${currentDish.smokeColor} 0%, transparent 70%)`
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Corner Live Status Badges */}
              <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[9px] font-mono tracking-wider uppercase text-[#E5B869] font-bold">
                  ✦ {currentDish.temperature}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider uppercase text-white font-medium">
                  {infusionLevel}% INFUSED ({activeElements.length} ACTIVE)
                </span>
              </div>

              {/* Interactive Crucible Drop Cue Prompt */}
              <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-300">
                  Target Platter: Drag ingredients here or adjust slider
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setInfusionLevel(infusionLevel >= 90 ? 20 : 100);
                    soundFX.playWhoosh();
                  }}
                  className="text-[#E5B869] hover:underline text-[10px] font-mono font-bold uppercase"
                >
                  {infusionLevel >= 90 ? 'Reset Stage' : 'Instant Reveal'}
                </button>
              </div>

            </div>
          </div>

          {/* Right: Interactive Draggable Molecular Tokens & Infusion Slider (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.28em] text-[#E5B869] uppercase font-bold block">
                ✦ MOLECULAR LAB CONTROLS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {currentDish.name}
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                {currentDish.scienceNotes}
              </p>
            </div>

            {/* DRAGGABLE INGREDIENT TOKENS (Newmix "Drag to mix" interaction!) */}
            <div className="p-5 rounded-2xl bg-[#12141C] border border-[#D4AF37]/25 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#E5B869] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>DRAGGABLE MOLECULAR ELEMENTS</span>
                </span>
                <span className="text-neutral-400 text-[10px]">DRAG TO PLATTER</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {currentDish.elements.map((elem) => {
                  const isInfused = activeElements.includes(elem.name);
                  return (
                    <motion.div
                      key={elem.name}
                      drag
                      dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
                      dragElastic={0.2}
                      whileDrag={{ scale: 1.15, rotate: 6, zIndex: 50 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onDragEnd={() => handleDragDrop(elem.name)}
                      onClick={() => toggleElement(elem.name)}
                      className={`p-3 rounded-xl border text-xs cursor-grab active:cursor-grabbing select-none transition-all shadow-md flex items-center gap-2.5 ${
                        isInfused
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#C59F6D]/20 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'bg-[#161922] border-white/10 text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{elem.icon}</span>
                      <div className="overflow-hidden">
                        <span className="font-serif font-bold text-xs block truncate text-white">{elem.name}</span>
                        <span className="text-[9px] font-mono text-neutral-400 block truncate">{elem.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Infusion Range Slider */}
            <div className="p-5 rounded-2xl bg-[#12141C] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>Manual Infusion Scrub</span>
                </span>
                <span className="text-[#E5B869] font-bold">{infusionLevel}% THEATRE</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={infusionLevel}
                onChange={(e) => setInfusionLevel(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />

              <div className="flex justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                <span>Raw Base Form</span>
                <span>Cryo Spherification</span>
                <span>Full Illusion</span>
              </div>
            </div>

            {/* Price & Add to Cart Order Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">
                  Creation Price
                </span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-[#E5B869]">
                  ₹{currentDish.price}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-xl cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-500 text-black'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#C59F6D] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Added To Table</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-black font-bold" />
                    <span>Order Lab Dish</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
