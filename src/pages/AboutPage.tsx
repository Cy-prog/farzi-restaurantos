import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Flame, Award, Heart, ArrowRight } from 'lucide-react';
import { PageTransition } from '../components/motion/PageTransition';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { KineticMarquee } from '../components/ui/KineticMarquee';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition className="pt-28 pb-24 bg-[#FAF9F5] text-[#12141A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative text-center max-w-3xl mx-auto mb-16">
          <div className="hidden lg:flex absolute -right-16 -top-4 w-24 h-24 rounded-full border border-black/15 bg-white/80 items-center justify-center p-1.5 animate-spin-slow pointer-events-none shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-black font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathAbout" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathAbout" startOffset="0%">
                  FARZI CAFÉ · MOLECULAR GASTRONOMY ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#D4AF37] text-xs font-bold">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>THE CULINARY MANIFESTO · EST. BY ZORAWAR KALRA</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-black tracking-tight uppercase mb-6 leading-[0.92]">
            THE ARCHITECTURE OF <br />
            <span className="text-stroke">CULINARY ILLUSION</span>
          </h1>

          <p className="text-xs sm:text-base text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Born out of a relentless ambition to place modern Indian cuisine on the global high-gastronomy map, Farzi merges centuries of royal heritage with avant-garde scientific wizardry.
          </p>
        </div>

        {/* Narrative & Visual Spread (30%+ Visuals) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black">
              A Tribute to Nostalgia Through the Prism of Molecular Science
            </h2>
            <p>
              In Arabic, <strong className="text-[#D4AF37] font-bold">Farzi</strong> translates to an illusion or mimicry. To our culinary brigade, it represents a sacred pact: what arrives on your plate is a visual riddle, but upon the very first bite, a surge of authentic Indian warmth washes over your palate.
            </p>
            <p>
              Our chefs spend months in trial balance, deconstructing centuries-old recipes from Lucknow, Punjab, Goa, and Chettinad, then re-engineering them through vacuum chambers, liquid nitrogen baths, and reverse-spherification baths without diluting a single pinch of soul.
            </p>
            <div className="p-4 rounded-xl bg-white border border-black/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-black/10 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-black text-black text-sm">Culinary Innovation Honors</h4>
                <p className="text-[11px] text-neutral-500 font-normal">Pioneers of modern molecular bistro dining across capitals</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden border border-black/15 shadow-2xl bg-black">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                alt="Farzi restaurant interior"
                className="w-full h-[440px] object-cover filter contrast-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white border border-black/10 p-5 rounded-2xl shadow-2xl max-w-xs hidden sm:block backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                ✦ Molecular Precision
              </span>
              <p className="text-[11px] text-neutral-700 mt-1 font-normal">
                18+ hand-crushed spices, thermal circulators, and smoke infusions for every single service.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Marquee Break */}
      <KineticMarquee
        speed="fast"
        outline={true}
        phrases={[
          'REVERSE SPHERIFICATION',
          'CRYO LIQUID NITROGEN (-196°C)',
          'APPLEWOOD SMOKED BELL JARS',
          'VACUUM CHAMBER REDUCTIONS',
          'PROGRESSIVE BISTRO CULTURE'
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* 4 Pillars of Farzi Science */}
        <div className="py-12 border-t border-black/10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              TECHNICAL PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-black mt-2">
              Techniques from the Laboratory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
                title: 'Reverse Spherification',
                description: 'Creating delicate calcium alginate spheres enclosing cold spice infusions that burst gently on the tongue.'
              },
              {
                icon: <Flame className="w-5 h-5 text-orange-500" />,
                title: 'Charcoal Smoked Jars',
                description: 'Capturing oakwood and cinnamon smoke beneath glass bell jars to perfume proteins at the split second of uncorking.'
              },
              {
                icon: <Compass className="w-5 h-5 text-[#D4AF37]" />,
                title: 'Cryogenic Textures (-196°C)',
                description: 'Liquid nitrogen flash-freezing to craft delicate rabdi foams, cardamom snow, and freeze-dried citrus crisps.'
              },
              {
                icon: <Heart className="w-5 h-5 text-rose-500" />,
                title: 'Heritage Extraction',
                description: 'Slow-reducing bone broths, hand-pressed mustard oils, and Awadhi spice tinctures over 24-hour cycles.'
              }
            ].map((pillar, i) => (
              <div
                key={i}
                className="bg-white border border-black/10 p-6 rounded-2xl h-full flex flex-col justify-between hover:border-black/30 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] flex items-center justify-center mb-4 border border-black/10">
                    {pillar.icon}
                  </div>
                  <h3 className="font-serif font-black text-base text-black mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-white border border-black/10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-black">
            Experience the Illusion In Person
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-normal leading-relaxed">
            Chambers fill quickly for evening dining and private tastings. Reserve your culinary journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/reservation">
              <button className="px-8 py-3.5 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10">
                Book Table Reservation
              </button>
            </Link>
            <Link to="/menu">
              <button className="px-7 py-3.5 rounded-xl border border-black/20 hover:border-black text-xs font-mono tracking-widest uppercase text-black bg-white hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm">
                <span>Explore Menu</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
