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
  const springX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 400 });

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

      // Check hovered element for data-cursor or interactive tags
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor') || '');
        setIsHovered(true);
        setIsVisible(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }

      // Check if interactive button or link
      const clickable = target.closest('button, a, select, [role="button"]');
      setIsPointer(!!clickable);

      // Hide custom cursor completely if over input/textarea to preserve native caret
      const isInput = target.closest('input, textarea');
      if (isInput) {
        setIsVisible(false);
      } else if (cursorTarget || clickable) {
        setIsVisible(true);
      } else {
        // When not over a clickable or custom target, don't show a floating dot
        setIsVisible(false);
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
  }, [mouseX, mouseY]);

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
        width: cursorText ? 84 : isPointer ? 38 : 0,
        height: cursorText ? 84 : isPointer ? 38 : 0,
        opacity: cursorText || isPointer ? 1 : 0,
        backgroundColor: cursorText ? 'rgba(212, 175, 55, 0.95)' : 'transparent',
        border: cursorText ? 'none' : isPointer ? '1.5px solid rgba(229, 184, 105, 0.7)' : 'none',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
    >
      {cursorText && (
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-black select-none text-center px-1">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
};

export default CustomCursor;
