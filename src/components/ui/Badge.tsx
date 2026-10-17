import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { SpiceLevel, OrderStatus, ReservationStatus } from '../../types';

export const VegBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const boxSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div
      className={`border border-emerald-500 flex items-center justify-center p-0.5 rounded-[3px] bg-emerald-950/40 ${boxSize}`}
      title="Vegetarian"
      aria-label="Vegetarian"
    >
      <div className={`rounded-full bg-emerald-400 ${dotSize}`} />
    </div>
  );
};

export const NonVegBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const boxSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const triangleSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div
      className={`border border-rose-600 flex items-center justify-center p-0.5 rounded-[3px] bg-rose-950/40 ${boxSize}`}
      title="Non-Vegetarian"
      aria-label="Non-Vegetarian"
    >
      <div
        className={`bg-rose-500 ${triangleSize}`}
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      />
    </div>
  );
};

export const ChefSpecialBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-500/15 text-gold-300 border border-gold-500/30">
    <Sparkles className="w-3 h-3 text-gold-400" />
    Chef’s Signature
  </span>
);

export const SpiceBadge: React.FC<{ level: SpiceLevel }> = ({ level }) => {
  if (level === 'NONE') return null;

  const getFlameCount = () => {
    switch (level) {
      case 'MILD': return 1;
      case 'MEDIUM': return 2;
      case 'HOT': return 3;
      case 'EXTRA_HOT': return 4;
      default: return 1;
    }
  };

  const count = getFlameCount();

  return (
    <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] bg-orange-950/30 text-orange-400 border border-orange-500/20" title={`Spice Level: ${level}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Flame key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
      ))}
      <span className="text-[10px] uppercase font-mono tracking-wider ml-0.5">{level}</span>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: OrderStatus | ReservationStatus | string }> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-950/50 text-amber-300 border-amber-600/40';
      case 'CONFIRMED':
      case 'READY':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40';
      case 'IN_KITCHEN':
      case 'SEATED':
        return 'bg-blue-950/50 text-blue-300 border-blue-600/40';
      case 'SERVED':
      case 'COMPLETED':
        return 'bg-charcoal-800 text-ivory-300 border-charcoal-600';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-950/50 text-rose-300 border-rose-600/40';
      default:
        return 'bg-charcoal-800 text-ivory-400 border-charcoal-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
