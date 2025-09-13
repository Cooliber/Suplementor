'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useChat } from 'ai/react'
import {
  Brain,
  MessageCircle,
  Search,
  TrendingUp,
  Shield,
  AlertTriangle,
  Lightbulb,
  Clock,
  Star,
  Zap,
  Target,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
  Activity,
  Award,
  CheckCircle
} from 'lucide-react'
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging'

interface SupplementAnalysis {
  supplementName: string
  safetyRating: number
  efficacyRating: number
  keyBenefits: string[]
  potentialRisks: string[]
  recommendedDosage: {
    min: number
    max: number
    unit: string
    timing: string
  }
  targetConditions: string[]
  contraindications: string[]
  evidenceQuality: 'strong' | 'moderate' | 'weak' | 'insufficient'
  reasoning: string
}

interface KnowledgeQueryResult {
  answer: string
  keyPoints: string[]
  relatedSupplements: string[]
  mechanismsInvolved: string[]
  evidenceLevel: 'strong' | 'moderate' | 'weak' | 'theoretical'
  practicalApplications: string[]
  furtherReading: string[]
  warnings: string[]
}

const DEMO_SUPPLEMENTS = [
  { name: 'Vitamin D3', category: 'Vitamin', popular: true },
  { name: 'Omega-3 EPA/DHA', category: 'Fatty Acid', popular: true },
  { name: 'Magnesium Glycinate', category: 'Mineral', popular: true },
  { name: "Lion's Mane", category: 'Nootropic', popular: false },
  { name: 'Ashwagandha', category: 'Adaptogen', popular: true },
  { name: 'Creatine Monohydrate', category: 'Performance', popular: true }
]

const QUICK_QUESTIONS = [
  "What's the best time to take magnesium?",
  'Can I take vitamin D with other supplements?',
  'What are the benefits of omega-3 for brain health?',
  'How does ashwagandha help with stress?',
  "What's the difference between different forms of magnesium?",
  'Are there any supplement interactions I should know about?'
]

export default function AISupplementAssistant() {
  const [activeTab, setActiveTab] = useState('chat')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SupplementAnalysis | null>(null)
  const [queryResult, setQueryResult] = useState<KnowledgeQueryResult | null>(null)
  const [queryInput, setQueryInput] = useState('')
  const [selectedSupplement, setSelectedSupplement] = useState(DEMO_SUPPLEMENTS[0].name)
  const [userGoals, setUserGoals] = useState<{ goal: string }[]>([
    { goal: 'General Health' }
  ])
  const [newGoal, setNewGoal] = useState('')

  // AI Chat Hook from AI SDK
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: chatLoading,
    error: chatError
  } = useChat({
    api: '/api/ai/chat',
    body: {
      userId: 'demo-user',
      context: {
        conversationHistory: true,
        userProfile: {
          goals: userGoals
        }
      }
    },
    onError: (error) => {
      advancedDebugger.error(DebugCategory.AI, 'Chat error occurred', error)
    }
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addGoal = () => {
    if (newGoal.trim() && !userGoals.find((g) => g.goal === newGoal.trim())) {
      setUserGoals([...userGoals, { goal: newGoal.trim() }])
      setNewGoal('')
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setUserGoals(userGoals.filter((g) => g.goal !== goalToRemove))
  }

  const analyzeSupplement = async () => {
    setAnalysisLoading(true)

    const supplementData = DEMO_SUPPLEMENTS.find((s) => s.name === selectedSupplement)
    const demoSupplement = {
      name: selectedSupplement,
      commonNames: [selectedSupplement],
      activeCompounds:
        supplementData?.name === 'Omega-3 EPA/DHA'
          ? ['EPA', 'DHA']
          : supplementData?.name === 'Ashwagandha'
            ? ['Withanolides']
            : [selectedSupplement],
      primaryEffects:
        supplementData?.name === 'Vitamin D3'
          ? ['Bone Health', 'Immune Support', 'Mood Support']
          : supplementData?.name === 'Omega-3 EPA/DHA'
            ? ['Brain Health', 'Heart Health', 'Anti-inflammatory']
            : supplementData?.name === 'Magnesium Glycinate'
              ? ['Sleep Quality', 'Muscle Function', 'Stress Relief']
              : supplementData?.name === "Lion's Mane"
                ? ['Cognitive Enhancement', 'Neuroprotection', 'Focus']
                : supplementData?.name === 'Ashwagandha'
                  ? ['Stress Reduction', 'Cortisol Management', 'Energy']
                  : ['Performance', 'Strength', 'Recovery'],
      category: supplementData?.category || 'General',
      targetSystems: ['Various'],
      evidenceLevel: 'strong' as const
    }

    const demoUserContext = {
      goals: userGoals,
      healthConditions: [],
      currentSupplements: [],
      age: 30,
      gender: 'unspecified'
    }

    try {
      const response = await fetch('/api/ai/analyze-supplement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supplement: demoSupplement,
          userContext: demoUserContext
        })
      })

      const result = await response.json()

      if (result.success) {
        setAnalysisResult(result.data)
        advancedDebugger.info(
          DebugCategory.AI,
          'Supplement analysis completed',
          result.data
        )
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Supplement analysis failed', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleKnowledgeQuery = async () => {
    if (!queryInput.trim()) return

    setQueryLoading(true)

    try {
      const response = await fetch('/api/ai/knowledge-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: queryInput,
          context: {
            userGoals: userGoals,
            includeResearch: true
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        setQueryResult(result.data)
        advancedDebugger.info(DebugCategory.AI, 'Knowledge query completed', result.data)
      } else {
        throw new Error(result.error || 'Query failed')
      }
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Knowledge query failed', error)
      alert('Query failed. Please try again.')
    } finally {
      setQueryLoading(false)
    }
  }

  const sendQuickQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as any)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600'
    if (rating >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingBg = (rating: number) => {
    if (rating >= 80) return 'bg-green-500'
    if (rating >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getEvidenceBadge = (level: string) => {
    const colors = {
      strong: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-blue-100 text-blue-800 border-blue-300',
      weak: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      insufficient: 'bg-red-100 text-red-800 border-red-300',
      theoretical: 'bg-gray-100 text-gray-800 border-gray-300'
    }

    return colors[level as keyof typeof colors] || colors.insufficient
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Brain className="h-10 w-10 text-blue-600" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            AI Supplement Assistant
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Powered by AI SDK 5 and Gemini Flash for intelligent, personalized supplement
          guidance and health optimization
        </p>

        {/* User Goals Section */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4" />
                Your Health Goals
              </h3>
              <div className="flex flex-wrap gap-2">
                {userGoals.map((goal, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer transition-colors hover:bg-red-100 hover:text-red-800"
                    onClick={() => removeGoal(goal)}
                  >
                    {goal} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a health goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="text-sm"
                />
                <Button size="sm" onClick={addGoal}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Interactive Chat
          </TabsTrigger>
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Interactive Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 space-y-3 overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  {messages.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <Brain className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p>Start a conversation about supplements and health!</p>
                      <p className="mt-2 text-sm">
                        Ask me about supplement interactions, dosing, or health
                        optimization.
                      </p>
                    </div>
                  )}

                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 shadow-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-xs rounded-lg bg-white px-4 py-2 text-gray-800 shadow-md lg:max-w-md">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about supplements, interactions, dosing, health goals..."
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    type="submit"
                    disabled={chatLoading || !input.trim()}
                    className="self-end"
                  >
                    Send
                  </Button>
                </form>

                {chatError && (
                  <div className="text-sm text-red-600">Error: {chatError.message}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Supplement Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={analyzeSupplement}
                  disabled={analysisLoading}
                  className="w-full"
                >
                  {analysisLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Analyzing Vitamin D3...
                    </>
                  ) : (
                    'Analyze Vitamin D3 (Demo)'
                  )}
                </Button>

                {analysisResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 font-semibold">
                          <Shield className="h-4 w-4" />
                          Safety Rating
                        </h3>
                        <div
                          className={`text-2xl font-bold ${getRatingColor(analysisResult.safetyRating)}`}
                        >
                          {analysisResult.safetyRating}/100
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 font-semibold">
                          <Star className="h-4 w-4" />
                          Efficacy Rating
                        </h3>
                        <div
                          className={`text-2xl font-bold ${getRatingColor(analysisResult.efficacyRating)}`}
                        >
                          {analysisResult.efficacyRating}/100
                        </div>
                      </div>
                    </div>

                    <div>
                      <Badge className={getEvidenceBadge(analysisResult.evidenceQuality)}>
                        Evidence: {analysisResult.evidenceQuality}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">Key Benefits</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keyBenefits.map((benefit, i) => (
                          <Badge key={i} variant="outline">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 flex items-center gap-2 font-semibold">
                        <Clock className="h-4 w-4" />
                        Recommended Dosage
                      </h3>
                      <p className="rounded-lg bg-blue-50 p-3 text-sm">
                        {analysisResult.recommendedDosage.min}-
                        {analysisResult.recommendedDosage.max}
                        {analysisResult.recommendedDosage.unit} -{' '}
                        {analysisResult.recommendedDosage.timing}
                      </p>
                    </div>

                    {analysisResult.potentialRisks.length > 0 && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-700">
                          <AlertTriangle className="h-4 w-4" />
                          Potential Risks
                        </h3>
                        <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
                          {analysisResult.potentialRisks.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-2 font-semibold">AI Analysis</h3>
                      <p className="text-sm leading-relaxed text-gray-700">
                        {analysisResult.reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Knowledge Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ask complex questions about supplements, health, or nutrition..."
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleKnowledgeQuery}
                    disabled={queryLoading || !queryInput.trim()}
                    className="self-end"
                  >
                    {queryLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>

                {queryResult && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getEvidenceBadge(queryResult.evidenceLevel)}>
                        Evidence: {queryResult.evidenceLevel}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">Answer</h3>
                      <p className="leading-relaxed text-gray-700">
                        {queryResult.answer}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 flex items-center gap-2 font-semibold">
                        <Lightbulb className="h-4 w-4" />
                        Key Points
                      </h3>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                        {queryResult.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    {queryResult.relatedSupplements.length > 0 && (
                      <div>
                        <h3 className="mb-2 font-semibold">Related Supplements</h3>
                        <div className="flex flex-wrap gap-2">
                          {queryResult.relatedSupplements.map((supplement, i) => (
                            <Badge key={i} variant="secondary">
                              {supplement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {queryResult.practicalApplications.length > 0 && (
                      <div>
                        <h3 className="mb-2 font-semibold">Practical Applications</h3>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                          {queryResult.practicalApplications.map((application, i) => (
                            <li key={i}>{application}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {queryResult.warnings.length > 0 && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-700">
                          <AlertTriangle className="h-4 w-4" />
                          Important Warnings
                        </h3>
                        <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
                          {queryResult.warnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
