'use client';

import React from 'react';
import AISupplementAssistant from '@/components/AI/AISupplementAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Brain, 
  CheckCircle, 
  Users,
  Globe,
  Award
} from 'lucide-react';

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <Brain className="h-16 w-16 text-blue-200" />
                <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                AI Supplement
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Assistant
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience the future of personalized supplement guidance with 
              <span className="font-semibold text-yellow-300"> AI SDK 5</span> and 
              <span className="font-semibold text-yellow-300"> Google Gemini Flash</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                Real-time AI Analysis
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Safety-First Approach
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                Evidence-Based
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to provide personalized, evidence-based supplement recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Interactive AI Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Conversational AI that understands your health goals and provides personalized guidance with streaming responses.
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

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">AI Analysis Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive supplement analysis with safety and efficacy ratings, personalized to your health profile.
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

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Personalized Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Set and track your health goals while receiving AI recommendations tailored to your specific needs.
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
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                Powered by Cutting-Edge Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300 mb-2">AI SDK 5</div>
                  <div className="text-sm text-gray-300">Latest AI SDK with streaming & tools</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300 mb-2">Gemini Flash</div>
                  <div className="text-sm text-gray-300">Google's fastest AI model</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300 mb-2">TypeScript</div>
                  <div className="text-sm text-gray-300">Full type safety & validation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">Next.js 14</div>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-semibold">AI Supplement Assistant</span>
          </div>
          <p className="text-gray-400 mb-4">
            Built with ❤️ using AI SDK 5, Google Gemini Flash, and Next.js
          </p>
          <p className="text-sm text-gray-500">
            This system is for educational and informational purposes only. 
            Always consult with healthcare professionals before making supplement decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}