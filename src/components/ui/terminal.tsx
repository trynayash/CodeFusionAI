import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { TerminalLine } from '@/hooks/use-terminal';
import { cn } from '@/lib/utils';

interface TerminalProps {
  lines: TerminalLine[];
  isRunning?: boolean;
  onClear?: () => void;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  isRunning = false,
  onClear,
  className
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const copyToClipboard = () => {
    const content = lines.map(line => 
      `[${line.timestamp.toLocaleTimeString()}] ${line.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(content);
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'output':
        return 'text-gray-300';
      default:
        return 'text-gray-300';
    }
  };

  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'info':
        return '🔵';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'output':
        return '▶️';
      default:
        return '▶️';
    }
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4" />
            <CardTitle className="text-sm">Terminal</CardTitle>
            {isRunning && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Running</span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={scrollRef}
          className="h-64 overflow-auto bg-gray-900 font-mono text-sm p-4 space-y-1"
        >
          {lines.length === 0 ? (
            <div className="text-gray-500 italic">
              No output yet. Run some code to see results here.
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="flex items-start gap-2">
                <span className="text-xs text-gray-500 min-w-[60px]">
                  {line.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-xs">{getLinePrefix(line.type)}</span>
                <pre className={cn('whitespace-pre-wrap flex-1', getLineColor(line.type))}>
                  {line.content}
                </pre>
              </div>
            ))
          )}
          {isRunning && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full" />
              <span className="text-xs">Executing...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};