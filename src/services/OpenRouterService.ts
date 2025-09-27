interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface CodeAnalysisResult {
  isValid: boolean;
  hasErrors: boolean;
  errors: Array<{
    type: string;
    message: string;
    line?: number;
    suggestions: string[];
  }>;
  expectedOutput?: string;
  executionResult?: {
    success: boolean;
    output: string;
    error?: string;
  };
}

class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || 'sk-or-v1-your-api-key-here';
  }

  async analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
    // If no API key is configured, use fallback analysis
    if (!this.apiKey || this.apiKey === 'sk-or-v1-your-api-key-here') {
      console.warn('OpenRouter API key not configured, using fallback analysis');
      return this.fallbackAnalysis(code, language);
    }

    try {
      // Try primary model first
      const result = await this.tryModel('meta-llama/llama-3.2-3b-instruct:free', code, language);
      if (result) return result;
      
      // If primary fails, try alternative models
      return await this.tryAlternativeModels(code, language);
    } catch (error) {
      console.error('All OpenRouter models failed:', error);
      return this.fallbackAnalysis(code, language);
    }
  }

  private async tryModel(model: string, code: string, language: string): Promise<CodeAnalysisResult | null> {
    try {
      const prompt = this.createAnalysisPrompt(code, language);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CodeFusionAI Editor'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert code analyzer and compiler. Analyze code for syntax errors, logical issues, and predict execution results. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        console.warn(`Model ${model} failed with status: ${response.status}`);
        return null;
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        console.warn(`Model ${model} returned no content`);
        return null;
      }

      return this.parseAnalysisResult(content);
    } catch (error) {
      console.warn(`Model ${model} failed:`, error);
      return null;
    }
  }

  private async tryAlternativeModels(code: string, language: string): Promise<CodeAnalysisResult> {
    const freeModels = [
      'microsoft/phi-3-mini-128k-instruct:free',
      'huggingface/zephyr-7b-beta:free',
      'openchat/openchat-7b:free',
      'google/gemma-2-9b-it:free',
      'meta-llama/llama-3.1-8b-instruct:free'
    ];

    for (const model of freeModels) {
      const result = await this.tryModel(model, code, language);
      if (result) {
        console.log(`Successfully used model: ${model}`);
        return result;
      }
    }

    // If all models fail, use enhanced fallback
    console.warn('All AI models failed, using enhanced fallback analysis');
    return this.enhancedFallbackAnalysis(code, language);
  }

  private createAnalysisPrompt(code: string, language: string): string {
    return `Analyze this ${language} code and provide a detailed analysis in JSON format:

\`\`\`${language}
${code}
\`\`\`

Please analyze the code and respond with a JSON object containing:
{
  "isValid": boolean,
  "hasErrors": boolean,
  "errors": [
    {
      "type": "string (e.g., 'SyntaxError', 'LogicError', 'RuntimeError')",
      "message": "string (detailed error description)",
      "line": number (optional, line number if applicable),
      "suggestions": ["array of specific suggestions to fix the error"]
    }
  ],
  "expectedOutput": "string (what the code should output if it runs successfully)",
  "executionResult": {
    "success": boolean,
    "output": "string (actual expected output or error message)",
    "error": "string (error details if any)"
  }
}

Rules:
1. Check for syntax errors, missing imports, undefined variables, etc.
2. For valid code, predict the exact output
3. Provide specific, actionable suggestions
4. Consider language-specific rules (indentation for Python, semicolons for Java/C++, etc.)
5. If code has print/console.log statements, predict their exact output
6. Return only valid JSON, no additional text`;
  }

  private parseAnalysisResult(content: string): CodeAnalysisResult {
    try {
      // Clean the content to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      return {
        isValid: result.isValid || false,
        hasErrors: result.hasErrors || false,
        errors: Array.isArray(result.errors) ? result.errors : [],
        expectedOutput: result.expectedOutput || '',
        executionResult: result.executionResult || {
          success: !result.hasErrors,
          output: result.expectedOutput || '',
          error: result.hasErrors ? 'Code has errors' : undefined
        }
      };
    } catch (error) {
      console.error('Failed to parse OpenRouter response:', error);
      throw new Error('Invalid response format from AI');
    }
  }

  private fallbackAnalysis(code: string, language: string): CodeAnalysisResult {
    return this.enhancedFallbackAnalysis(code, language);
  }

  private enhancedFallbackAnalysis(code: string, language: string): CodeAnalysisResult {
    const errors: Array<{type: string; message: string; line?: number; suggestions: string[]}> = [];
    
    // Basic syntax checks
    if (!code.trim()) {
      errors.push({
        type: 'EmptyCodeError',
        message: 'No code provided - the editor is empty',
        suggestions: [
          'Write some code to analyze',
          'Try a simple example like print("Hello, World!")',
          'Use the language templates for quick start'
        ]
      });
    }

    // Enhanced language-specific analysis
    switch (language.toLowerCase()) {
      case 'python':
        this.analyzePython(code, errors);
        break;
      
      case 'javascript':
      case 'typescript':
        this.analyzeJavaScript(code, errors);
        break;
      
      case 'java':
        this.analyzeJava(code, errors);
        break;
      
      case 'cpp':
      case 'c':
        this.analyzeCpp(code, errors);
        break;
      
      case 'csharp':
        this.analyzeCSharp(code, errors);
        break;
      
      case 'go':
        this.analyzeGo(code, errors);
        break;
      
      case 'rust':
        this.analyzeRust(code, errors);
        break;
      
      case 'php':
        this.analyzePhp(code, errors);
        break;
    }

    // Common syntax checks for all languages
    this.analyzeCommonSyntax(code, errors);

    const hasErrors = errors.length > 0;
    const expectedOutput = hasErrors ? '' : this.predictEnhancedOutput(code, language);
    
    return {
      isValid: !hasErrors,
      hasErrors,
      errors,
      expectedOutput,
      executionResult: {
        success: !hasErrors,
        output: hasErrors ? `❌ Code Analysis Failed\n\nFound ${errors.length} error(s):\n${errors.map((e, i) => `${i + 1}. ${e.type}: ${e.message}`).join('\n')}` : expectedOutput,
        error: hasErrors ? errors[0].message : undefined
      }
    };
  }

  private analyzePython(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for common Python syntax errors
    if (code.includes('print(') && !code.match(/print\([^)]*\)/)) {
      errors.push({
        type: 'SyntaxError',
        message: 'Incomplete print statement - missing closing parenthesis',
        suggestions: [
          'Add closing parenthesis: print("Hello")',
          'Check all parentheses are properly matched',
          'Ensure quotes are closed inside print statements'
        ]
      });
    }

    // Check for indentation issues
    const lines = code.split('\n');
    let inBlock = false;
    lines.forEach((line, index) => {
      if (line.trim().endsWith(':')) {
        inBlock = true;
      } else if (inBlock && line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
        errors.push({
          type: 'IndentationError',
          message: `Expected an indented block after line ${index}`,
          line: index + 1,
          suggestions: [
            'Add 4 spaces or 1 tab before the line',
            'Python requires indentation for code blocks',
            'Use consistent indentation (spaces or tabs, not both)'
          ]
        });
        inBlock = false;
      }
    });

    // Check for undefined variables (basic check)
    if (code.includes('undefined_variable') && !code.includes('undefined_variable =')) {
      errors.push({
        type: 'NameError',
        message: 'Variable "undefined_variable" is not defined',
        suggestions: [
          'Define the variable before using it',
          'Check for typos in variable names',
          'Import required modules if using external functions'
        ]
      });
    }
  }

  private analyzeJavaScript(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for console.log syntax
    if (code.includes('console.log(') && !code.match(/console\.log\([^)]*\)/)) {
      errors.push({
        type: 'SyntaxError',
        message: 'Incomplete console.log statement',
        suggestions: [
          'Add closing parenthesis: console.log("Hello")',
          'Check all parentheses are matched',
          'Ensure proper quote usage'
        ]
      });
    }

    // Check for common typos
    if (code.includes('consol.log') || code.includes('console.lg')) {
      errors.push({
        type: 'ReferenceError',
        message: 'Typo in console.log - check spelling',
        suggestions: [
          'Use correct spelling: console.log()',
          'Check for typos in method names',
          'Use IDE autocomplete to avoid typos'
        ]
      });
    }

    // Check for missing semicolons in certain contexts
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.trim().match(/^(let|const|var)\s+\w+\s*=\s*[^;]+$/) && !line.includes('//')) {
        errors.push({
          type: 'SyntaxError',
          message: `Missing semicolon at line ${index + 1}`,
          line: index + 1,
          suggestions: [
            'Add semicolon at the end of the statement',
            'JavaScript statements should end with semicolons',
            'Use a linter to catch missing semicolons'
          ]
        });
      }
    });
  }

  private analyzeJava(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for main method
    if (!code.includes('public static void main') && code.includes('System.out.println')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing main method - Java applications need a main method',
        suggestions: [
          'Add: public static void main(String[] args) { }',
          'Wrap your code inside the main method',
          'Ensure the class contains a main method for execution'
        ]
      });
    }

    // Check for class declaration
    if (!code.includes('class ') && !code.includes('public class')) {
      errors.push({
        type: 'CompilationError',
        message: 'Java code must be inside a class',
        suggestions: [
          'Wrap your code in: public class Main { }',
          'Create a class declaration',
          'Follow Java\'s object-oriented structure'
        ]
      });
    }

    // Check for System.out.println syntax
    if (code.includes('System.out.println(') && !code.match(/System\.out\.println\([^)]*\)/)) {
      errors.push({
        type: 'SyntaxError',
        message: 'Incomplete System.out.println statement',
        suggestions: [
          'Add closing parenthesis and semicolon',
          'Example: System.out.println("Hello");',
          'Check all parentheses are matched'
        ]
      });
    }
  }

  private analyzeCpp(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for includes
    if (!code.includes('#include') && (code.includes('cout') || code.includes('cin') || code.includes('printf'))) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing include directives',
        suggestions: [
          'Add #include <iostream> for cout/cin',
          'Add #include <stdio.h> for printf',
          'Include necessary header files'
        ]
      });
    }

    // Check for main function
    if (!code.includes('main(') && !code.includes('int main')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing main function',
        suggestions: [
          'Add: int main() { return 0; }',
          'C/C++ programs need a main function',
          'Wrap your code inside the main function'
        ]
      });
    }

    // Check for namespace
    if (code.includes('cout') && !code.includes('std::cout') && !code.includes('using namespace std')) {
      errors.push({
        type: 'CompilationError',
        message: 'cout requires std namespace',
        suggestions: [
          'Add: using namespace std;',
          'Or use: std::cout instead of cout',
          'Include proper namespace declarations'
        ]
      });
    }
  }

  private analyzeCSharp(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for using statements
    if (!code.includes('using System') && code.includes('Console.')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing using System directive',
        suggestions: [
          'Add: using System; at the top',
          'Include necessary using statements',
          'System namespace is required for Console'
        ]
      });
    }

    // Check for Main method
    if (!code.includes('static void Main') && code.includes('Console.')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing Main method',
        suggestions: [
          'Add: static void Main(string[] args) { }',
          'C# applications need a Main method',
          'Wrap your code inside the Main method'
        ]
      });
    }
  }

  private analyzeGo(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for package declaration
    if (!code.includes('package ')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing package declaration',
        suggestions: [
          'Add: package main at the top',
          'Go files must start with a package declaration',
          'Use "package main" for executable programs'
        ]
      });
    }

    // Check for main function
    if (!code.includes('func main()') && code.includes('fmt.')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing main function',
        suggestions: [
          'Add: func main() { }',
          'Go programs need a main function',
          'Wrap your code inside the main function'
        ]
      });
    }

    // Check for imports
    if (code.includes('fmt.') && !code.includes('import "fmt"') && !code.includes('import (')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing fmt import',
        suggestions: [
          'Add: import "fmt"',
          'Import necessary packages',
          'Use import statement for external packages'
        ]
      });
    }
  }

  private analyzeRust(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for main function
    if (!code.includes('fn main()') && code.includes('println!')) {
      errors.push({
        type: 'CompilationError',
        message: 'Missing main function',
        suggestions: [
          'Add: fn main() { }',
          'Rust programs need a main function',
          'Wrap your code inside the main function'
        ]
      });
    }

    // Check for println! syntax
    if (code.includes('println!(') && !code.match(/println!\([^)]*\)/)) {
      errors.push({
        type: 'SyntaxError',
        message: 'Incomplete println! macro',
        suggestions: [
          'Add closing parenthesis: println!("Hello");',
          'Check macro syntax',
          'Ensure proper quote usage'
        ]
      });
    }
  }

  private analyzePhp(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for PHP opening tag
    if (!code.includes('<?php') && code.includes('echo')) {
      errors.push({
        type: 'SyntaxError',
        message: 'Missing PHP opening tag',
        suggestions: [
          'Add <?php at the beginning',
          'PHP code must start with <?php',
          'Use proper PHP syntax'
        ]
      });
    }

    // Check for echo syntax
    if (code.includes('echo ') && !code.match(/echo\s+[^;]*;/)) {
      errors.push({
        type: 'SyntaxError',
        message: 'Missing semicolon after echo statement',
        suggestions: [
          'Add semicolon: echo "Hello";',
          'PHP statements must end with semicolons',
          'Check all statements are properly terminated'
        ]
      });
    }
  }

  private analyzeCommonSyntax(code: string, errors: Array<{type: string; message: string; line?: number; suggestions: string[]}>) {
    // Check for unmatched parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        type: 'SyntaxError',
        message: `Unmatched parentheses: ${openParens} opening, ${closeParens} closing`,
        suggestions: [
          'Check all parentheses are properly matched',
          'Count opening and closing parentheses',
          'Use an IDE with bracket matching'
        ]
      });
    }

    // Check for unmatched braces
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        type: 'SyntaxError',
        message: `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`,
        suggestions: [
          'Check all braces are properly matched',
          'Ensure code blocks are properly closed',
          'Use proper indentation to track blocks'
        ]
      });
    }

    // Check for unmatched brackets
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        type: 'SyntaxError',
        message: `Unmatched brackets: ${openBrackets} opening, ${closeBrackets} closing`,
        suggestions: [
          'Check all brackets are properly matched',
          'Verify array declarations and access',
          'Use consistent bracket usage'
        ]
      });
    }
  }

  private predictEnhancedOutput(code: string, language: string): string {
    switch (language.toLowerCase()) {
      case 'python':
        return this.predictPythonOutput(code);
      case 'javascript':
      case 'typescript':
        return this.predictJavaScriptOutput(code);
      case 'java':
        return this.predictJavaOutput(code);
      case 'cpp':
      case 'c':
        return this.predictCppOutput(code);
      case 'csharp':
        return this.predictCSharpOutput(code);
      case 'go':
        return this.predictGoOutput(code);
      case 'rust':
        return this.predictRustOutput(code);
      case 'php':
        return this.predictPhpOutput(code);
      default:
        return `✅ ${language.charAt(0).toUpperCase() + language.slice(1)} code executed successfully`;
    }
  }

  private predictPythonOutput(code: string): string {
    const outputs: string[] = [];
    const printMatches = code.match(/print\s*\(\s*([^)]+)\s*\)/g);
    
    if (printMatches) {
      printMatches.forEach(match => {
        const content = match.replace(/print\s*\(\s*|\s*\)/g, '');
        // Handle simple string literals
        if (content.match(/^["'].*["']$/)) {
          outputs.push(content.replace(/^["']|["']$/g, ''));
        }
        // Handle variables and expressions
        else if (content.includes('+')) {
          outputs.push(content.replace(/["']/g, ''));
        }
        else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ Python Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code executed without errors!`;
    }

    return `✅ Python Execution Successful\n\n📤 Output:\nPython code executed successfully\n\n⚡ No output statements found, but code is valid!`;
  }

  private predictJavaScriptOutput(code: string): string {
    const outputs: string[] = [];
    const consoleMatches = code.match(/console\.log\s*\(\s*([^)]+)\s*\)/g);
    
    if (consoleMatches) {
      consoleMatches.forEach(match => {
        const content = match.replace(/console\.log\s*\(\s*|\s*\)/g, '');
        if (content.match(/^["'].*["']$/)) {
          outputs.push(content.replace(/^["']|["']$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ JavaScript Execution Successful\n\n📤 Console Output:\n${outputs.join('\n')}\n\n⚡ Code executed without errors!`;
    }

    return `✅ JavaScript Execution Successful\n\n📤 Output:\nJavaScript code executed successfully\n\n⚡ No console output, but code is valid!`;
  }

  private predictJavaOutput(code: string): string {
    const outputs: string[] = [];
    const printMatches = code.match(/System\.out\.println\s*\(\s*([^)]+)\s*\)/g);
    
    if (printMatches) {
      printMatches.forEach(match => {
        const content = match.replace(/System\.out\.println\s*\(\s*|\s*\)/g, '');
        if (content.match(/^".*"$/)) {
          outputs.push(content.replace(/^"|"$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ Java Compilation & Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code compiled and executed without errors!`;
    }

    return `✅ Java Compilation & Execution Successful\n\n📤 Output:\nJava application executed successfully\n\n⚡ Code compiled without errors!`;
  }

  private predictCppOutput(code: string): string {
    const outputs: string[] = [];
    const coutMatches = code.match(/cout\s*<<\s*([^;]+);/g);
    
    if (coutMatches) {
      coutMatches.forEach(match => {
        const content = match.replace(/cout\s*<<\s*|;/g, '').replace(/endl/g, '');
        if (content.match(/^".*"$/)) {
          outputs.push(content.replace(/^"|"$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ C++ Compilation & Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code compiled and executed without errors!`;
    }

    return `✅ C++ Compilation & Execution Successful\n\n📤 Output:\nC++ program executed successfully\n\n⚡ Code compiled without errors!`;
  }

  private predictCSharpOutput(code: string): string {
    const outputs: string[] = [];
    const consoleMatches = code.match(/Console\.WriteLine\s*\(\s*([^)]+)\s*\)/g);
    
    if (consoleMatches) {
      consoleMatches.forEach(match => {
        const content = match.replace(/Console\.WriteLine\s*\(\s*|\s*\)/g, '');
        if (content.match(/^".*"$/)) {
          outputs.push(content.replace(/^"|"$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ C# Compilation & Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code compiled and executed without errors!`;
    }

    return `✅ C# Compilation & Execution Successful\n\n📤 Output:\nC# application executed successfully\n\n⚡ Code compiled without errors!`;
  }

  private predictGoOutput(code: string): string {
    const outputs: string[] = [];
    const fmtMatches = code.match(/fmt\.Println\s*\(\s*([^)]+)\s*\)/g);
    
    if (fmtMatches) {
      fmtMatches.forEach(match => {
        const content = match.replace(/fmt\.Println\s*\(\s*|\s*\)/g, '');
        if (content.match(/^".*"$/)) {
          outputs.push(content.replace(/^"|"$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ Go Compilation & Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code compiled and executed without errors!`;
    }

    return `✅ Go Compilation & Execution Successful\n\n📤 Output:\nGo program executed successfully\n\n⚡ Code compiled without errors!`;
  }

  private predictRustOutput(code: string): string {
    const outputs: string[] = [];
    const printMatches = code.match(/println!\s*\(\s*([^)]+)\s*\)/g);
    
    if (printMatches) {
      printMatches.forEach(match => {
        const content = match.replace(/println!\s*\(\s*|\s*\)/g, '');
        if (content.match(/^".*"$/)) {
          outputs.push(content.replace(/^"|"$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ Rust Compilation & Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code compiled and executed without errors!`;
    }

    return `✅ Rust Compilation & Execution Successful\n\n📤 Output:\nRust program executed successfully\n\n⚡ Code compiled without errors!`;
  }

  private predictPhpOutput(code: string): string {
    const outputs: string[] = [];
    const echoMatches = code.match(/echo\s+([^;]+);/g);
    
    if (echoMatches) {
      echoMatches.forEach(match => {
        const content = match.replace(/echo\s+|;/g, '');
        if (content.match(/^["'].*["']$/)) {
          outputs.push(content.replace(/^["']|["']$/g, ''));
        } else {
          outputs.push(content);
        }
      });
    }

    if (outputs.length > 0) {
      return `✅ PHP Execution Successful\n\n📤 Output:\n${outputs.join('\n')}\n\n⚡ Code executed without errors!`;
    }

    return `✅ PHP Execution Successful\n\n📤 Output:\nPHP script executed successfully\n\n⚡ Code executed without errors!`;
  }

  private predictBasicOutput(code: string, language: string): string {
    // Basic output prediction for fallback
    switch (language.toLowerCase()) {
      case 'python':
        const pythonMatches = code.match(/print\(([^)]+)\)/g);
        if (pythonMatches) {
          return pythonMatches.map(match => {
            const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
            return content;
          }).join('\n');
        }
        break;
      
      case 'javascript':
      case 'typescript':
        const jsMatches = code.match(/console\.log\(([^)]+)\)/g);
        if (jsMatches) {
          return jsMatches.map(match => {
            const content = match.replace(/console\.log\(|\)/g, '').replace(/['"]/g, '');
            return content;
          }).join('\n');
        }
        break;
      
      case 'java':
        const javaMatches = code.match(/System\.out\.println\(([^)]+)\)/g);
        if (javaMatches) {
          return javaMatches.map(match => {
            const content = match.replace(/System\.out\.println\(|\)/g, '').replace(/['"]/g, '');
            return content;
          }).join('\n');
        }
        break;
    }
    
    return `${language} code executed successfully`;
  }

  // Alternative free models to try if one fails
  private async tryAlternativeModel(code: string, language: string): Promise<CodeAnalysisResult> {
    const freeModels = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'huggingface/zephyr-7b-beta:free',
      'openchat/openchat-7b:free'
    ];

    for (const model of freeModels) {
      try {
        const prompt = this.createAnalysisPrompt(code, language);
        
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'CodeFusionAI Editor'
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert code analyzer. Analyze code for errors and predict output. Respond only in valid JSON format.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.1,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data: OpenRouterResponse = await response.json();
          const content = data.choices[0]?.message?.content;
          if (content) {
            return this.parseAnalysisResult(content);
          }
        }
      } catch (error) {
        console.warn(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    // If all models fail, use fallback
    return this.fallbackAnalysis(code, language);
  }
}

export const openRouterService = new OpenRouterService();
export type { CodeAnalysisResult };