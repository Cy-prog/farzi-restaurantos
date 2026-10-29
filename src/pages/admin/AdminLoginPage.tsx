import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Key, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@restaurantos.local');
    setPassword('Admin@12345');
    setErrorMessage('');
  };

  const handleQuickFillStaff = () => {
    setEmail('staff@restaurantos.local');
    setPassword('Staff@12345');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Gold Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#C5A059]/10 blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Farzi Official Circular Emblem */}
        <Link to="/" className="inline-flex flex-col items-center gap-2 mb-4 group">
          <div className="w-16 h-16 rounded-full bg-black border border-[#C5A059]/50 p-2 shadow-xl shadow-[#C5A059]/20 group-hover:scale-105 group-hover:border-[#C5A059] transition-all duration-300">
            <img src="/farzi-logo.svg" alt="Farzi Café" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="font-display font-black tracking-[0.25em] text-2xl text-white uppercase group-hover:text-[#C5A059] transition-colors">
            FARZI <span className="text-[#C5A059]">CAFÉ</span>
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-100">
          RestaurantOS Management Portal
        </h2>
        <p className="mt-1 text-xs text-neutral-400 font-light">
          Authorized management console for culinary operations, KDS kitchen orders, and reservations.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#0E1017] border border-[#C5A059]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Demo Credentials Box */}
          <div className="bg-black/60 p-4 rounded-2xl border border-[#C5A059]/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-mono text-[#C5A059] font-semibold">
                <Key className="w-3.5 h-3.5" />
                <span>Demo Credentials:</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                1-Click Autofill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 text-[#C5A059] hover:text-white text-xs font-mono font-medium transition-all"
                title="Fill Admin credentials (admin@restaurantos.local)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={handleQuickFillStaff}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-medium transition-all"
                title="Fill Staff credentials (staff@restaurantos.local)"
              >
                <span>Staff Login</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 pt-1 space-y-0.5">
              <div>Email: <span className="text-neutral-200">admin@restaurantos.local</span></div>
              <div>Password: <span className="text-neutral-200">Admin@12345</span></div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurantos.local"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C358] to-[#C5A059] hover:from-[#d4af37] hover:to-[#b89225] text-black font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT Signed Session</span>
            </span>
            <Link to="/" className="text-[#C5A059] hover:underline font-mono text-[11px]">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
