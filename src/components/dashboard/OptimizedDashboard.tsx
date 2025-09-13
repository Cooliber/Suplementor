'use client';

import { Brain, Heart, Activity, Pill, TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { memo, useMemo, lazy, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const AdvancedAnalytics = lazy(() => import('./AdvancedAnalytics'));

interface DashboardStats {
  cycleDay: number;
  supplementsToday: { taken: number; total: number };
  energyLevel: number;
  wellbeing: number;
  focusScore: number;
  memoryScore: number;
  sleepQuality: number;
}

interface SupplementItem {
  id: string;
  name: string;
  dosage: string;
  description: string;
  status: 'taken' | 'pending' | 'skipped';
  timeScheduled?: string;
  timeTaken?: string;
}

interface OptimizedDashboardProps {
  stats: DashboardStats;
  supplements: SupplementItem[];
  onSupplementUpdate: (id: string, status: SupplementItem['status']) => void;
  onAddNote: () => void;
  onUpdateWellbeing: () => void;
}

// Memoized stat card component
const StatCard = memo(({ icon: Icon, title, value, color }: {
  icon: any;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-full p-3`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

// Memoized supplement item component
const SupplementCard = memo(({ supplement, onUpdate }: {
  supplement: SupplementItem;
  onUpdate: (id: string, status: SupplementItem['status']) => void;
}) => {
  const statusColor = useMemo(() => {
    switch (supplement.status) {
      case 'taken': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [supplement.status]);

  const statusText = useMemo(() => {
    switch (supplement.status) {
      case 'taken': return supplement.timeTaken ? `Zażyto o ${supplement.timeTaken}` : 'Zażyto';
      case 'pending': return supplement.timeScheduled ? `Zaplanowano na ${supplement.timeScheduled}` : 'Oczekuje';
      case 'skipped': return 'Pominięto';
      default: return 'Nieznany';
    }
  }, [supplement.status, supplement.timeTaken, supplement.timeScheduled]);

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium">{supplement.name}</h4>
        <p className="text-sm text-muted-foreground">{supplement.dosage} - {supplement.description}</p>
        {supplement.timeScheduled && (
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {supplement.timeScheduled}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={statusColor}>
          {statusText}
        </Badge>
        {supplement.status === 'pending' && (
          <Button
            size="sm"
            onClick={() => onUpdate(supplement.id, 'taken')}
            className="ml-2"
          >
            Zaznacz
          </Button>
        )}
      </div>
    </div>
  );
});

SupplementCard.displayName = 'SupplementCard';

// Memoized progress section
const ProgressSection = memo(({ stats }: { stats: DashboardStats }) => {
  const progressItems = useMemo(() => [
    { label: 'Koncentracja', value: stats.focusScore, color: 'bg-blue-500' },
    { label: 'Pamięć', value: stats.memoryScore, color: 'bg-purple-500' },
    { label: 'Energia', value: stats.energyLevel * 10, color: 'bg-green-500' },
    { label: 'Sen', value: stats.sleepQuality * 10, color: 'bg-indigo-500' }
  ], [stats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
          Postęp dzisiaj
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ProgressSection.displayName = 'ProgressSection';

// Main optimized dashboard component
const OptimizedDashboard = memo(({ 
  stats, 
  supplements, 
  onSupplementUpdate, 
  onAddNote, 
  onUpdateWellbeing 
}: OptimizedDashboardProps) => {
  // Memoize stat cards data
  const statCards = useMemo(() => [
    {
      icon: Brain,
      title: 'Dzień cyklu',
      value: stats.cycleDay,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Pill,
      title: 'Suplementy dzisiaj',
      value: `${stats.supplementsToday.taken}/${stats.supplementsToday.total}`,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Activity,
      title: 'Poziom energii',
      value: `${stats.energyLevel}/10`,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Heart,
      title: 'Samopoczucie',
      value: `${stats.wellbeing}/10`,
      color: 'bg-red-100 text-red-600'
    }
  ], [stats]);

  // Memoize weekly schedule data
  const weeklySchedule = useMemo(() => {
    const days = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
    return days.map((day, index) => ({
      day,
      completed: index < 5 ? 6 : 4,
      total: 6,
      isWeekend: index >= 5
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Supplements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-indigo-600" />
                Dzisiejsza suplementacja
              </div>
              <Badge variant="outline">
                {stats.supplementsToday.taken}/{stats.supplementsToday.total}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplements.map((supplement) => (
                <SupplementCard
                  key={supplement.id}
                  supplement={supplement}
                  onUpdate={onSupplementUpdate}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-indigo-600" />
                Szybkie akcje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" onClick={onSupplementUpdate.bind(null, '', 'taken')}>
                  Zaznacz wszystkie
                </Button>
                <Button variant="secondary" className="w-full" onClick={onAddNote}>
                  Dodaj notatkę
                </Button>
                <Button variant="secondary" className="w-full" onClick={onUpdateWellbeing}>
                  Zaktualizuj samopoczucie
                </Button>
              </div>
            </CardContent>
          </Card>

          <ProgressSection stats={stats} />
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Harmonogram tygodnia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklySchedule.map((schedule) => (
              <div key={schedule.day} className="text-center">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {schedule.day}
                </div>
                <div className={`p-2 rounded-lg transition-colors ${
                  schedule.isWeekend ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200'
                }`}>
                  <div className="text-xs text-gray-700">
                    {schedule.completed}/{schedule.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics - Lazy Loaded */}
      <Suspense fallback={
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      }>
        <AdvancedAnalytics stats={stats} supplements={supplements} />
      </Suspense>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;
export type { DashboardStats, SupplementItem, OptimizedDashboardProps };