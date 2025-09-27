/**
 * Intelligent Learning Assistant Component
 * Advanced AI-powered learning system with real-time feedback
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  Target, 
  Zap, 
  Lightbulb,
  Code,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  TrendingUp,
  Users,
  Award,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { intelligentCompletionService, type CompletionRequest } from '@/services/intelligentCompletion';
import { realTimeErrorDetectionService, type ErrorDetectionRequest } from '@/services/realTimeErrorDetection';
import { interactiveLearningService, type LearningRequest, type LearningProgress } from '@/services/interactiveLearning';
import { useAuth } from '@/hooks/useAuth';
import { log } from '@/utils/logger';

interface IntelligentLearningAssistantProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onCompletionSelect: (completion: string) => void;
  className?: string;
}

export function IntelligentLearningAssistant({
  code,
  language,
  onCodeChange,
  onCompletionSelect,
  className = ''
}: IntelligentLearningAssistantProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('learning');
  const [isLoading, setIsLoading] = useState(false);
  const [completions, setCompletions] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });

  // Load user's learning progress
  useEffect(() => {
    if (user) {
      loadLearningProgress();
    }
  }, [user]);

  // Real-time code analysis
  useEffect(() => {
    if (code && language) {
      const timeoutId = setTimeout(() => {
        analyzeCode();
      }, 1000); // Debounce analysis

      return () => clearTimeout(timeoutId);
    }
  }, [code, language]);

  const loadLearningProgress = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const learningRequest: LearningRequest = {
        userId: user.id,
        currentLevel: 'beginner', // This could be determined from user profile
        interests: ['programming', 'web development'],
        completedLessons: [], // This would come from user's learning history
        currentLanguage: language,
        learningGoals: ['master programming', 'build projects']
      };

      const response = await interactiveLearningService.getPersonalizedLearning(learningRequest);
      
      setLearningProgress(response.progress);
      setCurrentLesson(response.nextLesson);
      setSuggestions(response.suggestions);
      
      log.info('Learning progress loaded', { userId: user.id }, 'LEARNING_ASSISTANT');
    } catch (error) {
      log.error('Failed to load learning progress', error as Error, 'LEARNING_ASSISTANT');
    } finally {
      setIsLoading(false);
    }
  }, [user, language]);

  const analyzeCode = useCallback(async () => {
    if (!code.trim() || !language) return;

    try {
      setIsAnalyzing(true);
      
      const errorRequest: ErrorDetectionRequest = {
        code,
        language,
        cursorPosition
      };

      const errorResponse = await realTimeErrorDetectionService.detectErrors(errorRequest);
      
      setErrors(errorResponse.errors);
      setWarnings(errorResponse.warnings);
      
      // Get intelligent completions
      const completionRequest: CompletionRequest = {
        code,
        language,
        cursorPosition,
        context: {
          imports: extractImports(code, language),
          variables: extractVariables(code, language),
          functions: extractFunctions(code, language),
          classes: extractClasses(code, language)
        }
      };

      const completionResponse = await intelligentCompletionService.getCompletions(completionRequest);
      setCompletions(completionResponse.suggestions);
      
    } catch (error) {
      log.error('Code analysis failed', error as Error, 'LEARNING_ASSISTANT');
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language, cursorPosition]);

  const handleCompletionSelect = useCallback((completion: any) => {
    onCompletionSelect(completion.insertText || completion.text);
    setCompletions([]);
  }, [onCompletionSelect]);

  const markLessonComplete = useCallback(async (lessonId: string) => {
    if (!user) return;

    try {
      await interactiveLearningService.markLessonComplete(user.id, lessonId);
      
      // Reload progress
      await loadLearningProgress();
      
      log.user('Lesson marked as complete', { userId: user.id, lessonId }, 'LEARNING_ASSISTANT');
    } catch (error) {
      log.error('Failed to mark lesson complete', error as Error, 'LEARNING_ASSISTANT');
    }
  }, [user, loadLearningProgress]);

  // Helper functions to extract code context
  const extractImports = (code: string, lang: string): string[] => {
    const imports: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (lang === 'python' && line.trim().startsWith('import ')) {
        imports.push(line.trim());
      } else if (lang === 'javascript' && line.trim().startsWith('import ')) {
        imports.push(line.trim());
      }
    });
    
    return imports;
  };

  const extractVariables = (code: string, lang: string): string[] => {
    const variables: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (lang === 'python' && line.includes(' = ') && !line.trim().startsWith('#')) {
        const varName = line.split(' = ')[0].trim();
        if (varName && !varName.includes(' ') && !varName.includes('(')) {
          variables.push(varName);
        }
      }
    });
    
    return variables;
  };

  const extractFunctions = (code: string, lang: string): string[] => {
    const functions: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (lang === 'python' && line.trim().startsWith('def ')) {
        const funcName = line.trim().split('(')[0].replace('def ', '');
        functions.push(funcName);
      } else if (lang === 'javascript' && line.trim().startsWith('function ')) {
        const funcName = line.trim().split('(')[0].replace('function ', '');
        functions.push(funcName);
      }
    });
    
    return functions;
  };

  const extractClasses = (code: string, lang: string): string[] => {
    const classes: string[] = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (lang === 'python' && line.trim().startsWith('class ')) {
        const className = line.trim().split('(')[0].replace('class ', '').replace(':', '');
        classes.push(className);
      }
    });
    
    return classes;
  };

  if (!user) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in to access AI Learning Assistant</h3>
          <p className="text-muted-foreground">
            Get personalized learning recommendations and intelligent code assistance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="completions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Help
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Lesson
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLesson ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{currentLesson.title}</h3>
                      <p className="text-muted-foreground mt-1">{currentLesson.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {currentLesson.estimatedTime} min
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {currentLesson.points} pts
                        </Badge>
                        <Badge variant={currentLesson.difficulty === 'easy' ? 'default' : currentLesson.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                          {currentLesson.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                  
                  {currentLesson.hints && currentLesson.hints.length > 0 && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Hints
                      </h4>
                      <ul className="space-y-1">
                        {currentLesson.hints.map((hint: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading your personalized learning path...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completions Tab */}
        <TabsContent value="completions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Code Suggestions
                {isAnalyzing && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completions.length > 0 ? (
                <div className="space-y-3">
                  {completions.map((completion, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleCompletionSelect(completion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded mb-2">
                            {completion.text}
                          </div>
                          {completion.description && (
                            <p className="text-sm text-muted-foreground">
                              {completion.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {completion.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Start typing to get AI-powered code suggestions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Code Analysis
                {isAnalyzing && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-destructive">Errors ({errors.length})</h4>
                  {errors.map((error, index) => (
                    <div key={index} className="p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-destructive">{error.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">{error.description}</p>
                          {error.suggestions && error.suggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
                              <ul className="text-xs text-muted-foreground mt-1">
                                {error.suggestions.map((suggestion: string, i: number) => (
                                  <li key={i}>• {suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Line {error.line}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {warnings.length > 0 ? (
                <div className="space-y-3 mt-6">
                  <h4 className="font-medium text-yellow-600">Warnings ({warnings.length})</h4>
                  {warnings.map((warning, index) => (
                    <div key={index} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-yellow-800">{warning.message}</p>
                          <p className="text-sm text-yellow-700 mt-1">{warning.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Line {warning.line}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {errors.length === 0 && warnings.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-muted-foreground">
                    No errors or warnings detected. Great job! 🎉
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {learningProgress ? (
                <div className="space-y-6">
                  {/* Progress Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{learningProgress.totalPoints}</div>
                      <div className="text-sm text-muted-foreground">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{learningProgress.level}</div>
                      <div className="text-sm text-muted-foreground">Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{learningProgress.streak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.round(learningProgress.progress)}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(learningProgress.progress)}%</span>
                    </div>
                    <Progress value={learningProgress.progress} className="h-2" />
                  </div>

                  {/* Achievements */}
                  {learningProgress.achievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Recent Achievements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {learningProgress.achievements.map((achievement) => (
                          <div key={achievement.id} className="p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{achievement.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium">{achievement.title}</p>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <p className="text-xs text-primary mt-1">+{achievement.points} points</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading your progress...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntelligentLearningAssistant;
