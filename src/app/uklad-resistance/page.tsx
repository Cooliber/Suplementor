'use client'

import {
  ArrowLeft,
  Shield,
  Zap,
  Brain,
  Microscope,
  Beaker,
  Target,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImmuneComponent {
  id: string
  name: string
  polishName: string
  category: 'wrodzony' | 'nabyt'
  description: string
  function: string
  icon: React.ReactNode
}

interface MediatorComponent {
  id: string
  name: string
  polishName: string
  type: string
  function: string
  role: string
}

const immuneComponents: ImmuneComponent[] = [
  {
    id: 'makrofagi',
    name: 'Macrophages',
    polishName: 'Makrofagi',
    category: 'wrodzony',
    description:
      'Duże komórki żerne, które pochłaniają i trawią patogeny oraz obce substancje.',
    function:
      'Fagocytoza patogenów, prezentacja antygenów komórkom T, produkcja cytokin zapalnych.',
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: 'neutrofile',
    name: 'Neutrophils',
    polishName: 'Neutrofile',
    category: 'wrodzony',
    description: 'Najliczniejsze leukocyty, pierwsze przybywają na miejsce infekcji.',
    function: 'Szybka fagocytoza bakterii, uwalnianie substancji bakteriobójczych.',
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'komorki-t',
    name: 'T-Cells',
    polishName: 'Komórki T',
    category: 'nabyt',
    description: 'Limfocyty T odpowiedzialne za koordynację odpowiedzi immunologicznej.',
    function:
      'Cytotoksyczne zabijanie komórek zainfekowanych, pomoc komórkom B, regulacja odpowiedzi immunologicznej.',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'komorki-b',
    name: 'B-Cells',
    polishName: 'Komórki B',
    category: 'nabyt',
    description: 'Limfocyty B produkujące przeciwciała przeciwko specyficznym antygenom.',
    function:
      'Produkcja przeciwciał, tworzenie pamięci immunologicznej, humoralna odpowiedź immunologiczna.',
    icon: <Beaker className="h-6 w-6" />
  }
]

const mediators: MediatorComponent[] = [
  {
    id: 'interferony',
    name: 'Interferons',
    polishName: 'Interferony',
    type: 'Cytokiny przeciwwirusowe',
    function: 'Hamowanie replikacji wirusów w komórkach gospodarza.',
    role: 'Pierwsza linia obrony przeciwwirusowej, aktywacja komórek NK.'
  },
  {
    id: 'interleukiny',
    name: 'Interleukins',
    polishName: 'Interleukiny',
    type: 'Cytokiny komunikacyjne',
    function: 'Komunikacja między różnymi typami komórek odpornościowych.',
    role: 'Koordynacja odpowiedzi zapalnej, regulacja aktywacji limfocytów.'
  },
  {
    id: 'chemokiny',
    name: 'Chemokines',
    polishName: 'Chemokiny',
    type: 'Czynniki chemoatrakcyjne',
    function: 'Kierowanie migracją komórek odpornościowych do miejsca infekcji.',
    role: 'Rekrutacja leukocytów do tkanek objętych stanem zapalnym.'
  },
  {
    id: 'uklad-dopełniający',
    name: 'Complement System',
    polishName: 'Układ dopełniający',
    type: 'Kaskada białkowa',
    function: 'Oznaczanie patogenów do zniszczenia, liza komórek.',
    role: 'Wzmocnienie fagocytozy, indukcja stanu zapalnego.'
  }
]

/**
 *
 */
export default function UkladResistancePage() {
  const [activeTab, setActiveTab] = useState<
    'podstawy' | 'komponenty' | 'funkcje' | 'mediatory' | 'neuroimmunologia' | 'cwiczenia'
  >('podstawy')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wrodzony':
        return 'bg-green-100 text-green-800'
      case 'nabyt':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            Układ Immunologiczny Człowieka
          </h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Kompleksowy przewodnik po systemie odpornościowym, jego składnikach, funkcjach
            i interakcjach z układem nerwowym.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="podstawy" className="text-xs lg:text-sm">
                Podstawy
              </TabsTrigger>
              <TabsTrigger value="komponenty" className="text-xs lg:text-sm">
                Komponenty
              </TabsTrigger>
              <TabsTrigger value="funkcje" className="text-xs lg:text-sm">
                Funkcje
              </TabsTrigger>
              <TabsTrigger value="mediatory" className="text-xs lg:text-sm">
                Mediacje
              </TabsTrigger>
              <TabsTrigger value="neuroimmunologia" className="text-xs lg:text-sm">
                Neuroimmunologia
              </TabsTrigger>
              <TabsTrigger value="cwiczenia" className="text-xs lg:text-sm">
                Ćwiczenia
              </TabsTrigger>
            </TabsList>

            {/* Podstawy Tab */}
            <TabsContent value="podstawy" className="mt-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-6 w-6 text-green-600" />
                      Immunitet Wrodzony
                    </CardTitle>
                    <CardDescription>
                      Naturalna, niespecyficzna obrona organizmu dostępna od urodzenia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold">Charakterystyka:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Natychmiastowa reakcja (godziny)</li>
                          <li>• Bez specyficznego rozpoznania antygenu</li>
                          <li>• Ta sama odpowiedź na wszystkie patogeny</li>
                          <li>• Brak pamięci immunologicznej</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Mechanizmy:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Bariery fizyczne (skóra, śluzówki)</li>
                          <li>• Fagocytoza przez makrofagi i neutrofile</li>
                          <li>• Opsonizacja i fagocytoza</li>
                          <li>• Komórki NK (natural killer)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-6 w-6 text-blue-600" />
                      Immunitet Nabyty
                    </CardTitle>
                    <CardDescription>
                      Specyficzna odpowiedź immunologiczna rozwijająca się w czasie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold">Charakterystyka:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Rozwija się po kontakcie z antygenem</li>
                          <li>• Specyficzne rozpoznanie antygenu</li>
                          <li>• Pamięć immunologiczna</li>
                          <li>• Dłuższa odpowiedź (dni-tygodnie)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Komponenty:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Komórki T (limfocyty T)</li>
                          <li>• Komórki B (limfocyty B)</li>
                          <li>• Przeciwciała (immunoglobuliny)</li>
                          <li>• Komórki pamięci</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Jak Działa Układ Immunologiczny?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      Układ immunologiczny to złożony system obronny organizmu, który
                      chroni przed patogenami, komórkami nowotworowymi i toksynami. Składa
                      się z dwóch głównych gałęzi: immunitetu wrodzonego i nabytego, które
                      współpracują ze sobą w wielowarstwowej ochronie.
                    </p>

                    <h4 className="mb-2 font-semibold">Mechanizm Obrony:</h4>
                    <ol className="mb-4 space-y-2">
                      <li className="flex items-start">
                        <span className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
                          1
                        </span>
                        <div>
                          <strong>Rozpoznanie patogenu</strong> - Immunitet wrodzony
                          wykrywa obecność obcego czynnika
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
                          2
                        </span>
                        <div>
                          <strong>Reakcja zapalna</strong> - Aktywacja mediatorów
                          zapalnych i napływ komórek odpornościowych
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
                          3
                        </span>
                        <div>
                          <strong>Aktywacja odpowiedzi nabytej</strong> - Komórki T i B
                          rozpoznają specyficzne antygeny
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
                          4
                        </span>
                        <div>
                          <strong>Eliminacja zagrożenia</strong> - Zniszczenie patogenów i
                          naprawa tkanek
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
                          5
                        </span>
                        <div>
                          <strong>Pamięć immunologiczna</strong> - Przygotowanie na
                          przyszłe infekcje tym samym patogenem
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Komponenty Tab */}
            <TabsContent value="komponenty" className="mt-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {immuneComponents.map((component) => (
                  <Card key={component.id} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 rounded-lg bg-blue-100 p-2">
                            {component.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {component.polishName}
                            </CardTitle>
                            <CardDescription>{component.name}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(component.category)}>
                          {component.category === 'wrodzony'
                            ? 'Immunitet wrodzony'
                            : 'Immunitet nabyty'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Opis:
                          </h4>
                          <p className="text-sm text-gray-600">{component.description}</p>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Funkcje:
                          </h4>
                          <p className="text-sm text-gray-600">{component.function}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Współdziałanie Komponentów</CardTitle>
                  <CardDescription>
                    Jak różne elementy układu immunologicznego współpracują ze sobą
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold">Immunitet Wrodzony → Nabyty</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-green-600" />
                          <span>Makrofagi prezentują antygeny komórkom T</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-green-600" />
                          <span>Dendrytyczne komórki aktywują limfocyty</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-green-600" />
                          <span>
                            Komórki NK współdziałają z cytotoksycznymi komórkami T
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 font-semibold">
                        Odpowiedź Humoralna vs. Komórkowa
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-blue-600" />
                          <span>Komórki B → Przeciwciała → Fagocytoza</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-blue-600" />
                          <span>Komórki T → Cytotoksyczność → Apoptoza</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mt-0.5 mr-2 h-4 w-4 text-blue-600" />
                          <span>Limfocyty T pomocnicze → Koordynacja odpowiedzi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Funkcje Tab */}
            <TabsContent value="funkcje" className="mt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Mechanizmy Obronne
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-500 pl-3">
                        <h4 className="font-medium">Fagocytoza</h4>
                        <p className="text-sm text-gray-600">
                          Pochłanianie i trawienie patogenów przez komórki żerne
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <h4 className="font-medium">Produkcja przeciwciał</h4>
                        <p className="text-sm text-gray-600">
                          Specyficzne białka wiążące antygeny
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <h4 className="font-medium">Cytotoksyczność</h4>
                        <p className="text-sm text-gray-600">
                          Bezpośrednie zabijanie komórek zainfekowanych
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                      Autoimmunologia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-yellow-500 pl-3">
                        <h4 className="font-medium">Tolerancja immunologiczna</h4>
                        <p className="text-sm text-gray-600">
                          Mechanizmy zapobiegające atakowaniu własnych tkanek
                        </p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-3">
                        <h4 className="font-medium">Choroby autoimmunologiczne</h4>
                        <p className="text-sm text-gray-600">
                          Łuszczyca, reumatoidalne zapalenie stawów, cukrzyca typu 1
                        </p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-3">
                        <h4 className="font-medium">Regulacja odpowiedzi</h4>
                        <p className="text-sm text-gray-600">
                          Limfocyty T regulatory i supresyjne
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-red-600" />
                      Nadwrażliwość
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-red-500 pl-3">
                        <h4 className="font-medium">Typ I - Alergie</h4>
                        <p className="text-sm text-gray-600">
                          IgE, mastocyty, anafilaksja
                        </p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-3">
                        <h4 className="font-medium">Typ II - Cytotoksyczna</h4>
                        <p className="text-sm text-gray-600">
                          IgG/IgM, zniszczenie komórek gospodarza
                        </p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-3">
                        <h4 className="font-medium">Typ III - Immunokompleksowa</h4>
                        <p className="text-sm text-gray-600">
                          Depozycja kompleksów, zapalenie tkanek
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mediatory Tab */}
            <TabsContent value="mediatory" className="mt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {mediators.map((mediator) => (
                  <Card key={mediator.id}>
                    <CardHeader>
                      <CardTitle>{mediator.polishName}</CardTitle>
                      <CardDescription className="text-sm text-blue-600">
                        {mediator.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-1 text-sm font-medium">Funkcja:</h4>
                          <p className="text-sm text-gray-600">{mediator.function}</p>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-medium">
                            Rola w odpowiedzi immunologicznej:
                          </h4>
                          <p className="text-sm text-gray-600">{mediator.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Przykłady Kliniczne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h4 className="mb-2 font-medium text-blue-900">
                        Interferon w terapii WZW C
                      </h4>
                      <p className="text-sm text-blue-800">
                        Syntetyczne interferony (IFN-α) wykorzystywane w leczeniu
                        wirusowego zapalenia wątroby typu C.
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <h4 className="mb-2 font-medium text-green-900">
                        Chemokiny w stanach zapalnych
                      </h4>
                      <p className="text-sm text-green-800">
                        CXCL8 (IL-8) rekrutuje neutrofile do tkanek objętych zapaleniem.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Neuroimmunologia Tab */}
            <TabsContent value="neuroimmunologia" className="mt-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-6 w-6 text-purple-600" />
                      Wpływ Stresu na Układ Immunologiczny
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold">Oś HPA i GLukokortykoidy:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Kortyzol hamuje produkcję cytokin prozapalnych</li>
                          <li>• Długotrwały stres → immunosupresja</li>
                          <li>• Zmniejszona odpowiedź na infekcje</li>
                          <li>• Opóźnione gojenie ran</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Układ Nerwowy Autonomiczny:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Cholinergiczny szlak przeciwzapalny</li>
                          <li>• Nerw błędny moduluje odpowiedź immunologiczną</li>
                          <li>• Sympatyczne włókna nerwowe w tkankach limfatycznych</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Microscope className="mr-2 h-6 w-6 text-blue-600" />
                      Cytokiny jako Mediatory Neuroimmunologiczne
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold">Prozapalne cytokiny:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>
                            • IL-1β, TNF-α → {'"'}chorobowe zachowanie{'"'}
                          </li>
                          <li>• IFN-γ → aktywacja mikrogleju</li>
                          <li>• IL-6 → odpowiedź ostrej fazy</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Przeciwzapalne cytokiny:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• IL-10 → inhibicja odpowiedzi immunologicznej</li>
                          <li>• TGF-β → tolerancja immunologiczna</li>
                          <li>• IL-4 → odpowiedź przeciwalergiczna</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Interakcje Mózg-Układ Immunologiczny</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <h4 className="mb-2 text-center font-semibold">Mikroglej</h4>
                        <p className="text-center text-sm">
                          Rezydentne makrofagi mózgu, aktywowane przez cytokiny,
                          uczestniczą w neurozapaleniu i neuroprotekcji.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-center font-semibold">
                          Bariera Krew-Mózg
                        </h4>
                        <p className="text-center text-sm">
                          Selektywna permeabilność dla cytokin i limfocytów, regulowana
                          przez komórki śródbłonka.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-center font-semibold">
                          Układ Limbiczny
                        </h4>
                        <p className="text-center text-sm">
                          Hipokamp, przysadka, podwzgórze współdziałają w modulacji
                          odpowiedzi immunologicznej.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ćwiczenia Tab */}
            <TabsContent value="cwiczenia" className="mt-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
                      Test Wiedzy - Immunitet Wrodzony
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="mb-2 font-medium">Pytanie 1:</p>
                        <p className="mb-3 text-sm">
                          Które komórki jako pierwsze przybywają na miejsce infekcji
                          bakteryjnej?
                        </p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-sm"
                          >
                            A) Limfocyty T
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-sm"
                          >
                            B) Limfocyty B
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-green-200 bg-green-50 text-sm"
                          >
                            C) Neutrofile ✓
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-sm"
                          >
                            D) Makrofagi
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="mr-2 h-5 w-5 text-green-600" />
                      Studium Przypadku - COVID-19
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-green-50 p-4">
                        <p className="mb-2 font-medium">
                          Analiza odpowiedzi immunologicznej:
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li>1. Wirus SARS-CoV-2 infekuje komórki nabłonkowe</li>
                          <li>2. Aktywacja interferonu typu I</li>
                          <li>3. Rekrutacja makrofagów i neutrofili</li>
                          <li>4. Produkcja cytokin prozapalnych (burza cytokinowa)</li>
                          <li>5. Aktywacja limfocytów T cytotoksycznych</li>
                        </ul>
                      </div>
                      <Button>Szczegółowa analiza przypadku</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Interaktywne Ćwiczenia</CardTitle>
                  <CardDescription>
                    Praktyczne zadania do utrwalenia wiedzy o układzie immunologicznym
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                    >
                      <Target className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Quiz Diagnostyczny</span>
                      <span className="text-xs text-gray-500">Testuj swoją wiedzę</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                    >
                      <Microscope className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Symulacja Infekcji</span>
                      <span className="text-xs text-gray-500">
                        Zobacz odpowiedź immunologiczną
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                    >
                      <Brain className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Stres i Immunitet</span>
                      <span className="text-xs text-gray-500">
                        Interakcje neuroimmunologiczne
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
