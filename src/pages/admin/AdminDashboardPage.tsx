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
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
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
      <div className="p-8 text-center text-charcoal-400 font-mono text-xs">
        Loading live RestaurantOS metrics...
      </div>
    );
  }

  const statCards = [
    {
      label: 'Gross Culinary Revenue',
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      trend: 'Calculated from completed & active orders',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
    },
    {
      label: 'Active Kitchen Orders',
      value: `${analytics.pendingOrders} / ${analytics.totalOrders}`,
      trend: `${analytics.pendingOrders} active in Kitchen Display`,
      icon: <UtensilsCrossed className="w-5 h-5 text-gold-400" />
    },
    {
      label: 'Guest Reservations',
      value: `${analytics.upcomingReservations} Upcoming`,
      trend: `${analytics.totalReservations} total bookings recorded`,
      icon: <Calendar className="w-5 h-5 text-copper-400" />
    },
    {
      label: 'Active Menu Creations',
      value: `${analytics.availableMenuItems} / ${analytics.totalMenuItems}`,
      trend: `${analytics.totalMenuItems - analytics.availableMenuItems} marked sold out`,
      icon: <ShoppingBag className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Command Center & Analytics
          </h1>
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
            className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-charcoal-400 font-medium">{c.label}</span>
              <div className="p-2 rounded-xl bg-charcoal-950 border border-charcoal-800">
                {c.icon}
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-ivory-50 block">
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
        <div className="lg:col-span-2 bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-base text-ivory-100">
                Weekly Revenue Progression
              </h3>
              <p className="text-xs text-charcoal-400">Daily sales in INR across all dining stations</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
              Active Peak
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesByDay}>
                <defs>
                  <linearGradient id="goldRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E222D" />
                <XAxis dataKey="date" stroke="#606676" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606676" tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12141A', borderColor: '#2A2F3D', borderRadius: '8px', color: '#FAF8F5' }}
                  formatter={(val: unknown) => [`₹${Number(val).toLocaleString()}`, 'Daily Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#goldRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Dishes Ranking */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-ivory-100 mb-1">
              Top Guest Selections
            </h3>
            <p className="text-xs text-charcoal-400 mb-4">Most ordered laboratory creations</p>

            <div className="space-y-3">
              {analytics.popularDishes.map((dish, i) => (
                <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-charcoal-800/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-gold-400 font-bold w-4">{i + 1}.</span>
                    <span className="text-ivory-200 truncate font-medium">{dish.name}</span>
                  </div>
                  <span className="font-mono text-charcoal-400 whitespace-nowrap pl-2">
                    {dish.orderCount} orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal-800">
            <Link to="/admin/menu" className="text-xs text-gold-400 hover:text-gold-300 font-mono flex items-center justify-between">
              <span>View full menu catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Order Queue & Upcoming Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-base text-ivory-100">
              Live Kitchen Orders Queue
            </h3>
            <Link to="/admin/orders" className="text-xs text-gold-400 hover:text-gold-300 font-mono">
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {analytics.recentOrders.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">No active kitchen orders.</p>
            ) : (
              analytics.recentOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="bg-charcoal-950 p-3.5 rounded-xl border border-charcoal-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-gold-300">{order.orderNumber}</span>
                      <span className="font-mono text-xs text-ivory-200 bg-charcoal-850 px-2 py-0.5 rounded">
                        Table {order.tableNumber}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-charcoal-400 mt-1">
                      {order.items.length} items • ₹{order.total}
                    </p>
                  </div>

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleQuickOrderStatus(order.id, 'IN_KITCHEN')}
                      className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Start Kitchen
                    </button>
                  )}
                  {order.status === 'IN_KITCHEN' && (
                    <button
                      onClick={() => handleQuickOrderStatus(order.id, 'READY')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-base text-ivory-100">
              Upcoming Reservations
            </h3>
            <Link to="/admin/reservations" className="text-xs text-gold-400 hover:text-gold-300 font-mono">
              View All Desk →
            </Link>
          </div>

          <div className="space-y-3">
            {analytics.recentReservations.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">No pending reservations.</p>
            ) : (
              analytics.recentReservations.slice(0, 4).map((r) => (
                <div key={r.id} className="bg-charcoal-950 p-3.5 rounded-xl border border-charcoal-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-ivory-100">{r.name}</span>
                      <span className="text-[11px] font-mono text-gold-400">{r.guests} Guests</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      {r.reservationDate} at {r.reservationTime}
                    </p>
                  </div>

                  {r.status === 'PENDING' && (
                    <button
                      onClick={() => handleQuickReservationConfirm(r.id)}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-colors"
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
