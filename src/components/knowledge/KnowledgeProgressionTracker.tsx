'use client';

import {
  Trophy,
  Target,
  BookOpen,
  Brain,
  TrendingUp,
  Award,
  Star,
  Clock,
  CheckCircle,
  Circle,
  ChevronRight,
  Lock,
  Sparkles,
  Users,
  Target as TargetIcon,
  Zap,
  Heart,
  Activity,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  BarChart3,
  Calendar,
  Map,
  Play
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  prerequisites: string[];
  skills: string[];
  achievements: string[];
  progress: number;
  isLocked: boolean;
  isFeatured: boolean;
  color: string;
  icon: React.ReactNode;
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  completedPaths: number;
  totalLessons: number;
  weeklyGoal: number;
  weeklyProgress: number;
  badges: string[];
  skills: { [key: string]: number };
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'article' | 'video' | 'quiz' | 'practical';
  completed: boolean;
  locked: boolean;
  estimatedTime: string;
  description: string;
  keyTakeaways: string[];
  practicalApplications: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const learningPaths: LearningPath[] = [
  {
    id: 'neuroscience-fundamentals',
    title: 'Podstawy neurobiologii',
    description: 'Zrozum podstawowe mechanizmy funkcjonowania mózgu i układu nerwowego',
    category: 'Neurobiologia',
    difficulty: 'Beginner',
    totalLessons: 12,
    completedLessons: 8,
    estimatedTime: '2h 30min',
    prerequisites: [],
    skills: ['Neuroanatomia', 'Neuroprzekaźniki', 'Plastyczność mózgu'],
    achievements: ['Pierwszy krok', 'Neuro-entuzjasta'],
    progress: 67,
    isLocked: false,
    isFeatured: true,
    color: 'from-blue-500 to-blue-600',
    icon: <Brain className="h-6 w-6" />
  },
  {
    id: 'nootropic-foundations',
    title: 'Fundamenty nootropików',
    description: 'Poznaj podstawowe suplementy i mechanizmy wspierające funkcje poznawcze',
    category: 'Suplementy',
    difficulty: 'Beginner',
    totalLessons: 15,
    completedLessons: 5,
    estimatedTime: '3h 15min',
    prerequisites: ['neuroscience-fundamentals'],
    skills: ['Klasyfikacja nootropików', 'Mechanizmy działania', 'Bezpieczeństwo'],
    achievements: ['Pierwszy nootrop', 'Badacz suplementów'],
    progress: 33,
    isLocked: false,
    isFeatured: true,
    color: 'from-green-500 to-green-600',
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'advanced-protocols',
    title: 'Zaawansowane protokoły',
    description: 'Zaprojektuj zaawansowane protokoły dostosowane do Twoich celów',
    category: 'Protokoły',
    difficulty: 'Advanced',
    totalLessons: 20,
    completedLessons: 0,
    estimatedTime: '5h 45min',
    prerequisites: ['nootropic-foundations', 'neuroscience-fundamentals'],
    skills: ['Stackowanie', 'Cyklowanie', 'Monitorowanie efektów'],
    achievements: ['Master-mind', 'Protokołowy guru'],
    progress: 0,
    isLocked: true,
    isFeatured: false,
    color: 'from-purple-500 to-purple-600',
    icon: <TargetIcon className="h-6 w-6" />
  },
  {
    id: 'circadian-mastery',
    title: 'Mistrzostwo rytmu dobowego',
    description: 'Optymalizuj swój zegar biologiczny dla maksymalnej wydajności',
    category: 'Lifestyle',
    difficulty: 'Intermediate',
    totalLessons: 10,
    completedLessons: 3,
    estimatedTime: '2h',
    prerequisites: ['neuroscience-fundamentals'],
    skills: ['Synchronizacja rytmu', 'Optymalizacja snu', 'Chrononutrition'],
    achievements: ['Chronowojownik', 'Senny mistrz'],
    progress: 30,
    isLocked: false,
    isFeatured: false,
    color: 'from-orange-500 to-orange-600',
    icon: <Clock className="h-6 w-6" />
  }
];

const userProgress: UserProgress = {
  totalPoints: 2450,
  level: 7,
  streak: 5,
  completedPaths: 1,
  totalLessons: 57,
  weeklyGoal: 5,
  weeklyProgress: 3,
  badges: ['Pierwszy krok', 'Neuro-entuzjasta', 'Pierwszy nootrop'],
  skills: {
    'Neuroanatomia': 75,
    'Neuroprzekaźniki': 60,
    'Plastyczność mózgu': 45,
    'Klasyfikacja nootropików': 30,
    'Mechanizmy działania': 25
  }
};

const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Pierwszy krok',
    description: 'Ukończ pierwszą lekcję',
    icon: <Trophy className="h-8 w-8" />,
    unlocked: true,
    unlockedAt: '2024-01-10',
    rarity: 'common'
  },
  {
    id: 'neuro-enthusiast',
    title: 'Neuro-entuzjasta',
    description: 'Ukończ 5 lekcji z neurobiologii',
    icon: <Brain className="h-8 w-8" />,
    unlocked: true,
    unlockedAt: '2024-01-12',
    rarity: 'common'
  },
  {
    id: 'path-completer',
    title: 'Droga do mistrzostwa',
    description: 'Ukończ całą ścieżkę edukacyjną',
    icon: <Award className="h-8 w-8" />,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'knowledge-master',
    title: 'Mistrz wiedzy',
    description: 'Zdobądź 5000 punktów',
    icon: <Star className="h-8 w-8" />,
    unlocked: false,
    rarity: 'epic'
  }
];

const currentPathLessons: Lesson[] = [
  {
    id: 'neuron-basics',
    title: 'Podstawy neuronów i synaps',
    duration: '15 min',
    type: 'article',
    completed: true,
    locked: false,
    estimatedTime: '15 min',
    description: 'Zrozum strukturę neuronów i mechanizmy przekazywania sygnałów',
    keyTakeaways: ['Struktura neuronu', 'Potencjał błonowy', 'Neuroprzekaźniki'],
    practicalApplications: ['Zrozumienie działania leków', 'Optymalizacja suplementacji']
  },
  {
    id: 'neurotransmitters-intro',
    title: 'Wprowadzenie do neuroprzekaźników',
    duration: '20 min',
    type: 'video',
    completed: true,
    locked: false,
    estimatedTime: '20 min',
    description: 'Poznaj główne neuroprzekaźniki i ich funkcje',
    keyTakeaways: ['Dopamina', 'Serotonina', 'Acetylocholina', 'GABA'],
    practicalApplications: ['Dobór suplementów', 'Zrozumienie emocji']
  },
  {
    id: 'brain-plasticity',
    title: 'Plastyczność mózgu',
    duration: '25 min',
    type: 'article',
    completed: false,
    locked: false,
    estimatedTime: '25 min',
    description: 'Jak mózg się zmienia i adaptuje',
    keyTakeaways: ['Neurogeneza', 'Synaptic plasticity', 'LTP/LTD'],
    practicalApplications: ['Uczenie się', 'Rehabilitacja po urazach']
  },
  {
    id: 'memory-mechanisms',
    title: 'Mechanizmy pamięci',
    duration: '30 min',
    type: 'quiz',
    completed: false,
    locked: true,
    estimatedTime: '30 min',
    description: 'Test wiedzy o mechanizmach pamięci',
    keyTakeaways: ['Pamięć robocza', 'Pamięć długotrwała', 'Konsolidacja'],
    practicalApplications: ['Techniki zapamiętywania', 'Optymalizacja nauki']
  }
];

export function KnowledgeProgressionTracker() {
  const [activeTab, setActiveTab] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'practical': return <Activity className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ścieżki Edukacyjne
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Śledź swoje postępy i odkryj nowe ścieżki nauki
          </p>

          {/* User Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Twój postęp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{userProgress.level}</div>
                  <div className="text-sm text-gray-600">Poziom</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{userProgress.totalPoints}</div>
                  <div className="text-sm text-gray-600">Punkty</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{userProgress.streak}</div>
                  <div className="text-sm text-gray-600">Dni z rzędu</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{userProgress.completedPaths}</div>
                  <div className="text-sm text-gray-600">Ukończone ścieżki</div>
                </div>
              </div>

              {/* Weekly Goal */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Cel tygodniowy</span>
                  <span>{userProgress.weeklyProgress}/{userProgress.weeklyGoal} lekcji</span>
                </div>
                <Progress value={(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="paths">Ścieżki</TabsTrigger>
            <TabsTrigger value="progress">Postęp</TabsTrigger>
            <TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
            <TabsTrigger value="skills">Umiejętności</TabsTrigger>
          </TabsList>

          <TabsContent value="paths">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map(path => (
                <Card key={path.id} className={`hover:shadow-lg transition-all duration-300 ${
                  path.isLocked ? 'opacity-75' : ''
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${path.color} text-white`}>
                        {path.icon}
                      </div>
                      {path.isFeatured && (
                        <Badge variant="secondary" className="ml-2">
                          Polecane
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Postęp</span>
                          <span>{path.completedLessons}/{path.totalLessons} lekcji</span>
                        </div>
                        <Progress value={(path.completedLessons / path.totalLessons) * 100} />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Trudność:</span>
                        <Badge variant={path.difficulty === 'Beginner' ? 'default' : 
                          path.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                          {path.difficulty}
                        </Badge>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Czas:</span>
                        <span>{path.estimatedTime}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {path.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full" 
                        disabled={path.isLocked}
                        onClick={() => setSelectedPath(path)}
                      >
                        {path.isLocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Zablokowane
                          </>
                        ) : path.progress === 100 ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Przeglądaj
                          </>
                        ) : (
                          <>
                            Kontynuuj
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktualna ścieżka</CardTitle>
                  <CardDescription>Postęp w aktualnej ścieżce</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {currentPathLessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${
                            lesson.completed ? 'bg-green-100 text-green-600' :
                            lesson.locked ? 'bg-gray-100 text-gray-400' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : lesson.locked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {getLessonIcon(lesson.type)}
                                {lesson.duration}
                              </span>
                              <span>{lesson.type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statystyki nauki</CardTitle>
                  <CardDescription>Twoje statystyki postępu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Umiejętności</h4>
                      <div className="space-y-2">
                        {Object.entries(userProgress.skills).map(([skill, level]) => (
                          <div key={skill}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{skill}</span>
                              <span>{level}%</span>
                            </div>
                            <Progress value={level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h4 className="font-medium mb-2">Ostatnia aktywność</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Dzisiaj</span>
                          <span className="text-green-600">+45 pkt</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wczoraj</span>
                          <span className="text-green-600">+30 pkt</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 dni temu</span>
                          <span className="text-green-600">+60 pkt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`transition-all duration-300 ${
                  achievement.unlocked ? '' : 'opacity-50'
                }`}>
                  <CardHeader>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${
                      getRarityColor(achievement.rarity)
                    } text-white w-fit mx-auto mb-2`}>
                      {achievement.icon}
                    </div>
                    <CardTitle className="text-center">{achievement.title}</CardTitle>
                    <CardDescription className="text-center">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge 
                        variant={achievement.unlocked ? "default" : "outline"}
                        className="mb-2"
                      >
                        {achievement.rarity === 'common' ? 'Powszechny' :
                         achievement.rarity === 'rare' ? 'Rzadki' :
                         achievement.rarity === 'epic' ? 'Epicki' : 'Legendarny'}
                      </Badge>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-sm text-gray-600">
                          Odblokowano: {new Date(achievement.unlockedAt).toLocaleDateString('pl-PL')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa umiejętności</CardTitle>
                  <CardDescription>Twoje kompetencje w poszczególnych dziedzinach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(userProgress.skills).map(([skill, level]) => (
                      <div key={skill}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{skill}</h4>
                          <Badge variant={level >= 75 ? "default" : level >= 50 ? "secondary" : "outline"}>
                            {level >= 75 ? 'Ekspert' : level >= 50 ? 'Zaawansowany' : 'Początkujący'}
                          </Badge>
                        </div>
                        <Progress value={level} className="h-3" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Poziom {Math.floor(level / 25) + 1}</span>
                          <span>{level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cele rozwojowe</CardTitle>
                  <CardDescription>Następne kroki w Twojej edukacji</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Następny poziom</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Poziom {userProgress.level + 1}</span>
                        <span className="text-sm font-medium">
                          {5000 - userProgress.totalPoints} pkt do następnego poziomu
                        </span>
                      </div>
                      <Progress 
                        value={((userProgress.totalPoints % 5000) / 5000) * 100} 
                        className="h-2 mt-2" 
                      />
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Rekomendowane ścieżki</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="h-4 w-4 mr-2" />
                          Neuroplastyczność - zaawansowany
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Zap className="h-4 w-4 mr-2" />
                          Stacking nootropików
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}