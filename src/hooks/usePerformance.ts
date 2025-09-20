/**
 * Performance Monitoring Hook
 * Comprehensive performance tracking and optimization utilities
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { PerformanceMonitor } from '@/utils/performance';
import { log } from '@/utils/logger';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentMountTime: number;
  lastUpdate: number;
  renderCount: number;
}

interface PerformanceOptions {
  trackRenders?: boolean;
  trackMemory?: boolean;
  trackMountTime?: boolean;
  logThreshold?: number; // Log if render time exceeds this (ms)
  sampleRate?: number; // Sample every Nth render (default: 1)
}

export function usePerformance(
  componentName: string,
  options: PerformanceOptions = {}
) {
  const {
    trackRenders = true,
    trackMemory = true,
    trackMountTime = true,
    logThreshold = 16, // 16ms = 60fps
    sampleRate = 1,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentMountTime: 0,
    lastUpdate: 0,
    renderCount: 0,
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const timerRef = useRef<PerformanceTimer | null>(null);

  // Track component mount time
  useEffect(() => {
    if (trackMountTime) {
      mountTimeRef.current = performance.now();
      setMetrics(prev => ({
        ...prev,
        componentMountTime: mountTimeRef.current,
      }));
    }
  }, [trackMountTime]);

  // Track render performance
  useEffect(() => {
    if (!trackRenders) return;

    renderCountRef.current += 1;
    
    // Sample rendering based on sample rate
    if (renderCountRef.current % sampleRate !== 0) return;

    const renderStart = performance.now();
    renderStartRef.current = renderStart;

    // Use requestAnimationFrame to measure actual render time
    const measureRender = () => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;

      setMetrics(prev => ({
        ...prev,
        renderTime,
        lastUpdate: renderEnd,
        renderCount: renderCountRef.current,
      }));

      // Log slow renders
      if (renderTime > logThreshold) {
        log.warn('Slow render detected', {
          component: componentName,
          renderTime,
          threshold: logThreshold,
          renderCount: renderCountRef.current,
        });
      }
    };

    requestAnimationFrame(measureRender);
  }, [trackRenders, logThreshold, sampleRate, componentName]);

  // Track memory usage
  useEffect(() => {
    if (!trackMemory) return;

    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

        setMetrics(prev => ({
          ...prev,
          memoryUsage,
        }));
      }
    };

    updateMemoryUsage();
    
    // Update memory usage periodically
    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [trackMemory]);

  // Start timing a specific operation
  const startTiming = useCallback((operationName: string) => {
    timerRef.current = PerformanceMonitor.startTiming(`${componentName}:${operationName}`);
    return timerRef.current;
  }, [componentName]);

  // End timing and get results
  const endTiming = useCallback(() => {
    if (timerRef.current) {
      const result = timerRef.current.end();
      timerRef.current = null;
      return result;
    }
    return null;
  }, []);

  // Measure async operation
  const measureAsync = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const timer = startTiming(operationName);
    try {
      const result = await operation();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }, [startTiming]);

  // Measure sync operation
  const measureSync = useCallback(<T>(
    operationName: string,
    operation: () => T
  ): T => {
    const timer = startTiming(operationName);
    try {
      const result = operation();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }, [startTiming]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    return {
      component: componentName,
      metrics,
      isSlow: metrics.renderTime > logThreshold,
      recommendations: getRecommendations(metrics),
    };
  }, [componentName, metrics, logThreshold]);

  // Get performance recommendations
  const getRecommendations = useCallback((currentMetrics: PerformanceMetrics) => {
    const recommendations: string[] = [];

    if (currentMetrics.renderTime > logThreshold) {
      recommendations.push('Consider using React.memo() to prevent unnecessary re-renders');
      recommendations.push('Check for expensive computations in render method');
      recommendations.push('Consider using useMemo() or useCallback() for expensive operations');
    }

    if (currentMetrics.memoryUsage > 100) { // 100MB threshold
      recommendations.push('High memory usage detected - check for memory leaks');
      recommendations.push('Consider cleaning up event listeners and subscriptions');
    }

    if (currentMetrics.renderCount > 100) {
      recommendations.push('High render count - consider optimizing component structure');
    }

    return recommendations;
  }, [logThreshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        timerRef.current.end();
      }
    };
  }, []);

  return {
    metrics,
    startTiming,
    endTiming,
    measureAsync,
    measureSync,
    getPerformanceSummary,
    getRecommendations,
  };
}

// Hook for tracking specific performance metrics
export function usePerformanceTracker(
  componentName: string,
  dependencies: any[] = []
) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any[]>([]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setTrackingData([]);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const addDataPoint = useCallback((data: any) => {
    if (isTracking) {
      setTrackingData(prev => [...prev, {
        ...data,
        timestamp: performance.now(),
      }]);
    }
  }, [isTracking]);

  // Track dependency changes
  useEffect(() => {
    if (isTracking) {
      addDataPoint({
        type: 'dependency-change',
        dependencies,
      });
    }
  }, dependencies);

  return {
    isTracking,
    trackingData,
    startTracking,
    stopTracking,
    addDataPoint,
  };
}

// Hook for lazy loading performance
export function useLazyLoadPerformance() {
  const [loadTimes, setLoadTimes] = useState<Map<string, number>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());

  const startLoading = useCallback((key: string) => {
    setLoadingStates(prev => new Map(prev).set(key, true));
    return performance.now();
  }, []);

  const finishLoading = useCallback((key: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    setLoadTimes(prev => new Map(prev).set(key, loadTime));
    setLoadingStates(prev => new Map(prev).set(key, false));
    
    log.info('Lazy load completed', {
      key,
      loadTime,
    });
    
    return loadTime;
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates.get(key) || false;
  }, [loadingStates]);

  const getLoadTime = useCallback((key: string) => {
    return loadTimes.get(key) || 0;
  }, [loadTimes]);

  return {
    startLoading,
    finishLoading,
    isLoading,
    getLoadTime,
    loadTimes: Object.fromEntries(loadTimes),
    loadingStates: Object.fromEntries(loadingStates),
  };
}

// Hook for bundle size monitoring
export function useBundleSize() {
  const [bundleInfo, setBundleInfo] = useState<{
    totalSize: number;
    chunkSizes: Record<string, number>;
    loadTime: number;
  } | null>(null);

  useEffect(() => {
    // Monitor bundle loading
    const startTime = performance.now();
    
    const checkBundleSize = () => {
      const loadTime = performance.now() - startTime;
      
      // Estimate bundle size from loaded resources
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      let totalSize = 0;
      const chunkSizes: Record<string, number> = {};
      
      // This is a simplified estimation - in a real app you'd use webpack-bundle-analyzer
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src) {
          // Estimate size based on common patterns
          const estimatedSize = src.includes('chunk') ? 50000 : 100000; // bytes
          chunkSizes[src] = estimatedSize;
          totalSize += estimatedSize;
        }
      });
      
      stylesheets.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const estimatedSize = 20000; // bytes
          chunkSizes[href] = estimatedSize;
          totalSize += estimatedSize;
        }
      });
      
      setBundleInfo({
        totalSize,
        chunkSizes,
        loadTime,
      });
    };

    // Check after initial load
    setTimeout(checkBundleSize, 1000);
  }, []);

  return bundleInfo;
}

export default usePerformance;
