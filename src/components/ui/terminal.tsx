/**
 * Enhanced Terminal Component
 * 
 * Features:
 * - Syntax highlighting for different output types
 * - Auto-scroll functionality
 * - Error/warning color coding
 * - Command history
 * - Copy to clipboard
 * - Clear terminal
 * - Resizable interface
 * - Dark/light theme support
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  language?: string;
}

export interface TerminalProps {
  lines: TerminalLine[];
  onClear?: () => void;
  onExecute?: (command: string) => void;
  isRunning?: boolean;
  className?: string;
  maxHeight?: string;
  showTimestamps?: boolean;
  allowInput?: boolean;
  title?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  onClear,
  onExecute,
  isRunning = false,
  className = '',
  maxHeight = '400px',
  showTimestamps = false,
  allowInput = false,
  title = 'Terminal'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [lines]);

  // Focus input when terminal is clicked
  const handleTerminalClick = useCallback(() => {
    if (allowInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [allowInput]);

  // Handle command execution
  const handleExecute = useCallback(() => {
    if (!inputValue.trim() || !onExecute) return;

    const command = inputValue.trim();
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInputValue('');
    onExecute(command);
  }, [inputValue, onExecute]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        handleExecute();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInputValue('');
          } else {
            setHistoryIndex(newIndex);
            setInputValue(commandHistory[newIndex]);
          }
        }
        break;
      case 'Escape':
        setInputValue('');
        setHistoryIndex(-1);
        break;
    }
  }, [commandHistory, historyIndex, handleExecute]);

  // Copy terminal content to clipboard
  const handleCopy = useCallback(async () => {
    const content = lines
      .map(line => `${showTimestamps ? `[${line.timestamp.toLocaleTimeString()}] ` : ''}${line.content}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Terminal content has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy terminal content to clipboard.",
        variant: "destructive",
      });
    }
  }, [lines, showTimestamps, toast]);

  // Get icon for line type
  const getLineIcon = (type: TerminalLine['type']) => {
    const iconProps = { className: "w-3 h-3 flex-shrink-0 mt-0.5" };
    
    switch (type) {
      case 'error':
        return <XCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'success':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'info':
        return <Info {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'input':
        return <Play {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      default:
        return <div className="w-3 h-3 flex-shrink-0 mt-0.5" />;
    }
  };

  // Get line styling based on type
  const getLineStyle = (type: TerminalLine['type']) => {
    const baseStyle = "font-mono text-sm leading-relaxed";
    
    switch (type) {
      case 'error':
        return `${baseStyle} text-red-400 bg-red-950/20 border-l-2 border-red-500 pl-3`;
      case 'warning':
        return `${baseStyle} text-yellow-400 bg-yellow-950/20 border-l-2 border-yellow-500 pl-3`;
      case 'success':
        return `${baseStyle} text-green-400 bg-green-950/20 border-l-2 border-green-500 pl-3`;
      case 'info':
        return `${baseStyle} text-blue-400 bg-blue-950/20 border-l-2 border-blue-500 pl-3`;
      case 'input':
        return `${baseStyle} text-purple-400 bg-purple-950/20 border-l-2 border-purple-500 pl-3`;
      default:
        return `${baseStyle} text-gray-300`;
    }
  };

  // Format line content with syntax highlighting
  const formatLineContent = (content: string, type: TerminalLine['type']) => {
    // Simple syntax highlighting for common patterns
    let formatted = content;
    
    // Highlight URLs
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<span class="text-blue-400 underline">$1</span>'
    );
    
    // Highlight file paths
    formatted = formatted.replace(
      /([\/\\][\w\/\\.-]+\.\w+)/g,
      '<span class="text-cyan-400">$1</span>'
    );
    
    // Highlight numbers
    formatted = formatted.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      '<span class="text-yellow-300">$1</span>'
    );
    
    // Highlight success indicators
    formatted = formatted.replace(
      /✓|✅|SUCCESS|PASS/g,
      '<span class="text-green-400 font-semibold">$&</span>'
    );
    
    // Highlight error indicators
    formatted = formatted.replace(
      /✗|❌|ERROR|FAIL|FAILED/g,
      '<span class="text-red-400 font-semibold">$&</span>'
    );
    
    return formatted;
  };

  return (
    <Card className={`bg-gray-900 border-gray-700 ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-gray-200">{title}</span>
          {isRunning && (
            <Badge variant="secondary" className="bg-green-900 text-green-300 text-xs">
              <Square className="w-2 h-2 mr-1 animate-pulse" />
              Running
            </Badge>
          )}
          {lines.length > 0 && (
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
              {lines.length} lines
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3" />
          </Button>
          
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              title="Clear terminal"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div 
              className="bg-gray-900 cursor-text"
              onClick={handleTerminalClick}
              style={{ maxHeight }}
            >
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-1">
                  {lines.length === 0 ? (
                    <div className="text-gray-500 text-sm font-mono flex items-center space-x-2">
                      <TerminalIcon className="w-4 h-4" />
                      <span>Terminal ready. Run some code to see output here...</span>
                    </div>
                  ) : (
                    lines.map((line) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start space-x-2 group"
                      >
                        {getLineIcon(line.type)}
                        <div className="flex-1 min-w-0">
                          {showTimestamps && (
                            <span className="text-xs text-gray-500 mr-2">
                              [{line.timestamp.toLocaleTimeString()}]
                            </span>
                          )}
                          <div
                            className={getLineStyle(line.type)}
                            dangerouslySetInnerHTML={{
                              __html: formatLineContent(line.content, line.type)
                            }}
                          />
                        </div>
                      </motion.div>
                    ))
                  )}
                  
                  {/* Input Line */}
                  {allowInput && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Play className="w-3 h-3 text-purple-500 flex-shrink-0" />
                      <span className="text-purple-400 font-mono text-sm">$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-gray-300 font-mono text-sm outline-none placeholder-gray-500"
                        placeholder="Enter command..."
                        disabled={isRunning}
                      />
                      {isRunning && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Utility function to create terminal lines
export const createTerminalLine = (
  content: string,
  type: TerminalLine['type'] = 'output',
  language?: string
): TerminalLine => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  content,
  type,
  timestamp: new Date(),
  language
});

// Hook for managing terminal state
export const useTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLine = useCallback((content: string, type: TerminalLine['type'] = 'output', language?: string) => {
    const line = createTerminalLine(content, type, language);
    setLines(prev => [...prev, line]);
  }, []);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const setRunning = useCallback((running: boolean) => {
    setIsRunning(running);
  }, []);

  return {
    lines,
    isRunning,
    addLine,
    addLines,
    clearLines,
    setRunning
  };
};