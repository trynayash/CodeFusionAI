import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Save, History, LogOut, Code, Trash2, Plus } from 'lucide-react';
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

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">CodeFusion AI</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-48 bg-muted"
              placeholder="Snippet title"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={newSnippet}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button variant="outline" size="sm" onClick={saveSnippet}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - History */}
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-r border-border bg-card overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Code History</h3>
              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-2">
                  {snippets.map((snippet) => (
                    <Card
                      key={snippet.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1" onClick={() => loadSnippet(snippet)}>
                          <h4 className="font-medium truncate">{snippet.title}</h4>
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
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Controls */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center space-x-4">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={runCode} disabled={isRunning} className="bg-primary hover:bg-primary-dark">
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-1/3 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Output</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {output || 'Click "Run Code" to see output here...'}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}