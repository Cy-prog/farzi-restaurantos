import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, QrCode, Calendar, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount, setIsCartOpen, tableNumber } = useCart();

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

  const navLinks = [
    { name: 'Story', path: '/about' },
    { name: 'A La Carte', path: '/menu' },
    { name: 'QR Digital Menu', path: `/menu?table=${tableNumber || 'T04'}` },
    { name: 'Culinary Gallery', path: '/gallery' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Contact & Bistro', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) return location.search.includes('table=');
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-charcoal-975/95 backdrop-blur-xl border-b border-charcoal-800/80 py-3 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-charcoal-975/90 via-charcoal-975/50 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-copper-600 flex items-center justify-center text-charcoal-950 font-serif font-black text-lg shadow-lg shadow-gold-500/25 group-hover:scale-105 transition-transform duration-300">
                ✦
              </div>
              <div className="absolute -inset-1 rounded-full bg-gold-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-[0.25em] text-xl font-bold text-ivory-50 uppercase group-hover:text-gold-300 transition-colors">
                FARZI
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gold-400/90 uppercase -mt-1 flex items-center gap-1">
                <span>Progressive Modern Indian</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase font-medium tracking-widest transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-gold-400 font-semibold'
                    : 'text-ivory-300 hover:text-gold-300'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 via-gold-500 to-copper-500 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Table Badge */}
            {tableNumber && (
              <Link
                to={`/menu?table=${tableNumber}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gold-500/10 text-gold-300 border border-gold-500/30 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all shadow-sm"
                title="Active Dining Station Table"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <QrCode className="w-3.5 h-3.5 text-gold-400" />
                <span>Station {tableNumber}</span>
              </Link>
            )}

            {/* Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-charcoal-900 text-ivory-200 border border-charcoal-700/80 hover:text-gold-300 hover:border-gold-500/40 transition-colors shadow-sm"
              aria-label={`Open Order Cart (${totalCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-400 text-charcoal-950 font-mono text-[11px] font-bold flex items-center justify-center shadow-md shadow-gold-500/40"
                  >
                    {totalCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Reserve Table CTA (Desktop) */}
            <Link to="/reservation" className="hidden sm:inline-block">
              <Button variant="gold" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                Reserve Table
              </Button>
            </Link>

            {/* Admin Portal Shortcut */}
            <Link
              to="/admin"
              className="p-2 text-charcoal-400 hover:text-gold-400 transition-colors hidden md:block"
              title="RestaurantOS Pro Administration"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-ivory-300 hover:text-white hover:bg-charcoal-850 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-charcoal-950 border-l border-charcoal-800 p-6 flex flex-col justify-between pt-24 shadow-2xl"
            >
              <div className="space-y-5">
                <div className="pb-4 border-b border-charcoal-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-xs uppercase font-mono tracking-widest text-gold-400">
                      Farzi Navigation
                    </span>
                  </div>
                  {tableNumber && (
                    <span className="text-xs font-mono text-gold-300 bg-charcoal-900 px-2.5 py-0.5 rounded-full border border-gold-500/30">
                      Table {tableNumber}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block py-3 px-3.5 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-gold-300 font-semibold border-l-2 border-gold-400'
                          : 'text-ivory-200 hover:bg-charcoal-900 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-charcoal-800">
                <Link to="/reservation" className="block w-full">
                  <Button variant="gold" size="md" className="w-full justify-center">
                    Reserve Experience
                  </Button>
                </Link>
                <Link
                  to="/admin"
                  className="block text-center text-xs text-charcoal-400 hover:text-gold-300 py-1 transition-colors"
                >
                  RestaurantOS Operations Desk →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
