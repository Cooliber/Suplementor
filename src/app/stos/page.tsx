'use client'

import {
  ArrowLeft,
  Brain,
  Shield,
  Zap,
  Heart,
  Package,
  Calculator,
  Target,
  CheckCircle,
  BarChart3,
  Plus,
  Save,
  Minus,
  Clock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { StackProgress } from './components/StackProgress'
import { stackTemplates } from './data/stack-templates'

interface Supplement {
  id: string
  name: string
  polishName: string
  category: string
  dosage: string
  timing: string
  price: string
  interactions: string[]
  synergies: string[]
  halfLife: string
  mechanism: string
  warnings: string[]
  contraindications: string[]
}

interface StackItem {
  supplement: Supplement
  customDosage: string
  customTiming: string
  notes: string
}

interface NeuroStack {
  id: string
  name: string
  description: string
  goal: string
  items: StackItem[]
  totalCost: string
  cycleLength: string
  createdAt: Date
}

const supplements: Supplement[] = [
  {
    id: 'l-lysine',
    name: 'L-lysine PharmaLysine',
    polishName: 'L-lizyna PharmaLysine',
    category: 'Aminokwasy',
    dosage: '500-2000mg',
    timing: 'Na czczo',
    price: '3.99€',
    interactions: ['arginine'],
    synergies: ['magnesium', 'b6'],
    halfLife: '2-3h',
    mechanism: 'Prekursor neuroprzekaźników',
    warnings: ['Może nasilać działanie leków przeciwwirusowych'],
    contraindications: ['Ciąża, karmienie piersią - konsultacja lekarska']
  },
  {
    id: 'magnesium-l-threonate',
    name: 'Magnesium L-threonate',
    polishName: 'Magnez L-treonian',
    category: 'Minerały',
    dosage: '1000-2000mg',
    timing: 'Wieczorem',
    price: '7.49€',
    interactions: ['calcium', 'zinc', 'antybiotyki'],
    synergies: ['l-theanine', 'melatonin', 'vitamin-d'],
    halfLife: '6-8h',
    mechanism: 'Przekracza barierę krew-mózg, poprawia neuroplastyczność',
    warnings: ['Może powodować rozluźnienie jelit w dużych dawkach'],
    contraindications: ['Niewydolność nerek', 'blok serca']
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC 50%',
    polishName: 'Alfa-GPC 50%',
    category: 'Cholina',
    dosage: '250-600mg',
    timing: 'Rano',
    price: '12.99€',
    interactions: ['antycholinergiki', 'leki na alzheimera'],
    synergies: ['huperzine', 'l-tyrosine', 'uridine'],
    halfLife: '4-6h',
    mechanism: 'Zwiększa acetylocholinę, wsparcie pamięci i skupienia',
    warnings: ['Może powodować bóle głowy u niektórych osób'],
    contraindications: ['Choroby układu nerwowego - konsultacja lekarska']
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    polishName: 'L-teanina',
    category: 'Aminokwasy',
    dosage: '100-400mg',
    timing: 'Rano/Wieczorem',
    price: '8.99€',
    interactions: ['leki na ciśnienie', 'usypiające'],
    synergies: ['caffeine', 'magnesium', 'ashwagandha'],
    halfLife: '2-5h',
    mechanism: 'Zwiększa fale alfa, redukcja stresu bez sedacji',
    warnings: ['Może nasilać działanie leków uspokajających'],
    contraindications: ['Nadciśnienie - monitorowanie ciśnienia']
  },
  {
    id: 'rhodiola',
    name: 'Rhodiola Rosea 3%',
    polishName: 'Różeniec górski 3%',
    category: 'Adaptogeny',
    dosage: '200-600mg',
    timing: 'Rano',
    price: '9.99€',
    interactions: ['ssri', 'maoi', 'leki na cukrzycę'],
    synergies: ['ashwagandha', 'b-vitamins', 'magnesium'],
    halfLife: '4-6h',
    mechanism: 'Moduluje HPA axis, adaptacja do stresu',
    warnings: ['Może nasilać działanie leków przeciwdepresyjnych'],
    contraindications: ['Choroby afektywne dwubiegunowe', 'ciśnienie skokowe']
  },
  {
    id: 'ashwagandha-ksm',
    name: 'Ashwagandha KSM-66',
    polishName: 'Ashwagandha KSM-66',
    category: 'Adaptogeny',
    dosage: '300-600mg',
    timing: 'Wieczorem',
    price: '15.99€',
    interactions: ['leki tarczycowe', 'immunosupresanty', 'leki nasenne'],
    synergies: ['rhodiola', 'magnesium', 'l-theanine'],
    halfLife: '8-12h',
    mechanism: 'Redukuje kortyzol, poprawa odporności na stres',
    warnings: ['Może nasilać działanie leków immunosupresyjnych'],
    contraindications: ['Autoimmunologiczne choroby', 'niedoczynność tarczycy']
  },
  {
    id: 'bacopa-monnieri',
    name: 'Bacopa Monnieri 50%',
    polishName: 'Bakopa drobnolistna 50%',
    category: 'Zioła ajurwedyjskie',
    dosage: '300-600mg',
    timing: 'Z posiłkiem',
    price: '11.99€',
    interactions: ['leki tarczycowe', 'leki przeciwdrgawkowe'],
    synergies: ['ginkgo', "lion's-mane", 'omega-3'],
    halfLife: '8-12h',
    mechanism: 'Poprawa pamięci długotrwałej, neuroprotekcja',
    warnings: ['Wymaga 4-6 tygodni aby zadziałać'],
    contraindications: ['Choroby wątroby', 'bradycardia']
  },
  {
    id: "lion's-mane",
    name: "Lion's Mane 10:1",
    polishName: 'Grzyb Mane 10:1',
    category: 'Grzyby nootropowe',
    dosage: '500-1000mg',
    timing: 'Rano',
    price: '18.99€',
    interactions: ['leki przeciwzakrzepowe'],
    synergies: ['bacopa', 'psilocybin-micro', 'niacin'],
    halfLife: '24h+',
    mechanism: 'Stymuluje NGF, neuroregeneracja',
    warnings: ['Może nasilać działanie leków przeciwzakrzepowych'],
    contraindications: ['Alergie na grzyby', 'zabiegi chirurgiczne']
  },
  {
    id: 'n-acetyl-l-tyrosine',
    name: 'N-Acetyl-L-Tyrosine',
    polishName: 'N-acetylo-L-tyrozyna',
    category: 'Aminokwasy',
    dosage: '350-700mg',
    timing: 'Rano',
    price: '14.99€',
    interactions: ['leki tarczycowe', 'maoi', 'leki na parkinsona'],
    synergies: ['alpha-gpc', 'rhodiola', 'b-vitamins'],
    halfLife: '2-3h',
    mechanism: 'Prekursor dopaminy i noradrenaliny',
    warnings: ['Może nasilać działanie leków na tarczycę'],
    contraindications: ['Choroby afektywne dwubiegunowe', 'nadciśnienie']
  },
  {
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine 50%',
    polishName: 'Fosfatydyloseryna 50%',
    category: 'Fosfolipidy',
    dosage: '100-300mg',
    timing: 'Z posiłkiem',
    price: '16.99€',
    interactions: ['leki przeciwzakrzepowe', 'leki na cukrzycę'],
    synergies: ['dha', 'ginkgo', 'acetyl-l-carnitine'],
    halfLife: '4-6h',
    mechanism: 'Wsparcie błon komórkowych, pamięć',
    warnings: ['Może obniżać ciśnienie krwi'],
    contraindications: ['Niskie ciśnienie', 'zabiegi chirurgiczne']
  }
]

const defaultStackTemplates: NeuroStack[] = [
  {
    id: 'focus-flow',
    name: 'Stack Skupienia i Flow',
    description: 'Zoptymalizowany stack dla głębokiego skupienia i produktywności',
    goal: 'Zwiększenie koncentracji i wydajności mentalnej',
    items: [
      {
        supplement: supplements[2]!, // Alpha-GPC
        customDosage: '400mg',
        customTiming: 'Rano na czczo',
        notes: 'Podstawowy nootrop dla pamięci roboczej'
      },
      {
        supplement: supplements[3]!, // L-Theanine
        customDosage: '200mg',
        customTiming: 'Z kofeiną',
        notes: 'Zbalansowana energia bez stresu'
      },
      {
        supplement: supplements[0]!, // L-Lysine
        customDosage: '1000mg',
        customTiming: 'Między posiłkami',
        notes: 'Wsparcie dla neuroprzekaźników'
      }
    ],
    totalCost: '25.97€/miesiąc',
    cycleLength: '8 tygodni',
    createdAt: new Date()
  },
  {
    id: 'stress-resilience',
    name: 'Stack Odporności na Stres',
    description: 'Adaptogenny stack dla redukcji stresu i poprawy nastroju',
    goal: 'Redukcja stresu i poprawa odporności psychicznej',
    items: [
      {
        supplement: supplements[4]!, // Rhodiola
        customDosage: '400mg',
        customTiming: 'Rano na czczo',
        notes: 'Adaptogen dla energii i nastroju'
      },
      {
        supplement: supplements[5]!, // Ashwagandha
        customDosage: '500mg',
        customTiming: 'Wieczorem',
        notes: 'Redukcja kortyzolu i poprawa snu'
      },
      {
        supplement: supplements[1]!, // Magnesium
        customDosage: '1500mg',
        customTiming: 'Przed snem',
        notes: 'Relaksacja i jakość snu'
      }
    ],
    totalCost: '33.47€/miesiąc',
    cycleLength: '12 tygodni',
    createdAt: new Date()
  }
]

/**
 *
 */
export default function StackBuilderPage() {
  const [currentStack, setCurrentStack] = useState<NeuroStack>({
    id: 'custom-' + Date.now(),
    name: 'Mój Stack',
    description: 'Spersonalizowany stack neuroregulacyjny',
    goal: '',
    items: [],
    totalCost: '0€',
    cycleLength: '4 tygodnie',
    createdAt: new Date()
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<
    'builder' | 'templates' | 'analysis' | 'progress'
  >('builder')

  const totalDailyCost = useMemo(() => {
    const total = currentStack.items.reduce((sum, item) => {
      const price = parseFloat(item.supplement.price.replace('€', ''))
      return sum + price
    }, 0)
    return total.toFixed(2) + '€/dzień'
  }, [currentStack.items])

  const interactions = useMemo(() => {
    const allInteractions: string[] = []
    const supplementsInStack = currentStack.items.map((item) => item.supplement)

    supplementsInStack.forEach((supplement) => {
      supplement.interactions.forEach((interaction) => {
        if (
          supplementsInStack.some(
            (s) => s.id === interaction || s.name.toLowerCase().includes(interaction)
          )
        ) {
          allInteractions.push(`${supplement.polishName} → ${interaction}`)
        }
      })
    })

    return allInteractions
  }, [currentStack.items])

  const synergies = useMemo(() => {
    const allSynergies: string[] = []
    const supplementsInStack = currentStack.items.map((item) => item.supplement)

    supplementsInStack.forEach((supplement) => {
      supplement.synergies.forEach((synergy) => {
        if (
          supplementsInStack.some(
            (s) => s.id === synergy || s.name.toLowerCase().includes(synergy)
          )
        ) {
          allSynergies.push(`${supplement.polishName} ↔ ${synergy}`)
        }
      })
    })

    return allSynergies
  }, [currentStack.items])

  const addSupplement = (supplement: Supplement) => {
    const newItem: StackItem = {
      supplement,
      customDosage: supplement.dosage,
      customTiming: supplement.timing,
      notes: ''
    }

    setCurrentStack((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const removeSupplement = (index: number) => {
    setCurrentStack((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateStackItem = (index: number, field: keyof StackItem, value: string) => {
    setCurrentStack((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const loadTemplate = (templateId: string) => {
    const template = stackTemplates.find((t) => t.id === templateId)
    if (template) {
      setCurrentStack({
        ...template,
        id: 'custom-' + Date.now(),
        name: template.name + ' (kopia)',
        createdAt: new Date()
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nootropy':
        return <Brain className="h-4 w-4" />
      case 'Adaptogeny':
        return <Shield className="h-4 w-4" />
      case 'Aminokwasy':
        return <Zap className="h-4 w-4" />
      case 'Minerały':
        return <Heart className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do strony głównej
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Kreator Stacków Neuroregulacyjnych
          </h1>
          <p className="text-lg text-gray-600">
            Zbuduj spersonalizowany stack suplementów dla Twoich celów neuroregulacyjnych
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  id: 'builder',
                  label: 'Kreator',
                  icon: <Calculator className="h-4 w-4" />
                },
                {
                  id: 'templates',
                  label: 'Szablony',
                  icon: <Target className="h-4 w-4" />
                },
                {
                  id: 'analysis',
                  label: 'Analiza',
                  icon: <CheckCircle className="h-4 w-4" />
                },
                {
                  id: 'progress',
                  label: 'Postęp',
                  icon: <BarChart3 className="h-4 w-4" />
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center border-b-2 px-1 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Available Supplements */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Dostępne Suplementy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplements.map((supplement) => (
                      <div key={supplement.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {supplement.polishName}
                            </h4>
                            <p className="text-sm text-gray-600">{supplement.category}</p>
                            <p className="text-sm font-medium text-green-600">
                              {supplement.price}
                            </p>
                          </div>
                          <Button
                            onClick={() => addSupplement(supplement)}
                            size="sm"
                            variant="default"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Stack */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Twój Stack</CardTitle>
                      <CardDescription>
                        {currentStack.items.length} suplementów • {totalDailyCost}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="default">
                        <Save className="mr-1 h-4 w-4" />
                        Zapisz
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentStack.items.length === 0 ? (
                    <div className="py-12 text-center">
                      <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">
                        Dodaj suplementy aby zbudować swój stack
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentStack.items.map((item, index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.supplement.polishName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {item.supplement.category}
                              </p>
                            </div>
                            <button
                              onClick={() => removeSupplement(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Dawka
                              </label>
                              <input
                                type="text"
                                value={item.customDosage}
                                onChange={(e) =>
                                  updateStackItem(index, 'customDosage', e.target.value)
                                }
                                className="w-full rounded border px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Czas
                              </label>
                              <input
                                type="text"
                                value={item.customTiming}
                                onChange={(e) =>
                                  updateStackItem(index, 'customTiming', e.target.value)
                                }
                                className="w-full rounded border px-2 py-1 text-sm"
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Notatki
                            </label>
                            <textarea
                              value={item.notes}
                              onChange={(e) =>
                                updateStackItem(index, 'notes', e.target.value)
                              }
                              className="w-full rounded border px-2 py-1 text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {defaultStackTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{template.items.length} suplementów</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Target className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{template.goal}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{template.cycleLength}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">{template.totalCost}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      Skład stacka:
                    </h4>
                    <div className="space-y-1">
                      {template.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {item.supplement.polishName} - {item.customDosage}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      loadTemplate(template.id)
                      setActiveTab('builder')
                    }}
                    className="w-full"
                  >
                    Użyj szablonu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Interactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Interakcje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interactions.length > 0 ? (
                  <div className="space-y-2">
                    {interactions.map((interaction, index) => (
                      <div
                        key={index}
                        className="rounded border border-red-200 bg-red-50 p-3"
                      >
                        <p className="text-sm text-red-800">{interaction}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Brak wykrytych interakcji
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Synergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Synergia
                </CardTitle>
              </CardHeader>
              <CardContent>
                {synergies.length > 0 ? (
                  <div className="space-y-2">
                    {synergies.map((synergy, index) => (
                      <div
                        key={index}
                        className="rounded border border-green-200 bg-green-50 p-3"
                      >
                        <p className="text-sm text-green-800">{synergy}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Brak wykrytych synergii</p>
                )}
              </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Plan dnia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded bg-blue-50 p-4">
                    <h4 className="mb-2 font-medium text-blue-900">Rano (na czczo)</h4>
                    {currentStack.items
                      .filter(
                        (item) =>
                          item.customTiming.toLowerCase().includes('rano') ||
                          item.customTiming.toLowerCase().includes('czczo')
                      )
                      .map((item, index) => (
                        <div key={index} className="mb-1 text-sm text-blue-800">
                          • {item.supplement.polishName} - {item.customDosage}
                        </div>
                      ))}
                  </div>
                  <div className="rounded bg-green-50 p-4">
                    <h4 className="mb-2 font-medium text-green-900">Z posiłkiem</h4>
                    {currentStack.items
                      .filter((item) =>
                        item.customTiming.toLowerCase().includes('posiłkiem')
                      )
                      .map((item, index) => (
                        <div key={index} className="mb-1 text-sm text-green-800">
                          • {item.supplement.polishName} - {item.customDosage}
                        </div>
                      ))}
                  </div>
                  <div className="rounded bg-purple-50 p-4">
                    <h4 className="mb-2 font-medium text-purple-900">Wieczorem</h4>
                    {currentStack.items
                      .filter(
                        (item) =>
                          item.customTiming.toLowerCase().includes('wieczorem') ||
                          item.customTiming.toLowerCase().includes('snem')
                      )
                      .map((item, index) => (
                        <div key={index} className="mb-1 text-sm text-purple-800">
                          • {item.supplement.polishName} - {item.customDosage}
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <StackProgress
              stackId={currentStack.id}
              stackName={currentStack.name}
              totalDays={parseInt(currentStack.cycleLength) || 28}
            />
          </div>
        )}
      </div>
    </div>
  )
}
