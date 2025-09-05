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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/header';

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
  const { user, signOut, loading } = useAuth();
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
    setIsRunning(true);
    // Simulate code execution (in a real implementation, you'd send to a backend service)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let simulatedOutput = '';
    
    if (language === 'python' && code.includes('print')) {
      simulatedOutput = 'Hello, World!\n';
    } else if ((language === 'javascript' || language === 'typescript') && code.includes('console.log')) {
      simulatedOutput = 'Hello, World!\n';
    } else if (language === 'java' && code.includes('System.out.println')) {
      simulatedOutput = 'Hello, World!\n';
    } else if ((language === 'c' || language === 'cpp') && (code.includes('printf') || code.includes('cout'))) {
      simulatedOutput = 'Hello, World!\n';
    } else {
      simulatedOutput = 'Code executed successfully!\n';
    }
    
    setOutput(simulatedOutput);
    setIsRunning(false);

    toast({
      title: "Code executed",
      description: "Your code has been executed successfully.",
    });
  };

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
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold flex items-center">
                <Play className="w-4 h-4 mr-2 text-primary" />
                Output
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {output ? (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Run Code" to see output here</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}