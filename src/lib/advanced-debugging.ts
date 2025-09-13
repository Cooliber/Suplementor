'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Browser-compatible logger for client-side debugging
const clientLogger = {
  warn: (message: string, meta?: any) => console.warn(message, meta),
  info: (message: string, meta?: any) => console.info(message, meta),
  error: (message: string, meta?: any) => console.error(message, meta),
  debug: (message: string, meta?: any) => console.debug(message, meta)
}

// Mock performance monitor for client-side
const clientPerformanceMonitor = {
  recordMetric: (metric: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Performance metric:', metric)
    }
  },
  recordError: (error: Error, context?: any) => {
    console.error('Performance error:', error, context)
  }
}

// Mock context tracker for client-side
const clientContextTracker = {
  setContext: (key: string, value: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Context set:', key, value)
    }
  },
  getContext: (key: string) => {
    return null
  }
}

// Debug levels
export enum DebugLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

// Debug categories for better filtering
export enum DebugCategory {
  SUPPLEMENT = 'supplement',
  USER_INTERACTION = 'user_interaction',
  PERFORMANCE = 'performance',
  API = 'api',
  STATE_CHANGE = 'state_change',
  RENDERING = 'rendering',
  ERROR = 'error',
  AI = 'ai'
}

interface DebugEvent {
  id: string
  timestamp: Date
  level: DebugLevel
  category: DebugCategory
  message: string
  data?: any
  stack: string | undefined
  userId?: string
  sessionId: string
}

class AdvancedDebugger {
  private static instance: AdvancedDebugger
  private events: DebugEvent[] = []
  private maxEvents: number = 1000
  private sessionId: string
  private isEnabled: boolean
  private filters: Set<DebugCategory> = new Set()
  private subscribers: ((events: DebugEvent[]) => void)[] = []

  private constructor() {
    this.sessionId = crypto.randomUUID()
    this.isEnabled =
      process.env.NODE_ENV === 'development' ||
      localStorage.getItem('debug-mode') === 'true'
    this.loadFilters()
  }

  static getInstance(): AdvancedDebugger {
    if (!AdvancedDebugger.instance) {
      AdvancedDebugger.instance = new AdvancedDebugger()
    }
    return AdvancedDebugger.instance
  }

  private loadFilters() {
    try {
      const savedFilters = localStorage.getItem('debug-filters')
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters) as DebugCategory[]
        this.filters = new Set(parsedFilters)
      }
    } catch (error) {
      console.warn('Failed to load debug filters:', error)
    }
  }

  private saveFilters() {
    try {
      localStorage.setItem('debug-filters', JSON.stringify([...this.filters]))
    } catch (error) {
      console.warn('Failed to save debug filters:', error)
    }
  }

  log(
    level: DebugLevel,
    category: DebugCategory,
    message: string,
    data?: any,
    userId?: string
  ) {
    if (!this.isEnabled) return

    const event: DebugEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data) || 'null') : undefined,
      stack: level === DebugLevel.ERROR ? new Error().stack : undefined,
      userId,
      sessionId: this.sessionId
    }

    this.events.push(event)

    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      this.consoleOutput(event)
    }

    // Notify subscribers
    this.notifySubscribers()

    // Log to monitoring system for errors and warnings
    if (level <= DebugLevel.WARN) {
      clientLogger.warn(`[${category}] ${message}`, {
        data,
        userId,
        sessionId: this.sessionId
      })
    }
  }

  private consoleOutput(event: DebugEvent) {
    const styles = {
      [DebugLevel.ERROR]: 'color: #dc2626; font-weight: bold;',
      [DebugLevel.WARN]: 'color: #d97706; font-weight: bold;',
      [DebugLevel.INFO]: 'color: #2563eb;',
      [DebugLevel.DEBUG]: 'color: #059669;',
      [DebugLevel.TRACE]: 'color: #6b7280;'
    }

    const timestamp = event.timestamp.toISOString().slice(11, 23)
    console.log(
      `%c[${timestamp}] [${event.category.toUpperCase()}] ${event.message}`,
      styles[event.level],
      event.data
    )
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      try {
        callback([...this.events])
      } catch (error) {
        console.error('Error in debug subscriber:', error)
      }
    })
  }

  subscribe(callback: (events: DebugEvent[]) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  getEvents(filters?: {
    level?: DebugLevel
    category?: DebugCategory
    userId?: string
    timeRange?: { start: Date; end: Date }
  }): DebugEvent[] {
    let filteredEvents = [...this.events]

    if (filters) {
      if (filters.level !== undefined) {
        filteredEvents = filteredEvents.filter((event) => event.level <= filters.level!)
      }
      if (filters.category) {
        filteredEvents = filteredEvents.filter(
          (event) => event.category === filters.category
        )
      }
      if (filters.userId) {
        filteredEvents = filteredEvents.filter((event) => event.userId === filters.userId)
      }
      if (filters.timeRange) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.timestamp >= filters.timeRange!.start &&
            event.timestamp <= filters.timeRange!.end
        )
      }
    }

    return filteredEvents
  }

  clearEvents() {
    this.events = []
    this.notifySubscribers()
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2)
  }

  // Convenience methods
  error(category: DebugCategory, message: string, data?: any, userId?: string) {
    this.log(DebugLevel.ERROR, category, message, data, userId)
  }

  warn(category: DebugCategory, message: string, data?: any, userId?: string) {
    this.log(DebugLevel.WARN, category, message, data, userId)
  }

  info(category: DebugCategory, message: string, data?: any, userId?: string) {
    this.log(DebugLevel.INFO, category, message, data, userId)
  }

  debug(category: DebugCategory, message: string, data?: any, userId?: string) {
    this.log(DebugLevel.DEBUG, category, message, data, userId)
  }

  trace(category: DebugCategory, message: string, data?: any, userId?: string) {
    this.log(DebugLevel.TRACE, category, message, data, userId)
  }
}

// React hook for component debugging
export function useComponentDebugger(componentName: string) {
  const debuggerInstance = AdvancedDebugger.getInstance()
  const renderCountRef = useRef(0)
  const mountTimeRef = useRef<number>()

  useEffect(() => {
    mountTimeRef.current = Date.now()
    debuggerInstance.debug(DebugCategory.RENDERING, `${componentName} mounted`)

    return () => {
      const lifetime = mountTimeRef.current ? Date.now() - mountTimeRef.current : 0
      debuggerInstance.debug(
        DebugCategory.RENDERING,
        `${componentName} unmounted after ${lifetime}ms`
      )
    }
  }, [componentName, debuggerInstance])

  useEffect(() => {
    renderCountRef.current++
    debuggerInstance.trace(
      DebugCategory.RENDERING,
      `${componentName} rendered (${renderCountRef.current})`
    )
  })

  return {
    logInfo: useCallback(
      (message: string, data?: any) => {
        debuggerInstance.info(
          DebugCategory.USER_INTERACTION,
          `[${componentName}] ${message}`,
          data
        )
      },
      [componentName, debuggerInstance]
    ),

    logError: useCallback(
      (message: string, error?: Error) => {
        debuggerInstance.error(DebugCategory.ERROR, `[${componentName}] ${message}`, {
          error: error?.message,
          stack: error?.stack
        })
      },
      [componentName, debuggerInstance]
    ),

    logPerformance: useCallback(
      (operation: string, duration: number) => {
        debuggerInstance.info(
          DebugCategory.PERFORMANCE,
          `[${componentName}] ${operation} took ${duration}ms`
        )
      },
      [componentName, debuggerInstance]
    )
  }
}

// Performance monitoring hook
export function usePerformanceMonitor(operationName: string) {
  const debuggerInstance = AdvancedDebugger.getInstance()
  const startTimeRef = useRef<number>()

  const start = useCallback(() => {
    startTimeRef.current = performance.now()
    debuggerInstance.trace(DebugCategory.PERFORMANCE, `Started ${operationName}`)
  }, [operationName, debuggerInstance])

  const end = useCallback(
    (additionalData?: any) => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current
        debuggerInstance.info(
          DebugCategory.PERFORMANCE,
          `${operationName} completed in ${duration.toFixed(2)}ms`,
          {
            duration,
            ...additionalData
          }
        )
        return duration
      }
      return 0
    },
    [operationName, debuggerInstance]
  )

  return { start, end }
}

// State change tracker hook
export function useStateDebugger<T>(stateName: string, state: T) {
  const debuggerInstance = AdvancedDebugger.getInstance()
  const previousStateRef = useRef<T>()

  useEffect(() => {
    if (previousStateRef.current !== undefined) {
      debuggerInstance.debug(DebugCategory.STATE_CHANGE, `${stateName} changed`, {
        previous: previousStateRef.current,
        current: state
      })
    }
    previousStateRef.current = state
  }, [state, stateName, debuggerInstance])
}

// Supplement tracking utilities
export const supplementDebugger = {
  logInteraction: (
    supplementId: string,
    interactionType: 'take' | 'skip' | 'modify',
    data?: any
  ) => {
    const debuggerInstance = AdvancedDebugger.getInstance()
    debuggerInstance.info(
      DebugCategory.SUPPLEMENT,
      `Supplement ${interactionType}: ${supplementId}`,
      data
    )
  },

  logEffect: (
    supplementId: string,
    effectType: 'positive' | 'negative' | 'neutral',
    description: string,
    severity: number
  ) => {
    const debuggerInstance = AdvancedDebugger.getInstance()
    debuggerInstance.info(
      DebugCategory.SUPPLEMENT,
      `Supplement effect: ${supplementId}`,
      {
        effectType,
        description,
        severity,
        timestamp: new Date()
      }
    )
  },

  logInteractionWarning: (
    supplement1: string,
    supplement2: string,
    severity: 'low' | 'medium' | 'high',
    description: string
  ) => {
    const debuggerInstance = AdvancedDebugger.getInstance()
    debuggerInstance.warn(
      DebugCategory.SUPPLEMENT,
      `Supplement interaction warning: ${supplement1} + ${supplement2}`,
      {
        severity,
        description,
        supplements: [supplement1, supplement2]
      }
    )
  }
}

export const advancedDebugger = AdvancedDebugger.getInstance()
