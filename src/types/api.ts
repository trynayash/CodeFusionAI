/**
 * Core API Response Types
 * Standardized response interface for all API calls
 */

export interface APIResponse<T = unknown> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SupabaseResponse<T = unknown> {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
  count?: number | null;
  status: number;
  statusText: string;
}

// User related types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  editor_theme: string;
  font_size: number;
  auto_save: boolean;
  notifications: boolean;
  language: string;
}

// Dashboard related types
export interface UserStats {
  snippets: number;
  projects: number;
  totalHours: number;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  linesOfCode: number;
  languagesUsed: string[];
}

export interface Activity {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
  type: 'snippet' | 'project';
  status: 'draft' | 'completed' | 'shared';
  tags: string[];
  description?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category: 'coding' | 'learning' | 'social' | 'achievement';
}

// Code Editor types
export interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  likes_count: number;
  views_count: number;
  fork_count: number;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  files: ProjectFile[];
  language: string;
  framework?: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  likes_count: number;
  views_count: number;
  fork_count: number;
  status: 'active' | 'archived' | 'template';
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  size: number;
  created_at: string;
  updated_at: string;
}

// AI Integration types
export interface AIAnalysisRequest {
  code: string;
  language: string;
  context?: string;
  analysisType: 'syntax' | 'performance' | 'security' | 'suggestions' | 'explanation';
}

export interface AIAnalysisResponse {
  analysis: {
    errors: CodeError[];
    warnings: CodeWarning[];
    suggestions: CodeSuggestion[];
    explanation?: string;
    performance?: PerformanceAnalysis;
    security?: SecurityAnalysis;
  };
  confidence: number;
  processingTime: number;
}

export interface CodeError {
  type: 'SyntaxError' | 'TypeError' | 'ReferenceError' | 'LogicError';
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  suggestions: string[];
  fixable: boolean;
}

export interface CodeWarning {
  type: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'warning' | 'info';
  suggestions: string[];
}

export interface CodeSuggestion {
  type: 'optimization' | 'best-practice' | 'refactor' | 'feature';
  message: string;
  line?: number;
  column?: number;
  priority: 'high' | 'medium' | 'low';
  code?: string;
}

export interface PerformanceAnalysis {
  complexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2^n)';
  memoryUsage: 'low' | 'medium' | 'high';
  optimizations: string[];
  bottlenecks: string[];
}

export interface SecurityAnalysis {
  vulnerabilities: SecurityVulnerability[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface SecurityVulnerability {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  fix?: string;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  currency: string;
  instructor: Instructor;
  curriculum: CourseModule[];
  tags: string[];
  rating: number;
  reviews_count: number;
  students_count: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  thumbnail_url?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  duration: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'code' | 'quiz';
  duration: string;
  order: number;
  is_free: boolean;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'file' | 'link' | 'code';
  url: string;
  description?: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar_url?: string;
  expertise: string[];
  rating: number;
  courses_count: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  context?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface SearchParams {
  query: string;
  filters?: {
    language?: string;
    tags?: string[];
    type?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  pagination: PaginationParams;
}