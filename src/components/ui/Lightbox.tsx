import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightboxProps {
  images: Array<{
    id: number;
    title: string;
    imageUrl: string;
    categoryName?: string;
  }>;
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length;
  const currentImage = isOpen ? images[currentIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/90 text-black hover:bg-[#D4AF37] hover:text-black transition-colors border border-black/20 shadow-md"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation - Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-black hover:bg-[#D4AF37] hover:text-black transition-colors border border-black/20 shadow-md"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation - Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % images.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 text-black hover:bg-[#D4AF37] hover:text-black transition-colors border border-black/20 shadow-md"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Content */}
        <motion.div
          key={currentImage.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.imageUrl}
            alt={currentImage.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600';
            }}
            className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
          />
          <div className="mt-4 text-center">
            {currentImage.categoryName && (
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-semibold">
                {currentImage.categoryName}
              </span>
            )}
            <h3 className="text-lg font-serif font-bold text-white mt-1">
              {currentImage.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
