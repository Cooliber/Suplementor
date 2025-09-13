'use client'

import { Activity, Brain, Eye, Zap, Waves } from 'lucide-react'
import { useState } from 'react'

import ExpandableCard from '@/components/educational/ExpandableCard'

const brainWaves = [
  {
    id: 'delta',
    name: 'Fale Delta (0.5-4 Hz)',
    frequency: '0.5 - 4 Hz',
    state: 'Sen głęboki, bezświadomość',
    characteristics: 'Najwolniejsze fale, związane z regeneracją i głębokim odpoczynkiem',
    icon: <Waves className="h-5 w-5" />,
    horizontalLine: 'Denny trójkąt',
    applications: [
      'Leczenie bezsenności',
      'Redukcja stresu',
      'Wspomaganie rekonwalescencji'
    ]
  },
  {
    id: 'theta',
    name: 'Fale Theta (4-8 Hz)',
    frequency: '4 - 8 Hz',
    state: 'Sen lekki, głęboka relaksacja',
    characteristics: 'Fale kreatywności, intuicji i głębokiego relaksu',
    icon: <Activity className="h-5 w-5" />,
    horizontalLine: 'Lewy kompleks skroniowy',
    applications: ['Medytacja głęboka', 'Hipnoza', 'Terapia behawioralna', 'Kreatywność']
  },
  {
    id: 'alpha',
    name: 'Fale Alfa (8-13 Hz)',
    frequency: '8 - 13 Hz',
    state: 'Relaksacja, medytacja',
    characteristics: 'Stan spokoju i wewnętrznego skupienia',
    icon: <Eye className="h-5 w-5" />,
    horizontalLine: 'Cała kora mózgowa',
    applications: ['Medytacja mindfulness', 'Joga', 'Wizualizacja', 'Redukcja lęku']
  },
  {
    id: 'beta',
    name: 'Fale Beta (13-30 Hz)',
    frequency: '13 - 30 Hz',
    state: 'Aktywność intelektualna',
    characteristics: 'Stan koncentracji, rozwiązywania problemów',
    icon: <Zap className="h-5 w-5" />,
    horizontalLine: 'Płat czołowy i ciemieniowy',
    applications: ['Nauka', 'Rozwiązywanie problemów', 'Sport wyczynowy']
  }
]

const meditationTechniques = [
  {
    id: 'mindfulness-meditation',
    name: 'Medytacja uważności (Mindfulness)',
    duration: '10-20 minut dziennie',
    technique: 'Obserwacja oddechu, skupienie na chwili obecnej',
    waves: 'Alfa → Theta',
    benefits: 'Redukcja stresu, poprawa koncentracji, zmniejszenie lęku',
    polishContext: 'Szeroko praktykowana w polskich ośrodkach mindfulness i terapeutyce'
  },
  {
    id: 'transcendental-meditation',
    name: 'Medytacja transcendentalna',
    duration: '15-20 minut dwa razy dziennie',
    technique: 'Powtarzanie mantry bez wysiłku',
    waves: 'Alfa → Theta → Delta',
    benefits: 'Głęboka relaksacja, zwiększona kreatywność, poprawa zdrowia psychicznego',
    polishContext:
      'Badania na Uniwersytecie Jagiellońskim potwierdzają efektywność w redukcji PTSD'
  },
  {
    id: 'vipassana-meditation',
    name: 'Medytacja Vipassana',
    duration: '30-60 minut dziennie (codziennie na wyjeździe)',
    technique: 'Obserwacja ciała i umysłu bez reakcji',
    waves: 'Theta → Delta',
    benefits: 'Rozwój świadomości, wyzwolenie emocjonalne, regulacja emocji',
    polishContext: 'Prowadzone przez polskich nauczycieli w ośrodkach w Polsce'
  },
  {
    id: 'neurofeedback-training',
    name: 'Trening neurofeedback',
    duration: '30-45 minut, 20-40 sesji',
    technique: 'Nauka aktywnego wpływu na własne fale mózgowe',
    waves: 'Wszystkie zakresy',
    benefits: 'Terapia ADHD, lęków, problemów ze snem',
    polishContext:
      'Dostępne w polskich klinikach neurologicznych i ośrodkach zdrowia psychicznego'
  }
]

const practicalApplications = [
  {
    id: 'therapy-adhd',
    name: 'Terapia ADHD',
    problem: 'Nadmiar fal beta, trudności z koncentracją',
    approach: 'Neurofeedback trening zwiększający fale theta',
    effectiveness: '70-80% poprawa objawów',
    polishData:
      'Badania kliniczne w Gdańsku potwierdziły skuteczność u dzieci polskich szkół'
  },
  {
    id: 'stress-management',
    name: 'Zarządzanie stresem',
    problem: 'Przewaga fal beta, chroniczne napięcie',
    approach: 'Medytacja alfa i techniki HRV',
    effectiveness: 'Redukcja kortyzolu o 30-50%',
    polishData: 'Stosowane w polskich korporacjach do prewencji wypalenia zawodowego'
  },
  {
    id: 'sleep-disorders',
    name: 'Zaburzenia snu',
    problem: 'Niski poziom fal delta i theta',
    approach: 'Medytacja głeboka i trening snu',
    effectiveness: '80% poprawa jakości snu',
    polishData:
      'Ośrodki w Warszawie specjalizują się w tej terapii dla polskiej populacji'
  },
  {
    id: 'peak-performance',
    name: 'Maksymalna wydajność',
    problem: 'Optymalizacja stanów uwagi i koncentracji',
    approach: 'Trening biofeedback sportowy',
    effectiveness: '15-25% poprawa wyników',
    polishData: 'Stosowane przez polskich sportowców wyczynowych i olimpijczyków'
  }
]

/**
 *
 */
export default function BrainWavesTab() {
  const [activeWave, setActiveWave] = useState('alpha')
  const currentWave = brainWaves.find((w) => w.id === activeWave)!

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Brain className="mr-3 h-6 w-6 text-indigo-600" />
          Fale mózgowe i stany świadomości
        </h3>
        <p className="mb-4 text-gray-600">
          Fale mózgowe to rytmiczne wzorce aktywności elektrycznej neuronów, mierzone
          przez EEG. Każdy wzorzec odpowiada innemu stanowi świadomości i funkcji
          poznawczych.
        </p>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-indigo-800">
            <strong>Kluczowe założenia:</strong> Aktywne treningi mózgowe mogą zmieniać
            dominujące wzorce fal, prowadząc do trwałej poprawy funkcji poznawczych.
          </p>
        </div>
      </div>

      {/* Brain Waves Overview */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Waves className="mr-3 h-6 w-6 text-purple-600" />
          Zakresy częstotliwości
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {brainWaves.map((wave) => (
            <button
              key={wave.id}
              onClick={() => setActiveWave(wave.id)}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                activeWave === wave.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-2 flex items-center">
                {wave.icon}
                <h4 className="ml-2 font-semibold text-gray-900">{wave.name}</h4>
              </div>
              <p className="mb-2 text-sm text-gray-600">{wave.state}</p>
              <p className="text-xs text-gray-500">{wave.characteristics}</p>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h4 className="mb-3 font-semibold text-purple-900">{currentWave.name}</h4>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium text-purple-900">Częstotliwość:</span>
              <p className="mt-1 text-purple-800">{currentWave.frequency}</p>
            </div>
            <div>
              <span className="font-medium text-purple-900">Lokalizacja:</span>
              <p className="mt-1 text-purple-800">{currentWave.horizontalLine}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-purple-900">Zastosowania:</span>
            <ul className="mt-1 space-y-1 text-xs text-purple-800">
              {currentWave.applications.map((app, idx) => (
                <li key={idx}>• {app}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Meditation Techniques */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Eye className="mr-3 h-6 w-6 text-green-600" />
          Techniki medytacji i treningu mózgowego
        </h3>

        <div className="space-y-4">
          {meditationTechniques.map((technique, index) => (
            <ExpandableCard
              key={index}
              title={technique.name}
              summary={`Czas trwania: ${technique.duration} | Fale: ${technique.waves}`}
              details={`<strong>Technika:</strong> ${technique.technique}<br><br>
                <strong>Korzyści:</strong> ${technique.benefits}<br><br>
                <strong>Kontekst polski:</strong> ${technique.polishContext}`}
              icon="brain"
              variant="highlight"
            />
          ))}
        </div>
      </div>

      {/* Practical Applications */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
          <Zap className="mr-3 h-6 w-6 text-orange-600" />
          Praktyczne zastosowania kliniczne
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {practicalApplications.map((application, index) => (
            <ExpandableCard
              key={index}
              title={application.name}
              summary={application.problem}
              details={`<strong>Podejście:</strong> ${application.approach}<br><br>
                <strong>Skuteczność:</strong> ${application.effectiveness}<br><br>
                <strong>Polskie dane:</strong> ${application.polishData}`}
              icon="brain"
            />
          ))}
        </div>
      </div>

      {/* Biofeedback Technology */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Technologia biofeedback
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">Neurofeedback</h4>
            <p className="mb-2 text-sm text-blue-800">
              Trening mózgu przy pomocy czujników EEG, zwiększający kontrolę nad wzorcami
              fal mózgowych.
            </p>
            <p className="text-xs text-blue-700">
              <strong>Zasada:</strong> Wzmacnianie pożądanych wzorców poprzez nagrodę
              dźwiękową/wizualną
            </p>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
            <h4 className="mb-2 font-semibold text-teal-900">HRV Training</h4>
            <p className="mb-2 text-sm text-teal-800">
              Trening zmienności rytmu serca (HRV) wpływający na współczulny układ
              nerwowy.
            </p>
            <p className="text-xs text-teal-700">
              <strong>Zasada:</strong> Synchronizacja oddechu z wzorcami biologicznymi dla
              optymalnej regulacji
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
          <h4 className="mb-3 font-semibold text-indigo-900">
            Polskie ośrodki specjalizujące się w treningach mózgowych
          </h4>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="text-indigo-800">
              <p>
                <strong>Gdańsk:</strong> Ośrodek Terapii Biofeedback (ADHD, lęki)
              </p>
              <p>
                <strong>Kraków:</strong> Centrum Medytacji i Neuroplastyczności
              </p>
            </div>
            <div className="text-indigo-800">
              <p>
                <strong>Warszawa:</strong> Klinika Neuromodulacji Poznawczej
              </p>
              <p>
                <strong>Wrocław:</strong> Ośrodek Treningów Mózgowych
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
