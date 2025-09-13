import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { errorTracker, performanceTracker } from './lib/error-monitoring';

interface ErrorContext {
  url: string;
  method: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
  responseTime?: number;
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const transaction = performanceTracker.startTransaction(
    `${request.method} ${request.nextpathname}`,
    'http'
  );

  // Add breadcrumb for request tracking
  errorTracker.addBreadcrumb({
    category: 'http',
    message: `${request.method} ${request.nextpathname}`,
    level: 'info',
    data: {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    },
  });

  // Create response with error detection
  const response = NextResponse.next();
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  response.headers.set('X-Request-ID', crypto.randomUUID());

  // Track response
  const responseTime = Date.now() - startTime;
  transaction.finish();

  // Log slow requests
  if (responseTime > 1000) {
    const context: ErrorContext = {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.ip || request.headers.get('x-forwarded-for') || undefined,
      timestamp: new Date().toISOString(),
      responseTime,
    };

    errorTracker.captureMessage(
      `Slow request detected: ${request.method} ${request.nextpathname}`,
      'warning',
      context
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};