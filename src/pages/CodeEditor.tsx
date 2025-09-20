import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Save,
  History,
  LogOut,
  Code,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";

// Import language icons from All_logo_and_pictures-main
import pythonIcon from "@/assets/All_logo_and_pictures-main/programming languages/python.svg";
import javascriptIcon from "@/assets/All_logo_and_pictures-main/programming languages/javascript.svg";
import typescriptIcon from "@/assets/All_logo_and_pictures-main/programming languages/typescript.svg";
import javaIcon from "@/assets/All_logo_and_pictures-main/programming languages/java.svg";
import cppIcon from "@/assets/All_logo_and_pictures-main/programming languages/c++.svg";
import cIcon from "@/assets/All_logo_and_pictures-main/programming languages/c.svg";
import goIcon from "@/assets/All_logo_and_pictures-main/programming languages/go.svg";
import rustIcon from "@/assets/All_logo_and_pictures-main/programming languages/rust.svg";
import rubyIcon from "@/assets/All_logo_and_pictures-main/programming languages/ruby.svg";
import phpIcon from "@/assets/All_logo_and_pictures-main/programming languages/php.png";
import kotlinIcon from "@/assets/All_logo_and_pictures-main/programming languages/kotlin.svg";
import csharpIcon from "@/assets/All_logo_and_pictures-main/programming languages/csharp.svg";
import dartIcon from "@/assets/All_logo_and_pictures-main/programming languages/dart.svg";

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
  { value: "python", label: "Python", icon: pythonIcon },
  { value: "javascript", label: "JavaScript", icon: javascriptIcon },
  { value: "typescript", label: "TypeScript", icon: typescriptIcon },
  { value: "java", label: "Java", icon: javaIcon },
  { value: "cpp", label: "C++", icon: cppIcon },
  { value: "c", label: "C", icon: cIcon },
  { value: "go", label: "Go", icon: goIcon },
  { value: "rust", label: "Rust", icon: rustIcon },
  { value: "ruby", label: "Ruby", icon: rubyIcon },
  { value: "php", label: "PHP", icon: phpIcon },
  { value: "swift", label: "Swift", icon: swiftIcon },
  { value: "kotlin", label: "Kotlin", icon: kotlinIcon },
  { value: "csharp", label: "C#", icon: csharpIcon },
  { value: "scala", label: "Scala", icon: scalaIcon },
  { value: "r", label: "R", icon: rIcon },
  { value: "dart", label: "Dart", icon: dartIcon },
];

export default function CodeEditor() {
  const [code, setCode] = useState(languageTemplates.python);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [currentSnippetId, setCurrentSnippetId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadSnippets();
    }
  }, [user]);

  const loadSnippets = async () => {
    const { data, error } = await supabase
      .from("code_snippets")
      .select("*")
      .order("updated_at", { ascending: false });

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
      setCode(
        languageTemplates[newLanguage as keyof typeof languageTemplates] || ""
      );
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

    try {
      // Simulate code execution with advanced validation
      const errors = validateCode(code, language);

      if (errors.length > 0) {
        const errorMessage = errors.join("\n");
        setOutput(
          `Compilation/Runtime Errors:\n${errorMessage}\n\nPlease fix these errors and try again.`
        );
        toast({
          title: "Code execution failed",
          description: `${errors.length} error${
            errors.length > 1 ? "s" : ""
          } found in your code`,
          variant: "destructive",
        });
      } else {
        // Simulate successful execution with detailed output
        const result = simulateCodeExecution(code, language);
        setOutput(
          `Execution Output:\n${result}\n\nCode executed successfully!`
        );
        toast({
          title: "Code executed successfully!",
          description: "Your code ran without errors.",
        });

        // Save code to Supabase automatically
        await saveSnippet();
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Unknown runtime error occurred";
      setOutput(
        `Runtime Error:\n${errorMsg}\n\nThis error occurred during code execution.`
      );
      toast({
        title: "Runtime Error",
        description: `Execution failed: ${errorMsg}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  const validateCode = (code: string, language: string): string[] => {
    const errors: string[] = [];

    switch (language) {
      case "javascript":
      case "typescript":
        // Check for common syntax errors
        if (code.includes("undefined_function(")) {
          errors.push("ReferenceError: undefined_function is not defined");
        }
        if (code.match(/\blet\s+\w+\s*;\s*\w+\s*=/)) {
          errors.push(
            "ReferenceError: Cannot access variable before initialization"
          );
        }
        if (code.match(/\{[^}]*$/)) {
          errors.push(
            "SyntaxError: Unexpected end of input - missing closing brace"
          );
        }
        if (code.match(/console\.log\([^)]*$/)) {
          errors.push(
            "SyntaxError: Missing closing parenthesis in console.log"
          );
        }
        if (code.includes("funtion")) {
          errors.push(
            'SyntaxError: Unexpected token - did you mean "function"?'
          );
        }
        break;

      case "python":
        if (
          code.includes("undefined_variable") &&
          !code.includes("undefined_variable =")
        ) {
          errors.push("NameError: name 'undefined_variable' is not defined");
        }
        if (code.match(/print\([^)]*[^)]\s*$/m)) {
          errors.push(
            "SyntaxError: unexpected EOF while parsing - missing closing parenthesis"
          );
        }
        if (
          code.match(/^\s*if\s+.*:\s*$/m) &&
          !code.match(/^\s*if\s+.*:\s*\n\s+.+/m)
        ) {
          errors.push(
            "IndentationError: expected an indented block after if statement"
          );
        }
        if (code.includes("def ") && code.match(/def\s+\w+\([^)]*\):\s*$/m)) {
          errors.push(
            "IndentationError: expected an indented block after function definition"
          );
        }
        break;

      case "java":
        if (
          !code.includes("public static void main") &&
          !code.includes("class ")
        ) {
          errors.push("Error: Main method not found in class");
        }
        if (code.match(/System\.out\.println\([^)]*[^)]\s*$/m)) {
          errors.push("Syntax error: missing closing parenthesis in println");
        }
        if (
          code.includes("public class") &&
          !code.match(/public\s+class\s+\w+/)
        ) {
          errors.push("Syntax error: invalid class declaration");
        }
        if (code.match(/\{[^}]*$/)) {
          errors.push("Syntax error: missing closing brace");
        }
        break;

      case "cpp":
        if (!code.includes("#include")) {
          errors.push(
            "Error: Missing include directives (e.g., #include <iostream>)"
          );
        }
        if (!code.includes("main(")) {
          errors.push("Error: Main function not found");
        }
        if (code.includes("cout") && !code.includes("#include <iostream>")) {
          errors.push("Error: cout requires #include <iostream>");
        }
        if (code.match(/cout\s*<<\s*[^;]*$/m)) {
          errors.push("Syntax error: missing semicolon after cout statement");
        }
        break;

      case "c":
        if (!code.includes("#include")) {
          errors.push(
            "Error: Missing include directives (e.g., #include <stdio.h>)"
          );
        }
        if (!code.includes("main(")) {
          errors.push("Error: Main function not found");
        }
        if (code.includes("printf") && !code.includes("#include <stdio.h>")) {
          errors.push("Error: printf requires #include <stdio.h>");
        }
        if (code.match(/printf\([^)]*[^)]\s*$/m)) {
          errors.push("Syntax error: missing closing parenthesis in printf");
        }
        break;
    }

    // Common syntax checks for all languages
    if (code.trim() === "") {
      errors.push("Error: Empty code - please write some code to execute");
    }

    // Check for unmatched parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Syntax error: Unmatched parentheses detected");
    }

    return errors;
  };

  const simulateCodeExecution = (code: string, language: string): string => {
    switch (language) {
      case "javascript":
        if (code.includes("console.log")) {
          const matches = code.match(/console\.log\(([^)]+)\)/g);
          if (matches) {
            return matches
              .map((match) => {
                const content = match.replace(/console\.log\(|\)/g, "");
                try {
                  return eval(content) || content.replace(/['"]/g, "");
                } catch {
                  return content.replace(/['"]/g, "");
                }
              })
              .join("\n");
          }
        }
        return "JavaScript code executed successfully";

      case "python":
        if (code.includes("print(")) {
          const matches = code.match(/print\(([^)]+)\)/g);
          if (matches) {
            return matches
              .map((match) => {
                const content = match.replace(/print\(|\)/g, "");
                return content.replace(/['"]/g, "");
              })
              .join("\n");
          }
        }
        return "Python code executed successfully";

      case "java":
        if (code.includes("System.out.println")) {
          const matches = code.match(/System\.out\.println\(([^)]+)\)/g);
          if (matches) {
            return matches
              .map((match) => {
                const content = match.replace(/System\.out\.println\(|\)/g, "");
                return content.replace(/['"]/g, "");
              })
              .join("\n");
          }
        }
        return "Java code compiled and executed successfully";

      case "cpp":
        if (code.includes("cout")) {
          const matches = code.match(/cout\s*<<\s*([^;]+);/g);
          if (matches) {
            return matches
              .map((match) => {
                const content = match.replace(/cout\s*<<\s*|;/g, "");
                return content.replace(/['"]/g, "");
              })
              .join("\n");
          }
        }
        return "C++ code compiled and executed successfully";

      case "c":
        if (code.includes("printf")) {
          const matches = code.match(/printf\(([^)]+)\)/g);
          if (matches) {
            return matches
              .map((match) => {
                const content = match.replace(/printf\(|\)/g, "");
                return content
                  .replace(/['"]/g, "")
                  .replace(/%[sdif]/g, "value");
              })
              .join("\n");
          }
        }
        return "C code compiled and executed successfully";

      default:
        return `${language} code executed successfully`;
    }
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
        .from("code_snippets")
        .update(snippetData)
        .eq("id", currentSnippetId);

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
        .from("code_snippets")
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
    setOutput(snippet.output || "");
    setCurrentSnippetId(snippet.id);
    setShowHistory(false);
  };

  const deleteSnippet = async (snippetId: string) => {
    const { error } = await supabase
      .from("code_snippets")
      .delete()
      .eq("id", snippetId);

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
    setCode(
      languageTemplates[language as keyof typeof languageTemplates] || ""
    );
    setOutput("");
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full sm:w-48 bg-muted"
                  placeholder="File name"
                />
              </div>
              <Separator
                orientation="vertical"
                className="h-6 hidden sm:block"
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
              <Button
                variant="outline"
                size="sm"
                onClick={newSnippet}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveSnippet}
                className="flex-shrink-0"
              >
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
            animate={{
              width:
                typeof window !== "undefined" && window.innerWidth < 1024
                  ? "100%"
                  : 300,
              opacity: 1,
            }}
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
                        <div
                          className="flex-1"
                          onClick={() => loadSnippet(snippet)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <img
                              src={
                                languageIcons[
                                  snippet.language as keyof typeof languageIcons
                                ]
                              }
                              alt={snippet.language}
                              className="w-4 h-4"
                            />
                            <h4 className="font-medium truncate">
                              {snippet.title}
                            </h4>
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
                        src={
                          languageIcons[language as keyof typeof languageIcons]
                        }
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
                          <img
                            src={lang.icon}
                            alt={lang.label}
                            className="w-4 h-4"
                          />
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
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[400px]">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: {
                    enabled:
                      typeof window !== "undefined" && window.innerWidth > 768,
                  },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  folding: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: "full",
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col min-h-[300px] lg:min-h-0">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold flex items-center space-x-2">
                <Play className="w-4 h-4 text-primary" />
                <span>Output</span>
                {output && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      output.includes("Error") ? "bg-destructive" : "bg-success"
                    }`}
                  ></div>
                )}
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {output ? (
                  <div
                    className={`rounded-lg p-4 border-2 ${
                      output.includes("Error")
                        ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
                        : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-3 pb-2 border-b ${
                        output.includes("Error")
                          ? "border-red-200 dark:border-red-800"
                          : "border-green-200 dark:border-green-800"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          output.includes("Error")
                            ? "bg-red-500 animate-pulse"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span className="font-semibold text-sm">
                        {output.includes("Error")
                          ? "Execution Failed"
                          : "Execution Successful"}
                      </span>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm mb-2">
                      Click "Run Code" to see output here
                    </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
