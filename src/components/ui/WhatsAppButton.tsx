import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '919599889701',
  message = 'Hi Farzi Café! I would like to make an inquiry / reservation.',
  className = ''
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.aside
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Contact options"
      className={`fixed bottom-6 right-6 z-50 flex items-center group ${className}`}
    >
      {/* Tooltip */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-full bg-black/90 text-white text-xs font-medium tracking-wide shadow-xl border border-gold-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with Farzi Café
      </span>

      {/* Floating Action Circle */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Farzi Café"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle Pulse Glow */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />

        {/* WhatsApp Vector Icon */}
        <svg
          className="w-8 h-8 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.507 14.307l-.009.075c-.223-.112-1.317-.65-1.521-.724-.204-.075-.353-.112-.502.112-.149.224-.576.724-.706.873-.13.15-.26.168-.483.056-.223-.112-.943-.348-1.796-1.109-.664-.593-1.113-1.325-1.243-1.549-.13-.224-.014-.345.098-.456.1-.1.223-.26.335-.39.112-.13.149-.224.223-.373.075-.15.037-.28-.019-.39-.056-.112-.502-1.21-.687-1.656-.18-.435-.363-.376-.502-.383-.13-.007-.279-.009-.427-.009-.15 0-.39.056-.595.28-.204.224-.78.762-.78 1.86s.8 2.158.911 2.308c.112.15 1.572 2.4 3.811 3.367.533.23 0.949.367 1.272.47.535.17 1.022.146 1.407.088.429-.064 1.317-.538 1.503-1.057.186-.52.186-.966.13-1.057-.055-.093-.204-.15-.427-.263zM12.04 2C6.51 2 2.03 6.47 2.03 12c0 1.96.57 3.79 1.55 5.33L2 22l4.82-1.53c1.48.88 3.2 1.39 5.22 1.39 5.53 0 10.01-4.47 10.01-10S17.57 2 12.04 2zm0 18.25c-1.73 0-3.33-.51-4.68-1.39l-.34-.22-2.86.91.93-2.77-.24-.37A8.19 8.19 0 0 1 3.79 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
        </svg>
      </a>
    </motion.aside>
  );
};
