import {
  BaseSupplement,
  SupplementLog,
  AIRecommendation,
  PerformanceMetric,
  Alert,
  validateSupplement,
  validateSupplementLog,
  validateAIRecommendation,
  sanitizeSupplementInput,
  sanitizeSupplementLogInput
} from '@/types/supplement'

// Storage keys
const STORAGE_KEYS = {
  SUPPLEMENTS: 'supplements',
  SUPPLEMENT_LOGS: 'supplement_logs',
  AI_RECOMMENDATIONS: 'ai_recommendations',
  PERFORMANCE_METRICS: 'performance_metrics',
  ALERTS: 'alerts',
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC: 'last_sync_timestamp',
  BACKUP_TIMESTAMP: 'backup_timestamp'
} as const

// Storage configuration
const STORAGE_CONFIG = {
  ENCRYPTION_KEY: 'supplement_tracker_key',
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
  COMPRESSION_THRESHOLD: 100 * 1024, // 100KB
  BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  SYNC_INTERVAL: 5 * 60 * 1000 // 5 minutes
}

// Error types
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

// Storage result types
export type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: StorageError }

// Storage interface
export interface StorageAdapter {
  get<T>(key: string): Promise<StorageResult<T>>
  set<T>(key: string, data: T): Promise<StorageResult<void>>
  remove(key: string): Promise<StorageResult<void>>
  clear(): Promise<StorageResult<void>>
  getSize(): Promise<number>
}

// LocalStorage adapter with error handling
class LocalStorageAdapter implements StorageAdapter {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  private checkStorageQuota(): boolean {
    try {
      const used = this.getUsedStorage()
      return used < STORAGE_CONFIG.MAX_STORAGE_SIZE
    } catch {
      return false
    }
  }

  private getUsedStorage(): number {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length
      }
    }
    return total
  }

  private serialize<T>(data: T): string {
    try {
      const result = JSON.stringify(data)
      if (typeof result !== 'string') {
        throw new StorageError('Data cannot be serialized to string', 'SERIALIZE_ERROR')
      }
      return result
    } catch (error) {
      throw new StorageError('Failed to serialize data', 'SERIALIZE_ERROR', error)
    }
  }

  private deserialize<T>(data: string): T {
    try {
      return JSON.parse(data) as unknown as T
    } catch (error) {
      throw new StorageError('Failed to deserialize data', 'DESERIALIZE_ERROR', error)
    }
  }

  async get<T>(key: string): Promise<StorageResult<T>> {
    try {
      if (!this.isAvailable()) {
        throw new StorageError('LocalStorage is not available', 'STORAGE_UNAVAILABLE')
      }

      const item = localStorage.getItem(key)
      if (item === null) {
        return { success: true, data: null as unknown as T }
      }

      const data = this.deserialize<T>(item)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof StorageError
            ? error
            : new StorageError('Failed to get data', 'GET_ERROR', error)
      }
    }
  }

  async set<T>(key: string, data: T): Promise<StorageResult<void>> {
    try {
      if (!this.isAvailable()) {
        throw new StorageError('LocalStorage is not available', 'STORAGE_UNAVAILABLE')
      }

      if (!this.checkStorageQuota()) {
        throw new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED')
      }

      const serialized = this.serialize(data)
      localStorage.setItem(key, serialized)

      // Update last sync timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())

      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof StorageError
            ? error
            : new StorageError('Failed to set data', 'SET_ERROR', error)
      }
    }
  }

  async remove(key: string): Promise<StorageResult<void>> {
    try {
      if (!this.isAvailable()) {
        throw new StorageError('LocalStorage is not available', 'STORAGE_UNAVAILABLE')
      }

      localStorage.removeItem(key)
      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: new StorageError('Failed to remove data', 'REMOVE_ERROR', error)
      }
    }
  }

  async clear(): Promise<StorageResult<void>> {
    try {
      if (!this.isAvailable()) {
        throw new StorageError('LocalStorage is not available', 'STORAGE_UNAVAILABLE')
      }

      localStorage.clear()
      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: new StorageError('Failed to clear storage', 'CLEAR_ERROR', error)
      }
    }
  }

  async getSize(): Promise<number> {
    try {
      return this.isAvailable() ? this.getUsedStorage() : 0
    } catch {
      return 0
    }
  }
}

// Data manager with validation and error handling
export class SupplementDataManager {
  private storage: StorageAdapter
  private listeners: Map<string, Array<(data: any) => void>> = new Map()

  constructor(storageAdapter: StorageAdapter = new LocalStorageAdapter()) {
    this.storage = storageAdapter
    this.setupAutoBackup()
  }

  // Event handling
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)

    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in storage event listener:', error)
        }
      })
    }
  }

  // Supplement operations
  async getSupplements(): Promise<StorageResult<BaseSupplement[]>> {
    const result = await this.storage.get<BaseSupplement[]>(STORAGE_KEYS.SUPPLEMENTS)
    if (result.success) {
      const validSupplements = (result.data || []).filter((supplement) => {
        const validation = validateSupplement(supplement)
        return validation.success
      })
      return { success: true, data: validSupplements }
    }
    return result
  }

  async addSupplement(
    supplement: BaseSupplement
  ): Promise<StorageResult<BaseSupplement>> {
    const validation = validateSupplement(supplement)
    if (!validation.success) {
      return {
        success: false,
        error: new StorageError(
          'Invalid supplement data',
          'VALIDATION_ERROR',
          validation.error
        )
      }
    }

    const sanitized = sanitizeSupplementInput(supplement)
    const current = await this.getSupplements()

    if (!current.success) {
      return current
    }

    const supplements = [...current.data, sanitized as BaseSupplement]
    const saveResult = await this.storage.set(STORAGE_KEYS.SUPPLEMENTS, supplements)

    if (saveResult.success) {
      this.emit('supplements:changed', supplements)
    }

    return saveResult.success
      ? { success: true, data: sanitized as BaseSupplement }
      : saveResult
  }

  async updateSupplement(
    id: string,
    updates: Partial<BaseSupplement>
  ): Promise<StorageResult<BaseSupplement>> {
    const current = await this.getSupplements()
    if (!current.success) {
      return current
    }

    const index = current.data.findIndex((s) => s.id === id)
    if (index === -1) {
      return {
        success: false,
        error: new StorageError('Supplement not found', 'NOT_FOUND')
      }
    }

    const updated = { ...current.data[index], ...updates }
    const validation = validateSupplement(updated)
    if (!validation.success) {
      return {
        success: false,
        error: new StorageError(
          'Invalid supplement data',
          'VALIDATION_ERROR',
          validation.error
        )
      }
    }

    const sanitized = sanitizeSupplementInput(updated)
    const supplements = [...current.data]
    supplements[index] = sanitized as BaseSupplement

    const saveResult = await this.storage.set(STORAGE_KEYS.SUPPLEMENTS, supplements)

    if (saveResult.success) {
      this.emit('supplements:changed', supplements)
    }

    return saveResult.success
      ? { success: true, data: sanitized as BaseSupplement }
      : saveResult
  }

  async deleteSupplement(id: string): Promise<StorageResult<void>> {
    const current = await this.getSupplements()
    if (!current.success) {
      return current
    }

    const supplements = current.data.filter((s) => s.id !== id)
    const saveResult = await this.storage.set(STORAGE_KEYS.SUPPLEMENTS, supplements)

    if (saveResult.success) {
      this.emit('supplements:changed', supplements)
      // Also delete related logs
      await this.deleteSupplementLogs(id)
    }

    return saveResult
  }

  // Supplement log operations
  async getSupplementLogs(
    supplementId?: string
  ): Promise<StorageResult<SupplementLog[]>> {
    const result = await this.storage.get<SupplementLog[]>(STORAGE_KEYS.SUPPLEMENT_LOGS)
    if (result.success) {
      const validLogs = (result.data || []).filter((log) => {
        const validation = validateSupplementLog(log)
        return validation.success
      })

      const filteredLogs = supplementId
        ? validLogs.filter((log) => log.supplementId === supplementId)
        : validLogs

      return { success: true, data: filteredLogs }
    }
    return result
  }

  async addSupplementLog(log: SupplementLog): Promise<StorageResult<SupplementLog>> {
    const validation = validateSupplementLog(log)
    if (!validation.success) {
      return {
        success: false,
        error: new StorageError(
          'Invalid supplement log data',
          'VALIDATION_ERROR',
          validation.error
        )
      }
    }

    const sanitized = sanitizeSupplementLogInput(log)
    const current = await this.getSupplementLogs()

    if (!current.success) {
      return current
    }

    const logs = [...current.data, sanitized as SupplementLog]
    const saveResult = await this.storage.set(STORAGE_KEYS.SUPPLEMENT_LOGS, logs)

    if (saveResult.success) {
      this.emit('logs:changed', logs)
    }

    return saveResult.success
      ? { success: true, data: sanitized as SupplementLog }
      : saveResult
  }

  async deleteSupplementLogs(supplementId: string): Promise<StorageResult<void>> {
    const current = await this.getSupplementLogs()
    if (!current.success) {
      return current
    }

    const logs = current.data.filter((log) => log.supplementId !== supplementId)
    const saveResult = await this.storage.set(STORAGE_KEYS.SUPPLEMENT_LOGS, logs)

    if (saveResult.success) {
      this.emit('logs:changed', logs)
    }

    return saveResult
  }

  // AI recommendations
  async getAIRecommendations(): Promise<StorageResult<AIRecommendation[]>> {
    return this.storage.get<AIRecommendation[]>(STORAGE_KEYS.AI_RECOMMENDATIONS)
  }

  async setAIRecommendations(
    recommendations: AIRecommendation[]
  ): Promise<StorageResult<void>> {
    const saveResult = await this.storage.set(
      STORAGE_KEYS.AI_RECOMMENDATIONS,
      recommendations
    )
    if (saveResult.success) {
      this.emit('recommendations:changed', recommendations)
    }
    return saveResult
  }

  // Performance metrics
  async getPerformanceMetrics(): Promise<StorageResult<PerformanceMetric[]>> {
    return this.storage.get<PerformanceMetric[]>(STORAGE_KEYS.PERFORMANCE_METRICS)
  }

  async addPerformanceMetric(
    metric: PerformanceMetric
  ): Promise<StorageResult<PerformanceMetric>> {
    const current = await this.getPerformanceMetrics()
    if (!current.success) {
      return current
    }

    const metrics = [...current.data, metric]
    const saveResult = await this.storage.set(STORAGE_KEYS.PERFORMANCE_METRICS, metrics)

    if (saveResult.success) {
      this.emit('metrics:changed', metrics)
    }

    return saveResult.success ? { success: true, data: metric } : saveResult
  }

  // Alerts
  async getAlerts(): Promise<StorageResult<Alert[]>> {
    return this.storage.get<Alert[]>(STORAGE_KEYS.ALERTS)
  }

  async addAlert(alert: Alert): Promise<StorageResult<Alert>> {
    const current = await this.getAlerts()
    if (!current.success) {
      return current
    }

    const alerts = [...current.data, alert]
    const saveResult = await this.storage.set(STORAGE_KEYS.ALERTS, alerts)

    if (saveResult.success) {
      this.emit('alerts:changed', alerts)
    }

    return saveResult.success ? { success: true, data: alert } : saveResult
  }

  // Backup and restore
  async createBackup(): Promise<StorageResult<Record<string, any>>> {
    try {
      const backup: Record<string, any> = {}

      for (const storageKey in STORAGE_KEYS) {
        const key = STORAGE_KEYS[storageKey as keyof typeof STORAGE_KEYS]
        const result = await this.storage.get<any>(key)
        if (result.success) {
          backup[key] = result.data
        }
      }

      backup[STORAGE_KEYS.BACKUP_TIMESTAMP] = new Date().toISOString()

      return { success: true, data: backup }
    } catch (error) {
      return {
        success: false,
        error: new StorageError('Failed to create backup', 'BACKUP_ERROR', error)
      }
    }
  }

  async restoreBackup(backup: Record<string, any>): Promise<StorageResult<void>> {
    try {
      for (const [storageKey, value] of Object.entries(backup)) {
        if (Object.values(STORAGE_KEYS).includes(storageKey)) {
          await this.storage.set<any>(storageKey, value)
        }
      }

      this.emit('backup:restored', backup)
      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: new StorageError('Failed to restore backup', 'RESTORE_ERROR', error)
      }
    }
  }

  // Utility methods
  async getStorageInfo(): Promise<{
    used: number
    available: number
    percentage: number
  }> {
    const used = await this.storage.getSize()
    const available = STORAGE_CONFIG.MAX_STORAGE_SIZE
    const percentage = Math.round((used / available) * 100)

    return { used, available, percentage }
  }

  async clearAllData(): Promise<StorageResult<void>> {
    const result = await this.storage.clear()
    if (result.success) {
      this.emit('storage:cleared', null)
    }
    return result
  }

  private setupAutoBackup(): void {
    // Create daily backup
    setInterval(async () => {
      try {
        await this.createBackup()
      } catch (error) {
        console.error('Auto backup failed:', error)
      }
    }, STORAGE_CONFIG.BACKUP_INTERVAL)
  }
}

// Export singleton instance
export const supplementDataManager = new SupplementDataManager()

// Hook for React components
export function useSupplementStorage() {
  return supplementDataManager
}
