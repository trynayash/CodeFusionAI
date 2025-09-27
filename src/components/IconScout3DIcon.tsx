import React, { useState, useEffect } from 'react';
import { useSingleIconScoutAsset } from '@/hooks/useIconScoutAssets';
import { cn } from '@/lib/utils';

interface IconScout3DIconProps {
  query: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const IconScout3DIcon: React.FC<IconScout3DIconProps> = ({
  query,
  className,
  size = 'md',
  fallback,
  onLoad,
  onError,
}) => {
  const { asset, loading, error } = useSingleIconScoutAsset('3d-icons', query, {
    style: '3d',
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (asset && !loading) {
      onLoad?.();
    }
  }, [asset, loading, onLoad]);

  useEffect(() => {
    if (error) {
      onError?.();
    }
  }, [error, onError]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Show loading state
  if (loading) {
    return (
      <div className={cn(
        sizeClasses[size],
        'bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse flex items-center justify-center',
        className
      )}>
        <div className="w-4 h-4 bg-white/30 rounded animate-pulse" />
      </div>
    );
  }

  // Show error state or fallback
  if (error || !asset || imageError) {
    return (
      <div className={cn(sizeClasses[size], className)}>
        {fallback || (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            <span className="text-xs text-white/60">?</span>
          </div>
        )}
      </div>
    );
  }

  // Show the 3D icon
  return (
    <div className={cn(sizeClasses[size], className)}>
      <img
        src={asset.url || asset.preview_url}
        alt={asset.name || query}
        className="w-full h-full object-contain"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default IconScout3DIcon;
