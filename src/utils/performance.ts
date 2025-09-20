/**
 * Performance Optimization Utilities
 * Comprehensive performance monitoring and optimization tools
 */

import { log } from './logger';

// Performance Monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static observers: PerformanceObserver[] = [];

  static startTiming(name: string): PerformanceTimer {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    return {
      name,
      startTime,
      startMemory,
      end: () => this.endTiming(name, startTime, startMemory)
    };
  }

  private static endTiming(name: string, startTime: number, startMemory: number): PerformanceResult {
    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;

    const result: PerformanceResult = {
      name,
      duration,
      memoryDelta,
      timestamp: Date.now()
    };

    // Store metric
    const existing = this.metrics.get(name);
    if (existing) {
      existing.count++;
      existing.totalDuration += duration;
      existing.averageDuration = existing.totalDuration / existing.count;
      existing.minDuration = Math.min(existing.minDuration, duration);
      existing.maxDuration = Math.max(existing.maxDuration, duration);
      existing.lastExecution = result.timestamp;
    } else {
      this.metrics.set(name, {
        name,
        count: 1,
        totalDuration: duration,
        averageDuration: duration,
        minDuration: duration,
        maxDuration: duration,
        lastExecution: result.timestamp
      });
    }

    // Log slow operations
    if (duration > 1000) {
      log.warn(`Slow operation detected: ${name}`, { duration, memoryDelta }, 'PERFORMANCE');
    }

    return result;
  }

  private static getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  static getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  static getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }

  // Web Vitals monitoring
  static initWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1];
      log.perf('LCP', lcp.startTime, { element: lcp.element });
    });

    // First Input Delay
    this.observePerformanceEntries('first-input', (entries) => {
      const fid = entries[0];
      log.perf('FID', fid.processingStart - fid.startTime, { eventType: fid.name });
    });

    // Cumulative Layout Shift
    this.observePerformanceEntries('layout-shift', (entries) => {
      let cls = 0;
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      }
      if (cls > 0) {
        log.perf('CLS', cls);
      }
    });

    // Navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          log.perf('Page Load', navigation.loadEventEnd - navigation.fetchStart, {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstByte: navigation.responseStart - navigation.fetchStart,
            domInteractive: navigation.domInteractive - navigation.fetchStart
          });
        }
      }, 0);
    });
  }

  private static observePerformanceEntries(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      log.warn(`Failed to observe ${type}`, error, 'PERFORMANCE');
    }
  }

  static disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Caching System
export class CacheManager {
  private static cache: Map<string, CacheEntry> = new Map();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 100;

  static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    // Cleanup expired entries if cache is getting full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    const entry: CacheEntry = {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0
    };

    this.cache.set(key, entry);
    log.debug(`Cache set: ${key}`, { ttl, cacheSize: this.cache.size }, 'CACHE');
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      log.debug(`Cache miss: ${key}`, undefined, 'CACHE');
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      log.debug(`Cache expired: ${key}`, { age: now - entry.timestamp }, 'CACHE');
      return null;
    }

    entry.hits++;
    log.debug(`Cache hit: ${key}`, { hits: entry.hits, age: now - entry.timestamp }, 'CACHE');
    return entry.value as T;
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      log.debug(`Cache deleted: ${key}`, { cacheSize: this.cache.size }, 'CACHE');
    }
    return deleted;
  }

  static clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    log.info(`Cache cleared`, { previousSize: size }, 'CACHE');
  }

  static cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      log.info(`Cache cleanup completed`, { cleaned, remaining: this.cache.size }, 'CACHE');
    }
  }

  static getStats(): CacheStats {
    const now = Date.now();
    let totalHits = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      }
    }

    return {
      size: this.cache.size,
      totalHits,
      expiredEntries,
      hitRate: totalHits > 0 ? totalHits / (totalHits + expiredEntries) : 0
    };
  }
}

// Resource Loading Optimization
export class ResourceLoader {
  private static loadedResources: Set<string> = new Set();
  private static loadingPromises: Map<string, Promise<unknown>> = new Map();

  static async loadScript(src: string, options: LoadScriptOptions = {}): Promise<void> {
    if (this.loadedResources.has(src)) {
      return Promise.resolve();
    }

    const existingPromise = this.loadingPromises.get(src);
    if (existingPromise) {
      return existingPromise as Promise<void>;
    }

    const timer = PerformanceMonitor.startTiming(`load-script-${src}`);
    
    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async !== false;
      script.defer = options.defer === true;
      
      if (options.integrity) {
        script.integrity = options.integrity;
        script.crossOrigin = 'anonymous';
      }

      script.onload = () => {
        this.loadedResources.add(src);
        this.loadingPromises.delete(src);
        timer.end();
        resolve();
      };

      script.onerror = () => {
        this.loadingPromises.delete(src);
        timer.end();
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  static async loadCSS(href: string, options: LoadCSSOptions = {}): Promise<void> {
    if (this.loadedResources.has(href)) {
      return Promise.resolve();
    }

    const existingPromise = this.loadingPromises.get(href);
    if (existingPromise) {
      return existingPromise as Promise<void>;
    }

    const timer = PerformanceMonitor.startTiming(`load-css-${href}`);

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      if (options.integrity) {
        link.integrity = options.integrity;
        link.crossOrigin = 'anonymous';
      }

      link.onload = () => {
        this.loadedResources.add(href);
        this.loadingPromises.delete(href);
        timer.end();
        resolve();
      };

      link.onerror = () => {
        this.loadingPromises.delete(href);
        timer.end();
        reject(new Error(`Failed to load CSS: ${href}`));
      };

      document.head.appendChild(link);
    });

    this.loadingPromises.set(href, promise);
    return promise;
  }

  static preloadResource(href: string, as: string, type?: string): void {
    if (this.loadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (type) {
      link.type = type;
    }

    document.head.appendChild(link);
    log.debug(`Resource preloaded: ${href}`, { as, type }, 'RESOURCE');
  }

  static prefetchResource(href: string): void {
    if (this.loadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;

    document.head.appendChild(link);
    log.debug(`Resource prefetched: ${href}`, undefined, 'RESOURCE');
  }
}

// Image Optimization
export class ImageOptimizer {
  private static readonly SUPPORTED_FORMATS = ['webp', 'avif', 'jpg', 'png'];
  private static formatSupport: Map<string, boolean> = new Map();

  static async checkFormatSupport(): Promise<void> {
    const checks = [
      { format: 'webp', data: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA' },
      { format: 'avif', data: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' }
    ];

    for (const { format, data } of checks) {
      try {
        const supported = await this.testImageFormat(data);
        this.formatSupport.set(format, supported);
        log.debug(`Image format ${format}: ${supported ? 'supported' : 'not supported'}`, undefined, 'IMAGE');
      } catch (error) {
        this.formatSupport.set(format, false);
      }
    }
  }

  private static testImageFormat(data: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = data;
    });
  }

  static getBestFormat(originalFormat: string): string {
    if (this.formatSupport.get('avif')) return 'avif';
    if (this.formatSupport.get('webp')) return 'webp';
    return originalFormat;
  }

  static generateSrcSet(basePath: string, sizes: number[], format?: string): string {
    const ext = format || 'jpg';
    return sizes
      .map(size => `${basePath}_${size}w.${ext} ${size}w`)
      .join(', ');
  }

  static lazyLoadImage(img: HTMLImageElement, options: LazyLoadOptions = {}): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            const src = image.dataset.src;
            const srcset = image.dataset.srcset;

            if (src) {
              image.src = src;
              image.removeAttribute('data-src');
            }

            if (srcset) {
              image.srcset = srcset;
              image.removeAttribute('data-srcset');
            }

            image.classList.remove('lazy');
            observer.unobserve(image);
          }
        });
      }, {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      });

      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      
      if (src) img.src = src;
      if (srcset) img.srcset = srcset;
    }
  }
}

// Bundle Analysis
export class BundleAnalyzer {
  private static chunks: Map<string, ChunkInfo> = new Map();

  static recordChunkLoad(chunkName: string, size: number, loadTime: number): void {
    this.chunks.set(chunkName, {
      name: chunkName,
      size,
      loadTime,
      timestamp: Date.now()
    });

    log.perf(`Chunk loaded: ${chunkName}`, loadTime, { size });
  }

  static getChunkStats(): ChunkInfo[] {
    return Array.from(this.chunks.values());
  }

  static getTotalBundleSize(): number {
    return Array.from(this.chunks.values()).reduce((total, chunk) => total + chunk.size, 0);
  }

  static getSlowChunks(threshold: number = 1000): ChunkInfo[] {
    return Array.from(this.chunks.values()).filter(chunk => chunk.loadTime > threshold);
  }
}

// Memory Management
export class MemoryManager {
  private static readonly MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB
  private static cleanupCallbacks: (() => void)[] = [];

  static addCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  static removeCleanupCallback(callback: () => void): void {
    const index = this.cleanupCallbacks.indexOf(callback);
    if (index > -1) {
      this.cleanupCallbacks.splice(index, 1);
    }
  }

  static checkMemoryUsage(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize;
    const limit = memory.jsHeapSizeLimit;

    if (used > this.MEMORY_THRESHOLD) {
      log.warn('High memory usage detected', { 
        used: Math.round(used / 1024 / 1024), 
        limit: Math.round(limit / 1024 / 1024),
        percentage: Math.round((used / limit) * 100)
      }, 'MEMORY');

      this.runCleanup();
    }
  }

  private static runCleanup(): void {
    log.info('Running memory cleanup', { callbacks: this.cleanupCallbacks.length }, 'MEMORY');
    
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        log.error('Cleanup callback failed', error as Error, 'MEMORY');
      }
    });

    // Clear caches
    CacheManager.cleanup();

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  static startMemoryMonitoring(): void {
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000); // Check every 30 seconds
  }
}

// Types
interface PerformanceTimer {
  name: string;
  startTime: number;
  startMemory: number;
  end: () => PerformanceResult;
}

interface PerformanceResult {
  name: string;
  duration: number;
  memoryDelta: number;
  timestamp: number;
}

interface PerformanceMetric {
  name: string;
  count: number;
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  lastExecution: number;
}

interface CacheEntry {
  value: unknown;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheStats {
  size: number;
  totalHits: number;
  expiredEntries: number;
  hitRate: number;
}

interface LoadScriptOptions {
  async?: boolean;
  defer?: boolean;
  integrity?: string;
}

interface LoadCSSOptions {
  integrity?: string;
}

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
}

interface ChunkInfo {
  name: string;
  size: number;
  loadTime: number;
  timestamp: number;
}

// Initialize performance monitoring
export function initializePerformance(): void {
  PerformanceMonitor.initWebVitals();
  ImageOptimizer.checkFormatSupport();
  MemoryManager.startMemoryMonitoring();
  
  // Cleanup caches periodically
  setInterval(() => {
    CacheManager.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes

  log.info('Performance monitoring initialized');
}