import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  QrCode,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Sparkles,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardAnalytics, Order, Reservation } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Live poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleQuickOrderStatus = async (orderId: number, nextStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickReservationConfirm = async (resId: number) => {
    try {
      await api.updateReservationStatus(resId, 'CONFIRMED');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="p-8 text-center text-charcoal-400 font-mono text-xs min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
        <span>Synchronizing live RestaurantOS metrics & orders...</span>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Gross Culinary Revenue',
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      trend: 'Calculated across all orders',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/20'
    },
    {
      label: 'Active Kitchen Orders',
      value: `${analytics.pendingOrders} / ${analytics.totalOrders}`,
      trend: `${analytics.pendingOrders} live in kitchen stream`,
      icon: <UtensilsCrossed className="w-5 h-5 text-gold-400" />,
      accent: 'border-gold-500/30'
    },
    {
      label: 'Guest Reservations',
      value: `${analytics.upcomingReservations} Upcoming`,
      trend: `${analytics.totalReservations} total bookings recorded`,
      icon: <Calendar className="w-5 h-5 text-copper-400" />,
      accent: 'border-copper-500/20'
    },
    {
      label: 'Active Menu Creations',
      value: `${analytics.availableMenuItems} / ${analytics.totalMenuItems}`,
      trend: `${analytics.totalMenuItems - analytics.availableMenuItems} marked unavailable`,
      icon: <ShoppingBag className="w-5 h-5 text-blue-400" />,
      accent: 'border-blue-500/20'
    }
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Operations Overview • Farzi RestaurantOS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Command Center & Culinary Analytics
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Real-time floor telemetry, kitchen load balancing, and reservation concierge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/menu">
            <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Menu Dish
            </Button>
          </Link>
          <Link to="/admin/qr">
            <Button variant="outline" size="sm" icon={<QrCode className="w-4 h-4" />}>
              Table QR Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, i) => (
          <div
            key={i}
            className={`bg-charcoal-900/90 border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-gold-500/30 ${c.accent}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-charcoal-400 font-medium font-mono uppercase tracking-wider">{c.label}</span>
              <div className="p-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 shadow-inner">
                {c.icon}
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50 block">
                {c.value}
              </span>
              <span className="text-[11px] text-charcoal-400 font-mono mt-1 block">
                {c.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Curve */}
        <div className="lg:col-span-2 bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif font-bold text-base text-ivory-100">
                  Weekly Revenue Progression
                </h3>
              </div>
              <p className="text-xs text-charcoal-400 mt-0.5">Daily sales in INR across all dining stations</p>
            </div>
            <span className="text-xs font-mono text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/30 font-semibold">
              Peak Service
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesByDay}>
                <defs>
                  <linearGradient id="goldRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E222D" />
                <XAxis dataKey="date" stroke="#606676" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606676" tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0B0E', borderColor: 'rgba(212,175,55,0.3)', borderRadius: '12px', color: '#FAF8F5', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)' }}
                  formatter={(val: unknown) => [`₹${Number(val).toLocaleString()}`, 'Daily Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#goldRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Dishes Ranking */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="font-serif font-bold text-base text-ivory-100">
                Top Guest Selections
              </h3>
            </div>
            <p className="text-xs text-charcoal-400 mb-4">Most ordered laboratory creations</p>

            <div className="space-y-3">
              {analytics.popularDishes.map((dish, i) => (
                <div key={i} className="flex items-center justify-between text-xs pb-2.5 border-b border-charcoal-800/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-gold-400 font-bold w-4">{i + 1}.</span>
                    <span className="text-ivory-200 truncate font-medium">{dish.name}</span>
                  </div>
                  <span className="font-mono text-gold-300 whitespace-nowrap pl-2 bg-charcoal-950 px-2 py-0.5 rounded border border-charcoal-800">
                    {dish.orderCount} orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal-800">
            <Link to="/admin/menu" className="text-xs text-gold-400 hover:text-gold-300 font-mono flex items-center justify-between group">
              <span>View full menu catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Order Queue & Upcoming Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-gold-400" />
              <h3 className="font-serif font-bold text-base text-ivory-100">
                Live Kitchen Orders Stream
              </h3>
            </div>
            <Link to="/admin/orders" className="text-xs text-gold-400 hover:text-gold-300 font-mono flex items-center gap-1">
              <span>All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics.recentOrders.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-8 text-center font-mono">No active kitchen orders currently.</p>
            ) : (
              analytics.recentOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="bg-charcoal-950 p-3.5 rounded-2xl border border-charcoal-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-gold-300">{order.orderNumber}</span>
                      <span className="font-mono text-xs text-ivory-200 bg-charcoal-900 px-2 py-0.5 rounded border border-charcoal-700">
                        Table {order.tableNumber}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-charcoal-400 mt-1 font-light">
                      {order.items.length} items • ₹{order.total}
                    </p>
                  </div>

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleQuickOrderStatus(order.id, 'IN_KITCHEN')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/25 text-blue-300 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/30"
                    >
                      Start Kitchen
                    </button>
                  )}
                  {order.status === 'IN_KITCHEN' && (
                    <button
                      onClick={() => handleQuickOrderStatus(order.id, 'READY')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/25 text-emerald-300 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-500/30"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleQuickOrderStatus(order.id, 'SERVED')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/25 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-colors border border-purple-500/30"
                    >
                      Mark Served
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <h3 className="font-serif font-bold text-base text-ivory-100">
                Upcoming Concierge Reservations
              </h3>
            </div>
            <Link to="/admin/reservations" className="text-xs text-gold-400 hover:text-gold-300 font-mono flex items-center gap-1">
              <span>All Bookings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics.recentReservations.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-8 text-center font-mono">No pending reservations recorded.</p>
            ) : (
              analytics.recentReservations.slice(0, 4).map((r) => (
                <div key={r.id} className="bg-charcoal-950 p-3.5 rounded-2xl border border-charcoal-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-ivory-100">{r.name}</span>
                      <span className="text-[11px] font-mono text-gold-400 bg-charcoal-900 px-2 py-0.5 rounded border border-charcoal-700">{r.guests} Guests</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-charcoal-400 mt-1 font-light">
                      {r.reservationDate} at {r.reservationTime}
                    </p>
                  </div>

                  {r.status === 'PENDING' && (
                    <button
                      onClick={() => handleQuickReservationConfirm(r.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/25 text-emerald-300 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-500/30"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
