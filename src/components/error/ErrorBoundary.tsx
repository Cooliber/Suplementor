'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Component stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Coś poszło nie tak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Przepraszamy, wystąpił nieoczekiwany błąd. 
                  {isDev && error ? `Komunikat: ${error.message}` : 'Spróbuj odświeżyć stronę.'}
                </AlertDescription>
              </Alert>

              {isDev && errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    Szczegóły błędu (tryb deweloperski)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {error?.stack}
                    </pre>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Spróbuj ponownie
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Strona główna
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary with functional components
export function withErrorBoundary<P extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default ErrorBoundary;