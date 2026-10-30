import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CulinaryManifestoSection: React.FC = () => (
  <section className="bg-[#efe9dc] px-4 py-20 text-[#202019] sm:px-8 sm:py-28 lg:px-12">
    <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-12 md:gap-16">
      <div className="md:col-span-7">
        <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#a74326]">A seat at our table</p>
        <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Come curious.<br /><span className="italic text-[#a74326]">Leave with a story.</span></h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#626057] sm:text-lg sm:leading-8">Farzi is where familiar Indian flavours find a new expression. Gather your people, take your time, and let the evening surprise you.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/reservation" className="inline-flex min-h-12 items-center gap-6 bg-[#a74326] px-5 text-sm text-white transition hover:bg-[#84331d]">Make a reservation <ArrowUpRight size={16} /></Link>
          <Link to="/about" className="inline-flex min-h-12 items-center border border-[#202019]/30 px-5 text-sm transition hover:border-[#202019]">Our story</Link>
        </div>
      </div>
      <div className="relative min-h-[340px] overflow-hidden bg-[#312b22] md:col-span-5 md:min-h-[500px]">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=85&w=1200&auto=format&fit=crop" alt="Warmly lit dining room ready for guests" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <p className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.2em] text-white sm:bottom-7 sm:left-7">An evening at Farzi Café</p>
      </div>
    </div>
  </section>
);
