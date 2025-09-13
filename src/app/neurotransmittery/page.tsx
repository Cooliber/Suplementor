'use client';

import { Brain, Zap, Heart, Shield, ArrowLeft, ExternalLink, Info, Lightbulb, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { type ReactElement } from 'react';

import AttentionTab from '@/components/educational/AttentionTab';
import BrainWavesTab from '@/components/educational/BrainWavesTab';
import ExpandableCard from '@/components/educational/ExpandableCard';
import LearningTab from '@/components/educational/LearningTab';
import MemoryTab from '@/components/educational/MemoryTab';
import NeuroplasticityTab from '@/components/educational/NeuroplasticityTab';

interface Neurotransmitter {
  id: string;
  name: string;
  category: string;
  structure: string;
  function: string;
  roles: {
    mood: string;
    movement: string;
    learning: string;
    memory: string;
  };
  categoryIcon: ReactElement;
}

const neurotransmitters: Neurotransmitter[] = [
  {
    id: "glutamate",
    name: "Glutaminian",
    category: "Aminokwasy",
    structure: "Kwasy aminokwasy z grupy excytujących neurotransmiterów glutaminianowych",
    function: "Główny neurotransmiter excytujący w ośrodkowym układzie nerwowym, odpowiedzialny za transmisję sygnału między neuronami",
    roles: {
      mood: "Wpływa na nastrój poprzez regulację excytacji neuronalnej",
      movement: "Wspiera koordynację ruchową poprzez kontrolę aktywności motorycznej",
      learning: "Podstawowy w procesach uczenia się poprzez wzmacnianie synaps",
      memory: "Krytyczny dla tworzenia i przechowywania pamięci długotrwałej"
    },
    categoryIcon: <Zap className="h-4 w-4" />
  },
  {
    id: "gaba",
    name: "GABA",
    category: "Aminokwasy",
    structure: "Kwas gamma-aminomasłowy - inhibitor neurotransmiter aminokwasowy",
    function: "Główny neurotransmiter hamujący w mózgu, zmniejsza aktywność neuronalną",
    roles: {
      mood: "Redukuje lęk i poprawia stabilność nastroju poprzez hamowanie",
      movement: "Kontrolowanie napięcia mięśniowego i zapobieganie skurczom",
      learning: "Równoważy excitację dla efektywnego uczenia się",
      memory: "Wspiera konsolidację pamięci poprzez stabilizację neuronalną"
    },
    categoryIcon: <Shield className="h-4 w-4" />
  },
  {
    id: "dopamine",
    name: "Dopamina",
    category: "Monoaminy",
    structure: "Katecholamina utworzona z tyrozyny poprzez hydroksylację i dekarboksylację",
    function: "Reguluje motywację, nagrodę i motorykę poprzez receptory dopaminergiczne",
    roles: {
      mood: "Kontroluje motywy, przyjemność i poczucie dobrostanu",
      movement: "Główny w kontroli ruchowej, deficyty powodują Parkinson",
      learning: "Wzmacnia uczenie się przez wzmocnienie pozytywne",
      memory: "Poprawia konsolidację pamięci poprzez nagrodowy system"
    },
    categoryIcon: <Heart className="h-4 w-4" />
  },
  {
    id: "serotonin",
    name: "Serotonina",
    category: "Monoaminy",
    structure: "5-hydroksytryptamina - indolamina syntetyzowana z tryptofanu",
    function: "Reguluje nastrój, sen i funkcje poznawcze poprzez system serotoninergiczny",
    roles: {
      mood: "Kluczowy regulator nastroju, deficyty związane z depresją",
      movement: "Wpływa na koordynację i regulację funkcji ruchowych",
      learning: "Poprawia elastyczność poznawczą i uczenie się adaptacyjne",
      memory: "Wspiera pamięć osiągania poprzez wzmacnianie konsolidacji"
    },
    categoryIcon: <Heart className="h-4 w-4" />
  },
  {
    id: "norepinephrine",
    name: "Noradrenalina",
    category: "Monoaminy",
    structure: "Katecholamina pochodna dopaminy poprzez przekształcenie beta-hydroksylazy",
    function: "Odpowiedzialna za odpowiedzi stresowe i uwagę poprzez system adrenergiczny",
    roles: {
      mood: "Reguluje alertność i motywację poprzez pobudzenie",
      movement: "Wspiera mobilizację ruchową w sytuacjach stresowych",
      learning: "Wzmacnia uwagę skupioną potrzebną do uczenia się",
      memory: "Poprawia pamięć proceduralną poprzez zwiększoną uwagę"
    },
    categoryIcon: <Heart className="h-4 w-4" />
  },
  {
    id: "acetylcholine",
    name: "Acetylocholina",
    category: "Inne",
    structure: "Ester kwasu octowego i choliny - główny neurotransmiter cholinergic",
    function: "Odpowiedzialna za kontrolę funkcji mięśni, pamięć i uwagę",
    roles: {
      mood: "Wpływa na poziom uwagi igotowość do działania",
      movement: "Główny dla kontroli mięśni szkieletowych",
      learning: "Podstawowy w pamięci roboczej i procesach poznawczych",
      memory: "Krytyczny dla przypominania elementów'epizodycznych"
    },
    categoryIcon: <Info className="h-4 w-4" />
  }
];

const categories = ["Wszystkie", "Aminokwasy", "Monoaminy", "Inne"];

const mainTabs = [
  { id: 'basic', label: 'Podstawowe informacje', icon: <Info className="h-4 w-4" /> },
  { id: 'memory', label: 'Pamięć', icon: <Brain className="h-4 w-4" /> },
  { id: 'attention', label: 'Uwaga', icon: <Info className="h-4 w-4" /> },
  { id: 'learning', label: 'Uczenie się', icon: <Lightbulb className="h-4 w-4" /> },
  { id: 'cognitive', label: 'Funkcje poznawcze', icon: <Brain className="h-4 w-4" /> },
  { id: 'nootropics', label: 'Wpływ nootropów', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'neuroplasticity', label: 'Neuroplastyczność', icon: <Zap className="h-4 w-4" /> },
  { id: 'brainwaves', label: 'Fale mózgowe', icon: <Brain className="h-4 w-4" /> }
];

/**
 *
 */
export default function NeurotransmitteryPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [selectedNeurotransmitter, setSelectedNeurotransmitter] = useState<Neurotransmitter | null>(null);

  const filteredNeurotransmitters = neurotransmitters.filter(nt =>
    selectedCategory === "Wszystkie" || nt.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do strony głównej
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Neurotransmittery</h1>
          <p className="text-lg text-gray-600">
            Kompletna baza neurotransmiterów z informacjami o strukturze, funkcji i rolach neuroregulacyjnych
          </p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-700">
                  Dowiedz się więcej o nootropach wspierających funkcje neurotransmiterów:
                </p>
                <Link
                  href="https://nootropicsexpert.com/nootropics-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-1"
                >
                  https://nootropicsexpert.com/nootropics-list/
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="block sm:hidden">{tab.icon}</span>
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <>
            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Znaleziono {filteredNeurotransmitters.length} neurotransmiterów
              </p>
            </div>
          </>
        )}

        {activeTab === 'memory' && <MemoryTab />}
        {activeTab === 'attention' && <AttentionTab />}
        {activeTab === 'learning' && <LearningTab />}
        {activeTab === 'neuroplasticity' && <NeuroplasticityTab />}
        {activeTab === 'brainwaves' && <BrainWavesTab />}

        {activeTab === 'cognitive' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-6 w-6 mr-3 text-indigo-600" />
                Funkcje poznawcze związane z neurotransmiterami
              </h3>
              <p className="text-gray-600 mb-4">
                Neurotransmittery odgrywają kluczową rolę w różnych funkcjach poznawczych mózgu.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExpandableCard
                  title="Pamięć"
                  summary="Tworzenie i przechowywanie wspomnień"
                  details="Acetylocholina i glutaminian są kluczowe dla pamięci roboczej, podczas gdy dopamina wzmacnia pamięć nagrodową. Serotonina pomaga w konsolidacji pamięci długotrwałej."
                  icon="brain"
                />
                <ExpandableCard
                  title="Uwaga"
                  summary="Skupienie i koncentracja"
                  details="Noradrenalina zwiększa uwagę poprzez pobudzenie układu współczulnego. Dopamina pomaga w utrzymywaniu uwagi przez system nagrody."
                  icon="brain"
                />
                <ExpandableCard
                  title="Uczenie się"
                  summary="Adaptacja i przyswajanie wiedzy"
                  details="Dopamina jest niezbędna dla uczenia się przez wzmocnienie. Glutaminian umożliwia plastyczność synaptyczną konieczną do tworzenia nowych połączeń neuronalnych."
                  icon="brain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Content */}
        {activeTab === 'basic' && (
          <>
            {/* Neurotransmitters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeurotransmitters.map((nt) => (
                <div
                  key={nt.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedNeurotransmitter(nt)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{nt.name}</h3>
                        <p className="text-sm text-gray-500">{nt.category}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        nt.category === "Aminokwasy" ? "bg-green-100 text-green-800" :
                        nt.category === "Monoaminy" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {nt.categoryIcon}
                        <span className="ml-1">{nt.category}</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Struktura:</h4>
                        <p className="text-sm text-gray-600">{nt.structure}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Funkcja:</h4>
                        <p className="text-sm text-gray-600">{nt.function}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredNeurotransmitters.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Brak wyników</h3>
                <p className="text-gray-600">Nie znaleziono neurotransmiterów w wybranej kategorii.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNeurotransmitter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedNeurotransmitter.name}</h2>
                  <p className="text-sm text-gray-500">{selectedNeurotransmitter.category}</p>
                </div>
                <button
                  onClick={() => setSelectedNeurotransmitter(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Struktura</h3>
                    <p className="text-gray-600">{selectedNeurotransmitter.structure}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Funkcja</h3>
                    <p className="text-gray-600">{selectedNeurotransmitter.function}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Role neuroregulacyjne</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Nastrój</h4>
                      <p className="text-sm text-blue-700">{selectedNeurotransmitter.roles.mood}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Ruch</h4>
                      <p className="text-sm text-green-700">{selectedNeurotransmitter.roles.movement}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Uczenie się</h4>
                      <p className="text-sm text-purple-700">{selectedNeurotransmitter.roles.learning}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Pamięć</h4>
                      <p className="text-sm text-orange-700">{selectedNeurotransmitter.roles.memory}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedNeurotransmitter(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}