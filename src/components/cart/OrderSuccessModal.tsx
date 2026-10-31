import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Order } from '../../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

const STEPS = [
  { label: 'Received', active: true },
  { label: 'Preparing', active: false },
  { label: 'Ready', active: false },
  { label: 'Served', active: false }
];

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5B869', '#FFF0D0']
      });
    }
  }, [order]);

  if (!order) return null;

  const displayOrderNumber = order.orderNumber || 'FZ4287';
  const displayTable = order.tableNumber || 'Table T-12';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0F1117] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Centered Golden Checkmark in circle (Matching design board) */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center text-[#E5B869] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Check className="w-8 h-8 text-[#E5B869]" strokeWidth={2.5} />
          </div>

          {/* Title: Order Placed! */}
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
            Order Placed!
          </h3>

          {/* Table & Order ID */}
          <div className="space-y-1 mb-4">
            <p className="font-serif text-lg font-bold text-[#E5B869]">
              {displayTable.startsWith('Table') ? displayTable : `Table ${displayTable}`}
            </p>
            <p className="text-xs font-mono text-neutral-400">
              Order ID: {displayOrderNumber}
            </p>
          </div>

          {/* Explanatory Message */}
          <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-xs mx-auto mb-8">
            Your order is being prepared. We'll notify you when it's ready.
          </p>

          {/* 4-Step Horizontal Progress Stepper (Matching exact design: Received, Preparing, Ready, Served) */}
          <div className="relative pt-4 pb-2 px-2">
            {/* Connecting Track Line */}
            <div className="absolute top-6 left-8 right-8 h-[2px] bg-white/15" />

            {/* Stepper Dots & Labels */}
            <div className="relative z-10 flex items-center justify-between">
              {STEPS.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      idx === 0
                        ? 'bg-[#E5B869] ring-4 ring-[#E5B869]/20 shadow-[0_0_10px_rgba(229,184,105,0.8)]'
                        : 'border border-white/30 bg-[#0F1117]'
                    }`}
                  >
                    {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase ${
                      idx === 0 ? 'text-[#E5B869] font-bold' : 'text-neutral-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dismiss Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Done & Return to Bistro
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
