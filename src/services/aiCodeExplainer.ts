/**
 * AI Code Explainer Service
 * Advanced code explanation and documentation generation
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface CodeExplanationRequest {
  code: string;
  language: string;
  context?: {
    functionName?: string;
    className?: string;
    purpose?: string;
    complexity?: 'simple' | 'medium' | 'complex';
  };
  explanationType: 'overview' | 'detailed' | 'line-by-line' | 'documentation';
}

export interface CodeExplanation {
  id: string;
  type: 'overview' | 'detailed' | 'line-by-line' | 'documentation';
  title: string;
  summary: string;
  explanation: string;
  complexity: 'simple' | 'medium' | 'complex';
  timeToUnderstand: number; // in minutes
  keyConcepts: string[];
  relatedTopics: string[];
  bestPractices: string[];
  potentialIssues: string[];
  suggestions: string[];
  documentation?: {
    functionDoc?: string;
    classDoc?: string;
    inlineComments?: Array<{ line: number; comment: string }>;
  };
}

export interface ExplanationResponse {
  explanations: CodeExplanation[];
  overallComplexity: 'simple' | 'medium' | 'complex';
  learningPath: string[];
  estimatedTime: number;
  confidence: number;
  processingTime: number;
}

class AICodeExplainerService {
  private cache = new Map<string, ExplanationResponse>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes

  constructor() {
    log.info('AI Code Explainer Service initialized', {}, 'CODE_EXPLAINER');
  }

  /**
   * Explain code using AI analysis
   */
  async explainCode(request: CodeExplanationRequest): Promise<ExplanationResponse> {
    const startTime = performance.now();
    const requestId = generateId('code-explanation');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('code-explainer-service', 30, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Explaining code with AI', { 
        requestId, 
        language: request.language,
        explanationType: request.explanationType,
        codeLength: request.code.length 
      }, 'CODE_EXPLAINER');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached code explanation', { requestId }, 'CODE_EXPLAINER');
        return cached;
      }

      // Generate explanations
      const explanations = await this.generateExplanations(request);
      const overallComplexity = this.analyzeComplexity(request.code, request.language);
      const learningPath = this.generateLearningPath(request.language, explanations);
      const estimatedTime = this.calculateEstimatedTime(explanations);

      const processingTime = performance.now() - startTime;

      const response: ExplanationResponse = {
        explanations,
        overallComplexity,
        learningPath,
        estimatedTime,
        confidence: 0.95,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Code explanation generated', { 
        requestId, 
        explanationsCount: explanations.length,
        complexity: overallComplexity,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Code explanation failed', error as Error, 'CODE_EXPLAINER');
      
      // Return fallback explanation
      return this.getFallbackExplanation(request, processingTime);
    }
  }

  /**
   * Generate comprehensive explanations
   */
  private async generateExplanations(request: CodeExplanationRequest): Promise<CodeExplanation[]> {
    const { code, language, explanationType, context } = request;
    const explanations: CodeExplanation[] = [];

    // Generate different types of explanations based on request
    if (explanationType === 'overview' || explanationType === 'detailed') {
      explanations.push(await this.generateOverviewExplanation(code, language, context));
    }

    if (explanationType === 'detailed' || explanationType === 'line-by-line') {
      explanations.push(await this.generateDetailedExplanation(code, language, context));
    }

    if (explanationType === 'line-by-line') {
      explanations.push(await this.generateLineByLineExplanation(code, language, context));
    }

    if (explanationType === 'documentation') {
      explanations.push(await this.generateDocumentationExplanation(code, language, context));
    }

    return explanations;
  }

  /**
   * Generate overview explanation
   */
  private async generateOverviewExplanation(code: string, language: string, context?: any): Promise<CodeExplanation> {
    const analysis = this.analyzeCodeStructure(code, language);
    
    return {
      id: generateId('explanation'),
      type: 'overview',
      title: 'Code Overview',
      summary: this.generateSummary(code, language, analysis),
      explanation: this.generateOverviewText(code, language, analysis),
      complexity: analysis.complexity,
      timeToUnderstand: this.calculateUnderstandingTime(analysis.complexity),
      keyConcepts: analysis.keyConcepts,
      relatedTopics: this.getRelatedTopics(language, analysis),
      bestPractices: this.getBestPractices(language, analysis),
      potentialIssues: this.identifyPotentialIssues(code, language),
      suggestions: this.generateSuggestions(code, language, analysis),
    };
  }

  /**
   * Generate detailed explanation
   */
  private async generateDetailedExplanation(code: string, language: string, context?: any): Promise<CodeExplanation> {
    const analysis = this.analyzeCodeStructure(code, language);
    
    return {
      id: generateId('explanation'),
      type: 'detailed',
      title: 'Detailed Analysis',
      summary: 'In-depth analysis of code structure, algorithms, and implementation details',
      explanation: this.generateDetailedText(code, language, analysis),
      complexity: analysis.complexity,
      timeToUnderstand: this.calculateUnderstandingTime(analysis.complexity) * 1.5,
      keyConcepts: analysis.keyConcepts,
      relatedTopics: this.getRelatedTopics(language, analysis),
      bestPractices: this.getBestPractices(language, analysis),
      potentialIssues: this.identifyPotentialIssues(code, language),
      suggestions: this.generateSuggestions(code, language, analysis),
    };
  }

  /**
   * Generate line-by-line explanation
   */
  private async generateLineByLineExplanation(code: string, language: string, context?: any): Promise<CodeExplanation> {
    const lines = code.split('\n');
    const lineExplanations: Array<{ line: number; explanation: string }> = [];

    lines.forEach((line, index) => {
      if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
        lineExplanations.push({
          line: index + 1,
          explanation: this.explainLine(line, language, index, lines)
        });
      }
    });

    return {
      id: generateId('explanation'),
      type: 'line-by-line',
      title: 'Line-by-Line Breakdown',
      summary: `Step-by-step explanation of ${lineExplanations.length} code lines`,
      explanation: lineExplanations.map(le => `Line ${le.line}: ${le.explanation}`).join('\n\n'),
      complexity: this.analyzeComplexity(code, language),
      timeToUnderstand: lineExplanations.length * 0.5, // 30 seconds per line
      keyConcepts: this.extractKeyConceptsFromLines(lineExplanations),
      relatedTopics: this.getRelatedTopics(language, { keyConcepts: this.extractKeyConceptsFromLines(lineExplanations) }),
      bestPractices: this.getBestPractices(language, { keyConcepts: this.extractKeyConceptsFromLines(lineExplanations) }),
      potentialIssues: this.identifyPotentialIssues(code, language),
      suggestions: this.generateSuggestions(code, language, { keyConcepts: this.extractKeyConceptsFromLines(lineExplanations) }),
    };
  }

  /**
   * Generate documentation explanation
   */
  private async generateDocumentationExplanation(code: string, language: string, context?: any): Promise<CodeExplanation> {
    const analysis = this.analyzeCodeStructure(code, language);
    
    return {
      id: generateId('explanation'),
      type: 'documentation',
      title: 'Documentation Generation',
      summary: 'Auto-generated documentation and comments for the code',
      explanation: 'Generated comprehensive documentation including function descriptions, parameter details, and usage examples',
      complexity: analysis.complexity,
      timeToUnderstand: this.calculateUnderstandingTime(analysis.complexity),
      keyConcepts: analysis.keyConcepts,
      relatedTopics: this.getRelatedTopics(language, analysis),
      bestPractices: this.getBestPractices(language, analysis),
      potentialIssues: this.identifyPotentialIssues(code, language),
      suggestions: this.generateSuggestions(code, language, analysis),
      documentation: this.generateDocumentation(code, language, analysis),
    };
  }

  /**
   * Analyze code structure
   */
  private analyzeCodeStructure(code: string, language: string): any {
    const lines = code.split('\n');
    const functions = this.extractFunctions(code, language);
    const classes = this.extractClasses(code, language);
    const imports = this.extractImports(code, language);
    const variables = this.extractVariables(code, language);
    
    return {
      lines: lines.length,
      functions: functions.length,
      classes: classes.length,
      imports: imports.length,
      variables: variables.length,
      complexity: this.analyzeComplexity(code, language),
      keyConcepts: this.extractKeyConcepts(code, language),
      hasLoops: this.hasLoops(code),
      hasConditionals: this.hasConditionals(code),
      hasRecursion: this.hasRecursion(code),
      functions,
      classes,
      imports,
      variables,
    };
  }

  /**
   * Generate summary
   */
  private generateSummary(code: string, language: string, analysis: any): string {
    const { functions, classes, lines, complexity } = analysis;
    
    if (functions.length > 0 && classes.length > 0) {
      return `This ${language} code contains ${functions.length} functions and ${classes.length} classes across ${lines} lines. It demonstrates ${complexity} programming concepts.`;
    } else if (functions.length > 0) {
      return `This ${language} code defines ${functions.length} functions across ${lines} lines, showcasing ${complexity} programming techniques.`;
    } else if (classes.length > 0) {
      return `This ${language} code implements ${classes.length} classes across ${lines} lines, demonstrating object-oriented programming concepts.`;
    } else {
      return `This ${language} code spans ${lines} lines and demonstrates ${complexity} programming concepts.`;
    }
  }

  /**
   * Generate overview text
   */
  private generateOverviewText(code: string, language: string, analysis: any): string {
    let explanation = `This ${language} code demonstrates several key programming concepts:\n\n`;
    
    if (analysis.functions.length > 0) {
      explanation += `**Functions:** The code defines ${analysis.functions.length} function(s): ${analysis.functions.map(f => f.name).join(', ')}.\n\n`;
    }
    
    if (analysis.classes.length > 0) {
      explanation += `**Classes:** The code implements ${analysis.classes.length} class(es): ${analysis.classes.map(c => c.name).join(', ')}.\n\n`;
    }
    
    if (analysis.hasLoops) {
      explanation += `**Control Flow:** The code uses loops to iterate through data structures.\n\n`;
    }
    
    if (analysis.hasConditionals) {
      explanation += `**Conditional Logic:** The code implements decision-making through if/else statements.\n\n`;
    }
    
    explanation += `**Complexity Level:** ${analysis.complexity}\n`;
    explanation += `**Estimated Understanding Time:** ${this.calculateUnderstandingTime(analysis.complexity)} minutes`;
    
    return explanation;
  }

  /**
   * Generate detailed text
   */
  private generateDetailedText(code: string, language: string, analysis: any): string {
    let explanation = `## Detailed Code Analysis\n\n`;
    
    // Function analysis
    if (analysis.functions.length > 0) {
      explanation += `### Functions\n\n`;
      analysis.functions.forEach((func: any) => {
        explanation += `**${func.name}()**\n`;
        explanation += `- Purpose: ${func.purpose || 'Function implementation'}\n`;
        explanation += `- Parameters: ${func.parameters.length > 0 ? func.parameters.join(', ') : 'None'}\n`;
        explanation += `- Complexity: ${func.complexity || 'Medium'}\n\n`;
      });
    }
    
    // Class analysis
    if (analysis.classes.length > 0) {
      explanation += `### Classes\n\n`;
      analysis.classes.forEach((cls: any) => {
        explanation += `**${cls.name}**\n`;
        explanation += `- Methods: ${cls.methods.length}\n`;
        explanation += `- Properties: ${cls.properties.length}\n`;
        explanation += `- Inheritance: ${cls.inherits || 'None'}\n\n`;
      });
    }
    
    // Algorithm analysis
    if (analysis.hasLoops) {
      explanation += `### Algorithm Analysis\n\n`;
      explanation += `The code implements iterative algorithms using loops. This approach is efficient for processing collections of data.\n\n`;
    }
    
    if (analysis.hasRecursion) {
      explanation += `The code uses recursion, which is powerful but requires careful consideration of base cases and stack overflow prevention.\n\n`;
    }
    
    return explanation;
  }

  /**
   * Explain individual line
   */
  private explainLine(line: string, language: string, index: number, allLines: string[]): string {
    const trimmedLine = line.trim();
    
    // Variable declarations
    if (trimmedLine.includes('=') && !trimmedLine.includes('==') && !trimmedLine.includes('!=')) {
      const [variable, value] = trimmedLine.split('=');
      return `Declares variable '${variable.trim()}' and assigns it the value: ${value.trim()}`;
    }
    
    // Function calls
    if (trimmedLine.includes('(') && trimmedLine.includes(')')) {
      const functionName = trimmedLine.split('(')[0];
      return `Calls the function '${functionName.trim()}' with the specified parameters`;
    }
    
    // Control structures
    if (trimmedLine.startsWith('if ') || trimmedLine.startsWith('if(')) {
      return 'Implements conditional logic - executes the following block only if the condition is true';
    }
    
    if (trimmedLine.startsWith('for ') || trimmedLine.startsWith('while ')) {
      return 'Implements a loop - repeats the following block while the condition is met';
    }
    
    if (trimmedLine.startsWith('return ')) {
      return 'Returns a value from the current function and exits the function execution';
    }
    
    // Default explanation
    return 'Executes the specified operation or statement';
  }

  /**
   * Generate documentation
   */
  private generateDocumentation(code: string, language: string, analysis: any): any {
    const documentation: any = {
      inlineComments: []
    };
    
    // Generate function documentation
    if (analysis.functions.length > 0) {
      documentation.functionDoc = analysis.functions.map((func: any) => {
        return `/**
 * ${func.purpose || 'Function description'}
 * @param {${func.parameters.map((p: string) => `${p}: any`).join(', ')}} parameters
 * @returns {any} Return value description
 */`;
      }).join('\n\n');
    }
    
    // Generate class documentation
    if (analysis.classes.length > 0) {
      documentation.classDoc = analysis.classes.map((cls: any) => {
        return `/**
 * ${cls.name} class
 * ${cls.description || 'Class description'}
 * @class ${cls.name}
 */`;
      }).join('\n\n');
    }
    
    // Generate inline comments
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
        const explanation = this.explainLine(line, language, index, lines);
        if (explanation.length > 50) { // Only add comments for complex lines
          documentation.inlineComments.push({
            line: index + 1,
            comment: `// ${explanation}`
          });
        }
      }
    });
    
    return documentation;
  }

  /**
   * Analyze code complexity
   */
  private analyzeComplexity(code: string, language: string): 'simple' | 'medium' | 'complex' {
    const lines = code.split('\n').length;
    const functions = this.extractFunctions(code, language).length;
    const classes = this.extractClasses(code, language).length;
    const hasLoops = this.hasLoops(code);
    const hasConditionals = this.hasConditionals(code);
    const hasRecursion = this.hasRecursion(code);
    
    let complexityScore = 0;
    
    if (lines > 50) complexityScore += 2;
    else if (lines > 20) complexityScore += 1;
    
    if (functions > 5) complexityScore += 2;
    else if (functions > 2) complexityScore += 1;
    
    if (classes > 3) complexityScore += 2;
    else if (classes > 1) complexityScore += 1;
    
    if (hasLoops) complexityScore += 1;
    if (hasConditionals) complexityScore += 1;
    if (hasRecursion) complexityScore += 2;
    
    if (complexityScore >= 6) return 'complex';
    if (complexityScore >= 3) return 'medium';
    return 'simple';
  }

  /**
   * Calculate understanding time
   */
  private calculateUnderstandingTime(complexity: 'simple' | 'medium' | 'complex'): number {
    switch (complexity) {
      case 'simple': return 2;
      case 'medium': return 5;
      case 'complex': return 10;
      default: return 3;
    }
  }

  /**
   * Generate learning path
   */
  private generateLearningPath(language: string, explanations: CodeExplanation[]): string[] {
    const concepts = explanations.flatMap(e => e.keyConcepts);
    const uniqueConcepts = [...new Set(concepts)];
    
    const learningPath = [
      `Learn ${language} basics`,
      ...uniqueConcepts.slice(0, 3).map(concept => `Understand ${concept}`),
      'Practice with similar examples',
      'Apply concepts in your own projects'
    ];
    
    return learningPath;
  }

  /**
   * Calculate estimated time
   */
  private calculateEstimatedTime(explanations: CodeExplanation[]): number {
    return explanations.reduce((total, explanation) => total + explanation.timeToUnderstand, 0);
  }

  /**
   * Extract functions from code
   */
  private extractFunctions(code: string, language: string): any[] {
    const functions: any[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      if (language === 'python' && line.trim().startsWith('def ')) {
        const funcName = line.trim().split('(')[0].replace('def ', '');
        const params = line.includes('(') ? line.split('(')[1].split(')')[0].split(',').map(p => p.trim()).filter(p => p) : [];
        functions.push({ name: funcName, parameters: params, line: index + 1 });
      } else if (language === 'javascript' && line.trim().startsWith('function ')) {
        const funcName = line.trim().split('(')[0].replace('function ', '');
        const params = line.includes('(') ? line.split('(')[1].split(')')[0].split(',').map(p => p.trim()).filter(p => p) : [];
        functions.push({ name: funcName, parameters: params, line: index + 1 });
      }
    });
    
    return functions;
  }

  /**
   * Extract classes from code
   */
  private extractClasses(code: string, language: string): any[] {
    const classes: any[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      if (language === 'python' && line.trim().startsWith('class ')) {
        const className = line.trim().split('(')[0].replace('class ', '').replace(':', '');
        classes.push({ name: className, line: index + 1, methods: [], properties: [] });
      } else if (language === 'javascript' && line.trim().includes('class ')) {
        const className = line.trim().split(' ')[1];
        classes.push({ name: className, line: index + 1, methods: [], properties: [] });
      }
    });
    
    return classes;
  }

  /**
   * Extract imports from code
   */
  private extractImports(code: string, language: string): string[] {
    const imports: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (language === 'python' && line.trim().startsWith('import ')) {
        imports.push(line.trim());
      } else if (language === 'javascript' && line.trim().startsWith('import ')) {
        imports.push(line.trim());
      }
    });
    
    return imports;
  }

  /**
   * Extract variables from code
   */
  private extractVariables(code: string, language: string): string[] {
    const variables: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
        const variable = line.split('=')[0].trim();
        if (variable && !variable.includes(' ') && !variable.includes('(')) {
          variables.push(variable);
        }
      }
    });
    
    return variables;
  }

  /**
   * Check if code has loops
   */
  private hasLoops(code: string): boolean {
    return /for\s+|while\s+|do\s*\{/.test(code);
  }

  /**
   * Check if code has conditionals
   */
  private hasConditionals(code: string): boolean {
    return /if\s*\(|if\s+/.test(code);
  }

  /**
   * Check if code has recursion
   */
  private hasRecursion(code: string): boolean {
    // Simple recursion detection - looks for function calls within function definitions
    return /def\s+\w+.*:[\s\S]*\w+\s*\(/.test(code);
  }

  /**
   * Extract key concepts
   */
  private extractKeyConcepts(code: string, language: string): string[] {
    const concepts: string[] = [];
    
    if (this.hasLoops(code)) concepts.push('Loops and Iteration');
    if (this.hasConditionals(code)) concepts.push('Conditional Logic');
    if (this.hasRecursion(code)) concepts.push('Recursion');
    if (this.extractFunctions(code, language).length > 0) concepts.push('Functions');
    if (this.extractClasses(code, language).length > 0) concepts.push('Object-Oriented Programming');
    
    // Language-specific concepts
    switch (language) {
      case 'python':
        if (code.includes('import ')) concepts.push('Module Import');
        if (code.includes('[') && code.includes(']')) concepts.push('Lists and Arrays');
        if (code.includes('{') && code.includes('}')) concepts.push('Dictionaries');
        break;
      case 'javascript':
        if (code.includes('const ') || code.includes('let ')) concepts.push('Variable Declarations');
        if (code.includes('=>')) concepts.push('Arrow Functions');
        if (code.includes('async ') || code.includes('await ')) concepts.push('Asynchronous Programming');
        break;
    }
    
    return concepts;
  }

  /**
   * Get related topics
   */
  private getRelatedTopics(language: string, analysis: any): string[] {
    const topics: string[] = [];
    
    if (analysis.keyConcepts.includes('Loops and Iteration')) {
      topics.push('Array Methods', 'Iteration Patterns', 'Performance Optimization');
    }
    
    if (analysis.keyConcepts.includes('Conditional Logic')) {
      topics.push('Boolean Logic', 'Control Flow', 'Error Handling');
    }
    
    if (analysis.keyConcepts.includes('Functions')) {
      topics.push('Function Composition', 'Higher-Order Functions', 'Scope and Closures');
    }
    
    if (analysis.keyConcepts.includes('Object-Oriented Programming')) {
      topics.push('Inheritance', 'Polymorphism', 'Encapsulation');
    }
    
    return topics.slice(0, 5); // Limit to 5 topics
  }

  /**
   * Get best practices
   */
  private getBestPractices(language: string, analysis: any): string[] {
    const practices: string[] = [];
    
    practices.push('Write clear and descriptive variable names');
    practices.push('Add comments for complex logic');
    practices.push('Follow consistent code formatting');
    
    if (language === 'python') {
      practices.push('Follow PEP 8 style guidelines');
      practices.push('Use type hints for better code documentation');
    }
    
    if (language === 'javascript') {
      practices.push('Use const and let instead of var');
      practices.push('Prefer arrow functions for simple operations');
    }
    
    if (analysis.keyConcepts.includes('Functions')) {
      practices.push('Keep functions small and focused on a single responsibility');
    }
    
    return practices;
  }

  /**
   * Identify potential issues
   */
  private identifyPotentialIssues(code: string, language: string): string[] {
    const issues: string[] = [];
    
    if (code.length > 1000) {
      issues.push('Code is quite long - consider breaking it into smaller functions');
    }
    
    if (!code.includes('//') && !code.includes('#')) {
      issues.push('Consider adding comments to explain complex logic');
    }
    
    if (language === 'python' && code.includes('print(') && !code.includes('if __name__')) {
      issues.push('Consider using if __name__ == "__main__" for script execution');
    }
    
    return issues;
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(code: string, language: string, analysis: any): string[] {
    const suggestions: string[] = [];
    
    if (analysis.complexity === 'complex') {
      suggestions.push('Consider refactoring into smaller, more manageable functions');
    }
    
    if (analysis.keyConcepts.includes('Loops and Iteration')) {
      suggestions.push('Explore array methods like map, filter, and reduce for more functional approaches');
    }
    
    if (language === 'python' && analysis.functions.length > 0) {
      suggestions.push('Add type hints to function parameters and return values');
    }
    
    suggestions.push('Write unit tests to verify your code works correctly');
    suggestions.push('Consider edge cases and error handling');
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  /**
   * Extract key concepts from line explanations
   */
  private extractKeyConceptsFromLines(lineExplanations: Array<{ line: number; explanation: string }>): string[] {
    const concepts: string[] = [];
    
    lineExplanations.forEach(le => {
      if (le.explanation.includes('function')) concepts.push('Functions');
      if (le.explanation.includes('variable')) concepts.push('Variables');
      if (le.explanation.includes('conditional')) concepts.push('Conditional Logic');
      if (le.explanation.includes('loop')) concepts.push('Loops and Iteration');
      if (le.explanation.includes('return')) concepts.push('Return Statements');
    });
    
    return [...new Set(concepts)];
  }

  /**
   * Get fallback explanation
   */
  private getFallbackExplanation(request: CodeExplanationRequest, processingTime: number): ExplanationResponse {
    return {
      explanations: [{
        id: generateId('explanation'),
        type: request.explanationType,
        title: 'Code Explanation',
        summary: 'Basic code analysis and explanation',
        explanation: 'This code demonstrates programming concepts and implementation techniques.',
        complexity: 'medium',
        timeToUnderstand: 5,
        keyConcepts: ['Programming', 'Code Structure'],
        relatedTopics: ['Programming Basics', 'Code Analysis'],
        bestPractices: ['Write clear code', 'Add comments'],
        potentialIssues: [],
        suggestions: ['Review the code structure', 'Add documentation'],
      }],
      overallComplexity: 'medium',
      learningPath: ['Learn programming basics', 'Practice coding'],
      estimatedTime: 5,
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: CodeExplanationRequest): string {
    const key = `${request.language}-${request.explanationType}-${request.code.slice(-100)}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): ExplanationResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: ExplanationResponse): void {
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
    log.info('AI Code Explainer Service cache cleared', {}, 'CODE_EXPLAINER');
  }
}

// Create singleton instance
export const aiCodeExplainerService = new AICodeExplainerService();
export default aiCodeExplainerService;
