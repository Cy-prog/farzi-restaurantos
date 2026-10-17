import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { Order } from '../../types';
import { OrderSuccessModal } from './OrderSuccessModal';

export const CartDrawer: React.FC = () => {
  const {
    items,
    tableNumber,
    setTableNumber,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    tax,
    total,
    totalCount
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    if (!tableNumber) {
      setErrorMsg('Please assign a table number for kitchen delivery.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await api.createOrder({
        tableNumber,
        customerName,
        customerPhone,
        items,
        notes
      });
      clearCart();
      setIsCartOpen(false);
      setSubmittedOrder(created);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error transmitting order to kitchen station');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-screen max-w-md bg-charcoal-900 border-l border-charcoal-800 shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-950/60">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gold-400" />
                    <h2 className="font-serif text-lg font-bold text-ivory-100">
                      Your Order ({totalCount})
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full text-ivory-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Table Bar */}
                <div className="bg-charcoal-850 px-6 py-3 border-b border-charcoal-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-ivory-300">
                    <Table className="w-4 h-4 text-gold-400" />
                    <span>Dine-in Station:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gold-300 bg-charcoal-950 px-2 py-0.5 rounded border border-gold-500/30">
                      Table {tableNumber}
                    </span>
                    <button
                      onClick={() => {
                        const newTbl = prompt('Enter Table Number (e.g. T01 - T12):', tableNumber);
                        if (newTbl) setTableNumber(newTbl.trim().toUpperCase());
                      }}
                      className="text-ivory-400 hover:text-gold-300 underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-ivory-400 py-12">
                      <ShoppingBag className="w-12 h-12 text-charcoal-700 mb-3" />
                      <p className="font-serif text-lg text-ivory-300 mb-1">Your order is empty</p>
                      <p className="text-xs text-charcoal-500 max-w-xs">
                        Explore our progressive culinary creations and select your dishes.
                      </p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-charcoal-850/70 border border-charcoal-800 rounded-xl p-3.5 flex gap-3 items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-ivory-100 truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-serif font-bold text-gold-400">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.specialInstructions && (
                            <p className="text-[11px] text-ivory-400 italic truncate mt-0.5">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-charcoal-950 px-2.5 py-1 rounded-full border border-charcoal-700">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                            className="text-ivory-400 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-ivory-100 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                            className="text-ivory-400 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="p-1.5 text-charcoal-500 hover:text-rose-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer and Checkout Form */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-charcoal-800 bg-charcoal-950/80 space-y-4">
                    {/* Guest Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Guest Name (Optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-ivory-200 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (For order updates)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-ivory-200 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Chef order notes (e.g. serve together, extra napkins)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 text-xs text-ivory-200 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
                    />

                    {errorMsg && (
                      <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded border border-rose-800/40">
                        {errorMsg}
                      </p>
                    )}

                    {/* Financial Breakdown */}
                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex justify-between text-ivory-400">
                        <span>Items Subtotal</span>
                        <span className="font-mono">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-ivory-400">
                        <span>GST & Service Charge (5%)</span>
                        <span className="font-mono">₹{tax}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-ivory-100 pt-2 border-t border-charcoal-800">
                        <span>Grand Total</span>
                        <span className="font-serif text-gold-400">₹{total}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      onClick={handleSubmitOrder}
                      variant="gold"
                      size="lg"
                      isLoading={isSubmitting}
                      className="w-full"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Transmit to Kitchen • ₹{total}
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <OrderSuccessModal
        order={submittedOrder}
        onClose={() => setSubmittedOrder(null)}
      />
    </>
  );
};
