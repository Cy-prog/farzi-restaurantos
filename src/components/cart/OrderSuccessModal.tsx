import React, { useEffect } from 'react';
import { CheckCircle2, Clock, UtensilsCrossed, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Order } from '../../types';
import { Button } from '../ui/Button';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C57D56', '#FAF8F5']
      });
    }
  }, [order]);

  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white border border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-semibold">
            Direct Kitchen Dispatch
          </span>
          <h3 className="text-2xl font-serif font-black text-black mt-1 mb-2">
            Order Transmitted!
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Your culinary selection for <strong className="text-black">Table {order.tableNumber}</strong> has been received by our kitchen laboratory.
          </p>

          {/* Order Details Ticket */}
          <div className="my-6 p-4 rounded-xl bg-[#FAF9F5] border border-black/10 text-left space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-black/10">
              <span className="text-neutral-500 font-mono">Order Ticket:</span>
              <span className="font-mono font-bold text-black">{order.orderNumber}</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs text-neutral-700">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono font-semibold text-black">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-black/10 flex justify-between items-center text-sm font-semibold">
              <span className="text-neutral-700">Total (incl. tax):</span>
              <span className="font-serif text-[#D4AF37] text-base font-bold">₹{order.total}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-600 mb-6 bg-[#FAF9F5] py-2 px-3 rounded-lg border border-black/10">
            <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Estimated preparation: ~18-22 minutes</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-md"
          >
            Return to Menu
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
