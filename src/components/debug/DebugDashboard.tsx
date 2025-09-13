'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  AlertTriangle,
  Bug,
  Clock,
  Download,
  Filter,
  Trash2,
  TrendingUp,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  advancedDebugger,
  DebugLevel,
  DebugCategory,
  useComponentDebugger
} from '@/lib/advanced-debugging'

interface DebugEvent {
  id: string
  timestamp: Date
  level: DebugLevel
  category: DebugCategory
  message: string
  data?: any
  stack?: string
  userId?: string
  sessionId: string
}

const DebugDashboard: React.FC = () => {
  const { logInfo } = useComponentDebugger('DebugDashboard')
  const [events, setEvents] = useState<DebugEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<DebugLevel | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<DebugCategory | 'all'>('all')
  const [autoScroll, setAutoScroll] = useState(true)

  // Subscribe to debug events
  useEffect(() => {
    const unsubscribe = advancedDebugger.subscribe((newEvents) => {
      setEvents(newEvents)
    })

    return unsubscribe
  }, [])

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events]

    if (selectedLevel !== 'all') {
      filtered = filtered.filter((event) => event.level === selectedLevel)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [events, selectedLevel, selectedCategory])

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const perfEvents = events.filter((e) => e.category === DebugCategory.PERFORMANCE)
    const avgDuration =
      perfEvents.reduce((sum, e) => sum + (e.data?.duration || 0), 0) /
        perfEvents.length || 0
    const errorCount = events.filter((e) => e.level === DebugLevel.ERROR).length
    const warningCount = events.filter((e) => e.level === DebugLevel.WARN).length

    return {
      totalEvents: events.length,
      errorCount,
      warningCount,
      avgPerformance: avgDuration,
      supplementInteractions: events.filter(
        (e) => e.category === DebugCategory.SUPPLEMENT
      ).length
    }
  }, [events])

  const handleClearEvents = () => {
    advancedDebugger.clearEvents()
    logInfo('Debug events cleared')
  }

  const handleExportEvents = () => {
    const dataStr = advancedDebugger.exportEvents()
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `debug-events-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    logInfo('Debug events exported')
  }

  const getLevelColor = (level: DebugLevel) => {
    switch (level) {
      case DebugLevel.ERROR:
        return 'destructive'
      case DebugLevel.WARN:
        return 'secondary'
      case DebugLevel.INFO:
        return 'default'
      case DebugLevel.DEBUG:
        return 'outline'
      case DebugLevel.TRACE:
        return 'outline'
      default:
        return 'default'
    }
  }

  const getLevelName = (level: DebugLevel) => {
    switch (level) {
      case DebugLevel.ERROR:
        return 'ERROR'
      case DebugLevel.WARN:
        return 'WARN'
      case DebugLevel.INFO:
        return 'INFO'
      case DebugLevel.DEBUG:
        return 'DEBUG'
      case DebugLevel.TRACE:
        return 'TRACE'
      default:
        return 'UNKNOWN'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pl-PL', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  // Only show in development or when debug mode is enabled
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('debug-mode')) {
    return null
  }

  return (
    <>
      {/* Toggle button */}
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant={isVisible ? 'default' : 'outline'}
          size="sm"
          className="shadow-lg"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Debug
        </Button>
      </div>

      {/* Debug dashboard */}
      {isVisible && (
        <div className="bg-background fixed inset-4 z-40 flex flex-col rounded-lg border shadow-xl">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Bug className="h-5 w-5" />
                Debug Dashboard
              </h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleClearEvents}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Clear
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportEvents}>
                  <Download className="mr-1 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="events" className="flex h-full flex-col">
              <TabsList className="m-4 mb-2">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="supplements">Supplements</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden px-4">
                <TabsContent value="events" className="mt-0 h-full">
                  <div className="flex h-full flex-col gap-4">
                    {/* Filters */}
                    <div className="bg-muted flex items-center gap-4 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <Label>Filters:</Label>
                      </div>
                      <Select
                        value={selectedLevel.toString()}
                        onValueChange={(value) =>
                          setSelectedLevel(value === 'all' ? 'all' : parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value={DebugLevel.ERROR.toString()}>
                            Error
                          </SelectItem>
                          <SelectItem value={DebugLevel.WARN.toString()}>
                            Warning
                          </SelectItem>
                          <SelectItem value={DebugLevel.INFO.toString()}>Info</SelectItem>
                          <SelectItem value={DebugLevel.DEBUG.toString()}>
                            Debug
                          </SelectItem>
                          <SelectItem value={DebugLevel.TRACE.toString()}>
                            Trace
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) =>
                          setSelectedCategory(
                            value === 'all' ? 'all' : (value as DebugCategory)
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Object.values(DebugCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                        <Label>Auto-scroll</Label>
                      </div>
                      <div className="text-muted-foreground ml-auto text-sm">
                        {filteredEvents.length} of {events.length} events
                      </div>
                    </div>

                    {/* Events list */}
                    <div className="min-h-0 flex-1">
                      <ScrollArea className="h-full">
                        <div className="space-y-2">
                          {filteredEvents.map((event) => (
                            <Card key={event.id} className="p-3">
                              <div className="flex items-start gap-3">
                                <Badge
                                  variant={getLevelColor(event.level)}
                                  className="mt-0.5"
                                >
                                  {getLevelName(event.level)}
                                </Badge>
                                <Badge variant="outline" className="mt-0.5">
                                  {event.category}
                                </Badge>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {event.message}
                                    </span>
                                    <span className="text-muted-foreground ml-auto text-xs">
                                      {formatTimestamp(event.timestamp)}
                                    </span>
                                  </div>
                                  {event.data && (
                                    <details className="text-xs">
                                      <summary className="text-muted-foreground hover:text-foreground cursor-pointer">
                                        Show data
                                      </summary>
                                      <pre className="bg-muted mt-2 overflow-auto rounded p-2 text-xs">
                                        {JSON.stringify(event.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                  {event.stack && (
                                    <details className="text-xs">
                                      <summary className="text-muted-foreground hover:text-foreground cursor-pointer">
                                        Show stack trace
                                      </summary>
                                      <pre className="bg-muted mt-2 overflow-auto rounded p-2 text-xs">
                                        {event.stack}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-0 h-full">
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Total Events</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold">
                          {performanceMetrics.totalEvents}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Errors</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-red-600">
                          {performanceMetrics.errorCount}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Avg Performance</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold">
                          {performanceMetrics.avgPerformance.toFixed(1)}ms
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Supplement Events</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold">
                          {performanceMetrics.supplementInteractions}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {events
                        .filter((e) => e.category === DebugCategory.PERFORMANCE)
                        .slice(0, 20)
                        .map((event) => (
                          <Card key={event.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{event.message}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {event.data?.duration?.toFixed(2)}ms
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {formatTimestamp(event.timestamp)}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="supplements" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {events
                        .filter((e) => e.category === DebugCategory.SUPPLEMENT)
                        .map((event) => (
                          <Card key={event.id} className="p-3">
                            <div className="flex items-start gap-3">
                              <Badge variant={getLevelColor(event.level)}>
                                {getLevelName(event.level)}
                              </Badge>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <span className="font-medium">{event.message}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {formatTimestamp(event.timestamp)}
                                  </span>
                                </div>
                                {event.data && (
                                  <div className="bg-muted mt-2 rounded p-2 text-sm">
                                    <pre>{JSON.stringify(event.data, null, 2)}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </>
  )
}

export default DebugDashboard
