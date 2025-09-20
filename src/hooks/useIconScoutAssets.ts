import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { iconScoutService, type AssetType, type IconScoutAsset } from '@/services/iconscout';

interface UseIconScoutAssetsOptions {
  style?: string;
  color?: string;
  category?: string;
  per_page?: number;
  autoFetch?: boolean;
  darkModeQuery?: string; // Alternative query for dark mode
}

interface UseIconScoutAssetsReturn {
  assets: IconScoutAsset[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  fetchAssets: (query?: string, resetPage?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useIconScoutAssets = (
  type: AssetType,
  initialQuery: string = '',
  options: UseIconScoutAssetsOptions = {}
): UseIconScoutAssetsReturn => {
  const {
    style,
    color,
    category,
    per_page = 20,
    autoFetch = true,
    darkModeQuery
  } = options;

  const { theme } = useTheme();
  const [assets, setAssets] = useState<IconScoutAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastQuery, setLastQuery] = useState(initialQuery);

  // Determine query based on theme
  const getEffectiveQuery = useCallback((query: string) => {
    if (theme === 'dark' && darkModeQuery) {
      return darkModeQuery;
    }
    return query;
  }, [theme, darkModeQuery]);

  const fetchAssets = useCallback(async (query: string = lastQuery, resetPage: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const page = resetPage ? 1 : currentPage;
      const effectiveQuery = getEffectiveQuery(query);

      const response = await iconScoutService.fetchIconScoutAssets({
        type,
        query: effectiveQuery,
        style,
        color,
        category,
        page,
        per_page,
      });

      const newAssets = response.icons || response.illustrations || response.animations || [];

      if (resetPage) {
        setAssets(newAssets);
        setCurrentPage(1);
      } else {
        setAssets(prev => [...prev, ...newAssets]);
      }

      setTotalCount(response.total);
      setHasMore(newAssets.length === per_page && (page * per_page) < response.total);
      setLastQuery(query);

      if (resetPage) {
        setCurrentPage(2); // Next page to load
      } else {
        setCurrentPage(prev => prev + 1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets';
      setError(errorMessage);
      console.error('Error fetching IconScout assets:', err);
    } finally {
      setLoading(false);
    }
  }, [type, style, color, category, per_page, currentPage, lastQuery, getEffectiveQuery]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchAssets(lastQuery, false);
    }
  }, [fetchAssets, loading, hasMore, lastQuery]);

  const refetch = useCallback(async () => {
    await fetchAssets(lastQuery, true);
  }, [fetchAssets, lastQuery]);

  const clearCache = useCallback(() => {
    iconScoutService.clearCache();
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && initialQuery) {
      fetchAssets(initialQuery, true);
    }
  }, [type, style, color, category, per_page, theme]); // Re-fetch when theme changes

  return {
    assets,
    loading,
    error,
    hasMore,
    totalCount,
    currentPage: currentPage - 1, // Return the actual current page
    fetchAssets,
    loadMore,
    refetch,
    clearCache,
  };
};

// Hook for fetching a single asset
interface UseSingleIconScoutAssetOptions {
  style?: string;
  color?: string;
  category?: string;
  darkModeQuery?: string;
}

interface UseSingleIconScoutAssetReturn {
  asset: IconScoutAsset | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSingleIconScoutAsset = (
  type: AssetType,
  query: string,
  options: UseSingleIconScoutAssetOptions = {}
): UseSingleIconScoutAssetReturn => {
  const { assets, loading, error, fetchAssets } = useIconScoutAssets(type, query, {
    ...options,
    per_page: 1,
    autoFetch: !!query,
  });

  const refetch = useCallback(async () => {
    if (query) {
      await fetchAssets(query, true);
    }
  }, [fetchAssets, query]);

  return {
    asset: assets[0] || null,
    loading,
    error,
    refetch,
  };
};

// Hook for preloading assets
export const usePreloadIconScoutAssets = () => {
  const preloadAssets = useCallback(async (
    type: AssetType,
    queries: string[],
    options: UseIconScoutAssetsOptions = {}
  ) => {
    const promises = queries.map(query =>
      iconScoutService.fetchIconScoutAssets({
        type,
        query,
        ...options,
        per_page: 5, // Preload a few assets per query
      })
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to preload some IconScout assets:', error);
    }
  }, []);

  return { preloadAssets };
};

// Hook for managing asset favorites/bookmarks
export const useIconScoutFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('iconscout-favorites');
    if (saved) {
      try {
        const favoriteIds = JSON.parse(saved);
        setFavorites(new Set(favoriteIds));
      } catch (error) {
        console.warn('Failed to load IconScout favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('iconscout-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const addFavorite = useCallback((assetId: string) => {
    setFavorites(prev => new Set([...prev, assetId]));
  }, []);

  const removeFavorite = useCallback((assetId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  }, []);

  const toggleFavorite = useCallback((assetId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  }, []);

  const isFavorite = useCallback((assetId: string) => {
    return favorites.has(assetId);
  }, [favorites]);

  return {
    favorites: Array.from(favorites),
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};

export default useIconScoutAssets;