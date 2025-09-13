import * as Sentry from '@sentry/nextjs'

// Create appropriate logger based on environment
const createLogger = () => {
  const isNodeEnvironment = typeof window === 'undefined'

  if (isNodeEnvironment) {
    try {
      // Only attempt Winston import in Node.js environment
      const winston = require('winston')

      // Node.js environment - use Winston with file logging
      const logFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'stack']
        })
      )

      return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: logFormat,
        defaultMeta: {
          service: 'workspace-app',
          environment: process.env.NODE_ENV || 'development',
          version: process.env.npm_package_version || '1.0.0'
        },
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          })
        ].filter(Boolean)
      })
    } catch (error) {
      // Fallback if Winston fails to load
      console.warn('Winston not available, falling back to console logging')
      return {
        level: process.env.LOG_LEVEL || 'info',
        error: (message: string, meta?: any) => console.error(message, meta),
        warn: (message: string, meta?: any) => console.warn(message, meta),
        info: (message: string, meta?: any) => console.info(message, meta),
        debug: (message: string, meta?: any) => console.debug(message, meta),
        log: (level: string, message: string, meta?: any) =>
          console.log(level, message, meta)
      }
    }
  } else {
    // Browser environment - use console logging
    return {
      level: process.env.LOG_LEVEL || 'info',
      error: (message: string, meta?: any) => console.error(message, meta),
      warn: (message: string, meta?: any) => console.warn(message, meta),
      info: (message: string, meta?: any) => console.info(message, meta),
      debug: (message: string, meta?: any) => console.debug(message, meta),
      log: (level: string, message: string, meta?: any) =>
        console.log(level, message, meta)
    }
  }
}

export const logger = createLogger()

// Configure Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  errorSampleRate: 1.0,
  integrations: [],
  beforeSend(event, hint) {
    // Add custom context
    event.contexts = {
      ...event.contexts,
      app: {
        name: 'workspace-app',
        version: process.env.npm_package_version || '1.0.0',
        build: process.env.BUILD_NUMBER || 'dev'
      }
    }
    return event
  }
})

// Custom error classes
export class AppError extends Error {
  public readonly isOperational: boolean
  public readonly statusCode: number
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context)
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required',
    context?: Record<string, any>
  ) {
    super(message, 401, true, context)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, any>) {
    super(message, 403, true, context)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, context?: Record<string, any>) {
    super(`${resource} not found`, 404, true, context)
  }
}

// Error tracking utilities
export const errorTracker = {
  captureError: (error: Error, context?: Record<string, any>) => {
    logger.error(error.message, { error, ...context })
    Sentry.captureException(error, {
      extra: context
    })
  },

  captureMessage: (
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: Record<string, any>
  ) => {
    logger.log(level, message, context)
    Sentry.captureMessage(message, level as Sentry.SeverityLevel, {
      extra: context
    })
  },

  setUser: (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser(user)
    logger.defaultMeta = { ...logger.defaultMeta, userId: user.id }
  },

  setContext: (name: string, context: Record<string, any>) => {
    Sentry.setContext(name, context)
  },

  addBreadcrumb: (breadcrumb: Sentry.Breadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb)
  }
}

// Context and user tracking utilities
class ContextTracker {
  private static instance: ContextTracker
  private context: Map<string, any> = new Map()
  private userContext: Map<string, any> = new Map()

  static getInstance(): ContextTracker {
    if (!ContextTracker.instance) {
      ContextTracker.instance = new ContextTracker()
    }
    return ContextTracker.instance
  }

  setContext(key: string, value: any) {
    this.context.set(key, value)
  }

  getContext(key: string): any {
    return this.context.get(key)
  }

  setUserContext(userId: string, context: any) {
    this.userContext.set(userId, {
      ...this.userContext.get(userId),
      ...context,
      lastActivity: new Date().toISOString()
    })
  }

  getUserContext(userId: string): any {
    return this.userContext.get(userId)
  }

  clearContext() {
    this.context.clear()
  }

  clearUserContext(userId: string) {
    this.userContext.delete(userId)
  }

  getFullContext() {
    return {
      request: Object.fromEntries(this.context),
      user: Object.fromEntries(this.userContext),
      timestamp: new Date().toISOString()
    }
  }
}

export const contextTracker = ContextTracker.getInstance()

// Enhanced performance monitoring with context
export const performanceMonitor = {
  start: (name: string, metadata: Record<string, any> = {}) => {
    const startTime = performance.now()
    const context = contextTracker.getFullContext()

    return {
      end: (additionalData: Record<string, any> = {}) => {
        const duration = performance.now() - startTime
        const fullData = {
          ...metadata,
          ...additionalData,
          duration,
          name,
          context
        }

        logger.info(`Performance: ${name}`, fullData)

        // Track performance metrics with context
        errorTracker.addBreadcrumb({
          category: 'performance',
          message: `Operation ${name} completed in ${duration}ms`,
          level: 'info',
          data: fullData
        })

        return duration
      }
    }
  },

  trackAPI: (endpoint: string, method: string) => {
    const startTime = performance.now()
    const context = contextTracker.getFullContext()

    return {
      end: (status: number, responseTime?: number) => {
        const duration = responseTime || performance.now() - startTime
        const isError = status >= 400

        const logData = {
          endpoint,
          method,
          status,
          duration,
          context,
          timestamp: new Date().toISOString()
        }

        if (isError) {
          logger.error(`API Error: ${method} ${endpoint}`, logData)
        } else {
          logger.info(`API: ${method} ${endpoint}`, logData)
        }

        // Track API metrics
        errorTracker.addBreadcrumb({
          category: 'api',
          message: `${method} ${endpoint} ${status}`,
          level: isError ? 'error' : 'info',
          data: logData
        })

        return duration
      }
    }
  }
}

// User activity tracking
export const userTracker = {
  trackActivity: (userId: string, activity: string, data: any = {}) => {
    const context = {
      userId,
      activity,
      data,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ip: data.ip || 'unknown'
    }

    contextTracker.setUserContext(userId, context)
    logger.info(`User activity: ${activity}`, context)

    errorTracker.addBreadcrumb({
      category: 'user',
      message: `User ${userId}: ${activity}`,
      level: 'info',
      data: context
    })
  },

  trackError: (userId: string, error: Error, context: any = {}) => {
    const fullContext = {
      ...context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    }

    contextTracker.setUserContext(userId, fullContext)
    logger.error(`User error: ${userId}`, { error: error.message, context: fullContext })

    errorTracker.captureException(error, {
      user: { id: userId },
      extra: fullContext
    })
  }
}

// Performance monitoring
export const performanceTracker = {
  startTransaction: (name: string, operation: string) => {
    return Sentry.startSpan({ name, op: operation })
  },
  finishTransaction: (transaction: any) => {
    // No explicit finish needed in newer Sentry versions
  },
  setTransactionName: (name: string) => {
    Sentry.setTag('transaction', name)
  }
}

// Health check utilities
export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message?: string
  responseTime?: number
  lastChecked: Date
}

export class HealthMonitor {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map()

  register(name: string, check: () => Promise<HealthCheck>) {
    this.checks.set(name, check)
  }

  async runChecks(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = []

    for (const [name, check] of this.checks) {
      try {
        const startTime = Date.now()
        const result = await check()
        const responseTime = Date.now() - startTime

        results.push({
          ...result,
          responseTime,
          lastChecked: new Date()
        })
      } catch (error) {
        results.push({
          name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date()
        })
      }
    }

    return results
  }
}
