/**
 * Editor Types
 * Type definitions for the unified code editor system
 */

export interface EditorState {
  // Project management
  currentProject: EditorProject | null;
  activeFile: EditorFile | null;
  openFiles: EditorFile[];
  
  // Language and template
  language: EditorLanguage | null;
  template: EditorTemplate | null;
  
  // Settings and theme
  settings: EditorSettings;
  theme: EditorTheme;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isExecuting: boolean;
  isAnalyzing: boolean;
  
  // UI state
  sidebarVisible: boolean;
  terminalVisible: boolean;
  minimapVisible: boolean;
  explorerVisible: boolean;
  
  // Results
  validationResult: ValidationResult | null;
  executionResult: ExecutionResult | null;
  aiAnalysis: any | null;
  
  // History
  history: EditorHistoryEntry[];
  historyIndex: number;
  
  // Collaboration
  isCollaborating: boolean;
  collaborators: Collaborator[];
  
  // Search
  searchQuery: string;
  replaceQuery: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  
  // Error handling
  error: string | null;
  status: string | null;
  
  // Notifications
  notifications: EditorNotification[];
}

export interface EditorActions {
  // Project management
  createProject: (name: string, languageId: string, templateId?: string) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // File management
  createFile: (name: string, content?: string) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  saveFile: (fileId?: string) => Promise<void>;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  
  // Content management
  updateContent: (fileId: string, content: string) => void;
  insertText: (fileId: string, text: string, position?: { line: number; column: number }) => void;
  replaceText: (fileId: string, text: string, range: { startLine: number; startColumn: number; endLine: number; endColumn: number }) => void;
  
  // Language and template
  setLanguage: (language: EditorLanguage) => void;
  setTemplate: (template: EditorTemplate) => void;
  
  // Settings and theme
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  setTheme: (theme: EditorTheme) => void;
  
  // Execution and analysis
  executeCode: (fileId?: string) => Promise<void>;
  validateCode: (fileId?: string) => Promise<void>;
  analyzeWithAI: (fileId?: string) => Promise<void>;
  formatCode: (fileId?: string) => Promise<void>;
  
  // UI state
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  toggleMinimap: () => void;
  toggleExplorer: () => void;
  
  // Search and replace
  search: (query: string) => void;
  replace: (query: string, replacement: string) => void;
  replaceAll: (query: string, replacement: string) => void;
  goToNextSearchResult: () => void;
  goToPreviousSearchResult: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  
  // Collaboration
  startCollaboration: () => Promise<void>;
  stopCollaboration: () => void;
  inviteCollaborator: (email: string) => Promise<void>;
  
  // Notifications
  addNotification: (notification: Omit<EditorNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Error handling
  setError: (error: string | null) => void;
  setStatus: (status: string | null) => void;
  clearError: () => void;
  clearStatus: () => void;
}

export interface EditorProject {
  id: string;
  name: string;
  files: EditorFile[];
  activeFileId: string;
  language: string;
  template?: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface EditorFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isReadOnly: boolean;
  encoding: string;
  lineEnding: string;
  size: number;
  lastModified: Date;
  cursor: { line: number; column: number };
}

export interface EditorLanguage {
  id: string;
  name: string;
  displayName: string;
  extension: string;
  mimeType: string;
  version: string;
  description: string;
  website: string;
  documentation: string;
  tutorials: string[];
  examples: string[];
  frameworks: string[];
  tools: string[];
  community: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: 'low' | 'medium' | 'high' | 'very-high' | 'growing';
  jobMarket: 'low' | 'medium' | 'high' | 'growing';
  learningCurve: 'easy' | 'medium' | 'hard';
  performance: 'low' | 'medium' | 'high' | 'very-high';
  ecosystem: 'small' | 'medium' | 'large' | 'very-large' | 'growing';
  syntax: 'c-like' | 'python-like' | 'lisp-like' | 'functional' | 'ruby-like' | 'other';
  paradigm: 'procedural' | 'object-oriented' | 'functional' | 'multi-paradigm';
  typing: 'static' | 'dynamic' | 'gradual';
  compilation: 'compiled' | 'interpreted' | 'hybrid';
  platforms: string[];
  useCases: string[];
  features: string[];
  limitations: string[];
  bestPractices: string[];
  resources: string[];
  icon: string;
  color: string;
  gradient: string;
  category: 'programming' | 'markup' | 'data' | 'config' | 'other';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  lineNumbers: 'off' | 'on' | 'relative' | 'interval';
  minimap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  formatOnSave: boolean;
  formatOnType: boolean;
  showWhitespace: boolean;
  renderControlCharacters: boolean;
  bracketPairColorization: boolean;
  autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoClosingQuotes: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoIndent: 'none' | 'advanced' | 'full';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  scrollBeyondLastLine: boolean;
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
  quickSuggestions: boolean;
  parameterHints: boolean;
  autoCompletion: boolean;
  codeLens: boolean;
  folding: boolean;
  foldingStrategy: 'auto' | 'indentation';
  showFoldingControls: 'always' | 'mouseover';
  matchBrackets: 'always' | 'near' | 'never';
  renderLineHighlight: 'none' | 'gutter' | 'line' | 'all';
  occurrencesHighlight: boolean;
  selectionHighlight: boolean;
  hover: boolean;
  contextmenu: boolean;
  mouseWheelScrollSensitivity: number;
  fastScrollSensitivity: number;
}

export interface EditorTheme {
  id: string;
  name: string;
  displayName: string;
  type: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    selection: string;
    lineHighlight: string;
    cursor: string;
  };
  tokenColors: {
    comment: string;
    keyword: string;
    string: string;
    number: string;
    function: string;
    variable: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  executionTime: number;
}

export interface ValidationError {
  type: 'syntax' | 'type' | 'reference' | 'logic';
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  suggestions: string[];
  fixable: boolean;
}

export interface ValidationWarning {
  type: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'warning' | 'info';
  suggestions: string[];
}

export interface ValidationSuggestion {
  type: 'style' | 'performance' | 'best-practice' | 'refactor';
  message: string;
  line?: number;
  column?: number;
  priority: 'low' | 'medium' | 'high';
  code?: string;
}

export interface ExecutionResult {
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
  linesExecuted: number;
  functionsCalled: number;
  variablesUsed: number;
  memoryPeak: number;
  cpuTime: number;
}

export interface EditorHistoryEntry {
  id: string;
  type: 'content' | 'file' | 'settings';
  action: string;
  timestamp: Date;
  data: any;
}

export interface Collaborator {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastSeen: Date;
  cursor?: CursorPosition;
  selection?: SelectionRange;
  isOnline: boolean;
  color: string;
}

export interface CursorPosition {
  line: number;
  column: number;
  fileId: string;
}

export interface SelectionRange {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  fileId: string;
}

export interface SearchResult {
  fileId: string;
  line: number;
  column: number;
    text: string;
  match: string;
}

export interface EditorNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
    label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}