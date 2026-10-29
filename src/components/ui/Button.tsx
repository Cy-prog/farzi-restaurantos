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
  const baseStyles = 'relative inline-flex items-center justify-center font-mono uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E09F27]/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-[11px] px-3.5 py-1.5 rounded-xl gap-1.5 font-bold',
    md: 'text-xs px-5 py-2.5 rounded-xl gap-2 font-bold',
    lg: 'text-xs px-7 py-3.5 rounded-xl gap-2.5 font-bold'
  };

  const variantStyles = {
    gold: 'bg-[#E09F27] hover:bg-[#EEB446] text-black shadow-lg shadow-[#E09F27]/20 border border-[#E09F27]',
    outline: 'border border-white/20 text-neutral-200 bg-transparent hover:border-[#E09F27] hover:text-white',
    subtle: 'bg-neutral-900 text-neutral-300 border border-white/10 hover:border-white/25 hover:text-white',
    copper: 'bg-[#C57D56] hover:bg-[#D48D65] text-black',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900',
    ghost: 'text-neutral-400 hover:text-white hover:bg-white/5'
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
