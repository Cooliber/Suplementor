'use client'

import { Brain, Target, Dumbbell, Book, Zap, Activity } from 'lucide-react'
import { useState } from 'react'

import ExpandableCard from '@/components/educational/ExpandableCard'

const neuroplasticityMechanisms = [
  {
    id: 'long-term-potentiation',
    name: 'Długotrwałe wzmocnienie',
    icon: <Zap className="h-5 w-5" />,
    description:
      'Mechanizm LTP umożliwia wzmacnianie połączeń synaptycznych poprzez zwiększoną transmisję neuronalną',
    mechanisms: ['Receptor NMDA', 'Kalmodulina', 'Proteina CREB', 'Synteza białek'],
    timeScale: 'Minuty do godzin'
  },
  {
    id: 'long-term-depression',
    name: 'Długotrwałe osłabienie',
    icon: <Target className="h-5 w-5" />,
    description:
      'Mechanizm LTD zmniejsza siłę połączeń synaptycznych podczas braku aktywności',
    mechanisms: [
      'Receptor NMDA',
      'Fosfataza',
      'Internalizacja receptorów',
      'Strukturalne zmiany'
    ],
    timeScale: 'Minuty do godzin'
  },
  {
    id: 'structural',
    name: 'Plastyczność strukturalna',
    icon: <Brain className="h-5 w-5" />,
    description: 'Morfologiczne zmiany w neuronach poprzez wzrost dendrytów i synaps',
    mechanisms: [
      'Wzmocnienie synaps',
      'Wsprzężenie zwrotne',
      'Faktory trophic',
      'Reorganizacja neuronalna'
    ],
    timeScale: 'Dni do tygodni'
  }
]

const strengtheningExercises = [
  {
    id: 'cognitive-training',
    name: 'Treningi poznawcze',
    icon: <Brain className="h-5 w-5" />,
    description: 'Ćwiczenia stymulujące funkcje poznawcze mózgu',
    exercises: [
      'Rozwiązywanie krzyżówek w języku obcym',
      'Nauka nowych umiejętności muzycznych',
      'Gry logiczne i strategiczne',
      'Rozwiązywanie problemów matematycznych'
    ],
    duration: '30-45 minut dziennie',
    frequency: '4-5 razy w tygodniu'
  },
  {
    id: 'learning-new-skills',
    name: 'Nauka nowych umiejętności',
    icon: <Book className="h-5 w-5" />,
    description:
      'Aktywna nauka nowych umiejętności prowadzi do reorganizacji neuronalnej',
    exercises: [
      'Nauka nowego języka',
      'Graj na nowym instrumencie',
      'Kurs tańca lub sztuk walki',
      'Programowanie lub projektowanie graficzne'
    ],
    duration: '1-2 godziny dziennie',
    frequency: 'Codziennie przez 3-6 miesięcy'
  },
  {
    id: 'physical-exercise',
    name: 'Ćwiczenia fizyczne',
    icon: <Dumbbell className="h-5 w-5" />,
    description:
      'Regularna aktywność fizyczna wspomaga neurogenezę i wydzielanie czynników trophic',
    exercises: [
      'Marsze nordic walking',
      'Tańce aerobic',
      'Joga lub tai chi',
      'Sporty drużynowe'
    ],
    duration: '45-60 minut dziennie',
    frequency: '3-5 razy w tygodniu'
  }
]

const polishExamples = [
  {
    id: 'memory-palace',
    name: 'Metoda Pałacu Pamięci',
    description:
      'Technika wykorzystująca znane przestrzenie do zapamiętywania informacji',
    example:
      'Podczas nauki anatomii mózgu, umiejscowiłeś informacje o płatach czołowych w kuchnii swojego domu rodzinnego',
    effectiveness: '90% poprawa zapamiętywania',
    polishContext:
      'Idealna do nauki polskiego języka technicznego i terminologii medycznej'
  },
  {
    id: 'foreign-language-learning',
    name: 'Nauka języków obcych',
    description:
      'W Polsce nauka angielskiego czy niemieckiego stymuluje neuroplastyczność dwujęzyczną',
    example:
      'Po półrocznej intensywnie nauce włoskiego, osoby w wieku 50+ pokonały egzamin językowy',
    effectiveness: 'Dwukrotne zwiększenie gęstości białej istoty',
    polishContext:
      'Badania na polskich studentach wykazały trwałą przebudowę sieci neuronalnych'
  },
  {
    id: 'musical-training',
    name: 'Trening muzyczny',
    description:
      'Nauka gry na instrumentach prowadzi do reorganizacji ośrodków słuchowych',
    example:
      'Uczniowie szkół muzycznych w Polsce mają lepsze wyniki w matematyce i językach',
    effectiveness: '25% większe rozwinięcie kory słuchowej',
    polishContext: 'Kształcenie muzyczne w polskich szkołach zwiększa rezerwę poznawczą'
  },
  {
    id: 'meditation-integration',
    name: 'Coaching medytacyjny',
    description:
      'Praktyka uważności połączona z neurofeedback pomaga w zarządzaniu stresem',
    example:
      'Wsparcie dla polskich nauczycieli i lekarzy w redukcji wypalenia zawodowego',
    effectiveness: '30% zmniejszenie poziomu kortyzolu',
    polishContext: 'Adaptowane praktyki mindfulness dla polskiego kontekstu kulturowego'
  }
]

/**
 *
 */
export default function NeuroplasticityTab() {
  const [activeMechanism, setActiveMechanism] = useState('long-term-potentiation')
  const [activeExercise, setActiveExercise] = useState('cognitive-training')

  const currentMechanism = neuroplasticityMechanisms.find(
    (m) => m.id === activeMechanism
  )!
  const currentExercise = strengtheningExercises.find((e) => e.id === activeExercise)!

  return (
    <div className="space-y-6">
      {/* Neuroplasticity Introduction */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Brain className="mr-3 h-6 w-6 text-indigo-600" />
          Co to jest neuroplastyczność?
        </h3>
        <p className="mb-4 text-gray-600">
          Neuroplastyczność to zdolność mózgu do reorganizacji swoich struktur
          neuronalnych poprzez tworzenie nowych połączeń i wzmacnianie istniejących.
          Proces ten jest podstawą uczenia się, pamięć i adaptacji do nowych sytuacji.
        </p>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-indigo-800">
            <strong>Kluczowy wniosek:</strong> Mózg pozostaje plastyczny przez całe życie.
            Regularne stymulowanie neuronalne może prowadzić do trwałych zmian
            funkcjonalnych i strukturalnych.
          </p>
        </div>
      </div>

      {/* Mechanisms Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Zap className="mr-3 h-6 w-6 text-yellow-600" />
          Mechanizmy neuroplastyczności
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {neuroplasticityMechanisms.map((mechanism) => (
            <button
              key={mechanism.id}
              onClick={() => setActiveMechanism(mechanism.id)}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                activeMechanism === mechanism.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-2 flex items-center">
                {mechanism.icon}
                <h4 className="ml-2 font-semibold text-gray-900">{mechanism.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{mechanism.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h4 className="mb-3 font-semibold text-yellow-900">{currentMechanism.name}</h4>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium text-yellow-900">Mechanizmy molekularne:</span>
              <ul className="mt-1 space-y-1 text-xs text-yellow-800">
                {currentMechanism.mechanisms.map((mech, idx) => (
                  <li key={idx}>• {mech}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-yellow-900">Skala czasowa:</span>
              <p className="mt-1 text-xs text-yellow-800">{currentMechanism.timeScale}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengthening Exercises */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Dumbbell className="mr-3 h-6 w-6 text-green-600" />
          Ćwiczenia wzmacniające
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {strengtheningExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setActiveExercise(exercise.id)}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                activeExercise === exercise.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-2 flex items-center">
                {exercise.icon}
                <h4 className="ml-2 font-semibold text-gray-900">{exercise.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{exercise.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h4 className="mb-3 font-semibold text-green-900">{currentExercise.name}</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span className="font-medium text-green-900">Przykładowe ćwiczenia:</span>
              <ul className="mt-2 space-y-1 text-xs text-green-800">
                {currentExercise.exercises.map((ex, idx) => (
                  <li key={idx}>• {ex}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-green-900">Rekomendacje:</span>
              <div className="mt-2 text-xs text-green-800">
                <p>Czas trwania: {currentExercise.duration}</p>
                <p>Częstotliwość: {currentExercise.frequency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Polish Examples */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Activity className="mr-3 h-6 w-6 text-blue-600" />
          Polskie przykłady neuronauki
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {polishExamples.map((example, index) => (
            <ExpandableCard
              key={index}
              title={example.name}
              summary={example.description}
              details={`<strong>Przykład:</strong> ${example.example}<br><br>
                <strong>Skuteczność:</strong> ${example.effectiveness}<br><br>
                <strong>Kontekst polski:</strong> ${example.polishContext}`}
              icon="brain"
              variant="highlight"
            />
          ))}
        </div>
      </div>

      {/* Practical Applications */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Praktyczne zastosowania
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-semibold text-purple-900">
              Rehabilitacja neurologiczna
            </h4>
            <p className="mb-2 text-sm text-purple-800">
              Terapia skoncentrowana na zadaniach (CI Therapy) wykorzystuje zasady
              neuroplastyczności do odzyskiwania funkcji po udarach mózgu.
            </p>
            <p className="text-xs text-purple-700">
              <strong>Efektywność:</strong> 75-85% poprawa funkcji motorycznych
            </p>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <h4 className="mb-2 font-semibold text-orange-900"> Walka z depresją</h4>
            <p className="mb-2 text-sm text-orange-800">
              Terapia poznawczo-behawioralna (CBT) połączona z ćwiczeniami
              neuroplastycznymi prowadzi do trwałych zmian w obrębie hipokampa.
            </p>
            <p className="text-xs text-orange-700">
              <strong>Rezultaty:</strong> Zmniejszenie objawów o 60-70%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
