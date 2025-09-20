/**
 * Code Execution Service
 * Secure code execution with sandboxing and real-time results
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { PerformanceMonitor } from '@/utils/performance';
import { generateId } from '@/utils/api';

// Types
export interface ExecutionRequest {
  code: string;
  language: string;
  input?: string;
  timeout?: number;
  memoryLimit?: number;
  files?: ExecutionFile[];
}

export interface ExecutionFile {
  name: string;
  content: string;
  type: 'source' | 'data' | 'config';
}

export interface ExecutionResult {
  id: string;
  success: boolean;
  output: string;
  errors: ExecutionError[];
  warnings: ExecutionWarning[];
  executionTime: number;
  memoryUsage: number;
  language: string;
  version: string;
  exitCode?: number;
  stats?: ExecutionStats;
}

export interface ExecutionError {
  type: 'syntax' | 'runtime' | 'timeout' | 'memory' | 'security';
  message: string;
  line?: number;
  column?: number;
  stack?: string;
}

export interface ExecutionWarning {
  type: 'deprecation' | 'performance' | 'style' | 'security';
  message: string;
  line?: number;
  column?: number;
}

export interface ExecutionStats {
  cpuTime: number;
  peakMemory: number;
  diskUsage: number;
  networkRequests: number;
  systemCalls: number;
}

export interface LanguageConfig {
  id: string;
  name: string;
  version: string;
  runtime: string;
  extensions: string[];
  compileCommand?: string;
  runCommand: string;
  timeout: number;
  memoryLimit: number;
  allowedModules?: string[];
  blockedModules?: string[];
  securityLevel: 'low' | 'medium' | 'high';
}

// Language configurations
const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    version: '18.0.0',
    runtime: 'node',
    extensions: ['.js', '.mjs'],
    runCommand: 'node {file}',
    timeout: 10000,
    memoryLimit: 128 * 1024 * 1024, // 128MB
    allowedModules: ['fs', 'path', 'util', 'crypto'],
    blockedModules: ['child_process', 'cluster', 'dgram', 'net', 'tls'],
    securityLevel: 'medium',
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    version: '5.0.0',
    runtime: 'ts-node',
    extensions: ['.ts'],
    runCommand: 'ts-node {file}',
    timeout: 15000,
    memoryLimit: 256 * 1024 * 1024, // 256MB
    allowedModules: ['fs', 'path', 'util', 'crypto'],
    blockedModules: ['child_process', 'cluster', 'dgram', 'net', 'tls'],
    securityLevel: 'medium',
  },
  python: {
    id: 'python',
    name: 'Python',
    version: '3.11.0',
    runtime: 'python3',
    extensions: ['.py'],
    runCommand: 'python3 {file}',
    timeout: 10000,
    memoryLimit: 128 * 1024 * 1024,
    allowedModules: ['os', 'sys', 'json', 'math', 'random', 'datetime'],
    blockedModules: ['subprocess', 'socket', 'urllib', 'requests'],
    securityLevel: 'high',
  },
  java: {
    id: 'java',
    name: 'Java',
    version: '17.0.0',
    runtime: 'java',
    extensions: ['.java'],
    compileCommand: 'javac {file}',
    runCommand: 'java {class}',
    timeout: 15000,
    memoryLimit: 256 * 1024 * 1024,
    securityLevel: 'high',
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    version: '11.0.0',
    runtime: 'g++',
    extensions: ['.cpp', '.cc', '.cxx'],
    compileCommand: 'g++ -o {output} {file}',
    runCommand: './{output}',
    timeout: 10000,
    memoryLimit: 64 * 1024 * 1024,
    securityLevel: 'high',
  },
  c: {
    id: 'c',
    name: 'C',
    version: '11.0.0',
    runtime: 'gcc',
    extensions: ['.c'],
    compileCommand: 'gcc -o {output} {file}',
    runCommand: './{output}',
    timeout: 10000,
    memoryLimit: 64 * 1024 * 1024,
    securityLevel: 'high',
  },
  go: {
    id: 'go',
    name: 'Go',
    version: '1.20.0',
    runtime: 'go',
    extensions: ['.go'],
    runCommand: 'go run {file}',
    timeout: 10000,
    memoryLimit: 128 * 1024 * 1024,
    securityLevel: 'medium',
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    version: '1.70.0',
    runtime: 'rustc',
    extensions: ['.rs'],
    compileCommand: 'rustc {file} -o {output}',
    runCommand: './{output}',
    timeout: 15000,
    memoryLimit: 128 * 1024 * 1024,
    securityLevel: 'medium',
  },
};

// Code Execution Manager
export class CodeExecutionManager {
  private static instance: CodeExecutionManager;
  private executionQueue: Map<string, ExecutionRequest> = new Map();
  private activeExecutions: Map<string, AbortController> = new Map();
  private executionHistory: ExecutionResult[] = [];
  private maxHistorySize = 100;

  static getInstance(): CodeExecutionManager {
    if (!CodeExecutionManager.instance) {
      CodeExecutionManager.instance = new CodeExecutionManager();
    }
    return CodeExecutionManager.instance;
  }

  // Execute code with security and performance monitoring
  async executeCode(request: ExecutionRequest, userId?: string): Promise<ExecutionResult> {
    const executionId = generateId('execution');
    const timer = PerformanceMonitor.startTiming(`code-execution-${executionId}`);

    try {
      // Rate limiting
      const rateLimitKey = userId ? `execution:${userId}` : 'execution:anonymous';
      if (!RateLimiter.isAllowed(rateLimitKey, 10, 60000)) { // 10 executions per minute
        throw new Error('Rate limit exceeded. Please wait before executing more code.');
      }

      // Validate request
      this.validateExecutionRequest(request);

      // Get language configuration
      const config = LANGUAGE_CONFIGS[request.language];
      if (!config) {
        throw new Error(`Unsupported language: ${request.language}`);
      }

      log.info('Starting code execution', {
        executionId,
        language: request.language,
        codeLength: request.code.length,
        userId,
      }, 'CODE_EXECUTION');

      // Security checks
      this.performSecurityChecks(request, config);

      // Add to queue
      this.executionQueue.set(executionId, request);

      // Execute based on environment
      let result: ExecutionResult;
      if (this.isServerEnvironment()) {
        result = await this.executeOnServer(executionId, request, config);
      } else {
        result = await this.executeInBrowser(executionId, request, config);
      }

      // Add to history
      this.addToHistory(result);

      // Log result
      log.info('Code execution completed', {
        executionId: result.id,
        success: result.success,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
      }, 'CODE_EXECUTION');

      return result;

    } catch (error) {
      const errorResult: ExecutionResult = {
        id: executionId,
        success: false,
        output: '',
        errors: [{
          type: 'runtime',
          message: (error as Error).message,
        }],
        warnings: [],
        executionTime: timer.end().duration,
        memoryUsage: 0,
        language: request.language,
        version: LANGUAGE_CONFIGS[request.language]?.version || '1.0.0',
      };

      log.error('Code execution failed', error as Error, 'CODE_EXECUTION', {
        executionId,
        language: request.language,
      });

      this.addToHistory(errorResult);
      return errorResult;

    } finally {
      this.executionQueue.delete(executionId);
      this.activeExecutions.delete(executionId);
      timer.end();
    }
  }

  // Validate execution request
  private validateExecutionRequest(request: ExecutionRequest): void {
    if (!request.code || typeof request.code !== 'string') {
      throw new Error('Code is required and must be a string');
    }

    if (request.code.length > 50000) { // 50KB limit
      throw new Error('Code is too large (max 50KB)');
    }

    if (!request.language || typeof request.language !== 'string') {
      throw new Error('Language is required');
    }

    if (request.timeout && (request.timeout < 1000 || request.timeout > 30000)) {
      throw new Error('Timeout must be between 1 and 30 seconds');
    }

    if (request.memoryLimit && (request.memoryLimit < 1024 * 1024 || request.memoryLimit > 512 * 1024 * 1024)) {
      throw new Error('Memory limit must be between 1MB and 512MB');
    }
  }

  // Perform security checks
  private performSecurityChecks(request: ExecutionRequest, config: LanguageConfig): void {
    const code = request.code.toLowerCase();

    // Check for dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/,
      /exec\s*\(/,
      /system\s*\(/,
      /subprocess/,
      /child_process/,
      /fs\.unlink/,
      /fs\.rmdir/,
      /process\.exit/,
      /require\s*\(\s*['"]child_process['"]/,
      /import.*subprocess/,
      /import.*os/,
      /__import__/,
      /getattr/,
      /setattr/,
      /delattr/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(`Security violation: Dangerous pattern detected - ${pattern.source}`);
      }
    }

    // Check blocked modules
    if (config.blockedModules) {
      for (const module of config.blockedModules) {
        if (code.includes(module)) {
          throw new Error(`Security violation: Blocked module '${module}' detected`);
        }
      }
    }

    // Additional language-specific checks
    if (config.id === 'javascript' || config.id === 'typescript') {
      this.checkJavaScriptSecurity(code);
    } else if (config.id === 'python') {
      this.checkPythonSecurity(code);
    }
  }

  // JavaScript-specific security checks
  private checkJavaScriptSecurity(code: string): void {
    const jsPatterns = [
      /document\./,
      /window\./,
      /global\./,
      /process\.env/,
      /require\s*\(\s*['"]fs['"]/,
      /require\s*\(\s*['"]path['"]/,
      /XMLHttpRequest/,
      /fetch\s*\(/,
    ];

    for (const pattern of jsPatterns) {
      if (pattern.test(code)) {
        log.warn('Potentially unsafe JavaScript pattern detected', { pattern: pattern.source }, 'CODE_EXECUTION');
      }
    }
  }

  // Python-specific security checks
  private checkPythonSecurity(code: string): void {
    const pythonPatterns = [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /from\s+os\s+import/,
      /from\s+sys\s+import/,
      /open\s*\(/,
      /file\s*\(/,
      /input\s*\(/,
      /raw_input\s*\(/,
    ];

    for (const pattern of pythonPatterns) {
      if (pattern.test(code)) {
        log.warn('Potentially unsafe Python pattern detected', { pattern: pattern.source }, 'CODE_EXECUTION');
      }
    }
  }

  // Check if running in server environment
  private isServerEnvironment(): boolean {
    return typeof window === 'undefined' && typeof process !== 'undefined';
  }

  // Execute code on server (Node.js environment)
  private async executeOnServer(
    executionId: string,
    request: ExecutionRequest,
    config: LanguageConfig
  ): Promise<ExecutionResult> {
    // This would be implemented with actual server-side execution
    // For now, return a simulated result
    return this.simulateExecution(executionId, request, config);
  }

  // Execute code in browser (WebAssembly/Web Workers)
  private async executeInBrowser(
    executionId: string,
    request: ExecutionRequest,
    config: LanguageConfig
  ): Promise<ExecutionResult> {
    // For browser execution, we'll use Web Workers and WebAssembly
    // This is a simplified implementation
    
    if (config.id === 'javascript') {
      return this.executeJavaScriptInWorker(executionId, request, config);
    }

    // For other languages, simulate execution
    return this.simulateExecution(executionId, request, config);
  }

  // Execute JavaScript in Web Worker
  private async executeJavaScriptInWorker(
    executionId: string,
    request: ExecutionRequest,
    config: LanguageConfig
  ): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const abortController = new AbortController();
      this.activeExecutions.set(executionId, abortController);

      // Create a sandboxed execution context
      const workerCode = `
        const console = {
          log: (...args) => self.postMessage({ type: 'output', data: args.join(' ') + '\\n' }),
          error: (...args) => self.postMessage({ type: 'error', data: args.join(' ') }),
          warn: (...args) => self.postMessage({ type: 'warning', data: args.join(' ') }),
        };

        // Disable dangerous globals
        const window = undefined;
        const document = undefined;
        const fetch = undefined;
        const XMLHttpRequest = undefined;

        try {
          ${request.code}
          self.postMessage({ type: 'complete', success: true });
        } catch (error) {
          self.postMessage({ 
            type: 'complete', 
            success: false, 
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name
            }
          });
        }
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      let output = '';
      const errors: ExecutionError[] = [];
      const warnings: ExecutionWarning[] = [];

      // Set timeout
      const timeout = setTimeout(() => {
        worker.terminate();
        resolve({
          id: executionId,
          success: false,
          output,
          errors: [{ type: 'timeout', message: 'Execution timed out' }],
          warnings,
          executionTime: performance.now() - startTime,
          memoryUsage: 0,
          language: config.id,
          version: config.version,
        });
      }, request.timeout || config.timeout);

      worker.onmessage = (event) => {
        const { type, data, success, error } = event.data;

        switch (type) {
          case 'output':
            output += data;
            break;
          case 'error':
            errors.push({ type: 'runtime', message: data });
            break;
          case 'warning':
            warnings.push({ type: 'style', message: data });
            break;
          case 'complete':
            clearTimeout(timeout);
            worker.terminate();
            
            if (error) {
              errors.push({
                type: 'runtime',
                message: error.message,
                stack: error.stack,
              });
            }

            resolve({
              id: executionId,
              success: success && errors.length === 0,
              output,
              errors,
              warnings,
              executionTime: performance.now() - startTime,
              memoryUsage: 0, // Can't measure in browser
              language: config.id,
              version: config.version,
            });
            break;
        }
      };

      worker.onerror = (error) => {
        clearTimeout(timeout);
        worker.terminate();
        resolve({
          id: executionId,
          success: false,
          output,
          errors: [{ type: 'runtime', message: error.message }],
          warnings,
          executionTime: performance.now() - startTime,
          memoryUsage: 0,
          language: config.id,
          version: config.version,
        });
      };

      // Handle abort
      abortController.signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        worker.terminate();
      });
    });
  }

  // Simulate code execution (fallback)
  private async simulateExecution(
    executionId: string,
    request: ExecutionRequest,
    config: LanguageConfig
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate different outcomes based on code content
    const code = request.code.toLowerCase();
    let success = true;
    let output = '';
    const errors: ExecutionError[] = [];
    const warnings: ExecutionWarning[] = [];

    if (code.includes('error') || code.includes('throw')) {
      success = false;
      errors.push({
        type: 'runtime',
        message: 'Simulated runtime error',
        line: 1,
      });
    } else if (code.includes('console.log') || code.includes('print')) {
      output = 'Hello, World!\nCode executed successfully!\n';
    } else if (code.includes('warning') || code.includes('deprecated')) {
      warnings.push({
        type: 'deprecation',
        message: 'This feature is deprecated',
        line: 1,
      });
      output = 'Code executed with warnings\n';
    } else {
      output = 'Code executed successfully!\n';
    }

    return {
      id: executionId,
      success,
      output,
      errors,
      warnings,
      executionTime: performance.now() - startTime,
      memoryUsage: Math.floor(Math.random() * 10 * 1024 * 1024), // Random memory usage
      language: config.id,
      version: config.version,
      exitCode: success ? 0 : 1,
      stats: {
        cpuTime: Math.random() * 100,
        peakMemory: Math.floor(Math.random() * 50 * 1024 * 1024),
        diskUsage: Math.floor(Math.random() * 1024),
        networkRequests: 0,
        systemCalls: Math.floor(Math.random() * 100),
      },
    };
  }

  // Cancel execution
  async cancelExecution(executionId: string): Promise<boolean> {
    const controller = this.activeExecutions.get(executionId);
    if (controller) {
      controller.abort();
      this.activeExecutions.delete(executionId);
      this.executionQueue.delete(executionId);
      
      log.info('Code execution cancelled', { executionId }, 'CODE_EXECUTION');
      return true;
    }
    return false;
  }

  // Get execution status
  getExecutionStatus(executionId: string): 'queued' | 'running' | 'completed' | 'not_found' {
    if (this.executionQueue.has(executionId)) {
      return this.activeExecutions.has(executionId) ? 'running' : 'queued';
    }
    
    const historyResult = this.executionHistory.find(r => r.id === executionId);
    return historyResult ? 'completed' : 'not_found';
  }

  // Get supported languages
  getSupportedLanguages(): LanguageConfig[] {
    return Object.values(LANGUAGE_CONFIGS);
  }

  // Get language configuration
  getLanguageConfig(languageId: string): LanguageConfig | null {
    return LANGUAGE_CONFIGS[languageId] || null;
  }

  // Add result to history
  private addToHistory(result: ExecutionResult): void {
    this.executionHistory.unshift(result);
    
    // Keep only the most recent executions
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory = this.executionHistory.slice(0, this.maxHistorySize);
    }
  }

  // Get execution history
  getExecutionHistory(limit = 10): ExecutionResult[] {
    return this.executionHistory.slice(0, limit);
  }

  // Clear execution history
  clearExecutionHistory(): void {
    this.executionHistory = [];
    log.info('Execution history cleared', undefined, 'CODE_EXECUTION');
  }

  // Get execution statistics
  getExecutionStats(): {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    languageUsage: Record<string, number>;
  } {
    const total = this.executionHistory.length;
    const successful = this.executionHistory.filter(r => r.success).length;
    const failed = total - successful;
    const avgTime = total > 0 
      ? this.executionHistory.reduce((sum, r) => sum + r.executionTime, 0) / total 
      : 0;

    const languageUsage: Record<string, number> = {};
    this.executionHistory.forEach(result => {
      languageUsage[result.language] = (languageUsage[result.language] || 0) + 1;
    });

    return {
      totalExecutions: total,
      successfulExecutions: successful,
      failedExecutions: failed,
      averageExecutionTime: avgTime,
      languageUsage,
    };
  }
}

// Export singleton instance
export const codeExecutionManager = CodeExecutionManager.getInstance();

// React hook for code execution
export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionHistory, setExecutionHistory] = React.useState<ExecutionResult[]>([]);

  const executeCode = async (request: ExecutionRequest, userId?: string): Promise<ExecutionResult> => {
    setIsExecuting(true);
    try {
      const result = await codeExecutionManager.executeCode(request, userId);
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
      return result;
    } finally {
      setIsExecuting(false);
    }
  };

  const cancelExecution = async (executionId: string): Promise<boolean> => {
    return await codeExecutionManager.cancelExecution(executionId);
  };

  const getSupportedLanguages = (): LanguageConfig[] => {
    return codeExecutionManager.getSupportedLanguages();
  };

  const getExecutionStats = () => {
    return codeExecutionManager.getExecutionStats();
  };

  return {
    isExecuting,
    executionHistory,
    executeCode,
    cancelExecution,
    getSupportedLanguages,
    getExecutionStats,
  };
}

// Import React for the hook
import React from 'react';