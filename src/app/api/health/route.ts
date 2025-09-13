import { NextRequest, NextResponse } from 'next/server'
import { healthMonitor, errorTracker, logger } from '@/lib/error-monitoring'
import { errorRecovery } from '@/lib/error-recovery'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message?: string
  responseTime?: number
  details?: Record<string, any>
}

interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: HealthCheck[]
  dependencies: Record<string, any>
  metrics: {
    memory: NodeJS.MemoryUsage
    cpu: any
    disk: any
  }
}

// System metrics collector
class SystemMetrics {
  static getMemoryUsage() {
    return process.memoryUsage()
  }

  static getCPUUsage() {
    try {
      const cpus = require('os').cpus()
      return {
        count: cpus.length,
        model: cpus[0]?.model,
        speed: cpus[0]?.speed
      }
    } catch {
      return null
    }
  }

  static getDiskUsage() {
    try {
      const stats = execSync('df -h /', { encoding: 'utf8' })
      const lines = stats.split('\n')
      const data = lines[1]?.split(/\s+/)
      if (data && data.length >= 5) {
        return {
          total: data[1],
          used: data[2],
          available: data[3],
          usage: data[4]
        }
      }
    } catch {
      return null
    }
    return null
  }

  static getUptime() {
    return process.uptime()
  }

  static getVersion() {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf8')
      )
      return packageJson.version || '1.0.0'
    } catch {
      return '1.0.0'
    }
  }
}

// Database health check
async function checkDatabaseHealth(): Promise<HealthCheck> {
  const startTime = Date.now()
  try {
    // Simulate database check - replace with actual database query
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      name: 'database',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: { type: 'postgresql', connection_pool: 10 }
    }
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: Date.now() - startTime
    }
  }
}

// Cache health check
async function checkCacheHealth(): Promise<HealthCheck> {
  const startTime = Date.now()
  try {
    // Simulate cache check
    await new Promise((resolve) => setTimeout(resolve, 50))

    return {
      name: 'cache',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: { type: 'redis', hit_ratio: 0.95 }
    }
  } catch (error) {
    return {
      name: 'cache',
      status: 'unhealthy',
      message: 'Cache service unavailable',
      responseTime: Date.now() - startTime
    }
  }
}

// External services health check
async function checkExternalServices(): Promise<HealthCheck> {
  const startTime = Date.now()
  try {
    const services = await errorRecovery.getRecoveryStatus()

    return {
      name: 'external-services',
      status: services.overallHealth as 'healthy' | 'unhealthy' | 'degraded',
      responseTime: Date.now() - startTime,
      details: { services: services.services }
    }
  } catch (error) {
    return {
      name: 'external-services',
      status: 'unhealthy',
      message: 'Failed to check external services',
      responseTime: Date.now() - startTime
    }
  }
}

// Memory health check
async function checkMemoryHealth(): Promise<HealthCheck> {
  const memory = SystemMetrics.getMemoryUsage()
  const usedMemoryMB = memory.heapUsed / 1024 / 1024
  const totalMemoryMB = memory.heapTotal / 1024 / 1024
  const memoryUsagePercent = (usedMemoryMB / totalMemoryMB) * 100

  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
  let message: string | undefined

  if (memoryUsagePercent > 90) {
    status = 'unhealthy'
    message = `High memory usage: ${memoryUsagePercent.toFixed(2)}%`
  } else if (memoryUsagePercent > 75) {
    status = 'degraded'
    message = `Elevated memory usage: ${memoryUsagePercent.toFixed(2)}%`
  }

  return {
    name: 'memory',
    status,
    message,
    details: {
      heapUsed: `${usedMemoryMB.toFixed(2)} MB`,
      heapTotal: `${totalMemoryMB.toFixed(2)} MB`,
      external: `${memory.external / 1024 / 1024} MB`,
      rss: `${memory.rss / 1024 / 1024} MB`
    }
  }
}

// Application health check
async function checkApplicationHealth(): Promise<HealthCheck> {
  const startTime = Date.now()
  try {
    // Check critical application components
    const checks = [checkDatabaseHealth(), checkCacheHealth(), checkExternalServices()]

    const results = await Promise.all(checks)
    const unhealthy = results.filter((r) => r.status === 'unhealthy')
    const degraded = results.filter((r) => r.status === 'degraded')

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    if (unhealthy.length > 0) {
      status = 'unhealthy'
    } else if (degraded.length > 0) {
      status = 'degraded'
    }

    return {
      name: 'application',
      status,
      responseTime: Date.now() - startTime,
      details: { checks: results }
    }
  } catch (error) {
    return {
      name: 'application',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Application health check failed',
      responseTime: Date.now() - startTime
    }
  }
}

// Main health endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const searchParams = request.nextUrl.searchParams
    const detailed = searchParams.get('detailed') === 'true'
    const service = searchParams.get('service')

    // If specific service check requested
    if (service) {
      const healthCheck = await checkApplicationHealth()
      const serviceCheck = healthCheck.details?.checks?.find((c) => c.name === service)

      if (serviceCheck) {
        return NextResponse.json(serviceCheck, {
          status: serviceCheck.status === 'healthy' ? 200 : 503
        })
      }

      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Run all health checks
    const checks = await Promise.all([
      checkApplicationHealth(),
      checkMemoryHealth(),
      checkDatabaseHealth(),
      checkCacheHealth(),
      checkExternalServices()
    ])

    const unhealthyChecks = checks.filter((c) => c.status === 'unhealthy')
    const degradedChecks = checks.filter((c) => c.status === 'degraded')

    const overallStatus: 'healthy' | 'unhealthy' | 'degraded' =
      unhealthyChecks.length > 0
        ? 'unhealthy'
        : degradedChecks.length > 0
          ? 'degraded'
          : 'healthy'

    const response: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: SystemMetrics.getUptime(),
      version: SystemMetrics.getVersion(),
      environment: process.env.NODE_ENV || 'development',
      checks,
      dependencies: {
        node: process.version,
        npm: process.env.npm_package_version || 'unknown'
      },
      metrics: {
        memory: SystemMetrics.getMemoryUsage(),
        cpu: SystemMetrics.getCPUUsage(),
        disk: SystemMetrics.getDiskUsage()
      }
    }

    // Log health check results
    logger.info('Health check completed', {
      status: overallStatus,
      responseTime: Date.now() - startTime,
      unhealthy: unhealthyChecks.length,
      degraded: degradedChecks.length
    })

    return NextResponse.json(response, {
      status:
        overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
  } catch (error) {
    logger.error('Health check failed', { error })
    errorTracker.captureError(error as Error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 503 }
    )
  }
}

// POST endpoint for custom health checks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, customCheck } = body

    if (!service || !customCheck) {
      return NextResponse.json(
        { error: 'Service and customCheck are required' },
        { status: 400 }
      )
    }

    // Execute custom health check
    const startTime = Date.now()
    try {
      const isHealthy = await customCheck()
      return NextResponse.json({
        name: service,
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime
      })
    } catch (error) {
      return NextResponse.json({
        name: service,
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Custom check failed',
        responseTime: Date.now() - startTime
      })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
