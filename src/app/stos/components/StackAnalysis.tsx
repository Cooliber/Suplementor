'use client'

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  Shield,
  Zap,
  AlertOctagon
} from 'lucide-react'
import { useMemo } from 'react'

import { Sparkline } from '@/components/Sparkline'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ErrorLogger, AppError, ErrorType } from '@/lib/error-handling'
import { type StackItem, type Interaction, type SafetyProfile } from '@/types/supplement'

interface StackAnalysisProps {
  items: StackItem[]
}

const cognitiveGoals = [
  'pamięć',
  'koncentracja',
  'kognitywne',
  'uczenie',
  'energia neuronalną',
  'plastyczność'
]

interface InteractionRule {
  pattern: string[]
  message: string
  severity: 'low' | 'medium' | 'high'
  recommendation: string
}

const interactionDatabase: Record<string, InteractionRule> = {
  'stimulant-combo': {
    pattern: ['caffeine', 'rhodiola', 'tyrosine'],
    message:
      'Kombinacja stymulantów może powodować nadmierną stymulację i problemy ze snem',
    severity: 'medium' as const,
    recommendation: 'Rozłóż czas przyjmowania - stymulanty rano, relaksujące wieczorem'
  },
  'serotonin-syndrome': {
    pattern: ['5-htp', 'ssri', 'rhodiola'],
    message: 'Ryzyko zespołu serotoninowego przy łączeniu z lekami SSRI',
    severity: 'high' as const,
    recommendation: 'Konsultacja z lekarzem przed użyciem'
  },
  'cholinergic-overload': {
    pattern: ['alpha-gpc', 'huperzine', 'choline-bitartrate'],
    message: 'Nadmierna stymulacja układu cholingericznego może powodować bóle głowy',
    severity: 'medium' as const,
    recommendation: 'Zmniejsz dawki lub rozłóż w czasie'
  },
  'magnesium-calcium': {
    pattern: ['magnesium', 'calcium', 'zinc'],
    message: 'Konkurencja o wchłanianie - minerały mogą się blokować',
    severity: 'low' as const,
    recommendation: 'Przyjmuj w różnych porach dnia'
  }
}

/**
 *
 */
export const StackAnalysis = ({ items }: StackAnalysisProps) => {
  const safetyProfile = useMemo((): SafetyProfile => {
    try {
      const interactions: Interaction[] = []
      const warnings: string[] = []
      const contraindications: string[] = []

      // Check for interactions between supplements
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const supp1 = items[i]!.supplement
          const supp2 = items[j]!.supplement

          // Check if supp1 has interactions with supp2
          const hasInteraction =
            supp1.interactions?.includes(supp2.name) ||
            supp1.interactions?.includes(supp2.polishName) ||
            supp2.interactions?.includes(supp1.name) ||
            supp2.interactions?.includes(supp1.polishName)

          if (hasInteraction) {
            interactions.push({
              type: 'warning',
              message: `${supp1.polishName} może wchodzić w interakcję z ${supp2.polishName}`,
              severity: 'medium',
              supplements: [supp1.polishName, supp2.polishName],
              recommendation: 'Rozważ rozdzielenie dawek o 2-3 godziny'
            })
          }
        }
      }

      // Check for dosage warnings
      items.forEach((item) => {
        const customDosage = item.customDosage
        const recommendedDosage = item.supplement.dosage

        // Simple check if custom dosage contains higher numbers than recommended
        const customNumbers = customDosage?.match(/\d+/g)?.map(Number) || []
        const recommendedNumbers = recommendedDosage.match(/\d+/g)?.map(Number) || []

        if (customNumbers.length > 0 && recommendedNumbers.length > 0) {
          const maxCustom = Math.max(...customNumbers)
          const maxRecommended = Math.max(...recommendedNumbers)

          if (maxCustom > maxRecommended * 1.5) {
            // 50% higher than recommended
            warnings.push(
              `${item.supplement.polishName}: dawka ${customDosage} przekracza zalecenia (${recommendedDosage})`
            )
          }
        }

        // Collect warnings and contraindications
        if (item.supplement.warnings) {
          warnings.push(...item.supplement.warnings)
        }
        if (item.supplement.contraindications) {
          contraindications.push(...item.supplement.contraindications)
        }
      })

      // Determine overall risk
      let overallRisk: 'low' | 'medium' | 'high' = 'low'
      if (
        interactions.some((i) => i.severity === 'high') ||
        contraindications.length > 0
      ) {
        overallRisk = 'high'
      } else if (
        interactions.some((i) => i.severity === 'medium') ||
        warnings.length > 3
      ) {
        overallRisk = 'medium'
      }

      return {
        overallRisk,
        interactions,
        warnings: [...new Set(warnings)], // Remove duplicates
        contraindications: [...new Set(contraindications)],
        dosageWarnings: [],
        timingConflicts: [],
        cycleRecommendations: []
      }
    } catch (error) {
      ErrorLogger.getInstance().log(
        new AppError('Failed to calculate safety profile', ErrorType.COMPONENT, {
          error,
          items
        })
      )

      return {
        overallRisk: 'high' as const,
        interactions: [],
        warnings: [],
        contraindications: [],
        dosageWarnings: ['Błąd podczas analizy bezpieczeństwa'],
        timingConflicts: [],
        cycleRecommendations: []
      }
    }
  }, [items])

  // Calculate synergy score for Sparkline visualization
  const synergyScore = useMemo(() => {
    let totalScore = 0
    items.forEach((item) => {
      // Score based on benefits matching cognitive goals (using existing benefits field)
      const benefitMatch = item.supplement.benefits.filter((benefit) =>
        cognitiveGoals.some((goal) => benefit.toLowerCase().includes(goal.toLowerCase()))
      ).length
      totalScore += benefitMatch * 10 // 10 points per matching benefit
    })
    return totalScore
  }, [items])

  const _getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <CheckCircle className="h-5 w-5" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />
      case 'high':
        return <AlertOctagon className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Safety Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ocena Bezpieczeństwa</CardTitle>
              <CardDescription>Analiza ryzyka dla Twojego stacka</CardDescription>
            </div>
            <Badge
              variant={
                safetyProfile.overallRisk === 'low'
                  ? 'secondary'
                  : safetyProfile.overallRisk === 'medium'
                    ? 'default'
                    : 'destructive'
              }
              className="flex items-center"
            >
              {getRiskIcon(safetyProfile.overallRisk)}
              <span className="ml-2">
                {safetyProfile.overallRisk === 'low'
                  ? 'Niskie ryzyko'
                  : safetyProfile.overallRisk === 'medium'
                    ? 'Średnie ryzyko'
                    : 'Wysokie ryzyko'}
              </span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Interactions */}
      {safetyProfile.interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Interakcje i ostrzeżenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyProfile.interactions.map((interaction, index) => (
                <div
                  key={index}
                  className={`rounded border-l-4 p-4 ${
                    interaction.type === 'danger'
                      ? 'border-red-500 bg-red-50'
                      : interaction.type === 'warning'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {interaction.type === 'danger' ? (
                        <AlertOctagon className="h-5 w-5 text-red-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          interaction.type === 'danger'
                            ? 'text-red-800'
                            : interaction.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-blue-800'
                        }`}
                      >
                        {interaction.message}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Suplementy: {interaction.supplements.join(', ')}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        <strong>Zalecenie:</strong> {interaction.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dosage Warnings */}
      {safetyProfile.dosageWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Ostrzeżenia dotyczące dawek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {safetyProfile.dosageWarnings.map((warning, index) => (
                <div key={index} className="rounded border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-800">{warning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Optymalne czasowanie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-900">Rano (6-9h)</h4>
              <div className="space-y-1 text-sm text-blue-800">
                {items
                  .filter(
                    (item) =>
                      item.customTiming.toLowerCase().includes('rano') ||
                      item.customTiming.toLowerCase().includes('czczo')
                  )
                  .map((item, index) => (
                    <div key={index}>• {item.supplement.polishName}</div>
                  ))}
              </div>
            </div>
            <div className="rounded bg-green-50 p-4">
              <h4 className="mb-2 font-medium text-green-900">Popołudnie (12-15h)</h4>
              <div className="space-y-1 text-sm text-green-800">
                {items
                  .filter(
                    (item) =>
                      item.customTiming.toLowerCase().includes('południu') ||
                      item.customTiming.toLowerCase().includes('posiłkiem')
                  )
                  .map((item, index) => (
                    <div key={index}>• {item.supplement.polishName}</div>
                  ))}
              </div>
            </div>
            <div className="rounded bg-purple-50 p-4">
              <h4 className="mb-2 font-medium text-purple-900">Wieczór (18-21h)</h4>
              <div className="space-y-1 text-sm text-purple-800">
                {items
                  .filter(
                    (item) =>
                      item.customTiming.toLowerCase().includes('wieczorem') ||
                      item.customTiming.toLowerCase().includes('snem')
                  )
                  .map((item, index) => (
                    <div key={index}>• {item.supplement.polishName}</div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cycle Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-500" />
            Zalecenia cykliczne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Plan cykliczny</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                {safetyProfile.cycleRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <Zap className="mt-0.5 mr-2 h-3 w-3 text-yellow-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Monitorowanie efektów</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                  Codzienne samopoczucie (1-10)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                  Jakość snu i energia
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                  Poziom stresu i nastroju
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synergy Effects Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-purple-500" />
            Efekty Synergiczne
          </CardTitle>
          <CardDescription>Wizualizacja efektów poznawczych stacka</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{synergyScore}</p>
              <p className="text-muted-foreground text-sm">Punkty synergii poznawczej</p>
            </div>
            <Sparkline
              data={[synergyScore * 0.8, synergyScore, synergyScore * 1.1]}
              width={300}
              height={100}
              strokeColor="#8b5cf6"
              strokeWidth={3}
            />
            <p className="text-muted-foreground max-w-md text-center text-sm">
              Wykres pokazuje potencjalny trend efektów synergicznych. Wyższy wynik
              oznacza lepszą synergię dla funkcji poznawczych.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
