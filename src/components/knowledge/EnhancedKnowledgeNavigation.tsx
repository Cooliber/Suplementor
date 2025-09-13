'use client';

import {
  Brain,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Play,
  Award,
  Zap,
  Shield,
  Moon,
  Sun,
  GraduationCap,
  FileText,
  TrendingUp,
  Users,
  Heart,
  Activity,
  Microscope,
  Atom,
  Dna,
  Network,
  BookMarked,
  Star,
  Bookmark,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subcategories: KnowledgeSubcategory[];
  totalArticles: number;
  completedArticles: number;
}

interface KnowledgeSubcategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalTime: string;
  articles: string[];
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  description: string;
  tags: string[];
  lastUpdated: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  prerequisites: string[];
  relatedArticles: string[];
  keyTakeaways: string[];
  practicalApplications: string[];
}

const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'neurobiology',
    name: 'Neurobiologia',
    description: 'Podstawy funkcjonowania mózgu i układu nerwowego',
    icon: <Brain className="h-6 w-6" />,
    color: 'text-blue-600',
    totalArticles: 45,
    completedArticles: 12,
    subcategories: [
      {
        id: 'neurotransmitters',
        name: 'Neuroprzekaźniki',
        description: 'Chemiczne posłańcy mózgu - dopamina, serotonina, acetylocholina',
        icon: <Network className="h-5 w-5" />,
        articleCount: 15,
        difficulty: 'Beginner',
        estimatedTime: '45 min',
        prerequisites: []
      },
      {
        id: 'neuroplasticity',
        name: 'Neuroplastyczność',
        description: 'Zdolność mózgu do zmiany i adaptacji',
        icon: <TrendingUp className="h-5 w-5" />,
        articleCount: 12,
        difficulty: 'Intermediate',
        estimatedTime: '60 min',
        prerequisites: ['neurotransmitters']
      },
      {
        id: 'brain-anatomy',
        name: 'Anatomia Mózgu',
        description: 'Struktury mózgu i ich funkcje',
        icon: <Brain className="h-5 w-5" />,
        articleCount: 18,
        difficulty: 'Beginner',
        estimatedTime: '90 min',
        prerequisites: []
      }
    ]
  },
  {
    id: 'supplements',
    name: 'Suplementy',
    description: 'Kompletna baza wiedzy o suplementach nootropowych',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-purple-600',
    totalArticles: 78,
    completedArticles: 23,
    subcategories: [
      {
        id: 'racetams',
        name: 'Racetamy',
        description: 'Piracetam, Aniracetam, Oxiracetam i inne',
        icon: <Atom className="h-5 w-5" />,
        articleCount: 25,
        difficulty: 'Intermediate',
        estimatedTime: '120 min',
        prerequisites: ['neurotransmitters']
      },
      {
        id: 'adaptogens',
        name: 'Adaptogeny',
        description: 'Rhodiola, Ashwagandha, Ginseng',
        icon: <Shield className="h-5 w-5" />,
        articleCount: 20,
        difficulty: 'Beginner',
        estimatedTime: '75 min',
        prerequisites: []
      },
      {
        id: 'cholinergics',
        name: 'Cholinergiki',
        description: 'Alpha-GPC, Citicoline, Cholina',
        icon: <Activity className="h-5 w-5" />,
        articleCount: 18,
        difficulty: 'Intermediate',
        estimatedTime: '90 min',
        prerequisites: ['neurotransmitters']
      },
      {
        id: 'natural-nootropics',
        name: 'Naturalne Nootropiki',
        description: 'Lion\'s Mane, Bacopa, Ginkgo',
        icon: <Heart className="h-5 w-5" />,
        articleCount: 15,
        difficulty: 'Beginner',
        estimatedTime: '60 min',
        prerequisites: []
      }
    ]
  },
  {
    id: 'protocols',
    name: 'Protokoły',
    description: 'Sprawdzone protokoły suplementacyjne i optymalizacyjne',
    icon: <Target className="h-6 w-6" />,
    color: 'text-green-600',
    totalArticles: 32,
    completedArticles: 8,
    subcategories: [
      {
        id: 'morning-protocols',
        name: 'Protokoły Poranne',
        description: 'Optymalizacja porannej rutyny',
        icon: <Sun className="h-5 w-5" />,
        articleCount: 12,
        difficulty: 'Beginner',
        estimatedTime: '45 min',
        prerequisites: []
      },
      {
        id: 'sleep-protocols',
        name: 'Protokoły Snu',
        description: 'Optymalizacja jakości snu',
        icon: <Moon className="h-5 w-5" />,
        articleCount: 10,
        difficulty: 'Beginner',
        estimatedTime: '60 min',
        prerequisites: ['neurotransmitters']
      },
      {
        id: 'cycling-protocols',
        name: 'Cyklowanie',
        description: 'Strategie cyklowania suplementów',
        icon: <Activity className="h-5 w-5" />,
        articleCount: 10,
        difficulty: 'Advanced',
        estimatedTime: '90 min',
        prerequisites: ['supplements', 'neurotransmitters']
      }
    ]
  },
  {
    id: 'research',
    name: 'Badania Naukowe',
    description: 'Analiza najnowszych badań naukowych',
    icon: <Microscope className="h-6 w-6" />,
    color: 'text-orange-600',
    totalArticles: 56,
    completedArticles: 15,
    subcategories: [
      {
        id: 'clinical-trials',
        name: 'Badania Kliniczne',
        description: 'Wyniki badań klinicznych na ludziach',
        icon: <Users className="h-5 w-5" />,
        articleCount: 30,
        difficulty: 'Advanced',
        estimatedTime: '150 min',
        prerequisites: ['research-basics']
      },
      {
        id: 'meta-analyses',
        name: 'Meta-analizy',
        description: 'Analizy systematyczne i meta-analizy',
        icon: <TrendingUp className="h-5 w-5" />,
        articleCount: 16,
        difficulty: 'Advanced',
        estimatedTime: '120 min',
        prerequisites: ['research-basics']
      },
      {
        id: 'mechanism-studies',
        name: 'Mechanizmy Działania',
        description: 'Badania mechanizmów molekularnych',
        icon: <Dna className="h-5 w-5" />,
        articleCount: 10,
        difficulty: 'Intermediate',
        estimatedTime: '90 min',
        prerequisites: ['neurotransmitters']
      }
    ]
  }
];

const learningPaths: LearningPath[] = [
  {
    id: 'beginner-neurohacking',
    title: 'Wprowadzenie do Neurohackingu',
    description: 'Podstawy optymalizacji funkcji poznawczych',
    icon: <GraduationCap className="h-6 w-6" />,
    totalTime: '3h 30min',
    articles: ['neurotransmitters-basics', 'brain-anatomy-intro', 'basic-supplements'],
    progress: 65,
    difficulty: 'Beginner',
    tags: ['podstawy', 'neurobiologia', 'suplementy']
  },
  {
    id: 'memory-optimization',
    title: 'Optymalizacja Pamięci',
    description: 'Kompletny przewodnik poprawy pamięci',
    icon: <Brain className="h-6 w-6" />,
    totalTime: '5h 15min',
    articles: ['memory-mechanisms', 'cholinergics-guide', 'lions-mane-protocol'],
    progress: 40,
    difficulty: 'Intermediate',
    tags: ['pamięć', 'cholinergiki', 'naturalne']
  },
  {
    id: 'stress-resilience',
    title: 'Odporność na Stres',
    description: 'Adaptogeny i strategie radzenia sobie ze stresem',
    icon: <Shield className="h-6 w-6" />,
    totalTime: '4h 45min',
    articles: ['adaptogens-guide', 'cortisol-management', 'rhodiola-protocol'],
    progress: 25,
    difficulty: 'Intermediate',
    tags: ['stres', 'adaptogeny', 'kortyzol']
  }
];

export function EnhancedKnowledgeNavigation() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'categories' | 'paths' | 'bookmarks'>('categories');
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return knowledgeCategories;
    
    return knowledgeCategories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategories.some(sub => 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const filteredLearningPaths = useMemo(() => {
    if (!searchQuery) return learningPaths;
    
    return learningPaths.filter(path => 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centrum Wiedzy Neurohacking
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Systematycznie zorganizowana wiedza o optymalizacji funkcji poznawczych
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Szukaj wiedzy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'categories' ? 'default' : 'outline'}
                onClick={() => setViewMode('categories')}
              >
                Kategorie
              </Button>
              <Button
                variant={viewMode === 'paths' ? 'default' : 'outline'}
                onClick={() => setViewMode('paths')}
              >
                Ścieżki
              </Button>
              <Button
                variant={viewMode === 'bookmarks' ? 'default' : 'outline'}
                onClick={() => setViewMode('bookmarks')}
                className="relative"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Zakładki
                {bookmarkedItems.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {bookmarkedItems.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Twój postęp w nauce</CardTitle>
            <CardDescription>
              Śledź swoje postępy w odkrywaniu wiedzy neurohackingu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {knowledgeCategories.map(category => (
                <div key={category.id} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} bg-opacity-10 mb-2`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <Progress 
                    value={(category.completedArticles / category.totalArticles) * 100} 
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    {category.completedArticles} / {category.totalArticles} artykułów
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {viewMode === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kategorie</h2>
              <ScrollArea className="h-[400px] w-full">
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className={category.color}>{category.icon}</span>
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Postęp</span>
                          <span className="text-sm font-medium">
                            {category.completedArticles}/{category.totalArticles} artykułów
                          </span>
                        </div>
                        <Progress value={(category.completedArticles / category.totalArticles) * 100} />
                        
                        <div className="grid grid-cols-2 gap-2">
                          {category.subcategories.map((sub) => (
                            <Button
                              key={sub.id}
                              variant="outline"
                              size="sm"
                              className="text-xs justify-start"
                              onClick={() => {
                                setSelectedCategory(category.id);
                                setSelectedSubcategory(sub.id);
                              }}
                            >
                              <span className="mr-1">{sub.icon}</span>
                              {sub.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            </div>

            {/* Subcategories */}
            <div className="lg:col-span-2">
              {selectedCategory ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {knowledgeCategories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {knowledgeCategories
                      .find(c => c.id === selectedCategory)
                      ?.subcategories.map(subcategory => (
                        <Card key={subcategory.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                              {subcategory.icon}
                              {subcategory.name}
                            </CardTitle>
                            <CardDescription>{subcategory.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant={subcategory.difficulty === 'Beginner' ? 'default' : 
                                  subcategory.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                                  {subcategory.difficulty}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {subcategory.estimatedTime}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  {subcategory.articleCount} artykułów
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setSelectedSubcategory(subcategory.id)}
                                >
                                  Rozpocznij
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Wybierz kategorię
                  </h3>
                  <p className="text-gray-600">
                    Wybierz kategorię z lewego panelu, aby zobaczyć dostępne podkategorie i artykuły.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'paths' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ścieżki Nauki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLearningPaths.map(path => (
                <Card key={path.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-blue-600">{path.icon}</span>
                      {path.title}
                    </CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Postęp</span>
                          <span className="text-sm text-gray-600">{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Czas: {path.totalTime}</span>
                        <Badge variant={path.difficulty === 'Beginner' ? 'default' : 
                          path.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                          {path.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {path.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" size="sm">
                        Kontynuuj naukę
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'bookmarks' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakładki</h2>
            {bookmarkedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedItems.map(itemId => (
                  <Card key={itemId} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Zakładka: {itemId}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(itemId)}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Zapisany artykuł - kliknij aby przeczytać
                      </p>
                      <Button className="mt-2" size="sm" variant="outline">
                        Czytaj dalej
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Brak zakładek
                </h3>
                <p className="text-gray-600">
                  Dodaj artykuły do zakładek, aby łatwo do nich wrócić później.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}