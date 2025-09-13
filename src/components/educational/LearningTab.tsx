'use client'

import { BookOpen, Brain, Zap, Network, RotateCcw } from 'lucide-react'
import { useState } from 'react'

import ExpandableCard from '@/components/educational/ExpandableCard'

const conditioningTypes = [
  {
    id: 'classical',
    name: 'Uwarunkowanie klasyczne',
    description: 'Nauka poprzez asocjację między bodźcem a reakcją',
    example: 'Pies Pawłowa - dzwonek kojarzony z jedzeniem',
    mechanisms: ['Układ limbiczny', 'Ciała migdałowate'],
    applications: 'Leczenie fobii, terapia behawioralna'
  },
  {
    id: 'operant',
    name: 'Uwarunkowanie instrumentalne',
    description: 'Nauka poprzez konsekwencje zachowań',
    example: 'Nagroda za dobre zachowanie zwiększa jego częstotliwość',
    mechanisms: ['Układ nagrody', 'Dopamina', 'Płat czołowy'],
    applications: 'Edukacja, trening zwierząt, modyfikacja zachowań'
  },
  {
    id: 'observational',
    name: 'Nauka przez obserwację',
    description: 'Nauka poprzez obserwowanie zachowań innych',
    example: 'Dzieci uczące się przez naśladowanie rodziców',
    mechanisms: ['Neurony lustrzane', 'Płat czołowy', 'Układ limbiczny'],
    applications: 'Rozwój społeczny, edukacja, terapia'
  }
]

const synapticProcess = [
  {
    name: 'Potencjacja długoterminowa (LTP)',
    description: 'Wzmocnienie połączeń synaptycznych podczas nauki',
    mechanisms: [
      'Wzrost przewodnictwa synaptycznego',
      'Zwiększona gęstość receptorów',
      'Wzmocnienie ścieżki neuronalnej'
    ],
    triggers: [
      'Wysoka częstotliwość stymulacji',
      'Koincydencja presynaptyczna i postsynaptyczna'
    ],
    duration: 'Długoterminowe zmiany'
  },
  {
    name: 'Depresja długoterminowa (LTD)',
    description: 'Osłabienie połączeń synaptycznych',
    mechanisms: [
      'Zmniejszenie przewodnictwa synaptycznego',
      'Redukcja receptorów',
      'Przebudowa połączeń'
    ],
    triggers: ['Niska częstotliwość stymulacji', 'Brak synchronizacji neuronalnej'],
    duration: 'Przejściowe lub długoterminowe'
  },
  {
    name: 'Potencjacja krótkoterminowa (STP)',
    description: 'Tymczasowe wzmocnienie reakcji synaptycznej',
    mechanisms: ['Zwiększone uwalnianie neurotransmiterów', 'Wrażliwość postsynaptyczna'],
    triggers: ['Jednorazowa stymulacja', 'Wzrost wapnia wewnątrzkomórkowego'],
    duration: 'Sekundy do minut'
  }
]

/**
 *
 */
export default function LearningTab() {
  const [activeConditioning, setActiveConditioning] = useState('classical')
  const [showAnimation, setShowAnimation] = useState(false)

  const currentConditioning =
    conditioningTypes.find((c) => c.id === activeConditioning) || conditioningTypes[0]

  return (
    <div className="space-y-6">
      {/* Conditioning Types */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
          Rodzaje warunkowania
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {conditioningTypes.map((conditioning) => (
            <button
              key={conditioning.id}
              onClick={() => setActiveConditioning(conditioning.id)}
              className={`rounded-lg border-2 p-4 transition-colors ${
                activeConditioning === conditioning.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{conditioning.name}</h4>
              <p className="mt-1 text-sm text-gray-600">{conditioning.description}</p>
            </button>
          ))}
        </div>

        {/* Conditioning Details */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-900">
            {currentConditioning?.name}
          </h4>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <span className="font-medium">Przykład:</span>
              <br />
              {currentConditioning?.example}
            </div>
            <div>
              <span className="font-medium">Mechanizmy:</span>
              <br />
              {currentConditioning?.mechanisms.join(', ')}
            </div>
            <div>
              <span className="font-medium">Zastosowania:</span>
              <br />
              {currentConditioning?.applications}
            </div>
          </div>
        </div>
      </div>

      {/* Synaptic Plasticity */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-xl font-semibold text-gray-900">
            <Network className="mr-3 h-6 w-6 text-purple-600" />
            Plastyczność synaptyczna
          </h3>
          <button
            onClick={() => setShowAnimation(!showAnimation)}
            className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            {showAnimation ? 'Ukryj animację' : 'Pokaż proces'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {synapticProcess.map((process, index) => (
            <ExpandableCard
              key={index}
              title={process.name}
              summary={process.description}
              details={`Mechanizmy: ${process.mechanisms.join(', ')}\n\nWyzwalacze: ${process.triggers}\n\nCzas trwania: ${process.duration}`}
              icon="brain"
              variant={index === 0 ? 'highlight' : 'default'}
            />
          ))}
        </div>

        {showAnimation && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Animacja procesu LTP</h4>
            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <div className="text-center text-gray-500">
                <Brain className="mx-auto mb-4 h-16 w-16" />
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500"></div>
                    <div className="text-sm">Stymulacja presynaptyczna</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500 delay-300"></div>
                    <div className="text-sm">Wzrost wapnia postsynaptycznego</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-purple-500 delay-600"></div>
                    <div className="text-sm">Aktywacja enzymów i białek</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 delay-1000"></div>
                    <div className="text-sm">Wzmocnienie połączenia synaptycznego</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Theories */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Zap className="mr-3 h-6 w-6 text-orange-600" />
          Teorie uczenia się
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ExpandableCard
            title="Teoria zachowania (Behaviorizm)"
            summary="Uczenie się poprzez bodźce i reakcje środowiska"
            details="• Główni przedstawiciele: Pawłow, Skinner, Watson\n• Założenia: zachowanie jest funkcją środowiska\n• Mechanizmy: warunkowanie, wzmocnienie, kara\n• Zastosowania: terapia behawioralna, trening"
            icon="lightbulb"
          />

          <ExpandableCard
            title="Teoria poznawcza (Kognitywizm)"
            summary="Uczenie się poprzez procesy mentalne i wiedzę"
            details="• Główni przedstawiciele: Piaget, Vygotsky, Bandura\n• Założenia: aktywne przetwarzanie informacji\n• Mechanizmy: schematy, akomodacja, asymilacja\n• Zastosowania: edukacja, psychologia poznawcza"
            icon="lightbulb"
          />

          <ExpandableCard
            title="Teoria konstruktywizmu"
            summary="Budowanie wiedzy poprzez doświadczenie"
            details="• Główni przedstawiciele: Piaget, Dewey\n• Założenia: wiedza budowana stopniowo\n• Mechanizmy: eksploracja, refleksja, konstrukcja\n• Zastosowania: nauczanie problemowe, discovery learning"
            icon="brain"
          />

          <ExpandableCard
            title="Teoria połączeniowa (Connectivism)"
            summary="Uczenie się poprzez sieci i połączenia"
            details="• Główni przedstawiciele: Siemens, Downes\n• Założenia: wiedza rozłożona w sieciach\n• Mechanizmy: węzły, połączenia, przepływy\n• Zastosowania: e-learning, sieci społecznościowe"
            icon="brain"
          />
        </div>
      </div>

      {/* Practical Applications */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <BookOpen className="mr-3 h-6 w-6 text-green-600" />
          Praktyczne zastosowania
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Metody efektywnego uczenia się
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Aktywne powtarzanie materiału
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Powtarzanie rozłożone w czasie
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Łączenie teorii z praktyką
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Uczenie się przez nauczanie innych
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Wspomaganie procesu nauki
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Optymalne środowisko nauki
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Techniki mnemoniczne
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Zarządzanie stresem
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                Odpowiedni sen i odżywianie
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
