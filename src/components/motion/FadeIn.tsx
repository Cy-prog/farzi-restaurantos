import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  viewportOnce = true
}) => {
  const shouldReduceMotion = useReducedMotion();

  let x = 0;
  let y = 0;

  if (!shouldReduceMotion) {
    if (direction === 'up') y = 24;
    if (direction === 'down') y = -24;
    if (direction === 'left') x = 24;
    if (direction === 'right') x = -24;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
