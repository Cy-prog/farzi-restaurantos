import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  QrCode,
  Sliders,
  LogOut,
  ExternalLink,
  ChefHat,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileAdminNavOpen, setMobileAdminNavOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-975 flex items-center justify-center text-gold-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
          <span>Authenticating Farzi RestaurantOS Pro...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview Analytics', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Live Kitchen Orders', path: '/admin/orders', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { label: 'Menu Items Studio', path: '/admin/menu', icon: <ChefHat className="w-4 h-4" /> },
    { label: 'Reservations Desk', path: '/admin/reservations', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'QR Code Studio', path: '/admin/qr', icon: <QrCode className="w-4 h-4" /> },
    { label: 'Restaurant Settings', path: '/admin/settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F4F0E8] flex flex-col md:flex-row">
      {/* Mobile Top Header for Admin on small screens */}
      <div className="md:hidden bg-neutral-950 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-[#E09F27] font-serif font-black text-lg">✦</span>
          <span className="font-display font-bold tracking-widest text-sm text-white">FARZI OS</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E09F27]/15 text-[#E09F27] border border-[#E09F27]/30">
            PRO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-1.5 text-neutral-400 hover:text-white"
            title="Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileAdminNavOpen(!mobileAdminNavOpen)}
            className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200"
            aria-label="Toggle Admin Menu"
          >
            {mobileAdminNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileAdminNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal-900 border-b border-charcoal-800 p-4 space-y-2 z-30 overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileAdminNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-gold-300 font-semibold border-l-2 border-gold-400'
                      : 'text-ivory-400 hover:text-ivory-100 hover:bg-charcoal-850'
                  }`}
                >
                  <span className={isActive ? 'text-gold-400' : 'text-charcoal-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between">
              <span className="text-[11px] text-charcoal-400">{user?.name} ({user?.role})</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="text-xs text-rose-400 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-neutral-950 border-r border-white/[0.08] flex-col justify-between flex-shrink-0 shadow-2xl">
        <div>
          {/* Brand Badge */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#E09F27] flex items-center justify-center text-black font-serif font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                ✦
              </div>
              <div>
                <span className="font-display font-black tracking-widest text-sm text-white block leading-tight">
                  FARZI OS
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#E09F27] uppercase block">
                  Operations Console
                </span>
              </div>
            </Link>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E09F27]/10 text-[#E09F27] border border-[#E09F27]/30">
              v2.5
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-900 text-[#E09F27] font-bold border-l-2 border-[#E09F27] shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <span className={isActive ? 'text-[#E09F27]' : 'text-neutral-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-charcoal-800/80 bg-charcoal-950/90 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/20 to-copper-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-xs font-mono">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ivory-100 truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{user?.role || 'ADMIN'} Station</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-charcoal-850 px-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-gold-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit Desk</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-charcoal-975">
        <Outlet />
      </main>
    </div>
  );
};
