import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Order } from '../../types';
import { OrderSuccessModal } from './OrderSuccessModal';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { soundFX } from '../../utils/soundEffects';

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

  const effectiveTable = tableNumber || 'T-12';

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await api.createOrder({
        tableNumber: effectiveTable,
        customerName: customerName || 'Farzi Guest',
        customerPhone,
        items,
        notes
      });
      clearCart();
      setIsCartOpen(false);
      setSubmittedOrder(created);
      soundFX.playChime();
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-[#0F1117] border-l border-[#D4AF37]/30 text-[#F4F0E8] flex flex-col shadow-2xl"
              >
                {/* Header (Matching "Your Cart (2)" in design board) */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0A0C10]">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif font-bold text-xl text-white">
                      Your Cart ({totalCount})
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Table Station Pill Bar */}
                <div className="bg-[#141722] px-6 py-2.5 border-b border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <QrCode className="w-3.5 h-3.5 text-[#E5B869]" />
                    <span className="font-mono text-[10px] tracking-wider uppercase">Table Station:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E5B869] bg-black/60 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 text-[11px]">
                      {effectiveTable}
                    </span>
                    <button
                      onClick={() => {
                        const newTbl = prompt('Enter Table Number (e.g. T-01 - T-12):', effectiveTable);
                        if (newTbl) setTableNumber(newTbl.trim().toUpperCase());
                      }}
                      className="text-neutral-400 hover:text-[#E5B869] text-[10px] font-mono underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-16">
                      <div className="w-16 h-16 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center mb-4 text-[#D4AF37]">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <p className="font-serif text-lg text-white mb-1">Your cart is empty</p>
                      <p className="text-xs text-neutral-400 max-w-xs font-light">
                        Select dishes from our culinary anthology to begin your dining experience.
                      </p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#161922] border border-white/10 rounded-2xl p-4 flex gap-3.5 items-center justify-between shadow-lg"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0 border border-white/10">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            fallbackSrc="/arancini.jpg"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-serif font-bold text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#E5B869]">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        {/* Stepper [- 1 +] */}
                        <div className="flex items-center gap-2.5 bg-[#0A0C10] px-3 py-1 rounded-full border border-white/15">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                            className="text-neutral-400 hover:text-white"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                            className="text-neutral-400 hover:text-white"
                            aria-label="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Breakdown & Place Order Button (Matching exact totals in design: Subtotal, Taxes 5%, Total, Place Order) */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-white/10 bg-[#0A0C10] space-y-4">
                    {errorMsg && (
                      <p className="text-xs font-mono text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800">
                        {errorMsg}
                      </p>
                    )}

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal</span>
                        <span className="text-white">₹{subtotal.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Taxes (5%)</span>
                        <span className="text-white">₹{tax.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-serif font-bold text-[#E5B869] pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span>₹{total.toFixed(0)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#C59F6D] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting to Kitchen...</span>
                      ) : (
                        <span>Place Order</span>
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
      {submittedOrder && (
        <OrderSuccessModal
          order={submittedOrder}
          onClose={() => setSubmittedOrder(null)}
        />
      )}
    </>
  );
};
