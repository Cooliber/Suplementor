import { NextRequest, NextResponse } from 'next/server';
import { logger } from './error-monitoring';
import { ContextTracker, userTracker } from './error-monitoring';
import { v4 as uuidv4 } from 'uuid';

interface RequestContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  referrer?: string;
  method: string;
  url: string;
  startTime: number;
}

export class LoggingMiddleware {
  private static instance: LoggingMiddleware;

  static getInstance(): LoggingMiddleware {
    if (!LoggingMiddleware.instance) {
      LoggingMiddleware.instance = new LoggingMiddleware();
    }
    return LoggingMiddleware.instance;
  }

  private extractClientInfo(request: NextRequest): Partial<RequestContext> {
    const headers = request.headers;
    const forwarded = headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    
    return {
      ip,
      userAgent: headers.get('user-agent') || 'unknown',
      referrer: headers.get('referer') || undefined,
      method: request.method,
      url: request.url,
    };
  }

  private extractUserInfo(request: NextRequest): { userId?: string; sessionId?: string } {
    const headers = request.headers;
    const cookies = request.cookies;
    
    // Extract user ID from various sources
    const userId = 
      cookies.get('user-id')?.value ||
      headers.get('x-user-id') ||
      undefined;
    
    // Extract session ID
    const sessionId = 
      cookies.get('session-id')?.value ||
      headers.get('x-session-id') ||
      uuidv4();
    
    return { userId, sessionId };
  }

  private sanitizeHeaders(headers: Headers): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    headers.forEach((value, key) => {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credit_card', 'ssn'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  async logRequest(request: NextRequest): Promise<string> {
    const requestId = uuidv4();
    const startTime = Date.now();
    
    const clientInfo = this.extractClientInfo(request);
    const userInfo = this.extractUserInfo(request);
    
    const context: RequestContext = {
      requestId,
      ...clientInfo,
      ...userInfo,
      startTime,
    };

    // Set context for tracking
    const contextTracker = new ContextTracker();
    contextTracker.setContext('request', {
      ...context,
      headers: this.sanitizeHeaders(request.headers),
    });

    if (userInfo.userId) {
      contextTracker.setUserContext(userInfo.userId, {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        lastRequest: request.url,
        requestId,
      });
    }

    // Log request details
    const logData = {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: clientInfo.userAgent,
      ip: clientInfo.ip,
      userId: userInfo.userId,
      sessionId: userInfo.sessionId,
      headers: this.sanitizeHeaders(request.headers),
      searchParams: Object.fromEntries(request.nextUrl.searchParams),
    };

    logger.info('Incoming request', logData);

    return requestId;
  }

  async logResponse(
    request: NextRequest,
    response: NextResponse,
    requestId: string,
    startTime: number
  ): Promise<void> {
    const duration = Date.now() - startTime;
    const status = response.status;
    
    const logData = {
      requestId,
      method: request.method,
      url: request.url,
      status,
      duration,
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
    };

    // Log based on status code
    if (status >= 400) {
      logger.error('Request completed with error', logData);
    } else if (status >= 300) {
      logger.warn('Request redirected', logData);
    } else {
      logger.info('Request completed successfully', logData);
    }

    // Track performance (placeholder)
    logger.info('Performance tracking', { path: request.nextUrl.pathname, method: request.method, duration });
  }

  async logError(
    request: NextRequest,
    error: Error,
    requestId: string
  ): Promise<void> {
    const logData = {
      requestId,
      method: request.method,
      url: request.url,
      error: error.message,
      stack: error.stack,
      userId: contextTracker.getContext('userId'),
      sessionId: contextTracker.getContext('sessionId'),
    };

    logger.error('Request error', logData);

    // Track user error if user ID is available
    const userId = contextTracker.getContext('userId');
    if (userId) {
      userTracker.trackError(userId, error, {
        requestId,
        method: request.method,
        url: request.url,
      });
    }
  }

  createLoggingMiddleware() {
    return async (request: NextRequest) => {
      const startTime = Date.now();
      let requestId: string;

      try {
        requestId = await this.logRequest(request);
        
        // Add request ID to headers for downstream tracking
        const modifiedRequest = new NextRequest(request, {
          headers: {
            ...Object.fromEntries(request.headers),
            'x-request-id': requestId,
          },
        });

        return { request: modifiedRequest, requestId, startTime };
      } catch (error) {
        logger.error('Failed to log request', { error });
        return { request, requestId: uuidv4(), startTime };
      }
    };
  }
}

// API route logger
export class APILogger {
  static async logAPICall(
    endpoint: string,
    method: string,
    status: number,
    duration: number,
    userId?: string,
    metadata?: any
  ) {
    const logData = {
      endpoint,
      method,
      status,
      duration,
      userId,
      ...metadata,
      timestamp: new Date().toISOString(),
    };

    if (status >= 400) {
      logger.error('API call failed', logData);
    } else {
      logger.info('API call completed', logData);
    }
  }

  static async logDatabaseQuery(
    query: string,
    duration: number,
    error?: Error,
    userId?: string
  ) {
    const logData = {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration,
      userId,
      timestamp: new Date().toISOString(),
    };

    if (error) {
      logger.error('Database query failed', { ...logData, error: error.message });
    } else {
      logger.info('Database query completed', logData);
    }
  }

  static async logExternalAPICall(
    service: string,
    endpoint: string,
    duration: number,
    status?: number,
    error?: Error
  ) {
    const logData = {
      service,
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    };

    if (error || (status && status >= 400)) {
      logger.error('External API call failed', { ...logData, error: error?.message });
    } else {
      logger.info('External API call completed', logData);
    }
  }
}

// Export singleton instance
export const loggingMiddleware = LoggingMiddleware.getInstance();