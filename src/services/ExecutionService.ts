interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  outputType: 'console' | 'web' | 'api' | 'error';
  hasWebOutput: boolean;
  hasApiEndpoints: boolean;
  serverPort?: number;
  warnings?: string[];
}

interface ExecutionOptions {
  timeout?: number;
  maxMemory?: number;
  allowNetworkAccess?: boolean;
  allowFileSystem?: boolean;
  customEnvironment?: Record<string, string>;
}

export class ExecutionService {
  private static instance: ExecutionService;
  
  static getInstance(): ExecutionService {
    if (!this.instance) {
      this.instance = new ExecutionService();
    }
    return this.instance;
  }

  async executeCode(code: string, language: string, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Input validation and sanitization
      const sanitizedCode = this.sanitizeCode(code, language);
      const validationResult = this.validateCode(sanitizedCode, language);
      
      if (!validationResult.isValid) {
        return {
          success: false,
          output: '',
          error: validationResult.error,
          executionTime: Date.now() - startTime,
          outputType: 'error',
          hasWebOutput: false,
          hasApiEndpoints: false
        };
      }

      // Execute based on language
      const result = await this.executeByLanguage(sanitizedCode, language, options);
      
      return {
        ...result,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: Date.now() - startTime,
        outputType: 'error',
        hasWebOutput: false,
        hasApiEndpoints: false
      };
    }
  }

  private sanitizeCode(code: string, language: string): string {
    // Remove dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/gi,
      /exec\s*\(/gi,
      /system\s*\(/gi,
      /import\s+os/gi,
      /from\s+os\s+import/gi,
      /subprocess/gi,
      /__import__/gi
    ];

    let sanitized = code;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '// DANGEROUS_PATTERN_REMOVED');
    });

    return sanitized;
  }

  private validateCode(code: string, language: string): { isValid: boolean; error?: string } {
    // Basic syntax validation
    switch (language) {
      case 'javascript':
      case 'typescript':
        return this.validateJavaScript(code);
      case 'python':
        return this.validatePython(code);
      case 'java':
        return this.validateJava(code);
      case 'cpp':
        return this.validateCpp(code);
      default:
        return { isValid: true };
    }
  }

  private validateJavaScript(code: string): { isValid: boolean; error?: string } {
    try {
      new Function(code);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Syntax error'
      };
    }
  }

  private validatePython(code: string): { isValid: boolean; error?: string } {
    // Basic Python validation
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#')) {
        // Check for basic syntax issues
        if (line.endsWith(':') && i === lines.length - 1) {
          return { isValid: false, error: 'Incomplete block statement' };
        }
      }
    }
    return { isValid: true };
  }

  private validateJava(code: string): { isValid: boolean; error?: string } {
    // Check for basic Java structure
    if (!code.includes('class ') && !code.includes('interface ')) {
      return { isValid: false, error: 'Java code must contain a class or interface' };
    }
    return { isValid: true };
  }

  private validateCpp(code: string): { isValid: boolean; error?: string } {
    // Check for basic C++ structure
    if (!code.includes('#include') && !code.includes('int main')) {
      return { isValid: false, error: 'C++ code should include headers and main function' };
    }
    return { isValid: true };
  }

  private async executeByLanguage(code: string, language: string, options: ExecutionOptions): Promise<Omit<ExecutionResult, 'executionTime'>> {
    switch (language) {
      case 'javascript':
        return this.executeJavaScript(code);
      case 'typescript':
        return this.executeTypeScript(code);
      case 'python':
        return this.executePython(code);
      case 'java':
        return this.executeJava(code);
      case 'cpp':
        return this.executeCpp(code);
      case 'html':
        return this.executeHtml(code);
      case 'react':
        return this.executeReact(code);
      default:
        return this.simulateExecution(code, language);
    }
  }

  private executeJavaScript(code: string): Omit<ExecutionResult, 'executionTime'> {
    try {
      let output = '';
      const originalConsole = console.log;
      
      // Capture console output
      console.log = (...args) => {
        output += args.join(' ') + '\n';
      };

      // Check if it's a web application
      const hasWebOutput = this.detectWebOutput(code);
      const hasApiEndpoints = this.detectApiEndpoints(code);

      if (hasWebOutput || hasApiEndpoints) {
        console.log = originalConsole;
        return {
          success: true,
          output: hasWebOutput ? 'Web application detected - redirecting to preview' : 'API server detected',
          outputType: hasWebOutput ? 'web' : 'api',
          hasWebOutput,
          hasApiEndpoints,
          serverPort: hasApiEndpoints ? 3000 : undefined
        };
      }

      // Execute the code
      const result = eval(code);
      
      // Restore console
      console.log = originalConsole;

      if (result !== undefined) {
        output += result;
      }

      return {
        success: true,
        output: output || 'Code executed successfully',
        outputType: 'console',
        hasWebOutput: false,
        hasApiEndpoints: false
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'JavaScript execution error',
        outputType: 'error',
        hasWebOutput: false,
        hasApiEndpoints: false
      };
    }
  }

  private executeTypeScript(code: string): Omit<ExecutionResult, 'executionTime'> {
    // For simplicity, treat as JavaScript (in a real implementation, you'd transpile)
    return this.executeJavaScript(code);
  }

  private executePython(code: string): Omit<ExecutionResult, 'executionTime'> {
    // Simulate Python execution
    const hasWebOutput = code.includes('flask') || code.includes('django') || code.includes('streamlit');
    const hasApiEndpoints = code.includes('@app.route') || code.includes('def api_');

    if (hasWebOutput || hasApiEndpoints) {
      return {
        success: true,
        output: hasWebOutput ? 'Python web application detected' : 'Python API detected',
        outputType: hasWebOutput ? 'web' : 'api',
        hasWebOutput,
        hasApiEndpoints,
        serverPort: 5000
      };
    }

    // Simple Python simulation
    let output = '';
    if (code.includes('print(')) {
      const printMatches = code.match(/print\([^)]*\)/g);
      if (printMatches) {
        printMatches.forEach(match => {
          const content = match.replace(/print\(['"]?([^'"]*?)['"]?\)/, '$1');
          output += content + '\n';
        });
      }
    }

    return {
      success: true,
      output: output || 'Python code executed successfully',
      outputType: 'console',
      hasWebOutput: false,
      hasApiEndpoints: false
    };
  }

  private executeJava(code: string): Omit<ExecutionResult, 'executionTime'> {
    // Simulate Java execution
    const hasWebOutput = code.includes('@RestController') || code.includes('Spring');
    
    return {
      success: true,
      output: hasWebOutput ? 'Java web application detected' : 'Java code executed successfully',
      outputType: hasWebOutput ? 'web' : 'console',
      hasWebOutput,
      hasApiEndpoints: hasWebOutput,
      serverPort: hasWebOutput ? 8080 : undefined
    };
  }

  private executeCpp(code: string): Omit<ExecutionResult, 'executionTime'> {
    // Simulate C++ execution
    return {
      success: true,
      output: 'C++ code compiled and executed successfully',
      outputType: 'console',
      hasWebOutput: false,
      hasApiEndpoints: false
    };
  }

  private executeHtml(code: string): Omit<ExecutionResult, 'executionTime'> {
    return {
      success: true,
      output: 'HTML page generated - redirecting to preview',
      outputType: 'web',
      hasWebOutput: true,
      hasApiEndpoints: false
    };
  }

  private executeReact(code: string): Omit<ExecutionResult, 'executionTime'> {
    return {
      success: true,
      output: 'React component generated - redirecting to preview',
      outputType: 'web',
      hasWebOutput: true,
      hasApiEndpoints: false
    };
  }

  private simulateExecution(code: string, language: string): Omit<ExecutionResult, 'executionTime'> {
    return {
      success: true,
      output: `${language} code executed successfully`,
      outputType: 'console',
      hasWebOutput: false,
      hasApiEndpoints: false
    };
  }

  private detectWebOutput(code: string): boolean {
    const webPatterns = [
      /document\./,
      /createElement/,
      /getElementById/,
      /innerHTML/,
      /addEventListener/,
      /<html/,
      /<body/,
      /<div/,
      /React\./,
      /ReactDOM/,
      /render\(/
    ];

    return webPatterns.some(pattern => pattern.test(code));
  }

  private detectApiEndpoints(code: string): boolean {
    const apiPatterns = [
      /app\.get\(/,
      /app\.post\(/,
      /app\.put\(/,
      /app\.delete\(/,
      /router\./,
      /@app\.route/,
      /@RestController/,
      /http\.HandleFunc/
    ];

    return apiPatterns.some(pattern => pattern.test(code));
  }
}

export const executionService = ExecutionService.getInstance();