'use client';

import { BookOpen, Brain, Zap, Network, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import ExpandableCard from '@/components/educational/ExpandableCard';

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
];

const synapticProcess = [
  {
    name: 'Potencjacja długoterminowa (LTP)',
    description: 'Wzmocnienie połączeń synaptycznych podczas nauki',
    mechanisms: ['Wzrost przewodnictwa synaptycznego', 'Zwiększona gęstość receptorów', 'Wzmocnienie ścieżki neuronalnej'],
    triggers: ['Wysoka częstotliwość stymulacji', 'Koincydencja presynaptyczna i postsynaptyczna'],
    duration: 'Długoterminowe zmiany'
  },
  {
    name: 'Depresja długoterminowa (LTD)',
    description: 'Osłabienie połączeń synaptycznych',
    mechanisms: ['Zmniejszenie przewodnictwa synaptycznego', 'Redukcja receptorów', 'Przebudowa połączeń'],
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
];

/**
 *
 */
export default function LearningTab() {
  const [activeConditioning, setActiveConditioning] = useState('classical');
  const [showAnimation, setShowAnimation] = useState(false);

  const currentConditioning = conditioningTypes.find(c => c.id === activeConditioning) || conditioningTypes[0];

  return (
    <div className="space-y-6">
      {/* Conditioning Types */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
          Rodzaje warunkowania
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {conditioningTypes.map((conditioning) => (
            <button
              key={conditioning.id}
              onClick={() => setActiveConditioning(conditioning.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                activeConditioning === conditioning.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{conditioning.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{conditioning.description}</p>
            </button>
          ))}
        </div>

        {/* Conditioning Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{currentConditioning?.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Przykład:</span><br />
              {currentConditioning?.example}
            </div>
            <div>
              <span className="font-medium">Mechanizmy:</span><br />
              {currentConditioning?.mechanisms.join(', ')}
            </div>
            <div>
              <span className="font-medium">Zastosowania:</span><br />
              {currentConditioning?.applications}
            </div>
          </div>
        </div>
      </div>

      {/* Synaptic Plasticity */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Network className="h-6 w-6 mr-3 text-purple-600" />
            Plastyczność synaptyczna
          </h3>
          <button
            onClick={() => setShowAnimation(!showAnimation)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
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
              variant={index === 0 ? "highlight" : "default"}
            />
          ))}
        </div>

        {showAnimation && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Animacja procesu LTP</h4>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="text-center text-gray-500">
                <Brain className="h-16 w-16 mx-auto mb-4" />
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="text-sm">Stymulacja presynaptyczna</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                    <div className="text-sm">Wzrost wapnia postsynaptycznego</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-600"></div>
                    <div className="text-sm">Aktywacja enzymów i białek</div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-1000"></div>
                    <div className="text-sm">Wzmocnienie połączenia synaptycznego</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Theories */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-orange-600" />
          Teorie uczenia się
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-6 w-6 mr-3 text-green-600" />
          Praktyczne zastosowania
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Metody efektywnego uczenia się</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Aktywne powtarzanie materiału
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Powtarzanie rozłożone w czasie
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Łączenie teorii z praktyką
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Uczenie się przez nauczanie innych
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Wspomaganie procesu nauki</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Optymalne środowisko nauki
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Techniki mnemoniczne
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Zarządzanie stresem
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Odpowiedni sen i odżywianie
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}