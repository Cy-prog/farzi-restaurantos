import React from 'react';

interface KineticMarqueeProps {
  phrases?: string[];
  reverse?: boolean;
  speed?: 'normal' | 'fast' | 'slow';
  outline?: boolean;
  className?: string;
}

const DEFAULT_PHRASES = [
  'MODERN INDIAN CUISINE',
  'TRADITION REIMAGINED',
  'UNEXPECTED BY DESIGN',
  'MOLECULAR ILLUSIONS',
  'THE ART OF FARZI',
  'AVANT-GARDE GASTRONOMY'
];

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  phrases = DEFAULT_PHRASES,
  reverse = false,
  outline = false,
  className = '',
}) => {
  const repeated = [...phrases, ...phrases, ...phrases];

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap py-3.5 sm:py-5 select-none ${
        outline ? 'border-y border-black/10 bg-[#FAF9F5]' : 'bg-black text-[#FAF9F5] shadow-sm'
      } ${className}`}
    >
      <div
        className={`flex w-fit items-center gap-8 text-xl sm:text-2xl md:text-3xl font-display font-black tracking-[0.2em] uppercase ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } hover:[animation-play-state:paused]`}
      >
        {repeated.map((phrase, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span
              className={
                outline
                  ? 'text-stroke hover:text-[#D4AF37] transition-colors duration-300'
                  : 'text-[#FAF9F5]'
              }
            >
              {phrase}
            </span>
            <span className="text-[#D4AF37] text-xs font-bold">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
