'use client'

import { ArrowLeft, Brain, Eye, Target, RotateCcw, Camera } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { supplementsDatabase } from '@/app/suplementy/data/supplements-database'
import Brain3D, {
  brainRegions,
  type BrainRegionData
} from '@/components/educational/Brain3D'
import ExpandableCard from '@/components/educational/ExpandableCard'
import InteractiveDiagram from '@/components/educational/InteractiveDiagram'
import QuizEngine from '@/components/educational/QuizEngine'

const quizQuestions = [
  {
    id: '1',
    question:
      'Który płat mózgu jest odpowiedzialny za przetwarzanie informacji wzrokowych?',
    options: ['Płat czołowy', 'Płat skroniowy', 'Płat potyliczny', 'Płat ciemieniowy'],
    correctAnswer: 2,
    explanation:
      'Płat potyliczny to główny ośrodek przetwarzania informacji wzrokowych w mózgu.'
  },
  {
    id: '2',
    question: 'Która struktura mózgu jest krytyczna dla tworzenia nowych wspomnień?',
    options: ['Ciało migdałowate', 'Hipokamp', 'Prążkowie', 'Móżdżek'],
    correctAnswer: 1,
    explanation: 'Hipokamp odgrywa kluczową rolę w konsolidacji nowych wspomnień.'
  },
  {
    id: '3',
    question: 'Który płat odpowiada za funkcje wykonawcze i planowanie?',
    options: ['Płat potyliczny', 'Płat czołowy', 'Płat skroniowy', 'Płat ciemieniowy'],
    correctAnswer: 1,
    explanation:
      'Płat czołowy kontroluje funkcje wykonawcze, planowanie i kontrolę impulsów.'
  }
]

/**
 *
 */
export default function MozgAnatomiaPage() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegionData | null>(null)
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [arMode, setArMode] = useState(false)

  const handleRegionClick = (region: BrainRegionData) => {
    setSelectedRegion(region)
  }

  const regionSupplements = useMemo(() => {
    if (!selectedRegion) return [] as typeof supplementsDatabase
    const map: Record<string, string[]> = {
      frontal: ['quercetin-95-sophora-japonica'],
      temporal: ['dha-extract-20-vegetarian'],
      occipital: ['dha-extract-20-vegetarian'],
      parietal: ['angelica-astragalus-synergy'],
      hippocampus: ['european-ginseng-codonopsis'],
      amygdala: ['dmpea-extract-99-eria-jarensis']
    }
    const ids = map[selectedRegion.id] ?? []
    return supplementsDatabase.filter((s) => ids.includes(s.id))
  }, [selectedRegion])

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
          <h1 className="mb-2 flex items-center text-4xl font-bold text-gray-900">
            <Brain className="mr-4 h-10 w-10 text-indigo-600" />
            Anatomia Mózgu
          </h1>
          <p className="text-lg text-gray-600">
            Interaktywna podróż przez struktury i funkcje mózgu ludzkiego
          </p>
        </div>

        {/* Interactive Brain Map */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-semibold text-gray-900">
              <Eye className="mr-3 h-6 w-6 text-indigo-600" />
              Interaktywna mapa mózgu
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  viewMode === '3d'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={viewMode === '3d'}
              >
                <RotateCcw className="mr-1 inline h-4 w-4" />
                <span className="hidden sm:inline">Widok 3D</span>
                <span className="sm:hidden">3D</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  viewMode === '2d'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={viewMode === '2d'}
              >
                <span className="hidden sm:inline">Widok 2D</span>
                <span className="sm:hidden">2D</span>
              </button>
              <button
                onClick={() => setArMode((v) => !v)}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  arMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={arMode}
              >
                <Camera className="mr-1 h-4 w-4" />
                <span>AR</span>
              </button>
            </div>
          </div>

          {viewMode === '3d' ? (
            <Brain3D
              selectedRegion={selectedRegion}
              onRegionClick={handleRegionClick}
              arMode={arMode}
              animateRegionId={selectedRegion?.id ?? null}
            />
          ) : (
            <InteractiveDiagram
              regions={brainRegions.map((region) => ({
                id: region.id,
                name: region.name,
                description: region.description,
                color: region.color,
                position: { top: '50%', left: '50%' } // Fallback position
              }))}
              onRegionClick={(region: any) =>
                handleRegionClick(region as BrainRegionData)
              }
            />
          )}

          {/* Keyboard-accessible region navigator */}
          <div
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
            role="list"
            aria-label="Regiony mózgu"
          >
            {brainRegions.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRegionClick(r)}
                className={`rounded border px-3 py-2 text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  selectedRegion?.id === r.id
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                }`}
                role="listitem"
                aria-pressed={selectedRegion?.id === r.id}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Region Details with supplement links */}
        {selectedRegion && (
          <div className="mb-8 rounded-lg border-l-4 border-indigo-500 bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {selectedRegion.name}
            </h3>
            <p className="mb-4 text-gray-700">{selectedRegion.description}</p>
            {regionSupplements.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Powiązane suplementy</h4>
                <ul className="list-disc pl-5 text-gray-800">
                  {regionSupplements.map((s) => (
                    <li key={s.id} className="mb-1">
                      <Link
                        href={`/suplementy#${s.id}`}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {s.polishName} <span className="text-gray-500">({s.name})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Brain Function Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ExpandableCard
            title="Funkcje poznawcze"
            summary="Myślenie, pamięć i uczenie się"
            details="Płat czołowy zarządza funkcjami wykonawczymi, hippocampus tworzy nowe wspomnienia, a płat skroniowy przetwarza informacje słuchowe i językowe."
            icon="brain"
            variant="highlight"
          />
          <ExpandableCard
            title="Przetwarzanie sensoryczne"
            summary="Odczuwanie i interpretacja bodźców"
            details="Płat potyliczny przetwarza informacje wzrokowe, płat ciemieniowy integruje dane dotykowe i przestrzenne."
            icon="brain"
          />
          <ExpandableCard
            title="Regulacja emocjonalna"
            summary="Nastrój i reakcje emocjonalne"
            details="Ciała migdałowate przetwarzają emocje, zwłaszcza strach, a płat czołowy pomaga w kontroli impulsów i decyzji."
            icon="brain"
          />
        </div>

        {/* Quiz Section */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-900">
            <Target className="mr-3 h-6 w-6 text-green-600" />
            Quiz anatomii mózgu
          </h2>
          <QuizEngine
            questions={quizQuestions}
            title="Sprawdź swoją wiedzę na temat anatomii mózgu"
          />
        </div>
      </div>
    </div>
  )
}
