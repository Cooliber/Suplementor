'use client'

import dayjs from 'dayjs'
import { Download, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { IntakeDragBoard } from '@/components/IntakeDragBoard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useUserProfile } from '@/lib/userProfileStore'
import { cn } from '@/lib/utils'

interface DailyLog {
  id: string
  date: string
  sleepQuality: number
  energyLevel: number
  focusLevel: number
  moodLevel: number
  stressLevel: number
  notes: string
  supplementsTaken: string[]
  sideEffects: string[]
}

interface StackProgress {
  stackId: string
  stackName: string
  startDate: string
  currentDay: number
  totalDays: number
  dailyLogs: DailyLog[]
  averageMetrics: {
    sleepQuality: number
    energyLevel: number
    focusLevel: number
    moodLevel: number
    stressLevel: number
  }
  improvements: {
    sleepQuality: number
    energyLevel: number
    focusLevel: number
    moodLevel: number
    stressLevel: number
  }
}

interface StackProgressProps {
  stackId: string
  stackName: string
  totalDays: number
}

/**
 *
 */
export const StackProgress = ({ stackId, stackName, totalDays }: StackProgressProps) => {
  const profile = useUserProfile()
  const [progress, setProgress] = useState<StackProgress>({
    stackId,
    stackName,
    startDate: dayjs().format('YYYY-MM-DD'),
    currentDay: 1,
    totalDays,
    dailyLogs: [],
    averageMetrics: {
      sleepQuality: 0,
      energyLevel: 0,
      focusLevel: 0,
      moodLevel: 0,
      stressLevel: 0
    },
    improvements: {
      sleepQuality: 0,
      energyLevel: 0,
      focusLevel: 0,
      moodLevel: 0,
      stressLevel: 0
    }
  })

  const [showAddLog, setShowAddLog] = useState(false)
  const [newLog, setNewLog] = useState<DailyLog>({
    id: Date.now().toString(),
    date: dayjs().format('YYYY-MM-DD'),
    sleepQuality: 7,
    energyLevel: 7,
    focusLevel: 7,
    moodLevel: 7,
    stressLevel: 4,
    notes: '',
    supplementsTaken: profile.goals ?? [], // Prefill with user goals
    sideEffects: profile.conditions ?? [] // Show conditions as potential side effects to monitor
  })

  const [supplements, setSupplements] = useState<string[]>([
    'L-teanina',
    'Magnez L-treonian',
    'Alfa-GPC',
    'Różeniec górski',
    'Ashwagandha'
  ])

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`stack-progress-${stackId}`)
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress) as unknown as StackProgress)
      } catch (error) {
        console.error('Failed to parse saved progress:', error)
      }
    }
  }, [stackId])

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem(`stack-progress-${stackId}`, JSON.stringify(progress))
  }, [progress, stackId])

  const calculateAverages = (logs: DailyLog[]) => {
    if (logs.length === 0)
      return {
        sleepQuality: 0,
        energyLevel: 0,
        focusLevel: 0,
        moodLevel: 0,
        stressLevel: 0
      }

    const totals = logs.reduce(
      (acc, log) => ({
        sleepQuality: acc.sleepQuality + log.sleepQuality,
        energyLevel: acc.energyLevel + log.energyLevel,
        focusLevel: acc.focusLevel + log.focusLevel,
        moodLevel: acc.moodLevel + log.moodLevel,
        stressLevel: acc.stressLevel + log.stressLevel
      }),
      { sleepQuality: 0, energyLevel: 0, focusLevel: 0, moodLevel: 0, stressLevel: 0 }
    )

    return {
      sleepQuality: Math.round((totals.sleepQuality / logs.length) * 10) / 10,
      energyLevel: Math.round((totals.energyLevel / logs.length) * 10) / 10,
      focusLevel: Math.round((totals.focusLevel / logs.length) * 10) / 10,
      moodLevel: Math.round((totals.moodLevel / logs.length) * 10) / 10,
      stressLevel: Math.round((totals.stressLevel / logs.length) * 10) / 10
    }
  }

  const calculateImprovements = (logs: DailyLog[]) => {
    if (logs.length < 7)
      return {
        sleepQuality: 0,
        energyLevel: 0,
        focusLevel: 0,
        moodLevel: 0,
        stressLevel: 0
      }

    const firstWeek = logs.slice(0, 7)
    const lastWeek = logs.slice(-7)

    const firstWeekAvg = calculateAverages(firstWeek)
    const lastWeekAvg = calculateAverages(lastWeek)

    return {
      sleepQuality:
        Math.round((lastWeekAvg.sleepQuality - firstWeekAvg.sleepQuality) * 10) / 10,
      energyLevel:
        Math.round((lastWeekAvg.energyLevel - firstWeekAvg.energyLevel) * 10) / 10,
      focusLevel:
        Math.round((lastWeekAvg.focusLevel - firstWeekAvg.focusLevel) * 10) / 10,
      moodLevel: Math.round((lastWeekAvg.moodLevel - firstWeekAvg.moodLevel) * 10) / 10,
      stressLevel:
        Math.round((firstWeekAvg.stressLevel - lastWeekAvg.stressLevel) * 10) / 10
    }
  }

  const addDailyLog = () => {
    const updatedLogs = [...progress.dailyLogs, newLog].sort((a, b) =>
      dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1
    )

    const averageMetrics = calculateAverages(updatedLogs)
    const improvements = calculateImprovements(updatedLogs)

    setProgress((prev) => ({
      ...prev,
      dailyLogs: updatedLogs,
      currentDay: updatedLogs.length + 1,
      averageMetrics,
      improvements
    }))

    setShowAddLog(false)
    setNewLog({
      id: Date.now().toString(),
      date: dayjs().format('YYYY-MM-DD'),
      sleepQuality: 7,
      energyLevel: 7,
      focusLevel: 7,
      moodLevel: 7,
      stressLevel: 4,
      notes: '',
      supplementsTaken: profile.goals ?? [],
      sideEffects: profile.conditions ?? []
    })
  }

  const exportData = () => {
    const data = {
      stackName,
      startDate: progress.startDate,
      totalDays,
      dailyLogs: progress.dailyLogs,
      averageMetrics: progress.averageMetrics,
      improvements: progress.improvements
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stack-progress-${stackName}-${new Date().toISOString().split('T')[0]!}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getProgressPercentage = () =>
    Math.min((progress.currentDay / totalDays) * 100, 100)

  const getMetricColor = (value: number, inverse: boolean = false) => {
    const normalizedValue = inverse ? 10 - value : value
    if (normalizedValue >= 8) return 'text-green-600'
    if (normalizedValue >= 6) return 'text-yellow-600'
    if (normalizedValue >= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  const getImprovementColor = (value: number, inverse: boolean = false) => {
    const normalizedValue = inverse ? -value : value
    if (normalizedValue > 0) return 'text-green-600'
    if (normalizedValue < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Postęp Stacka</CardTitle>
                <CardDescription>
                  {stackName} - Dzień {progress.currentDay} z {totalDays}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowAddLog(true)}
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Dodaj log
                </Button>
                <Button
                  onClick={exportData}
                  size="sm"
                  variant="secondary"
                  className="flex items-center"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Eksportuj
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {getProgressPercentage().toFixed(1)}% ukończone
            </p>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {[
            {
              label: 'Jakość snu',
              value: progress.averageMetrics.sleepQuality,
              improvement: progress.improvements.sleepQuality,
              icon: '😴'
            },
            {
              label: 'Energia',
              value: progress.averageMetrics.energyLevel,
              improvement: progress.improvements.energyLevel,
              icon: '⚡'
            },
            {
              label: 'Skupienie',
              value: progress.averageMetrics.focusLevel,
              improvement: progress.improvements.focusLevel,
              icon: '🎯'
            },
            {
              label: 'Nastrój',
              value: progress.averageMetrics.moodLevel,
              improvement: progress.improvements.moodLevel,
              icon: '😊'
            },
            {
              label: 'Stres',
              value: progress.averageMetrics.stressLevel,
              improvement: progress.improvements.stressLevel,
              icon: '😰',
              inverse: true
            }
          ].map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="mb-2 text-2xl">{metric.icon}</div>
                  <div
                    className={`text-2xl font-bold ${getMetricColor(metric.value, metric.inverse)}`}
                  >
                    {metric.value.toFixed(1)}/10
                  </div>
                  <div className="text-muted-foreground text-sm">{metric.label}</div>
                  {metric.improvement !== 0 && (
                    <div
                      className={`text-xs ${getImprovementColor(metric.improvement, metric.inverse)}`}
                    >
                      {metric.improvement > 0 ? '+' : ''}
                      {metric.improvement.toFixed(1)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie wpisy</CardTitle>
          </CardHeader>
          <CardContent>
            {progress.dailyLogs.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                Brak wpisów. Dodaj swój pierwszy log!
              </p>
            ) : (
              <div className="space-y-3">
                {progress.dailyLogs
                  .slice(-5)
                  .reverse()
                  .map((log) => (
                    <div key={log.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-medium">
                          {dayjs(log.date).format('DD.MM.YYYY')}
                        </span>
                        <TooltipProvider>
                          <div className="flex space-x-2 text-sm">
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  className={cn(
                                    'cursor-help',
                                    getMetricColor(log.sleepQuality)
                                  )}
                                >
                                  😴 {log.sleepQuality}/10
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Jakość snu: Ocena regeneracji nocnej na podstawie
                                  głębokości snu i czasu trwania
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  className={cn(
                                    'cursor-help',
                                    getMetricColor(log.energyLevel)
                                  )}
                                >
                                  ⚡ {log.energyLevel}/10
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Poziom energii: Subiektywna ocena witalności i gotowości
                                  do działania przez cały dzień
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  className={cn(
                                    'cursor-help',
                                    getMetricColor(log.focusLevel)
                                  )}
                                >
                                  🎯 {log.focusLevel}/10
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Skupienie: Zdolność do koncentracji i utrzymania uwagi
                                  na zadaniach poznawczych
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                      {log.notes && (
                        <p className="text-muted-foreground text-sm">{log.notes}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Dodaj dzienny log</h3>
              <button
                onClick={() => setShowAddLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) =>
                    setNewLog((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {[
                { label: 'Jakość snu', field: 'sleepQuality', max: 10 },
                { label: 'Poziom energii', field: 'energyLevel', max: 10 },
                { label: 'Skupienie', field: 'focusLevel', max: 10 },
                { label: 'Nastrój', field: 'moodLevel', max: 10 },
                { label: 'Poziom stresu', field: 'stressLevel', max: 10 }
              ].map((metric) => (
                <div key={metric.field}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {metric.label} (1-{metric.max})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={metric.max}
                    value={newLog[metric.field as keyof DailyLog] as number}
                    onChange={(e) =>
                      setNewLog((prev) => ({
                        ...prev,
                        [metric.field]: parseInt(e.target.value)
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    {newLog[metric.field as keyof DailyLog] as number}/{metric.max}
                  </div>
                </div>
              ))}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Notatki
                </label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) =>
                    setNewLog((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full rounded border px-3 py-2"
                  rows={3}
                  placeholder="Jak się czułeś dzisiaj? Jakie obserwacje?"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={addDailyLog}
                  className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                  Zapisz
                </button>
                <button
                  onClick={() => setShowAddLog(false)}
                  className="flex-1 rounded bg-gray-300 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <IntakeDragBoard />
      </div>
    </TooltipProvider>
  )
}
