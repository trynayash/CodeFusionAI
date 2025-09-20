/**
 * Unified Code Editor Page
 * Advanced multi-file project-based code editor with real-time collaboration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  FolderOpen, 
  FileText, 
  Settings, 
  Users, 
  Terminal,
  Search,
  Zap,
  Brain,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Code2,
  File,
  Folder,
  Trash2,
  Edit3,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/header';
import { useEditorStore, useEditorProject, useActiveFile, useEditorLanguage } from '@/stores/editorStore';
import { log } from '@/utils/logger';

function UnifiedCodeEditor() {
  const { language: languageParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Editor store
  const {
    currentProject,
    activeFile,
    openFiles,
    language,
    isLoading,
    isSaving,
    isExecuting,
    isAnalyzing,
    sidebarVisible,
    terminalVisible,
    explorerVisible,
    createProject,
    loadProject,
    saveProject,
    openFile,
    closeFile,
    createFile,
    deleteFile,
    renameFile,
    updateContent,
    executeCode,
    validateCode,
    analyzeWithAI,
    formatCode,
    toggleSidebar,
    toggleTerminal,
    toggleExplorer,
    setLanguage
  } = useEditorStore();

  // Local state
  const [selectedLanguage, setSelectedLanguage] = useState(languageParam || 'javascript');
  const [projectName, setProjectName] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameFileName, setRenameFileName] = useState('');
  const [fileToRename, setFileToRename] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCollaboration, setShowCollaboration] = useState(false);

  // Language options
  const languages = [
    { id: 'javascript', name: 'JavaScript', extension: '.js' },
    { id: 'typescript', name: 'TypeScript', extension: '.ts' },
    { id: 'python', name: 'Python', extension: '.py' },
    { id: 'java', name: 'Java', extension: '.java' },
    { id: 'cpp', name: 'C++', extension: '.cpp' },
    { id: 'c', name: 'C', extension: '.c' },
    { id: 'go', name: 'Go', extension: '.go' },
    { id: 'rust', name: 'Rust', extension: '.rs' },
    { id: 'php', name: 'PHP', extension: '.php' },
    { id: 'ruby', name: 'Ruby', extension: '.rb' },
    { id: 'swift', name: 'Swift', extension: '.swift' },
    { id: 'kotlin', name: 'Kotlin', extension: '.kt' },
    { id: 'csharp', name: 'C#', extension: '.cs' },
    { id: 'scala', name: 'Scala', extension: '.scala' },
    { id: 'r', name: 'R', extension: '.r' },
    { id: 'dart', name: 'Dart', extension: '.dart' },
  ];

  // Initialize editor
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        log.info('Initializing unified code editor', { language: selectedLanguage }, 'UNIFIED_EDITOR');
        
        // Set language
        const lang = languages.find(l => l.id === selectedLanguage);
        if (lang) {
          setLanguage({
            id: lang.id,
            name: lang.name,
            displayName: lang.name,
            extension: lang.extension,
            mimeType: `text/${lang.id}`,
            version: '1.0.0',
            description: `${lang.name} programming language`,
            website: '',
            documentation: '',
            tutorials: [],
            examples: [],
            frameworks: [],
            tools: [],
            community: '',
            difficulty: 'intermediate',
            popularity: 'high',
            jobMarket: 'high',
            learningCurve: 'medium',
            performance: 'high',
            ecosystem: 'large',
            syntax: 'c-like',
            paradigm: 'multi-paradigm',
            typing: 'dynamic',
            compilation: 'interpreted',
            platforms: ['web', 'server', 'mobile'],
            useCases: ['web-development', 'backend', 'mobile'],
            features: ['async', 'functional', 'oop'],
            limitations: [],
            bestPractices: [],
            resources: [],
            icon: '',
            color: '#f7df1e',
            gradient: 'from-yellow-400 to-yellow-600',
            category: 'programming',
            tags: ['popular', 'versatile', 'web'],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Check for template parameter
        const templateParam = searchParams.get('template');
        if (templateParam && !currentProject) {
          // Create project with template
          const projectName = `${selectedLanguage}-project-${Date.now()}`;
          await createProject(projectName, selectedLanguage, templateParam);
        } else if (!currentProject) {
          // Create default project
          const projectName = `${selectedLanguage}-project-${Date.now()}`;
          await createProject(projectName, selectedLanguage);
        }

      } catch (error) {
        log.error('Failed to initialize unified editor', error as Error, 'UNIFIED_EDITOR');
        toast({
          title: "Initialization Error",
          description: "Failed to initialize the code editor. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeEditor();
  }, [selectedLanguage, searchParams, currentProject, createProject, setLanguage, toast]);

  // Handle file operations
  const handleCreateFile = useCallback(async () => {
    if (!newFileName.trim()) return;
    
    try {
      const fileName = newFileName.includes('.') ? newFileName : `${newFileName}${language?.extension || '.js'}`;
      createFile(fileName);
      setNewFileName('');
      setShowNewFileDialog(false);
      
      toast({
        title: "File Created",
        description: `Created ${fileName}`,
      });
    } catch (error) {
      log.error('Failed to create file', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    }
  }, [newFileName, language, createFile, toast]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    try {
      deleteFile(fileId);
      toast({
        title: "File Deleted",
        description: "File has been deleted",
      });
    } catch (error) {
      log.error('Failed to delete file', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  }, [deleteFile, toast]);

  const handleRenameFile = useCallback(async () => {
    if (!fileToRename || !renameFileName.trim()) return;
    
    try {
      renameFile(fileToRename, renameFileName);
      setRenameFileName('');
      setShowRenameDialog(false);
      setFileToRename(null);
      
      toast({
        title: "File Renamed",
        description: `Renamed to ${renameFileName}`,
      });
    } catch (error) {
      log.error('Failed to rename file', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Error",
        description: "Failed to rename file",
        variant: "destructive",
      });
    }
  }, [fileToRename, renameFileName, renameFile, toast]);

  // Handle code execution
  const handleExecuteCode = useCallback(async () => {
    try {
      await executeCode();
      toast({
        title: "Code Executed",
        description: "Code has been executed successfully",
      });
    } catch (error) {
      log.error('Code execution failed', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Execution Error",
        description: "Failed to execute code",
        variant: "destructive",
      });
    }
  }, [executeCode, toast]);

  // Handle code analysis
  const handleAnalyzeCode = useCallback(async () => {
    try {
      await analyzeWithAI();
      toast({
        title: "Code Analyzed",
        description: "AI analysis completed",
      });
    } catch (error) {
      log.error('Code analysis failed', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Analysis Error",
        description: "Failed to analyze code",
        variant: "destructive",
      });
    }
  }, [analyzeWithAI, toast]);

  // Handle code formatting
  const handleFormatCode = useCallback(async () => {
    try {
      await formatCode();
      toast({
        title: "Code Formatted",
        description: "Code has been formatted",
      });
    } catch (error) {
      log.error('Code formatting failed', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Formatting Error",
        description: "Failed to format code",
        variant: "destructive",
      });
    }
  }, [formatCode, toast]);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      await saveProject();
      toast({
        title: "Project Saved",
        description: "Project has been saved successfully",
      });
    } catch (error) {
      log.error('Failed to save project', error as Error, 'UNIFIED_EDITOR');
      toast({
        title: "Save Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  }, [saveProject, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Loading Editor...</h2>
            <p className="text-slate-400">Initializing your coding environment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="pt-20 flex h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-900/50 border-r border-slate-700 flex flex-col"
            >
              {/* Project Header */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Project</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewFileDialog(true)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {currentProject && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Folder className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">{currentProject.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {language?.name || selectedLanguage}
                    </Badge>
                  </div>
                )}
              </div>

              {/* File Explorer */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">
                  {currentProject?.files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                        activeFile?.id === file.id
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'hover:bg-slate-700/50 text-slate-300'
                      }`}
                      onClick={() => openFile(file.id)}
                    >
                      <File className="h-4 w-4" />
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setFileToRename(file.id);
                            setRenameFileName(file.name);
                            setShowRenameDialog(true);
                          }}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(file.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Project Actions */}
              <div className="p-4 border-t border-slate-700 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Project'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowCollaboration(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Collaborate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-slate-800/50 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="text-slate-400 hover:text-white"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTerminal}
                  className="text-slate-400 hover:text-white"
                >
                  <Terminal className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExecuteCode}
                  disabled={isExecuting}
                  className="text-slate-400 hover:text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isExecuting ? 'Running...' : 'Run'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyzeCode}
                  disabled={isAnalyzing}
                  className="text-slate-400 hover:text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFormatCode}
                  className="text-slate-400 hover:text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Format
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {/* File Tabs */}
              <div className="bg-slate-800/30 border-b border-slate-700">
                <div className="flex items-center space-x-1 p-2">
                  {openFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-t-md cursor-pointer transition-colors ${
                        activeFile?.id === file.id
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-800/50 text-slate-400 hover:text-white'
                      }`}
                      onClick={() => openFile(file.id)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-slate-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFile(file.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={language?.id || 'javascript'}
                    value={activeFile.content}
                    onChange={(value) => {
                      if (value !== undefined && activeFile) {
                        updateContent(activeFile.id, value);
                      }
                    }}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      minimap: { enabled: true },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: 'blink',
                      cursorStyle: 'line',
                      renderLineHighlight: 'line',
                      occurrencesHighlight: true,
                      selectionHighlight: true,
                      bracketPairColorization: true,
                      autoClosingBrackets: 'languageDefined',
                      autoClosingQuotes: 'languageDefined',
                      autoIndent: 'advanced',
                      formatOnSave: true,
                      formatOnType: false,
                      showWhitespace: false,
                      renderControlCharacters: false,
                      quickSuggestions: true,
                      parameterHints: { enabled: true },
                      hover: { enabled: true },
                      contextmenu: true,
                      mouseWheelZoom: true,
                      mouseWheelScrollSensitivity: 1,
                      fastScrollSensitivity: 5,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <Code2 className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No File Open</h3>
                      <p className="text-sm">Select a file from the sidebar to start coding</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Panel */}
            <AnimatePresence>
              {terminalVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 300, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-900/50 border-t border-slate-700"
                >
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-white">Terminal</h3>
                  </div>
                  <div className="p-4 h-full">
                    <div className="bg-slate-950 rounded-md p-4 h-full font-mono text-sm text-green-400">
                      <div className="mb-2">$ Ready to execute code...</div>
                      <div className="text-slate-400">Click "Run" to execute your code</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter file name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter new file name..."
              value={renameFileName}
              onChange={(e) => setRenameFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRenameFile()}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameFile} disabled={!renameFileName.trim()}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Collaboration Dialog */}
      <Dialog open={showCollaboration} onOpenChange={setShowCollaboration}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collaborate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Real-time collaboration features are coming soon! This will allow multiple users to edit code together in real-time.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowCollaboration(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UnifiedCodeEditor;
