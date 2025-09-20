/**
 * Structured Logging Utility
 * Replaces all console.log statements with proper logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  context?: string;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxEntries: number;
  enableStorage: boolean;
}

class LoggerService {
  private config: LoggerConfig;
  private entries: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: process.env.NODE_ENV === 'development',
      enableRemote: process.env.NODE_ENV === 'production',
      maxEntries: 1000,
      enableStorage: true,
      ...config,
    };
    
    this.sessionId = this.generateSessionId();
    this.loadStoredEntries();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredEntries(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('codefusion_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.entries = Array.isArray(parsed) ? parsed.slice(-100) : []; // Keep last 100 entries
      }
    } catch (error) {
      // Ignore storage errors
    }
  }

  private saveToStorage(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') return;
    
    try {
      const toStore = this.entries.slice(-100); // Keep last 100 entries
      localStorage.setItem('codefusion_logs', JSON.stringify(toStore));
    } catch (error) {
      // Ignore storage errors
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      context,
    };

    // Add stack trace for errors
    if (level === LogLevel.ERROR && data instanceof Error) {
      entry.stack = data.stack;
    }

    // Add user ID if available
    if (typeof window !== 'undefined' && (window as any).currentUserId) {
      entry.userId = (window as any).currentUserId;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    return `${timestamp} ${levelName} ${context} ${entry.message}`;
  }

  private outputToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const message = this.formatConsoleMessage(entry);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.data);
        break;
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail remote logging to avoid infinite loops
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data, context);
    
    // Add to entries
    this.entries.push(entry);
    
    // Trim entries if needed
    if (this.entries.length > this.config.maxEntries) {
      this.entries = this.entries.slice(-this.config.maxEntries);
    }

    // Output to console
    this.outputToConsole(entry);

    // Save to storage
    this.saveToStorage();

    // Send to remote (async, don't wait)
    this.sendToRemote(entry).catch(() => {
      // Ignore remote logging errors
    });
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, error?: Error | unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  // Specialized logging methods
  apiCall(method: string, url: string, data?: unknown): void {
    this.info(`API ${method} ${url}`, data, 'API');
  }

  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, `API ${method} ${url} - ${status}`, data, 'API');
  }

  userAction(action: string, data?: unknown): void {
    this.info(`User action: ${action}`, data, 'USER');
  }

  performance(operation: string, duration: number, data?: unknown): void {
    this.info(`Performance: ${operation} took ${duration}ms`, data, 'PERF');
  }

  security(event: string, data?: unknown): void {
    this.warn(`Security event: ${event}`, data, 'SECURITY');
  }

  // Utility methods
  getEntries(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.entries;
    
    if (level !== undefined) {
      filtered = filtered.filter(entry => entry.level >= level);
    }
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    
    return filtered;
  }

  clearEntries(): void {
    this.entries = [];
    if (this.config.enableStorage && typeof window !== 'undefined') {
      localStorage.removeItem('codefusion_logs');
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      (window as any).currentUserId = userId;
    }
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create singleton instance
export const Logger = new LoggerService();

// Export convenience methods for easier migration from console.log
export const log = {
  debug: (message: string, data?: unknown, context?: string) => Logger.debug(message, data, context),
  info: (message: string, data?: unknown, context?: string) => Logger.info(message, data, context),
  warn: (message: string, data?: unknown, context?: string) => Logger.warn(message, data, context),
  error: (message: string, error?: Error | unknown, context?: string) => Logger.error(message, error, context),
  
  // Specialized methods
  api: (method: string, url: string, data?: unknown) => Logger.apiCall(method, url, data),
  apiResponse: (method: string, url: string, status: number, data?: unknown) => Logger.apiResponse(method, url, status, data),
  user: (action: string, data?: unknown) => Logger.userAction(action, data),
  perf: (operation: string, duration: number, data?: unknown) => Logger.performance(operation, duration, data),
  security: (event: string, data?: unknown) => Logger.security(event, data),
};

// Development helper - expose logger to window for debugging
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).Logger = Logger;
}

export default Logger;