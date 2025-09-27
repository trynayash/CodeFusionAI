/**
 * Interactive Learning Service
 * Advanced learning system with personalized paths and adaptive content
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface LearningRequest {
  userId: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  completedLessons: string[];
  currentLanguage?: string;
  learningGoals: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  lessons: Lesson[];
  prerequisites: string[];
  skills: string[];
  completionRate: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'tutorial' | 'exercise' | 'project' | 'quiz' | 'challenge';
  content: string;
  code: string;
  expectedOutput?: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  points: number;
  prerequisites: string[];
  nextLesson?: string;
}

export interface LearningProgress {
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  totalPoints: number;
  level: string;
  streak: number;
  achievements: Achievement[];
  learningPath: string;
  progress: number; // percentage
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

export interface LearningResponse {
  recommendedPath: LearningPath;
  nextLesson: Lesson;
  progress: LearningProgress;
  suggestions: string[];
  personalizedContent: PersonalizedContent;
}

export interface PersonalizedContent {
  difficulty: string;
  learningStyle: 'visual' | 'hands-on' | 'theoretical';
  pace: 'slow' | 'medium' | 'fast';
  focus: string[];
}

class InteractiveLearningService {
  private cache = new Map<string, LearningResponse>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private learningPaths = new Map<string, LearningPath>();

  constructor() {
    this.initializeLearningPaths();
    log.info('Interactive Learning Service initialized', {}, 'LEARNING');
  }

  /**
   * Initialize learning paths and content
   */
  private initializeLearningPaths(): void {
    // Python Learning Path
    const pythonPath: LearningPath = {
      id: 'python-basics',
      title: 'Python Fundamentals',
      description: 'Learn Python from scratch with hands-on exercises',
      difficulty: 'beginner',
      estimatedTime: 120,
      lessons: [
        {
          id: 'python-1',
          title: 'Hello World and Variables',
          type: 'tutorial',
          content: 'Learn the basics of Python programming with your first program.',
          code: 'print("Hello, World!")\nname = "Python Learner"\nprint(f"Welcome, {name}!")',
          expectedOutput: 'Hello, World!\nWelcome, Python Learner!',
          hints: ['Use print() to display text', 'Variables store data', 'f-strings format output'],
          difficulty: 'easy',
          estimatedTime: 15,
          points: 10,
          prerequisites: [],
          nextLesson: 'python-2'
        },
        {
          id: 'python-2',
          title: 'Data Types and Operations',
          type: 'exercise',
          content: 'Practice working with different data types in Python.',
          code: '# Complete the exercises below\n# 1. Create a variable with your age\n# 2. Create a variable with your favorite number\n# 3. Add them together and print the result',
          hints: ['Use int() for whole numbers', 'Variables can be added together'],
          difficulty: 'easy',
          estimatedTime: 20,
          points: 15,
          prerequisites: ['python-1'],
          nextLesson: 'python-3'
        },
        {
          id: 'python-3',
          title: 'Control Structures',
          type: 'project',
          content: 'Build a simple calculator using if/else statements.',
          code: '# Build a simple calculator\n# Ask user for two numbers and an operation\n# Perform the calculation and show the result',
          hints: ['Use input() to get user input', 'if/elif/else for decisions', 'int() converts strings to numbers'],
          difficulty: 'medium',
          estimatedTime: 30,
          points: 25,
          prerequisites: ['python-2'],
          nextLesson: 'python-4'
        }
      ],
      prerequisites: [],
      skills: ['Variables', 'Data Types', 'Control Structures', 'Functions'],
      completionRate: 0
    };

    // JavaScript Learning Path
    const javascriptPath: LearningPath = {
      id: 'javascript-basics',
      title: 'JavaScript Essentials',
      description: 'Master modern JavaScript development',
      difficulty: 'beginner',
      estimatedTime: 150,
      lessons: [
        {
          id: 'js-1',
          title: 'Variables and Functions',
          type: 'tutorial',
          content: 'Learn JavaScript variables and function declarations.',
          code: 'const message = "Hello, JavaScript!";\nconsole.log(message);\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));',
          expectedOutput: 'Hello, JavaScript!\nHello, Developer!',
          hints: ['Use const for constants', 'Functions can return values', 'Template literals use backticks'],
          difficulty: 'easy',
          estimatedTime: 20,
          points: 15,
          prerequisites: [],
          nextLesson: 'js-2'
        },
        {
          id: 'js-2',
          title: 'Arrays and Objects',
          type: 'exercise',
          content: 'Practice working with arrays and objects in JavaScript.',
          code: '// Create an array of programming languages\n// Create an object with your information\n// Access and modify the data',
          hints: ['Arrays use square brackets []', 'Objects use curly braces {}', 'Access with dot notation or brackets'],
          difficulty: 'medium',
          estimatedTime: 25,
          points: 20,
          prerequisites: ['js-1'],
          nextLesson: 'js-3'
        }
      ],
      prerequisites: [],
      skills: ['Variables', 'Functions', 'Arrays', 'Objects', 'DOM Manipulation'],
      completionRate: 0
    };

    // Advanced Web Development Path
    const webDevPath: LearningPath = {
      id: 'web-development',
      title: 'Full-Stack Web Development',
      description: 'Build complete web applications with modern technologies',
      difficulty: 'intermediate',
      estimatedTime: 300,
      lessons: [
        {
          id: 'web-1',
          title: 'React Components',
          type: 'project',
          content: 'Build your first React component with state management.',
          code: 'import React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default Counter;',
          hints: ['useState hook manages component state', 'Event handlers use arrow functions', 'JSX combines HTML and JavaScript'],
          difficulty: 'medium',
          estimatedTime: 45,
          points: 30,
          prerequisites: ['js-2'],
          nextLesson: 'web-2'
        }
      ],
      prerequisites: ['javascript-basics'],
      skills: ['React', 'Node.js', 'Database Design', 'API Development'],
      completionRate: 0
    };

    this.learningPaths.set('python-basics', pythonPath);
    this.learningPaths.set('javascript-basics', javascriptPath);
    this.learningPaths.set('web-development', webDevPath);
  }

  /**
   * Get personalized learning recommendations
   */
  async getPersonalizedLearning(request: LearningRequest): Promise<LearningResponse> {
    const startTime = performance.now();
    const requestId = generateId('learning');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('learning-service', 50, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Getting personalized learning recommendations', { 
        requestId, 
        userId: request.userId,
        currentLevel: request.currentLevel 
      }, 'LEARNING');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached learning recommendations', { requestId }, 'LEARNING');
        return cached;
      }

      // Generate personalized recommendations
      const recommendedPath = await this.recommendLearningPath(request);
      const nextLesson = await this.getNextLesson(request, recommendedPath);
      const progress = await this.getLearningProgress(request);
      const suggestions = await this.generateSuggestions(request);
      const personalizedContent = await this.analyzeLearningStyle(request);

      const processingTime = performance.now() - startTime;

      const response: LearningResponse = {
        recommendedPath,
        nextLesson,
        progress,
        suggestions,
        personalizedContent,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Personalized learning recommendations generated', { 
        requestId, 
        recommendedPath: recommendedPath.title,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Personalized learning recommendations failed', error as Error, 'LEARNING');
      
      // Return default recommendations
      return this.getDefaultRecommendations(request, processingTime);
    }
  }

  /**
   * Recommend learning path based on user profile
   */
  private async recommendLearningPath(request: LearningRequest): Promise<LearningPath> {
    const { currentLevel, interests, currentLanguage, learningGoals } = request;

    // Logic to select appropriate learning path
    if (currentLanguage === 'python' || interests.includes('python')) {
      return this.learningPaths.get('python-basics')!;
    } else if (currentLanguage === 'javascript' || interests.includes('javascript')) {
      return this.learningPaths.get('javascript-basics')!;
    } else if (interests.includes('web development') || learningGoals.includes('web development')) {
      return this.learningPaths.get('web-development')!;
    }

    // Default to Python for beginners
    return this.learningPaths.get('python-basics')!;
  }

  /**
   * Get the next lesson for the user
   */
  private async getNextLesson(request: LearningRequest, path: LearningPath): Promise<Lesson> {
    const { completedLessons } = request;
    
    // Find the first uncompleted lesson
    for (const lesson of path.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        return lesson;
      }
    }

    // If all lessons completed, return the last one
    return path.lessons[path.lessons.length - 1];
  }

  /**
   * Get user's learning progress
   */
  private async getLearningProgress(request: LearningRequest): Promise<LearningProgress> {
    const { userId, completedLessons } = request;
    
    // Calculate progress
    const totalLessons = 50; // Total available lessons
    const progressPercentage = (completedLessons.length / totalLessons) * 100;

    // Calculate level based on progress
    let level = 'Beginner';
    if (progressPercentage > 70) level = 'Advanced';
    else if (progressPercentage > 30) level = 'Intermediate';

    // Calculate streak (simplified)
    const streak = Math.min(completedLessons.length, 30);

    // Generate achievements
    const achievements: Achievement[] = [];
    if (completedLessons.length >= 5) {
      achievements.push({
        id: 'first-steps',
        title: 'First Steps',
        description: 'Completed your first 5 lessons',
        icon: '🎯',
        unlockedAt: new Date(),
        points: 50
      });
    }

    if (streak >= 7) {
      achievements.push({
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        unlockedAt: new Date(),
        points: 100
      });
    }

    return {
      userId,
      completedLessons,
      currentLesson: completedLessons[completedLessons.length - 1] || 'none',
      totalPoints: completedLessons.length * 15,
      level,
      streak,
      achievements,
      learningPath: 'python-basics',
      progress: progressPercentage
    };
  }

  /**
   * Generate personalized suggestions
   */
  private async generateSuggestions(request: LearningRequest): Promise<string[]> {
    const suggestions: string[] = [];
    const { currentLevel, completedLessons, interests } = request;

    // Based on completion rate
    if (completedLessons.length === 0) {
      suggestions.push('Start with the "Hello World" lesson to begin your journey');
      suggestions.push('Try the interactive exercises to practice hands-on');
    } else if (completedLessons.length < 5) {
      suggestions.push('Great start! Continue with the next lesson to build momentum');
      suggestions.push('Try the code challenges to reinforce what you\'ve learned');
    } else {
      suggestions.push('Excellent progress! Consider exploring advanced topics');
      suggestions.push('Join the community to share your projects and get feedback');
    }

    // Based on interests
    if (interests.includes('web development')) {
      suggestions.push('Explore our React and Node.js tutorials');
    }
    if (interests.includes('data science')) {
      suggestions.push('Check out our Python data analysis lessons');
    }

    return suggestions;
  }

  /**
   * Analyze user's learning style
   */
  private async analyzeLearningStyle(request: LearningRequest): Promise<PersonalizedContent> {
    const { completedLessons, currentLevel } = request;

    // Simple analysis based on completion patterns
    let learningStyle: 'visual' | 'hands-on' | 'theoretical' = 'hands-on';
    let pace: 'slow' | 'medium' | 'fast' = 'medium';
    
    // Adjust based on user behavior (simplified logic)
    if (completedLessons.length > 20) {
      pace = 'fast';
      learningStyle = 'hands-on';
    } else if (completedLessons.length < 5) {
      pace = 'slow';
      learningStyle = 'visual';
    }

    return {
      difficulty: currentLevel,
      learningStyle,
      pace,
      focus: ['practical exercises', 'real-world projects', 'community interaction']
    };
  }

  /**
   * Get default recommendations when AI fails
   */
  private getDefaultRecommendations(request: LearningRequest, processingTime: number): LearningResponse {
    const defaultPath = this.learningPaths.get('python-basics')!;
    const defaultLesson = defaultPath.lessons[0];

    return {
      recommendedPath: defaultPath,
      nextLesson: defaultLesson,
      progress: {
        userId: request.userId,
        completedLessons: [],
        currentLesson: 'none',
        totalPoints: 0,
        level: 'Beginner',
        streak: 0,
        achievements: [],
        learningPath: 'python-basics',
        progress: 0
      },
      suggestions: [
        'Start with the Python basics course',
        'Practice coding daily to build good habits',
        'Join our community for support and motivation'
      ],
      personalizedContent: {
        difficulty: 'beginner',
        learningStyle: 'hands-on',
        pace: 'medium',
        focus: ['fundamentals', 'practice', 'projects']
      }
    };
  }

  /**
   * Mark lesson as completed
   */
  async markLessonComplete(userId: string, lessonId: string): Promise<void> {
    try {
      log.info('Marking lesson as complete', { userId, lessonId }, 'LEARNING');
      
      // In a real implementation, this would update the database
      // For now, we'll just log the action
      
      log.user('Lesson completed successfully', { userId, lessonId });
    } catch (error) {
      log.error('Failed to mark lesson complete', error as Error, 'LEARNING');
      throw error;
    }
  }

  /**
   * Get learning statistics
   */
  async getLearningStats(userId: string): Promise<any> {
    try {
      log.info('Getting learning statistics', { userId }, 'LEARNING');
      
      // Return mock statistics
      return {
        totalLessons: 50,
        completedLessons: 12,
        totalPoints: 180,
        currentStreak: 5,
        longestStreak: 12,
        averageTimePerLesson: 25, // minutes
        favoriteLanguage: 'Python',
        achievements: 3,
        level: 'Intermediate'
      };
    } catch (error) {
      log.error('Failed to get learning statistics', error as Error, 'LEARNING');
      throw error;
    }
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: LearningRequest): string {
    const key = `${request.userId}-${request.currentLevel}-${request.interests.join(',')}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): LearningResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.progress.progress < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: LearningResponse): void {
    this.cache.set(key, data);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    log.info('Interactive Learning Service cache cleared', {}, 'LEARNING');
  }
}

// Create singleton instance
export const interactiveLearningService = new InteractiveLearningService();
export default interactiveLearningService;
