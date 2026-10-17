import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Share2, Clock, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800 text-ivory-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800/80">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-gold-400 font-serif font-black text-2xl">✦</span>
              <span className="font-display tracking-[0.25em] text-2xl font-bold text-ivory-100">
                FARZI
              </span>
            </Link>
            <p className="text-xs text-ivory-400 leading-relaxed font-light">
              An illusion of Indian heritage where time-honored spice legacies blend with the theatrics of modern molecular gastronomy and sensory mixology.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-850 flex items-center justify-center text-ivory-300 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-850 flex items-center justify-center text-ivory-300 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                aria-label="Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-gold-400 font-semibold">
              The Journey
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">
                  Culinary Philosophy & Illusions
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold-300 transition-colors">
                  Curated A La Carte Menu
                </Link>
              </li>
              <li>
                <Link to="/menu?table=T04" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-gold-400" />
                  <span>Digital Table Menu (QR)</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-300 transition-colors">
                  Editorial Image Gallery
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-gold-300 transition-colors">
                  Table Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-gold-400 font-semibold">
              Dining Hours
            </h4>
            <div className="space-y-3 text-xs text-ivory-300">
              <div>
                <p className="font-semibold text-ivory-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  Monday – Thursday
                </p>
                <p className="text-charcoal-400 text-[11px] mt-0.5">Lunch: 12:00 PM – 03:30 PM</p>
                <p className="text-charcoal-400 text-[11px]">Dinner: 07:00 PM – 11:30 PM</p>
              </div>
              <div className="pt-2 border-t border-charcoal-850">
                <p className="font-semibold text-ivory-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  Friday – Sunday
                </p>
                <p className="text-charcoal-400 text-[11px] mt-0.5">Lunch: 12:00 PM – 04:00 PM</p>
                <p className="text-charcoal-400 text-[11px]">Dinner: 07:00 PM – 12:30 AM</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-gold-400 font-semibold">
              Concierge & Location
            </h4>
            <div className="space-y-2.5 text-xs text-ivory-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Level 2, High Street Galleria, Connaught Place, New Delhi 110001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-[11px]">+91 11 4352 8888 / +91 98100 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-[11px]">concierge@farzi.demo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice Banner & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RestaurantOS Pro Engine v2.4 Active</span>
          </div>
          <div className="bg-charcoal-900 px-3.5 py-1.5 rounded-full border border-charcoal-800 text-[11px] text-ivory-400">
            Concept & Portfolio Demo • Not affiliated with the actual restaurant brand
          </div>
          <div>
            © {new Date().getFullYear()} Farzi Digital Experience. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
