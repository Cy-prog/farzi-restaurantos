import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Synchronize when src prop changes
  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-charcoal-950 ${className}`}>
      {/* Background placeholder shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-charcoal-900 animate-pulse flex items-center justify-center">
          <span className="text-gold-500/20 font-serif text-2xl font-black">✦</span>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt || 'Farzi Modern Indian Gastronomy'}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
