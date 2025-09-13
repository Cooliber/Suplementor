import { logger, errorTracker } from './error-monitoring';

interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  duration?: number; // Time window in seconds
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

interface Alert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  level: 'warning' | 'critical';
  timestamp: number;
  message: string;
  resolved?: boolean;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private alerts: Alert[] = [];
  private alertHandlers: Array<(alert: Alert) => void> = [];

  constructor() {
    this.initializeThresholds();
    this.startMonitoring();
  }

  private initializeThresholds() {
    // API Response Time Thresholds
    this.setThreshold('api_response_time', {
      metric: 'api_response_time',
      warning: 1000, // 1 second
      critical: 5000, // 5 seconds
      duration: 60, // 1 minute window
    });

    // Database Query Time Thresholds
    this.setThreshold('db_query_time', {
      metric: 'db_query_time',
      warning: 500, // 500ms
      critical: 2000, // 2 seconds
      duration: 60,
    });

    // Memory Usage Thresholds
    this.setThreshold('memory_usage', {
      metric: 'memory_usage',
      warning: 80, // 80% of available memory
      critical: 90, // 90% of available memory
      duration: 300, // 5 minute window
    });

    // CPU Usage Thresholds
    this.setThreshold('cpu_usage', {
      metric: 'cpu_usage',
      warning: 70, // 70% CPU usage
      critical: 90, // 90% CPU usage
      duration: 300,
    });

    // Error Rate Thresholds
    this.setThreshold('error_rate', {
      metric: 'error_rate',
      warning: 5, // 5% error rate
      critical: 10, // 10% error rate
      duration: 300,
    });

    // Request Rate Thresholds
    this.setThreshold('request_rate', {
      metric: 'request_rate',
      warning: 1000, // 1000 requests per minute
      critical: 2000, // 2000 requests per minute
      duration: 60,
    });

    // External Service Response Time
    this.setThreshold('external_service_response_time', {
      metric: 'external_service_response_time',
      warning: 2000, // 2 seconds
      critical: 10000, // 10 seconds
      duration: 300,
    });
  }

  setThreshold(metric: string, threshold: PerformanceThreshold) {
    this.thresholds.set(metric, threshold);
  }

  getThreshold(metric: string): PerformanceThreshold | undefined {
    return this.thresholds.get(metric);
  }

  recordMetric(metric: PerformanceMetric) {
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }

    const metrics = this.metrics.get(metric.name)!;
    metrics.push(metric);

    // Keep only last hour of metrics
    const cutoff = Date.now() - 3600000;
    const filtered = metrics.filter(m => m.timestamp > cutoff);
    this.metrics.set(metric.name, filtered);

    // Check thresholds
    this.checkThresholds(metric);
  }

  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    // Check if metric exceeds threshold
    if (metric.value >= threshold.critical) {
      this.createAlert(metric, threshold, 'critical');
    } else if (metric.value >= threshold.warning) {
      this.createAlert(metric, threshold, 'warning');
    }
  }

  private createAlert(
    metric: PerformanceMetric,
    threshold: PerformanceThreshold,
    level: 'warning' | 'critical'
  ) {
    const alert: Alert = {
      id: `alert_${metric.name}_${Date.now()}`,
      metric: metric.name,
      value: metric.value,
      threshold: level === 'critical' ? threshold.critical : threshold.warning,
      level,
      timestamp: Date.now(),
      message: `${metric.name} is ${level}: ${metric.value} (threshold: ${level === 'critical' ? threshold.critical : threshold.warning})`,
    };

    this.alerts.push(alert);
    logger.warn('Performance alert triggered', alert);

    // Notify handlers
    this.alertHandlers.forEach(handler => handler(alert));

    // Send to error tracking
    errorTracker.captureMessage(alert.message, level);
  }

  addAlertHandler(handler: (alert: Alert) => void) {
    this.alertHandlers.push(handler);
  }

  getMetrics(metric?: string, duration?: number): PerformanceMetric[] {
    if (metric) {
      const metrics = this.metrics.get(metric) || [];
      if (duration) {
        const cutoff = Date.now() - duration * 1000;
        return metrics.filter(m => m.timestamp > cutoff);
      }
      return metrics;
    }

    // Return all metrics
    const allMetrics: PerformanceMetric[] = [];
    this.metrics.forEach(metrics => {
      allMetrics.push(...metrics);
    });

    // Sort by timestamp
    return allMetrics.sort((a, b) => a.timestamp - b.timestamp);
  }

  getAlerts(resolved?: boolean): Alert[] {
    if (resolved !== undefined) {
      return this.alerts.filter(alert => alert.resolved === resolved);
    }
    return this.alerts;
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      logger.info('Alert resolved', { alertId, metric: alert.metric });
    }
  }

  getSystemMetrics(): {
    memory: NodeJS.MemoryUsage;
    cpu: number;
    uptime: number;
    loadAvg: number[];
  } {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Calculate CPU usage (simplified)
    const startUsage = process.cpuUsage();
    const startTime = Date.now();
    
    // This is a simplified CPU calculation - in production, use more sophisticated methods
    const cpuUsage = 0; // Placeholder
    
    // Only use os module in Node.js environment
    const isNodeEnvironment = typeof window === 'undefined';
    let loadAvg = [0, 0, 0];
    
    if (isNodeEnvironment) {
      try {
        const os = require('os');
        loadAvg = os.loadavg();
      } catch (error) {
        // Fallback for browser environment
        loadAvg = [0, 0, 0];
      }
    }
    
    return {
      memory: memoryUsage,
      cpu: cpuUsage,
      uptime,
      loadAvg,
    };
  }

  private startMonitoring() {
    // Monitor system metrics every 30 seconds
    setInterval(() => {
      this.monitorSystemMetrics();
    }, 30000);

    // Monitor application metrics every 10 seconds
    setInterval(() => {
      this.monitorApplicationMetrics();
    }, 10000);
  }

  private monitorSystemMetrics() {
    const systemMetrics = this.getSystemMetrics();
    
    // Memory usage
    const memoryUsagePercent = (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100;
    this.recordMetric({
      name: 'memory_usage',
      value: memoryUsagePercent,
      timestamp: Date.now(),
      tags: { type: 'heap' },
      metadata: systemMetrics.memory,
    });

    // CPU usage (simplified)
    this.recordMetric({
      name: 'cpu_usage',
      value: systemMetrics.loadAvg[0] * 10, // Convert to percentage approximation
      timestamp: Date.now(),
      tags: { type: 'load_average' },
      metadata: { loadAvg: systemMetrics.loadAvg },
    });
  }

  private monitorApplicationMetrics() {
    // These would be populated by actual application monitoring
    // For now, we'll create placeholder metrics
    
    // Request rate (would be calculated from actual requests)
    this.recordMetric({
      name: 'request_rate',
      value: Math.random() * 100, // Placeholder
      timestamp: Date.now(),
      tags: { type: 'per_minute' },
    });

    // Error rate (would be calculated from actual errors)
    this.recordMetric({
      name: 'error_rate',
      value: Math.random() * 5, // Placeholder
      timestamp: Date.now(),
      tags: { type: 'per_minute' },
    });
  }

  // API for external monitoring
  getDashboardData() {
    const lastHour = Date.now() - 3600000;
    
    return {
      metrics: this.getMetrics(undefined, 3600),
      alerts: this.getAlerts(false),
      system: this.getSystemMetrics(),
      thresholds: Array.from(this.thresholds.entries()),
      summary: {
        totalAlerts: this.alerts.length,
        activeAlerts: this.getAlerts(false).length,
        resolvedAlerts: this.getAlerts(true).length,
      },
    };
  }
}

// API performance tracker
export class APIPerformanceTracker {
  private static instance: APIPerformanceTracker;
  private endpoints: Map<string, { count: number; totalTime: number; errors: number }> = new Map();

  static getInstance(): APIPerformanceTracker {
    if (!APIPerformanceTracker.instance) {
      APIPerformanceTracker.instance = new APIPerformanceTracker();
    }
    return APIPerformanceTracker.instance;
  }

  recordEndpoint(endpoint: string, method: string, duration: number, status: number) {
    const key = `${method} ${endpoint}`;
    
    if (!this.endpoints.has(key)) {
      this.endpoints.set(key, { count: 0, totalTime: 0, errors: 0 });
    }

    const data = this.endpoints.get(key)!;
    data.count++;
    data.totalTime += duration;
    
    if (status >= 400) {
      data.errors++;
    }

    // Record to performance monitor
    performanceMonitor.recordMetric({
      name: 'api_response_time',
      value: duration,
      timestamp: Date.now(),
      tags: { endpoint, method },
      metadata: { status },
    });
  }

  getEndpointStats(endpoint?: string) {
    if (endpoint) {
      return Array.from(this.endpoints.entries())
        .filter(([key]) => key.includes(endpoint))
        .map(([key, data]) => ({
          endpoint: key,
          avgResponseTime: data.totalTime / data.count,
          totalRequests: data.count,
          errorRate: (data.errors / data.count) * 100,
        }));
    }

    return Array.from(this.endpoints.entries()).map(([key, data]) => ({
      endpoint: key,
      avgResponseTime: data.totalTime / data.count,
      totalRequests: data.count,
      errorRate: (data.errors / data.count) * 100,
    }));
  }
}

// Database performance tracker
export class DatabasePerformanceTracker {
  private static instance: DatabasePerformanceTracker;
  private queries: Map<string, { count: number; totalTime: number; errors: number }> = new Map();

  static getInstance(): DatabasePerformanceTracker {
    if (!DatabasePerformanceTracker.instance) {
      DatabasePerformanceTracker.instance = new DatabasePerformanceTracker();
    }
    return DatabasePerformanceTracker.instance;
  }

  recordQuery(query: string, duration: number, error?: Error) {
    const key = query.substring(0, 50) + (query.length > 50 ? '...' : '');
    
    if (!this.queries.has(key)) {
      this.queries.set(key, { count: 0, totalTime: 0, errors: 0 });
    }

    const data = this.queries.get(key)!;
    data.count++;
    data.totalTime += duration;
    
    if (error) {
      data.errors++;
    }

    // Record to performance monitor
    performanceMonitor.recordMetric({
      name: 'db_query_time',
      value: duration,
      timestamp: Date.now(),
      tags: { query: key },
      metadata: { error: !!error },
    });
  }

  getQueryStats() {
    return Array.from(this.queries.entries()).map(([query, data]) => ({
      query,
      avgDuration: data.totalTime / data.count,
      totalQueries: data.count,
      errorRate: (data.errors / data.count) * 100,
    }));
  }
}

// External service performance tracker
export class ExternalServiceTracker {
  private static instance: ExternalServiceTracker;
  private services: Map<string, { count: number; totalTime: number; errors: number }> = new Map();

  static getInstance(): ExternalServiceTracker {
    if (!ExternalServiceTracker.instance) {
      ExternalServiceTracker.instance = new ExternalServiceTracker();
    }
    return ExternalServiceTracker.instance;
  }

  recordServiceCall(service: string, endpoint: string, duration: number, error?: Error) {
    const key = `${service}:${endpoint}`;
    
    if (!this.services.has(key)) {
      this.services.set(key, { count: 0, totalTime: 0, errors: 0 });
    }

    const data = this.services.get(key)!;
    data.count++;
    data.totalTime += duration;
    
    if (error) {
      data.errors++;
    }

    // Record to performance monitor
    performanceMonitor.recordMetric({
      name: 'external_service_response_time',
      value: duration,
      timestamp: Date.now(),
      tags: { service, endpoint },
      metadata: { error: !!error },
    });
  }

  getServiceStats(service?: string) {
    if (service) {
      return Array.from(this.services.entries())
        .filter(([key]) => key.startsWith(service))
        .map(([key, data]) => ({
          service: key,
          avgResponseTime: data.totalTime / data.count,
          totalCalls: data.count,
          errorRate: (data.errors / data.count) * 100,
        }));
    }

    return Array.from(this.services.entries()).map(([key, data]) => ({
      service: key,
      avgResponseTime: data.totalTime / data.count,
      totalCalls: data.count,
      errorRate: (data.errors / data.count) * 100,
    }));
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const apiPerformanceTracker = APIPerformanceTracker.getInstance();
export const dbPerformanceTracker = DatabasePerformanceTracker.getInstance();
export const externalServiceTracker = ExternalServiceTracker.getInstance();