import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Share2, Clock, QrCode, ArrowUpRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#060709] border-t border-[#D4AF37]/15 text-neutral-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#161922] border border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-lg">
                <img src="/farzi-logo.svg" alt="Farzi Logo" className="w-full h-full object-contain filter invert" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.2em] text-lg font-bold text-white uppercase">
                  FARZI <span className="text-[#D4AF37]">CAFÉ</span>
                </span>
                <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase">
                  CONTEMPORARY INDIAN BISTRO
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              An illusion of Indian culinary heritage where time-honored spice legacies blend with the theatrics of modern molecular gastronomy and sensory mixology.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.farzicafe.com/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors shadow-sm"
                aria-label="Official Farzi Cafe Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              The Journey
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('farzi_intro_shown_v3');
                    window.location.href = '/?intro=true';
                  }}
                  className="hover:text-[#D4AF37] font-medium transition-colors flex items-center gap-1.5 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Theatrical Cinematic Intro</span>
                </button>
              </li>
              <li>
                <Link to="/about" className="hover:text-white font-medium transition-colors">
                  Culinary Philosophy & Story
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white font-medium transition-colors">
                  A La Carte Menu
                </Link>
              </li>
              <li>
                <Link to="/menu?table=T-12" className="hover:text-[#D4AF37] font-semibold transition-colors flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Digital Table Menu (T-12)</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white font-medium transition-colors">
                  Visual Archive & Chambers
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-white font-medium transition-colors">
                  Table Reservations Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Timings & Service */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              Dining Service Hours
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-neutral-500">Lunch Service:</span>
                <span className="font-mono text-white font-semibold">12:00 PM – 3:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-neutral-500">Mixology Chamber:</span>
                <span className="font-mono text-white font-semibold">5:00 PM – 12:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-neutral-500">Dinner Service:</span>
                <span className="font-mono text-white font-semibold">7:00 PM – 11:30 PM</span>
              </li>
              <li className="pt-1 text-[11px] text-[#D4AF37] font-bold flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Open 7 Days · Valet Parking Available</span>
              </li>
            </ul>
          </div>

          {/* Enclave Contact & Staff OS */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              Operations & Contact
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Cyber Hub, Gurugram / Connaught Place, New Delhi</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+91 11 4352 8888</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>concierge@farzicafe.demo</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:text-black text-[10px] font-mono font-bold transition-all shadow-md"
                >
                  <span>Restaurant Operations OS</span>
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37] group-hover:text-black" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          <p>© 2026 FARZI CAFÉ · RESTAURANTOS · CONTEMPORARY INDIAN BISTRO</p>
          <p>TRADITION REIMAGINED</p>
        </div>

      </div>
    </footer>
  );
};
