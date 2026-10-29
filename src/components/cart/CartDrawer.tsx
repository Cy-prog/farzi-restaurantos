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
                className="w-screen max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col text-[#12141A]"
              >
                {/* Header */}
                <div className="p-6 border-b border-black/10 flex items-center justify-between bg-[#FAF9F5]">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="font-serif text-lg font-bold text-black">
                      Your Order ({totalCount})
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Table Bar */}
                <div className="bg-white px-6 py-3 border-b border-black/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Table className="w-4 h-4 text-[#D4AF37]" />
                    <span>Dine-in Station:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#D4AF37] bg-black px-2.5 py-0.5 rounded shadow-sm">
                      Table {tableNumber}
                    </span>
                    <button
                      onClick={() => {
                        const newTbl = prompt('Enter Table Number (e.g. T01 - T12):', tableNumber);
                        if (newTbl) setTableNumber(newTbl.trim().toUpperCase());
                      }}
                      className="text-neutral-500 hover:text-[#D4AF37] underline text-[11px] font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF9F5]">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12">
                      <ShoppingBag className="w-12 h-12 text-neutral-300 mb-3" />
                      <p className="font-serif text-lg text-black mb-1">Your order is empty</p>
                      <p className="text-xs text-neutral-500 max-w-xs">
                        Explore our progressive culinary creations and select your dishes.
                      </p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-black/10 rounded-xl p-3.5 flex gap-3 items-center justify-between shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-serif font-bold text-[#D4AF37]">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.specialInstructions && (
                            <p className="text-[11px] text-neutral-500 italic truncate mt-0.5">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-[#FAF9F5] px-2.5 py-1 rounded-full border border-black/15 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                            className="text-neutral-600 hover:text-black font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-black min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                            className="text-neutral-600 hover:text-black font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
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
                  <div className="p-6 border-t border-black/10 bg-white space-y-4 shadow-lg">
                    {/* Guest Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Guest Name (Optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-black/15 text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (For order updates)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-black/15 text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Chef order notes (e.g. serve together, extra napkins)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                    />

                    {errorMsg && (
                      <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                        {errorMsg}
                      </p>
                    )}

                    {/* Financial Breakdown */}
                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex justify-between text-neutral-600">
                        <span>Items Subtotal</span>
                        <span className="font-mono">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>GST & Service Charge (5%)</span>
                        <span className="font-mono">₹{tax}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-black/10">
                        <span>Grand Total</span>
                        <span className="font-serif text-[#D4AF37]">₹{total}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Transmitting to Kitchen...</span>
                      ) : (
                        <>
                          <span>Transmit to Kitchen • ₹{total}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
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
