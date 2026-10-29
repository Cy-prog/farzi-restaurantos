import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, QrCode, Phone, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FarziIntro } from '../ui/FarziIntro';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const location = useLocation();
  const { totalCount, setIsCartOpen, tableNumber, total } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const leftNavLinks = [
    { name: 'MENU', path: '/menu' },
    { name: 'PHILOSOPHY', path: '/about' },
    { name: 'GALLERY', path: '/gallery' },
  ];

  const secondaryNavLinks = [
    { name: 'TABLE QR ORDERING', path: `/menu?table=${tableNumber || 'T04'}` },
    { name: 'RESERVE A CHAMBER', path: '/reservation' },
    { name: 'CONCIERGE & CONTACT', path: '/contact' },
    { name: 'ADMIN OPERATIONS OS', path: '/admin/login' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) return location.search.includes('table=');
    return location.pathname === path;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.removeItem('farzi_intro_shown_v2');
    if (location.pathname === '/') {
      setShowIntroModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
      {showIntroModal && (
        <FarziIntro
          forcePlay={true}
          onComplete={() => setShowIntroModal(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F5]/95 backdrop-blur-xl border-b border-black/10 py-3 shadow-md'
            : 'bg-[#FAF9F5]/85 backdrop-blur-md border-b border-black/5 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* 1. LEFT NAV: MENU | PHILOSOPHY | GALLERY */}
            <nav className="hidden md:flex items-center space-x-7">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  data-cursor="NAV"
                  className={`text-xs tracking-[0.24em] font-mono uppercase transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-[#D4AF37] font-bold'
                      : 'text-neutral-700 hover:text-black font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to={`/menu?table=${tableNumber || 'T04'}`}
                data-cursor="QR"
                className="text-[11px] tracking-widest font-mono uppercase text-[#D4AF37] hover:text-[#B87E14] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Menu</span>
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-black hover:text-[#D4AF37]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* 2. CENTER: Farzi Circular Emblem */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleLogoClick}
                data-cursor="FARZI"
                className="flex items-center gap-3 group focus:outline-none"
                aria-label="Farzi Café - Return home or reload intro"
              >
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black border border-black/10 group-hover:border-[#D4AF37] p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md">
                  <img
                    src="/farzi-logo.svg"
                    alt="Farzi Seal"
                    className="w-full h-full object-contain filter invert drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                  />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-display font-black text-sm tracking-[0.25em] uppercase text-black group-hover:text-[#D4AF37] transition-colors">
                    FARZI CAFÉ
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-neutral-500">
                    MODERN INDIAN BISTRO
                  </span>
                </div>
              </button>
            </div>

            {/* 3. RIGHT ACTIONS: Reserve | Cart Bag Trigger */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                to="/reservation"
                data-cursor="RESERVE"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest text-black border border-black/20 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <span>Reserve</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                data-cursor="CART"
                className="relative px-3.5 py-2 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black flex items-center gap-2.5 transition-all shadow-md active:scale-95"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:text-black" />
                <span className="hidden sm:inline text-xs font-mono font-bold">
                  {totalCount > 0 ? `₹${total}` : 'CART'}
                </span>
                {totalCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-mono font-bold text-[10px] flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-30 bg-[#FAF9F5] text-[#12141A] pt-24 px-6 flex flex-col justify-between pb-8 md:hidden overflow-y-auto"
          >
            <div className="space-y-6 pt-4">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-bold">
                [ NAVIGATION ANTHOLOGY ]
              </div>

              <div className="space-y-4">
                {[...leftNavLinks, ...secondaryNavLinks].map((link, idx) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-xl font-display font-black tracking-wider uppercase border-b border-black/10 hover:text-[#D4AF37] transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs font-mono text-neutral-400">[0{idx + 1}]</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-black/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
                <span>STATION: {tableNumber || 'TABLE T04'}</span>
                <span className="text-[#D4AF37] font-bold">SERVICE ACTIVE</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-center">
                Farzi Café · Creating An Illusion
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
