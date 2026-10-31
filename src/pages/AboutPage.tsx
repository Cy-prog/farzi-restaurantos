import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Flame, Droplets, Award, ArrowRight, Compass, ShieldCheck, Heart, MapPin, Eye, Star } from 'lucide-react';
import { PageTransition } from '../components/motion/PageTransition';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { KineticMarquee } from '../components/ui/KineticMarquee';
import { Interactive3DMolecularSphere } from '../components/effects/Interactive3DMolecularSphere';

export const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.4], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);

  return (
    <PageTransition className="relative bg-[#090A0E] text-[#F4F0E8] min-h-screen overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* =========================================================================
          1. HERO HEADER WITH USER-EDITED STOREFRONT BACKGROUND & DUAL VEIL
         ========================================================================= */}
      <section ref={containerRef} className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Dynamic Background: Edited Farzi Storefront with Parallax & Dark Gold Vignette */}
        <motion.div
          style={{ y: heroImageY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <img
            src="/farzi-storefront-clean.jpg"
            alt="Farzi Café Flagship Entrance"
            className="w-full h-full object-cover filter brightness-[0.38] contrast-125 scale-105"
          />
          {/* Obsidian and Gold Lighting Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-[#090A0E]/70 to-[#090A0E]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(229,184,105,0.22)_0%,transparent_75%)]" />
          <div className="absolute inset-0 grain-overlay opacity-30" />
        </motion.div>

        {/* Ambient Floating Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Narrative Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Rotating Stamp */}
          <div className="hidden lg:flex absolute -right-8 -top-12 w-28 h-28 rounded-full border border-[#D4AF37]/30 bg-[#090A0E]/80 backdrop-blur-md items-center justify-center p-2 animate-spin-slow pointer-events-none shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[7.5px] uppercase tracking-[0.28em]">
              <path id="circlePathAboutHero" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathAboutHero" startOffset="0%">
                  FARZI CAFÉ · MODERN INDIAN BISTRO ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#E5B869] text-sm font-bold">✦</span>
          </div>

          {/* Subtitle Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#12141C]/90 backdrop-blur-md text-[#E5B869] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EST. 2014 BY ZORAWAR KALRA · MASSIVE RESTAURANTS</span>
          </motion.div>

          {/* Majestic Editorial Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase leading-[0.92] text-[#F4F0E8]"
          >
            THE ART OF <br />
            <span className="gold-text-gradient drop-shadow-[0_4px_30px_rgba(212,175,55,0.4)]">
              CULINARY ILLUSION
            </span>
          </motion.h1>

          {/* Lead Paragraph from official farzicafe.com/about */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-neutral-300 font-light max-w-3xl mx-auto leading-relaxed"
          >
            In Arabic and Urdu, <strong className="text-[#E5B869] font-semibold">Farzi</strong> translates to <em className="italic">“creating an illusion”</em>. To our culinary brigade, it is a playful illusion — what arrives at your table looks like one thing, but upon the first bite, awakens deep, familiar comfort flavours of royal Indian culinary heritage.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to="/menu">
              <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center gap-2 cursor-pointer">
                <span>Explore A La Carte Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/reservation">
              <button className="px-8 py-3.5 rounded-xl border border-white/20 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 text-xs font-mono font-bold tracking-widest uppercase text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer">
                <span>Reserve a Table</span>
              </button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          2. KINETIC GOLD MARQUEE SEPARATION
         ========================================================================= */}
      <KineticMarquee
        phrases={[
          'TRADITION REIMAGINED',
          'CREATING AN ILLUSION',
          'ZORAWAR KALRA VISION',
          '-196°C CRYO LIQUID NITROGEN',
          'REVERSE SPHERIFICATION',
          'MASSIVE RESTAURANTS',
          'GLOBAL INDIAN GASTRONOMY'
        ]}
      />

      {/* =========================================================================
          3. FOUNDER & PHILOSOPHY CHAPTER (Official copy from farzicafe.com/about)
         ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: The Zorawar Kalra Legacy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#E5B869]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
              <span>THE VISIONARY & HERITAGE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#F4F0E8] leading-[1.1]">
              Placing Modern Indian Cuisine <br />
              <span className="gold-text-gradient italic">In-Vogue on the World Stage</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Launched in 2014 by pioneering restaurateur <strong className="text-[#F4F0E8] font-semibold">Zorawar Kalra</strong> — often hailed as <em className="italic text-[#E5B869]">“The Prince of Indian Cuisine”</em> — Farzi Café was born under the banner of <strong>Massive Restaurants</strong> with a single ambitious mission: to bring Indian food in-vogue globally.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
              Deeply inspired and mentored by his father, the legendary culinary icon <strong className="text-[#F4F0E8] font-semibold">Jiggs Kalra</strong> (revered as the <em className="italic text-[#E5B869]">“Czar of Indian Cuisine”</em> and Tastemaker to the Nation), Zorawar recognized that while Indian gastronomy is among the most intricate on Earth, its perception had remained locked in nostalgic curries and heavy gravies.
            </p>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
              Farzi Café shattered that boundary by merging high-energy contemporary bistro dining with avant-garde culinary science, presenting royal Awadhi, Punjabi, Goan, and Chettinad flavours through international forms and multi-sensory table theatre.
            </p>

            {/* Accolades Badge */}
            <div className="p-5 rounded-2xl bg-[#12141C] border border-[#D4AF37]/25 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5B869] flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#F4F0E8] text-base">Global Accolades & Michelin Citations</h4>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Flagship venues across London, Dubai, New Delhi, Mumbai, Bengaluru, and the United States.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Molecular Showcase & Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/25 bg-[#12141C] shadow-2xl p-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950">
                <ImageWithFallback
                  src="/real-farzi/farzi-bar-neon.jpg"
                  alt="Farzi Cafe #FarziAfied Neon Bar"
                  className="w-full h-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-transparent pointer-events-none" />
                
                {/* Embedded 3D Molecular Simulation Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-60">
                  <Interactive3DMolecularSphere />
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090A0E]/80 backdrop-blur-md border border-white/10 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5B869] font-bold">
                      ✦ SENSORY GASTRONOMY LAB
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">ACTIVE R&D</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light">
                    Every recipe balances micro-calibrated spice tinctures, sub-zero flash-freezing, and edible architecture.
                  </p>
                </div>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#161922] border border-[#D4AF37]/30 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#E5B869] text-xs font-mono font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>The Illusion Defined</span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                “What you see is not what you eat; what you taste is what you will remember forever.”
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE 4 PILLARS OF FARZI MOLECULAR SCIENCE (Detailed technical breakdown)
         ========================================================================= */}
      <section className="py-20 bg-[#0C0E14] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.28em] text-[#E5B869] font-semibold">
              MOLECULAR APPARATUS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black uppercase text-[#F4F0E8] mt-3">
              The 4 Pillars of the Farzi Lab
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-3 font-light leading-relaxed">
              Deconstructing authentic regional spice formulas and reconstructing them through precision chemistry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Droplets className="w-6 h-6 text-[#68B0FF]" />,
                pill: 'BIO-CHEMISTRY',
                title: 'Reverse Spherification',
                description: 'Creating fragile sodium alginate membranes that enclose concentrated chutneys, yoghurt, and juices that gently burst on the tongue.',
                dishExample: 'Mishti Doi & Mango Pearls'
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#E5B869]" />,
                pill: 'CRYO -196°C',
                title: 'Liquid Nitrogen Theatre',
                description: 'Flash-freezing cardamom creams, saffron snow, and cocktail foams tableside in billowing clouds of aromatic sub-zero vapour.',
                dishExample: 'Nitrogen Apple Foamintini'
              },
              {
                icon: <Flame className="w-6 h-6 text-orange-400" />,
                pill: 'AROMATICS',
                title: 'Applewood Smoke Jars',
                description: 'Capturing hand-blown cloches filled with hickory, cinnamon, and sandalwood smoke to perfume proteins and kebabs at the instant of uncorking.',
                dishExample: 'Smoked Galouti Bell Jar'
              },
              {
                icon: <Eye className="w-6 h-6 text-emerald-400" />,
                pill: 'OPTICAL TRICKERY',
                title: 'Deconstructed Classics',
                description: 'Presenting comforting household Indian staples in unexpected international avatars without compromising the integrity of spices.',
                dishExample: 'Dal Chawal Arancini'
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-[#12141C] border border-white/10 hover:border-[#D4AF37]/50 p-6 rounded-2xl flex flex-col justify-between shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {pillar.icon}
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-2 py-0.5 rounded-full bg-white/5">
                      {pillar.pill}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#F4F0E8] mb-2 group-hover:text-[#E5B869] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Signature Avatar:</span>
                  <span className="text-xs font-serif italic text-[#E5B869] font-medium">{pillar.dishExample}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. AUTHENTIC FARZI MOMENTS MOSAIC (Featuring Real Farzi Cafe Photos)
         ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#E5B869] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869]" />
              <span>THE BISTRO ATMOSPHERE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#F4F0E8] tracking-tight">
              Life Inside Farzi Café
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mt-4 md:mt-0 leading-relaxed">
            High-energy bistro dining where bespoke mixology, neon glow, live acoustic sets, and theatrical service intersect.
          </p>
        </div>

        {/* 6-Photo Curated Grid from User Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              src: '/real-farzi/farzi-arancini-real.jpg',
              title: 'Signature Arancini Spheres',
              sub: 'Pappadum crust & curry foam'
            },
            {
              src: '/real-farzi/farzi-outdoor-terrace.jpg',
              title: 'Lush Botanical Terrace',
              sub: 'Alfresco dining amid palms'
            },
            {
              src: '/real-farzi/farzi-paneer-tuile.jpg',
              title: 'Tandoor Smoked Paneer Tikka',
              sub: 'Coriander emulsion & tuile'
            },
            {
              src: '/real-farzi/farzi-prawns-curry.jpg',
              title: 'Coastal Prawns & Rice Pillow',
              sub: 'Deconstructed coconut velouté'
            },
            {
              src: '/real-farzi/farzi-vada-spheres.jpg',
              title: 'Deconstructed Vada Pav Caviar',
              sub: 'Crispy sev & mint sphere'
            },
            {
              src: '/farzi-storefront-clean.jpg',
              title: 'The Flagship Façade',
              sub: 'Ornate backlit bistro entrance'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#12141C] shadow-xl"
            >
              <ImageWithFallback
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <h4 className="font-serif font-bold text-base text-[#F4F0E8] group-hover:text-[#E5B869] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. REVERSE KINETIC MARQUEE
         ========================================================================= */}
      <KineticMarquee
        reverse={true}
        outline={true}
        phrases={[
          'DELHI CYBER HUB',
          'MUMBAI BKC',
          'LONDON HAYMARKET',
          'DUBAI CITY WALK',
          'BENGALURU UB CITY',
          'HYDERABAD JUBILEE HILLS'
        ]}
      />

      {/* =========================================================================
          7. INVITATION & TABLE RESERVATION DESK
         ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#12141C] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          {/* Subtle gold backdrop glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#E5B869] font-bold">
              ✦ RESERVATIONS & TASTING SESSIONS
            </span>

            <h3 className="text-3xl sm:text-5xl font-display font-black uppercase text-[#F4F0E8] leading-tight">
              Ready to Experience <br />
              <span className="gold-text-gradient">The Culinary Illusion?</span>
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-light leading-relaxed">
              Tables for our evening cloche services and molecular tasting menus fill rapidly across all flagship hubs. Reserve your table or explore our a la carte offerings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/reservation">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer">
                  Book Table Reservation
                </button>
              </Link>
              <Link to="/menu">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 text-xs font-mono font-bold tracking-widest uppercase text-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5B869]" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </PageTransition>
  );
};

export default AboutPage;
