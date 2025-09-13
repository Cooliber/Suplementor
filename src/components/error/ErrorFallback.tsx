'use client';

import React from 'react';
import { AlertCircle, WifiOff, RefreshCw, PackageOpen, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Generic error fallback component
export const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  title = "Wystąpił błąd",
  message = "Przepraszamy, coś poszło nie tak."
}: {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  message?: string;
}) => {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {isDev ? error.message : 'Spróbuj ponownie później.'}
            </AlertDescription>
          </Alert>

          {isDev && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                Szczegóły błędu (tryb deweloperski)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button onClick={resetErrorBoundary} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Spróbuj ponownie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Network error fallback
export const NetworkErrorFallback = ({ 
  resetErrorBoundary 
}: { 
  resetErrorBoundary: () => void; 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <WifiOff className="h-5 w-5" />
          Brak połączenia
        </CardTitle>
        <CardDescription>
          Nie można połączyć się z serwerem. Sprawdź swoje połączenie internetowe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={resetErrorBoundary} variant="default" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Odśwież
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Loading fallback
export const LoadingFallback = ({ message = "Ładowanie..." }: { message?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Empty state fallback
export const EmptyStateFallback = ({ 
  title = "Brak danych",
  message = "Nie znaleziono żadnych danych do wyświetlenia.",
  actionButton
}: {
  title?: string;
  message?: string;
  actionButton?: React.ReactNode;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <PackageOpen className="h-6 w-6 text-gray-400" />
        </div>
        <CardTitle className="text-gray-900">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {actionButton && <CardContent>{actionButton}</CardContent>}
    </Card>
  </div>
);

// Info fallback for non-critical messages
export const InfoFallback = ({ 
  title = "Informacja",
  message,
  actionButton
}: {
  title?: string;
  message: string;
  actionButton?: React.ReactNode;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Info className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {actionButton && <CardContent>{actionButton}</CardContent>}
    </Card>
  </div>
);