import axios from 'axios';
import * as rax from 'retry-axios';
import { CircuitBreaker, CircuitBreakerOptions } from 'opossum';
import { errorTracker, logger } from './error-monitoring';

// Configure retry-axios
const retryClient = axios.create();
rax.attach(retryClient, {
  retries: 3,
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  retryCondition: (error) => {
    return error.code === 'ECONNREFUSED' || (error.response?.status ?? 0) >= 500;
  },
});

// Circuit breaker configuration
const CIRCUIT_BREAKER_OPTIONS: CircuitBreakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  volumeThreshold: 10,
  errorFilter: (error: any) => {
    // Don't count 4xx errors against circuit breaker
    return error.response?.status < 400 || error.response?.status >= 500;
  },
};

// Service health status
interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  responseTime?: number;
  errorRate?: number;
}

class ServiceHealthMonitor {
  private services: Map<string, ServiceHealth> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor() {
    // Initialize circuit breakers for common services
    this.initializeCircuitBreakers();
  }

  private initializeCircuitBreakers() {
    const services = [
      'database',
      'external-api',
      'file-storage',
      'cache',
      'email-service',
      'auth-service',
      'payment-gateway',
      'notification-service',
    ];

    services.forEach(service => {
      const breaker = new CircuitBreaker(
        () => this.performHealthCheck(service),
        {
          ...CIRCUIT_BREAKER_OPTIONS,
          name: service,
        }
      );

      breaker.on('open', () => {
        logger.error(`Circuit breaker opened for ${service}`);
        errorTracker.captureMessage(`Circuit breaker opened for ${service}`, 'error');
      });

      breaker.on('halfOpen', () => {
        logger.warn(`Circuit breaker half-open for ${service}`);
      });

      breaker.on('close', () => {
        logger.info(`Circuit breaker closed for ${service}`);
      });

      this.circuitBreakers.set(service, breaker);
    });
  }

  private async performHealthCheck(service: string): Promise<boolean> {
    try {
      switch (service) {
        case 'database':
          return await this.checkDatabaseHealth();
        case 'external-api':
          return await this.checkExternalAPIHealth();
        case 'file-storage':
          return await this.checkFileStorageHealth();
        case 'cache':
          return await this.checkCacheHealth();
        case 'email-service':
          return await this.checkEmailServiceHealth();
        default:
          return true;
      }
    } catch (error) {
      logger.error(`Health check failed for ${service}`, { error });
      return false;
    }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    // Implement actual database health check
    try {
      // This would typically involve a simple query
      return true;
    } catch {
      return false;
    }
  }

  private async checkExternalAPIHealth(): Promise<boolean> {
    try {
      const response = await retryClient.get('/api/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  private async checkFileStorageHealth(): Promise<boolean> {
    // Implement file storage health check
    return true;
  }

  private async checkCacheHealth(): Promise<boolean> {
    // Implement cache health check
    return true;
  }

  private async checkEmailServiceHealth(): Promise<boolean> {
    // Implement email service health check
    return true;
  }

  async getServiceHealth(service: string): Promise<ServiceHealth> {
    const breaker = this.circuitBreakers.get(service);
    if (!breaker) {
      throw new Error(`Service ${service} not found`);
    }

    const startTime = Date.now();
    let status: ServiceHealth['status'] = 'healthy';
    let errorRate = 0;

    try {
      const isHealthy = await breaker.fire();
      status = isHealthy ? 'healthy' : 'unhealthy';
      errorRate = breaker.stats.failures / (breaker.stats.fires || 1);
    } catch (error) {
      status = 'unhealthy';
      errorRate = 1;
    }

    const health: ServiceHealth = {
      name: service,
      status,
      lastCheck: new Date(),
      responseTime: Date.now() - startTime,
      errorRate,
    };

    this.services.set(service, health);
    return health;
  }

  async getAllServiceHealth(): Promise<ServiceHealth[]> {
    const services = Array.from(this.circuitBreakers.keys());
    const healthChecks = await Promise.all(
      services.map(service => this.getServiceHealth(service))
    );
    return healthChecks;
  }
}

// Error recovery strategies
export class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager;
  private healthMonitor: ServiceHealthMonitor;

  private constructor() {
    this.healthMonitor = new ServiceHealthMonitor();
  }

  static getInstance(): ErrorRecoveryManager {
    if (!ErrorRecoveryManager.instance) {
      ErrorRecoveryManager.instance = new ErrorRecoveryManager();
    }
    return ErrorRecoveryManager.instance;
  }

  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    options: {
      service: string;
      retries?: number;
      backoff?: number;
      fallback?: () => T | Promise<T>;
      timeout?: number;
    }
  ): Promise<T> {
    const {
      service,
      retries = 3,
      backoff = 1000,
      fallback,
      timeout = 5000,
    } = options;

    // Check service health first
    const health = await this.healthMonitor.getServiceHealth(service);
    if (health.status === 'unhealthy') {
      logger.warn(`Service ${service} is unhealthy, using fallback`);
      if (fallback) {
        return await fallback();
      }
      throw new Error(`Service ${service} is unavailable`);
    }

    const breaker = this.healthMonitor.circuitBreakers.get(service);
    if (breaker) {
      try {
        return await breaker.fire(operation);
      } catch (error) {
        logger.warn(`Circuit breaker triggered for ${service}`, { error });
        if (fallback) {
          return await fallback();
        }
        throw error;
      }
    }

    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.executeWithTimeout(operation, timeout);
        
        // Log successful recovery
        if (attempt > 1) {
          logger.info(`Operation succeeded after ${attempt} attempts`, {
            service,
            attempt,
          });
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        
        logger.warn(`Operation failed, attempt ${attempt}/${retries}`, {
          service,
          attempt,
          error: lastError.message,
        });

        if (attempt === retries) {
          break;
        }

        // Exponential backoff
        const delay = backoff * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All retries failed, try fallback
    if (fallback) {
      logger.warn(`All retries failed for ${service}, using fallback`);
      return await fallback();
    }

    throw lastError!;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      ),
    ]);
  }

  async getRecoveryStatus() {
    const services = await this.healthMonitor.getAllServiceHealth();
    const circuitStates = Array.from(this.healthMonitor.circuitBreakers.entries()).reduce((acc, [service, breaker]) => {
      acc[service] = {
        state: breaker.opened ? 'open' : breaker.pendingClose ? 'half-open' : 'closed',
        stats: breaker.stats,
      };
      return acc;
    }, {} as Record<string, any>);

    return {
      services,
      circuitStates,
      timestamp: new Date().toISOString(),
      overallHealth: services.every(s => s.status === 'healthy') ? 'healthy' : 
                    services.some(s => s.status === 'unhealthy') ? 'unhealthy' : 'degraded',
    };
  }

  async resetService(service: string) {
    const breaker = this.healthMonitor.circuitBreakers.get(service);
    if (breaker) {
      breaker.close();
      logger.info(`Circuit breaker reset for ${service}`);
    }
    
    const health = await this.healthMonitor.getServiceHealth(service);
    health.status = 'healthy';
    this.healthMonitor.services.set(service, health);
    
    logger.info(`Service ${service} reset completed`);
  }

  async resetAllServices() {
    const services = Array.from(this.healthMonitor.circuitBreakers.keys());
    await Promise.all(services.map(service => this.resetService(service)));
    logger.info('All services reset completed');
  }
}

// Database recovery utilities
export class DatabaseRecovery {
  static async retryConnection(retries = 3, delay = 1000): Promise<boolean> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Implement actual database connection test
        return true;
      } catch (error) {
        logger.warn(`Database connection failed, attempt ${attempt}/${retries}`, { error });
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    return false;
  }

  static async handleConnectionPoolIssues(): Promise<void> {
    // Implement connection pool recovery
    logger.info('Attempting database connection pool recovery');
  }
}

// API recovery utilities
export class APIRecovery {
  static async retryRequest<T>(
    request: () => Promise<T>,
    options: { retries?: number; backoff?: number } = {}
  ): Promise<T> {
    const { retries = 3, backoff = 1000 } = options;
    
    return retryClient.request({
      ...request,
      'axios-retry': {
        retries,
        retryDelay: (retryCount) => backoff * Math.pow(2, retryCount - 1),
      },
    });
  }
}

// Export singleton instances
export const errorRecovery = ErrorRecoveryManager.getInstance();
export const healthMonitor = new ServiceHealthMonitor();