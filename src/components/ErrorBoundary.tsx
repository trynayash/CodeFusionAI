/**
 * Enhanced Error Boundary Component
 * Comprehensive error handling with recovery options and user-friendly messages
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { log } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'global';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      showDetails: props.showDetails || false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Log error with context
    log.error('Error boundary caught error', error, 'ERROR_BOUNDARY');

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    // Store error report locally for debugging
    try {
      const existingReports = JSON.parse(localStorage.getItem('errorReports') || '[]');
      existingReports.push(errorReport);
      localStorage.setItem('errorReports', JSON.stringify(existingReports.slice(-10))); // Keep last 10
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      log.info('Retrying after error', { retryCount: retryCount + 1 }, 'ERROR_BOUNDARY');
      
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      log.error('Max retries exceeded', new Error('Max retries exceeded'), 'ERROR_BOUNDARY');
      this.handleReload();
    }
  };

  private handleReload = () => {
    log.info('Reloading page after error', {}, 'ERROR_BOUNDARY');
    window.location.reload();
  };

  private handleGoHome = () => {
    log.info('Navigating to home after error', {}, 'ERROR_BOUNDARY');
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private clearError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, showDetails } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                We encountered an unexpected error. Don't worry, we're working on it!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="text-xs">
                  Error ID: {errorId}
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  disabled={retryCount >= this.maxRetries}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {retryCount >= this.maxRetries ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Error details toggle */}
              {level !== 'global' && (
                <div className="text-center">
                  <Button
                    onClick={this.toggleDetails}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    {showDetails ? 'Hide' : 'Show'} Technical Details
                  </Button>
                </div>
              )}

              {/* Technical details */}
              {showDetails && error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-900/50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Error Details</h4>
                    <Button
                      onClick={this.toggleDetails}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Error:</span>
                      <code className="ml-2 text-red-400">{error.message}</code>
                    </div>
                    
                    {error.stack && (
                      <div>
                        <span className="text-slate-400">Stack:</span>
                        <pre className="mt-1 p-2 bg-slate-950 rounded text-xs text-slate-300 overflow-x-auto">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {errorInfo?.componentStack && (
                      <div>
                        <span className="text-slate-400">Component Stack:</span>
                        <pre className="mt-1 p-2 bg-slate-950 rounded text-xs text-slate-300 overflow-x-auto">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Help text */}
              <div className="text-center text-sm text-slate-500">
                <p>
                  If this problem persists, please contact support with the Error ID above.
                </p>
                <p className="mt-1">
                  Retry count: {retryCount}/{this.maxRetries}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return children;
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error boundary context
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

export default ErrorBoundary;