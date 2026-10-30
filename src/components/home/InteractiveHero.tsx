import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const heroImage = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=2200&auto=format&fit=crop';

export const InteractiveHero: React.FC = () => {
  const { tableNumber } = useCart();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-[#f4f1e9] px-4 pb-5 pt-28 text-[#202019] sm:px-8 sm:pt-32 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex items-center justify-between border-b border-[#202019]/20 pb-3 text-[10px] font-medium uppercase tracking-[0.22em] sm:mb-10 sm:text-xs">
            <motion.span initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Progressive Indian dining</motion.span>
          <span className="hidden sm:inline">New Delhi · Est. 2014</span>
          <Link className="group inline-flex items-center gap-1 hover:text-[#a74326]" to="/reservation">
            Find a table <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="grid items-end gap-8 pb-8 md:grid-cols-12 md:gap-10 md:pb-10">
          <motion.div className="md:col-span-8" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#a74326] sm:mb-5">A little familiar. A little unexpected.</p>
            <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,10vw,9.5rem)] font-medium leading-[0.82] tracking-[-0.065em]">
              Indian at heart.<br />
              <span className="italic text-[#a74326]">Farzi by nature.</span>
            </h1>
          </motion.div>
          <motion.div className="md:col-span-4 md:pb-1 md:pl-6" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <p className="max-w-sm text-base leading-7 text-[#55544b] sm:text-lg sm:leading-8">
              The flavours you grew up with, seen through a different lens. Come for the classics; stay for the unexpected.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/menu" className="inline-flex min-h-12 items-center gap-5 bg-[#a74326] px-5 text-sm font-medium text-white transition hover:bg-[#84331d]">
                Explore the menu <ArrowUpRight size={16} />
              </Link>
              <Link to={`/menu?table=${tableNumber || 'T04'}`} className="inline-flex min-h-12 items-center border border-[#202019]/30 px-5 text-sm transition hover:border-[#202019]">
                Order at your table
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15 }} className="group relative h-[56vh] min-h-[390px] max-h-[760px] overflow-hidden bg-[#312b22] sm:h-[66vh]">
          <motion.img src={heroImage} alt="A beautifully plated modern Indian dining experience at Farzi Café" className="h-full w-full object-cover object-center" animate={reduceMotion ? undefined : { scale: [1.04, 1] }} transition={{ duration: 1.8, ease: 'easeOut' }} whileHover={reduceMotion ? undefined : { scale: 1.035 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          <div className="absolute bottom-5 left-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/75 sm:text-xs">The Farzi experience</p>
              <p className="max-w-md font-serif text-2xl leading-tight sm:text-4xl">Tradition, with a twist worth tasting.</p>
            </div>
            <a href="#discover" aria-label="Scroll to discover" className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/60 transition hover:bg-white hover:text-[#202019] sm:flex">
              <ArrowDownRight size={20} />
            </a>
          </div>
          <motion.div aria-hidden="true" className="absolute right-6 top-6 hidden h-24 w-24 items-center justify-center rounded-full border border-[#e3b45d]/80 bg-[#211b16]/45 text-center text-[9px] uppercase leading-4 tracking-[0.18em] text-[#f3d69f] backdrop-blur-sm md:flex" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
            Spice · Story · Surprise <span className="absolute text-lg text-[#e3b45d]">✦</span>
          </motion.div>
          <div aria-hidden="true" className="farzi-ember absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#bd542d]/30 blur-3xl" />
        </motion.div>

        <div id="discover" className="flex items-center justify-between py-4 text-[10px] uppercase tracking-[0.2em] text-[#66645c] sm:py-5 sm:text-xs">
          <span>Old recipes, new perspectives</span>
          <span>01 — 03</span>
        </div>
      </div>
    </section>
  );
};
