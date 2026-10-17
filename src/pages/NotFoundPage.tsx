import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center p-6 text-center text-ivory-100">
      <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
        404 — Illusion Broken
      </span>
      <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-sm text-ivory-300 max-w-md mx-auto mb-8 font-light">
        The culinary page you are searching for does not exist or has been shifted in our laboratory.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/">
          <Button variant="gold" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
        <Link to="/menu">
          <Button variant="outline" size="md">
            Explore Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};
