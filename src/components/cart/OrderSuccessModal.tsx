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
          className="relative w-full max-w-md bg-charcoal-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-ivory-400 hover:text-white p-1 rounded-full hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-gold-400">
            Direct Kitchen Dispatch
          </span>
          <h3 className="text-2xl font-serif font-bold text-ivory-100 mt-1 mb-2">
            Order Transmitted!
          </h3>
          <p className="text-xs text-ivory-300 leading-relaxed">
            Your culinary selection for <strong className="text-gold-300">Table {order.tableNumber}</strong> has been received by our kitchen laboratory.
          </p>

          {/* Order Details Ticket */}
          <div className="my-6 p-4 rounded-xl bg-charcoal-950/80 border border-charcoal-800 text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-charcoal-800">
              <span className="text-ivory-400 font-mono">Order Ticket:</span>
              <span className="font-mono font-bold text-gold-300">{order.orderNumber}</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs text-ivory-200">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono text-ivory-300">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-charcoal-800 flex justify-between items-center text-sm font-semibold">
              <span className="text-ivory-200">Total (incl. tax):</span>
              <span className="font-serif text-gold-400 text-base">₹{order.total}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-ivory-400 mb-6 bg-charcoal-850 py-2 px-3 rounded-lg border border-charcoal-700/60">
            <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span>Estimated preparation: ~18-22 minutes</span>
          </div>

          <Button onClick={onClose} variant="gold" size="md" className="w-full">
            Return to Menu
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
