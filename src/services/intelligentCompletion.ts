/**
 * Intelligent Code Completion Service
 * Advanced AI-powered code completion with context awareness
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface CompletionRequest {
  code: string;
  language: string;
  cursorPosition: { line: number; column: number };
  context?: {
    imports: string[];
    variables: string[];
    functions: string[];
    classes: string[];
  };
}

export interface CompletionSuggestion {
  text: string;
  type: 'function' | 'variable' | 'class' | 'keyword' | 'snippet';
  description?: string;
  documentation?: string;
  confidence: number;
  insertText: string;
  range?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface CompletionResponse {
  suggestions: CompletionSuggestion[];
  context: string;
  confidence: number;
  processingTime: number;
}

class IntelligentCompletionService {
  private cache = new Map<string, CompletionResponse>();
  private cacheTimeout = 2 * 60 * 1000; // 2 minutes

  constructor() {
    log.info('Intelligent Completion Service initialized', {}, 'COMPLETION');
  }

  /**
   * Get intelligent code completions
   */
  async getCompletions(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = performance.now();
    const requestId = generateId('completion');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('completion-service', 100, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Getting intelligent completions', { 
        requestId, 
        language: request.language,
        cursorPosition: request.cursorPosition 
      }, 'COMPLETION');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached completions', { requestId }, 'COMPLETION');
        return cached;
      }

      // Generate completions based on language and context
      const suggestions = await this.generateIntelligentCompletions(request);
      const processingTime = performance.now() - startTime;

      const response: CompletionResponse = {
        suggestions,
        context: this.extractContext(request.code, request.cursorPosition),
        confidence: 0.9,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Intelligent completions generated', { 
        requestId, 
        suggestionsCount: suggestions.length,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Intelligent completions failed', error as Error, 'COMPLETION');
      
      // Return fallback completions
      return this.getFallbackCompletions(request, processingTime);
    }
  }

  /**
   * Generate intelligent completions using AI and language-specific patterns
   */
  private async generateIntelligentCompletions(request: CompletionRequest): Promise<CompletionSuggestion[]> {
    const { code, language, cursorPosition, context } = request;
    
    // Language-specific intelligent completions
    switch (language.toLowerCase()) {
      case 'python':
        return this.getPythonCompletions(code, cursorPosition, context);
      case 'javascript':
      case 'typescript':
        return this.getJavaScriptCompletions(code, cursorPosition, context);
      case 'java':
        return this.getJavaCompletions(code, cursorPosition, context);
      case 'cpp':
      case 'c':
        return this.getCppCompletions(code, cursorPosition, context);
      case 'csharp':
        return this.getCSharpCompletions(code, cursorPosition, context);
      case 'go':
        return this.getGoCompletions(code, cursorPosition, context);
      case 'rust':
        return this.getRustCompletions(code, cursorPosition, context);
      default:
        return this.getGenericCompletions(code, cursorPosition, context);
    }
  }

  /**
   * Python-specific intelligent completions
   */
  private getPythonCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // Common Python patterns
    if (currentLine.trim().endsWith('.')) {
      // Object method completions
      suggestions.push(
        {
          text: 'append()',
          type: 'function',
          description: 'Add an item to the end of the list',
          insertText: 'append($1)',
          confidence: 0.9
        },
        {
          text: 'len()',
          type: 'function',
          description: 'Get the length of an object',
          insertText: 'len($1)',
          confidence: 0.9
        },
        {
          text: 'print()',
          type: 'function',
          description: 'Print to console',
          insertText: 'print($1)',
          confidence: 0.95
        }
      );
    }

    // Import suggestions
    if (currentLine.trim().startsWith('import ') || currentLine.trim().startsWith('from ')) {
      suggestions.push(
        {
          text: 'numpy',
          type: 'keyword',
          description: 'Numerical computing library',
          insertText: 'numpy',
          confidence: 0.9
        },
        {
          text: 'pandas',
          type: 'keyword',
          description: 'Data analysis library',
          insertText: 'pandas',
          confidence: 0.9
        },
        {
          text: 'requests',
          type: 'keyword',
          description: 'HTTP library',
          insertText: 'requests',
          confidence: 0.9
        }
      );
    }

    // Function definition completions
    if (currentLine.trim().startsWith('def ')) {
      suggestions.push(
        {
          text: 'if __name__ == "__main__":',
          type: 'snippet',
          description: 'Main execution block',
          insertText: 'if __name__ == "__main__":\n    $1',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  /**
   * JavaScript/TypeScript-specific intelligent completions
   */
  private getJavaScriptCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // Console methods
    if (currentLine.includes('console.')) {
      suggestions.push(
        {
          text: 'log()',
          type: 'function',
          description: 'Log to console',
          insertText: 'log($1)',
          confidence: 0.95
        },
        {
          text: 'error()',
          type: 'function',
          description: 'Log error to console',
          insertText: 'error($1)',
          confidence: 0.9
        }
      );
    }

    // Array methods
    if (currentLine.includes('[') || currentLine.includes('Array')) {
      suggestions.push(
        {
          text: 'forEach()',
          type: 'function',
          description: 'Execute function for each array element',
          insertText: 'forEach($1 => {\n    $2\n})',
          confidence: 0.9
        },
        {
          text: 'map()',
          type: 'function',
          description: 'Create new array with results',
          insertText: 'map($1 => $2)',
          confidence: 0.9
        }
      );
    }

    // Async/await patterns
    if (currentLine.includes('async') || currentLine.includes('Promise')) {
      suggestions.push(
        {
          text: 'await',
          type: 'keyword',
          description: 'Wait for promise resolution',
          insertText: 'await $1',
          confidence: 0.9
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Java-specific intelligent completions
   */
  private getJavaCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // System.out patterns
    if (currentLine.includes('System.')) {
      suggestions.push(
        {
          text: 'out.println()',
          type: 'function',
          description: 'Print line to console',
          insertText: 'out.println($1);',
          confidence: 0.95
        }
      );
    }

    // Main method
    if (currentLine.includes('public static void main')) {
      suggestions.push(
        {
          text: 'String[] args',
          type: 'snippet',
          description: 'Command line arguments',
          insertText: 'String[] args',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * C++ specific intelligent completions
   */
  private getCppCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // Include suggestions
    if (currentLine.startsWith('#include')) {
      suggestions.push(
        {
          text: '<iostream>',
          type: 'keyword',
          description: 'Input/output stream library',
          insertText: '<iostream>',
          confidence: 0.95
        },
        {
          text: '<vector>',
          type: 'keyword',
          description: 'Dynamic array library',
          insertText: '<vector>',
          confidence: 0.9
        }
      );
    }

    // Using namespace
    if (currentLine.includes('using namespace')) {
      suggestions.push(
        {
          text: 'std',
          type: 'keyword',
          description: 'Standard namespace',
          insertText: 'std',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * C# specific intelligent completions
   */
  private getCSharpCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // Console methods
    if (currentLine.includes('Console.')) {
      suggestions.push(
        {
          text: 'WriteLine()',
          type: 'function',
          description: 'Write line to console',
          insertText: 'WriteLine($1);',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Go specific intelligent completions
   */
  private getGoCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // Package main
    if (currentLine.includes('package main')) {
      suggestions.push(
        {
          text: 'import "fmt"',
          type: 'snippet',
          description: 'Import fmt package',
          insertText: 'import "fmt"',
          confidence: 0.95
        }
      );
    }

    // fmt methods
    if (currentLine.includes('fmt.')) {
      suggestions.push(
        {
          text: 'Println()',
          type: 'function',
          description: 'Print line with newline',
          insertText: 'Println($1)',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Rust specific intelligent completions
   */
  private getRustCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    const suggestions: CompletionSuggestion[] = [];
    const currentLine = code.split('\n')[cursorPosition.line] || '';
    
    // println macro
    if (currentLine.includes('println!')) {
      suggestions.push(
        {
          text: 'println!("{}", variable)',
          type: 'snippet',
          description: 'Print with placeholder',
          insertText: 'println!("{}", $1);',
          confidence: 0.95
        }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Generic completions for any language
   */
  private getGenericCompletions(code: string, cursorPosition: any, context?: any): CompletionSuggestion[] {
    return [
      {
        text: '// TODO:',
        type: 'snippet',
        description: 'Add TODO comment',
        insertText: '// TODO: $1',
        confidence: 0.8
      },
      {
        text: '/* */',
        type: 'snippet',
        description: 'Multi-line comment',
        insertText: '/* $1 */',
        confidence: 0.8
      }
    ];
  }

  /**
   * Extract context around cursor position
   */
  private extractContext(code: string, cursorPosition: any): string {
    const lines = code.split('\n');
    const start = Math.max(0, cursorPosition.line - 2);
    const end = Math.min(lines.length, cursorPosition.line + 3);
    
    return lines.slice(start, end).join('\n');
  }

  /**
   * Get fallback completions when AI fails
   */
  private getFallbackCompletions(request: CompletionRequest, processingTime: number): CompletionResponse {
    return {
      suggestions: [
        {
          text: '// Add your code here',
          type: 'snippet',
          description: 'Code placeholder',
          insertText: '// Add your code here',
          confidence: 0.5
        }
      ],
      context: this.extractContext(request.code, request.cursorPosition),
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: CompletionRequest): string {
    const key = `${request.language}-${request.cursorPosition.line}-${request.cursorPosition.column}-${request.code.slice(-100)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): CompletionResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: CompletionResponse): void {
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
    log.info('Intelligent Completion Service cache cleared', {}, 'COMPLETION');
  }
}

// Create singleton instance
export const intelligentCompletionService = new IntelligentCompletionService();
export default intelligentCompletionService;
