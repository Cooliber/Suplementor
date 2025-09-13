'use client';

import { 
  Search, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  Brain,
  Lightbulb,
  Target,
  Users,
  Activity,
  Zap,
  Heart,
  Shield,
  Star,
  Bookmark,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  type: 'article' | 'protocol' | 'research' | 'guide';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  description: string;
  tags: string[];
  relevanceScore: number;
  lastUpdated: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  keyTakeaways: string[];
  practicalApplications: string[];
  relatedItems: string[];
  evidenceLevel: 'High' | 'Medium' | 'Low';
  sources: number;
}

interface SearchFilters {
  category: string[];
  difficulty: string[];
  type: string[];
  evidenceLevel: string[];
  readTime: [number, number];
  hasPractical: boolean;
  hasSources: boolean;
  lastUpdated: string;
}

type FilterableKeys = 'category' | 'difficulty' | 'type' | 'evidenceLevel';

interface SearchSuggestion {
  text: string;
  type: 'trending' | 'recent' | 'recommended';
  icon: React.ReactNode;
}

interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  type: 'next_read' | 'related' | 'prerequisite' | 'advanced';
}

const mockSearchResults: SearchResult[] = [
  {
    id: 'omega-3-brain-health',
    title: 'Omega-3 i zdrowie mózgu: Kompletny przewodnik',
    category: 'Suplementy',
    subcategory: 'Essential Fatty Acids',
    type: 'article',
    difficulty: 'Intermediate',
    readTime: '12 min',
    description: 'Dogłębna analiza wpływu kwasów tłuszczowych Omega-3 na funkcje poznawcze, neuroplastyczność i długoterminowe zdrowie mózgu.',
    tags: ['omega-3', 'DHA', 'EPA', 'neuroplastyczność', 'pamięć', 'koncentracja'],
    relevanceScore: 0.95,
    lastUpdated: '2024-01-15',
    isCompleted: false,
    isBookmarked: true,
    keyTakeaways: [
      'DHA stanowi 40% wielonienasyconych kwasów tłuszczowych w mózgu',
      'Suplementacja Omega-3 poprawia pamięć roboczą o 15-23%',
      'Najlepsze efekty przy dawkach 1000-2000mg EPA+DHA'
    ],
    practicalApplications: [
      'Dawkowanie: 1000-2000mg EPA+DHA dziennie',
      'Najlepiej przyjmować z posiłkiem zawierającym tłuszcze',
      'Cyklowanie: 3 miesiące suplementacji, 1 miesiąc przerwy'
    ],
    relatedItems: ['magnesium-brain', 'vitamin-d3-cognitive', 'lions-mane-neurogenesis'],
    evidenceLevel: 'High',
    sources: 23
  },
  {
    id: 'lions-mane-neurogenesis-protocol',
    title: 'Protokół Lion\'s Mane dla neurogenezy',
    category: 'Protokoły',
    subcategory: 'Naturalne Nootropiki',
    type: 'protocol',
    difficulty: 'Beginner',
    readTime: '8 min',
    description: 'Sprawdzony protokół wykorzystujący Lion\'s Mane do stymulacji neurogenezy i poprawy funkcji poznawczych.',
    tags: ['lions-mane', 'neurogeneza', 'NGF', 'protocol', 'naturalne'],
    relevanceScore: 0.92,
    lastUpdated: '2024-01-12',
    isCompleted: true,
    isBookmarked: false,
    keyTakeaways: [
      'Lion\'s Mane zwiększa produkcję NGF o 20-60%',
      'Pierwsze efekty widoczne po 2-4 tygodniach',
      'Pełne korzyści po 8-12 tygodniach regularnego stosowania'
    ],
    practicalApplications: [
      'Dawkowanie: 500-1000mg ekstraktu dziennie',
      'Najlepiej rano na czczo lub z lekkim posiłkiem',
      'Łączenie z Alpha-GPC dla lepszych efektów'
    ],
    relatedItems: ['alpha-gpc-choline', 'bacopa-memory', 'neuroplasticity-guide'],
    evidenceLevel: 'High',
    sources: 15
  }
];

const searchSuggestions: SearchSuggestion[] = [
  { text: 'Omega-3 dla mózgu', type: 'trending', icon: <TrendingUp className="h-4 w-4" /> },
  { text: 'Neurogeneza', type: 'recent', icon: <Brain className="h-4 w-4" /> },
  { text: 'Protokoły snu', type: 'recommended', icon: <Lightbulb className="h-4 w-4" /> },
  { text: 'Adaptogeny', type: 'trending', icon: <TrendingUp className="h-4 w-4" /> }
];

const aiRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Zaawansowany protokół neurogenezy',
    reason: 'Na podstawie Twojego zainteresowania Lion\'s Mane',
    confidence: 0.92,
    type: 'next_read'
  },
  {
    id: 'rec-2',
    title: 'Omega-3 dla początkujących',
    reason: 'Uzupełnienie wiedzy o podstawach',
    confidence: 0.88,
    type: 'prerequisite'
  },
  {
    id: 'rec-3',
    title: 'Zaawansowane protokoły nootropowe',
    reason: 'Rozszerzenie wiedzy po podstawach',
    confidence: 0.85,
    type: 'advanced'
  }
];

export default function SmartSearchSystem() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'difficulty' | 'readTime'>('relevance');
  
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    difficulty: [],
    type: [],
    evidenceLevel: [],
    readTime: [0, 60],
    hasPractical: false,
    hasSources: false,
    lastUpdated: 'all'
  });

  const activeFiltersCount = useMemo(() => {
    return filters.category.length + filters.difficulty.length + filters.type.length + 
           filters.evidenceLevel.length + (filters.hasPractical ? 1 : 0) + 
           (filters.hasSources ? 1 : 0);
  }, [filters]);

  const toggleFilter = useCallback((filterType: FilterableKeys, value: string) => {
    setFilters(prev => {
      const currentValue = prev[filterType];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [filterType]: currentValue.includes(value)
            ? currentValue.filter(item => item !== value)
            : [...currentValue, value]
        } as SearchFilters;
      }
      return prev;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      difficulty: [],
      type: [],
      evidenceLevel: [],
      readTime: [0, 60],
      hasPractical: false,
      hasSources: false,
      lastUpdated: 'all'
    });
  }, []);

  const filteredResults = useMemo(() => {
    let results = [...mockSearchResults];

    if (searchQuery !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(result =>
        result.title.toLowerCase().includes(query) ||
        result.description.toLowerCase().includes(query) ||
        result.tags.some(tag => tag.toLowerCase().includes(query)) ||
        result.category.toLowerCase().includes(query)
      );
    }

    if (filters.category.length > 0) {
      results = results.filter(result => filters.category.includes(result.category));
    }

    if (filters.difficulty.length > 0) {
      results = results.filter(result => filters.difficulty.includes(result.difficulty));
    }

    if (filters.type.length > 0) {
      results = results.filter(result => filters.type.includes(result.type));
    }

    if (filters.evidenceLevel.length > 0) {
      results = results.filter(result => filters.evidenceLevel.includes(result.evidenceLevel));
    }

    results = results.filter(result => {
      const readTime = parseInt(result.readTime);
      return readTime >= filters.readTime[0] && readTime <= filters.readTime[1];
    });

    if (filters.hasPractical) {
      results = results.filter(result => result.practicalApplications.length > 0);
    }

    if (filters.hasSources) {
      results = results.filter(result => result.sources > 0);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime);
        default:
          return 0;
      }
    });

    return results;
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inteligentne Wyszukiwanie Wiedzy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Znajdź dokładnie to, czego potrzebujesz z naszą zaawansowaną wyszukiwarką
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Wyszukaj wiedzę, suplementy, protokoły..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 pr-4 py-3 text-lg w-full"
            />
            {searchQuery !== '' && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions === true && searchQuery === '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sugestie</h3>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setSearchQuery(suggestion.text);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className={`mr-2 ${
                          suggestion.type === 'trending' ? 'text-orange-500' :
                          suggestion.type === 'recent' ? 'text-blue-500' :
                          'text-green-500'
                        }`}>
                          {suggestion.icon}
                        </span>
                        <span className="flex-1">{suggestion.text}</span>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtry
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Filtry</h4>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Wyczyść
                    </Button>
                  </div>

                  <Separator />

                  {/* Category Filter */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Kategoria</h5>
                    <div className="space-y-1">
                      {['Suplementy', 'Neurobiologia', 'Protokoły', 'Badania'].map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.category.includes(category)}
                            onChange={() => toggleFilter('category', category)}
                            className="rounded"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Trudność</h5>
                    <div className="space-y-1">
                      {['Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
                        <label key={difficulty} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.difficulty.includes(difficulty)}
                            onChange={() => toggleFilter('difficulty', difficulty)}
                            className="rounded"
                          />
                          <span className="text-sm">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Read Time Slider */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">
                      Czas czytania: {filters.readTime[0]}-{filters.readTime[1]} min
                    </h5>
                    <Slider
                      value={filters.readTime}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, readTime: value as [number, number] }))}
                      max={60}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Toggle Filters */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Z praktycznymi zastosowaniami</span>
                      <Switch
                        checked={filters.hasPractical}
                        onCheckedChange={(checked) =>
                          setFilters(prev => ({ ...prev, hasPractical: checked }))
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Z wiarygodnymi źródłami</span>
                      <Switch
                        checked={filters.hasSources}
                        onCheckedChange={(checked) =>
                          setFilters(prev => ({ ...prev, hasSources: checked }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'difficulty' | 'readTime')}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="relevance">Trafność</option>
              <option value="date">Data aktualizacji</option>
              <option value="difficulty">Trudność</option>
              <option value="readTime">Czas czytania</option>
            </select>
          </div>
        </div>

        {/* AI Recommendations */}
        {searchQuery === '' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              Rekomendacje AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiRecommendations.map(rec => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <CardDescription>{rec.reason}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        Pewność: {Math.round(rec.confidence * 100)}%
                      </Badge>
                      <Button size="sm" variant="ghost">
                        Czytaj
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery ? `Wyniki dla "${searchQuery}"` : 'Wszystkie artykuły'}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredResults.length} wyników
            </span>
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResults.map(result => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{result.category}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Bookmark className={`h-4 w-4 ${result.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription>{result.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {result.readTime}
                        </span>
                        <Badge variant={result.difficulty === 'Beginner' ? 'default' : 
                          result.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                          {result.difficulty}
                        </Badge>
                        <Badge variant={result.evidenceLevel === 'High' ? 'default' : 
                          result.evidenceLevel === 'Medium' ? 'secondary' : 'outline'}>
                          {result.evidenceLevel} evidence
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {result.tags.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.tags.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Aktualizacja: {new Date(result.lastUpdated).toLocaleDateString('pl-PL')}
                          </span>
                          <Button size="sm">
                            Czytaj artykuł
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Brak wyników
              </h3>
              <p className="text-gray-600 mb-4">
                Nie znaleziono artykułów spełniających podane kryteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Wyczyść filtry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}