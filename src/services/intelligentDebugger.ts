/**
 * Intelligent Debugger Service
 * AI-powered debugging assistant with step-by-step guidance
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface DebuggingRequest {
  code: string;
  language: string;
  error?: {
    message: string;
    line: number;
    type: string;
  };
  context?: {
    input?: any;
    expectedOutput?: any;
    actualOutput?: any;
    environment?: string;
  };
  debuggingMode: 'error-fix' | 'logic-debug' | 'performance-debug' | 'behavior-analysis';
}

export interface DebugStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  action: 'inspect' | 'modify' | 'test' | 'analyze' | 'verify';
  target: {
    type: 'variable' | 'function' | 'line' | 'block' | 'expression';
    location: {
      line: number;
      column: number;
      code: string;
    };
  };
  expectedResult: string;
  actualResult?: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  hints: string[];
  solution?: string;
  confidence: number;
}

export interface DebugSession {
  id: string;
  request: DebuggingRequest;
  steps: DebugStep[];
  currentStep: number;
  status: 'active' | 'completed' | 'failed' | 'paused';
  rootCause?: string;
  solution?: string;
  confidence: number;
  startTime: Date;
  endTime?: Date;
  totalTime?: number;
}

export interface DebuggingResponse {
  session: DebugSession;
  analysis: {
    problemType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    rootCause: string;
    affectedComponents: string[];
    impact: string;
  };
  debuggingPlan: {
    steps: DebugStep[];
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  suggestions: {
    immediate: string[];
    preventive: string[];
    bestPractices: string[];
  };
  confidence: number;
  processingTime: number;
}

class IntelligentDebuggerService {
  private activeSessions = new Map<string, DebugSession>();
  private cache = new Map<string, DebuggingResponse>();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes

  constructor() {
    log.info('Intelligent Debugger Service initialized', {}, 'DEBUGGER');
  }

  /**
   * Start debugging session
   */
  async startDebugging(request: DebuggingRequest): Promise<DebuggingResponse> {
    const startTime = performance.now();
    const requestId = generateId('debug-session');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('debugger-service', 10, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Starting intelligent debugging session', { 
        requestId, 
        language: request.language,
        debuggingMode: request.debuggingMode,
        hasError: !!request.error 
      }, 'DEBUGGER');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached debugging response', { requestId }, 'DEBUGGER');
        return cached;
      }

      // Create debugging session
      const session = await this.createDebugSession(request);
      this.activeSessions.set(session.id, session);

      // Analyze the problem
      const analysis = await this.analyzeProblem(request);

      // Create debugging plan
      const debuggingPlan = await this.createDebuggingPlan(request, analysis);

      // Generate suggestions
      const suggestions = await this.generateSuggestions(request, analysis);

      const processingTime = performance.now() - startTime;

      const response: DebuggingResponse = {
        session,
        analysis,
        debuggingPlan,
        suggestions,
        confidence: 0.94,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Debugging session started', { 
        requestId, 
        sessionId: session.id,
        problemType: analysis.problemType,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Debugging session failed to start', error as Error, 'DEBUGGER');
      
      // Return fallback response
      return this.getFallbackResponse(request, processingTime);
    }
  }

  /**
   * Execute next debugging step
   */
  async executeStep(sessionId: string, stepId: string, result?: any): Promise<DebugStep | null> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error('Debugging session not found');
      }

      const step = session.steps.find(s => s.id === stepId);
      if (!step) {
        throw new Error('Debug step not found');
      }

      // Update step status
      if (result !== undefined) {
        step.actualResult = result;
        step.status = result ? 'completed' : 'failed';
      }

      // Move to next step
      session.currentStep++;

      // Check if debugging is complete
      if (session.currentStep >= session.steps.length) {
        session.status = 'completed';
        session.endTime = new Date();
        session.totalTime = session.endTime.getTime() - session.startTime.getTime();
      }

      log.info('Debug step executed', { sessionId, stepId, status: step.status }, 'DEBUGGER');

      return step;

    } catch (error) {
      log.error('Failed to execute debug step', error as Error, 'DEBUGGER');
      throw error;
    }
  }

  /**
   * Get debugging session status
   */
  getSessionStatus(sessionId: string): DebugSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * End debugging session
   */
  endSession(sessionId: string, solution?: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = 'completed';
      session.endTime = new Date();
      session.totalTime = session.endTime.getTime() - session.startTime.getTime();
      if (solution) {
        session.solution = solution;
      }
      
      log.info('Debugging session ended', { sessionId, totalTime: session.totalTime }, 'DEBUGGER');
    }
  }

  /**
   * Create debugging session
   */
  private async createDebugSession(request: DebuggingRequest): Promise<DebugSession> {
    const sessionId = generateId('session');
    
    return {
      id: sessionId,
      request,
      steps: [], // Will be populated by createDebuggingPlan
      currentStep: 0,
      status: 'active',
      confidence: 0.9,
      startTime: new Date(),
    };
  }

  /**
   * Analyze the problem
   */
  private async analyzeProblem(request: DebuggingRequest): Promise<any> {
    const { code, language, error, context, debuggingMode } = request;

    // Determine problem type based on debugging mode and error
    let problemType = 'unknown';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let rootCause = 'Unknown issue';
    let affectedComponents: string[] = [];
    let impact = 'Unknown impact';

    if (error) {
      problemType = this.categorizeError(error, language);
      severity = this.assessSeverity(error);
      rootCause = this.identifyRootCause(error, code, language);
      affectedComponents = this.identifyAffectedComponents(error, code);
      impact = this.assessImpact(error, context);
    } else {
      // Logic debugging or behavior analysis
      problemType = this.analyzeLogicIssue(code, language, context);
      severity = 'medium';
      rootCause = this.identifyLogicRootCause(code, language, context);
      affectedComponents = this.identifyLogicComponents(code);
      impact = 'Logic error affecting program behavior';
    }

    return {
      problemType,
      severity,
      rootCause,
      affectedComponents,
      impact,
    };
  }

  /**
   * Create debugging plan
   */
  private async createDebuggingPlan(request: DebuggingRequest, analysis: any): Promise<any> {
    const steps: DebugStep[] = [];
    const { code, language, debuggingMode } = request;

    // Create steps based on problem type and debugging mode
    switch (analysis.problemType) {
      case 'syntax-error':
        steps.push(...this.createSyntaxErrorSteps(code, language));
        break;
      case 'runtime-error':
        steps.push(...this.createRuntimeErrorSteps(code, language));
        break;
      case 'logic-error':
        steps.push(...this.createLogicErrorSteps(code, language));
        break;
      case 'performance-issue':
        steps.push(...this.createPerformanceSteps(code, language));
        break;
      default:
        steps.push(...this.createGenericSteps(code, language));
    }

    const estimatedTime = steps.reduce((total, step) => total + this.estimateStepTime(step), 0);
    const difficulty = this.assessDifficulty(steps, analysis.severity);

    return {
      steps,
      estimatedTime,
      difficulty,
    };
  }

  /**
   * Generate suggestions
   */
  private async generateSuggestions(request: DebuggingRequest, analysis: any): Promise<any> {
    const { code, language } = request;
    const suggestions = {
      immediate: [] as string[],
      preventive: [] as string[],
      bestPractices: [] as string[],
    };

    // Immediate actions
    if (analysis.severity === 'critical') {
      suggestions.immediate.push('Stop execution immediately to prevent data corruption');
      suggestions.immediate.push('Save current state for analysis');
    }

    if (analysis.problemType === 'syntax-error') {
      suggestions.immediate.push('Check syntax highlighting for obvious errors');
      suggestions.immediate.push('Verify all brackets, parentheses, and quotes are properly closed');
    }

    // Preventive measures
    suggestions.preventive.push('Add input validation to prevent invalid data');
    suggestions.preventive.push('Implement error handling for edge cases');
    suggestions.preventive.push('Use type checking and linting tools');

    // Best practices
    suggestions.bestPractices.push('Write unit tests to catch errors early');
    suggestions.bestPractices.push('Use version control to track changes');
    suggestions.bestPractices.push('Code review with peers before deployment');
    suggestions.bestPractices.push('Use debugging tools and logging');

    return suggestions;
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: any, language: string): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('syntax') || message.includes('parse')) {
      return 'syntax-error';
    }
    
    if (message.includes('undefined') || message.includes('null') || message.includes('reference')) {
      return 'runtime-error';
    }
    
    if (message.includes('type') || message.includes('cannot')) {
      return 'type-error';
    }
    
    if (message.includes('index') || message.includes('out of bounds')) {
      return 'index-error';
    }
    
    return 'runtime-error';
  }

  /**
   * Assess error severity
   */
  private assessSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }
    
    if (message.includes('error') && !message.includes('warning')) {
      return 'high';
    }
    
    if (message.includes('warning')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Identify root cause
   */
  private identifyRootCause(error: any, code: string, language: string): string {
    const message = error.message.toLowerCase();
    const line = error.line;
    
    if (message.includes('undefined')) {
      return 'Variable or function is not defined before use';
    }
    
    if (message.includes('null')) {
      return 'Null reference - accessing property of null/undefined object';
    }
    
    if (message.includes('syntax')) {
      return 'Syntax error - invalid code structure or missing punctuation';
    }
    
    if (message.includes('type')) {
      return 'Type mismatch - incompatible data types being used together';
    }
    
    if (message.includes('index')) {
      return 'Index out of bounds - accessing array/list element that does not exist';
    }
    
    return 'Unknown root cause - requires further investigation';
  }

  /**
   * Identify affected components
   */
  private identifyAffectedComponents(error: any, code: string): string[] {
    const components: string[] = [];
    const lines = code.split('\n');
    const errorLine = error.line - 1;
    
    if (errorLine >= 0 && errorLine < lines.length) {
      const line = lines[errorLine];
      
      if (line.includes('function') || line.includes('def ')) {
        components.push('Function definition');
      }
      
      if (line.includes('class') || line.includes('class ')) {
        components.push('Class definition');
      }
      
      if (line.includes('import') || line.includes('require')) {
        components.push('Import statement');
      }
      
      if (line.includes('=')) {
        components.push('Variable assignment');
      }
      
      if (line.includes('if') || line.includes('while') || line.includes('for')) {
        components.push('Control structure');
      }
    }
    
    return components.length > 0 ? components : ['Code execution'];
  }

  /**
   * Assess impact
   */
  private assessImpact(error: any, context?: any): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return 'Critical failure - application cannot continue';
    }
    
    if (message.includes('undefined') || message.includes('null')) {
      return 'Runtime failure - application crashes or behaves unexpectedly';
    }
    
    if (message.includes('syntax')) {
      return 'Compilation failure - code cannot be executed';
    }
    
    if (message.includes('type')) {
      return 'Data integrity issue - incorrect data processing';
    }
    
    return 'Unknown impact - requires investigation';
  }

  /**
   * Analyze logic issues
   */
  private analyzeLogicIssue(code: string, language: string, context?: any): string {
    if (context?.expectedOutput && context?.actualOutput) {
      return 'output-mismatch';
    }
    
    if (this.hasInfiniteLoop(code)) {
      return 'infinite-loop';
    }
    
    if (this.hasLogicError(code)) {
      return 'logic-error';
    }
    
    return 'behavior-analysis';
  }

  /**
   * Identify logic root cause
   */
  private identifyLogicRootCause(code: string, language: string, context?: any): string {
    if (this.hasInfiniteLoop(code)) {
      return 'Infinite loop - condition never becomes false';
    }
    
    if (this.hasOffByOneError(code)) {
      return 'Off-by-one error - incorrect loop bounds or array indexing';
    }
    
    if (this.hasIncorrectCondition(code)) {
      return 'Incorrect condition - logical expression evaluates to wrong value';
    }
    
    return 'Logic error in algorithm or control flow';
  }

  /**
   * Identify logic components
   */
  private identifyLogicComponents(code: string): string[] {
    const components: string[] = [];
    
    if (code.includes('if ') || code.includes('if(')) {
      components.push('Conditional logic');
    }
    
    if (code.includes('for ') || code.includes('while ')) {
      components.push('Loop logic');
    }
    
    if (code.includes('function') || code.includes('def ')) {
      components.push('Function logic');
    }
    
    if (code.includes('return ')) {
      components.push('Return logic');
    }
    
    return components.length > 0 ? components : ['General logic'];
  }

  /**
   * Create syntax error debugging steps
   */
  private createSyntaxErrorSteps(code: string, language: string): DebugStep[] {
    const steps: DebugStep[] = [];
    
    steps.push({
      id: generateId('step'),
      stepNumber: 1,
      title: 'Check Syntax Highlighting',
      description: 'Look for syntax highlighting errors in your code editor',
      action: 'inspect',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Check syntax highlighting' }
      },
      expectedResult: 'No red underlines or error indicators',
      status: 'pending',
      hints: ['Red underlines indicate syntax errors', 'Check for missing punctuation'],
      confidence: 0.9
    });
    
    steps.push({
      id: generateId('step'),
      stepNumber: 2,
      title: 'Verify Brackets and Parentheses',
      description: 'Ensure all opening brackets have corresponding closing brackets',
      action: 'inspect',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Check brackets: () [] {}' }
      },
      expectedResult: 'All brackets are properly matched',
      status: 'pending',
      hints: ['Count opening and closing brackets', 'Use bracket matching in your editor'],
      confidence: 0.95
    });
    
    steps.push({
      id: generateId('step'),
      stepNumber: 3,
      title: 'Check String Quotes',
      description: 'Verify all strings are properly quoted and escaped',
      action: 'inspect',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Check string quotes' }
      },
      expectedResult: 'All strings have matching quotes',
      status: 'pending',
      hints: ['Check for unescaped quotes in strings', 'Use consistent quote style'],
      confidence: 0.9
    });
    
    return steps;
  }

  /**
   * Create runtime error debugging steps
   */
  private createRuntimeErrorSteps(code: string, language: string): DebugStep[] {
    const steps: DebugStep[] = [];
    
    steps.push({
      id: generateId('step'),
      stepNumber: 1,
      title: 'Check Variable Definitions',
      description: 'Ensure all variables are defined before use',
      action: 'inspect',
      target: {
        type: 'variable',
        location: { line: 1, column: 1, code: '// Check variable definitions' }
      },
      expectedResult: 'All variables are properly defined',
      status: 'pending',
      hints: ['Look for undefined variable names', 'Check variable scope'],
      confidence: 0.9
    });
    
    steps.push({
      id: generateId('step'),
      stepNumber: 2,
      title: 'Verify Function Calls',
      description: 'Check that all function calls use correct syntax and parameters',
      action: 'inspect',
      target: {
        type: 'function',
        location: { line: 1, column: 1, code: '// Check function calls' }
      },
      expectedResult: 'All function calls are valid',
      status: 'pending',
      hints: ['Check function names for typos', 'Verify parameter count and types'],
      confidence: 0.85
    });
    
    return steps;
  }

  /**
   * Create logic error debugging steps
   */
  private createLogicErrorSteps(code: string, language: string): DebugStep[] {
    const steps: DebugStep[] = [];
    
    steps.push({
      id: generateId('step'),
      stepNumber: 1,
      title: 'Trace Variable Values',
      description: 'Add print statements or use debugger to trace variable values',
      action: 'inspect',
      target: {
        type: 'variable',
        location: { line: 1, column: 1, code: '// Add debugging prints' }
      },
      expectedResult: 'Variable values match expectations',
      status: 'pending',
      hints: ['Add console.log() or print() statements', 'Use debugger breakpoints'],
      confidence: 0.9
    });
    
    steps.push({
      id: generateId('step'),
      stepNumber: 2,
      title: 'Check Loop Conditions',
      description: 'Verify loop conditions and termination criteria',
      action: 'analyze',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Check loop conditions' }
      },
      expectedResult: 'Loops terminate correctly',
      status: 'pending',
      hints: ['Check for infinite loops', 'Verify loop bounds'],
      confidence: 0.85
    });
    
    return steps;
  }

  /**
   * Create performance debugging steps
   */
  private createPerformanceSteps(code: string, language: string): DebugStep[] {
    const steps: DebugStep[] = [];
    
    steps.push({
      id: generateId('step'),
      stepNumber: 1,
      title: 'Profile Execution Time',
      description: 'Measure execution time of different parts of the code',
      action: 'test',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Profile execution time' }
      },
      expectedResult: 'Identify performance bottlenecks',
      status: 'pending',
      hints: ['Use performance.now() or similar timing functions', 'Profile different code sections'],
      confidence: 0.8
    });
    
    return steps;
  }

  /**
   * Create generic debugging steps
   */
  private createGenericSteps(code: string, language: string): DebugStep[] {
    const steps: DebugStep[] = [];
    
    steps.push({
      id: generateId('step'),
      stepNumber: 1,
      title: 'Review Code Logic',
      description: 'Carefully review the code logic and flow',
      action: 'analyze',
      target: {
        type: 'block',
        location: { line: 1, column: 1, code: '// Review code logic' }
      },
      expectedResult: 'Understanding of code behavior',
      status: 'pending',
      hints: ['Read through the code step by step', 'Check for logical inconsistencies'],
      confidence: 0.7
    });
    
    return steps;
  }

  /**
   * Estimate step time
   */
  private estimateStepTime(step: DebugStep): number {
    switch (step.action) {
      case 'inspect': return 2;
      case 'analyze': return 5;
      case 'test': return 3;
      case 'modify': return 10;
      case 'verify': return 3;
      default: return 5;
    }
  }

  /**
   * Assess difficulty
   */
  private assessDifficulty(steps: DebugStep[], severity: string): 'easy' | 'medium' | 'hard' {
    if (severity === 'critical' || steps.length > 5) {
      return 'hard';
    }
    
    if (severity === 'high' || steps.length > 3) {
      return 'medium';
    }
    
    return 'easy';
  }

  /**
   * Helper methods for logic analysis
   */
  private hasInfiniteLoop(code: string): boolean {
    return /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/.test(code);
  }

  private hasLogicError(code: string): boolean {
    return /if\s*\(\s*false\s*\)|if\s*\(\s*0\s*\)/.test(code);
  }

  private hasOffByOneError(code: string): boolean {
    return /for\s*\([^)]*<=[^)]*\)|for\s*\([^)]*>=0[^)]*\)/.test(code);
  }

  private hasIncorrectCondition(code: string): boolean {
    return /if\s*\([^)]*=\s*[^=]/.test(code);
  }

  /**
   * Get fallback response
   */
  private getFallbackResponse(request: DebuggingRequest, processingTime: number): DebuggingResponse {
    const sessionId = generateId('session');
    
    return {
      session: {
        id: sessionId,
        request,
        steps: [],
        currentStep: 0,
        status: 'active',
        confidence: 0.5,
        startTime: new Date(),
      },
      analysis: {
        problemType: 'unknown',
        severity: 'medium',
        rootCause: 'Unknown issue requiring investigation',
        affectedComponents: ['Code execution'],
        impact: 'Unknown impact',
      },
      debuggingPlan: {
        steps: [{
          id: generateId('step'),
          stepNumber: 1,
          title: 'General Code Review',
          description: 'Review the code for obvious issues',
          action: 'analyze',
          target: {
            type: 'block',
            location: { line: 1, column: 1, code: '// General review' }
          },
          expectedResult: 'Identification of potential issues',
          status: 'pending',
          hints: ['Look for common programming errors', 'Check syntax and logic'],
          confidence: 0.5
        }],
        estimatedTime: 10,
        difficulty: 'medium',
      },
      suggestions: {
        immediate: ['Review code for obvious errors'],
        preventive: ['Add error handling'],
        bestPractices: ['Use debugging tools'],
      },
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: DebuggingRequest): string {
    const key = `${request.language}-${request.debuggingMode}-${request.code.slice(-100)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): DebuggingResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: DebuggingResponse): void {
    this.cache.set(key, {
      ...data,
      processingTime: Date.now()
    });
  }

  /**
   * Clear cache and sessions
   */
  clearCache(): void {
    this.cache.clear();
    this.activeSessions.clear();
    log.info('Intelligent Debugger Service cache and sessions cleared', {}, 'DEBUGGER');
  }
}

// Create singleton instance
export const intelligentDebuggerService = new IntelligentDebuggerService();
export default intelligentDebuggerService;
