'use client';

import { Focus, Target, Brain, Zap } from 'lucide-react';
import { useState } from 'react';

import ExpandableCard from '@/components/educational/ExpandableCard';

const attentionTypes = [
  {
    id: 'sustained',
    name: 'Uwaga trwała',
    description: 'Zdolność do utrzymania uwagi przez dłuższy czas na pojedynczym zadaniu',
    mechanisms: ['Sieć wykonawcza', 'Fronto-parietalna', 'Dopamninergiczna'],
    duration: '10-20 minut',
    importance: 'Krytyczna dla nauki i pracy'
  },
  {
    id: 'selective',
    name: 'Uwaga selektywna',
    description: 'Możliwość skupienia się na istotnych informacjach ignorując rozpraszacze',
    mechanisms: ['Filtr uwagi', 'Inhibicja', 'SSR (Selekt. uwaga sensoryczna)'],
    duration: 'Zmienna',
    importance: 'Istotna w środowiskach wielozadaniowych'
  },
  {
    id: 'divided',
    name: 'Uwaga podzielona',
    description: 'Równoczesne wykonywanie wielu zadań wymagających uwagi',
    mechanisms: ['Przełączanie zadań', 'Robocza pamięć', 'Automatyczne przetwarzanie'],
    duration: 'Krótka',
    importance: 'Niezbędna w dynamicznych sytuacjach'
  }
];

const focusExercises = [
  {
    name: 'Oddychanie 4-7-8',
    description: 'Technika redukcji stresu i poprawy koncentracji',
    steps: ['Wdech przez nos na 4 sekundy', 'Zatrzymaj oddech na 7 sekund', 'Wywiew przez usta na 8 sekund'],
    duration: '4 minuty',
    benefits: 'Redukcja stresu, lepszy fokus'
  },
  {
    name: 'Ćwiczenie pojedynczej uwagi',
    description: 'Trening skoncentrowania się na jednym przedmiocie',
    steps: ['Wybierz przedmiot w pokoju', 'Obserwuj go przez 5 minut', 'Zwróć uwagę na wszystkie detale'],
    duration: '5-10 minut',
    benefits: 'Rozwój obserwacji, redukcja rozproszeń'
  },
  {
    name: 'Metoda Pomodoro',
    description: 'Technika pracy w cyklach z krótkimi przerwami',
    steps: ['Pracuj 25 minut', 'Zrób 5-minutową przerwę', 'Po 4 cyklach dłuższa przerwa'],
    duration: '25 minut pracy + przerwy',
    benefits: 'Utrzymanie koncentracji, zapobieganie wypaleniu'
  }
];

/**
 *
 */
export default function AttentionTab() {
  const [activeAttentionType, setActiveAttentionType] = useState('sustained');
  const [showExercises, setShowExercises] = useState(false);

  const currentAttention = attentionTypes.find(a => a.id === activeAttentionType) || attentionTypes[0];

  return (
    <div className="space-y-6">
      {/* Attention Types */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Focus className="h-6 w-6 mr-3 text-blue-600" />
          Typy uwagi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {attentionTypes.map((attention) => (
            <button
              key={attention.id}
              onClick={() => setActiveAttentionType(attention.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                activeAttentionType === attention.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{attention.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{attention.description}</p>
            </button>
          ))}
        </div>

        {/* Attention Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{currentAttention?.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Mechanizmy:</span><br />
              {currentAttention?.mechanisms.join(', ')}
            </div>
            <div>
              <span className="font-medium">Czas trwania:</span><br />
              {currentAttention?.duration}
            </div>
            <div>
              <span className="font-medium">Znaczenie:</span><br />
              {currentAttention?.importance}
            </div>
          </div>
        </div>
      </div>

      {/* Neural Mechanisms */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-6 w-6 mr-3 text-purple-600" />
          Mechanizmy neuronalne uwagi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpandableCard
            title="Płat czołowy"
            summary="Centrum kontroli wykonawczej i decyzji"
            details="Odpowiedzialny za planowanie, inhibitory kontrolę i przełączanie zadań. Kluczowy dla uwagi trwałej i selektywnej."
            icon="brain"
            variant="highlight"
          />

          <ExpandableCard
            title="Sieć uwagi"
            summary="Specjalizowane ścieżki neuronalne"
            details="Składa się z węzłów czołowych i ciemieniowych. Koordynuje różne aspekty procesów uwagi poprzez połączenia między płatami."
            icon="brain"
            variant="highlight"
          />

          <ExpandableCard
            title="Neuroprzekaźniki uwagi"
            summary="Chemiczne podłoże procesów poznawczych"
            details="Dopamina zwiększa saliency i motywację. Noradrenalina podnosi arousal. Ach zwiększa uwagę do istotnych bodźców."
            icon="lightbulb"
          />

          <ExpandableCard
            title="Synaptyczna plastyczność"
            summary="Adaptacja neuronalna do wymagań uwagi"
            details="Długoterminowa potencjacja wzmacnia ważne połączenia. Inhibicja zmniejsza interferencje. Doprowadza do lepszego funkcjonowania."
            icon="lightbulb"
          />
        </div>
      </div>

      {/* Focus Exercises */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="h-6 w-6 mr-3 text-green-600" />
            Ćwiczenia koncentracji
          </h3>
          <button
            onClick={() => setShowExercises(!showExercises)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {showExercises ? 'Ukryj ćwiczenia' : 'Pokaż ćwiczenia'}
          </button>
        </div>

        {showExercises && (
          <div className="space-y-4">
            {focusExercises.map((exercise, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{exercise.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Kroki:</span>
                    <ul className="mt-1 list-disc list-inside text-gray-700">
                      {exercise.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Czas:</span><br />
                    {exercise.duration}
                  </div>
                  <div>
                    <span className="font-medium">Korzyści:</span><br />
                    {exercise.benefits}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attention Enhancement Tips */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-orange-600" />
          Praktyczne wskazówki
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Środowisko pracy</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Zachowaj porządek na biurku
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Użyj słuchawek wyciszających
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Dostosuj temperaturę i oświetlenie
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Unikaj wielozadaniowości
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Techniki mentalne</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Ustalaj realistyczne cele
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Korzystaj z listy zadań
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Praktykuj mindfulness
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Rob krótkie przerwy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}