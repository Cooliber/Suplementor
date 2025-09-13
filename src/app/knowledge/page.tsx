'use client'

import {
  Book,
  Brain,
  Lightbulb,
  TrendingUp,
  Search,
  BarChart3,
  Map,
  Target
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dynamically import enhanced knowledge components
const KnowledgeBase = dynamic(() => import('@/components/knowledge/KnowledgeBase'), {
  loading: () => <KnowledgeBaseSkeleton />,
  ssr: false
})

const SupplementDatabase = dynamic(
  () => import('@/components/knowledge/SupplementDatabase'),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    ),
    ssr: false
  }
)

const EnhancedKnowledgeNavigation = dynamic(
  () =>
    import('@/components/knowledge/EnhancedKnowledgeNavigation').then(
      (mod) => mod.EnhancedKnowledgeNavigation
    ),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false
  }
)

const SmartSearchSystem = dynamic(
  () => import('@/components/knowledge/SmartSearchSystem').then((mod) => mod.default),
  {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false
  }
)

const KnowledgeProgressionTracker = dynamic(
  () =>
    import('@/components/knowledge/KnowledgeProgressionTracker').then(
      (mod) => mod.KnowledgeProgressionTracker
    ),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false
  }
)

const InteractiveKnowledgeVisualizations = dynamic(
  () =>
    import('@/components/knowledge/InteractiveKnowledgeVisualizations').then(
      (mod) => mod.InteractiveKnowledgeVisualizations
    ),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false
  }
)

const ContentRecommendationEngine = dynamic(
  () =>
    import('@/components/knowledge/ContentRecommendationEngine').then(
      (mod) => mod.ContentRecommendationEngine
    ),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false
  }
)

/**
 *
 */
const KnowledgeBaseSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </CardContent>
    </Card>

    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="mb-2 h-6 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
)

/**
 *
 */
export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Baza Wiedzy Nootropowej
            </h1>
            <p className="mb-6 text-xl text-gray-600">
              Kompleksowe źródło informacji o suplementach, mechanizmach działania i
              protokołach optymalizacji funkcji poznawczych
            </p>

            {/* Enhanced Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Suplementów</div>
              </div>

              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Badań</div>
              </div>

              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Protokołów</div>
              </div>

              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-600">Mechanizmów</div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Search System */}
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <SmartSearchSystem />
        </Suspense>

        {/* Enhanced Navigation */}
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <EnhancedKnowledgeNavigation />
        </Suspense>

        {/* Knowledge Progression Tracker */}
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <KnowledgeProgressionTracker />
        </Suspense>

        {/* Interactive Visualizations */}
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <InteractiveKnowledgeVisualizations />
        </Suspense>

        {/* Content Recommendations */}
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <ContentRecommendationEngine />
        </Suspense>

        {/* Enhanced Knowledge Base */}
        <Tabs defaultValue="knowledge" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="knowledge">Baza Wiedzy</TabsTrigger>
            <TabsTrigger value="supplements">Baza Suplementów</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge">
            <Suspense fallback={<KnowledgeBaseSkeleton />}>
              <KnowledgeBase />
            </Suspense>
          </TabsContent>

          <TabsContent value="supplements">
            <SupplementDatabase />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Aktualizacje i nowe treści
            </h3>
            <p className="mb-4 text-gray-600">
              Nasza baza wiedzy jest regularnie aktualizowana o najnowsze badania i
              odkrycia w dziedzinie neurohackingu i optymalizacji poznawczej.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</span>
              <span>•</span>
              <span>
                Następna aktualizacja:{' '}
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  'pl-PL'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
