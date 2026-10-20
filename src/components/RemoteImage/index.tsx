import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type RemoteImageProps = {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: ReactNode;
  priority?: boolean;
};

export default function RemoteImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallback,
  priority = false,
}: RemoteImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error',
  );

  // Ảnh đã có trong cache có thể tải xong trước khi React gắn onLoad.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-[#f1ecf6] ${
        status === 'loading' ? 'animate-pulse' : ''
      } ${className}`}
    >
      {src && status !== 'error' && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          {...({ fetchpriority: priority ? 'high' : 'auto' } as object)}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`block size-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
      {status === 'error' && fallback}
    </div>
  );
}
