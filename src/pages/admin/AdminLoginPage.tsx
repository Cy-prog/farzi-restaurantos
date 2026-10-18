import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <span className="text-gold-400 font-serif font-black text-2xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold tracking-[0.25em] text-2xl text-ivory-50">FARZI</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
          RestaurantOS Pro Portal
        </h2>
        <p className="mt-2 text-xs text-ivory-400 font-light">
          Authorized management console for culinary operations, reservations, and live orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Security Notice */}
          <div className="bg-charcoal-950/80 p-3.5 rounded-xl border border-charcoal-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <p className="text-[11px] text-ivory-400 font-mono">
              Restricted management portal. All access attempts are monitored and logged.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ivory-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurantos.local"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ivory-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate & Enter
            </Button>
          </form>

          <div className="pt-4 border-t border-charcoal-800/80 flex items-center justify-between text-xs text-charcoal-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT Encrypted Session</span>
            </span>
            <Link to="/" className="text-gold-400 hover:text-gold-300">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
