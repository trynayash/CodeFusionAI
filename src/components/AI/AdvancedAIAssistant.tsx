/**
 * Advanced AI Assistant Component
 * Comprehensive AI-powered development assistant with multiple services
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Code, 
  Bug, 
  Zap, 
  BookOpen, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Share,
  Star,
  MessageSquare,
  FileText,
  BarChart3,
  Target,
  Shield,
  Rocket,
  Wrench,
  Eye,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { aiCodeExplainerService, type CodeExplanationRequest } from '@/services/aiCodeExplainer';
import { smartRefactoringService, type RefactoringRequest } from '@/services/smartRefactoring';
import { performanceAnalyzerService, type PerformanceAnalysisRequest } from '@/services/performanceAnalyzer';
import { intelligentDebuggerService, type DebuggingRequest } from '@/services/intelligentDebugger';
import { useAuth } from '@/hooks/useAuth';
import { log } from '@/utils/logger';

interface AdvancedAIAssistantProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  className?: string;
}

export function AdvancedAIAssistant({
  code,
  language,
  onCodeChange,
  className = ''
}: AdvancedAIAssistantProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('explain');
  const [isLoading, setIsLoading] = useState(false);
  const [explanations, setExplanations] = useState<any[]>([]);
  const [refactoringSuggestions, setRefactoringSuggestions] = useState<any[]>([]);
  const [performanceIssues, setPerformanceIssues] = useState<any[]>([]);
  const [debugSession, setDebugSession] = useState<any>(null);
  const [currentDebugStep, setCurrentDebugStep] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load AI assistance based on active tab
  useEffect(() => {
    if (code && language && user) {
      loadAIAssistance();
    }
  }, [code, language, activeTab, user]);

  const loadAIAssistance = useCallback(async () => {
    if (!code.trim() || !language) return;

    try {
      setIsLoading(true);
      setError(null);

      switch (activeTab) {
        case 'explain':
          await loadCodeExplanations();
          break;
        case 'refactor':
          await loadRefactoringSuggestions();
          break;
        case 'performance':
          await loadPerformanceAnalysis();
          break;
        case 'debug':
          await startDebuggingSession();
          break;
      }
    } catch (error) {
      log.error('Failed to load AI assistance', error as Error, 'ADVANCED_AI_ASSISTANT');
      setError('Failed to load AI assistance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, language, activeTab, user]);

  const loadCodeExplanations = async () => {
    try {
      const request: CodeExplanationRequest = {
        code,
        language,
        explanationType: 'detailed',
        context: {
          complexity: 'medium'
        }
      };

      const response = await aiCodeExplainerService.explainCode(request);
      setExplanations(response.explanations);
    } catch (error) {
      log.error('Failed to load code explanations', error as Error, 'ADVANCED_AI_ASSISTANT');
    }
  };

  const loadRefactoringSuggestions = async () => {
    try {
      const request: RefactoringRequest = {
        code,
        language,
        refactoringType: 'readability',
        preferences: {
          maxLineLength: 100,
          preferArrowFunctions: true,
          preferConst: true,
          useTypeHints: true
        }
      };

      const response = await smartRefactoringService.analyzeCode(request);
      setRefactoringSuggestions(response.suggestions);
    } catch (error) {
      log.error('Failed to load refactoring suggestions', error as Error, 'ADVANCED_AI_ASSISTANT');
    }
  };

  const loadPerformanceAnalysis = async () => {
    try {
      const request: PerformanceAnalysisRequest = {
        code,
        language,
        context: {
          expectedUsage: 'medium',
          platform: 'web'
        }
      };

      const response = await performanceAnalyzerService.analyzePerformance(request);
      setPerformanceIssues(response.issues);
    } catch (error) {
      log.error('Failed to load performance analysis', error as Error, 'ADVANCED_AI_ASSISTANT');
    }
  };

  const startDebuggingSession = async () => {
    try {
      const request: DebuggingRequest = {
        code,
        language,
        debuggingMode: 'logic-debug',
        context: {
          environment: 'development'
        }
      };

      const response = await intelligentDebuggerService.startDebugging(request);
      setDebugSession(response.session);
      if (response.debuggingPlan.steps.length > 0) {
        setCurrentDebugStep(response.debuggingPlan.steps[0]);
      }
    } catch (error) {
      log.error('Failed to start debugging session', error as Error, 'ADVANCED_AI_ASSISTANT');
    }
  };

  const executeDebugStep = async (stepId: string) => {
    if (!debugSession) return;

    try {
      const step = await intelligentDebuggerService.executeStep(debugSession.id, stepId, true);
      if (step) {
        setCurrentDebugStep(step);
      }
    } catch (error) {
      log.error('Failed to execute debug step', error as Error, 'ADVANCED_AI_ASSISTANT');
    }
  };

  const applyRefactoring = (suggestion: any) => {
    if (suggestion.refactoredCode) {
      onCodeChange(suggestion.refactoredCode);
    }
  };

  if (!user) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in for Advanced AI Assistant</h3>
          <p className="text-muted-foreground">
            Get AI-powered code explanations, refactoring suggestions, performance analysis, and debugging assistance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explain" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Explain
          </TabsTrigger>
          <TabsTrigger value="refactor" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Refactor
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Debug
          </TabsTrigger>
        </TabsList>

        {/* Code Explanation Tab */}
        <TabsContent value="explain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Code Explanation
                {isLoading && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                  <p className="text-destructive">{error}</p>
                </div>
              ) : explanations.length > 0 ? (
                <div className="space-y-4">
                  {explanations.map((explanation, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{explanation.title}</h4>
                        <Badge variant={explanation.complexity === 'simple' ? 'default' : explanation.complexity === 'medium' ? 'secondary' : 'destructive'}>
                          {explanation.complexity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{explanation.summary}</p>
                      
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{explanation.explanation}</pre>
                      </div>

                      {explanation.keyConcepts.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Key Concepts:</h5>
                          <div className="flex flex-wrap gap-2">
                            {explanation.keyConcepts.map((concept: string, i: number) => (
                              <Badge key={i} variant="outline">{concept}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {explanation.suggestions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Suggestions:</h5>
                          <ul className="text-sm space-y-1">
                            {explanation.suggestions.map((suggestion: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isLoading ? 'Analyzing code...' : 'No code explanation available. Write some code to get AI-powered explanations.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refactoring Tab */}
        <TabsContent value="refactor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Refactoring Suggestions
                {isLoading && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {refactoringSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {refactoringSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'secondary' : 'outline'}>
                            {suggestion.priority}
                          </Badge>
                          <Badge variant="outline">{suggestion.type}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2">Benefits:</h5>
                          <ul className="text-sm space-y-1">
                            {suggestion.benefits.map((benefit: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {suggestion.risks.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Risks:</h5>
                            <ul className="text-sm space-y-1">
                              {suggestion.risks.map((risk: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {suggestion.estimatedTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {suggestion.difficulty}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => applyRefactoring(suggestion)}
                            disabled={!suggestion.refactoredCode}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isLoading ? 'Analyzing code for refactoring opportunities...' : 'No refactoring suggestions available. Write some code to get AI-powered refactoring suggestions.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Analysis
                {isLoading && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceIssues.length > 0 ? (
                <div className="space-y-4">
                  {performanceIssues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{issue.title}</h4>
                        <Badge variant={issue.severity === 'critical' ? 'destructive' : issue.severity === 'high' ? 'secondary' : 'outline'}>
                          {issue.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Current Complexity:</span>
                            <Badge variant="outline" className="ml-2">{issue.currentComplexity}</Badge>
                          </div>
                          <div>
                            <span className="font-medium">Suggested Complexity:</span>
                            <Badge variant="default" className="ml-2">{issue.suggestedComplexity}</Badge>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Performance Gain
                          </h5>
                          <p className="text-sm">{issue.performanceGain}</p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Solution:</h5>
                          <p className="text-sm">{issue.solution}</p>
                        </div>

                        {issue.codeExample && (
                          <div>
                            <h5 className="font-medium mb-2">Code Example:</h5>
                            <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto">
                              {issue.codeExample}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isLoading ? 'Analyzing performance...' : 'No performance issues detected. Your code looks efficient!'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Intelligent Debugger
                {isLoading && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debugSession ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Debug Session Active</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Session ID: {debugSession.id}</span>
                      <span>Status: {debugSession.status}</span>
                      <span>Step: {debugSession.currentStep + 1} of {debugSession.steps.length}</span>
                    </div>
                  </div>

                  {currentDebugStep && (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">Step {currentDebugStep.stepNumber}: {currentDebugStep.title}</h4>
                        <Badge variant={currentDebugStep.status === 'completed' ? 'default' : currentDebugStep.status === 'failed' ? 'destructive' : 'outline'}>
                          {currentDebugStep.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{currentDebugStep.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2">Action:</h5>
                          <Badge variant="outline">{currentDebugStep.action}</Badge>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Expected Result:</h5>
                          <p className="text-sm">{currentDebugStep.expectedResult}</p>
                        </div>

                        {currentDebugStep.actualResult && (
                          <div>
                            <h5 className="font-medium mb-2">Actual Result:</h5>
                            <p className="text-sm">{currentDebugStep.actualResult}</p>
                          </div>
                        )}

                        {currentDebugStep.hints.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Hints:</h5>
                            <ul className="text-sm space-y-1">
                              {currentDebugStep.hints.map((hint: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t">
                          <Button 
                            size="sm" 
                            onClick={() => executeDebugStep(currentDebugStep.id)}
                            disabled={currentDebugStep.status === 'completed'}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Skip
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {isLoading ? 'Starting debugging session...' : 'Start an intelligent debugging session to get step-by-step guidance.'}
                  </p>
                  <Button onClick={startDebuggingSession} disabled={isLoading}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Debug Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdvancedAIAssistant;
