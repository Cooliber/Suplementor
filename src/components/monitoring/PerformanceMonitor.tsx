'use client'

import { format, subDays } from 'date-fns'
import {
  Activity,
  Brain,
  Zap,
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PerformanceMetric {
  timestamp: string
  cognitive: number
  energy: number
  mood: number
  focus: number
  memory: number
  stress: number
  sleep_quality: number
  physical_activity: number
}

interface AlertItem {
  id: string
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
}

interface BiometricData {
  heartRate: number
  hrv: number
  steps: number
  calories: number
  sleepHours: number
  restingHR: number
}

/**
 *
 */
const PerformanceMonitor = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')
  const [realTimeData, setRealTimeData] = useState<PerformanceMetric | null>(null)
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    hrv: 45,
    steps: 8420,
    calories: 2150,
    sleepHours: 7.5,
    restingHR: 65
  })

  // Generate mock historical data
  const historicalData = useMemo(() => {
    const data: PerformanceMetric[] = []
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30
    const intervals = timeRange === '24h' ? 24 : days

    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp =
        timeRange === '24h'
          ? format(new Date(Date.now() - i * 60 * 60 * 1000), 'HH:mm')
          : format(subDays(new Date(), i), 'MM-dd')

      // Generate realistic performance data with some correlation
      const baseEnergy = 60 + Math.sin(i * 0.3) * 20 + Math.random() * 15
      const baseCognitive = baseEnergy * 0.8 + Math.random() * 20
      const baseMood = (baseEnergy + baseCognitive) / 2 + Math.random() * 15

      data.push({
        timestamp,
        cognitive: Math.max(0, Math.min(100, baseCognitive)),
        energy: Math.max(0, Math.min(100, baseEnergy)),
        mood: Math.max(0, Math.min(100, baseMood)),
        focus: Math.max(0, Math.min(100, baseCognitive + Math.random() * 10 - 5)),
        memory: Math.max(0, Math.min(100, baseCognitive * 0.9 + Math.random() * 15)),
        stress: Math.max(0, Math.min(100, 100 - baseMood + Math.random() * 20)),
        sleep_quality: Math.max(0, Math.min(100, 70 + Math.random() * 25)),
        physical_activity: Math.max(0, Math.min(100, 50 + Math.random() * 40))
      })
    }

    return data
  }, [timeRange])

  // Current performance radar data
  const radarData = useMemo(() => {
    if (!realTimeData) return []

    return [
      { metric: 'Koncentracja', value: realTimeData.focus, fullMark: 100 },
      { metric: 'Pamięć', value: realTimeData.memory, fullMark: 100 },
      { metric: 'Energia', value: realTimeData.energy, fullMark: 100 },
      { metric: 'Nastrój', value: realTimeData.mood, fullMark: 100 },
      { metric: 'Sen', value: realTimeData.sleep_quality, fullMark: 100 },
      { metric: 'Aktywność', value: realTimeData.physical_activity, fullMark: 100 }
    ]
  }, [realTimeData])

  // Calculate performance trends
  const trends = useMemo(() => {
    if (historicalData.length < 2) return {}

    const recent = historicalData.slice(-3)
    const previous = historicalData.slice(-6, -3)

    const calculateTrend = (metric: keyof PerformanceMetric) => {
      const recentAvg =
        recent.reduce((sum, d) => sum + (d[metric] as number), 0) / recent.length
      const previousAvg =
        previous.reduce((sum, d) => sum + (d[metric] as number), 0) / previous.length
      return ((recentAvg - previousAvg) / previousAvg) * 100
    }

    return {
      cognitive: calculateTrend('cognitive'),
      energy: calculateTrend('energy'),
      mood: calculateTrend('mood'),
      focus: calculateTrend('focus')
    }
  }, [historicalData])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: PerformanceMetric = {
        timestamp: format(new Date(), 'HH:mm:ss'),
        cognitive: 65 + Math.random() * 25,
        energy: 70 + Math.random() * 20,
        mood: 75 + Math.random() * 15,
        focus: 68 + Math.random() * 22,
        memory: 72 + Math.random() * 18,
        stress: 30 + Math.random() * 25,
        sleep_quality: 80 + Math.random() * 15,
        physical_activity: 60 + Math.random() * 30
      }

      setRealTimeData(newData)

      // Generate alerts based on thresholds
      const newAlerts: AlertItem[] = []

      if (newData.stress > 70) {
        newAlerts.push({
          id: `stress-${Date.now()}`,
          type: 'warning',
          title: 'Wysoki poziom stresu',
          message: `Poziom stresu: ${Math.round(newData.stress)}%. Rozważ techniki relaksacyjne.`,
          timestamp: format(new Date(), 'HH:mm'),
          severity: 'high'
        })
      }

      if (newData.energy < 40) {
        newAlerts.push({
          id: `energy-${Date.now()}`,
          type: 'info',
          title: 'Niska energia',
          message: `Poziom energii: ${Math.round(newData.energy)}%. Sprawdź harmonogram suplementów.`,
          timestamp: format(new Date(), 'HH:mm'),
          severity: 'medium'
        })
      }

      if (newData.cognitive > 85) {
        newAlerts.push({
          id: `cognitive-${Date.now()}`,
          type: 'success',
          title: 'Wysoka wydajność poznawcza',
          message: `Funkcje poznawcze: ${Math.round(newData.cognitive)}%. Świetny moment na wymagające zadania!`,
          timestamp: format(new Date(), 'HH:mm'),
          severity: 'low'
        })
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10))
      }

      // Update biometrics
      setBiometrics((prev) => ({
        ...prev,
        heartRate: 65 + Math.random() * 15,
        hrv: 40 + Math.random() * 20,
        steps: prev.steps + Math.floor(Math.random() * 50)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < -5) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {realTimeData &&
          [
            {
              key: 'cognitive',
              label: 'Funkcje poznawcze',
              icon: Brain,
              value: realTimeData.cognitive
            },
            { key: 'energy', label: 'Energia', icon: Zap, value: realTimeData.energy },
            {
              key: 'focus',
              label: 'Koncentracja',
              icon: Activity,
              value: realTimeData.focus
            },
            { key: 'mood', label: 'Nastrój', icon: Heart, value: realTimeData.mood }
          ].map(({ key, label, icon: Icon, value }) => (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className={`text-2xl font-bold ${getMetricColor(value)}`}>
                      {Math.round(value)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6 text-gray-400" />
                    {(trends[key as keyof typeof trends] ?? 0) &&
                      getTrendIcon(trends[key as keyof typeof trends] ?? 0)}
                  </div>
                </div>
                <Progress value={value} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Alerts Panel */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
              Aktywne alerty ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 space-y-3 overflow-y-auto">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        </div>
                      </div>
                      <AlertDescription className="mt-1 text-xs">
                        {alert.message}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trendy</TabsTrigger>
          <TabsTrigger value="radar">Profil</TabsTrigger>
          <TabsTrigger value="biometrics">Biometria</TabsTrigger>
          <TabsTrigger value="correlations">Korelacje</TabsTrigger>
        </TabsList>

        {/* Performance Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Trendy wydajności</CardTitle>
                <div className="flex space-x-2">
                  {(['24h', '7d', '30d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`rounded px-3 py-1 text-sm ${
                        timeRange === range
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cognitive"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Funkcje poznawcze"
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Energia"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Nastrój"
                  />
                  <Line
                    type="monotone"
                    dataKey="focus"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Koncentracja"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Radar */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Profil wydajności (aktualny)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Wydajność"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Biometric Data */}
        <TabsContent value="biometrics">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dane biometryczne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tętno</span>
                    <span className="font-medium">
                      {Math.round(biometrics.heartRate)} bpm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HRV</span>
                    <span className="font-medium">{Math.round(biometrics.hrv)} ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kroki</span>
                    <span className="font-medium">
                      {biometrics.steps.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kalorie</span>
                    <span className="font-medium">{biometrics.calories}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sen</span>
                    <span className="font-medium">{biometrics.sleepHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktywność dzisiaj</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={historicalData.slice(-24)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="physical_activity"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Correlations */}
        <TabsContent value="correlations">
          <Card>
            <CardHeader>
              <CardTitle>Korelacje między metrykami</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Energia vs Funkcje poznawcze</h4>
                    <div className="text-2xl font-bold text-green-600">+0.78</div>
                    <p className="text-sm text-gray-600">Silna pozytywna korelacja</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Sen vs Nastrój</h4>
                    <div className="text-2xl font-bold text-blue-600">+0.65</div>
                    <p className="text-sm text-gray-600">
                      Umiarkowana pozytywna korelacja
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Stres vs Koncentracja</h4>
                    <div className="text-2xl font-bold text-red-600">-0.72</div>
                    <p className="text-sm text-gray-600">Silna negatywna korelacja</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Aktywność vs Energia</h4>
                    <div className="text-2xl font-bold text-green-600">+0.58</div>
                    <p className="text-sm text-gray-600">
                      Umiarkowana pozytywna korelacja
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PerformanceMonitor
