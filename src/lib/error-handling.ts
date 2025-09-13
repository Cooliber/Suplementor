import React from 'react'
import { type z } from 'zod'

// Error types for better error categorization
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  PARSING = 'PARSING',
  COMPONENT = 'COMPONENT',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class with additional context
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly context?: Record<string, unknown>
  public readonly timestamp: Date

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.context = context ? { ...context } : undefined
    this.timestamp = new Date()
  }
}

// Error logger utility
export class ErrorLogger {
  private static instance: ErrorLogger
  private errors: AppError[] = []

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  log(error: AppError | Error): void {
    const appError =
      error instanceof AppError ? error : new AppError(error.message, ErrorType.UNKNOWN)

    this.errors.push(appError)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${appError.type}] ${appError.message}`, {
        context: appError.context,
        timestamp: appError.timestamp,
        stack: appError.stack
      })
    }
  }

  getErrors(): AppError[] {
    return [...this.errors]
  }

  clearErrors(): void {
    this.errors = []
  }

  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter((error) => error.type === type)
  }
}

// Safe JSON parsing utility
/**
 *
 * @param jsonString
 * @param schema
 */
export const safeJsonParse = <T>(
  jsonString: string,
  schema?: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: AppError } => {
  try {
    const parsed = JSON.parse(jsonString)

    if (schema) {
      const result = schema.safeParse(parsed)
      if (!result.success) {
        return {
          success: false,
          error: new AppError(
            `Validation failed: ${result.error.message}`,
            ErrorType.VALIDATION,
            { zodError: result.error } as Record<string, unknown>
          )
        }
      }
      return { success: true, data: result.data }
    }

    return { success: true, data: parsed as T }
  } catch (error) {
    return {
      success: false,
      error: new AppError(
        `JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorType.PARSING,
        { originalError: error } as Record<string, unknown>
      )
    }
  }
}

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: <T>(key: string, schema?: z.ZodSchema<T>): T | null => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parseResult = safeJsonParse(item, schema)
      if (!parseResult.success) {
        ErrorLogger.getInstance().log(parseResult.error)
        return null
      }

      return parseResult.data
    } catch (error) {
      ErrorLogger.getInstance().log(
        new AppError(`Failed to get item from localStorage: ${key}`, ErrorType.STORAGE, {
          key,
          error
        } as Record<string, unknown>)
      )
      return null
    }
  },

  setItem: <T>(key: string, value: T): boolean => {
    try {
      const serialized = JSON.stringify(value)
      if (typeof serialized === 'string') {
        localStorage.setItem(key, serialized)
        return true
      } else {
        throw new Error('Serialization failed')
      }
    } catch (error) {
      ErrorLogger.getInstance().log(
        new AppError(`Failed to set item in localStorage: ${key}`, ErrorType.STORAGE, {
          key,
          value,
          error
        } as Record<string, unknown>)
      )
      return false
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      ErrorLogger.getInstance().log(
        new AppError(
          `Failed to remove item from localStorage: ${key}`,
          ErrorType.STORAGE,
          { key, error } as Record<string, unknown>
        )
      )
      return false
    }
  }
}

// Validation utilities
/**
 *
 * @param data
 * @param schema
 */
export const validateSupplementData = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    )
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}

// React error boundary helper
/**
 *
 * @param fallback
 */
export function createErrorBoundary(fallback: React.ComponentType<{ error: Error }>) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      ErrorLogger.getInstance().log(
        new AppError(`Component error: ${error.message}`, ErrorType.COMPONENT, {
          error,
          errorInfo
        } as Record<string, unknown>)
      )
    }

    override render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement(fallback, { error: this.state.error })
      }

      return this.props.children
    }
  }
}

// Type-safe async wrapper
/**
 *
 * @param asyncFn
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: AppError }> => {
  try {
    const data = await asyncFn()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: new AppError(
        `Async operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorType.UNKNOWN,
        { originalError: error } as Record<string, unknown>
      )
    }
  }
}
