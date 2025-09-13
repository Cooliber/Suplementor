'use client';

import React, { useState, useMemo } from 'react';
import { Brain, Lightbulb, TrendingUp, Clock, Target, Star, ChevronRight, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import  { type DashboardStats, type SupplementItem } from './OptimizedDashboard';

interface Recommendation {
  id: string;
  type: 'supplement' | 'lifestyle' | 'timing' | 'combination';
  title: string;
  description: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  expectedBenefit: string;
  timeframe: string;
  actionSteps: string[];
  scientificBasis?: string;
}

interface PersonalizedRecommendationsProps {
  stats: DashboardStats;
  supplements: SupplementItem[];
  userProfile?: {
    age: number;
    goals: string[];
    sleepPattern: 'early' | 'normal' | 'late';
    stressLevel: number;
    exerciseFrequency: number;
  };
}

/**
 *
 */
const PersonalizedRecommendations = ({ 
  stats, 
  supplements, 
  userProfile = {
    age: 30,
    goals: ['focus', 'memory', 'energy'],
    sleepPattern: 'normal',
    stressLevel: 6,
    exerciseFrequency: 3
  }
}: PersonalizedRecommendationsProps) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  // AI-driven recommendation engine
  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    // Analyze current performance gaps
    if (stats.focusScore < 80) {
      recs.push({
        id: 'focus-enhancement',
        type: 'supplement',
        title: 'Zwiększ koncentrację z Rhodiola Rosea',
        description: 'Dodanie Rhodiola Rosea może poprawić koncentrację o 15-25% w ciągu 2-4 tygodni',
        reasoning: `Twój obecny wynik koncentracji (${stats.focusScore}%) wskazuje na potrzebę wsparcia adaptogennego`,
        priority: 'high',
        confidence: 85,
        expectedBenefit: 'Poprawa koncentracji o 15-25%',
        timeframe: '2-4 tygodnie',
        actionSteps: [
          'Rozpocznij od 200mg Rhodiola Rosea rano na czczo',
          'Monitoruj efekty przez pierwszy tydzień',
          'Zwiększ dawkę do 400mg jeśli potrzeba po 2 tygodniach'
        ],
        scientificBasis: 'Badania pokazują skuteczność Rhodiola w redukcji zmęczenia umysłowego o 20%'
      });
    }

    // Memory optimization
    if (stats.memoryScore < 85) {
      const hasLionsMane = supplements.some(s => s.name.includes('Lion\'s Mane'));
      if (!hasLionsMane) {
        recs.push({
          id: 'memory-boost',
          type: 'supplement',
          title: 'Dodaj Lion\'s Mane dla pamięci',
          description: 'Lion\'s Mane stymuluje neurogenezę i może poprawić pamięć długoterminową',
          reasoning: 'Brak Lion\'s Mane w stosie przy wyniku pamięci poniżej 85%',
          priority: 'medium',
          confidence: 90,
          expectedBenefit: 'Poprawa pamięci o 10-20%',
          timeframe: '4-8 tygodni',
          actionSteps: [
            'Rozpocznij od 500mg Lion\'s Mane z posiłkiem',
            'Zwiększ do 1000mg po tygodniu',
            'Oceniaj postępy co 2 tygodnie'
          ],
          scientificBasis: 'Hericenony i erinacyny stymulują produkcję NGF (Nerve Growth Factor)'
        });
      }
    }

    // Timing optimization
    const hasLTheanine = supplements.some(s => s.name.includes('L-Theanine'));
    if (hasLTheanine && userProfile.stressLevel > 7) {
      recs.push({
        id: 'timing-optimization',
        type: 'timing',
        title: 'Optymalizuj timing L-Theanine',
        description: 'Przenieś L-Theanine na wieczór dla lepszego zarządzania stresem',
        reasoning: `Wysoki poziom stresu (${userProfile.stressLevel}/10) sugeruje potrzebę wieczornego wsparcia`,
        priority: 'medium',
        confidence: 75,
        expectedBenefit: 'Redukcja stresu o 20-30%',
        timeframe: '1-2 tygodnie',
        actionSteps: [
          'Przenieś L-Theanine na 2h przed snem',
          'Połącz z magnesem dla synergii',
          'Monitoruj jakość snu'
        ]
      });
    }

    // Lifestyle recommendations
    if (stats.energyLevel < 8) {
      recs.push({
        id: 'energy-lifestyle',
        type: 'lifestyle',
        title: 'Protokół energetyczny rano',
        description: 'Implementuj poranną rutynę dla stabilnej energii przez cały dzień',
        reasoning: `Niski poziom energii (${stats.energyLevel}/10) może być poprawiony przez optymalizację rytmu dobowego`,
        priority: 'high',
        confidence: 80,
        expectedBenefit: 'Wzrost energii o 25-40%',
        timeframe: '1-3 tygodnie',
        actionSteps: [
          'Ekspozycja na światło słoneczne w ciągu 30 min po przebudzeniu',
          'Zimny prysznic przez 2-3 minuty',
          'Suplementy energetyczne na czczo',
          'Unikaj kofeiny po 14:00'
        ],
        scientificBasis: 'Regulacja rytmu circadianowego wpływa na 40% poziomu energii'
      });
    }

    // Combination synergies
    const hasOmega3 = supplements.some(s => s.name.includes('Omega-3'));
    const hasBacopa = supplements.some(s => s.name.includes('Bacopa'));
    
    if (hasOmega3 && hasBacopa) {
      recs.push({
        id: 'synergy-combo',
        type: 'combination',
        title: 'Synergia Omega-3 + Bacopa',
        description: 'Optymalizuj timing dla maksymalnej synergii neuroprotektywnej',
        reasoning: 'Masz oba składniki - można zwiększyć efektywność przez lepszy timing',
        priority: 'low',
        confidence: 70,
        expectedBenefit: 'Zwiększenie efektywności o 15%',
        timeframe: '2-3 tygodnie',
        actionSteps: [
          'Omega-3 rano z tłuszczami',
          'Bacopa 30 min przed głównym posiłkiem',
          'Odstęp minimum 4h między dawkami'
        ],
        scientificBasis: 'Omega-3 zwiększa biodostępność bakozyków z Bacopa Monnieri'
      });
    }

    // Age-specific recommendations
    if (userProfile.age > 35) {
      recs.push({
        id: 'age-specific',
        type: 'supplement',
        title: 'Wsparcie mitochondrialne - CoQ10',
        description: 'Po 35. roku życia produkcja CoQ10 spada - rozważ suplementację',
        reasoning: `W wieku ${userProfile.age} lat naturalna produkcja CoQ10 jest obniżona o ~25%`,
        priority: 'medium',
        confidence: 85,
        expectedBenefit: 'Poprawa energii komórkowej o 20%',
        timeframe: '3-6 tygodni',
        actionSteps: [
          'Rozpocznij od 100mg CoQ10 z posiłkiem zawierającym tłuszcze',
          'Preferuj formę ubiquinol dla lepszej absorpcji',
          'Monitoruj poziom energii przez 4 tygodnie'
        ],
        scientificBasis: 'CoQ10 jest kluczowy dla produkcji ATP w mitochondriach'
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [stats, supplements, userProfile]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supplement': return <Brain className="h-4 w-4" />;
      case 'lifestyle': return <Target className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'combination': return <TrendingUp className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
          Spersonalizowane rekomendacje AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="supplement">Suplementy</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                isSelected={selectedRecommendation === rec.id}
                onSelect={() => setSelectedRecommendation(
                  selectedRecommendation === rec.id ? null : rec.id
                )}
                getTypeIcon={getTypeIcon}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </TabsContent>
          
          {['supplement', 'lifestyle', 'timing'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {recommendations
                .filter((rec) => rec.type === type)
                .map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    isSelected={selectedRecommendation === rec.id}
                    onSelect={() => setSelectedRecommendation(
                      selectedRecommendation === rec.id ? null : rec.id
                    )}
                    getTypeIcon={getTypeIcon}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  isSelected: boolean;
  onSelect: () => void;
  getTypeIcon: (type: string) => React.JSX.Element;
  getPriorityColor: (priority: string) => string;
}

/**
 *
 */
const RecommendationCard = ({ 
  recommendation, 
  isSelected, 
  onSelect, 
  getTypeIcon, 
  getPriorityColor 
}: RecommendationCardProps) => <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="mt-1">
            {getTypeIcon(recommendation.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-600">
                  {recommendation.confidence}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {recommendation.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>⏱️ {recommendation.timeframe}</span>
              <span>📈 {recommendation.expectedBenefit}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelect}
          className="ml-2"
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${
            isSelected ? 'rotate-90' : ''
          }`} />
        </Button>
      </div>
      
      {isSelected && (
        <div className="mt-4 pt-4 border-t space-y-4">
          <div>
            <h5 className="font-medium text-sm mb-2 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Uzasadnienie
            </h5>
            <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-sm mb-2">Plan działania</h5>
            <ol className="list-decimal list-inside space-y-1">
              {recommendation.actionSteps.map((step, index) => (
                <li key={index} className="text-sm text-gray-600">{step}</li>
              ))}
            </ol>
          </div>
          
          {recommendation.scientificBasis && (
            <div>
              <h5 className="font-medium text-sm mb-2">Podstawa naukowa</h5>
              <p className="text-sm text-gray-600 italic">
                {recommendation.scientificBasis}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
              Poziom pewności: {recommendation.confidence}%
            </div>
            <Progress value={recommendation.confidence} className="w-24 h-2" />
          </div>
        </div>
      )}
    </div>;

export default PersonalizedRecommendations;