/**
 * Real-time Error Detection Service
 * Advanced error detection with instant feedback and suggestions
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface ErrorDetectionRequest {
  code: string;
  language: string;
  cursorPosition?: { line: number; column: number };
  previousCode?: string;
}

export interface DetectedError {
  id: string;
  type: 'syntax' | 'semantic' | 'runtime' | 'style' | 'security';
  severity: 'error' | 'warning' | 'info';
  message: string;
  description: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  suggestions: string[];
  fix?: string;
  confidence: number;
  category: string;
}

export interface ErrorDetectionResponse {
  errors: DetectedError[];
  warnings: DetectedError[];
  suggestions: DetectedError[];
  hasErrors: boolean;
  hasWarnings: boolean;
  processingTime: number;
  confidence: number;
}

class RealTimeErrorDetectionService {
  private cache = new Map<string, ErrorDetectionResponse>();
  private cacheTimeout = 30 * 1000; // 30 seconds for real-time updates
  private errorPatterns = new Map<string, RegExp[]>();

  constructor() {
    this.initializeErrorPatterns();
    log.info('Real-time Error Detection Service initialized', {}, 'ERROR_DETECTION');
  }

  /**
   * Initialize language-specific error patterns
   */
  private initializeErrorPatterns(): void {
    // Python error patterns
    this.errorPatterns.set('python', [
      /IndentationError:/,
      /SyntaxError:/,
      /NameError:/,
      /TypeError:/,
      /ValueError:/,
      /AttributeError:/,
      /KeyError:/,
      /IndexError:/,
      /ImportError:/,
      /ModuleNotFoundError:/,
      /^\s*if\s+.*:\s*$/m, // Empty if block
      /^\s*def\s+\w+\([^)]*\):\s*$/m, // Empty function
      /^\s*class\s+\w+.*:\s*$/m, // Empty class
    ]);

    // JavaScript/TypeScript error patterns
    this.errorPatterns.set('javascript', [
      /ReferenceError:/,
      /TypeError:/,
      /SyntaxError:/,
      /Error:/,
      /undefined_function\(/,
      /\{[^}]*$/m, // Unclosed braces
      /console\.log\([^)]*$/m, // Unclosed parentheses
      /funtion\s+/m, // Common typo
      /var\s+\w+\s*;\s*\w+\s*=/m, // Hoisting issues
    ]);

    this.errorPatterns.set('typescript', [
      ...this.errorPatterns.get('javascript') || [],
      /Property '\w+' does not exist/,
      /Type '\w+' is not assignable/,
      /Cannot find name '\w+'/,
      /Argument of type '\w+' is not assignable/,
    ]);

    // Java error patterns
    this.errorPatterns.set('java', [
      /public static void main/,
      /Missing return statement/,
      /Cannot find symbol/,
      /';' expected/,
      /'{' expected/,
      /Unreachable code/,
      /Variable might not have been initialized/,
    ]);

    // C++ error patterns
    this.errorPatterns.set('cpp', [
      /#include\s*$/m,
      /using namespace std;/,
      /return\s*;$/m,
      /int main\(\)\s*\{/m,
      /std::/,
      /cout\s*<</,
      /cin\s*>>/,
    ]);

    this.errorPatterns.set('c', [
      /#include\s*$/m,
      /int main\(\)\s*\{/m,
      /printf\(/,
      /scanf\(/,
      /return\s*;$/m,
    ]);
  }

  /**
   * Detect errors in real-time
   */
  async detectErrors(request: ErrorDetectionRequest): Promise<ErrorDetectionResponse> {
    const startTime = performance.now();
    const requestId = generateId('error-detection');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('error-detection-service', 200, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Detecting errors in real-time', { 
        requestId, 
        language: request.language,
        codeLength: request.code.length 
      }, 'ERROR_DETECTION');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached error detection', { requestId }, 'ERROR_DETECTION');
        return cached;
      }

      // Detect errors using multiple methods
      const errors = await this.performErrorDetection(request);
      const warnings = await this.detectWarnings(request);
      const suggestions = await this.generateSuggestions(request);

      const processingTime = performance.now() - startTime;

      const response: ErrorDetectionResponse = {
        errors,
        warnings,
        suggestions,
        hasErrors: errors.length > 0,
        hasWarnings: warnings.length > 0,
        processingTime,
        confidence: 0.95,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Real-time error detection completed', { 
        requestId, 
        errorsCount: errors.length,
        warningsCount: warnings.length,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Real-time error detection failed', error as Error, 'ERROR_DETECTION');
      
      // Return minimal response
      return {
        errors: [],
        warnings: [],
        suggestions: [],
        hasErrors: false,
        hasWarnings: false,
        processingTime,
        confidence: 0.0,
      };
    }
  }

  /**
   * Perform comprehensive error detection
   */
  private async performErrorDetection(request: ErrorDetectionRequest): Promise<DetectedError[]> {
    const { code, language } = request;
    const errors: DetectedError[] = [];

    // Language-specific error detection
    switch (language.toLowerCase()) {
      case 'python':
        errors.push(...this.detectPythonErrors(code));
        break;
      case 'javascript':
      case 'typescript':
        errors.push(...this.detectJavaScriptErrors(code, language));
        break;
      case 'java':
        errors.push(...this.detectJavaErrors(code));
        break;
      case 'cpp':
      case 'c':
        errors.push(...this.detectCppErrors(code, language));
        break;
      case 'csharp':
        errors.push(...this.detectCSharpErrors(code));
        break;
      case 'go':
        errors.push(...this.detectGoErrors(code));
        break;
      case 'rust':
        errors.push(...this.detectRustErrors(code));
        break;
      default:
        errors.push(...this.detectGenericErrors(code));
    }

    // Common error patterns
    errors.push(...this.detectCommonErrors(code, language));

    return errors;
  }

  /**
   * Detect Python-specific errors
   */
  private detectPythonErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Indentation errors
      if (line.match(/^\s*if\s+.*:\s*$/) && index < lines.length - 1) {
        const nextLine = lines[index + 1];
        if (nextLine && !nextLine.match(/^\s{2,}/)) {
          errors.push({
            id: generateId('error'),
            type: 'syntax',
            severity: 'error',
            message: 'IndentationError: expected an indented block',
            description: 'After an if statement, the next line must be indented.',
            line: lineNumber + 1,
            column: 1,
            suggestions: [
              'Add proper indentation (4 spaces or 1 tab)',
              'Use a pass statement if the block should be empty'
            ],
            fix: '    pass  # Add this line with proper indentation',
            confidence: 0.95,
            category: 'Indentation'
          });
        }
      }

      // Missing colons
      if (line.match(/^\s*(if|for|while|def|class|try|except|finally|else|elif)\s+.*[^:]\s*$/)) {
        errors.push({
          id: generateId('error'),
          type: 'syntax',
          severity: 'error',
          message: 'SyntaxError: invalid syntax',
          description: 'Missing colon after control statement.',
          line: lineNumber,
          column: line.length,
          suggestions: [
            'Add a colon (:) at the end of the statement'
          ],
          fix: ':',
          confidence: 0.98,
          category: 'Syntax'
        });
      }

      // Common typos
      if (line.includes('prnt(')) {
        errors.push({
          id: generateId('error'),
          type: 'semantic',
          severity: 'error',
          message: 'NameError: name "prnt" is not defined',
          description: 'Common typo: "prnt" should be "print".',
          line: lineNumber,
          column: line.indexOf('prnt') + 1,
          suggestions: [
            'Change "prnt" to "print"'
          ],
          fix: 'print',
          confidence: 0.99,
          category: 'Typo'
        });
      }
    });

    return errors;
  }

  /**
   * Detect JavaScript/TypeScript errors
   */
  private detectJavaScriptErrors(code: string, language: string): DetectedError[] {
    const errors: DetectedError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Unclosed braces
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces && line.trim().endsWith('{')) {
        errors.push({
          id: generateId('error'),
          type: 'syntax',
          severity: 'error',
          message: 'SyntaxError: Unexpected end of input',
          description: 'Missing closing brace for opening brace.',
          line: lineNumber,
          column: line.length,
          suggestions: [
            'Add a closing brace }',
            'Check for balanced braces throughout the code'
          ],
          confidence: 0.9,
          category: 'Syntax'
        });
      }

      // Common typos
      if (line.includes('funtion ')) {
        errors.push({
          id: generateId('error'),
          type: 'syntax',
          severity: 'error',
          message: 'SyntaxError: Unexpected token',
          description: 'Common typo: "funtion" should be "function".',
          line: lineNumber,
          column: line.indexOf('funtion') + 1,
          suggestions: [
            'Change "funtion" to "function"'
          ],
          fix: 'function',
          confidence: 0.99,
          category: 'Typo'
        });
      }

      // Undefined function calls
      if (line.includes('undefined_function(')) {
        errors.push({
          id: generateId('error'),
          type: 'semantic',
          severity: 'error',
          message: 'ReferenceError: undefined_function is not defined',
          description: 'Function is called but not defined.',
          line: lineNumber,
          column: line.indexOf('undefined_function') + 1,
          suggestions: [
            'Define the function before using it',
            'Check for typos in the function name',
            'Import the function if it\'s from another module'
          ],
          confidence: 0.95,
          category: 'Reference'
        });
      }

      // TypeScript specific errors
      if (language === 'typescript') {
        // Missing type annotations
        if (line.match(/function\s+\w+\s*\([^)]*\)\s*\{/) && !line.includes(':')) {
          errors.push({
            id: generateId('error'),
            type: 'semantic',
            severity: 'warning',
            message: 'Type annotation missing',
            description: 'Consider adding type annotations for better type safety.',
            line: lineNumber,
            column: line.indexOf('(') + 1,
            suggestions: [
              'Add parameter types: function name(param: type)',
              'Add return type: function name(): returnType'
            ],
            confidence: 0.8,
            category: 'Type Safety'
          });
        }
      }
    });

    return errors;
  }

  /**
   * Detect Java errors
   */
  private detectJavaErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Missing main method
    if (!code.includes('public static void main')) {
      errors.push({
        id: generateId('error'),
        type: 'semantic',
        severity: 'error',
        message: 'Missing main method',
        description: 'Java programs require a main method as the entry point.',
        line: 1,
        column: 1,
        suggestions: [
          'Add: public static void main(String[] args) { ... }'
        ],
        confidence: 0.95,
        category: 'Structure'
      });
    }

    return errors;
  }

  /**
   * Detect C++ errors
   */
  private detectCppErrors(code: string, language: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Missing includes
    if (code.includes('cout') && !code.includes('#include <iostream>')) {
      errors.push({
        id: generateId('error'),
        type: 'semantic',
        severity: 'error',
        message: 'Missing include for iostream',
        description: 'cout requires the iostream header.',
        line: 1,
        column: 1,
        suggestions: [
          'Add: #include <iostream> at the top'
        ],
        confidence: 0.95,
        category: 'Include'
      });
    }

    return errors;
  }

  /**
   * Detect C# errors
   */
  private detectCSharpErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Missing using statements
    if (code.includes('Console.') && !code.includes('using System;')) {
      errors.push({
        id: generateId('error'),
        type: 'semantic',
        severity: 'error',
        message: 'Missing using System directive',
        description: 'Console requires the System namespace.',
        line: 1,
        column: 1,
        suggestions: [
          'Add: using System; at the top'
        ],
        confidence: 0.95,
        category: 'Using'
      });
    }

    return errors;
  }

  /**
   * Detect Go errors
   */
  private detectGoErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Missing package declaration
    if (!code.includes('package main') && !code.includes('package ')) {
      errors.push({
        id: generateId('error'),
        type: 'syntax',
        severity: 'error',
        message: 'Missing package declaration',
        description: 'Go files must start with a package declaration.',
        line: 1,
        column: 1,
        suggestions: [
          'Add: package main at the top'
        ],
        confidence: 0.95,
        category: 'Package'
      });
    }

    return errors;
  }

  /**
   * Detect Rust errors
   */
  private detectRustErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Missing main function
    if (!code.includes('fn main()') && code.includes('println!')) {
      errors.push({
        id: generateId('error'),
        type: 'semantic',
        severity: 'error',
        message: 'Missing main function',
        description: 'Rust programs need a main function as the entry point.',
        line: 1,
        column: 1,
        suggestions: [
          'Add: fn main() { ... }'
        ],
        confidence: 0.95,
        category: 'Structure'
      });
    }

    return errors;
  }

  /**
   * Detect generic errors for any language
   */
  private detectGenericErrors(code: string): DetectedError[] {
    const errors: DetectedError[] = [];

    // Empty code
    if (!code.trim()) {
      errors.push({
        id: generateId('error'),
        type: 'semantic',
        severity: 'warning',
        message: 'Empty code',
        description: 'The editor is empty. Write some code to get started.',
        line: 1,
        column: 1,
        suggestions: [
          'Write a simple "Hello, World!" program',
          'Try using the language templates'
        ],
        confidence: 1.0,
        category: 'Empty'
      });
    }

    return errors;
  }

  /**
   * Detect common errors across all languages
   */
  private detectCommonErrors(code: string, language: string): DetectedError[] {
    const errors: DetectedError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Unclosed strings
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      
      if (singleQuotes % 2 !== 0) {
        errors.push({
          id: generateId('error'),
          type: 'syntax',
          severity: 'error',
          message: 'Unclosed single quote string',
          description: 'String literal is not properly closed.',
          line: lineNumber,
          column: line.lastIndexOf("'") + 1,
          suggestions: [
            'Add a closing single quote',
            'Escape the quote if it\'s part of the string'
          ],
          confidence: 0.95,
          category: 'String'
        });
      }

      if (doubleQuotes % 2 !== 0) {
        errors.push({
          id: generateId('error'),
          type: 'syntax',
          severity: 'error',
          message: 'Unclosed double quote string',
          description: 'String literal is not properly closed.',
          line: lineNumber,
          column: line.lastIndexOf('"') + 1,
          suggestions: [
            'Add a closing double quote',
            'Escape the quote if it\'s part of the string'
          ],
          confidence: 0.95,
          category: 'String'
        });
      }
    });

    return errors;
  }

  /**
   * Detect warnings (non-critical issues)
   */
  private async detectWarnings(request: ErrorDetectionRequest): Promise<DetectedError[]> {
    const warnings: DetectedError[] = [];
    const { code, language } = request;
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Long lines
      if (line.length > 100) {
        warnings.push({
          id: generateId('warning'),
          type: 'style',
          severity: 'warning',
          message: 'Line too long',
          description: 'Consider breaking this line for better readability.',
          line: lineNumber,
          column: 100,
          suggestions: [
            'Break the line into multiple lines',
            'Use proper formatting'
          ],
          confidence: 0.8,
          category: 'Style'
        });
      }

      // TODO comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        warnings.push({
          id: generateId('warning'),
          type: 'style',
          severity: 'info',
          message: 'TODO/FIXME comment found',
          description: 'Remember to address this TODO or FIXME.',
          line: lineNumber,
          column: 1,
          suggestions: [
            'Complete the TODO item',
            'Remove if no longer needed'
          ],
          confidence: 0.9,
          category: 'TODO'
        });
      }
    });

    return warnings;
  }

  /**
   * Generate improvement suggestions
   */
  private async generateSuggestions(request: ErrorDetectionRequest): Promise<DetectedError[]> {
    const suggestions: DetectedError[] = [];
    const { code, language } = request;

    // Code complexity suggestions
    if (code.split('\n').length > 50) {
      suggestions.push({
        id: generateId('suggestion'),
        type: 'style',
        severity: 'info',
        message: 'Consider breaking into smaller functions',
        description: 'Large functions can be hard to understand and maintain.',
        line: 1,
        column: 1,
        suggestions: [
          'Split into smaller, focused functions',
          'Use helper functions for complex logic'
        ],
        confidence: 0.7,
        category: 'Refactoring'
      });
    }

    return suggestions;
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: ErrorDetectionRequest): string {
    const key = `${request.language}-${request.code.slice(-200)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): ErrorDetectionResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: ErrorDetectionResponse): void {
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
    log.info('Real-time Error Detection Service cache cleared', {}, 'ERROR_DETECTION');
  }
}

// Create singleton instance
export const realTimeErrorDetectionService = new RealTimeErrorDetectionService();
export default realTimeErrorDetectionService;
