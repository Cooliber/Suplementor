'use client'

import {
  Brain,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Star,
  Heart,
  Bookmark,
  Share2,
  Lightbulb,
  Target,
  Zap,
  Activity,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Filter,
  RotateCcw,
  Info,
  ChevronRight,
  ArrowRight,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface UserProfile {
  id: string
  name: string
  avatar?: string
  level: number
  experience: number
  interests: string[]
  learningGoals: string[]
  completedTopics: string[]
  favoriteCategories: string[]
  studyTime: number // minutes per day
  learningStyle: 'visual' | 'textual' | 'interactive' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface ContentItem {
  id: string
  title: string
  description: string
  category: string
  type: 'article' | 'video' | 'interactive' | 'quiz' | 'protocol' | 'research' | 'guide'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  tags: string[]
  importance: number
  prerequisites: string[]
  relatedTopics: string[]
  completionRate?: number
  rating: number
  views: number
  author: string
  createdAt: string
  updatedAt: string
  thumbnail?: string
  isBookmarked?: boolean
  isCompleted?: boolean
  isRecommended?: boolean
  isTrending?: boolean
  predictedCompletion?: number
  similarity?: number
}

interface RecommendationReason {
  type: 'similar-content' | 'prerequisite' | 'trending' | 'user-behavior' | 'ai-insight'
  explanation: string
  confidence: number
}

interface Recommendation {
  content: ContentItem
  reasons: RecommendationReason[]
  score: number
  predictedCompletion: number
}

const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Jan Kowalski',
  level: 7,
  experience: 2450,
  interests: ['neuroplasticity', 'memory', 'supplements', 'lifestyle'],
  learningGoals: [
    'Master neuroplasticity',
    'Understand supplement mechanisms',
    'Improve memory'
  ],
  completedTopics: ['basic-neuroscience', 'omega-3-basics', 'sleep-fundamentals'],
  favoriteCategories: ['Neurobiologia', 'Suplementy', 'Lifestyle'],
  studyTime: 45,
  learningStyle: 'interactive',
  difficulty: 'intermediate'
}

const mockContent: ContentItem[] = [
  {
    id: 'neuroplasticity-deep-dive',
    title: 'Neuroplastyczność: Kompletny Przewodnik',
    description:
      'Dogłębna analiza mechanizmów neuroplastyczności i ich zastosowania w optymalizacji poznawczej',
    category: 'Neurobiologia',
    type: 'article',
    difficulty: 'advanced',
    duration: 25,
    tags: ['neuroplasticity', 'bdnf', 'synaptic-plasticity', 'nootropics'],
    importance: 95,
    prerequisites: ['basic-neuroscience', 'neurotransmitters'],
    relatedTopics: ['memory', 'learning', 'cognitive-enhancement'],
    rating: 4.8,
    views: 1250,
    author: 'Dr. Maria Nowak',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isRecommended: true,
    similarity: 0.92
  },
  {
    id: 'omega-3-mechanisms',
    title: 'Omega-3: Mechanizmy Działania w Mózgu',
    description:
      'Szczegółowe omówienie wpływu DHA i EPA na funkcje poznawcze i neuroplasticzność',
    category: 'Suplementy',
    type: 'interactive',
    difficulty: 'intermediate',
    duration: 15,
    tags: ['omega-3', 'dha', 'epa', 'neuroprotection', 'inflammation'],
    importance: 88,
    prerequisites: ['basic-lipids', 'brain-structure'],
    relatedTopics: ['memory', 'mood', 'neuroprotection'],
    rating: 4.6,
    views: 890,
    author: 'Prof. Tomasz Wiśniewski',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    isBookmarked: true,
    similarity: 0.85
  },
  {
    id: 'lions-mane-research-2024',
    title: "Najnowsze Badania Lion's Mane (2024)",
    description:
      'Przegląd najnowszych badań klinicznych nad Hericium erinaceus i jego wpływem na NGF',
    category: 'Suplementy',
    type: 'research',
    difficulty: 'intermediate',
    duration: 20,
    tags: ['lions-mane', 'ngf', 'neurogenesis', 'clinical-trials'],
    importance: 90,
    prerequisites: ['mushroom-basics', 'ngf-mechanism'],
    relatedTopics: ['neurogenesis', 'nerve-regeneration', 'cognitive-enhancement'],
    rating: 4.7,
    views: 650,
    author: 'Dr. Anna Kowalska',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    isTrending: true,
    similarity: 0.78
  },
  {
    id: 'memory-enhancement-protocol',
    title: 'Protokół Wzmacniania Pamięci',
    description:
      'Kompletny protokół łączący suplementację, ćwiczenia i techniki poznawcze',
    category: 'Protokoły',
    type: 'protocol',
    difficulty: 'intermediate',
    duration: 30,
    tags: ['memory', 'protocol', 'supplements', 'lifestyle', 'cognitive-training'],
    importance: 85,
    prerequisites: ['memory-basics', 'supplement-safety'],
    relatedTopics: ['learning', 'focus', 'retention'],
    rating: 4.9,
    views: 2100,
    author: 'Zespół NootropicLab',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-25',
    isRecommended: true,
    predictedCompletion: 0.85
  },
  {
    id: 'sleep-optimization-guide',
    title: 'Optymalizacja Snu dla Neuroplasticzności',
    description: 'Jak poprawić jakość snu dla maksymalizacji procesów neuroplastycznych',
    category: 'Lifestyle',
    type: 'guide',
    difficulty: 'beginner',
    duration: 12,
    tags: ['sleep', 'circadian-rhythm', 'neuroplasticity', 'recovery'],
    importance: 92,
    prerequisites: ['sleep-basics'],
    relatedTopics: ['memory-consolidation', 'bdnf', 'recovery'],
    rating: 4.7,
    views: 1800,
    author: 'Dr. Piotr Lewandowski',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    isCompleted: true,
    similarity: 0.88
  }
]

export function ContentRecommendationEngine() {
  const [activeTab, setActiveTab] = useState('personalized')
  const [userProfile] = useState<UserProfile>(mockUserProfile)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Record<string, boolean>>({})

  // Generate AI-powered recommendations
  const generateRecommendations = useMemo(() => {
    const scoredContent: Recommendation[] = mockContent.map((content) => {
      let score = 0
      const reasons: RecommendationReason[] = []

      // User interests matching
      const interestMatches = content.tags.filter((tag) =>
        userProfile.interests.some(
          (interest) =>
            tag.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(tag.toLowerCase())
        )
      ).length

      if (interestMatches > 0) {
        score += interestMatches * 15
        reasons.push({
          type: 'user-behavior',
          explanation: `Dopasowane do Twoich zainteresowań: ${content.tags.slice(0, 2).join(', ')}`,
          confidence: 0.85
        })
      }

      // Difficulty matching
      if (content.difficulty === userProfile.difficulty) {
        score += 20
        reasons.push({
          type: 'ai-insight',
          explanation: `Dopasowany poziom trudności: ${content.difficulty}`,
          confidence: 0.9
        })
      }

      // Category preference
      if (userProfile.favoriteCategories.includes(content.category)) {
        score += 25
        reasons.push({
          type: 'user-behavior',
          explanation: `Ulubiona kategoria: ${content.category}`,
          confidence: 0.95
        })
      }

      // Prerequisites check
      const hasPrerequisites = content.prerequisites.every((prereq) =>
        userProfile.completedTopics.includes(prereq)
      )

      if (hasPrerequisites) {
        score += 10
        reasons.push({
          type: 'prerequisite',
          explanation: 'Masz wymagane przedmioty wstępne',
          confidence: 1.0
        })
      }

      // Content quality
      score += content.rating * 5
      if (content.views > 1000) {
        score += 10
        reasons.push({
          type: 'trending',
          explanation: 'Popularne wśród użytkowników',
          confidence: 0.7
        })
      }

      // Similarity score
      if (content.similarity) {
        score += content.similarity * 20
      }

      // Predict completion rate based on user behavior
      const predictedCompletion = Math.min(
        1,
        (userProfile.studyTime / content.duration) * 0.8 + (content.rating / 5) * 0.2
      )

      return {
        content,
        reasons,
        score: Math.min(100, score),
        predictedCompletion
      }
    })

    return scoredContent
      .filter((rec) => rec.score > 30 && !rec.content.isCompleted)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }, [userProfile])

  useEffect(() => {
    setRecommendations(generateRecommendations)
  }, [generateRecommendations])

  const toggleBookmark = (contentId: string) => {
    setBookmarkedItems((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    )
  }

  const provideFeedback = (contentId: string, isPositive: boolean) => {
    setFeedback((prev) => ({ ...prev, [contentId]: isPositive }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-4 w-4" />
      case 'video':
        return <Activity className="h-4 w-4" />
      case 'interactive':
        return <Target className="h-4 w-4" />
      case 'quiz':
        return <Zap className="h-4 w-4" />
      case 'protocol':
        return <Lightbulb className="h-4 w-4" />
      case 'research':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const renderRecommendationCard = (recommendation: Recommendation) => {
    const { content, reasons, score, predictedCompletion } = recommendation
    const isBookmarked = bookmarkedItems.includes(content.id)
    const userFeedback = feedback[content.id]

    return (
      <Card key={content.id} className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${getDifficultyColor(content.difficulty)}`}>
                {getTypeIcon(content.type)}
              </div>
              <div>
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <span>{content.author}</span>
                  <span>•</span>
                  <span>{content.duration} min</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {Math.round(score)}% dopasowanie
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(content.id)}
              >
                <Heart
                  className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="mb-3 text-sm text-gray-600">{content.description}</p>

          <div className="mb-3 flex flex-wrap gap-2">
            {content.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{content.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-medium">Dlaczego polecane?</h4>
            {reasons.slice(0, 2).map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" />
                <span className="text-gray-600">{reason.explanation}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{content.rating}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{content.views}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {userFeedback === undefined && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => provideFeedback(content.id, true)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => provideFeedback(content.id, false)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button size="sm" className="gap-1">
                Rozpocznij
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {predictedCompletion && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>Przewidywane ukończenie</span>
                <span>{Math.round(predictedCompletion * 100)}%</span>
              </div>
              <Progress value={predictedCompletion * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderLearningPath = () => {
    const beginnerPath = [
      'basic-neuroscience',
      'neurotransmitters-intro',
      'supplement-safety',
      'lifestyle-fundamentals'
    ]

    const intermediatePath = [
      'neuroplasticity-mechanisms',
      'supplement-synergy',
      'advanced-protocols',
      'research-analysis'
    ]

    const advancedPath = [
      'clinical-applications',
      'personalized-protocols',
      'cutting-edge-research',
      'expert-level-optimization'
    ]

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Ścieżka nauki dopasowana do Ciebie</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-sm">Poziom początkujący</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {beginnerPath.map((topic, index) => (
                    <div key={topic} className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          userProfile.completedTopics.includes(topic)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-sm">Poziom średniozaawansowany</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {intermediatePath.map((topic, index) => (
                    <div key={topic} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-sm">Poziom zaawansowany</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {advancedPath.map((topic, index) => (
                    <div key={topic} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderTrendingContent = () => {
    const trending = mockContent
      .filter((content) => content.views > 500)
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Trendujące treści</h3>
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Odśwież
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {trending.map((content) => (
            <Card key={content.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    🔥 {content.views} wyświetleń
                  </Badge>
                  <Badge className={getDifficultyColor(content.difficulty)}>
                    {content.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base">{content.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-gray-600">{content.description}</p>
                <Button size="sm" className="w-full">
                  Przeczytaj teraz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                Inteligentne Rekomendacje
              </h1>
              <p className="text-xl text-gray-600">
                Spersonalizowane treści dopasowane do Twoich celów i stylu nauki
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userProfile.name}</p>
                  <p className="text-sm text-gray-600">Poziom {userProfile.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {userProfile.experience}
                  </div>
                  <div className="text-sm text-gray-600">Doświadczenie</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userProfile.completedTopics.length}
                  </div>
                  <div className="text-sm text-gray-600">Ukończone tematy</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userProfile.studyTime}
                  </div>
                  <div className="text-sm text-gray-600">min/dzień</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {bookmarkedItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Zakładki</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="personalized">Dla Ciebie</TabsTrigger>
            <TabsTrigger value="learning-path">Ścieżka nauki</TabsTrigger>
            <TabsTrigger value="trending">Trendy</TabsTrigger>
            <TabsTrigger value="bookmarks">Zakładki</TabsTrigger>
          </TabsList>

          <TabsContent value="personalized" className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">
                Spersonalizowane rekomendacje ({recommendations.length})
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {recommendations.map(renderRecommendationCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learning-path">{renderLearningPath()}</TabsContent>

          <TabsContent value="trending">{renderTrendingContent()}</TabsContent>

          <TabsContent value="bookmarks">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Twoje zapisane treści</h3>
              {bookmarkedItems.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Heart className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <p className="text-gray-600">Nie masz jeszcze żadnych zakładek</p>
                    <Button className="mt-4" onClick={() => setActiveTab('personalized')}>
                      Odkryj treści
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {mockContent
                    .filter((content) => bookmarkedItems.includes(content.id))
                    .map((content) =>
                      renderRecommendationCard({
                        content,
                        reasons: [
                          {
                            type: 'user-behavior',
                            explanation: 'Zapisane przez Ciebie',
                            confidence: 1
                          }
                        ],
                        score: 100,
                        predictedCompletion: 0
                      })
                    )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
