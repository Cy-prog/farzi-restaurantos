import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Flame, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/motion/FadeIn';
import { PageTransition } from '../components/motion/PageTransition';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition className="pt-28 pb-24 bg-charcoal-950 text-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>The Farzi Narrative</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 tracking-tight mb-6">
            The Architecture of Culinary Illusion
          </h1>
          <p className="text-sm sm:text-lg text-ivory-300 font-light max-w-2xl mx-auto leading-relaxed">
            Born out of a relentless ambition to place modern Indian cuisine on the global high-gastronomy map, Farzi merges centuries of royal heritage with avant-garde scientific wizardry.
          </p>
        </div>

        {/* Narrative & Visual Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <FadeIn direction="left">
            <div className="space-y-6 text-sm sm:text-base text-ivory-300 font-light leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
                A Tribute to Nostalgia Through the Prism of Molecular Science
              </h2>
              <p>
                In Arabic, <strong className="text-gold-300 font-semibold">Farzi</strong> translates to an illusion or mimicry. To our culinary brigade, it represents a sacred pact: what arrives on your plate is a visual riddle, but upon the very first bite, a surge of authentic Indian warmth washes over your palate.
              </p>
              <p>
                Our chefs spend months in trial balance, deconstructing centuries-old recipes from Lucknow, Punjab, Goa, and Chettinad, then re-engineering them through vacuum chambers, liquid nitrogen baths, and reverse-spherification baths without diluting a single pinch of soul.
              </p>
              <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-ivory-100 text-sm">Culinary Innovation Honors</h4>
                  <p className="text-xs text-charcoal-400">Pioneers of modern molecular dining in India and international capitals</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                  alt="Farzi restaurant interior"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-charcoal-950 border border-gold-500/30 p-6 rounded-2xl shadow-2xl max-w-xs hidden sm:block backdrop-blur-md">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  Molecular Precision
                </span>
                <p className="text-xs text-ivory-200 mt-1">
                  18+ hand-crushed spices, thermal circulators, and smoke infusions for every service.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 4 Pillars of Farzi Science */}
        <div className="py-16 border-t border-charcoal-800">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              Technical Pillars
            </span>
            <h2 className="text-3xl font-serif font-bold text-ivory-100 mt-2">
              Techniques from the Culinary Laboratory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-gold-400" />,
                title: 'Reverse Spherification',
                description: 'Creating delicate calcium alginate spheres enclosing cold spice infusions that burst gently on the tongue.'
              },
              {
                icon: <Flame className="w-6 h-6 text-orange-400" />,
                title: 'Charcoal & Wood Smoked Jars',
                description: 'Capturing oakwood and cinnamon smoke beneath glass bell jars to perfume proteins at the split second of uncorking.'
              },
              {
                icon: <Compass className="w-6 h-6 text-copper-400" />,
                title: 'Cryogenic Textures (-196°C)',
                description: 'Liquid nitrogen flash-freezing to craft delicate rabdi foams, cardamom snow, and freeze-dried citrus crisps.'
              },
              {
                icon: <Heart className="w-6 h-6 text-rose-400" />,
                title: 'Heritage Extraction',
                description: 'Slow-reducing bone broths, hand-pressed mustard oils, and Awadhi spice tinctures over 24-hour cycles.'
              }
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-charcoal-900/80 border border-charcoal-800 p-6 rounded-2xl h-full flex flex-col justify-between hover:border-gold-500/30 transition-colors">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-charcoal-950 flex items-center justify-center mb-4 border border-charcoal-800">
                      {pillar.icon}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-ivory-100 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-ivory-400 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-gold-500/20 text-center">
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-ivory-50 mb-4">
            Experience the Illusion In Person
          </h3>
          <p className="text-xs sm:text-sm text-ivory-300 max-w-lg mx-auto mb-8 font-light">
            Tables fill quickly for evening dining and private tastings. Reserve your culinary journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reservation">
              <Button variant="gold" size="lg">
                Book Table Reservation
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
