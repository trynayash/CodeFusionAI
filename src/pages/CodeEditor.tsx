import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Save, History, LogOut, Code, Trash2, Plus, X } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTerminal } from '@/hooks/use-terminal';
import { Header } from '@/components/ui/header';
import { Terminal } from '@/components/ui/terminal';
import { ApiTester } from '@/components/ui/api-tester';
import { executionService } from '@/services/ExecutionService';

// Import language icons
import pythonIcon from '@/assets/languages/python.svg';
import javascriptIcon from '@/assets/languages/javascript.svg';
import typescriptIcon from '@/assets/languages/typescript.svg';
import javaIcon from '@/assets/languages/java.svg';
import cppIcon from '@/assets/languages/cpp.svg';
import cIcon from '@/assets/languages/c.svg';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  output: string | null;
  created_at: string;
  updated_at: string;
}

const languageTemplates = {
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  typescript: 'console.log("Hello, World!");',
};

const languageIcons = {
  python: pythonIcon,
  javascript: javascriptIcon,
  typescript: typescriptIcon,
  java: javaIcon,
  cpp: cppIcon,
  c: cIcon,
};

const languages = [
  { value: 'python', label: 'Python', icon: pythonIcon },
  { value: 'javascript', label: 'JavaScript', icon: javascriptIcon },
  { value: 'typescript', label: 'TypeScript', icon: typescriptIcon },
  { value: 'java', label: 'Java', icon: javaIcon },
  { value: 'cpp', label: 'C++', icon: cppIcon },
  { value: 'c', label: 'C', icon: cIcon },
];

export default function CodeEditor() {
  const [code, setCode] = useState(languageTemplates.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [title, setTitle] = useState('Untitled');
  const [currentSnippetId, setCurrentSnippetId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [detectedEndpoints, setDetectedEndpoints] = useState<string[]>([]);
  const [serverPort, setServerPort] = useState(3000);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const terminal = useTerminal();

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

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (!currentSnippetId) {
      setCode(languageTemplates[newLanguage as keyof typeof languageTemplates] || '');
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to run",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    terminal.setRunning(true);
    terminal.clearLines();
    terminal.addLine('🚀 Starting code execution...', 'info');
    
    try {
      // Use the ExecutionService for proper code execution
      terminal.addLine(`📝 Executing ${language} code...`, 'info');
      const result = await executionService.executeCode(code, language);
      
      if (result.success) {
        setOutput(result.output);
        terminal.addLine(`✅ Execution completed in ${result.executionTime}ms`, 'success');
        terminal.addLine(result.output, 'output');
        
        // Handle different output types
        if (result.hasWebOutput) {
          terminal.addLine('🌐 Web application detected - redirecting to preview...', 'info');
          setTimeout(() => {
            navigate('/output');
          }, 1500);
        }
        
        if (result.hasApiEndpoints) {
          terminal.addLine(`🔗 API endpoints detected on port ${result.serverPort}`, 'info');
          setDetectedEndpoints(['API endpoints detected']);
          setServerPort(result.serverPort || 3000);
          setActiveTab('api');
        }
        
        if (result.warnings && result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            terminal.addLine(`⚠️ ${warning}`, 'warning');
          });
        }
        
        toast({
          title: "Code executed successfully!",
          description: "Your code ran without errors.",
        });
        
        // Save code to Supabase automatically
        await saveSnippet();
      } else {
        setOutput(result.error || 'Execution failed');
        terminal.addLine(`❌ Execution failed: ${result.error}`, 'error');
        toast({
          title: "Code execution failed",
          description: result.error || 'Unknown error occurred',
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown runtime error occurred';
      setOutput(`Runtime Error: ${errorMsg}`);
      terminal.addLine(`❌ Runtime Error: ${errorMsg}`, 'error');
      toast({
        title: "Runtime Error",
        description: `Execution failed: ${errorMsg}`,
        variant: "destructive",
      });
    }
    
    setIsRunning(false);
    terminal.setRunning(false);
  };

  // Remove the old validation functions since we now use ExecutionService
  // The validateCode and simulateCodeExecution functions are no longer needed

  const saveSnippet = async () => {
    if (!user) return;

    const snippetData = {
      user_id: user.id,
      title,
      language,
      code,
      output,
    };

    if (currentSnippetId) {
      // Update existing snippet
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
          description: "Your code snippet has been updated successfully.",
        });
        loadSnippets();
      }
    } else {
      // Create new snippet
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
          description: "Your code snippet has been saved successfully.",
        });
        loadSnippets();
      }
    }
  };

  const loadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
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
        description: "Code snippet has been deleted successfully.",
      });
      loadSnippets();
      
      if (currentSnippetId === snippetId) {
        newSnippet();
      }
    }
  };

  const newSnippet = () => {
    setTitle('Untitled');
    setCode(languageTemplates[language as keyof typeof languageTemplates] || '');
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Editor Toolbar */}
      <div className="pt-16 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground hidden sm:inline">Code Editor</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full sm:w-48 bg-muted"
                placeholder="Snippet title"
              />
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex-shrink-0"
              >
                <History className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button variant="outline" size="sm" onClick={newSnippet} className="flex-shrink-0">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button variant="outline" size="sm" onClick={saveSnippet} className="flex-shrink-0">
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)]">
        {/* Sidebar - History */}
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: window.innerWidth < 1024 ? "100%" : 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-r border-border bg-card overflow-hidden lg:max-w-[300px] w-full lg:w-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Code History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {snippets.map((snippet) => (
                    <Card
                      key={snippet.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1" onClick={() => loadSnippet(snippet)}>
                          <div className="flex items-center space-x-2 mb-1">
                            <img 
                              src={languageIcons[snippet.language as keyof typeof languageIcons]} 
                              alt={snippet.language}
                              className="w-4 h-4"
                            />
                            <h4 className="font-medium truncate">{snippet.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">
                            {snippet.language}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(snippet.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSnippet(snippet.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Editor Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border bg-card gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={languageIcons[language as keyof typeof languageIcons]} 
                        alt={language}
                        className="w-4 h-4"
                      />
                      <SelectValue placeholder="Select language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center space-x-2">
                          <img src={lang.icon} alt={lang.label} className="w-4 h-4" />
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={runCode} 
                disabled={isRunning} 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[400px]">
              <Editor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: window.innerWidth > 768 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: 'full',
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col min-h-[300px] lg:min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                  <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
                  <TabsTrigger value="api" className="text-xs">API</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="output" className="flex-1 m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    {output ? (
                      <div className={`rounded-lg p-4 border ${
                        output.includes('Error') 
                          ? 'bg-destructive/10 border-destructive/20 text-destructive-foreground' 
                          : 'bg-success/10 border-success/20 text-foreground'
                      }`}>
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {output}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm mb-2">Click "Run Code" to see output here</p>
                        <div className="text-xs space-y-1 max-w-xs mx-auto">
                          <p>Tips:</p>
                          <p>• Write valid syntax for your selected language</p>
                          <p>• Check for missing imports or includes</p>
                          <p>• Ensure proper indentation (Python)</p>
                          <p>• Close all parentheses and braces</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="terminal" className="flex-1 m-0 p-4">
                <Terminal
                  lines={terminal.lines}
                  isRunning={terminal.isRunning}
                  onClear={terminal.clearLines}
                  className="h-full border-0"
                />
              </TabsContent>
              
              <TabsContent value="api" className="flex-1 m-0 p-4">
                <ApiTester
                  serverPort={serverPort}
                  detectedEndpoints={detectedEndpoints}
                  className="h-full border-0"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}