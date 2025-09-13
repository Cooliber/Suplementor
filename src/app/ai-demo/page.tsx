'use client'

import React from 'react'
import AISupplementAssistant from '@/components/AI/AISupplementAssistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Shield,
  Brain,
  CheckCircle,
  Users,
  Globe,
  Award
} from 'lucide-react'

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-16 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <Brain className="h-16 w-16 text-blue-200" />
                <Sparkles className="absolute -top-1 -right-1 h-6 w-6 animate-pulse text-yellow-300" />
              </div>
              <h1 className="text-5xl font-bold md:text-7xl">
                AI Supplement
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>
            </div>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
              Experience the future of personalized supplement guidance with
              <span className="font-semibold text-yellow-300"> AI SDK 5</span> and
              <span className="font-semibold text-yellow-300"> Google Gemini Flash</span>
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Badge className="border-white/30 bg-white/20 px-4 py-2 text-sm text-white">
                <Zap className="mr-2 h-4 w-4" />
                Real-time AI Analysis
              </Badge>
              <Badge className="border-white/30 bg-white/20 px-4 py-2 text-sm text-white">
                <Shield className="mr-2 h-4 w-4" />
                Safety-First Approach
              </Badge>
              <Badge className="border-white/30 bg-white/20 px-4 py-2 text-sm text-white">
                <Globe className="mr-2 h-4 w-4" />
                Evidence-Based
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Advanced AI Capabilities
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Powered by cutting-edge AI technology to provide personalized,
              evidence-based supplement recommendations
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-transform group-hover:scale-110">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Interactive AI Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  Conversational AI that understands your health goals and provides
                  personalized guidance with streaming responses.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Context-aware conversations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Memory of chat history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Built-in research tools
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-transform group-hover:scale-110">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">AI Analysis Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  Comprehensive supplement analysis with safety and efficacy ratings,
                  personalized to your health profile.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Safety ratings (0-100)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Dosage optimization
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Risk assessments
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-transform group-hover:scale-110">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Personalized Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  Set and track your health goals while receiving AI recommendations
                  tailored to your specific needs.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Custom health goals
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Goal-based recommendations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Progress tracking
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Highlights */}
          <Card className="mb-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                Powered by Cutting-Edge Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-blue-300">AI SDK 5</div>
                  <div className="text-sm text-gray-300">
                    Latest AI SDK with streaming & tools
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-green-300">
                    Gemini Flash
                  </div>
                  <div className="text-sm text-gray-300">Google's fastest AI model</div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-purple-300">
                    TypeScript
                  </div>
                  <div className="text-sm text-gray-300">
                    Full type safety & validation
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-yellow-300">
                    Next.js 14
                  </div>
                  <div className="text-sm text-gray-300">Modern React framework</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main AI Assistant */}
      <div className="pb-20">
        <AISupplementAssistant />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-semibold">AI Supplement Assistant</span>
          </div>
          <p className="mb-4 text-gray-400">
            Built with ❤️ using AI SDK 5, Google Gemini Flash, and Next.js
          </p>
          <p className="text-sm text-gray-500">
            This system is for educational and informational purposes only. Always consult
            with healthcare professionals before making supplement decisions.
          </p>
        </div>
      </footer>
    </div>
  )
}
