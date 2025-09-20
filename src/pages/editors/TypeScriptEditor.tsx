import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Save, History, LogOut, Code, Trash2, Plus, X, Terminal as TerminalIcon, 
  ExternalLink, Eye, Settings, FileText, Server, Smartphone, Monitor,
  Zap, Clock, AlertTriangle, CheckCircle, Moon, Sun, Palette, Copy
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/header';
import { Terminal, useTerminal } from '@/components/ui/terminal';
import { ApiTester } from '@/components/ui/api-tester';
import { executionService, ExecutionResult } from '@/services/ExecutionService';
import { useTheme } from '@/components/theme-provider';

// Import TypeScript icon
import typescriptIcon from '@/assets/All_logo_and_pictures-main/programming languages/typescript.svg';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  output: string | null;
  created_at: string;
  updated_at: string;
}

const typescriptTemplate = `// TypeScript Online Compiler - CodeFusion AI
console.log("Hello, TypeScript World!");

// Type Definitions
interface Student {
    name: string;
    age: number;
    courses: string[];
    isActive: boolean;
}

interface Course {
    id: number;
    title: string;
    instructor: string;
    duration: number;
}

// Variables with Types
const appName: string = "CodeFusion AI";
const version: number = 2024;
const isAwesome: boolean = true;

console.log(\`Welcome to \${appName} - Version \${version}\`);
console.log(\`Is it awesome? \${isAwesome}\`);

// Arrays with Types
const languages: string[] = ["TypeScript", "JavaScript", "Python", "Java", "C++"];
console.log("\\nSupported Languages:");
languages.forEach((lang: string, index: number) => {
    console.log(\`\${index + 1}. \${lang}\`);
});

// Functions with Type Annotations
function calculateFactorial(n: number): number {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Generic Functions
function getFirstElement<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[0] : undefined;
}

// Calculate factorial
const number: number = 5;
const result: number = calculateFactorial(number);
console.log(\`\\nFactorial of \${number} is: \${result}\`);

// Object with Interface
const student: Student = {
    name: "Alice",
    age: 20,
    courses: ["TypeScript", "React", "Node.js"],
    isActive: true
};

console.log("\\nStudent Info:");
console.log(\`Name: \${student.name}\`);
console.log(\`Age: \${student.age}\`);
console.log(\`Courses: \${student.courses.join(", ")}\`);
console.log(\`Active: \${student.isActive}\`);

// Class with TypeScript Features
class CourseManager {
    private courses: Course[] = [];

    addCourse(course: Course): void {
        this.courses.push(course);
        console.log(\`Added course: \${course.title}\`);
    }

    getCourseById(id: number): Course | undefined {
        return this.courses.find(course => course.id === id);
    }

    getAllCourses(): Course[] {
        return [...this.courses];
    }

    getTotalDuration(): number {
        return this.courses.reduce((total, course) => total + course.duration, 0);
    }
}

// Using the Class
const courseManager = new CourseManager();

courseManager.addCourse({
    id: 1,
    title: "TypeScript Fundamentals",
    instructor: "John Doe",
    duration: 40
});

courseManager.addCourse({
    id: 2,
    title: "Advanced TypeScript",
    instructor: "Jane Smith",
    duration: 60
});

console.log(\`\\nTotal course duration: \${courseManager.getTotalDuration()} hours\`);

// Union Types and Type Guards
type Status = "pending" | "approved" | "rejected";

function processStatus(status: Status): string {
    switch (status) {
        case "pending":
            return "Application is being reviewed";
        case "approved":
            return "Application has been approved";
        case "rejected":
            return "Application has been rejected";
        default:
            return "Unknown status";
    }
}

const currentStatus: Status = "approved";
console.log(\`\\nStatus: \${processStatus(currentStatus)}\`);

// Optional and Default Parameters
function greetUser(name: string, greeting: string = "Hello", punctuation: string = "!"): string {
    return \`\${greeting}, \${name}\${punctuation}\`;
}

console.log(greetUser("TypeScript Developer"));
console.log(greetUser("Coder", "Hi", "!!!"));`;

export default function TypeScriptEditor() {
  const [code, setCode] = useState(typescriptTemplate);
  const [output, setOutput] = useState('');
  const [title, setTitle] = useState('TypeScript Project');
  const [currentSnippetId, setCurrentSnippetId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'terminal' | 'api'>('output');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [detectedEndpoints, setDetectedEndpoints] = useState<Array<{method: string, path: string, description?: string}>>([]);
  
  // Terminal hook
  const terminal = useTerminal();
  
  const { user, signOut, loading } = useAuth();
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadSnippets();
    }
  }, [user]);

  const loadSnippets = async () => {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('language', 'typescript')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading snippets",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSnippets(data || []);
    }
  };

  const saveSnippet = async () => {
    if (!user) return;

    const snippetData = {
      user_id: user.id,
      title,
      language: 'typescript',
      code,
      output,
    };

    if (currentSnippetId) {
      const { error } = await supabase
        .from('code_snippets')
        .update(snippetData)
        .eq('id', currentSnippetId);

      if (error) {
        toast({
          title: "Error saving snippet",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Snippet updated",
          description: "Your TypeScript code has been updated successfully.",
        });
        loadSnippets();
      }
    } else {
      const { data, error } = await supabase
        .from('code_snippets')
        .insert(snippetData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error saving snippet",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCurrentSnippetId(data.id);
        toast({
          title: "Snippet saved",
          description: "Your TypeScript code has been saved successfully.",
        });
        loadSnippets();
      }
    }
  };

  const runCode = useCallback(async () => {
    if (!code.trim()) {
      toast({
        title: "No code to run",
        description: "Please write some TypeScript code first.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    terminal.setRunning(true);
    terminal.clearLines();
    
    terminal.addLine(`🔷 Starting TypeScript compilation and execution...`, 'info');
    terminal.addLine(`📝 Code length: ${code.length} characters`, 'info');
    
    try {
      const result = await executionService.executeCode(code, 'typescript', {
        timeout: 12000, // TypeScript needs time for compilation
        maxMemory: 256,
        allowNetworkAccess: false,
        allowFileSystem: false
      });

      setExecutionResult(result);
      
      if (result.success) {
        terminal.addLine(`✅ TypeScript compilation and execution completed successfully`, 'success');
        terminal.addLine(`⏱️ Execution time: ${result.executionTime}ms`, 'info');
        
        if (result.warnings && result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            terminal.addLine(`⚠️ Warning: ${warning}`, 'warning');
          });
        }
        
        if (result.output) {
          terminal.addLine('📤 Output:', 'info');
          result.output.split('\n').forEach(line => {
            if (line.trim()) {
              terminal.addLine(line, 'output');
            }
          });
        }
        
        setOutput(`TypeScript Output:\n${result.output}\n\nCode compiled and executed successfully in ${result.executionTime}ms!`);
        setActiveTab('terminal');
        
        toast({
          title: "TypeScript code executed successfully!",
          description: `Compiled and executed in ${result.executionTime}ms`,
        });
        
        await saveSnippet();
        
      } else {
        terminal.addLine(`❌ TypeScript compilation/execution failed`, 'error');
        terminal.addLine(`💥 Error: ${result.error}`, 'error');
        
        setOutput(`TypeScript Error:\n${result.error}\n\nExecution time: ${result.executionTime}ms`);
        setActiveTab('terminal');
        
        toast({
          title: "TypeScript execution failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown runtime error occurred';
      
      terminal.addLine(`💥 Runtime Error: ${errorMsg}`, 'error');
      setOutput(`Runtime Error:\n${errorMsg}\n\nThis error occurred during TypeScript execution.`);
      setActiveTab('terminal');
      
      toast({
        title: "Runtime Error",
        description: `TypeScript execution failed: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      terminal.setRunning(false);
      terminal.addLine(`🏁 TypeScript execution finished`, 'info');
    }
  }, [code, terminal, toast, saveSnippet]);

  const loadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setTitle(snippet.title);
    setOutput(snippet.output || '');
    setCurrentSnippetId(snippet.id);
    setShowHistory(false);
  };

  const deleteSnippet = async (snippetId: string) => {
    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', snippetId);

    if (error) {
      toast({
        title: "Error deleting snippet",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Snippet deleted",
        description: "TypeScript code snippet has been deleted successfully.",
      });
      loadSnippets();
      
      if (currentSnippetId === snippetId) {
        newSnippet();
      }
    }
  };

  const newSnippet = () => {
    setTitle('TypeScript Project');
    setCode(typescriptTemplate);
    setOutput('');
    setCurrentSnippetId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      {/* TypeScript Editor Toolbar */}
      <div className="pt-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4 flex-wrap gap-2 min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
                  <img src={typescriptIcon} alt="TypeScript" className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    TypeScript Editor
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Professional TypeScript IDE</p>
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-8 hidden lg:block" />
              
              <div className="flex-1 max-w-md">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  placeholder="Enter TypeScript project name..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
              >
                <History className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={newSnippet}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveSnippet}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row h-[calc(100vh-140px)]">
        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ 
                width: typeof window !== 'undefined' && window.innerWidth < 1280 ? "100%" : 320, 
                opacity: 1, 
                x: 0 
              }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl xl:max-w-[320px] w-full xl:w-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">TypeScript History</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your saved TypeScript projects</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="xl:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="space-y-3">
                    {snippets.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <img src={typescriptIcon} alt="TypeScript" className="w-8 h-8" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">No saved TypeScript projects yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start coding to see your history</p>
                      </div>
                    ) : (
                      snippets.map((snippet) => (
                        <motion.div
                          key={snippet.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="p-4 cursor-pointer bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0" onClick={() => loadSnippet(snippet)}>
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img src={typescriptIcon} alt="TypeScript" className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{snippet.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">TypeScript</p>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                  {new Date(snippet.updated_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSnippet(snippet.id);
                                }}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col xl:flex-row min-w-0">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                  <img src={typescriptIcon} alt="TypeScript" className="w-5 h-5" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">TypeScript 5.0</span>
                </div>
              </div>

              <Button 
                onClick={runCode} 
                disabled={isRunning} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Compiling TypeScript...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Compile & Run TypeScript
                  </>
                )}
              </Button>
            </div>

            <div className="flex-1 min-h-[400px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden shadow-2xl">
                <Editor
                  height="100%"
                  language="typescript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme={actualTheme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    minimap: { enabled: typeof window !== 'undefined' && window.innerWidth > 1024 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    autoIndent: 'full',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: 'all',
                    bracketPairColorization: { enabled: true },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-full xl:w-2/5 border-t xl:border-t-0 xl:border-l border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex flex-col min-h-[300px] xl:min-h-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <TabsTrigger 
                    value="output" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Output</span>
                    {output && (
                      <div className={`w-2 h-2 rounded-full ${
                        output.includes('Error') ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="terminal" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <TerminalIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Terminal</span>
                    {terminal.lines.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {terminal.lines.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="output" className="flex-1 m-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    {output ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl p-6 border-2 shadow-lg ${
                          output.includes('Error') 
                            ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100' 
                            : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
                        }`}>
                        <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${
                          output.includes('Error') 
                            ? 'border-red-200 dark:border-red-800' 
                            : 'border-green-200 dark:border-green-800'
                        }`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            output.includes('Error') 
                              ? 'bg-red-500 animate-pulse' 
                              : 'bg-green-500'
                          }`}>
                            {output.includes('Error') ? (
                              <X className="w-2 h-2 text-white" />
                            ) : (
                              <CheckCircle className="w-2 h-2 text-white" />
                            )}
                          </div>
                          <span className="font-bold text-sm">
                            {output.includes('Error') ? 'TypeScript Compilation/Execution Failed' : 'TypeScript Compilation/Execution Successful'}
                          </span>
                          {executionResult && (
                            <Badge variant="outline" className="text-xs font-mono">
                              {executionResult.executionTime}ms
                            </Badge>
                          )}
                        </div>
                        <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed bg-black/5 dark:bg-white/5 rounded-lg p-4">
                          {output}
                        </pre>
                        
                        <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-current/20">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(output)}
                            className="border-current/20 hover:bg-current/10 transition-all duration-200"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <img src={typescriptIcon} alt="TypeScript" className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Ready to Compile TypeScript</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Click "Compile & Run TypeScript" to see your output here</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 max-w-sm mx-auto">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">🔷 TypeScript Tips:</p>
                          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 text-left">
                            <p>• Use type annotations for better code</p>
                            <p>• Define interfaces for objects</p>
                            <p>• Leverage generics for reusability</p>
                            <p>• Use union types when appropriate</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="terminal" className="flex-1 m-0">
                <Terminal
                  lines={terminal.lines}
                  onClear={terminal.clearLines}
                  isRunning={terminal.isRunning}
                  className="h-full border-0 rounded-none bg-transparent"
                  maxHeight="100%"
                  showTimestamps={true}
                  title="TypeScript Terminal"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}