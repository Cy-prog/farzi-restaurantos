import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPointer, setIsPointer] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid, non-laggy tracking
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Only enable on desktop with fine pointer
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element for data-cursor or interactive tags
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor') || '');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }

      // Check if interactive button or link
      const clickable = target.closest('button, a, input, textarea, select, [role="button"]');
      setIsPointer(!!clickable);

      // Hide custom cursor completely if over input/textarea to preserve native caret
      const isInput = target.closest('input, textarea, select');
      if (isInput) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full"
      animate={{
        width: cursorText ? 84 : isPointer ? 44 : 20,
        height: cursorText ? 84 : isPointer ? 44 : 20,
        backgroundColor: cursorText ? 'rgba(224, 159, 39, 0.95)' : isPointer ? 'rgba(244, 240, 232, 0.15)' : 'rgba(244, 240, 232, 0.8)',
        border: cursorText ? 'none' : isPointer ? '1px solid rgba(224, 159, 39, 0.6)' : 'none',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {cursorText && (
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-black select-none text-center px-1">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
};
