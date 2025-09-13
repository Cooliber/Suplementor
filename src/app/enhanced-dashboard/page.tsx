'use client';

import { Brain, BarChart3, Bell, Lightbulb, Settings, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SupplementItem } from '@/components/dashboard/OptimizedDashboard';

// Dynamically import heavy components for better performance
const OptimizedDashboard = dynamic(() => import('@/components/dashboard/OptimizedDashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

const AdvancedAnalytics = dynamic(() => import('@/components/dashboard/AdvancedAnalytics'), {
  loading: () => <AnalyticsSkeleton />,
  ssr: false
});

const SmartNotifications = dynamic(() => import('@/components/dashboard/SmartNotifications'), {
  loading: () => <NotificationsSkeleton />,
  ssr: false
});

const PersonalizedRecommendations = dynamic(() => import('@/components/dashboard/PersonalizedRecommendations'), {
  loading: () => <RecommendationsSkeleton />,
  ssr: false
});

// Mock data - in real app this would come from API/database
const mockStats = {
  cycleDay: 14,
  supplementsToday: { taken: 3, total: 4 },
  energyLevel: 8,
  wellbeing: 7,
  focusScore: 82,
  memoryScore: 78,
  sleepQuality: 8.5,
  weeklyProgress: {
    concentration: 75,
    memory: 68,
    energy: 85
  }
};

const mockSupplements: SupplementItem[] = [
  {
    id: '1',
    name: 'Omega-3',
    dosage: '1000mg',
    timeScheduled: '8:00',
    status: 'taken',
    description: 'Wsparcie dla mózgu i serca'
  },
  {
    id: '2',
    name: 'Lion\'s Mane',
    dosage: '500mg',
    timeScheduled: '9:00',
    status: 'taken',
    description: 'Neurogeneza i pamięć'
  },
  {
    id: '3',
    name: 'Bacopa Monnieri',
    dosage: '300mg',
    timeScheduled: '12:00',
    status: 'taken',
    description: 'Pamięć długoterminowa'
  },
  {
    id: '4',
    name: 'L-Theanine + Kofeina',
    dosage: '200mg + 100mg',
    timeScheduled: '14:00',
    status: 'pending',
    description: 'Koncentracja bez nerwowości'
  }
];

/**
 *
 */
const DashboardSkeleton = () => <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>;

/**
 *
 */
const AnalyticsSkeleton = () => <div className="space-y-6">
      <Skeleton className="h-64" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>;

/**
 *
 */
const NotificationsSkeleton = () => <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </CardContent>
    </Card>;

/**
 *
 */
const RecommendationsSkeleton = () => <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>;

/**
 *
 */
export default function EnhancedDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [supplements, setSupplements] = useState(mockSupplements);

  const handleSupplementUpdate = (id: string, status: 'taken' | 'pending' | 'skipped') => {
    setSupplements(prev =>
      prev.map(supplement =>
        supplement.id === id
          ? { ...supplement, status }
          : supplement
      )
    );
  };

  const handleSupplementTaken = (id: string) => {
    handleSupplementUpdate(id, 'taken');
  };

  const handleAddNote = () => {
    // TODO: Implement add note functionality
    console.log('Add note clicked');
  };

  const handleUpdateWellbeing = () => {
    // TODO: Implement update wellbeing functionality
    console.log('Update wellbeing clicked');
  };

  const stats = {
    ...mockStats,
    supplementsToday: {
      taken: supplements.filter(s => s.status === 'taken').length,
      total: supplements.length
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Zaawansowany Dashboard Neuroregulacji
              </h1>
              <p className="text-gray-600">
                Kompleksowa analiza i optymalizacja funkcji poznawczych
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Ustawienia
              </Button>
              <Button size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Eksportuj raport
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analityka
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Powiadomienia
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Rekomendacje
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Suspense fallback={<DashboardSkeleton />}>
              <OptimizedDashboard
                stats={stats}
                supplements={supplements}
                onSupplementUpdate={handleSupplementUpdate}
                onAddNote={handleAddNote}
                onUpdateWellbeing={handleUpdateWellbeing}
              />
            </Suspense>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Suspense fallback={<AnalyticsSkeleton />}>
              <AdvancedAnalytics 
                stats={stats}
                supplements={supplements}
              />
            </Suspense>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Suspense fallback={<NotificationsSkeleton />}>
              <SmartNotifications 
                supplements={supplements}
                onSupplementTaken={handleSupplementTaken}
              />
            </Suspense>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Suspense fallback={<RecommendationsSkeleton />}>
              <PersonalizedRecommendations 
                stats={stats}
                supplements={supplements}
                userProfile={{
                  age: 32,
                  goals: ['focus', 'memory', 'energy'],
                  sleepPattern: 'normal',
                  stressLevel: 6,
                  exerciseFrequency: 4
                }}
              />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>Wersja 2.0</span>
              <span>•</span>
              <span>AI-Enhanced Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}