import axios from 'axios';

// IconScout API types
export interface IconScoutAsset {
  id: string;
  name: string;
  url: string;
  preview_url: string;
  download_url: string;
  tags: string[];
  category: string;
  style: string;
  format: string;
  color?: string;
  is_premium: boolean;
}

export interface IconScoutResponse {
  icons?: IconScoutAsset[];
  illustrations?: IconScoutAsset[];
  animations?: IconScoutAsset[];
  total: number;
  page: number;
  per_page: number;
}

export type AssetType = '3d-icons' | 'illustrations' | 'lottie-animations' | 'icons';

export interface FetchAssetsParams {
  type: AssetType;
  query?: string;
  style?: string;
  color?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

class IconScoutService {
  private apiKey: string;
  private baseUrl = 'https://api.iconscout.com/v3';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = import.meta.env.VITE_ICONSCOUT_API_KEY;
    if (!this.apiKey) {
      console.warn('IconScout API key not found in environment variables');
    }
  }

  private getCacheKey(params: FetchAssetsParams): string {
    return JSON.stringify(params);
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          ...params,
          per_page: params.per_page || 20,
          page: params.page || 1,
        },
      });

      return response.data;
    } catch (error) {
      console.error('IconScout API Error:', error);
      throw new Error('Failed to fetch assets from IconScout');
    }
  }

  async fetchIconScoutAssets(params: FetchAssetsParams): Promise<IconScoutResponse> {
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.get(cacheKey);

    // Return cached data if valid
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      let endpoint = '';
      let apiParams: Record<string, any> = {};

      // Map asset types to API endpoints
      switch (params.type) {
        case '3d-icons':
          endpoint = '/search/icons';
          apiParams = {
            ...apiParams,
            style: '3d',
            query: params.query || '',
          };
          break;
        case 'illustrations':
          endpoint = '/search/illustrations';
          apiParams = {
            query: params.query || '',
          };
          break;
        case 'lottie-animations':
          endpoint = '/search/animations';
          apiParams = {
            format: 'lottie',
            query: params.query || '',
          };
          break;
        case 'icons':
          endpoint = '/search/icons';
          apiParams = {
            query: params.query || '',
          };
          break;
        default:
          throw new Error(`Unsupported asset type: ${params.type}`);
      }

      // Add optional filters
      if (params.style) apiParams.style = params.style;
      if (params.color) apiParams.color = params.color;
      if (params.category) apiParams.category = params.category;
      if (params.page) apiParams.page = params.page;
      if (params.per_page) apiParams.per_page = params.per_page;

      const data = await this.makeRequest(endpoint, apiParams);

      // Transform response to match our interface
      const transformedData: IconScoutResponse = {
        total: data.total || 0,
        page: data.page || 1,
        per_page: data.per_page || 20,
      };

      // Map the response based on asset type
      if (params.type === '3d-icons' || params.type === 'icons') {
        transformedData.icons = data.icons?.map((icon: any) => ({
          id: icon.id,
          name: icon.name,
          url: icon.urls?.png || icon.urls?.svg || icon.url,
          preview_url: icon.urls?.png_128 || icon.urls?.svg,
          download_url: icon.download_url,
          tags: icon.tags || [],
          category: icon.category,
          style: icon.style,
          format: icon.format,
          color: icon.color,
          is_premium: icon.is_premium || false,
        })) || [];
      } else if (params.type === 'illustrations') {
        transformedData.illustrations = data.illustrations?.map((illustration: any) => ({
          id: illustration.id,
          name: illustration.name,
          url: illustration.urls?.png || illustration.urls?.svg || illustration.url,
          preview_url: illustration.urls?.png_400 || illustration.urls?.svg,
          download_url: illustration.download_url,
          tags: illustration.tags || [],
          category: illustration.category,
          style: illustration.style,
          format: illustration.format,
          is_premium: illustration.is_premium || false,
        })) || [];
      } else if (params.type === 'lottie-animations') {
        transformedData.animations = data.animations?.map((animation: any) => ({
          id: animation.id,
          name: animation.name,
          url: animation.urls?.lottie || animation.url,
          preview_url: animation.urls?.gif || animation.urls?.mp4,
          download_url: animation.download_url,
          tags: animation.tags || [],
          category: animation.category,
          style: animation.style,
          format: 'lottie',
          is_premium: animation.is_premium || false,
        })) || [];
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now(),
      });

      return transformedData;
    } catch (error) {
      console.error('Error fetching IconScout assets:', error);
      
      // Return fallback data structure
      return {
        total: 0,
        page: 1,
        per_page: 20,
        icons: params.type === '3d-icons' || params.type === 'icons' ? [] : undefined,
        illustrations: params.type === 'illustrations' ? [] : undefined,
        animations: params.type === 'lottie-animations' ? [] : undefined,
      };
    }
  }

  // Convenience methods for specific asset types
  async fetch3DIcons(query?: string, options?: Omit<FetchAssetsParams, 'type' | 'query'>) {
    return this.fetchIconScoutAssets({ type: '3d-icons', query, ...options });
  }

  async fetchIllustrations(query?: string, options?: Omit<FetchAssetsParams, 'type' | 'query'>) {
    return this.fetchIconScoutAssets({ type: 'illustrations', query, ...options });
  }

  async fetchLottieAnimations(query?: string, options?: Omit<FetchAssetsParams, 'type' | 'query'>) {
    return this.fetchIconScoutAssets({ type: 'lottie-animations', query, ...options });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const iconScoutService = new IconScoutService();

// Export utility function for backward compatibility
export const fetchIconScoutAssets = (type: AssetType, query?: string, options?: Omit<FetchAssetsParams, 'type' | 'query'>) => {
  return iconScoutService.fetchIconScoutAssets({ type, query, ...options });
};