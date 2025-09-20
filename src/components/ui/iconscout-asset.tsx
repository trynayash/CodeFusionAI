import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface IconScoutAssetProps {
  id?: string;
  name?: string;
  url: string;
  alt: string;
  type: '3d-icon' | 'illustration' | 'lottie-animation' | 'icon';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoPlay?: boolean;
  loop?: boolean;
  darkModeUrl?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const IconScoutAsset: React.FC<IconScoutAssetProps> = ({
  id,
  name,
  url,
  alt,
  type,
  className,
  size = 'md',
  autoPlay = true,
  loop = false,
  darkModeUrl,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Determine which URL to use based on theme
  const effectiveUrl = theme === 'dark' && darkModeUrl ? darkModeUrl : url;

  useEffect(() => {
    if (type === 'lottie-animation' && effectiveUrl) {
      // Fetch Lottie animation data
      fetch(effectiveUrl)
        .then(response => response.json())
        .then(data => {
          setAnimationData(data);
          setIsLoaded(true);
          onLoad?.();
        })
        .catch(error => {
          console.error('Failed to load Lottie animation:', error);
          setHasError(true);
          onError?.(error);
        });
    }
  }, [effectiveUrl, type, onLoad, onError]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = (error: any) => {
    setHasError(true);
    onError?.(new Error('Failed to load image'));
  };

  const baseClasses = cn(
    'transition-all duration-200',
    sizeClasses[size],
    className
  );

  // Render Lottie animation
  if (type === 'lottie-animation') {
    if (hasError) {
      return (
        <div className={cn(baseClasses, 'bg-muted rounded-md flex items-center justify-center')}>
          <span className="text-xs text-muted-foreground">Failed to load</span>
        </div>
      );
    }

    if (!animationData) {
      return (
        <div className={cn(baseClasses, 'bg-muted rounded-md animate-pulse')} />
      );
    }

    return (
      <div className={baseClasses}>
        <Lottie
          animationData={animationData}
          autoplay={autoPlay}
          loop={loop}
          className="w-full h-full"
          aria-label={alt}
        />
      </div>
    );
  }

  // Render static image (3D icons, illustrations, regular icons)
  return (
    <div className={baseClasses}>
      {!isLoaded && !hasError && (
        <div className="w-full h-full bg-muted rounded-md animate-pulse" />
      )}
      
      {hasError ? (
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Failed to load</span>
        </div>
      ) : (
        <img
          src={effectiveUrl}
          alt={alt}
          loading={loading}
          className={cn(
            'w-full h-full object-contain',
            !isLoaded && 'opacity-0',
            isLoaded && 'opacity-100'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

// Hook for fetching and managing IconScout assets
export const useIconScoutAsset = (
  type: IconScoutAssetProps['type'],
  query: string,
  options?: {
    style?: string;
    color?: string;
    category?: string;
  }
) => {
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);

        // Import the service dynamically to avoid circular dependencies
        const { iconScoutService } = await import('@/services/iconscout');
        
        let assetType: 'icons' | '3d-icons' | 'illustrations' | 'lottie-animations';
        
        switch (type) {
          case '3d-icon':
            assetType = '3d-icons';
            break;
          case 'illustration':
            assetType = 'illustrations';
            break;
          case 'lottie-animation':
            assetType = 'lottie-animations';
            break;
          default:
            assetType = 'icons';
        }

        const response = await iconScoutService.fetchIconScoutAssets({
          type: assetType,
          query,
          ...options,
          per_page: 1,
        });

        // Get the first asset from the response
        const assets = response.icons || response.illustrations || response.animations || [];
        if (assets.length > 0) {
          setAsset(assets[0]);
        } else {
          setError('No assets found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch asset');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchAsset();
    }
  }, [type, query, options?.style, options?.color, options?.category]);

  return { asset, loading, error };
};

export default IconScoutAsset;