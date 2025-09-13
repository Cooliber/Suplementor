'use client'

import {
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Brain,
  Moon,
  Shield,
  Activity,
  Star,
  ArrowRight,
  Download,
  Share2,
  Bookmark
} from 'lucide-react'
import React, { useState, useEffect } from 'react'

interface ProtocolStep {
  id: string
  title: string
  description: string
  timing: string
  dosage?: string
  notes?: string
  critical?: boolean
}

interface Protocol {
  id: string
  title: string
  category: 'cognitive' | 'stress' | 'sleep' | 'energy' | 'recovery' | 'longevity'
  goal: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  targetAudience: string[]
  expectedResults: string[]
  contraindications: string[]
  steps: ProtocolStep[]
  supplements: string[]
  lifestyle: string[]
  monitoring: string[]
  optimization: string[]
  scientificBasis: string
  successRate: number
  userRating: number
  reviews: number
}

interface OptimizationTip {
  id: string
  category: string
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  difficulty: 'easy' | 'moderate' | 'hard'
  timeframe: string
}

const protocols: Protocol[] = [
  {
    id: 'focus-protocol-1',
    title: 'Protokół Głębokiej Koncentracji',
    category: 'cognitive',
    goal: 'Zwiększenie koncentracji i produktywności na 4-6 godzin',
    duration: '4-8 tygodni',
    difficulty: 'intermediate',
    description:
      'Kompleksowy protokół łączący suplementację z technikami behawioralnymi dla maksymalnej koncentracji.',
    targetAudience: ['Studenci', 'Programiści', 'Analitycy', 'Badacze'],
    expectedResults: [
      'Zwiększenie czasu koncentracji o 40-60%',
      'Redukcja rozpraszania uwagi o 50%',
      'Poprawa jakości pracy umysłowej',
      'Mniejsze zmęczenie mentalne'
    ],
    contraindications: [
      'Nadciśnienie tętnicze',
      'Zaburzenia lękowe',
      'Bezsenność',
      'Ciąża i karmienie piersią'
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Przygotowanie poranne',
        description: 'Optymalizacja rytmu dobowego i przygotowanie mózgu',
        timing: '6:00-7:00',
        notes: 'Na czczo, 30 min przed śniadaniem',
        critical: true
      },
      {
        id: 'step-2',
        title: 'Suplementacja bazowa',
        description: 'Podstawowe nootropiki wspierające koncentrację',
        timing: '7:30',
        dosage: 'Według protokołu',
        critical: true
      },
      {
        id: 'step-3',
        title: 'Sesja pracy głębokiej',
        description: 'Bloki 90-minutowe z przerwami',
        timing: '9:00-12:30',
        notes: 'Technika Pomodoro zmodyfikowana'
      },
      {
        id: 'step-4',
        title: 'Przerwa regeneracyjna',
        description: 'Aktywna regeneracja i nawodnienie',
        timing: '12:30-13:30',
        notes: 'Spacer, medytacja, posiłek'
      },
      {
        id: 'step-5',
        title: 'Druga sesja pracy',
        description: 'Kontynuacja z dodatkowym wsparciem',
        timing: '14:00-17:00',
        dosage: 'Booster w razie potrzeby'
      }
    ],
    supplements: [
      'L-teanina 200mg + Kofeina 100mg',
      'Alpha-GPC 300mg',
      'Bacopa Monnieri 300mg',
      'Magnez L-treonian 144mg',
      'Witaminy B-complex'
    ],
    lifestyle: [
      'Sen 7-9 godzin',
      'Ćwiczenia cardio 20 min rano',
      'Dieta ketogeniczna lub low-carb',
      'Ograniczenie cukru i przetworzonej żywności',
      'Nawodnienie 2-3L wody dziennie'
    ],
    monitoring: [
      'Czas koncentracji (minuty)',
      'Liczba przerw/rozpraszaczy',
      'Jakość wykonanych zadań (1-10)',
      'Poziom energii (1-10)',
      'Nastrój i motywacja (1-10)'
    ],
    optimization: [
      'Dostosuj dawki do masy ciała',
      'Eksperymentuj z timingiem',
      'Dodaj muzykę binauralną 40Hz',
      'Optymalizuj temperaturę pomieszczenia (18-21°C)',
      'Użyj światła niebieskiego rano'
    ],
    scientificBasis:
      'Protokół oparty na badaniach nad neuroplastycznością, modulacją acetylocholiny i optymalizacją fal mózgowych gamma.',
    successRate: 87,
    userRating: 4.6,
    reviews: 234
  },
  {
    id: 'stress-protocol-1',
    title: 'Protokół Zarządzania Stresem',
    category: 'stress',
    goal: 'Redukcja poziomu kortyzolu i zwiększenie odporności na stres',
    duration: '6-12 tygodni',
    difficulty: 'beginner',
    description:
      'Holistyczne podejście do zarządzania stresem z wykorzystaniem adaptogenów i technik relaksacyjnych.',
    targetAudience: ['Osoby w stresie zawodowym', 'Menedżerowie', 'Rodzice', 'Studenci'],
    expectedResults: [
      'Redukcja kortyzolu o 20-30%',
      'Poprawa jakości snu',
      'Zwiększenie odporności na stres',
      'Lepsza regulacja emocjonalna'
    ],
    contraindications: [
      'Choroby autoimmunologiczne',
      'Przyjmowanie leków immunosupresyjnych',
      'Ciąża (niektóre adaptogeny)',
      'Nadczynność tarczycy'
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Rutyna poranna',
        description: 'Stabilizacja rytmu dobowego i przygotowanie na dzień',
        timing: '6:30-7:30',
        critical: true
      },
      {
        id: 'step-2',
        title: 'Adaptogeny',
        description: 'Suplementacja wspierająca oś HPA',
        timing: '8:00 i 16:00',
        dosage: 'Według protokołu',
        critical: true
      },
      {
        id: 'step-3',
        title: 'Przerwy na oddech',
        description: 'Techniki oddechowe co 2-3 godziny',
        timing: 'Przez cały dzień',
        notes: '4-7-8 lub box breathing'
      },
      {
        id: 'step-4',
        title: 'Wieczorna rutyna',
        description: 'Przygotowanie do regeneracyjnego snu',
        timing: '21:00-22:00',
        notes: 'Bez ekranów, ciepła kąpiel'
      }
    ],
    supplements: [
      'Ashwagandha KSM-66 600mg',
      'Magnez glicynat 400mg',
      'L-teanina 200mg',
      'Fosfatydyloseryna 100mg',
      'Witamina D3 2000IU'
    ],
    lifestyle: [
      'Medytacja mindfulness 10-20 min',
      'Ćwiczenia jogi lub stretching',
      'Regularne posiłki',
      'Ograniczenie kofeiny po 14:00',
      'Kontakt z naturą 30 min dziennie'
    ],
    monitoring: [
      'Poziom stresu (1-10)',
      'Jakość snu (1-10)',
      'Energia rano (1-10)',
      'Nastrój ogólny (1-10)',
      'Częstość epizodów lękowych'
    ],
    optimization: [
      'Dostosuj dawki adaptogenów',
      'Eksperymentuj z różnymi technikami oddechowymi',
      'Dodaj aromaterapię',
      'Optymalizuj środowisko snu',
      'Wprowadź journaling'
    ],
    scientificBasis:
      'Oparty na badaniach nad osią HPA, działaniem adaptogenów i wpływem technik mindfulness na redukcję kortyzolu.',
    successRate: 92,
    userRating: 4.8,
    reviews: 456
  },
  {
    id: 'sleep-protocol-1',
    title: 'Protokół Optymalizacji Snu',
    category: 'sleep',
    goal: 'Poprawa jakości snu i regeneracji nocnej',
    duration: '4-6 tygodni',
    difficulty: 'beginner',
    description:
      'Kompleksowy protokół dla osób z problemami z zasypianiem i jakością snu.',
    targetAudience: [
      'Osoby z bezsennością',
      'Pracownicy zmianowi',
      'Jet lag',
      'Stres chroniczny'
    ],
    expectedResults: [
      'Skrócenie czasu zasypiania o 50%',
      'Zwiększenie czasu snu głębokiego',
      'Poprawa regeneracji nocnej',
      'Większa energia rano'
    ],
    contraindications: [
      'Bezdechy senne nieleczone',
      'Przyjmowanie leków nasennych',
      'Depresja ciężka',
      'Zaburzenia rytmu dobowego'
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Ekspozycja na światło',
        description: 'Regulacja rytmu dobowego światłem naturalnym',
        timing: '6:00-7:00',
        notes: '15-30 min na zewnątrz',
        critical: true
      },
      {
        id: 'step-2',
        title: 'Ograniczenie światła niebieskiego',
        description: 'Przygotowanie do produkcji melatoniny',
        timing: '19:00',
        notes: 'Okulary blokujące, f.lux'
      },
      {
        id: 'step-3',
        title: 'Suplementacja wieczorna',
        description: 'Naturalne wsparcie dla snu',
        timing: '21:00',
        dosage: 'Według protokołu',
        critical: true
      },
      {
        id: 'step-4',
        title: 'Rutyna przed snem',
        description: 'Sygnalizowanie mózgowi czasu na sen',
        timing: '21:30-22:30',
        notes: 'Stała rutyna, bez ekranów'
      }
    ],
    supplements: [
      'Melatonina 0.5-3mg',
      'Magnez glicynat 400mg',
      'L-teanina 200mg',
      'GABA 750mg',
      'Glicyna 3g'
    ],
    lifestyle: [
      'Stała pora snu i budzenia',
      'Temperatura sypialni 16-19°C',
      'Całkowita ciemność',
      'Cisza lub white noise',
      'Wygodny materac i poduszka'
    ],
    monitoring: [
      'Czas zasypiania (minuty)',
      'Liczba przebudzeń',
      'Jakość snu (1-10)',
      'Energia rano (1-10)',
      'Nastrój następnego dnia'
    ],
    optimization: [
      'Dostosuj dawkę melatoniny',
      'Eksperymentuj z timingiem',
      'Dodaj techniki relaksacyjne',
      'Optymalizuj dietę wieczorną',
      'Wprowadź ćwiczenia oddechowe'
    ],
    scientificBasis:
      'Oparty na chronobiologii, badaniach nad melatoniną i wpływem środowiska na jakość snu.',
    successRate: 89,
    userRating: 4.7,
    reviews: 378
  }
]

const optimizationTips: OptimizationTip[] = [
  {
    id: 'tip-1',
    category: 'Timing',
    title: 'Optymalizacja chronotypu',
    description:
      'Dostosuj timing suplementacji do swojego naturalnego rytmu dobowego. Skowronki powinny przyjmować nootropiki wcześniej, sowy - później.',
    impact: 'high',
    difficulty: 'easy',
    timeframe: '1-2 tygodnie'
  },
  {
    id: 'tip-2',
    category: 'Dawkowanie',
    title: 'Cyklowanie adaptogenów',
    description:
      'Stosuj adaptogeny w cyklach 6-8 tygodni z 2-tygodniowymi przerwami, aby uniknąć tolerancji i utrzymać skuteczność.',
    impact: 'medium',
    difficulty: 'moderate',
    timeframe: '2-3 miesiące'
  },
  {
    id: 'tip-3',
    category: 'Synergizm',
    title: 'Stackowanie synergistyczne',
    description:
      'Łącz L-teaninę z kofeiną w stosunku 2:1 dla optymalnej koncentracji bez jittery. Dodaj magnez dla lepszej absorpcji.',
    impact: 'high',
    difficulty: 'easy',
    timeframe: 'Natychmiastowy'
  },
  {
    id: 'tip-4',
    category: 'Monitoring',
    title: 'Biomarkery stresu',
    description:
      'Monitoruj HRV (Heart Rate Variability) i temperaturę ciała rano, aby ocenić skuteczność protokołów antystresowych.',
    impact: 'medium',
    difficulty: 'moderate',
    timeframe: '2-4 tygodnie'
  },
  {
    id: 'tip-5',
    category: 'Personalizacja',
    title: 'Testy genetyczne',
    description:
      'Wykonaj testy polimorfizmów COMT, MTHFR i CYP1A2, aby spersonalizować dawkowanie kofeiny, folianów i dopaminy.',
    impact: 'high',
    difficulty: 'hard',
    timeframe: '1-2 miesiące'
  },
  {
    id: 'tip-6',
    category: 'Lifestyle',
    title: 'Protokół światła',
    description:
      'Używaj światła 10,000 lux rano przez 30 min i blokuj światło niebieskie 2h przed snem dla optymalnej melatoniny.',
    impact: 'high',
    difficulty: 'easy',
    timeframe: '1-2 tygodnie'
  },
  {
    id: 'tip-7',
    category: 'Absorpcja',
    title: 'Timing z posiłkami',
    description:
      'Przyjmuj suplementy lipofilne (omega-3, witaminy A,D,E,K) z tłuszczami, a hydrofilne (witaminy B, C) na czczo.',
    impact: 'medium',
    difficulty: 'easy',
    timeframe: 'Natychmiastowy'
  },
  {
    id: 'tip-8',
    category: 'Recovery',
    title: 'Protokół regeneracji',
    description:
      'Wprowadź 1 dzień w tygodniu bez suplementów nootropowych, aby zresetować receptory i ocenić bazową funkcję kognitywną.',
    impact: 'medium',
    difficulty: 'moderate',
    timeframe: '1 tydzień'
  }
]

interface ProtocolGuidesProps {
  selectedCategory?: string
}

/**
 *
 */
export default function ProtocolGuides({ selectedCategory }: ProtocolGuidesProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'optimization'>(
    'overview'
  )
  const [filterCategory, setFilterCategory] = useState<string>(selectedCategory || 'all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [bookmarkedProtocols, setBookmarkedProtocols] = useState<string[]>([])

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarked-protocols')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[]
        if (Array.isArray(parsed)) {
          setBookmarkedProtocols(parsed)
        }
      } catch (error) {
        console.error('Failed to parse bookmarked protocols:', error)
      }
    }
  }, [])

  const filteredProtocols = protocols.filter((protocol) => {
    const categoryMatch = filterCategory === 'all' || protocol.category === filterCategory
    const difficultyMatch =
      filterDifficulty === 'all' || protocol.difficulty === filterDifficulty
    return categoryMatch && difficultyMatch
  })

  const toggleBookmark = (protocolId: string) => {
    const updated = bookmarkedProtocols.includes(protocolId)
      ? bookmarkedProtocols.filter((id) => id !== protocolId)
      : [...bookmarkedProtocols, protocolId]

    setBookmarkedProtocols(updated)
    localStorage.setItem('bookmarked-protocols', JSON.stringify(updated))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive':
        return <Brain className="h-5 w-5" />
      case 'stress':
        return <Shield className="h-5 w-5" />
      case 'sleep':
        return <Moon className="h-5 w-5" />
      case 'energy':
        return <Zap className="h-5 w-5" />
      case 'recovery':
        return <Activity className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedProtocol) {
    return (
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedProtocol(null)}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Powrót do protokołów
          </button>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                  {selectedProtocol.title}
                </h1>
                <p className="mb-4 text-gray-600">{selectedProtocol.description}</p>

                <div className="flex items-center space-x-4 text-sm">
                  <span
                    className={`rounded px-2 py-1 ${getDifficultyColor(selectedProtocol.difficulty)}`}
                  >
                    {selectedProtocol.difficulty === 'beginner'
                      ? 'Początkujący'
                      : selectedProtocol.difficulty === 'intermediate'
                        ? 'Średniozaawansowany'
                        : 'Zaawansowany'}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    {selectedProtocol.duration}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Star className="mr-1 h-4 w-4 text-yellow-500" />
                    {selectedProtocol.userRating} ({selectedProtocol.reviews} opinii)
                  </span>
                  <span className="font-medium text-green-600">
                    {selectedProtocol.successRate}% skuteczności
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => toggleBookmark(selectedProtocol.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    bookmarkedProtocols.includes(selectedProtocol.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex rounded-lg bg-white p-1 shadow-sm">
          {[
            { id: 'overview', label: 'Przegląd', icon: Info },
            { id: 'steps', label: 'Kroki', icon: CheckCircle },
            { id: 'optimization', label: 'Optymalizacja', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-1 items-center justify-center rounded-md px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Cel protokołu</h3>
                <p className="mb-4 text-gray-700">{selectedProtocol.goal}</p>

                <h4 className="mb-2 font-medium text-gray-900">Grupa docelowa:</h4>
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedProtocol.targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
                    >
                      {audience}
                    </span>
                  ))}
                </div>

                <h4 className="mb-2 font-medium text-gray-900">Oczekiwane rezultaty:</h4>
                <ul className="space-y-1">
                  {selectedProtocol.expectedResults.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Podstawa naukowa</h3>
                <p className="text-gray-700">{selectedProtocol.scientificBasis}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Suplementy</h3>
                <ul className="space-y-2">
                  {selectedProtocol.supplements.map((supplement, index) => (
                    <li
                      key={index}
                      className="rounded bg-gray-50 p-2 text-sm text-gray-700"
                    >
                      {supplement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Styl życia</h3>
                <ul className="space-y-2">
                  {selectedProtocol.lifestyle.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="mb-2 flex items-center font-semibold text-red-900">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Przeciwwskazania
                </h3>
                <ul className="space-y-1">
                  {selectedProtocol.contraindications.map((item, index) => (
                    <li key={index} className="text-sm text-red-800">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-gray-900">Kroki protokołu</h3>
            <div className="space-y-4">
              {selectedProtocol.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 ${step.critical ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                        step.critical ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          {step.timing}
                        </div>
                      </div>
                      <p className="mb-2 text-gray-700">{step.description}</p>
                      {step.dosage && (
                        <p className="mb-1 text-sm text-blue-600">
                          <strong>Dawkowanie:</strong> {step.dosage}
                        </p>
                      )}
                      {step.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>Uwagi:</strong> {step.notes}
                        </p>
                      )}
                      {step.critical && (
                        <div className="mt-2 flex items-center text-sm text-red-600">
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Krok krytyczny
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Monitorowanie postępów</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {selectedProtocol.monitoring.map((metric, index) => (
                  <div key={index} className="rounded bg-gray-50 p-3">
                    <span className="text-sm text-gray-700">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Wskazówki optymalizacyjne
              </h3>
              <div className="space-y-3">
                {selectedProtocol.optimization.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <TrendingUp className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Zaawansowane optymalizacje
              </h3>
              <div className="grid gap-4">
                {optimizationTips
                  .filter(
                    (tip) =>
                      (selectedProtocol.category === 'cognitive' &&
                        ['Timing', 'Synergizm', 'Personalizacja'].includes(
                          tip.category
                        )) ||
                      (selectedProtocol.category === 'stress' &&
                        ['Monitoring', 'Recovery', 'Lifestyle'].includes(tip.category)) ||
                      (selectedProtocol.category === 'sleep' &&
                        ['Lifestyle', 'Timing', 'Absorpcja'].includes(tip.category))
                  )
                  .map((tip) => (
                    <div key={tip.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="font-medium text-gray-900">{tip.title}</h4>
                        <div className="flex space-x-2">
                          <span
                            className={`rounded px-2 py-1 text-xs ${getImpactColor(tip.impact)}`}
                          >
                            {tip.impact === 'high'
                              ? 'Wysoki'
                              : tip.impact === 'medium'
                                ? 'Średni'
                                : 'Niski'}{' '}
                            wpływ
                          </span>
                          <span className="text-xs text-gray-600">{tip.timeframe}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{tip.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Kategoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">Wszystkie</option>
              <option value="cognitive">Funkcje kognitywne</option>
              <option value="stress">Zarządzanie stresem</option>
              <option value="sleep">Optymalizacja snu</option>
              <option value="energy">Energia</option>
              <option value="recovery">Regeneracja</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Poziom</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">Wszystkie</option>
              <option value="beginner">Początkujący</option>
              <option value="intermediate">Średniozaawansowany</option>
              <option value="advanced">Zaawansowany</option>
            </select>
          </div>
        </div>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProtocols.map((protocol) => (
          <div
            key={protocol.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center">
                  {getCategoryIcon(protocol.category)}
                  <span className="ml-2 text-sm text-gray-600 capitalize">
                    {protocol.category === 'cognitive'
                      ? 'Kognitywne'
                      : protocol.category === 'stress'
                        ? 'Stres'
                        : protocol.category === 'sleep'
                          ? 'Sen'
                          : protocol.category === 'energy'
                            ? 'Energia'
                            : 'Regeneracja'}
                  </span>
                </div>
                <button
                  onClick={() => toggleBookmark(protocol.id)}
                  className={`rounded p-1 transition-colors ${
                    bookmarkedProtocols.includes(protocol.id)
                      ? 'text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mb-2 font-semibold text-gray-900">{protocol.title}</h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {protocol.description}
              </p>

              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded px-2 py-1 text-xs ${getDifficultyColor(protocol.difficulty)}`}
                >
                  {protocol.difficulty === 'beginner'
                    ? 'Początkujący'
                    : protocol.difficulty === 'intermediate'
                      ? 'Średni'
                      : 'Zaawansowany'}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  {protocol.duration}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{protocol.userRating}</span>
                  <span className="ml-1 text-xs text-gray-500">({protocol.reviews})</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {protocol.successRate}% skuteczności
                </span>
              </div>

              <button
                onClick={() => setSelectedProtocol(protocol)}
                className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Zobacz protokół
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProtocols.length === 0 && (
        <div className="py-12 text-center">
          <Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-600">Brak protokołów spełniających wybrane kryteria.</p>
        </div>
      )}
    </div>
  )
}
