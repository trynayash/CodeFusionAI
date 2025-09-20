/**
 * React Query Configuration
 * Centralized query client with caching, error handling, and performance optimizations
 */

import { QueryClient, DefaultOptions, MutationCache, QueryCache } from '@tanstack/react-query';
import { log } from '@/utils/logger';
import { CacheManager } from '@/utils/performance';

// Default query options for consistent behavior
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Cache for 5 minutes by default
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus for critical data
    refetchOnWindowFocus: true,
    // Don't refetch on reconnect by default (can be overridden per query)
    refetchOnReconnect: 'always',
    // Network mode for offline support
    networkMode: 'online',
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    retryDelay: 1000,
    networkMode: 'online',
  },
};

// Query cache with error handling
const queryCache = new QueryCache({
  onError: (error, query) => {
    log.error('Query failed', error as Error, 'REACT_QUERY', {
      queryKey: query.queryKey,
      queryHash: query.queryHash,
    });
  },
  onSuccess: (data, query) => {
    log.debug('Query succeeded', {
      queryKey: query.queryKey,
      dataSize: JSON.stringify(data).length,
    }, 'REACT_QUERY');
  },
});

// Mutation cache with error handling
const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    log.error('Mutation failed', error as Error, 'REACT_QUERY', {
      mutationKey: mutation.options.mutationKey,
      variables,
    });
  },
  onSuccess: (data, variables, context, mutation) => {
    log.info('Mutation succeeded', {
      mutationKey: mutation.options.mutationKey,
      variables,
    }, 'REACT_QUERY');
  },
});

// Create the query client
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
  queryCache,
  mutationCache,
});

// Query keys factory for consistent key management
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    settings: (userId: string) => [...queryKeys.user.all, 'settings', userId] as const,
    projects: (userId: string) => [...queryKeys.user.all, 'projects', userId] as const,
    snippets: (userId: string) => [...queryKeys.user.all, 'snippets', userId] as const,
    achievements: (userId: string) => [...queryKeys.user.all, 'achievements', userId] as const,
  },
  
  // Project-related queries
  project: {
    all: ['project'] as const,
    detail: (projectId: string) => [...queryKeys.project.all, 'detail', projectId] as const,
    files: (projectId: string) => [...queryKeys.project.all, 'files', projectId] as const,
    collaborators: (projectId: string) => [...queryKeys.project.all, 'collaborators', projectId] as const,
    history: (projectId: string) => [...queryKeys.project.all, 'history', projectId] as const,
    analytics: (projectId: string) => [...queryKeys.project.all, 'analytics', projectId] as const,
  },
  
  // Code execution queries
  execution: {
    all: ['execution'] as const,
    result: (codeHash: string) => [...queryKeys.execution.all, 'result', codeHash] as const,
    history: (userId: string) => [...queryKeys.execution.all, 'history', userId] as const,
  },
  
  // AI-related queries
  ai: {
    all: ['ai'] as const,
    analysis: (codeHash: string) => [...queryKeys.ai.all, 'analysis', codeHash] as const,
    suggestions: (codeHash: string) => [...queryKeys.ai.all, 'suggestions', codeHash] as const,
    explanation: (codeHash: string) => [...queryKeys.ai.all, 'explanation', codeHash] as const,
    optimization: (codeHash: string) => [...queryKeys.ai.all, 'optimization', codeHash] as const,
  },
  
  // Language and template queries
  language: {
    all: ['language'] as const,
    list: () => [...queryKeys.language.all, 'list'] as const,
    templates: (languageId: string) => [...queryKeys.language.all, 'templates', languageId] as const,
    examples: (languageId: string) => [...queryKeys.language.all, 'examples', languageId] as const,
  },
  
  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: (userId: string) => [...queryKeys.dashboard.all, 'stats', userId] as const,
    activity: (userId: string) => [...queryKeys.dashboard.all, 'activity', userId] as const,
    leaderboard: () => [...queryKeys.dashboard.all, 'leaderboard'] as const,
    trending: () => [...queryKeys.dashboard.all, 'trending'] as const,
  },
  
  // Collaboration queries
  collaboration: {
    all: ['collaboration'] as const,
    session: (sessionId: string) => [...queryKeys.collaboration.all, 'session', sessionId] as const,
    participants: (sessionId: string) => [...queryKeys.collaboration.all, 'participants', sessionId] as const,
    changes: (sessionId: string) => [...queryKeys.collaboration.all, 'changes', sessionId] as const,
  },
} as const;

// Cache invalidation helpers
export const invalidateQueries = {
  user: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.activity(userId) });
  },
  
  project: (projectId: string, userId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.project.detail(projectId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.project.files(projectId) });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects(userId) });
    }
  },
  
  execution: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.execution.history(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(userId) });
  },
  
  collaboration: (sessionId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.collaboration.session(sessionId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.collaboration.participants(sessionId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.collaboration.changes(sessionId) });
  },
};

// Prefetch helpers for performance optimization
export const prefetchQueries = {
  userProfile: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.user.profile(userId),
      queryFn: () => fetchUserProfile(userId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
  
  projectFiles: async (projectId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.project.files(projectId),
      queryFn: () => fetchProjectFiles(projectId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
  
  languageTemplates: async (languageId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.language.templates(languageId),
      queryFn: () => fetchLanguageTemplates(languageId),
      staleTime: 30 * 60 * 1000, // 30 minutes (templates don't change often)
    });
  },
};

// Background sync for offline support
export const backgroundSync = {
  syncPendingMutations: async () => {
    const mutationCache = queryClient.getMutationCache();
    const pendingMutations = mutationCache.getAll().filter(
      mutation => mutation.state.status === 'pending'
    );
    
    log.info('Syncing pending mutations', { count: pendingMutations.length }, 'REACT_QUERY');
    
    for (const mutation of pendingMutations) {
      try {
        await mutation.execute();
      } catch (error) {
        log.error('Failed to sync mutation', error as Error, 'REACT_QUERY');
      }
    }
  },
  
  syncStaleQueries: async () => {
    const queryCache = queryClient.getQueryCache();
    const staleQueries = queryCache.getAll().filter(query => query.isStale());
    
    log.info('Syncing stale queries', { count: staleQueries.length }, 'REACT_QUERY');
    
    for (const query of staleQueries) {
      try {
        await query.fetch();
      } catch (error) {
        log.error('Failed to sync query', error as Error, 'REACT_QUERY');
      }
    }
  },
};

// Optimistic updates helpers
export const optimisticUpdates = {
  updateProject: (projectId: string, updates: Partial<any>) => {
    queryClient.setQueryData(queryKeys.project.detail(projectId), (old: any) => ({
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  },
  
  addProjectFile: (projectId: string, file: any) => {
    queryClient.setQueryData(queryKeys.project.files(projectId), (old: any[] = []) => [
      ...old,
      { ...file, id: `temp_${Date.now()}`, createdAt: new Date().toISOString() },
    ]);
  },
  
  updateUserStats: (userId: string, statUpdates: Record<string, number>) => {
    queryClient.setQueryData(queryKeys.dashboard.stats(userId), (old: any) => ({
      ...old,
      ...Object.entries(statUpdates).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: (old?.[key] || 0) + value,
      }), {}),
    }));
  },
};

// Performance monitoring
export const queryPerformance = {
  logSlowQueries: () => {
    const queries = queryClient.getQueryCache().getAll();
    const slowQueries = queries.filter(query => {
      const lastFetch = query.state.dataUpdatedAt;
      const fetchDuration = query.state.fetchStatus === 'fetching' ? 
        Date.now() - lastFetch : 0;
      return fetchDuration > 2000; // Queries taking more than 2 seconds
    });
    
    if (slowQueries.length > 0) {
      log.warn('Slow queries detected', {
        count: slowQueries.length,
        queries: slowQueries.map(q => ({ key: q.queryKey, duration: q.state.dataUpdatedAt })),
      }, 'REACT_QUERY');
    }
  },
  
  getCacheStats: () => {
    const queries = queryClient.getQueryCache().getAll();
    const mutations = queryClient.getMutationCache().getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      totalMutations: mutations.length,
      pendingMutations: mutations.filter(m => m.state.status === 'pending').length,
      cacheSize: JSON.stringify(queryClient.getQueryCache()).length,
    };
  },
};

// Cleanup and memory management
export const queryCleanup = {
  clearStaleQueries: () => {
    const queries = queryClient.getQueryCache().getAll();
    const staleQueries = queries.filter(query => 
      query.isStale() && query.getObserversCount() === 0
    );
    
    staleQueries.forEach(query => {
      queryClient.removeQueries({ queryKey: query.queryKey });
    });
    
    log.info('Cleared stale queries', { count: staleQueries.length }, 'REACT_QUERY');
  },
  
  clearExpiredCache: () => {
    queryClient.clear();
    CacheManager.cleanup();
    log.info('Cleared expired cache', undefined, 'REACT_QUERY');
  },
};

// Mock fetch functions (to be replaced with real API calls)
async function fetchUserProfile(userId: string): Promise<any> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: userId, name: 'User', email: 'user@example.com' };
}

async function fetchProjectFiles(projectId: string): Promise<any[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return [{ id: '1', name: 'main.js', content: 'console.log("Hello");' }];
}

async function fetchLanguageTemplates(languageId: string): Promise<any[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  return [{ id: '1', name: 'Basic Template', code: '// Template code' }];
}

// Initialize query client monitoring
if (typeof window !== 'undefined') {
  // Monitor performance every 30 seconds
  setInterval(() => {
    queryPerformance.logSlowQueries();
  }, 30000);
  
  // Cleanup stale queries every 5 minutes
  setInterval(() => {
    queryCleanup.clearStaleQueries();
  }, 5 * 60 * 1000);
  
  // Background sync when online
  window.addEventListener('online', () => {
    log.info('Connection restored, syncing data', undefined, 'REACT_QUERY');
    backgroundSync.syncPendingMutations();
    backgroundSync.syncStaleQueries();
  });
}

export default queryClient;