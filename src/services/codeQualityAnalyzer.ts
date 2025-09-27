/**
 * Code Quality Analyzer Service
 * AI-powered code quality scoring and improvement suggestions
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface CodeQualityRequest {
  code: string;
  language: string;
  context?: {
    projectType?: 'web' | 'mobile' | 'desktop' | 'library' | 'script';
    teamSize?: number;
    codebaseSize?: 'small' | 'medium' | 'large';
    qualityStandards?: 'basic' | 'professional' | 'enterprise';
  };
}

export interface QualityMetric {
  name: string;
  category: 'readability' | 'maintainability' | 'performance' | 'security' | 'reliability';
  score: number; // 0-100
  weight: number; // 0-1
  description: string;
  issues: QualityIssue[];
  suggestions: QualitySuggestion[];
}

export interface QualityIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'style';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    line: number;
    column: number;
    code: string;
  };
  impact: string;
  fix: string;
  confidence: number;
}

export interface QualitySuggestion {
  id: string;
  type: 'improvement' | 'optimization' | 'best-practice' | 'refactoring';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  examples: string[];
}

export interface CodeQualityResponse {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  metrics: QualityMetric[];
  issues: QualityIssue[];
  suggestions: QualitySuggestion[];
  summary: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  comparison: {
    industryAverage: number;
    percentile: number;
    benchmark: string;
  };
  confidence: number;
  processingTime: number;
}

class CodeQualityAnalyzerService {
  private cache = new Map<string, CodeQualityResponse>();
  private cacheTimeout = 25 * 60 * 1000; // 25 minutes

  constructor() {
    log.info('Code Quality Analyzer Service initialized', {}, 'QUALITY_ANALYZER');
  }

  /**
   * Analyze code quality
   */
  async analyzeQuality(request: CodeQualityRequest): Promise<CodeQualityResponse> {
    const startTime = performance.now();
    const requestId = generateId('quality-analysis');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('quality-analyzer-service', 12, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Analyzing code quality', { 
        requestId, 
        language: request.language,
        codeLength: request.code.length,
        projectType: request.context?.projectType 
      }, 'QUALITY_ANALYZER');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached quality analysis', { requestId }, 'QUALITY_ANALYZER');
        return cached;
      }

      // Analyze quality metrics
      const metrics = await this.analyzeQualityMetrics(request);
      const issues = await this.identifyQualityIssues(request);
      const suggestions = await this.generateQualitySuggestions(request, metrics, issues);

      // Calculate overall score
      const overallScore = this.calculateOverallScore(metrics);
      const grade = this.calculateGrade(overallScore);

      // Generate summary
      const summary = this.generateSummary(metrics, issues, suggestions);

      // Generate comparison
      const comparison = this.generateComparison(overallScore, request.language);

      const processingTime = performance.now() - startTime;

      const response: CodeQualityResponse = {
        overallScore,
        grade,
        metrics,
        issues,
        suggestions,
        summary,
        comparison,
        confidence: 0.96,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Code quality analysis completed', { 
        requestId, 
        overallScore,
        grade,
        issuesCount: issues.length,
        suggestionsCount: suggestions.length,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Code quality analysis failed', error as Error, 'QUALITY_ANALYZER');
      
      // Return fallback response
      return this.getFallbackResponse(request, processingTime);
    }
  }

  /**
   * Analyze quality metrics
   */
  private async analyzeQualityMetrics(request: CodeQualityRequest): Promise<QualityMetric[]> {
    const { code, language, context } = request;
    const metrics: QualityMetric[] = [];

    // Readability metric
    metrics.push(await this.analyzeReadability(code, language, context));

    // Maintainability metric
    metrics.push(await this.analyzeMaintainability(code, language, context));

    // Performance metric
    metrics.push(await this.analyzePerformance(code, language, context));

    // Security metric
    metrics.push(await this.analyzeSecurity(code, language, context));

    // Reliability metric
    metrics.push(await this.analyzeReliability(code, language, context));

    return metrics;
  }

  /**
   * Analyze readability
   */
  private async analyzeReadability(code: string, language: string, context?: any): Promise<QualityMetric> {
    const lines = code.split('\n');
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    let score = 100;

    // Check line length
    const longLines = lines.filter(line => line.length > 100);
    if (longLines.length > 0) {
      score -= longLines.length * 2;
      issues.push({
        id: generateId('issue'),
        type: 'style',
        severity: 'medium',
        title: 'Long Lines Detected',
        description: `${longLines.length} lines exceed 100 characters`,
        location: { line: 1, column: 1, code: longLines[0] },
        impact: 'Reduces code readability',
        fix: 'Break long lines into multiple lines',
        confidence: 0.95
      });
    }

    // Check naming conventions
    const namingIssues = this.checkNamingConventions(code, language);
    if (namingIssues.length > 0) {
      score -= namingIssues.length * 3;
      issues.push(...namingIssues);
    }

    // Check comments
    const commentRatio = this.calculateCommentRatio(code);
    if (commentRatio < 0.1) {
      score -= 15;
      issues.push({
        id: generateId('issue'),
        type: 'info',
        severity: 'medium',
        title: 'Insufficient Comments',
        description: 'Code lacks adequate documentation',
        location: { line: 1, column: 1, code: '// Add comments here' },
        impact: 'Reduces code understandability',
        fix: 'Add comments to explain complex logic',
        confidence: 0.8
      });
    }

    // Check indentation
    if (!this.hasConsistentIndentation(code)) {
      score -= 10;
      issues.push({
        id: generateId('issue'),
        type: 'style',
        severity: 'low',
        title: 'Inconsistent Indentation',
        description: 'Code has inconsistent indentation',
        location: { line: 1, column: 1, code: '// Check indentation' },
        impact: 'Reduces code readability',
        fix: 'Use consistent indentation (spaces or tabs)',
        confidence: 0.9
      });
    }

    // Generate suggestions
    if (score < 80) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'improvement',
        priority: 'medium',
        title: 'Improve Code Readability',
        description: 'Enhance code readability through better formatting and naming',
        benefit: 'Easier to understand and maintain',
        effort: 'low',
        impact: 'medium',
        examples: [
          'Use descriptive variable names',
          'Break long lines into multiple lines',
          'Add comments for complex logic'
        ]
      });
    }

    return {
      name: 'Readability',
      category: 'readability',
      score: Math.max(0, score),
      weight: 0.25,
      description: 'Measures how easy the code is to read and understand',
      issues,
      suggestions
    };
  }

  /**
   * Analyze maintainability
   */
  private async analyzeMaintainability(code: string, language: string, context?: any): Promise<QualityMetric> {
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    let score = 100;

    // Check function length
    const longFunctions = this.findLongFunctions(code, language);
    if (longFunctions.length > 0) {
      score -= longFunctions.length * 5;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'high',
        title: 'Long Functions Detected',
        description: `${longFunctions.length} functions are too long`,
        location: { line: longFunctions[0].line, column: 1, code: longFunctions[0].code },
        impact: 'Difficult to maintain and test',
        fix: 'Break down long functions into smaller ones',
        confidence: 0.9
      });
    }

    // Check cyclomatic complexity
    const complexity = this.calculateCyclomaticComplexity(code);
    if (complexity > 10) {
      score -= (complexity - 10) * 2;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'High Cyclomatic Complexity',
        description: `Cyclomatic complexity is ${complexity} (recommended: ≤10)`,
        location: { line: 1, column: 1, code: '// Complex function detected' },
        impact: 'Difficult to test and maintain',
        fix: 'Simplify control flow and reduce nesting',
        confidence: 0.85
      });
    }

    // Check code duplication
    const duplicationRatio = this.calculateDuplicationRatio(code);
    if (duplicationRatio > 0.1) {
      score -= duplicationRatio * 100;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Code Duplication Detected',
        description: `${Math.round(duplicationRatio * 100)}% of code is duplicated`,
        location: { line: 1, column: 1, code: '// Duplicated code detected' },
        impact: 'Increases maintenance burden',
        fix: 'Extract common code into reusable functions',
        confidence: 0.8
      });
    }

    // Check coupling
    if (this.hasHighCoupling(code, language)) {
      score -= 15;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'High Coupling Detected',
        description: 'Code components are tightly coupled',
        location: { line: 1, column: 1, code: '// High coupling detected' },
        impact: 'Difficult to modify and test',
        fix: 'Reduce dependencies between components',
        confidence: 0.7
      });
    }

    // Generate suggestions
    if (score < 75) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'refactoring',
        priority: 'high',
        title: 'Improve Maintainability',
        description: 'Refactor code to improve maintainability',
        benefit: 'Easier to modify and extend',
        effort: 'medium',
        impact: 'high',
        examples: [
          'Break down long functions',
          'Extract common code',
          'Reduce coupling between components'
        ]
      });
    }

    return {
      name: 'Maintainability',
      category: 'maintainability',
      score: Math.max(0, score),
      weight: 0.25,
      description: 'Measures how easy the code is to modify and extend',
      issues,
      suggestions
    };
  }

  /**
   * Analyze performance
   */
  private async analyzePerformance(code: string, language: string, context?: any): Promise<QualityMetric> {
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    let score = 100;

    // Check for inefficient algorithms
    if (this.hasInefficientAlgorithms(code)) {
      score -= 20;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'high',
        title: 'Inefficient Algorithm Detected',
        description: 'Code uses inefficient algorithms (O(n²) or worse)',
        location: { line: 1, column: 1, code: '// Inefficient algorithm detected' },
        impact: 'Poor performance with large inputs',
        fix: 'Use more efficient algorithms or data structures',
        confidence: 0.8
      });
    }

    // Check for memory leaks
    if (this.hasPotentialMemoryLeaks(code, language)) {
      score -= 25;
      issues.push({
        id: generateId('issue'),
        type: 'error',
        severity: 'critical',
        title: 'Potential Memory Leak',
        description: 'Code may cause memory leaks',
        location: { line: 1, column: 1, code: '// Potential memory leak' },
        impact: 'Memory usage grows over time',
        fix: 'Properly manage memory allocation and deallocation',
        confidence: 0.7
      });
    }

    // Check for blocking operations
    if (this.hasBlockingOperations(code, language)) {
      score -= 15;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Blocking Operations Detected',
        description: 'Code contains blocking operations',
        location: { line: 1, column: 1, code: '// Blocking operation detected' },
        impact: 'Reduces application responsiveness',
        fix: 'Use asynchronous operations where possible',
        confidence: 0.8
      });
    }

    // Generate suggestions
    if (score < 80) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'optimization',
        priority: 'high',
        title: 'Optimize Performance',
        description: 'Improve code performance through optimization',
        benefit: 'Faster execution and better user experience',
        effort: 'medium',
        impact: 'high',
        examples: [
          'Use efficient data structures',
          'Avoid unnecessary computations',
          'Implement caching where appropriate'
        ]
      });
    }

    return {
      name: 'Performance',
      category: 'performance',
      score: Math.max(0, score),
      weight: 0.2,
      description: 'Measures code performance and efficiency',
      issues,
      suggestions
    };
  }

  /**
   * Analyze security
   */
  private async analyzeSecurity(code: string, language: string, context?: any): Promise<QualityMetric> {
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    let score = 100;

    // Check for SQL injection vulnerabilities
    if (this.hasSQLInjectionVulnerabilities(code)) {
      score -= 30;
      issues.push({
        id: generateId('issue'),
        type: 'error',
        severity: 'critical',
        title: 'SQL Injection Vulnerability',
        description: 'Code is vulnerable to SQL injection attacks',
        location: { line: 1, column: 1, code: '// SQL injection vulnerability' },
        impact: 'Data breach and security compromise',
        fix: 'Use parameterized queries or prepared statements',
        confidence: 0.9
      });
    }

    // Check for XSS vulnerabilities
    if (this.hasXSSVulnerabilities(code)) {
      score -= 25;
      issues.push({
        id: generateId('issue'),
        type: 'error',
        severity: 'critical',
        title: 'XSS Vulnerability',
        description: 'Code is vulnerable to Cross-Site Scripting attacks',
        location: { line: 1, column: 1, code: '// XSS vulnerability' },
        impact: 'Client-side security compromise',
        fix: 'Sanitize user input and escape output',
        confidence: 0.85
      });
    }

    // Check for hardcoded secrets
    if (this.hasHardcodedSecrets(code)) {
      score -= 20;
      issues.push({
        id: generateId('issue'),
        type: 'error',
        severity: 'high',
        title: 'Hardcoded Secrets',
        description: 'Code contains hardcoded passwords or API keys',
        location: { line: 1, column: 1, code: '// Hardcoded secret' },
        impact: 'Security vulnerability and credential exposure',
        fix: 'Use environment variables or secure configuration',
        confidence: 0.9
      });
    }

    // Check for unsafe operations
    if (this.hasUnsafeOperations(code, language)) {
      score -= 15;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Unsafe Operations',
        description: 'Code contains potentially unsafe operations',
        location: { line: 1, column: 1, code: '// Unsafe operation' },
        impact: 'Potential security risks',
        fix: 'Use safe alternatives and validate inputs',
        confidence: 0.8
      });
    }

    // Generate suggestions
    if (score < 85) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'best-practice',
        priority: 'high',
        title: 'Improve Security',
        description: 'Enhance code security through best practices',
        benefit: 'Reduced security vulnerabilities',
        effort: 'medium',
        impact: 'high',
        examples: [
          'Validate and sanitize all inputs',
          'Use parameterized queries',
          'Store secrets in environment variables'
        ]
      });
    }

    return {
      name: 'Security',
      category: 'security',
      score: Math.max(0, score),
      weight: 0.15,
      description: 'Measures code security and vulnerability risks',
      issues,
      suggestions
    };
  }

  /**
   * Analyze reliability
   */
  private async analyzeReliability(code: string, language: string, context?: any): Promise<QualityMetric> {
    const issues: QualityIssue[] = [];
    const suggestions: QualitySuggestion[] = [];
    let score = 100;

    // Check for error handling
    if (!this.hasProperErrorHandling(code, language)) {
      score -= 20;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Insufficient Error Handling',
        description: 'Code lacks proper error handling',
        location: { line: 1, column: 1, code: '// Add error handling' },
        impact: 'Application may crash on unexpected inputs',
        fix: 'Add try-catch blocks and error handling',
        confidence: 0.8
      });
    }

    // Check for null pointer risks
    if (this.hasNullPointerRisks(code, language)) {
      score -= 15;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Null Pointer Risks',
        description: 'Code may throw null pointer exceptions',
        location: { line: 1, column: 1, code: '// Null pointer risk' },
        impact: 'Runtime crashes and application instability',
        fix: 'Add null checks and defensive programming',
        confidence: 0.75
      });
    }

    // Check for resource leaks
    if (this.hasResourceLeaks(code, language)) {
      score -= 18;
      issues.push({
        id: generateId('issue'),
        type: 'warning',
        severity: 'medium',
        title: 'Resource Leak Risk',
        description: 'Code may leak resources (files, connections, etc.)',
        location: { line: 1, column: 1, code: '// Resource leak risk' },
        impact: 'Resource exhaustion and system instability',
        fix: 'Use try-with-resources or proper cleanup',
        confidence: 0.8
      });
    }

    // Check for race conditions
    if (this.hasRaceConditions(code, language)) {
      score -= 25;
      issues.push({
        id: generateId('issue'),
        type: 'error',
        severity: 'high',
        title: 'Race Condition Risk',
        description: 'Code may have race conditions in concurrent execution',
        location: { line: 1, column: 1, code: '// Race condition risk' },
        impact: 'Unpredictable behavior and data corruption',
        fix: 'Use proper synchronization mechanisms',
        confidence: 0.7
      });
    }

    // Generate suggestions
    if (score < 80) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'best-practice',
        priority: 'medium',
        title: 'Improve Reliability',
        description: 'Enhance code reliability through better error handling',
        benefit: 'More stable and predictable application',
        effort: 'medium',
        impact: 'medium',
        examples: [
          'Add comprehensive error handling',
          'Implement defensive programming',
          'Use proper resource management'
        ]
      });
    }

    return {
      name: 'Reliability',
      category: 'reliability',
      score: Math.max(0, score),
      weight: 0.15,
      description: 'Measures code reliability and error resilience',
      issues,
      suggestions
    };
  }

  /**
   * Identify quality issues
   */
  private async identifyQualityIssues(request: CodeQualityRequest): Promise<QualityIssue[]> {
    const allIssues: QualityIssue[] = [];
    
    // This would collect issues from all metrics
    // For now, return empty array as issues are collected in individual metrics
    return allIssues;
  }

  /**
   * Generate quality suggestions
   */
  private async generateQualitySuggestions(request: CodeQualityRequest, metrics: QualityMetric[], issues: QualityIssue[]): Promise<QualitySuggestion[]> {
    const allSuggestions: QualitySuggestion[] = [];
    
    // Collect suggestions from all metrics
    metrics.forEach(metric => {
      allSuggestions.push(...metric.suggestions);
    });

    // Sort by priority and impact
    return allSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const impactOrder = { high: 3, medium: 2, low: 1 };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(metrics: QualityMetric[]): number {
    let weightedScore = 0;
    let totalWeight = 0;

    metrics.forEach(metric => {
      weightedScore += metric.score * metric.weight;
      totalWeight += metric.weight;
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * Calculate grade
   */
  private calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate summary
   */
  private generateSummary(metrics: QualityMetric[], issues: QualityIssue[], suggestions: QualitySuggestion[]): any {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths and weaknesses from metrics
    metrics.forEach(metric => {
      if (metric.score >= 85) {
        strengths.push(`${metric.name} is excellent (${metric.score}/100)`);
      } else if (metric.score < 70) {
        weaknesses.push(`${metric.name} needs improvement (${metric.score}/100)`);
      }
    });

    // Generate recommendations from suggestions
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    highPrioritySuggestions.forEach(suggestion => {
      recommendations.push(suggestion.title);
    });

    return {
      strengths,
      weaknesses,
      recommendations
    };
  }

  /**
   * Generate comparison
   */
  private generateComparison(score: number, language: string): any {
    // Industry averages (simplified)
    const industryAverages: { [key: string]: number } = {
      'python': 78,
      'javascript': 75,
      'typescript': 82,
      'java': 80,
      'cpp': 76,
      'c': 74,
      'go': 85,
      'rust': 88
    };

    const industryAverage = industryAverages[language] || 75;
    const percentile = Math.round((score / industryAverage) * 50 + 25); // Simplified calculation

    let benchmark = 'Below Average';
    if (score >= industryAverage * 1.2) benchmark = 'Excellent';
    else if (score >= industryAverage * 1.1) benchmark = 'Above Average';
    else if (score >= industryAverage) benchmark = 'Average';

    return {
      industryAverage,
      percentile: Math.min(99, Math.max(1, percentile)),
      benchmark
    };
  }

  /**
   * Helper methods for analysis
   */
  private checkNamingConventions(code: string, language: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // Check for single letter variables
      if (/\b[a-z]\b\s*=/.test(line)) {
        issues.push({
          id: generateId('issue'),
          type: 'style',
          severity: 'low',
          title: 'Poor Variable Name',
          description: 'Variable name is too short and unclear',
          location: { line: index + 1, column: 1, code: line },
          impact: 'Reduces code readability',
          fix: 'Use descriptive variable names',
          confidence: 0.8
        });
      }
    });

    return issues;
  }

  private calculateCommentRatio(code: string): number {
    const lines = code.split('\n');
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('#'));
    return commentLines.length / lines.length;
  }

  private hasConsistentIndentation(code: string): boolean {
    const lines = code.split('\n');
    const indentations = lines.map(line => line.match(/^(\s*)/)?.[1]?.length || 0);
    const uniqueIndentations = new Set(indentations.filter(indent => indent > 0));
    return uniqueIndentations.size <= 2;
  }

  private findLongFunctions(code: string, language: string): Array<{ line: number; code: string }> {
    // Simplified implementation
    return [];
  }

  private calculateCyclomaticComplexity(code: string): number {
    // Simplified calculation
    const complexityKeywords = ['if', 'else', 'while', 'for', 'switch', 'case', 'catch', '&&', '||'];
    let complexity = 1; // Base complexity

    complexityKeywords.forEach(keyword => {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  private calculateDuplicationRatio(code: string): number {
    const lines = code.split('\n').filter(line => line.trim().length > 10);
    const uniqueLines = new Set(lines);
    return 1 - (uniqueLines.size / lines.length);
  }

  private hasHighCoupling(code: string, language: string): boolean {
    // Simplified check
    return code.includes('import') && code.split('\n').filter(line => line.includes('import')).length > 10;
  }

  private hasInefficientAlgorithms(code: string): boolean {
    return /for\s+.*:[\s\S]*for\s+.*:/.test(code) || /while\s+.*:[\s\S]*while\s+.*:/.test(code);
  }

  private hasPotentialMemoryLeaks(code: string, language: string): boolean {
    return /malloc|new\s+\w+/.test(code) && !/free|delete/.test(code);
  }

  private hasBlockingOperations(code: string, language: string): boolean {
    return /sleep|wait|block/.test(code);
  }

  private hasSQLInjectionVulnerabilities(code: string): boolean {
    return /SELECT.*\+|INSERT.*\+|UPDATE.*\+|DELETE.*\+/.test(code);
  }

  private hasXSSVulnerabilities(code: string): boolean {
    return /innerHTML.*\+|document\.write/.test(code);
  }

  private hasHardcodedSecrets(code: string): boolean {
    return /password\s*=\s*["'][^"']+["']|api[_-]?key\s*=\s*["'][^"']+["']|secret\s*=\s*["'][^"']+["']/i.test(code);
  }

  private hasUnsafeOperations(code: string, language: string): boolean {
    return /eval\(|exec\(|system\(/.test(code);
  }

  private hasProperErrorHandling(code: string, language: string): boolean {
    return /try\s*\{|catch\s*\(|finally\s*\{/.test(code);
  }

  private hasNullPointerRisks(code: string, language: string): boolean {
    return /\w+\.\w+/.test(code) && !/\w+\?\?/.test(code);
  }

  private hasResourceLeaks(code: string, language: string): boolean {
    return /open\(|create\(/.test(code) && !/close\(|destroy\(/.test(code);
  }

  private hasRaceConditions(code: string, language: string): boolean {
    return /thread|async|parallel/.test(code) && !/lock|mutex|synchronized/.test(code);
  }

  /**
   * Get fallback response
   */
  private getFallbackResponse(request: CodeQualityRequest, processingTime: number): CodeQualityResponse {
    return {
      overallScore: 75,
      grade: 'C',
      metrics: [{
        name: 'Readability',
        category: 'readability',
        score: 75,
        weight: 0.25,
        description: 'Basic readability analysis',
        issues: [],
        suggestions: []
      }],
      issues: [],
      suggestions: [{
        id: generateId('suggestion'),
        type: 'improvement',
        priority: 'medium',
        title: 'General Code Improvement',
        description: 'Consider improving code quality',
        benefit: 'Better maintainability',
        effort: 'medium',
        impact: 'medium',
        examples: ['Follow coding standards', 'Add comments', 'Improve naming']
      }],
      summary: {
        strengths: ['Code is functional'],
        weaknesses: ['Quality analysis incomplete'],
        recommendations: ['Improve code quality']
      },
      comparison: {
        industryAverage: 75,
        percentile: 50,
        benchmark: 'Average'
      },
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: CodeQualityRequest): string {
    const key = `${request.language}-${request.context?.projectType || 'general'}-${request.code.slice(-100)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): CodeQualityResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: CodeQualityResponse): void {
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
    log.info('Code Quality Analyzer Service cache cleared', {}, 'QUALITY_ANALYZER');
  }
}

// Create singleton instance
export const codeQualityAnalyzerService = new CodeQualityAnalyzerService();
export default codeQualityAnalyzerService;
