'use client'

import { Target, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import { LoadingFallback } from '@/components/error/ErrorFallback'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dynamic imports for performance
const InteractiveSupplementTracker = dynamic(
  () =>
    import('@/components/tracker/InteractiveSupplementTracker').then(
      (mod) => mod.default
    ),
  {
    loading: () => <LoadingFallback message="Loading supplement tracker..." />,
    ssr: false
  }
)

const PerformanceMonitor = dynamic(
  () => import('@/components/monitoring/PerformanceMonitor').then((mod) => mod.default),
  {
    loading: () => <LoadingFallback message="Loading performance monitor..." />,
    ssr: false
  }
)

/**
 * Skeleton component for tracker loading state
 */
const TrackerSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-12" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

/**
 * Skeleton component for monitor loading state
 */
const MonitorSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="mt-2 h-2 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
)

/**
 * Advanced neuroregulation tracker page with AI-powered recommendations
 */
export default function TrackerPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          Zaawansowany Tracker Neuroregulacji
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Kompleksowe narzędzie do śledzenia suplementów, monitorowania wydajności i
          otrzymywania inteligentnych rekomendacji AI dla optymalnej neuroregulacji.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-500 p-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Inteligentny Tracker</h3>
                <p className="text-sm text-blue-700">
                  AI-powered śledzenie suplementów z personalizowanymi rekomendacjami
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-500 p-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Monitoring Real-time</h3>
                <p className="text-sm text-green-700">
                  Ciągłe monitorowanie wydajności poznawczej i biometrycznej
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-500 p-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Analiza Korelacji</h3>
                <p className="text-sm text-purple-700">
                  Zaawansowana analiza związków między suplementami a wydajnością
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Error Boundaries */}
      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracker" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Tracker Suplementów</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Monitor Wydajności</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-600" />
                Interaktywny Tracker Suplementów
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <Suspense fallback={<TrackerSkeleton />}>
                  <InteractiveSupplementTracker />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-green-600" />
                Monitor Wydajności Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <Suspense fallback={<MonitorSkeleton />}>
                  <PerformanceMonitor />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
