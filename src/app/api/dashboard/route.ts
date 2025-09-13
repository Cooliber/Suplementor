import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor } from '@/lib/performance-monitoring'
import { errorTracker, logger } from '@/lib/error-monitoring'
import { ErrorRecoveryManager } from '@/lib/error-recovery'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '1h'
    const includeMetrics = searchParams.get('includeMetrics') !== 'false'
    const includeAlerts = searchParams.get('includeAlerts') !== 'false'
    const includeErrors = searchParams.get('includeErrors') !== 'false'

    // Calculate time range in milliseconds
    const timeRanges: Record<string, number> = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }

    const duration = timeRanges[timeRange as keyof typeof timeRanges] || timeRanges['1h']
    const since = Date.now() - (duration || 3600000)

    // Get performance metrics
    let metrics: any[] = []
    if (includeMetrics && duration) {
      metrics = performanceMonitor.getMetrics(undefined, duration / 1000)
    }

    // Get alerts
    let alerts: any[] = []
    if (includeAlerts) {
      alerts = performanceMonitor.getAlerts()
    }

    // Get error statistics
    let errorStats = {}
    if (includeErrors) {
      errorStats = await getErrorStatistics(since)
    }

    // Get system health
    const systemHealth = await getSystemHealth()

    const errorRecoveryManager = ErrorRecoveryManager.getInstance()

    // Get service status
    const serviceStatus = await getServiceStatus(errorRecoveryManager)

    // Get recovery statistics
    const recoveryStatus = await errorRecoveryManager.getRecoveryStatus()
    const recoveryStats = {
      services: recoveryStatus.services,
      circuitStates: recoveryStatus.circuitStates,
      overallHealth: recoveryStatus.overallHealth,
      timestamp: recoveryStatus.timestamp
    }

    const dashboardData = {
      timestamp: new Date().toISOString(),
      timeRange,
      duration,
      metrics,
      alerts,
      errorStats,
      systemHealth,
      serviceStatus,
      recoveryStats
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    logger.error('Error fetching dashboard data', { error })
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}

async function getErrorStatistics(since: number) {
  // This would typically query your error tracking service
  // For now, we'll use a mock implementation

  const mockErrors = [
    {
      type: 'API_ERROR',
      count: Math.floor(Math.random() * 10),
      lastOccurrence: new Date(Date.now() - Math.random() * 3600000).toISOString()
    },
    {
      type: 'DATABASE_ERROR',
      count: Math.floor(Math.random() * 5),
      lastOccurrence: new Date(Date.now() - Math.random() * 7200000).toISOString()
    },
    {
      type: 'EXTERNAL_SERVICE_ERROR',
      count: Math.floor(Math.random() * 8),
      lastOccurrence: new Date(Date.now() - Math.random() * 1800000).toISOString()
    }
  ]

  return {
    totalErrors: mockErrors.reduce((sum, error) => sum + error.count, 0),
    errorTypes: mockErrors,
    errorRate: Math.random() * 5 // Percentage
  }
}

async function getSystemHealth() {
  const systemMetrics = performanceMonitor.getSystemMetrics()

  // Calculate health scores with safe defaults
  const memoryHealth = systemMetrics?.memory?.heapTotal
    ? Math.max(
        0,
        100 - (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100
      )
    : 100

  const loadHealth =
    systemMetrics?.loadAvg?.[0] && typeof require !== 'undefined'
      ? Math.max(0, 100 - (systemMetrics.loadAvg[0] / require('os').cpus().length) * 100)
      : 100

  return {
    overall: Math.min(memoryHealth, loadHealth),
    memory: {
      usage: systemMetrics?.memory || { heapUsed: 0, heapTotal: 1 },
      health: memoryHealth
    },
    cpu: {
      load: systemMetrics?.loadAvg || [0, 0, 0],
      health: loadHealth
    },
    uptime: systemMetrics?.uptime || 0
  }
}

async function getServiceStatus(recoveryManager: ErrorRecoveryManager) {
  // Get status of external services using recovery manager
  const services = ['database', 'cache', 'external-api', 'auth-service']

  try {
    const recoveryStatus = await recoveryManager.getRecoveryStatus()

    // Map the recovery status services to our expected format
    const serviceStatus = recoveryStatus.services.map((serviceHealth) => ({
      name: serviceHealth.name,
      status: serviceHealth.status,
      responseTime: serviceHealth.responseTime || 0,
      lastCheck: serviceHealth.lastCheck.toISOString(),
      errorRate: serviceHealth.errorRate || 0
    }))

    // Ensure all expected services are included
    const expectedServices = new Set(services)
    const existingServices = new Set(serviceStatus.map((s) => s.name))

    // Add missing services with unknown status
    services.forEach((service) => {
      if (!existingServices.has(service)) {
        serviceStatus.push({
          name: service,
          status: 'unhealthy',
          responseTime: 0,
          lastCheck: new Date().toISOString(),
          errorRate: 0
        })
      }
    })

    return serviceStatus
  } catch (error) {
    // Fallback to basic service status if recovery manager fails
    return services.map((service) => ({
      name: service,
      status: 'unhealthy' as const,
      responseTime: 0,
      lastCheck: new Date().toISOString(),
      errorRate: 0
    }))
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const bodyObj = body as { action: string; data: any }
    const { action, data } = bodyObj

    const errorRecoveryManager = ErrorRecoveryManager.getInstance()

    switch (action) {
      case 'resolve_alert':
        if (data.alertId) {
          performanceMonitor.resolveAlert(data.alertId)
          return NextResponse.json({ success: true })
        }
        break

      case 'reset_circuit_breaker':
        if (data.serviceName) {
          await errorRecoveryManager.resetService(data.serviceName)
          return NextResponse.json({ success: true })
        }
        break

      case 'clear_errors':
        // This would typically clear error logs
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    logger.error('Error processing dashboard action', { error })
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
