import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Clock, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, Table } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert('Failed to update order status. Please check backend connection.');
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Kitchen Display System (KDS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Live Table Orders Management
          </h1>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-xs text-ivory-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'PENDING', 'IN_KITCHEN', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              statusFilter === st
                ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800 hover:bg-charcoal-800'
            }`}
          >
            {st.replace('_', ' ')}
            {st !== 'ALL' && ` (${orders.filter(o => o.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 bg-charcoal-900 rounded-2xl animate-pulse border border-charcoal-800" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-16 text-center bg-charcoal-900 border border-charcoal-800 rounded-2xl text-charcoal-400">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-charcoal-600" />
          <p className="text-sm font-serif text-ivory-300">No orders match this status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header: Table & Order Number */}
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gold-300 bg-charcoal-950 px-2.5 py-1 rounded border border-gold-500/30">
                      Table {order.tableNumber}
                    </span>
                    <span className="font-mono text-xs text-charcoal-400">
                      {order.orderNumber}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Guest & Time Info */}
                <div className="py-2.5 text-xs text-charcoal-400 flex items-center justify-between">
                  <span>{order.customerName || 'Guest'}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-gold-400" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2 py-3 border-y border-charcoal-800/80 my-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-ivory-100">{it.quantity}x</span>{' '}
                        <span className="text-ivory-200">{it.name}</span>
                        {it.specialInstructions && (
                          <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                            Note: {it.specialInstructions}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-charcoal-400 pl-2">
                        ₹{it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <p className="text-[11px] text-ivory-300 bg-charcoal-950 p-2 rounded border border-charcoal-800 my-2">
                    <strong>Instructions:</strong> {order.notes}
                  </p>
                )}
              </div>

              {/* Total & Action Status Flow */}
              <div className="pt-4 mt-2">
                <div className="flex justify-between items-center text-sm font-semibold mb-4">
                  <span className="text-charcoal-400">Total Bill:</span>
                  <span className="font-serif text-gold-400 text-base">₹{order.total}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'IN_KITCHEN')}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-colors"
                    >
                      Accept & Send to Kitchen
                    </button>
                  )}
                  {order.status === 'IN_KITCHEN' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-colors"
                    >
                      Food Ready for Service
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors"
                    >
                      Mark Table Served
                    </button>
                  )}
                  {order.status === 'SERVED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-charcoal-800 text-gold-300 font-semibold text-xs border border-gold-500/30 hover:bg-gold-500 hover:text-charcoal-950 transition-colors"
                    >
                      Complete & Free Table
                    </button>
                  )}
                  {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => {
                        if (confirm(`Cancel order ${order.orderNumber}?`)) {
                          handleUpdateStatus(order.id, 'CANCELLED');
                        }
                      }}
                      className="py-2 px-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/60 text-xs"
                      title="Cancel Order"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
