import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check, RotateCcw, Flame, Wind, Droplets, Award, ArrowRight } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

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
    price: 525,
    isVeg: true,
    baseImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop',
    infusedImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    smokeColor: 'rgba(224, 159, 39, 0.4)',
    temperature: '-196°C Cryo Smoke',
    spiceLevel: 'Mild',
    scienceNotes: 'Lentil risotto spheres crusted with roasted cumin pappadum crumbs, topped with reverse-spherified sweet-tangy raw mango chutney pearls.',
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
    baseImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1200&auto=format&fit=crop',
    infusedImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1200&auto=format&fit=crop',
    smokeColor: 'rgba(212, 74, 30, 0.4)',
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
    name: 'Farzi Nitro Jalebi Caviar',
    tagline: 'Centuries of sweet heritage converted into crisp molecular spheres',
    category: 'Progressive Dessert',
    price: 495,
    isVeg: true,
    baseImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop',
    infusedImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
    smokeColor: 'rgba(245, 200, 110, 0.4)',
    temperature: '-196°C to +40°C Thermal Contrast',
    spiceLevel: 'Sweet Infusion',
    scienceNotes: 'Warm saffron batter dropped into liquid nitrogen droplets creating delicate crispy pearls, seated upon cold condensed milk rabri foam.',
    tastingNotes: ['Saffron Syrupy Burst', 'Velvety Cardamom Rabri', 'Pistachio Crumble', '24K Edible Foil'],
    elements: [
      { name: 'Liquid Saffron', icon: ' saffron', desc: 'Kashmiri Mongra saffron droplets', color: '#E09F27' },
      { name: 'Rabri Cloud', icon: '☁️', desc: 'Cold aerated condensed milk foam', color: '#FAF8F5' },
      { name: 'Pistachio Soil', icon: '🌰', desc: 'Roasted green pistachio crunch', color: '#6B8576' },
      { name: '24K Gold Leaf', icon: '👑', desc: 'Edible imperial gold garnish', color: '#F5C86E' },
    ]
  }
];

export const IllusionLabMixer: React.FC = () => {
  const [selectedDishIdx, setSelectedDishIdx] = useState(0);
  const [infusionLevel, setInfusionLevel] = useState(45); // 0 to 100%
  const [activeElements, setActiveElements] = useState<string[]>(['Cryo Mist', 'Applewood Smoke']);
  const [isAdded, setIsAdded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { addToCart } = useCart();

  const currentDish = LAB_DISHES[selectedDishIdx];

  // Particle smoke canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
    }[] = [];

    const particleCount = Math.floor(18 + (infusionLevel / 100) * 35);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 160,
        y: height * 0.7 + (Math.random() - 0.5) * 80,
        radius: Math.random() * 30 + 15,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -Math.random() * 1.2 - 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.003;
        p.radius += 0.2;

        if (p.alpha <= 0 || p.y < 0) {
          p.x = width * 0.5 + (Math.random() - 0.5) * 140;
          p.y = height * 0.75 + (Math.random() - 0.5) * 40;
          p.radius = Math.random() * 25 + 10;
          p.alpha = Math.random() * 0.35 + 0.15;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, currentDish.smokeColor.replace('0.4', String(p.alpha)));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [infusionLevel, currentDish]);

  const toggleElement = (elemName: string) => {
    setActiveElements((prev) =>
      prev.includes(elemName) ? prev.filter((e) => e !== elemName) : [...prev, elemName]
    );
    setInfusionLevel((prev) => Math.min(100, Math.max(15, prev + 15)));
  };

  const handleAddToCart = () => {
    const item: MenuItem = {
      id: currentDish.id,
      categoryId: 1,
      name: currentDish.name,
      slug: currentDish.name.toLowerCase().replace(/\s+/g, '-'),
      description: currentDish.scienceNotes,
      price: currentDish.price,
      imageUrl: currentDish.infusedImage,
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
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E09F27', '#D44A1E', '#FAF8F5'],
    });

    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section className="relative py-24 sm:py-32 bg-white text-[#12141A] overflow-hidden editorial-border-t editorial-border-b">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Editorial Asymmetry */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-8 editorial-border-b">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#FAF9F5] text-[#D4AF37] text-[10px] font-mono tracking-[0.3em] font-bold uppercase mb-4 shadow-sm">
              <span>✦</span>
              <span>THEATRICAL GASTRONOMY LAB</span>
              <span>✦</span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight uppercase leading-[0.92] text-black">
              THE ALCHEMY OF <br />
              <span className="text-stroke">ILLUSION</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
              Inspired by the culinary deception at Farzi: interact with the staging, drag to infuse smoke & cryo temperatures, and reveal the progressive science beneath each dish.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span>INTERACTIVE PLATTER · DRAG TO INFUSE</span>
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
                setInfusionLevel(45);
              }}
              data-cursor="TASTE"
              className={`p-4 text-left rounded-xl transition-all duration-300 border ${
                selectedDishIdx === idx
                  ? 'bg-white border-2 border-black shadow-xl ring-2 ring-black/5'
                  : 'bg-[#FAF9F5] border-black/10 hover:border-black/30'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                <span>0{idx + 1} / 03</span>
                <span className={dish.isVeg ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {dish.isVeg ? '● VEG' : '▲ NON-VEG'}
                </span>
              </div>
              <h3 className="font-serif font-black text-sm sm:text-base text-black line-clamp-1">
                {dish.name}
              </h3>
              <p className="text-[12px] text-[#D4AF37] font-mono font-bold mt-1">₹{dish.price}</p>
            </button>
          ))}
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Theatrical Visual Canvas & Platter (7 Cols - 30%+ Photography/Canvas) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-black/15 bg-black shadow-2xl group min-h-[420px] sm:min-h-[500px] flex items-center justify-center">
            {/* Split Image Wipe based on Infusion Level */}
            <div className="absolute inset-0 z-0">
              {/* Infused Plating layer */}
              <img
                src={currentDish.infusedImage}
                alt={currentDish.name}
                className="w-full h-full object-cover object-center filter contrast-105"
              />

              {/* Base Component layer clipped via drag level */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `polygon(${infusionLevel}% 0%, 100% 0%, 100% 100%, ${infusionLevel}% 100%)`,
                  transition: 'clip-path 0.1s ease-out',
                }}
              >
                <img
                  src={currentDish.baseImage}
                  alt="Raw Base"
                  className="w-full h-full object-cover object-center filter grayscale-[35%]"
                />
              </div>

              {/* Vertical Laser Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#D4AF37] shadow-[0_0_12px_#D4AF37] pointer-events-none"
                style={{
                  left: `${infusionLevel}%`,
                  transition: 'left 0.1s ease-out',
                }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center text-[8px] font-mono text-[#D4AF37] shadow-lg">
                  ↔
                </div>
              </div>
            </div>

            {/* Particle Canvas on top of images */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 pointer-events-none w-full h-full"
            />

            {/* Stage Overlays & Badges */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[9px] font-mono tracking-widest text-neutral-800 uppercase font-semibold shadow-sm">
                {currentDish.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold shadow-sm">
                {currentDish.temperature}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 z-20">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-[9px] font-mono tracking-widest text-neutral-700 uppercase font-bold shadow-md">
                Infusion: {infusionLevel}%
              </span>
            </div>
          </div>

          {/* Right: Interactive Molecular Controls & Gastronomy Specs (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-bold block mb-1">
                CULINARY SCIENCE & THEATRE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-black mb-2">
                {currentDish.name}
              </h3>
              <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                {currentDish.scienceNotes}
              </p>
            </div>

            {/* Interactive Infusion Scrubber: Drag to Mix / Infuse */}
            <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-black/10 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Drag To Infuse</span>
                </span>
                <span className="text-[#D4AF37] font-bold">{infusionLevel}% THEATRE</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={infusionLevel}
                onChange={(e) => setInfusionLevel(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                data-cursor="DRAG"
              />

              <div className="flex justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                <span>0% Raw Elements</span>
                <span>50% Spherification</span>
                <span>100% Theatrical Reveal</span>
              </div>
            </div>

            {/* Interactive Molecular Ingredients Dropper */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-700 font-bold block mb-2.5">
                Active Molecular Elements (Tap to Toggle):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentDish.elements.map((elem) => {
                  const isActive = activeElements.includes(elem.name);
                  return (
                    <button
                      key={elem.name}
                      onClick={() => toggleElement(elem.name)}
                      data-cursor="ADD"
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-black text-white border-black shadow-md'
                          : 'bg-white border-black/10 text-neutral-700 hover:text-black hover:border-black/30 shadow-sm'
                      }`}
                    >
                      <span className="text-base">{elem.icon}</span>
                      <div className="overflow-hidden">
                        <span className="font-semibold block truncate">{elem.name}</span>
                        <span className={`text-[9px] block truncate ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>{elem.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tasting Notes Pill Anthology */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-700 font-bold block mb-2">
                Sensory Profile:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentDish.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#FAF9F5] border border-black/10 text-[10px] font-mono text-neutral-800 shadow-sm"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar: Price & Order Action */}
            <div className="pt-4 editorial-border-t flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">
                  Creation Price
                </span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-[#D4AF37]">
                  ₹{currentDish.price}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                data-cursor="ORDER"
                className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-xl shadow-black/10 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-[#D4AF37] text-white hover:text-black hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Table</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                    <span>Order Creation</span>
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
