/**
 * Performance Analyzer Service
 * AI-powered performance analysis and optimization recommendations
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface PerformanceAnalysisRequest {
  code: string;
  language: string;
  context?: {
    inputSize?: number;
    expectedUsage?: 'low' | 'medium' | 'high' | 'critical';
    platform?: 'web' | 'mobile' | 'desktop' | 'server';
    constraints?: {
      memoryLimit?: number;
      timeLimit?: number;
      cpuLimit?: number;
    };
  };
}

export interface PerformanceIssue {
  id: string;
  type: 'time-complexity' | 'space-complexity' | 'memory-leak' | 'inefficient-algorithm' | 'redundant-computation' | 'blocking-operation' | 'resource-exhaustion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  location: {
    line: number;
    column: number;
    code: string;
  };
  currentComplexity: string;
  suggestedComplexity: string;
  performanceGain: string;
  solution: string;
  codeExample: string;
  confidence: number;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'algorithm' | 'data-structure' | 'caching' | 'lazy-loading' | 'parallelization' | 'memory-optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImprovement: string;
  implementation: {
    before: string;
    after: string;
    explanation: string;
  };
  tradeoffs: {
    benefits: string[];
    costs: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
}

export interface PerformanceAnalysisResponse {
  overallScore: number; // 0-100
  issues: PerformanceIssue[];
  suggestions: OptimizationSuggestion[];
  metrics: {
    timeComplexity: string;
    spaceComplexity: string;
    estimatedExecutionTime: string;
    memoryUsage: string;
    scalability: 'poor' | 'fair' | 'good' | 'excellent';
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  confidence: number;
  processingTime: number;
}

class PerformanceAnalyzerService {
  private cache = new Map<string, PerformanceAnalysisResponse>();
  private cacheTimeout = 20 * 60 * 1000; // 20 minutes

  constructor() {
    log.info('Performance Analyzer Service initialized', {}, 'PERFORMANCE');
  }

  /**
   * Analyze code performance
   */
  async analyzePerformance(request: PerformanceAnalysisRequest): Promise<PerformanceAnalysisResponse> {
    const startTime = performance.now();
    const requestId = generateId('performance-analysis');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('performance-service', 15, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Analyzing code performance', { 
        requestId, 
        language: request.language,
        codeLength: request.code.length,
        expectedUsage: request.context?.expectedUsage 
      }, 'PERFORMANCE');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached performance analysis', { requestId }, 'PERFORMANCE');
        return cached;
      }

      // Analyze performance
      const issues = await this.identifyPerformanceIssues(request);
      const suggestions = await this.generateOptimizationSuggestions(request);
      const metrics = this.calculatePerformanceMetrics(request);
      const recommendations = this.generateRecommendations(issues, suggestions, request);

      const overallScore = this.calculateOverallScore(issues, metrics);

      const processingTime = performance.now() - startTime;

      const response: PerformanceAnalysisResponse = {
        overallScore,
        issues,
        suggestions,
        metrics,
        recommendations,
        confidence: 0.93,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Performance analysis completed', { 
        requestId, 
        issuesCount: issues.length,
        suggestionsCount: suggestions.length,
        overallScore,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Performance analysis failed', error as Error, 'PERFORMANCE');
      
      // Return fallback response
      return this.getFallbackResponse(request, processingTime);
    }
  }

  /**
   * Identify performance issues
   */
  private async identifyPerformanceIssues(request: PerformanceAnalysisRequest): Promise<PerformanceIssue[]> {
    const { code, language } = request;
    const issues: PerformanceIssue[] = [];

    // Language-specific performance analysis
    switch (language.toLowerCase()) {
      case 'python':
        issues.push(...this.analyzePythonPerformance(code));
        break;
      case 'javascript':
      case 'typescript':
        issues.push(...this.analyzeJavaScriptPerformance(code));
        break;
      case 'java':
        issues.push(...this.analyzeJavaPerformance(code));
        break;
      case 'cpp':
      case 'c':
        issues.push(...this.analyzeCppPerformance(code));
        break;
    }

    // General performance issues
    issues.push(...this.analyzeGeneralPerformance(code, language));

    return issues;
  }

  /**
   * Python performance analysis
   */
  private analyzePythonPerformance(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    const lines = code.split('\n');

    // Check for nested loops (O(n²) complexity)
    if (this.hasNestedLoops(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'time-complexity',
        severity: 'high',
        title: 'Nested Loops Detected',
        description: 'Nested loops create O(n²) time complexity which can be inefficient for large datasets',
        impact: 'Quadratic time complexity can cause significant performance degradation with large inputs',
        location: {
          line: this.findNestedLoopLine(code),
          column: 1,
          code: this.extractNestedLoopCode(code)
        },
        currentComplexity: 'O(n²)',
        suggestedComplexity: 'O(n log n) or O(n)',
        performanceGain: 'Up to 100x faster for large inputs',
        solution: 'Consider using list comprehensions, built-in functions, or more efficient algorithms',
        codeExample: '# Instead of nested loops, use:\nresult = [func(x) for x in data if condition(x)]',
        confidence: 0.95
      });
    }

    // Check for string concatenation in loops
    if (this.hasStringConcatenationInLoop(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'inefficient-algorithm',
        severity: 'medium',
        title: 'String Concatenation in Loop',
        description: 'String concatenation in loops creates new string objects each iteration',
        impact: 'O(n²) time complexity for string operations due to string immutability',
        location: {
          line: this.findStringConcatenationLine(code),
          column: 1,
          code: this.extractStringConcatenationCode(code)
        },
        currentComplexity: 'O(n²)',
        suggestedComplexity: 'O(n)',
        performanceGain: 'Up to 10x faster for large strings',
        solution: 'Use join() method or list comprehension with join()',
        codeExample: '# Instead of:\n# result = ""\n# for item in items:\n#     result += str(item)\n# Use:\nresult = "".join(str(item) for item in items)',
        confidence: 0.9
      });
    }

    // Check for inefficient list operations
    if (this.hasInefficientListOperations(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'inefficient-algorithm',
        severity: 'medium',
        title: 'Inefficient List Operations',
        description: 'Using list operations that could be optimized with built-in functions',
        impact: 'Slower execution due to manual iteration instead of optimized C implementations',
        location: {
          line: 1,
          column: 1,
          code: this.extractInefficientListCode(code)
        },
        currentComplexity: 'O(n) with overhead',
        suggestedComplexity: 'O(n) optimized',
        performanceGain: '2-5x faster execution',
        solution: 'Use built-in functions like map(), filter(), sum(), max(), min()',
        codeExample: '# Instead of manual loops, use:\n# total = sum(numbers)\n# max_val = max(numbers)\n# filtered = list(filter(condition, items))',
        confidence: 0.85
      });
    }

    return issues;
  }

  /**
   * JavaScript performance analysis
   */
  private analyzeJavaScriptPerformance(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for DOM manipulation in loops
    if (this.hasDOMManipulationInLoop(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'blocking-operation',
        severity: 'high',
        title: 'DOM Manipulation in Loop',
        description: 'DOM manipulation inside loops causes multiple reflows and repaints',
        impact: 'Significant performance degradation and poor user experience',
        location: {
          line: this.findDOMManipulationLine(code),
          column: 1,
          code: this.extractDOMManipulationCode(code)
        },
        currentComplexity: 'O(n) with DOM overhead',
        suggestedComplexity: 'O(1) with batch updates',
        performanceGain: 'Up to 50x faster rendering',
        solution: 'Use DocumentFragment or batch DOM updates',
        codeExample: '// Instead of:\n// for (let item of items) {\n//     element.appendChild(createElement(item));\n// }\n// Use:\nconst fragment = document.createDocumentFragment();\nfor (let item of items) {\n    fragment.appendChild(createElement(item));\n}\nelement.appendChild(fragment);',
        confidence: 0.95
      });
    }

    // Check for memory leaks
    if (this.hasPotentialMemoryLeaks(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'memory-leak',
        severity: 'critical',
        title: 'Potential Memory Leak',
        description: 'Code may cause memory leaks due to event listeners or closures',
        impact: 'Memory usage grows over time, eventually causing browser crashes',
        location: {
          line: this.findMemoryLeakLine(code),
          column: 1,
          code: this.extractMemoryLeakCode(code)
        },
        currentComplexity: 'O(n) memory growth',
        suggestedComplexity: 'O(1) memory usage',
        performanceGain: 'Prevents memory exhaustion',
        solution: 'Remove event listeners and avoid circular references',
        codeExample: '// Always remove event listeners:\nelement.removeEventListener("click", handler);\n// Or use AbortController for automatic cleanup',
        confidence: 0.8
      });
    }

    return issues;
  }

  /**
   * Java performance analysis
   */
  private analyzeJavaPerformance(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for inefficient collections usage
    if (this.hasInefficientCollections(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'inefficient-algorithm',
        severity: 'medium',
        title: 'Inefficient Collection Usage',
        description: 'Using inappropriate collection types for the operations performed',
        impact: 'Slower execution due to suboptimal data structure choices',
        location: {
          line: 1,
          column: 1,
          code: this.extractCollectionCode(code)
        },
        currentComplexity: 'O(n) for operations',
        suggestedComplexity: 'O(1) or O(log n)',
        performanceGain: 'Up to 100x faster for frequent operations',
        solution: 'Choose appropriate collection types (HashMap vs ArrayList)',
        codeExample: '// For frequent lookups, use HashMap instead of ArrayList\nMap<String, Object> map = new HashMap<>();',
        confidence: 0.9
      });
    }

    return issues;
  }

  /**
   * C++ performance analysis
   */
  private analyzeCppPerformance(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for unnecessary copies
    if (this.hasUnnecessaryCopies(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'memory-optimization',
        severity: 'medium',
        title: 'Unnecessary Object Copies',
        description: 'Code creates unnecessary copies of objects, wasting memory and CPU',
        impact: 'Increased memory usage and slower execution due to copy operations',
        location: {
          line: this.findCopyLine(code),
          column: 1,
          code: this.extractCopyCode(code)
        },
        currentComplexity: 'O(n) copy overhead',
        suggestedComplexity: 'O(1) with references',
        performanceGain: 'Eliminates copy overhead',
        solution: 'Use references or move semantics to avoid copies',
        codeExample: '// Use const reference:\nvoid process(const std::vector<int>& data) {\n    // Process data without copying\n}',
        confidence: 0.85
      });
    }

    return issues;
  }

  /**
   * General performance analysis
   */
  private analyzeGeneralPerformance(code: string, language: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Check for redundant computations
    if (this.hasRedundantComputations(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'redundant-computation',
        severity: 'medium',
        title: 'Redundant Computations',
        description: 'Same computations are performed multiple times unnecessarily',
        impact: 'Wasted CPU cycles and slower execution',
        location: {
          line: 1,
          column: 1,
          code: this.extractRedundantCode(code)
        },
        currentComplexity: 'O(n) redundant operations',
        suggestedComplexity: 'O(1) with caching',
        performanceGain: 'Eliminates redundant work',
        solution: 'Cache results of expensive computations',
        codeExample: '// Cache expensive computation:\nconst result = expensiveFunction();\n// Use result multiple times',
        confidence: 0.8
      });
    }

    // Check for inefficient algorithms
    if (this.hasInefficientAlgorithms(code)) {
      issues.push({
        id: generateId('performance-issue'),
        type: 'inefficient-algorithm',
        severity: 'high',
        title: 'Inefficient Algorithm',
        description: 'Algorithm could be optimized for better time or space complexity',
        impact: 'Poor scalability and performance with larger inputs',
        location: {
          line: 1,
          column: 1,
          code: this.extractAlgorithmCode(code)
        },
        currentComplexity: 'O(n²) or worse',
        suggestedComplexity: 'O(n log n) or O(n)',
        performanceGain: 'Significant improvement for large inputs',
        solution: 'Use more efficient algorithms or data structures',
        codeExample: '// Consider sorting, hashing, or divide-and-conquer approaches',
        confidence: 0.75
      });
    }

    return issues;
  }

  /**
   * Generate optimization suggestions
   */
  private async generateOptimizationSuggestions(request: PerformanceAnalysisRequest): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    const { code, language, context } = request;

    // Data structure optimizations
    suggestions.push({
      id: generateId('optimization'),
      type: 'data-structure',
      title: 'Optimize Data Structures',
      description: 'Choose more efficient data structures for your use case',
      priority: 'high',
      estimatedImprovement: '2-10x performance gain',
      implementation: {
        before: '// Using inefficient data structure',
        after: '// Using optimized data structure',
        explanation: 'Different data structures have different performance characteristics for various operations'
      },
      tradeoffs: {
        benefits: ['Faster operations', 'Better memory usage', 'Improved scalability'],
        costs: ['May require code refactoring', 'Learning curve for new structures']
      },
      difficulty: 'medium',
      estimatedTime: 30
    });

    // Caching suggestions
    if (this.hasExpensiveComputations(code)) {
      suggestions.push({
        id: generateId('optimization'),
        type: 'caching',
        title: 'Implement Caching',
        description: 'Cache results of expensive computations to avoid redundant work',
        priority: 'medium',
        estimatedImprovement: 'Up to 100x faster for repeated computations',
        implementation: {
          before: '// Expensive computation every time',
          after: '// Cache results and reuse',
          explanation: 'Store results of expensive operations and reuse them when possible'
        },
        tradeoffs: {
          benefits: ['Faster execution', 'Reduced CPU usage'],
          costs: ['Additional memory usage', 'Cache invalidation complexity']
        },
        difficulty: 'easy',
        estimatedTime: 15
      });
    }

    // Parallelization suggestions
    if (context?.platform === 'server' && this.hasParallelizableOperations(code)) {
      suggestions.push({
        id: generateId('optimization'),
        type: 'parallelization',
        title: 'Add Parallelization',
        description: 'Execute independent operations in parallel to improve throughput',
        priority: 'high',
        estimatedImprovement: 'Up to 4x faster on multi-core systems',
        implementation: {
          before: '// Sequential processing',
          after: '// Parallel processing with threads/async',
          explanation: 'Use threading, async/await, or parallel processing for independent operations'
        },
        tradeoffs: {
          benefits: ['Better CPU utilization', 'Faster execution', 'Improved throughput'],
          costs: ['Increased complexity', 'Potential race conditions', 'Memory overhead']
        },
        difficulty: 'hard',
        estimatedTime: 60
      });
    }

    return suggestions;
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(request: PerformanceAnalysisRequest): any {
    const { code, language, context } = request;
    
    // Analyze time complexity
    const timeComplexity = this.analyzeTimeComplexity(code);
    
    // Analyze space complexity
    const spaceComplexity = this.analyzeSpaceComplexity(code);
    
    // Estimate execution time
    const estimatedExecutionTime = this.estimateExecutionTime(code, context);
    
    // Estimate memory usage
    const memoryUsage = this.estimateMemoryUsage(code, context);
    
    // Calculate scalability
    const scalability = this.calculateScalability(timeComplexity, spaceComplexity);
    
    return {
      timeComplexity,
      spaceComplexity,
      estimatedExecutionTime,
      memoryUsage,
      scalability
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: PerformanceIssue[], suggestions: OptimizationSuggestion[], request: PerformanceAnalysisRequest): any {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // Immediate actions (critical issues)
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    criticalIssues.forEach(issue => {
      immediate.push(`Fix ${issue.title}: ${issue.solution}`);
    });

    // Short-term improvements (high priority suggestions)
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    highPrioritySuggestions.forEach(suggestion => {
      shortTerm.push(`Implement ${suggestion.title}: ${suggestion.description}`);
    });

    // Long-term optimizations
    const longTermSuggestions = suggestions.filter(s => s.difficulty === 'hard');
    longTermSuggestions.forEach(suggestion => {
      longTerm.push(`Consider ${suggestion.title} for major performance gains`);
    });

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Calculate overall performance score
   */
  private calculateOverallScore(issues: PerformanceIssue[], metrics: any): number {
    let score = 100;
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 8; break;
        case 'low': score -= 3; break;
      }
    });
    
    // Adjust for complexity
    if (metrics.timeComplexity.includes('O(n²)') || metrics.timeComplexity.includes('O(n³)')) {
      score -= 20;
    }
    
    if (metrics.scalability === 'poor') {
      score -= 15;
    } else if (metrics.scalability === 'fair') {
      score -= 8;
    }
    
    return Math.max(0, score);
  }

  /**
   * Helper methods for analysis
   */
  private hasNestedLoops(code: string): boolean {
    return /for\s+.*:[\s\S]*for\s+.*:/.test(code) || /while\s+.*:[\s\S]*while\s+.*:/.test(code);
  }

  private hasStringConcatenationInLoop(code: string): boolean {
    return /for\s+.*:[\s\S]*\+.*string/.test(code) || /while\s+.*:[\s\S]*\+.*string/.test(code);
  }

  private hasInefficientListOperations(code: string): boolean {
    return /for\s+.*:[\s\S]*if.*in.*list/.test(code);
  }

  private hasDOMManipulationInLoop(code: string): boolean {
    return /for\s+.*:[\s\S]*\.appendChild|\.innerHTML|\.style/.test(code);
  }

  private hasPotentialMemoryLeaks(code: string): boolean {
    return /addEventListener.*function/.test(code) && !/removeEventListener/.test(code);
  }

  private hasInefficientCollections(code: string): boolean {
    return /ArrayList.*contains|ArrayList.*indexOf/.test(code);
  }

  private hasUnnecessaryCopies(code: string): boolean {
    return /=\s*[a-zA-Z_][a-zA-Z0-9_]*\(/.test(code);
  }

  private hasRedundantComputations(code: string): boolean {
    const lines = code.split('\n');
    const computations = new Set();
    
    lines.forEach(line => {
      if (line.includes('=') && !line.includes('//')) {
        computations.add(line.trim());
      }
    });
    
    return computations.size < lines.length * 0.8;
  }

  private hasInefficientAlgorithms(code: string): boolean {
    return this.hasNestedLoops(code) || /for.*for.*for/.test(code);
  }

  private hasExpensiveComputations(code: string): boolean {
    return /Math\.|sqrt|pow|sin|cos|log/.test(code) || /\.sort\(\)/.test(code);
  }

  private hasParallelizableOperations(code: string): boolean {
    return /for\s+.*:/.test(code) || /map\(/.test(code) || /filter\(/.test(code);
  }

  private analyzeTimeComplexity(code: string): string {
    if (this.hasNestedLoops(code)) return 'O(n²)';
    if (/for\s+.*:/.test(code)) return 'O(n)';
    return 'O(1)';
  }

  private analyzeSpaceComplexity(code: string): string {
    if (/\[\]|\{\}/.test(code)) return 'O(n)';
    return 'O(1)';
  }

  private estimateExecutionTime(code: string, context?: any): string {
    const lines = code.split('\n').length;
    const baseTime = lines * 0.001; // 1ms per line
    
    if (this.hasNestedLoops(code)) {
      return `${(baseTime * 100).toFixed(2)}ms (estimated with nested loops)`;
    }
    
    return `${baseTime.toFixed(2)}ms`;
  }

  private estimateMemoryUsage(code: string, context?: any): string {
    const lines = code.split('\n').length;
    const baseMemory = lines * 0.1; // 0.1KB per line
    
    return `${baseMemory.toFixed(1)}KB (estimated)`;
  }

  private calculateScalability(timeComplexity: string, spaceComplexity: string): 'poor' | 'fair' | 'good' | 'excellent' {
    if (timeComplexity.includes('O(n²)') || timeComplexity.includes('O(n³)')) return 'poor';
    if (timeComplexity.includes('O(n log n)')) return 'good';
    if (timeComplexity.includes('O(n)')) return 'fair';
    return 'excellent';
  }

  // Helper methods for extracting code snippets (simplified implementations)
  private findNestedLoopLine(code: string): number { return 1; }
  private extractNestedLoopCode(code: string): string { return '// Nested loop code'; }
  private findStringConcatenationLine(code: string): number { return 1; }
  private extractStringConcatenationCode(code: string): string { return '// String concatenation code'; }
  private extractInefficientListCode(code: string): string { return '// Inefficient list code'; }
  private findDOMManipulationLine(code: string): number { return 1; }
  private extractDOMManipulationCode(code: string): string { return '// DOM manipulation code'; }
  private findMemoryLeakLine(code: string): number { return 1; }
  private extractMemoryLeakCode(code: string): string { return '// Memory leak code'; }
  private extractCollectionCode(code: string): string { return '// Collection code'; }
  private findCopyLine(code: string): number { return 1; }
  private extractCopyCode(code: string): string { return '// Copy code'; }
  private extractRedundantCode(code: string): string { return '// Redundant code'; }
  private extractAlgorithmCode(code: string): string { return '// Algorithm code'; }

  /**
   * Get fallback response
   */
  private getFallbackResponse(request: PerformanceAnalysisRequest, processingTime: number): PerformanceAnalysisResponse {
    return {
      overallScore: 75,
      issues: [],
      suggestions: [{
        id: generateId('optimization'),
        type: 'algorithm',
        title: 'General Performance Optimization',
        description: 'Consider optimizing your code for better performance',
        priority: 'medium',
        estimatedImprovement: 'Moderate improvement',
        implementation: {
          before: '// Current implementation',
          after: '// Optimized implementation',
          explanation: 'General optimization techniques'
        },
        tradeoffs: {
          benefits: ['Better performance'],
          costs: ['Additional development time']
        },
        difficulty: 'medium',
        estimatedTime: 20
      }],
      metrics: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        estimatedExecutionTime: 'Unknown',
        memoryUsage: 'Unknown',
        scalability: 'fair'
      },
      recommendations: {
        immediate: ['Review code for obvious inefficiencies'],
        shortTerm: ['Profile the code to identify bottlenecks'],
        longTerm: ['Consider architectural improvements']
      },
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: PerformanceAnalysisRequest): string {
    const key = `${request.language}-${request.context?.expectedUsage || 'medium'}-${request.code.slice(-100)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): PerformanceAnalysisResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: PerformanceAnalysisResponse): void {
    this.cache.set(key, {
      ...data,
      processingTime: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    log.info('Performance Analyzer Service cache cleared', {}, 'PERFORMANCE');
  }
}

// Create singleton instance
export const performanceAnalyzerService = new PerformanceAnalyzerService();
export default performanceAnalyzerService;
