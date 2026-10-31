import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_LOCAL_FALLBACK = '/cloche-dish.jpg';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_LOCAL_FALLBACK,
  ...props
}) => {
  const targetSrc = src || fallbackSrc || DEFAULT_LOCAL_FALLBACK;
  const [imgSrc, setImgSrc] = useState<string>(targetSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc || DEFAULT_LOCAL_FALLBACK);
    setHasError(false);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const nextSrc = fallbackSrc && fallbackSrc !== imgSrc ? fallbackSrc : DEFAULT_LOCAL_FALLBACK;
      setImgSrc(nextSrc);
      setIsLoaded(true);
    } else if (imgSrc !== DEFAULT_LOCAL_FALLBACK) {
      setImgSrc(DEFAULT_LOCAL_FALLBACK);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#12141C] ${className}`}>
      <img
        src={imgSrc}
        alt={alt || 'Farzi Modern Indian Gastronomy'}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-95'
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
