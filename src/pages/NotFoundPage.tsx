import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center text-[#12141A]">
      <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-black/15 flex items-center justify-center text-[#D4AF37] mb-6 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
        404 — Illusion Broken
      </span>
      <h1 className="text-4xl sm:text-6xl font-serif font-black text-black mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-600 max-w-md mx-auto mb-8 font-light">
        The culinary page you are searching for does not exist or has been shifted in our laboratory.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/" className="px-6 py-3 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link to="/menu" className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 text-black border border-black/15 font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
          Explore Menu
        </Link>
      </div>
    </div>
  );
};
