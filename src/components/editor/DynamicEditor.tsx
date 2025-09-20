/**
 * Dynamic Editor Component
 * Unified editor that replaces all 50+ individual editor files
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Editor, OnMount, OnChange } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Save, Download, Upload, Settings, Maximize2, Minimize2,
  FileText, Folder, Search, Replace, Zap, Bug, Palette, 
  Terminal, Sidebar, Map, Eye, EyeOff, RotateCcw, RotateCw,
  Share2, Users, MessageSquare, Bell, X, Check, AlertTriangle,
  Info, Loader2, Code2, Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useEditorStore, useActiveFile, useEditorLanguage, useEditorSettings, useEditorStatus, useEditorResults, useEditorNotifications } from '@/stores/editorStore';
import { EditorFile, EditorLanguage } from '@/types/editor';
import { log } from '@/utils/logger';
import { withErrorBoundary } from '@/components/ErrorBoundary';

interface DynamicEditorProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  readOnly?: boolean;
  showMinimap?: boolean;
  showLineNumbers?: boolean;
  theme?: string;
  onContentChange?: (content: string) => void;
  onLanguageChange?: (language: EditorLanguage) => void;
}

function DynamicEditor({
  className = '',
  height = '600px',
  width = '100%',
  readOnly = false,
  showMinimap,
  showLineNumbers,
  theme,
  onContentChange,
  onLanguageChange,
}: DynamicEditorProps) {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Store selectors
  const activeFile = useActiveFile();
  const language = useEditorLanguage();
  const settings = useEditorSettings();
  const status = useEditorStatus();
  const results = useEditorResults();
  const notifications = useEditorNotifications();

  // Store actions
  const {
    updateContent,
    saveFile,
    executeCode,
    validateCode,
    analyzeWithAI,
    formatCode,
    toggleSidebar,
    toggleTerminal,
    toggleMinimap,
    toggleExplorer,
    updateSettings,
    addNotification,
    removeNotification,
    setError,
    clearError,
  } = useEditorStore();

  // Monaco editor configuration
  const editorOptions = {
    fontSize: theme ? undefined : settings.fontSize,
    fontFamily: settings.fontFamily,
    tabSize: settings.tabSize,
    insertSpaces: settings.insertSpaces,
    wordWrap: settings.wordWrap,
    lineNumbers: showLineNumbers !== undefined ? (showLineNumbers ? 'on' : 'off') : settings.lineNumbers,
    minimap: { enabled: showMinimap !== undefined ? showMinimap : settings.minimap },
    automaticLayout: true,
    scrollBeyondLastLine: settings.scrollBeyondLastLine,
    smoothScrolling: settings.smoothScrolling,
    mouseWheelZoom: settings.mouseWheelZoom,
    quickSuggestions: settings.quickSuggestions,
    parameterHints: { enabled: settings.parameterHints },
    suggestOnTriggerCharacters: settings.autoCompletion,
    codeLens: settings.codeLens,
    folding: settings.folding,
    foldingStrategy: settings.foldingStrategy,
    showFoldingControls: settings.showFoldingControls,
    matchBrackets: settings.matchBrackets,
    renderLineHighlight: settings.renderLineHighlight,
    occurrencesHighlight: settings.occurrencesHighlight,
    selectionHighlight: settings.selectionHighlight,
    hover: { enabled: settings.hover },
    contextmenu: settings.contextmenu,
    mouseWheelScrollSensitivity: settings.mouseWheelScrollSensitivity,
    fastScrollSensitivity: settings.fastScrollSensitivity,
    readOnly: readOnly || activeFile?.isReadOnly,
    theme: theme || settings.theme,
    bracketPairColorization: { enabled: settings.bracketPairColorization },
    autoClosingBrackets: settings.autoClosingBrackets,
    autoClosingQuotes: settings.autoClosingQuotes,
    autoIndent: settings.autoIndent,
    cursorBlinking: settings.cursorBlinking,
    cursorStyle: settings.cursorStyle,
    renderControlCharacters: settings.renderControlCharacters,
    renderWhitespace: settings.showWhitespace ? 'all' : 'none',
  };

  // Handle editor mount
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    log.info('Monaco editor mounted', { 
      language: language?.id,
      theme: settings.theme 
    }, 'EDITOR');

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecute();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      handleFormat();
    });

    // Focus the editor
    editor.focus();
  }, [language, settings.theme]);

  // Handle content change
  const handleEditorChange: OnChange = useCallback((value) => {
    if (!activeFile || !value) return;

    updateContent(activeFile.id, value);
    onContentChange?.(value);

    // Auto-save if enabled
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        saveFile(activeFile.id);
      }, settings.autoSaveDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [activeFile, updateContent, onContentChange, settings.autoSave, settings.autoSaveDelay, saveFile]);

  // Editor actions
  const handleSave = useCallback(async () => {
    if (!activeFile) return;
    
    try {
      await saveFile(activeFile.id);
      addNotification({
        type: 'success',
        message: `File "${activeFile.name}" saved successfully`,
        autoClose: true,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to save file: ${(error as Error).message}`,
      });
    }
  }, [activeFile, saveFile, addNotification]);

  const handleExecute = useCallback(async () => {
    if (!activeFile) return;

    try {
      await executeCode(activeFile.id);
      addNotification({
        type: 'success',
        message: 'Code executed successfully',
        autoClose: true,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Execution failed: ${(error as Error).message}`,
      });
    }
  }, [activeFile, executeCode, addNotification]);

  const handleValidate = useCallback(async () => {
    if (!activeFile) return;

    try {
      await validateCode(activeFile.id);
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Validation failed: ${(error as Error).message}`,
      });
    }
  }, [activeFile, validateCode, addNotification]);

  const handleAnalyze = useCallback(async () => {
    if (!activeFile) return;

    try {
      await analyzeWithAI(activeFile.id);
      addNotification({
        type: 'info',
        message: 'AI analysis completed',
        autoClose: true,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: `AI analysis failed: ${(error as Error).message}`,
      });
    }
  }, [activeFile, analyzeWithAI, addNotification]);

  const handleFormat = useCallback(async () => {
    if (!activeFile) return;

    try {
      await formatCode(activeFile.id);
      addNotification({
        type: 'success',
        message: 'Code formatted successfully',
        autoClose: true,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Formatting failed: ${(error as Error).message}`,
      });
    }
  }, [activeFile, formatCode, addNotification]);

  const handleDownload = useCallback(() => {
    if (!activeFile) return;

    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    log.user('File downloaded', { fileName: activeFile.name });
  }, [activeFile]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    
    // Trigger editor resize after fullscreen toggle
    setTimeout(() => {
      editorRef.current?.layout();
    }, 100);
  }, [isFullscreen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      editorRef.current?.layout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-validate on content change
  useEffect(() => {
    if (!activeFile || !settings.formatOnType) return;

    const timeoutId = setTimeout(() => {
      handleValidate();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [activeFile?.content, settings.formatOnType, handleValidate]);

  if (!activeFile || !language) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white">
        <div className="text-center">
          <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No File Selected</h3>
          <p className="text-slate-400 mb-4">Create or open a file to start coding</p>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''} ${className}`}>
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <Alert className={`
              ${notification.type === 'error' ? 'border-red-500 bg-red-500/10' : ''}
              ${notification.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' : ''}
              ${notification.type === 'success' ? 'border-green-500 bg-green-500/10' : ''}
              ${notification.type === 'info' ? 'border-blue-500 bg-blue-500/10' : ''}
            `}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                  {notification.type === 'success' && <Check className="w-4 h-4 text-green-500 mt-0.5" />}
                  {notification.type === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5" />}
                  <AlertDescription className="text-sm">
                    {notification.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-auto p-1 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          {/* File info */}
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">{activeFile.name}</span>
            {activeFile.isDirty && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {language.displayName}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={status.isSaving || !activeFile.isDirty}
                  className="h-8 px-2"
                >
                  {status.isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExecute}
                  disabled={status.isExecuting}
                  className="h-8 px-2"
                >
                  {status.isExecuting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run Code (Ctrl+Enter)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={status.isAnalyzing}
                  className="h-8 px-2"
                >
                  {status.isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Analysis</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFormat}
                  className="h-8 px-2"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Format Code (Ctrl+Shift+F)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 px-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download File</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* View toggles */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 px-2"
              >
                <Sidebar className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTerminal}
                className="h-8 px-2"
              >
                <Terminal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Terminal</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimap}
                className="h-8 px-2"
              >
                <Map className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Minimap</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 px-2"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 relative">
        <Editor
          height={height}
          width={width}
          language={language.monacoLanguage}
          value={activeFile.content}
          options={editorOptions}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme={settings.theme}
          loading={
            <div className="flex items-center justify-center h-full bg-slate-900 text-white">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-slate-400">Loading editor...</p>
              </div>
            </div>
          }
        />

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Line {activeFile.cursor.line}, Column {activeFile.cursor.column}</span>
              <span>{activeFile.content.length} characters</span>
              <span>{activeFile.content.split('\n').length} lines</span>
              <span>{language.displayName}</span>
              {activeFile.encoding && <span>{activeFile.encoding}</span>}
            </div>
            
            <div className="flex items-center space-x-4">
              {status.error && (
                <span className="text-red-400 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Error
                </span>
              )}
              {results.validationResult && !results.validationResult.isValid && (
                <span className="text-yellow-400 flex items-center">
                  <Bug className="w-3 h-3 mr-1" />
                  {results.validationResult.errors.length} errors
                </span>
              )}
              {status.isAnalyzing && (
                <span className="text-blue-400 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing...
                </span>
              )}
              {status.isSaving && (
                <span className="text-green-400 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results panel */}
      {(results.executionResult || results.aiAnalysis || results.validationResult) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-700 bg-slate-800"
        >
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-slate-700 rounded-none">
              {results.executionResult && (
                <TabsTrigger value="output" className="data-[state=active]:bg-slate-700">
                  Output
                </TabsTrigger>
              )}
              {results.validationResult && (
                <TabsTrigger value="problems" className="data-[state=active]:bg-slate-700">
                  Problems ({results.validationResult.errors.length + results.validationResult.warnings.length})
                </TabsTrigger>
              )}
              {results.aiAnalysis && (
                <TabsTrigger value="ai" className="data-[state=active]:bg-slate-700">
                  AI Analysis
                </TabsTrigger>
              )}
            </TabsList>

            {results.executionResult && (
              <TabsContent value="output" className="m-0 p-4">
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {results.executionResult.success ? (
                      <div className="text-green-400 text-sm">
                        ✓ Execution completed successfully
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm">
                        ✗ Execution failed
                      </div>
                    )}
                    
                    {results.executionResult.output && (
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900 p-3 rounded">
                        {results.executionResult.output}
                      </pre>
                    )}
                    
                    {results.executionResult.errors.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-red-400 text-sm font-medium">Errors:</div>
                        {results.executionResult.errors.map((error, index) => (
                          <div key={index} className="text-red-300 text-sm font-mono">
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-slate-500 mt-4">
                      Execution time: {results.executionResult.executionTime}ms | 
                      Memory: {Math.round(results.executionResult.memoryUsage / 1024)}KB
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {results.validationResult && (
              <TabsContent value="problems" className="m-0 p-4">
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {results.validationResult.errors.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-red-400 font-medium">{error.message}</div>
                          {error.line && (
                            <div className="text-slate-400 text-xs">Line {error.line}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {results.validationResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-yellow-400 font-medium">{warning.message}</div>
                          {warning.line && (
                            <div className="text-slate-400 text-xs">Line {warning.line}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {results.validationResult.isValid && (
                      <div className="text-green-400 text-sm">
                        ✓ No problems found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {results.aiAnalysis && (
              <TabsContent value="ai" className="m-0 p-4">
                <ScrollArea className="h-48">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-white">AI Analysis Results</div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(results.aiAnalysis.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    {results.aiAnalysis.analysis.explanation && (
                      <div className="text-sm text-slate-300">
                        {results.aiAnalysis.analysis.explanation}
                      </div>
                    )}
                    
                    {results.aiAnalysis.analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-blue-400 font-medium">{suggestion.message}</div>
                          {suggestion.line && (
                            <div className="text-slate-400 text-xs">Line {suggestion.line}</div>
                          )}
                          <Badge variant="secondary" className="text-xs mt-1">
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-xs text-slate-500">
                      Analysis completed in {results.aiAnalysis.processingTime}ms
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}

// Export with error boundary
export default withErrorBoundary(DynamicEditor, {
  fallback: (
    <div className="flex items-center justify-center h-full bg-slate-900 text-white">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h3 className="text-xl font-semibold mb-2">Editor Error</h3>
        <p className="text-slate-400 mb-4">Unable to load the code editor</p>
        <Button onClick={() => window.location.reload()}>
          Reload Editor
        </Button>
      </div>
    </div>
  ),
  onError: (error, errorInfo) => {
    log.error('DynamicEditor component error', error, 'EDITOR_ERROR');
    log.error('Error info', errorInfo, 'EDITOR_ERROR');
  }
});