import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount, setIsCartOpen, tableNumber } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Menu', href: '/menu', targetId: 'menu-section' },
    { name: 'Story', href: '/about', targetId: 'story-section' },
    { name: 'Locations', href: '/#locations', targetId: 'locations-section' },
    { name: 'Reserve', href: '/reservation', targetId: 'reserve-section' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; targetId: string }) => {
    if (location.pathname === '/' && link.targetId) {
      const el = document.getElementById(link.targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-[#090A0E]/85 backdrop-blur-xl border-b border-[#D4AF37]/15 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)]'
            : 'bg-transparent border-b border-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* 1. BRAND LOGO: FARZI CAFÉ (Classic Gold Serif as in design board) */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Farzi Café - Home"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#161922]/80 backdrop-blur-md border border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-lg group-hover:border-[#D4AF37] transition-all group-hover:scale-105">
                  <img
                    src="/farzi-logo.svg"
                    alt="Farzi"
                    className="w-full h-full object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif tracking-[0.2em] text-lg sm:text-xl font-bold uppercase text-[#FFF5DE] group-hover:text-[#E5B869] transition-colors drop-shadow-sm">
                    FARZI <span className="text-[#D4AF37]">CAFÉ</span>
                  </span>
                  <span className="text-[7.5px] font-mono tracking-[0.35em] uppercase text-[#D4AF37]/90 -mt-0.5">
                    CONTEMPORARY BISTRO
                  </span>
                </div>
              </div>
            </Link>

            {/* 2. CENTER NAVIGATION: Menu | Story | Locations | Reserve */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`text-xs tracking-[0.18em] font-sans transition-all relative py-1 font-medium group ${
                      isActive ? 'text-[#E5B869]' : 'text-neutral-200 hover:text-[#E5B869]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 rounded-full ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT ACTIONS: "Order at Table" Gold Button + Cart Button + Mobile Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Order at Table QR Button */}
              <Link
                to={`/menu?table=${tableNumber || 'T-12'}`}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#C59F6D] text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-black" />
                <span>Order at Table</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/50 text-[#FAF8F5] hover:text-[#D4AF37] transition-all flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4AF37] text-black font-mono font-bold text-[10px] flex items-center justify-center shadow-lg animate-pulse">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-[#090A0E]/98 backdrop-blur-2xl text-[#FAF8F5] pt-24 px-6 pb-8 md:hidden flex flex-col justify-between"
          >
            <div className="space-y-6 pt-4">
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-bold">
                [ NAVIGATION ]
              </div>

              <div className="space-y-4">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-2xl font-serif tracking-wider uppercase border-b border-white/10 hover:text-[#D4AF37] transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs font-mono text-neutral-500">[0{idx + 1}]</span>
                  </Link>
                ))}

                <Link
                  to={`/menu?table=${tableNumber || 'T-12'}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F6D] text-black font-bold text-xs uppercase tracking-widest shadow-xl"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Order at Table (T-12)</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Farzi Café · BistroOS</span>
              <span className="text-[#D4AF37] font-bold">SERVICE ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
