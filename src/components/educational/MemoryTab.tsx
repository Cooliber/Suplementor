'use client';

import { Brain, Clock, Book, Zap } from 'lucide-react';
import { useState } from 'react';

import { type BrainRegionData } from './Brain3D';
import Brain3D from './Brain3D';
import ExpandableCard from './ExpandableCard';
import QuizEngine from './QuizEngine';

const memoryTypes = [
  {
    id: 'working',
    name: 'Pamięć robocza',
    description: 'Krótko terminowa pamięć do przetrzymywania informacji podczas zadań',
    capacity: '7 ± 2 elementy',
    duration: '20-30 sekund',
    techniques: ['Powtarzanie', 'Grupowanie', 'Wizualizacja']
  },
  {
    id: 'short',
    name: 'Pamięć krótkoterminowa',
    description: 'Przechowuje informacje przez krótki czas bez aktywnego powtarzania',
    capacity: '4-7 elementów',
    duration: '20-30 sekund',
    techniques: ['Mnemoniki', 'Association', 'Spacery poznawcze']
  },
  {
    id: 'long',
    name: 'Pamięć długoterminowa',
    description: 'Długotrwałe przechowywanie wspomnień i wiedzy',
    capacity: 'Praktycznie nieograniczona',
    duration: 'Lata, całe życie',
    techniques: ['Powtarzanie rozłożone', 'Uczenie się głębokie', 'Snoezelen']
  }
];

const mnemonicTechniques = [
  {
    name: 'Metoda lokacji',
    description: 'Przypisywanie informacji do znanych miejsc',
    example: 'Odkurzanie pokoju przypomnienia listy zakupów',
    effectiveness: '90%'
  },
  {
    name: 'Technika pierwszej litery',
    description: 'Tworzenie słowa z pierwszych liter informacji do zapamiętania',
    example: 'Planetary = Merkury, Wenus, Ziemia, Mars, Jowisz...',
    effectiveness: '80%'
  },
  {
    name: 'Metoda cząsteczkowa',
    description: 'Łączenie podobnych przedmiotów w grupy',
    example: 'Warzywa: marchew, cebula, ziemniak, brokuł',
    effectiveness: '85%'
  }
];

/**
 *
 */
export default function MemoryTab() {
  const [activeMemoryType, setActiveMemoryType] = useState('working');
  const [showExercise, setShowExercise] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<BrainRegionData | null>(null);
  const [animateRegionId, setAnimateRegionId] = useState<string | null>(null);

  const handleQuizAnswer = (answer: string, correct: boolean) => {
    if (correct) {
      // Animate frontal lobe for memory
      setAnimateRegionId('frontal');
      setTimeout(() => setAnimateRegionId(null), 2000);
    }
    setSelectedRegion({
      id: 'frontal',
      name: 'Płat czołowy',
      description: 'Odpowiedzialny za funkcje wykonawcze, planowanie, kontrolę impulsów i osobowość',
      functions: ['Planowanie', 'Kontrola impulsów', 'Osobowość', 'Podejmowanie decyzji'],
      color: '#3B82F6',
      position: [0, 0.3, 0.8],
      size: 0.15
    });
  };

  const memoryQuizQuestions = [
    {
      id: 'memory1',
      question: 'Która struktura mózgu jest kluczowa dla tworzenia nowych wspomnień?',
      options: ['Płat czołowy', 'Hipokamp', 'Móżdżek', 'Pień mózgu'],
      correctAnswer: 1,
      explanation: 'Hipokamp jest odpowiedzialny za konsolidację wspomnień z pamięci krótkoterminowej do długoterminowej.'
    },
    {
      id: 'memory2',
      question: 'Jaka jest przeciętna pojemność pamięci roboczej?',
      options: ['3-4 elementy', '7 ± 2 elementy', '15-20 elementów', 'Nieograniczona'],
      correctAnswer: 1,
      explanation: 'Według badań George\'a Millera, pamięć robocza może przechowywać około 7 ± 2 elementów informacji.'
    },
    {
      id: 'memory3',
      question: 'Która technika mnemoniczna polega na przypisywaniu informacji do znanych miejsc?',
      options: ['Metoda lokacji', 'Technika pierwszej litery', 'Metoda cząsteczkowa', 'Pomodoro'],
      correctAnswer: 0,
      explanation: 'Metoda lokacji (method of loci) wykorzystuje przestrzenną pamięć do efektywnego zapamiętywania sekwencji informacji.'
    }
  ];

  const currentMemory = memoryTypes.find(m => m.id === activeMemoryType) || memoryTypes[0];

  return (
    <div className="space-y-6">
      {/* Memory Types Overview */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-6 w-6 mr-3 text-blue-600" />
          Rodzaje pamięci
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {memoryTypes.map((memory) => (
            <button
              key={memory.id}
              onClick={() => setActiveMemoryType(memory.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                activeMemoryType === memory.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{memory.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{memory.description}</p>
            </button>
          ))}
        </div>

        {/* Memory Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{currentMemory?.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Pojemność:</span> {currentMemory?.capacity}
            </div>
            <div>
              <span className="font-medium">Czas trwania:</span> {currentMemory?.duration}
            </div>
            <div>
              <span className="font-medium">Techniki:</span> {currentMemory?.techniques.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Mnemonic Techniques */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-yellow-600" />
          Techniki mnemoniczne
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mnemonicTechniques.map((technique, index) => (
            <ExpandableCard
              key={index}
              title={technique.name}
              summary={technique.description}
              details={`${technique.example}\n\nSkuteczność: ${technique.effectiveness}`}
              icon="lightbulb"
            />
          ))}
        </div>
      </div>

      {/* Practical Examples */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Book className="h-6 w-6 mr-3 text-green-600" />
          Praktyczne przykłady
        </h3>

        <div className="space-y-4">
          <ExpandableCard
            title="Nauka języka obcego"
            summary="Jak wykorzystać pamięć do efektywnej nauki nowych słów"
            details="• Metoda lokacji: Umieść słowa w pokojach swojego domu\n• Technika asocjacyjna: Łącz obce słowa z podobnymi polskimi\n• Powtarzanie rozłożone: Przeglądaj słowa co 1, 3, 6, 12 dni\n• Efektywnej nauki: 15-20 nowych słów dziennie"
            icon="brain"
          />

          <ExpandableCard
            title="Numer telefonu"
            summary="Zapamiętywanie długich ciągów liczb"
            details="• Podziel na grupy po 3-4 cyfry\n• Przekształć w daty lub kody pocztowe\n• Powiąż z obrazami (np. 7 = kot, 3 = trójkąt)\n• Metoda peg: Użyj cyfr jako punktów zaczepienia"
            icon="brain"
          />

          <ExpandableCard
            title="Przemówienia i prezentacje"
            summary="Zapamiętywanie dłużysz tekstów"
            details="• Główna struktura: Wstęp, ciało, zakończenie\n• Kluczowe słowa jako punkty orientacyjne\n• Wizualizacja struktury jako mapa myśli\n• Ćwiczenie z zamykaniem oczu"
            icon="brain"
          />
        </div>
      </div>

      {/* Memory Games & Exercises */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-6 w-6 mr-3 text-purple-600" />
            Ćwiczenia pamięci
          </h3>
          <button
            onClick={() => setShowExercise(!showExercise)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showExercise ? 'Ukryj ćwiczenia' : 'Pokaż ćwiczenia'}
          </button>
        </div>

        {showExercise && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Ćwiczenie: Lista zakupów</h4>
              <p className="text-purple-800 text-sm mb-3">
                Zapamiętaj poniższą listę przedmiotów używając techniki mnemonicznej
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {['Chleb', 'Masło', 'Jajka', 'Mleko', 'Jabłka', 'Banany', 'Kawa', 'Cukier'].map((item, idx) => (
                  <div key={idx} className="bg-white px-2 py-1 rounded text-center">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-purple-600">
                Spróbuj przypomnieć sobie wszystkie przedmioty bez patrzenia
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Ćwiczenie: Cyfry wstecz</h4>
              <p className="text-green-800 text-sm">
                Spróbuj zapamiętać sekwencję i powtórzyć ją od końca
              </p>
              <div className="mt-2 text-lg font-mono text-center bg-white p-2 rounded">
                8 → 2 → 4 → 9 → 1 → 7 → 5 → 3
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quiz Section */}
      <ExpandableCard
        title="Test wiedzy o pamięci"
        summary="Sprawdź swoją wiedzę i zobacz interaktywny mózg"
        icon="brain"
      >
        <div className="space-y-4">
          <QuizEngine 
            questions={memoryQuizQuestions} 
            title="Quiz o pamięci" 
            onComplete={(score, total) => {
              // Quiz completed - could be used for analytics or user progress tracking
            }}
            onAnswer={handleQuizAnswer}
          />
          
          {selectedRegion && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Wybrany region: {selectedRegion.name}</h4>
              <Brain3D 
                selectedRegion={selectedRegion} 
                onRegionClick={(region: BrainRegionData) => setSelectedRegion(region)}
                animateRegionId={animateRegionId}
              />
            </div>
          )}
        </div>
      </ExpandableCard>
    </div>
  );
}