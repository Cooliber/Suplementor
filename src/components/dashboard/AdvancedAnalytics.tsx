'use client';

import { TrendingUp, Brain, Activity, Clock, Target, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import  { type DashboardStats, type SupplementItem } from './OptimizedDashboard';

interface AdvancedAnalyticsProps {
  stats: DashboardStats;
  supplements: SupplementItem[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

/**
 *
 */
const AdvancedAnalytics = ({ stats, supplements }: AdvancedAnalyticsProps) => {
  // Generate mock historical data for demonstration
  const weeklyTrends = useMemo(() => [
    { day: 'Pn', focus: 85, memory: 78, energy: 92, mood: 88 },
    { day: 'Wt', focus: 88, memory: 82, energy: 89, mood: 85 },
    { day: 'Śr', focus: 82, memory: 85, energy: 87, mood: 90 },
    { day: 'Cz', focus: 90, memory: 88, energy: 94, mood: 92 },
    { day: 'Pt', focus: 87, memory: 90, energy: 91, mood: 89 },
    { day: 'So', focus: 75, memory: 80, energy: 85, mood: 88 },
    { day: 'Nd', focus: 78, memory: 82, energy: 88, mood: 90 }
  ], []);

  const supplementEffectiveness = useMemo(() => {
    const categories = supplements.reduce((acc, supplement) => {
      const category = supplement.description.includes('pamięć') ? 'Pamięć' :
                      supplement.description.includes('energia') ? 'Energia' :
                      supplement.description.includes('koncentracja') ? 'Koncentracja' :
                      supplement.description.includes('sen') ? 'Sen' : 'Inne';
      
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [supplements]);

  const complianceData = useMemo(() => [
    { name: 'Zażyte', value: stats.supplementsToday.taken, color: '#10B981' },
    { name: 'Pozostałe', value: stats.supplementsToday.total - stats.supplementsToday.taken, color: '#F59E0B' }
  ], [stats.supplementsToday]);

  const cognitiveMetrics = useMemo(() => [
    {
      name: 'Koncentracja',
      current: stats.focusScore,
      target: 90,
      trend: '+5%',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      name: 'Pamięć',
      current: stats.memoryScore,
      target: 85,
      trend: '+3%',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      name: 'Energia',
      current: stats.energyLevel * 10,
      target: 95,
      trend: '+8%',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      name: 'Jakość snu',
      current: stats.sleepQuality * 10,
      target: 90,
      trend: '+2%',
      icon: Clock,
      color: 'text-indigo-600'
    }
  ], [stats]);

  const insights = useMemo(() => {
    const insights = [];
    
    if (stats.focusScore < 80) {
      insights.push({
        type: 'warning',
        title: 'Niska koncentracja',
        message: 'Rozważ zwiększenie dawki L-Theanine lub dodanie Rhodiola Rosea',
        priority: 'high'
      });
    }
    
    if (stats.supplementsToday.taken / stats.supplementsToday.total < 0.8) {
      insights.push({
        type: 'info',
        title: 'Compliance suplementacji',
        message: 'Pamiętaj o regularnym przyjmowaniu suplementów dla lepszych efektów',
        priority: 'medium'
      });
    }
    
    if (stats.energyLevel >= 9) {
      insights.push({
        type: 'success',
        title: 'Wysoki poziom energii',
        message: 'Świetna robota! Twój stos suplementów działa efektywnie',
        priority: 'low'
      });
    }
    
    return insights;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Cognitive Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Metryki poznawcze - analiza zaawansowana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cognitiveMetrics.map((metric) => {
              const Icon = metric.icon;
              const progress = (metric.current / metric.target) * 100;
              
              return (
                <div key={metric.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className={`h-4 w-4 mr-2 ${metric.color}`} />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.current}%</span>
                      <span className="text-muted-foreground">cel: {metric.target}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trendy tygodniowe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="focus" stroke="#3B82F6" strokeWidth={2} name="Koncentracja" />
                <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} name="Pamięć" />
                <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={2} name="Energia" />
                <Line type="monotone" dataKey="mood" stroke="#F59E0B" strokeWidth={2} name="Nastrój" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplement Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Kategorie suplementów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplementEffectiveness}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {supplementEffectiveness.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance dzisiaj</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((stats.supplementsToday.taken / stats.supplementsToday.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Compliance rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Inteligentne rekomendacje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const bgColor = insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                             insight.type === 'success' ? 'bg-green-50 border-green-200' :
                             'bg-blue-50 border-blue-200';
              
              const iconColor = insight.type === 'warning' ? 'text-yellow-600' :
                               insight.type === 'success' ? 'text-green-600' :
                               'text-blue-600';
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${bgColor}`}>
                  <div className="flex items-start">
                    <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 ${iconColor}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {insight.priority}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;