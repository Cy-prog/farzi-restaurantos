import React from 'react';
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
  Bell,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center text-gold-400 font-mono text-sm">
        Authenticating RestaurantOS Pro...
      </div>
    );
  }

  const navItems = [
    { label: 'Overview Analytics', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Live Kitchen Orders', path: '/admin/orders', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { label: 'Menu Items Studio', path: '/admin/menu', icon: <ChefHat className="w-4 h-4" /> },
    { label: 'Reservations Desk', path: '/admin/reservations', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'QR Code Generator', path: '/admin/qr', icon: <QrCode className="w-4 h-4" /> },
    { label: 'Restaurant Settings', path: '/admin/settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-ivory-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Badge */}
          <div className="p-6 border-b border-charcoal-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-gold-400 font-serif font-black text-xl">✦</span>
              <div>
                <span className="font-display font-bold tracking-widest text-base text-ivory-50 block">
                  FARZI
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase -mt-1 block">
                  RestaurantOS Pro
                </span>
              </div>
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-500/10 text-gold-400 border border-gold-500/30">
              v2.4
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
          </nav>
        </div>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-charcoal-800 bg-charcoal-950/60 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-xs font-mono">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ivory-100 truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{user?.role || 'ADMIN'} Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-gold-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Visit Site</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-charcoal-950">
        <Outlet />
      </main>
    </div>
  );
};
