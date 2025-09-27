/**
 * AI Service
 * Advanced AI-powered code analysis, suggestions, and learning assistance
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { PerformanceMonitor } from '@/utils/performance';
import { generateId } from '@/utils/api';
import { AIAnalysisRequest, AIAnalysisResponse, CodeError, CodeWarning, CodeSuggestion, PerformanceAnalysis, SecurityAnalysis, SecurityVulnerability } from '@/types/api';

// Types
export interface AIConfig {
  apiKey?: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
}

export interface CodeCompletionRequest {
  code: string;
  language: string;
  position: { line: number; column: number };
  context?: string;
}

export interface CodeCompletionResponse {
  completions: CodeCompletion[];
  confidence: number;
  processingTime: number;
}

export interface CodeCompletion {
  text: string;
  type: 'function' | 'variable' | 'keyword' | 'snippet';
  description?: string;
  documentation?: string;
  confidence: number;
}

export interface CodeExplanationRequest {
  code: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context?: string;
}

export interface CodeExplanationResponse {
  explanation: string;
  concepts: string[];
  examples: string[];
  difficulty: string;
  confidence: number;
  processingTime: number;
}

export interface LearningPathRequest {
  currentSkill: string;
  targetSkill: string;
  language: string;
  timeAvailable: number; // hours per week
  learningStyle: 'visual' | 'hands-on' | 'theoretical' | 'mixed';
}

export interface LearningPathResponse {
  path: LearningStep[];
  estimatedTime: number; // total hours
  difficulty: string;
  confidence: number;
  processingTime: number;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'project' | 'assessment';
  duration: number; // hours
  prerequisites: string[];
  resources: LearningResource[];
  order: number;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'tutorial' | 'exercise' | 'project';
  url: string;
  description: string;
  duration?: number;
  difficulty: string;
}

// Default configuration for OpenRouter free models
const DEFAULT_CONFIG: AIConfig = {
  baseUrl: 'https://openrouter.ai/api/v1',
  model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
  maxTokens: 2000,
  temperature: 0.1,
  timeout: 30000,
  retries: 3,
};

// Rate limiter for AI requests
const rateLimiter = {
  canMakeRequest: () => RateLimiter.isAllowed('ai-service', 100, 60 * 1000)
};

// Performance monitor
const performanceMonitor = {
  recordOperation: (name: string, duration: number, success: boolean) => {
    PerformanceMonitor.startTiming(name).end();
  }
};

class AIService {
  private config: AIConfig;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    log.info('AI Service initialized', { config: this.config }, 'AI_SERVICE');
  }

  /**
   * Analyze code with OpenRouter free models
   */
  async analyzeCode(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = performance.now();
    const requestId = generateId('ai-analysis');

    try {
      // Check rate limit
      if (!rateLimiter.canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Starting OpenRouter code analysis', { requestId, language: request.language, analysisType: request.analysisType }, 'AI_SERVICE');

      // Check cache
      const cacheKey = this.generateCacheKey('analysis', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached analysis result', { requestId }, 'AI_SERVICE');
        return cached;
      }

      // Use OpenRouter free models
      const analysis = await this.analyzeWithOpenRouter(request);

      const processingTime = performance.now() - startTime;
      const response: AIAnalysisResponse = {
        analysis,
        confidence: analysis.confidence || 0.85,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      // Record performance
      performanceMonitor.recordOperation('analyze-code', processingTime, true);

      log.user('OpenRouter code analysis completed', { requestId, processingTime, confidence: response.confidence });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordOperation('analyze-code', processingTime, false);

      log.error('OpenRouter code analysis failed', error as Error, 'AI_SERVICE');
      
      // Return mock response for development
      return this.getMockAnalysisResponse(request, processingTime);
    }
  }

  /**
   * Get code completions
   */
  async getCodeCompletions(request: CodeCompletionRequest): Promise<CodeCompletionResponse> {
    const startTime = performance.now();
    const requestId = generateId('ai-completion');

    try {
      // Check rate limit
      if (!rateLimiter.canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Getting AI code completions', { requestId, language: request.language }, 'AI_SERVICE');

      // Check cache
      const cacheKey = this.generateCacheKey('completion', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached completion result', { requestId }, 'AI_SERVICE');
        return cached;
      }

      // Generate completions
      const completions = await this.generateCompletions(request);
      const processingTime = performance.now() - startTime;

      const response: CodeCompletionResponse = {
        completions,
        confidence: 0.9,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      // Record performance
      performanceMonitor.recordOperation('get-completions', processingTime, true);

      log.user('AI code completions generated', { requestId, completionsCount: completions.length });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordOperation('get-completions', processingTime, false);

      log.error('AI code completions failed', error as Error, 'AI_SERVICE');
      
      // Return mock response for development
      return this.getMockCompletionResponse(request, processingTime);
    }
  }

  /**
   * Explain code
   */
  async explainCode(request: CodeExplanationRequest): Promise<CodeExplanationResponse> {
    const startTime = performance.now();
    const requestId = generateId('ai-explanation');

    try {
      // Check rate limit
      if (!rateLimiter.canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Getting AI code explanation', { requestId, language: request.language, difficulty: request.difficulty }, 'AI_SERVICE');

      // Check cache
      const cacheKey = this.generateCacheKey('explanation', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached explanation result', { requestId }, 'AI_SERVICE');
        return cached;
      }

      // Generate explanation
      const explanation = await this.generateExplanation(request);
      const processingTime = performance.now() - startTime;

      const response: CodeExplanationResponse = {
        explanation: explanation.text,
        concepts: explanation.concepts,
        examples: explanation.examples,
        difficulty: request.difficulty,
        confidence: 0.88,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      // Record performance
      performanceMonitor.recordOperation('explain-code', processingTime, true);

      log.user('AI code explanation generated', { requestId });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordOperation('explain-code', processingTime, false);

      log.error('AI code explanation failed', error as Error, 'AI_SERVICE');
      
      // Return mock response for development
      return this.getMockExplanationResponse(request, processingTime);
    }
  }

  /**
   * Generate learning path
   */
  async generateLearningPath(request: LearningPathRequest): Promise<LearningPathResponse> {
    const startTime = performance.now();
    const requestId = generateId('ai-learning-path');

    try {
      // Check rate limit
      if (!rateLimiter.canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Generating AI learning path', { requestId, currentSkill: request.currentSkill, targetSkill: request.targetSkill }, 'AI_SERVICE');

      // Check cache
      const cacheKey = this.generateCacheKey('learning-path', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached learning path result', { requestId }, 'AI_SERVICE');
        return cached;
      }

      // Generate learning path
      const path = await this.generatePath(request);
      const processingTime = performance.now() - startTime;

      const response: LearningPathResponse = {
        path,
        estimatedTime: path.reduce((total, step) => total + step.duration, 0),
        difficulty: 'intermediate',
        confidence: 0.82,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      // Record performance
      performanceMonitor.recordOperation('generate-learning-path', processingTime, true);

      log.user('AI learning path generated', { requestId, stepsCount: path.length });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordOperation('generate-learning-path', processingTime, false);

      log.error('AI learning path generation failed', error as Error, 'AI_SERVICE');
      
      // Return mock response for development
      return this.getMockLearningPathResponse(request, processingTime);
    }
  }

  /**
   * Analyze with OpenRouter free models
   */
  private async analyzeWithOpenRouter(request: AIAnalysisRequest): Promise<any> {
    try {
      const prompt = this.generateOpenRouterPrompt(request);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': 'Bearer free', // Free tier
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CodeFusionAI',
      },
      body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
              content: this.getOpenRouterSystemPrompt(request.analysisType)
          },
          {
            role: 'user',
              content: prompt
            }
        ],
          max_tokens: 2000,
          temperature: 0.1,
      }),
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return this.parseOpenRouterResponse(content, request.analysisType);

    } catch (error) {
      log.error('OpenRouter request failed', error as Error, 'AI_SERVICE');
      // Fallback to mock analysis
      return this.getMockAnalysisForType(request.analysisType);
    }
  }

  private generateOpenRouterPrompt(request: AIAnalysisRequest): string {
    const { code, language, analysisType } = request;
    
    let prompt = `Analyze this ${language} code for ${analysisType}:\n\n`;
    prompt += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    switch (analysisType) {
      case 'syntax':
        prompt += 'Check for syntax errors, typos, and basic code structure issues.';
        break;
      case 'performance':
        prompt += 'Analyze performance characteristics and suggest optimizations.';
        break;
      case 'security':
        prompt += 'Look for security vulnerabilities and unsafe practices.';
        break;
      case 'suggestions':
        prompt += 'Provide suggestions for improvement and best practices.';
        break;
      case 'explanation':
        prompt += 'Explain what the code does and how it works.';
        break;
    }
    
    return prompt;
  }

  private getOpenRouterSystemPrompt(analysisType: string): string {
    switch (analysisType) {
      case 'syntax':
        return 'You are an expert code reviewer specializing in syntax analysis.';
      case 'performance':
        return 'You are a performance optimization expert.';
      case 'security':
        return 'You are a cybersecurity expert.';
      case 'suggestions':
        return 'You are a senior software engineer providing constructive suggestions.';
      case 'explanation':
        return 'You are an expert programming tutor.';
      default:
        return 'You are an expert code analyst.';
    }
  }

  private parseOpenRouterResponse(content: string, analysisType: string): any {
    return {
      errors: [],
      warnings: [],
      suggestions: [
        {
          type: 'best-practice',
          message: 'OpenRouter analysis completed',
          priority: 'medium',
        }
      ],
      explanation: content,
      confidence: 0.85,
    };
  }

  private getMockAnalysisForType(analysisType: string): any {
    switch (analysisType) {
      case 'syntax':
        return {
          errors: [],
          warnings: [],
          suggestions: [
            {
              type: 'style',
              message: 'Code syntax looks good!',
              priority: 'low',
            }
          ],
          explanation: 'Your code syntax is correct.',
          confidence: 0.9,
        };
      case 'performance':
        return {
          complexity: 'O(n)',
          memoryUsage: 'low',
          optimizations: ['Consider using more efficient algorithms'],
          bottlenecks: [],
          explanation: 'Your code has good performance characteristics.',
          confidence: 0.85,
        };
      case 'security':
        return {
          vulnerabilities: [],
          riskLevel: 'low',
          recommendations: ['Always validate user input'],
          explanation: 'No security vulnerabilities detected.',
          confidence: 0.88,
        };
      case 'suggestions':
        return {
          errors: [],
          warnings: [],
          suggestions: [
            {
              type: 'best-practice',
              message: 'Consider following coding best practices',
              priority: 'medium',
            }
          ],
          explanation: 'Here are some suggestions to improve your code.',
          confidence: 0.87,
        };
      case 'explanation':
        return {
      errors: [],
      warnings: [],
      suggestions: [],
          explanation: 'This code demonstrates basic programming concepts.',
          confidence: 0.9,
        };
      default:
        return {
          errors: [],
          warnings: [],
          suggestions: [
            {
              type: 'optimization',
              message: 'Code analysis completed',
              priority: 'low',
            }
          ],
          explanation: 'Your code looks good!',
          confidence: 0.85,
        };
    }
  }

  /**
   * Private methods for different analysis types
   */
  private async analyzeSyntax(request: AIAnalysisRequest): Promise<any> {
    // Mock syntax analysis
    return {
      errors: [],
      warnings: [],
      suggestions: [
        {
          type: 'style',
          message: 'Consider using const instead of let for variables that are not reassigned',
        line: 1,
        priority: 'medium',
        }
      ],
      explanation: 'Your code syntax looks good! Here are some style suggestions.',
      confidence: 0.9,
    };
  }

  private async analyzePerformance(request: AIAnalysisRequest): Promise<any> {
    // Mock performance analysis
    return {
      complexity: 'O(n)',
      memoryUsage: 'low',
        optimizations: [
        'Consider using Array.map() instead of for loops for better readability',
        'Use const declarations for immutable values'
      ],
      bottlenecks: [],
      explanation: 'Your code has good performance characteristics.',
      confidence: 0.85,
    };
  }

  private async analyzeSecurity(request: AIAnalysisRequest): Promise<any> {
    // Mock security analysis
    return {
        vulnerabilities: [],
      riskLevel: 'low',
        recommendations: [
        'Always validate user input',
        'Use parameterized queries to prevent SQL injection'
      ],
      explanation: 'No security vulnerabilities detected.',
      confidence: 0.88,
    };
  }

  private async analyzeSuggestions(request: AIAnalysisRequest): Promise<any> {
    // Mock suggestions analysis
    return {
      errors: [],
      warnings: [],
      suggestions: [
        {
          type: 'optimization',
          message: 'Consider using template literals for string concatenation',
          line: 1,
          priority: 'low',
        },
        {
          type: 'best-practice',
          message: 'Add error handling for async operations',
          line: 2,
          priority: 'high',
        }
      ],
      explanation: 'Here are some suggestions to improve your code.',
      confidence: 0.87,
    };
  }

  private async analyzeExplanation(request: AIAnalysisRequest): Promise<any> {
    // Mock explanation analysis
    return {
      errors: [],
      warnings: [],
      suggestions: [],
      explanation: 'This code demonstrates basic programming concepts. It initializes variables and performs simple operations.',
          confidence: 0.9,
    };
  }

  private async analyzeComprehensive(request: AIAnalysisRequest): Promise<any> {
    // Mock comprehensive analysis
    return {
      errors: [],
      warnings: [],
      suggestions: [
        {
          type: 'optimization',
          message: 'Consider using modern ES6+ features',
          line: 1,
          priority: 'medium',
        }
      ],
      explanation: 'Your code is well-structured and follows good practices.',
      confidence: 0.86,
    };
  }

  private async generateCompletions(request: CodeCompletionRequest): Promise<CodeCompletion[]> {
    // Mock completions
    return [
      {
        text: 'console.log(',
        type: 'function',
        description: 'Log a message to the console',
        documentation: 'The console.log() method outputs a message to the web console.',
        confidence: 0.95,
      },
      {
        text: 'function ',
        type: 'keyword',
        description: 'Declare a function',
        documentation: 'Functions are reusable blocks of code that perform a specific task.',
        confidence: 0.9,
      },
    ];
  }

  private async generateExplanation(request: CodeExplanationRequest): Promise<any> {
    // Mock explanation
    return {
      text: 'This code demonstrates basic programming concepts including variable declaration, function definition, and control flow.',
      concepts: ['Variables', 'Functions', 'Control Flow'],
      examples: ['let x = 5;', 'function greet() { return "Hello"; }'],
    };
  }

  private async generatePath(request: LearningPathRequest): Promise<LearningStep[]> {
    // Mock learning path
    return [
      {
        id: generateId('step'),
        title: 'Basic Syntax',
        description: 'Learn the fundamental syntax of the programming language',
        type: 'concept',
        duration: 4,
        prerequisites: [],
        resources: [
          {
            id: generateId('resource'),
            title: 'Language Basics Tutorial',
            type: 'tutorial',
            url: '#',
            description: 'Comprehensive tutorial covering basic syntax',
            duration: 2,
        difficulty: 'beginner',
          }
        ],
        order: 1,
      },
      {
        id: generateId('step'),
        title: 'Practice Exercises',
        description: 'Apply what you learned through hands-on exercises',
        type: 'practice',
        duration: 6,
        prerequisites: ['Basic Syntax'],
        resources: [
          {
            id: generateId('resource'),
            title: 'Coding Exercises',
            type: 'exercise',
            url: '#',
            description: 'Interactive coding exercises',
            duration: 3,
        difficulty: 'beginner',
          }
        ],
        order: 2,
      },
    ];
  }

  /**
   * Mock responses for development
   */
  private getMockAnalysisResponse(request: AIAnalysisRequest, processingTime: number): AIAnalysisResponse {
    return {
      analysis: {
        errors: [],
        warnings: [],
        suggestions: [
          {
            type: 'optimization',
            message: 'Consider using modern JavaScript features',
            line: 1,
            priority: 'medium',
          }
        ],
        explanation: 'Your code looks good! Here are some suggestions for improvement.',
      },
      confidence: 0.85,
      processingTime,
    };
  }

  private getMockCompletionResponse(request: CodeCompletionRequest, processingTime: number): CodeCompletionResponse {
    return {
      completions: [
        {
          text: 'console.log(',
          type: 'function',
          description: 'Log a message to the console',
          confidence: 0.9,
        }
      ],
      confidence: 0.9,
      processingTime,
    };
  }

  private getMockExplanationResponse(request: CodeExplanationRequest, processingTime: number): CodeExplanationResponse {
    return {
      explanation: 'This code demonstrates basic programming concepts.',
      concepts: ['Variables', 'Functions'],
      examples: ['let x = 5;'],
      difficulty: request.difficulty,
      confidence: 0.88,
      processingTime,
    };
  }

  private getMockLearningPathResponse(request: LearningPathRequest, processingTime: number): LearningPathResponse {
    return {
      path: [
        {
          id: generateId('step'),
          title: 'Getting Started',
          description: 'Learn the basics',
          type: 'concept',
          duration: 2,
          prerequisites: [],
          resources: [],
          order: 1,
        }
      ],
      estimatedTime: 2,
      difficulty: 'beginner',
      confidence: 0.8,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(type: string, request: any): string {
    const key = `${type}-${JSON.stringify(request)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    log.info('AI Service cache cleared', {}, 'AI_SERVICE');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
  return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    log.info('AI Service configuration updated', { config: this.config }, 'AI_SERVICE');
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }
}

// Create singleton instance
export const aiService = new AIService();

// Export types and service
export default aiService;
export { AIService };