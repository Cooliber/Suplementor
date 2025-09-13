'use client'

import { format, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Plus, Clock, CheckCircle, Brain, Calendar, Target } from 'lucide-react'
import { useState, useMemo, useEffect, useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AIRecommendationEngine } from '@/lib/ai-engine'

interface SupplementEntry {
  id: string
  name: string
  dosage: string
  frequency: 'daily' | 'twice-daily' | 'weekly' | 'as-needed'
  timeOfDay: string[]
  category: 'cognitive' | 'energy' | 'sleep' | 'mood' | 'health'
  startDate: string
  endDate?: string
  notes?: string
  sideEffects?: string[]
  effectiveness?: number // 1-10 scale
  cost?: number
  brand?: string
}

interface SupplementLog {
  id: string
  supplementId: string
  date: string
  time: string
  taken: boolean
  dosage?: string
  notes?: string
  sideEffects?: string[]
  effectiveness?: number
}

interface EnhancedAIRecommendation {
  id: string
  type: 'effectiveness' | 'compliance' | 'synergy' | 'timing' | 'dosage'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  factors: {
    effectiveness: number
    compliance: number
    synergy: number
    timing: number
    dosage: number
    sideEffects: number
    userGoals: number
  }
  actionable: boolean
  actions: string[]
  reasoning: string
}

const InteractiveSupplementTracker = () => {
  const [supplements, setSupplements] = useState<SupplementEntry[]>([
    {
      id: '1',
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      category: 'cognitive',
      startDate: '2024-01-01',
      effectiveness: 8,
      cost: 45,
      brand: 'Nordic Naturals'
    },
    {
      id: '2',
      name: "Lion's Mane",
      dosage: '500mg',
      frequency: 'daily',
      timeOfDay: ['09:00'],
      category: 'cognitive',
      startDate: '2024-01-01',
      effectiveness: 7,
      cost: 35
    }
  ])

  const [logs, setLogs] = useState<SupplementLog[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSupplement, setNewSupplement] = useState<Partial<SupplementEntry>>({})

  // AI Engine integration
  const aiEngine = useMemo(() => new AIRecommendationEngine(), [])
  const [enhancedAiRecommendations, setEnhancedAiRecommendations] = useState<
    EnhancedAIRecommendation[]
  >([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  // Generate enhanced AI recommendations
  const generateEnhancedRecommendations = useCallback(async () => {
    if (supplements.length === 0) return

    setIsGeneratingRecommendations(true)
    try {
      const context = {
        supplements: supplements.map((s) => ({
          id: s.id,
          name: s.name,
          dosage: s.dosage,
          frequency: s.frequency,
          timeOfDay: s.timeOfDay,
          category: s.category,
          startDate: s.startDate,
          endDate: s.endDate,
          notes: s.notes,
          sideEffects: s.sideEffects,
          effectiveness: s.effectiveness,
          cost: s.cost,
          brand: s.brand
        })),
        logs: logs.map((l) => ({
          id: l.id,
          supplementId: l.supplementId,
          date: l.date,
          time: l.time,
          taken: l.taken,
          dosage: l.dosage,
          notes: l.notes,
          sideEffects: l.sideEffects,
          effectiveness: l.effectiveness
        })),
        performanceMetrics: [],
        timeRange: {
          start:
            logs.length > 0
              ? new Date(Math.min(...logs.map((l) => new Date(l.date).getTime())))
              : new Date(),
          end: new Date()
        },
        userPreferences: {
          goals: ['cognitive', 'energy', 'health'],
          sensitivities: [],
          preferredTimes: ['morning', 'evening']
        }
      }

      const recommendations = aiEngine.generateRecommendations(context)
      setEnhancedAiRecommendations(recommendations)
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
    } finally {
      setIsGeneratingRecommendations(false)
    }
  }, [supplements, logs, aiEngine])

  // Generate recommendations when data changes
  useEffect(() => {
    generateEnhancedRecommendations()
  }, [generateEnhancedRecommendations])

  // Get today's supplement schedule
  const todaySchedule = useMemo(() => {
    const today = format(selectedDate, 'yyyy-MM-dd')
    const schedule = []

    for (const supplement of supplements) {
      for (const time of supplement.timeOfDay) {
        const logEntry = logs.find(
          (log) =>
            log.supplementId === supplement.id && log.date === today && log.time === time
        )

        schedule.push({
          supplement,
          time,
          taken: logEntry?.taken || false,
          logId: logEntry?.id
        })
      }
    }

    return schedule.sort((a, b) => a.time.localeCompare(b.time))
  }, [supplements, logs, selectedDate])

  // Calculate weekly compliance
  const weeklyCompliance = useMemo(() => {
    const weekStart = startOfWeek(selectedDate, { locale: pl })
    const weekEnd = endOfWeek(selectedDate, { locale: pl })

    const weekDays = []
    for (let day = weekStart; day <= weekEnd; day = addDays(day, 1)) {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayLogs = logs.filter((log) => log.date === dayStr)
      const expectedDoses = supplements.reduce(
        (sum, supp) => sum + supp.timeOfDay.length,
        0
      )
      const takenDoses = dayLogs.filter((log) => log.taken).length

      weekDays.push({
        date: day,
        compliance: expectedDoses > 0 ? (takenDoses / expectedDoses) * 100 : 0,
        taken: takenDoses,
        expected: expectedDoses
      })
    }

    return weekDays
  }, [supplements, logs, selectedDate])

  const markSupplementTaken = (supplementId: string, time: string, taken: boolean) => {
    const today = format(selectedDate, 'yyyy-MM-dd')
    const existingLog = logs.find(
      (log) =>
        log.supplementId === supplementId && log.date === today && log.time === time
    )

    if (existingLog) {
      setLogs((prev) =>
        prev.map((log) => (log.id === existingLog.id ? { ...log, taken } : log))
      )
    } else {
      const newLog: SupplementLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        supplementId,
        date: today,
        time,
        taken
      }
      setLogs((prev) => [...prev, newLog])
    }
  }

  const addSupplement = () => {
    if (!newSupplement.name || !newSupplement.dosage) return

    const supplement: SupplementEntry = {
      id: `supp-${Date.now()}`,
      name: newSupplement.name,
      dosage: newSupplement.dosage,
      frequency: newSupplement.frequency || 'daily',
      timeOfDay: newSupplement.timeOfDay || ['09:00'],
      category: newSupplement.category || 'health',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      ...(newSupplement.notes !== undefined && { notes: newSupplement.notes }),
      ...(newSupplement.cost !== undefined && { cost: newSupplement.cost }),
      ...(newSupplement.brand !== undefined && { brand: newSupplement.brand })
    }

    setSupplements((prev) => [...prev, supplement])
    setNewSupplement({})
    setShowAddDialog(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cognitive':
        return 'bg-blue-100 text-blue-800'
      case 'energy':
        return 'bg-green-100 text-green-800'
      case 'sleep':
        return 'bg-purple-100 text-purple-800'
      case 'mood':
        return 'bg-yellow-100 text-yellow-800'
      case 'health':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Enhanced AI recommendations section
  const EnhancedAIRecommendationsSection = () => (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <Brain className="mr-2 h-5 w-5" />
        Inteligentne Rekomendacje AI
        {isGeneratingRecommendations && (
          <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        )}
      </h3>

      {enhancedAiRecommendations.length === 0 ? (
        <p className="text-sm text-gray-500">
          {isGeneratingRecommendations
            ? 'Analizuję Twoje dane...'
            : 'Dodaj więcej danych, aby otrzymać rekomendacje AI'}
        </p>
      ) : (
        <div className="space-y-4">
          {enhancedAiRecommendations.slice(0, 5).map((rec) => (
            <div
              key={rec.id}
              className={`border-l-4 pl-4 ${
                rec.priority === 'high'
                  ? 'border-red-500'
                  : rec.priority === 'medium'
                    ? 'border-yellow-500'
                    : 'border-green-500'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    rec.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {rec.priority === 'high'
                    ? 'Wysoki'
                    : rec.priority === 'medium'
                      ? 'Średni'
                      : 'Niski'}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-600">{rec.description}</p>
              <div className="mb-2 text-xs text-gray-500">{rec.reasoning}</div>
              <div className="flex flex-wrap gap-1">
                {rec.actions.map((action, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {action}
                  </span>
                ))}
              </div>

              {/* Show factor breakdown */}
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Czynniki:</span>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <div>Skuteczność: {(rec.factors.effectiveness * 100).toFixed(0)}%</div>
                  <div>Compliance: {(rec.factors.compliance * 100).toFixed(0)}%</div>
                  <div>Synergia: {(rec.factors.synergy * 100).toFixed(0)}%</div>
                  <div>Czas: {(rec.factors.timing * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with Date Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-green-600" />
              Interaktywny Tracker Suplementów
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-auto"
              />
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj suplement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj nowy suplement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nazwa</Label>
                      <Input
                        id="name"
                        value={newSupplement.name || ''}
                        onChange={(e) =>
                          setNewSupplement((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="np. Omega-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage">Dawka</Label>
                      <Input
                        id="dosage"
                        value={newSupplement.dosage || ''}
                        onChange={(e) =>
                          setNewSupplement((prev) => ({
                            ...prev,
                            dosage: e.target.value
                          }))
                        }
                        placeholder="np. 1000mg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategoria</Label>
                      <Select
                        value={newSupplement.category || ''}
                        onValueChange={(value) =>
                          setNewSupplement((prev) => ({
                            ...prev,
                            category: value as any
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cognitive">Funkcje poznawcze</SelectItem>
                          <SelectItem value="energy">Energia</SelectItem>
                          <SelectItem value="sleep">Sen</SelectItem>
                          <SelectItem value="mood">Nastrój</SelectItem>
                          <SelectItem value="health">Zdrowie ogólne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="time">Czas przyjmowania</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newSupplement.timeOfDay?.[0] || '09:00'}
                        onChange={(e) =>
                          setNewSupplement((prev) => ({
                            ...prev,
                            timeOfDay: [e.target.value]
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notatki</Label>
                      <Textarea
                        id="notes"
                        value={newSupplement.notes || ''}
                        onChange={(e) =>
                          setNewSupplement((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        placeholder="Dodatkowe informacje..."
                      />
                    </div>
                    <Button onClick={addSupplement} className="w-full">
                      Dodaj suplement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Dzisiaj</TabsTrigger>
          <TabsTrigger value="week">Tydzień</TabsTrigger>
          <TabsTrigger value="supplements">Suplementy</TabsTrigger>
          <TabsTrigger value="ai">AI Rekomendacje</TabsTrigger>
        </TabsList>

        {/* Today's Schedule */}
        <TabsContent value="today">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Harmonogram na {format(selectedDate, 'dd MMMM yyyy', { locale: pl })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="font-mono text-sm text-gray-500">{item.time}</div>
                        <div>
                          <div className="font-medium">{item.supplement.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.supplement.dosage}
                          </div>
                        </div>
                        <Badge className={getCategoryColor(item.supplement.category)}>
                          {item.supplement.category}
                        </Badge>
                      </div>
                      <Button
                        variant={item.taken ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          markSupplementTaken(item.supplement.id, item.time, !item.taken)
                        }
                      >
                        {item.taken ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Zażyty
                          </>
                        ) : (
                          <>
                            <Clock className="mr-2 h-4 w-4" />
                            Zaznacz
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Compliance tygodniowy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyCompliance.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 text-sm">
                        {format(day.date, 'EEE dd', { locale: pl })}
                      </div>
                      <div className="flex-1">
                        <Progress value={day.compliance} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.taken}/{day.expected}
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round(day.compliance)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplements Management */}
        <TabsContent value="supplements">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {supplements.map((supplement) => (
              <Card key={supplement.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplement.name}</CardTitle>
                    <Badge className={getCategoryColor(supplement.category)}>
                      {supplement.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Dawka:</strong> {supplement.dosage}
                    </div>
                    <div>
                      <strong>Częstotliwość:</strong> {supplement.frequency}
                    </div>
                    <div>
                      <strong>Czas:</strong> {supplement.timeOfDay.join(', ')}
                    </div>
                    {supplement.effectiveness && (
                      <div className="flex items-center space-x-2">
                        <strong>Skuteczność:</strong>
                        <Progress
                          value={supplement.effectiveness * 10}
                          className="h-2 flex-1"
                        />
                        <span>{supplement.effectiveness}/10</span>
                      </div>
                    )}
                    {supplement.cost && (
                      <div>
                        <strong>Koszt:</strong> {supplement.cost} zł/miesiąc
                      </div>
                    )}
                    {supplement.notes && (
                      <div>
                        <strong>Notatki:</strong> {supplement.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced AI Recommendations */}
        <TabsContent value="ai">
          <EnhancedAIRecommendationsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InteractiveSupplementTracker
