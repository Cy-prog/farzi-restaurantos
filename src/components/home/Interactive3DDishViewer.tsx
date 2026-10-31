import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Eye, Plus, Check, Compass, Layers, Wind, Droplets } from 'lucide-react';
import { Card3DTilt } from '../3d/Card3DTilt';
import { useCart } from '../../context/CartContext';
import { MenuItem } from '../../types';

interface InteractiveDishItem {
  id: number;
  name: string;
  hindiName: string;
  subtitle: string;
  price: number;
  imageUrl: string;
  temperature: string;
  illusionConcept: string;
  layers: { name: string; desc: string; depth: string }[];
  isVeg: boolean;
}

const LAB_DISHES: InteractiveDishItem[] = [
  {
    id: 1,
    name: 'Dal Chawal Arancini',
    hindiName: 'दाल चावल अरांकिनी',
    subtitle: 'Lentil & Arborio Rice Spheres',
    price: 495,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
    temperature: '180°C CRISP',
    illusionConcept: 'Iconic yellow moong daal & aged basmati reconstructed into golden Sicilian risotto balls.',
    layers: [
      { name: 'Core Layer', desc: 'Slow-simmered yellow lentil & arborio rice farce with cumin ghee', depth: 'Z-0' },
      { name: 'Crisp Crust', desc: 'Hand-rolled dehydrated papad tuile crumbs with crushed ajwain', depth: 'Z-10' },
      { name: 'Molecular Crown', desc: 'Spherified tomato punch sphere & chilled mint emulsion', depth: 'Z-20' },
    ],
    isVeg: true,
  },
  {
    id: 3,
    name: 'Smoked Butter Chicken Bao',
    hindiName: 'बटर चिकन बाओ',
    subtitle: 'Tandoori Pulled Chicken in Lotus Bun',
    price: 595,
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1200&auto=format&fit=crop',
    temperature: '65°C STEAMED',
    illusionConcept: 'Clay-oven tandoori chicken folded into pillowy steamed bao with kasuri fenugreek foam.',
    layers: [
      { name: 'Outer Pillow', desc: 'Steamed open-faced lotus bao dough with sweet rice flour glaze', depth: 'Z-0' },
      { name: 'Smoked Filling', desc: 'Pulled chicken tikka simmered in San Marzano velvet makhani silk', depth: 'Z-10' },
      { name: 'Aroma Veil', desc: 'Nitrogen-whipped kasuri fenugreek foam & pickled shallot pearls', depth: 'Z-20' },
    ],
    isVeg: false,
  },
  {
    id: 2,
    name: 'Deconstructed Pani Puri Sphere',
    hindiName: 'पानी पूरी स्फीयर',
    subtitle: 'Molecular Alginate Broth Spheres',
    price: 445,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    temperature: '3.8°C CHILLED',
    illusionConcept: 'Zero shell. Spiced mint water held together by a calcium-alginate translucent skin.',
    layers: [
      { name: 'Base Nest', desc: 'Crispy dehydrated semolina sev crisps and sweet date-tamarind dust', depth: 'Z-0' },
      { name: 'Liquid Core', desc: 'Himalayan black salt, raw mango, and fresh mint infusion', depth: 'Z-10' },
      { name: 'Surface Tension', desc: '0.12mm sodium alginate calcium membrane holding 25ml broth', depth: 'Z-20' },
    ],
    isVeg: true,
  },
  {
    id: 11,
    name: 'Rasmalai Tres Leches',
    hindiName: 'रसमलाई त्रेस लेचेस',
    subtitle: 'Saffron Genoise & Iranian Pistachio',
    price: 495,
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop',
    temperature: '4°C CHILLED',
    illusionConcept: 'Latin American milk sponge cake infused with royal Bengali saffron rabdi cream.',
    layers: [
      { name: 'Sponge Base', desc: 'Cardamom-infused genoise sponge pierced for deep milk soaking', depth: 'Z-0' },
      { name: 'Three Milks', desc: 'Evaporated milk, condensed milk, and saffron chenna reduction', depth: 'Z-10' },
      { name: 'Crown Wafer', desc: 'Caramelized milk wafer, Iranian pistachio dust, and gold leaf', depth: 'Z-20' },
    ],
    isVeg: true,
  },
];

export const Interactive3DDishViewer: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showCryoSmoke, setShowCryoSmoke] = useState(true);
  const [showDeconstructedLayers, setShowDeconstructedLayers] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();
  const current = LAB_DISHES[selectedIdx];

  const handleAddToCart = () => {
    // Construct fake MenuItem
    const mockItem: MenuItem = {
      id: current.id,
      name: current.name,
      slug: current.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: 1,
      categoryName: 'Lab Special',
      description: current.illusionConcept,
      price: current.price,
      imageUrl: current.imageUrl,
      spiceLevel: 'MILD',
      isVeg: current.isVeg,
      isAvailable: true,
      isChefSpecial: true,
      isRecommended: true,
      isPopular: true,
      displayOrder: current.id,
    };
    addToCart(mockItem, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <section className="py-24 bg-[#0A0B0E] text-[#F3EFE6] relative overflow-hidden border-t border-b border-[#1E222D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#1E222D]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-[0.25em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D Tasting Laboratory</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-black uppercase tracking-tight text-white">
              DECONSTRUCT <span className="gold-gradient-text italic font-normal">IN 3D</span>
            </h2>
          </div>

          {/* Dish Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LAB_DISHES.map((dish, i) => (
              <button
                key={dish.id}
                onClick={() => setSelectedIdx(i)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                  selectedIdx === i
                    ? 'bg-[#D4AF37] text-[#0A0B0E] font-bold shadow-lg shadow-[#D4AF37]/20 scale-105'
                    : 'bg-[#12141A] text-neutral-400 hover:text-white border border-[#1E222D]'
                }`}
              >
                {dish.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Canvas: 3D Tilt Card with Glare and Layer Pop (7 cols) */}
          <div className="lg:col-span-7">
            <Card3DTilt
              maxTilt={16}
              scaleOnHover={1.03}
              className="rounded-3xl border border-[#D4AF37]/30 bg-[#12141A] shadow-2xl p-4 sm:p-6"
            >
              <div className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden bg-black">
                {/* Main Food Photo */}
                <motion.img
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={current.imageUrl}
                  alt={current.name}
                  className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.9]"
                />

                {/* Simulated Cryogenic Vapor Smoke Overlay */}
                {showCryoSmoke && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.35, 0.6, 0.4] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-radial-gradient from-white/20 via-white/5 to-transparent pointer-events-none mix-blend-screen"
                    style={{
                      filter: 'blur(20px)',
                      transform: 'translateY(15%)',
                    }}
                  />
                )}

                {/* Vignette Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

                {/* Floating 3D Badge (Popped forward in Z) */}
                <div
                  style={{ transform: 'translateZ(40px)' }}
                  className="absolute top-4 left-4 flex items-center gap-2"
                >
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-widest text-[#D4AF37] bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 uppercase shadow-lg">
                    {current.temperature}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    current.isVeg ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}>
                    {current.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                {/* Hindi Name Watermark */}
                <div
                  style={{ transform: 'translateZ(25px)' }}
                  className="absolute bottom-6 right-6 text-right pointer-events-none"
                >
                  <span className="font-serif text-3xl sm:text-4xl text-white/20 font-bold block">
                    {current.hindiName}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37] tracking-[0.3em] uppercase block">
                    {current.subtitle}
                  </span>
                </div>

                {/* 3D Tilt Instruction Helper */}
                <div
                  style={{ transform: 'translateZ(30px)' }}
                  className="absolute bottom-6 left-6 pointer-events-none"
                >
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700">
                    ✦ Hover to Tilt in 3D Space
                  </span>
                </div>
              </div>

              {/* Interactive Controls Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E222D]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCryoSmoke(!showCryoSmoke)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                      showCryoSmoke
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                        : 'bg-[#1E222D] text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Cryo Vapor: {showCryoSmoke ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setShowDeconstructedLayers(!showDeconstructedLayers)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                      showDeconstructedLayers
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-[#1E222D] text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Deconstruct: {showDeconstructedLayers ? 'EXPANDED' : 'COLLAPSED'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif font-black text-xl text-[#D4AF37]">
                    ₹{current.price}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold text-xs tracking-wider uppercase transition-all ${
                      isAdded
                        ? 'bg-emerald-500 text-[#0A0B0E] scale-105'
                        : 'bg-[#D4AF37] hover:bg-[#e5c358] text-[#0A0B0E] shadow-md shadow-[#D4AF37]/20'
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAdded ? 'Added to Order!' : 'Add to Order'}</span>
                  </button>
                </div>
              </div>
            </Card3DTilt>
          </div>

          {/* Right Column: Deconstructed 3D Structural Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
                MOLECULAR BLUEPRINT [0{selectedIdx + 1}]
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {current.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light mt-2 leading-relaxed">
                {current.illusionConcept}
              </p>
            </div>

            {/* Deconstructed Layers */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                3D Anatomical Layers
              </span>
              {current.layers.map((layer, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    x: showDeconstructedLayers ? idx * 10 : 0,
                    scale: showDeconstructedLayers ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    showDeconstructedLayers
                      ? 'bg-[#171922] border-[#D4AF37]/40 shadow-xl'
                      : 'bg-[#12141A] border-[#1E222D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-white">
                      {layer.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#0A0B0E] px-2 py-0.5 rounded border border-[#D4AF37]/20">
                      {layer.depth}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {layer.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Table Ordering Assurance */}
            <div className="p-4 rounded-2xl bg-[#12141A] border border-[#1E222D] flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span className="text-[#D4AF37]">✦ Direct Kitchen Transmission</span>
              <span>Available for Table Ordering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interactive3DDishViewer;
