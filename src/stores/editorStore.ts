/**
 * Editor State Management with Zustand
 * Centralized state for the unified editor system
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { EditorState, EditorActions, EditorFile, EditorProject, EditorLanguage, EditorTemplate, EditorSettings, EditorTheme, ValidationResult, ExecutionResult } from '@/types/editor';
import { AIAnalysisResponse } from '@/types/api';
import { log } from '@/utils/logger';
import { generateId, storage } from '@/utils/api';
import { getLanguageById, getTemplatesForLanguage } from '@/config/languages';

// Default editor settings
const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  minimap: true,
  autoSave: true,
  autoSaveDelay: 1000,
  formatOnSave: true,
  formatOnType: false,
  showWhitespace: false,
  renderControlCharacters: false,
  bracketPairColorization: true,
  autoClosingBrackets: 'languageDefined',
  autoClosingQuotes: 'languageDefined',
  autoIndent: 'advanced',
  cursorBlinking: 'blink',
  cursorStyle: 'line',
  scrollBeyondLastLine: true,
  smoothScrolling: true,
  mouseWheelZoom: true,
  quickSuggestions: true,
  parameterHints: true,
  autoCompletion: true,
  codeLens: true,
  folding: true,
  foldingStrategy: 'auto',
  showFoldingControls: 'mouseover',
  matchBrackets: 'always',
  renderLineHighlight: 'line',
  occurrencesHighlight: true,
  selectionHighlight: true,
  hover: true,
  contextmenu: true,
  mouseWheelScrollSensitivity: 1,
  fastScrollSensitivity: 5,
};

// Default theme
const DEFAULT_THEME: EditorTheme = {
  id: 'vs-dark',
  name: 'vs-dark',
  displayName: 'Dark (Visual Studio)',
  type: 'dark',
  colors: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    selection: '#264f78',
    lineHighlight: '#2a2d2e',
    cursor: '#aeafad',
  },
  tokenColors: {
    comment: '#6a9955',
    keyword: '#569cd6',
    string: '#ce9178',
    number: '#b5cea8',
    function: '#dcdcaa',
    variable: '#9cdcfe',
  },
};

// Initial state
const initialState: EditorState = {
  currentProject: null,
  activeFile: null,
  openFiles: [],
  language: null,
  template: null,
  settings: DEFAULT_SETTINGS,
  theme: DEFAULT_THEME,
  isLoading: false,
  isSaving: false,
  isExecuting: false,
  isAnalyzing: false,
  sidebarVisible: true,
  terminalVisible: false,
  minimapVisible: true,
  explorerVisible: true,
  validationResult: null,
  executionResult: null,
  aiAnalysis: null,
  history: [],
  historyIndex: -1,
  isCollaborating: false,
  collaborators: [],
  searchQuery: '',
  replaceQuery: '',
  searchResults: [],
  currentSearchIndex: -1,
  error: null,
  status: null,
  notifications: [],
};

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,

          // Project management
          createProject: async (name: string, languageId: string, templateId?: string) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              log.info('Creating new project', { name, languageId, templateId }, 'EDITOR');

              const language = getLanguageById(languageId);
              if (!language) {
                throw new Error(`Language not found: ${languageId}`);
              }

              const templates = getTemplatesForLanguage(languageId);
              const template = templateId ? templates.find(t => t.id === templateId) : templates[0];

              const mainFile: EditorFile = {
                id: generateId('file'),
                name: `main${language.extension}`,
                path: `main${language.extension}`,
                content: template?.code || `// Welcome to ${language.displayName}\nconsole.log("Hello, World!");`,
                language: languageId,
                isDirty: false,
                isReadOnly: false,
                encoding: 'utf-8',
                lineEnding: 'LF',
                size: 0,
                lastModified: new Date(),
                cursor: { line: 1, column: 1 },
              };

              const project: EditorProject = {
                id: generateId('project'),
                name,
                files: [mainFile],
                activeFileId: mainFile.id,
                language: languageId,
                template: templateId,
                settings: {},
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: false,
                tags: [],
              };

              set((state) => {
                state.currentProject = project;
                state.activeFile = mainFile;
                state.openFiles = [mainFile];
                state.language = language;
                state.template = template || null;
                state.isLoading = false;
              });

              log.user('Project created', { projectId: project.id, name, language: languageId });

            } catch (error) {
              log.error('Failed to create project', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isLoading = false;
              });
            }
          },

          loadProject: async (projectId: string) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              log.info('Loading project', { projectId }, 'EDITOR');

              // In a real app, this would load from the database
              // For now, we'll simulate loading from localStorage
              const savedProject = storage.get<EditorProject>(`project_${projectId}`);
              
              if (!savedProject) {
                throw new Error('Project not found');
              }

              const language = getLanguageById(savedProject.language);
              const activeFile = savedProject.files.find(f => f.id === savedProject.activeFileId);

              set((state) => {
                state.currentProject = savedProject;
                state.activeFile = activeFile || savedProject.files[0] || null;
                state.openFiles = savedProject.files;
                state.language = language || null;
                state.isLoading = false;
              });

              log.user('Project loaded', { projectId });

            } catch (error) {
              log.error('Failed to load project', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isLoading = false;
              });
            }
          },

          saveProject: async () => {
            const { currentProject } = get();
            if (!currentProject) return;

            try {
              set((state) => {
                state.isSaving = true;
                state.error = null;
              });

              log.info('Saving project', { projectId: currentProject.id }, 'EDITOR');

              // Update project timestamp
              const updatedProject = {
                ...currentProject,
                updatedAt: new Date(),
              };

              // In a real app, this would save to the database
              // For now, we'll save to localStorage
              storage.set(`project_${currentProject.id}`, updatedProject);

              set((state) => {
                if (state.currentProject) {
                  state.currentProject.updatedAt = new Date();
                }
                state.isSaving = false;
              });

              log.user('Project saved', { projectId: currentProject.id });

            } catch (error) {
              log.error('Failed to save project', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isSaving = false;
              });
            }
          },

          deleteProject: async (projectId: string) => {
            try {
              log.info('Deleting project', { projectId }, 'EDITOR');

              // Remove from localStorage
              storage.remove(`project_${projectId}`);

              // If this is the current project, clear it
              const { currentProject } = get();
              if (currentProject?.id === projectId) {
                set((state) => {
                  state.currentProject = null;
                  state.activeFile = null;
                  state.openFiles = [];
                });
              }

              log.user('Project deleted', { projectId });

            } catch (error) {
              log.error('Failed to delete project', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
              });
            }
          },

          // File management
          createFile: (name: string, content = '') => {
            const { currentProject, language } = get();
            if (!currentProject || !language) return;

            const newFile: EditorFile = {
              id: generateId('file'),
              name,
              path: name,
              content,
              language: language.id,
              isDirty: false,
              isReadOnly: false,
              encoding: 'utf-8',
              lineEnding: 'LF',
              size: content.length,
              lastModified: new Date(),
              cursor: { line: 1, column: 1 },
            };

            set((state) => {
              if (state.currentProject) {
                state.currentProject.files.push(newFile);
                state.openFiles.push(newFile);
                state.activeFile = newFile;
                state.currentProject.activeFileId = newFile.id;
              }
            });

            log.user('File created', { fileName: name, fileId: newFile.id });
          },

          openFile: (fileId: string) => {
            const { currentProject, openFiles } = get();
            if (!currentProject) return;

            const file = currentProject.files.find(f => f.id === fileId);
            if (!file) return;

            const isAlreadyOpen = openFiles.some(f => f.id === fileId);

            set((state) => {
              state.activeFile = file;
              if (state.currentProject) {
                state.currentProject.activeFileId = fileId;
              }
              if (!isAlreadyOpen) {
                state.openFiles.push(file);
              }
            });

            log.user('File opened', { fileId, fileName: file.name });
          },

          closeFile: (fileId: string) => {
            const { openFiles, activeFile } = get();

            set((state) => {
              state.openFiles = state.openFiles.filter(f => f.id !== fileId);
              
              if (state.activeFile?.id === fileId) {
                const remainingFiles = state.openFiles.filter(f => f.id !== fileId);
                state.activeFile = remainingFiles[remainingFiles.length - 1] || null;
                if (state.currentProject && state.activeFile) {
                  state.currentProject.activeFileId = state.activeFile.id;
                }
              }
            });

            log.user('File closed', { fileId });
          },

          saveFile: async (fileId?: string) => {
            const { activeFile, currentProject } = get();
            const targetFile = fileId ? currentProject?.files.find(f => f.id === fileId) : activeFile;
            
            if (!targetFile) return;

            try {
              set((state) => {
                state.isSaving = true;
              });

              // Mark file as saved
              set((state) => {
                const file = state.currentProject?.files.find(f => f.id === targetFile.id);
                if (file) {
                  file.isDirty = false;
                  file.lastModified = new Date();
                }
                state.isSaving = false;
              });

              // Auto-save project
              await get().saveProject();

              log.user('File saved', { fileId: targetFile.id, fileName: targetFile.name });

            } catch (error) {
              log.error('Failed to save file', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isSaving = false;
              });
            }
          },

          deleteFile: (fileId: string) => {
            const { currentProject, openFiles, activeFile } = get();
            if (!currentProject) return;

            const file = currentProject.files.find(f => f.id === fileId);
            if (!file) return;

            set((state) => {
              if (state.currentProject) {
                state.currentProject.files = state.currentProject.files.filter(f => f.id !== fileId);
              }
              state.openFiles = state.openFiles.filter(f => f.id !== fileId);
              
              if (state.activeFile?.id === fileId) {
                const remainingFiles = state.openFiles.filter(f => f.id !== fileId);
                state.activeFile = remainingFiles[remainingFiles.length - 1] || null;
                if (state.currentProject && state.activeFile) {
                  state.currentProject.activeFileId = state.activeFile.id;
                }
              }
            });

            log.user('File deleted', { fileId, fileName: file.name });
          },

          renameFile: (fileId: string, newName: string) => {
            const { currentProject } = get();
            if (!currentProject) return;

            set((state) => {
              const file = state.currentProject?.files.find(f => f.id === fileId);
              if (file) {
                const oldName = file.name;
                file.name = newName;
                file.path = newName;
                file.isDirty = true;
                file.lastModified = new Date();
                
                log.user('File renamed', { fileId, oldName, newName });
              }
            });
          },

          // Content management
          updateContent: (fileId: string, content: string) => {
            set((state) => {
              const file = state.currentProject?.files.find(f => f.id === fileId);
              if (file) {
                file.content = content;
                file.isDirty = true;
                file.size = content.length;
                file.lastModified = new Date();
              }
            });
          },

          insertText: (fileId: string, text: string, position?: { line: number; column: number }) => {
            const { currentProject } = get();
            if (!currentProject) return;

            const file = currentProject.files.find(f => f.id === fileId);
            if (!file) return;

            // Simple text insertion at the end if no position specified
            const newContent = position ? file.content : file.content + text;

            get().updateContent(fileId, newContent);
          },

          replaceText: (fileId: string, text: string, range: { startLine: number; startColumn: number; endLine: number; endColumn: number }) => {
            const { currentProject } = get();
            if (!currentProject) return;

            const file = currentProject.files.find(f => f.id === fileId);
            if (!file) return;

            // Simple replacement - in a real implementation, this would handle line/column positions
            get().updateContent(fileId, text);
          },

          // Language and template
          setLanguage: (language: EditorLanguage) => {
            set((state) => {
              state.language = language;
            });

            log.user('Language changed', { languageId: language.id, languageName: language.displayName });
          },

          setTemplate: (template: EditorTemplate) => {
            set((state) => {
              state.template = template;
              if (state.activeFile) {
                state.activeFile.content = template.code;
                state.activeFile.isDirty = true;
              }
            });

            log.user('Template applied', { templateId: template.id, templateName: template.name });
          },

          // Settings and theme
          updateSettings: (newSettings: Partial<EditorSettings>) => {
            set((state) => {
              state.settings = { ...state.settings, ...newSettings };
            });

            log.user('Settings updated', { settings: newSettings });
          },

          setTheme: (theme: EditorTheme) => {
            set((state) => {
              state.theme = theme;
              state.settings.theme = theme.id;
            });

            log.user('Theme changed', { themeId: theme.id, themeName: theme.displayName });
          },

          // Execution and analysis
          executeCode: async (fileId?: string) => {
            const { activeFile, currentProject, language } = get();
            const targetFile = fileId ? currentProject?.files.find(f => f.id === fileId) : activeFile;
            
            if (!targetFile || !language) return;

            try {
              set((state) => {
                state.isExecuting = true;
                state.error = null;
              });

              log.info('Executing code', { fileId: targetFile.id, language: language.id }, 'EDITOR');

              // Simulate code execution
              await new Promise(resolve => setTimeout(resolve, 1000));

              const mockResult: ExecutionResult = {
                success: true,
                output: 'Hello, World!\nCode executed successfully!',
                errors: [],
                warnings: [],
                executionTime: 123,
                memoryUsage: 1024,
                language: language.id,
                version: '1.0.0',
              };

              set((state) => {
                state.executionResult = mockResult;
                state.isExecuting = false;
              });

              log.user('Code executed', { fileId: targetFile.id, success: mockResult.success });

            } catch (error) {
              log.error('Code execution failed', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isExecuting = false;
              });
            }
          },

          validateCode: async (fileId?: string) => {
            const { activeFile, currentProject, language } = get();
            const targetFile = fileId ? currentProject?.files.find(f => f.id === fileId) : activeFile;
            
            if (!targetFile || !language) return;

            try {
              set((state) => {
                state.isAnalyzing = true;
                state.error = null;
              });

              log.info('Validating code', { fileId: targetFile.id, language: language.id }, 'EDITOR');

              // Simulate code validation
              await new Promise(resolve => setTimeout(resolve, 500));

              const mockResult: ValidationResult = {
                isValid: true,
                errors: [],
                warnings: [],
                suggestions: [],
                executionTime: 50,
              };

              set((state) => {
                state.validationResult = mockResult;
                state.isAnalyzing = false;
              });

              log.user('Code validated', { fileId: targetFile.id, isValid: mockResult.isValid });

            } catch (error) {
              log.error('Code validation failed', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isAnalyzing = false;
              });
            }
          },

          analyzeWithAI: async (fileId?: string) => {
            const { activeFile, currentProject, language } = get();
            const targetFile = fileId ? currentProject?.files.find(f => f.id === fileId) : activeFile;
            
            if (!targetFile || !language) return;

            try {
              set((state) => {
                state.isAnalyzing = true;
                state.error = null;
              });

              log.info('Analyzing code with AI', { fileId: targetFile.id, language: language.id }, 'EDITOR');

              // Simulate AI analysis
              await new Promise(resolve => setTimeout(resolve, 2000));

              const mockResult: AIAnalysisResponse = {
                analysis: {
                  errors: [],
                  warnings: [],
                  suggestions: [
                    {
                      type: 'optimization',
                      message: 'Consider using const instead of let for variables that are not reassigned',
                      line: 1,
                      priority: 'medium',
                    }
                  ],
                  explanation: 'Your code looks good! Here are some suggestions for improvement.',
                },
                confidence: 0.95,
                processingTime: 1500,
              };

              set((state) => {
                state.aiAnalysis = mockResult;
                state.isAnalyzing = false;
              });

              log.user('AI analysis completed', { fileId: targetFile.id, confidence: mockResult.confidence });

            } catch (error) {
              log.error('AI analysis failed', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
                state.isAnalyzing = false;
              });
            }
          },

          formatCode: async (fileId?: string) => {
            const { activeFile, currentProject } = get();
            const targetFile = fileId ? currentProject?.files.find(f => f.id === fileId) : activeFile;
            
            if (!targetFile) return;

            try {
              log.info('Formatting code', { fileId: targetFile.id }, 'EDITOR');

              // Simple formatting simulation
              const formattedContent = targetFile.content
                .split('\n')
                .map(line => line.trim())
                .join('\n');

              get().updateContent(targetFile.id, formattedContent);

              log.user('Code formatted', { fileId: targetFile.id });

            } catch (error) {
              log.error('Code formatting failed', error as Error, 'EDITOR');
              set((state) => {
                state.error = (error as Error).message;
              });
            }
          },

          // UI state
          toggleSidebar: () => {
            set((state) => {
              state.sidebarVisible = !state.sidebarVisible;
            });
          },

          toggleTerminal: () => {
            set((state) => {
              state.terminalVisible = !state.terminalVisible;
            });
          },

          toggleMinimap: () => {
            set((state) => {
              state.minimapVisible = !state.minimapVisible;
              state.settings.minimap = state.minimapVisible;
            });
          },

          toggleExplorer: () => {
            set((state) => {
              state.explorerVisible = !state.explorerVisible;
            });
          },

          // Search and replace
          search: (query: string) => {
            set((state) => {
              state.searchQuery = query;
              // Simple search simulation
              state.searchResults = [];
              state.currentSearchIndex = -1;
            });
          },

          replace: (query: string, replacement: string) => {
            // Implementation would handle single replacement
            log.user('Text replaced', { query, replacement });
          },

          replaceAll: (query: string, replacement: string) => {
            // Implementation would handle all replacements
            log.user('All text replaced', { query, replacement });
          },

          goToNextSearchResult: () => {
            const { searchResults, currentSearchIndex } = get();
            if (searchResults.length === 0) return;

            set((state) => {
              state.currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
            });
          },

          goToPreviousSearchResult: () => {
            const { searchResults, currentSearchIndex } = get();
            if (searchResults.length === 0) return;

            set((state) => {
              state.currentSearchIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
            });
          },

          // History
          undo: () => {
            // Implementation would handle undo
            log.user('Undo action');
          },

          redo: () => {
            // Implementation would handle redo
            log.user('Redo action');
          },

          clearHistory: () => {
            set((state) => {
              state.history = [];
              state.historyIndex = -1;
            });
          },

          // Collaboration
          startCollaboration: async () => {
            try {
              set((state) => {
                state.isCollaborating = true;
              });

              log.user('Collaboration started');

            } catch (error) {
              log.error('Failed to start collaboration', error as Error, 'EDITOR');
            }
          },

          stopCollaboration: () => {
            set((state) => {
              state.isCollaborating = false;
              state.collaborators = [];
            });

            log.user('Collaboration stopped');
          },

          inviteCollaborator: async (email: string) => {
            try {
              log.info('Inviting collaborator', { email }, 'EDITOR');
              // Implementation would send invitation
              log.user('Collaborator invited', { email });

            } catch (error) {
              log.error('Failed to invite collaborator', error as Error, 'EDITOR');
            }
          },

          // Notifications
          addNotification: (notification) => {
            const newNotification = {
              ...notification,
              id: generateId('notification'),
              timestamp: new Date(),
            };

            set((state) => {
              state.notifications.push(newNotification);
            });

            // Auto-remove notification after 5 seconds if autoClose is true
            if (notification.autoClose !== false) {
              setTimeout(() => {
                get().removeNotification(newNotification.id);
              }, 5000);
            }
          },

          removeNotification: (id: string) => {
            set((state) => {
              state.notifications = state.notifications.filter(n => n.id !== id);
            });
          },

          clearNotifications: () => {
            set((state) => {
              state.notifications = [];
            });
          },

          // Error handling
          setError: (error: string | null) => {
            set((state) => {
              state.error = error;
            });
          },

          setStatus: (status: string | null) => {
            set((state) => {
              state.status = status;
            });
          },

          clearError: () => {
            set((state) => {
              state.error = null;
            });
          },

          clearStatus: () => {
            set((state) => {
              state.status = null;
            });
          },
        }))
      ),
      {
        name: 'editor-store',
        partialize: (state) => ({
          settings: state.settings,
          theme: state.theme,
          sidebarVisible: state.sidebarVisible,
          terminalVisible: state.terminalVisible,
          minimapVisible: state.minimapVisible,
          explorerVisible: state.explorerVisible,
        }),
      }
    ),
    {
      name: 'editor-store',
    }
  )
);

// Selectors for better performance
export const useEditorProject = () => useEditorStore((state) => state.currentProject);
export const useActiveFile = () => useEditorStore((state) => state.activeFile);
export const useOpenFiles = () => useEditorStore((state) => state.openFiles);
export const useEditorLanguage = () => useEditorStore((state) => state.language);
export const useEditorSettings = () => useEditorStore((state) => state.settings);
export const useEditorTheme = () => useEditorStore((state) => state.theme);

// Simple individual selectors to prevent infinite re-renders
export const useSidebarVisible = () => useEditorStore((state) => state.sidebarVisible);
export const useTerminalVisible = () => useEditorStore((state) => state.terminalVisible);
export const useMinimapVisible = () => useEditorStore((state) => state.minimapVisible);
export const useExplorerVisible = () => useEditorStore((state) => state.explorerVisible);

export const useEditorStatus = () => useEditorStore(
  (state) => ({
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    isExecuting: state.isExecuting,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    status: state.status,
  }),
  (a, b) =>
    a.isLoading === b.isLoading &&
    a.isSaving === b.isSaving &&
    a.isExecuting === b.isExecuting &&
    a.isAnalyzing === b.isAnalyzing &&
    a.error === b.error &&
    a.status === b.status
);

export const useEditorResults = () => useEditorStore(
  (state) => ({
    validationResult: state.validationResult,
    executionResult: state.executionResult,
    aiAnalysis: state.aiAnalysis,
  }),
  (a, b) =>
    a.validationResult === b.validationResult &&
    a.executionResult === b.executionResult &&
    a.aiAnalysis === b.aiAnalysis
);

export const useEditorNotifications = () => useEditorStore((state) => state.notifications);