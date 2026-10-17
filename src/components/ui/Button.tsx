import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'subtle' | 'copper' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2 focus:ring-offset-charcoal-950 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 tracking-wide';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2',
    lg: 'text-base px-7 py-3.5 rounded-full gap-2.5'
  };

  const variantStyles = {
    gold: 'bg-gradient-to-r from-gold-500 via-gold-400 to-copper-500 text-charcoal-950 font-semibold shadow-lg shadow-gold-500/15 hover:shadow-gold-500/30 hover:brightness-105 border border-gold-300/30',
    outline: 'border border-gold-500/40 text-gold-300 bg-transparent hover:bg-gold-500/10 hover:border-gold-500/70',
    subtle: 'bg-charcoal-800/80 text-ivory-200 border border-charcoal-700 hover:bg-charcoal-700 hover:text-white',
    copper: 'bg-gradient-to-r from-copper-500 to-copper-600 text-white font-medium shadow-md shadow-copper-500/20 hover:brightness-105',
    danger: 'bg-red-950/80 text-red-300 border border-red-800/50 hover:bg-red-900/80',
    ghost: 'text-ivory-300 hover:text-gold-400 hover:bg-white/5'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
