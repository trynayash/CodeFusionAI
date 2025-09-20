import { useState, useCallback } from 'react';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'output';
  timestamp: Date;
}

export const useTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLine = useCallback((content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      content,
      type,
      timestamp: new Date()
    };
    
    setLines(prev => [...prev, newLine]);
  }, []);

  const addLines = useCallback((newLines: Omit<TerminalLine, 'id' | 'timestamp'>[]) => {
    const linesWithMeta = newLines.map(line => ({
      ...line,
      id: Date.now().toString() + Math.random(),
      timestamp: new Date()
    }));
    
    setLines(prev => [...prev, ...linesWithMeta]);
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