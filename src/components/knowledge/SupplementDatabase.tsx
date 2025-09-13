'use client'

import {
  Search,
  AlertTriangle,
  Clock,
  Zap,
  Brain,
  Heart,
  Shield,
  Info
} from 'lucide-react'
import { useState, useMemo } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Supplement {
  id: string
  name: string
  category:
    | 'nootropic'
    | 'adaptogen'
    | 'vitamin'
    | 'mineral'
    | 'amino-acid'
    | 'herb'
    | 'other'
  primaryEffects: string[]
  dosage: {
    min: number
    max: number
    optimal: number
    unit: string
    frequency: string
  }
  timing: {
    bestTime: string
    withFood: boolean
    avoidWith: string[]
  }
  interactions: {
    positive: string[]
    negative: string[]
    contraindications: string[]
  }
  sideEffects: {
    common: string[]
    rare: string[]
    serious: string[]
  }
  evidenceLevel: 'high' | 'medium' | 'low'
  halfLife: string
  onsetTime: string
  duration: string
  bioavailability: string
  mechanism: string
  sources: string[]
  cost: 'low' | 'medium' | 'high'
  rating: number
}

const supplementDatabase: Supplement[] = [
  {
    id: 'omega-3',
    name: 'Omega-3 (EPA/DHA)',
    category: 'other',
    primaryEffects: ['Neuroprotekcja', 'Pamięć', 'Nastrój', 'Koncentracja'],
    dosage: {
      min: 500,
      max: 3000,
      optimal: 1500,
      unit: 'mg',
      frequency: 'dziennie'
    },
    timing: {
      bestTime: 'z posiłkiem',
      withFood: true,
      avoidWith: ['antykoagulanty w wysokich dawkach']
    },
    interactions: {
      positive: ['Witamina D3', 'Kurkumina', 'Astaksantyna'],
      negative: ['Wysokie dawki witaminy E'],
      contraindications: ['Zaburzenia krzepnięcia', 'Przed operacjami']
    },
    sideEffects: {
      common: ['Odbijanie rybne', 'Luźne stolce'],
      rare: ['Nudności', 'Bóle głowy'],
      serious: ['Zwiększone krwawienie (wysokie dawki)']
    },
    evidenceLevel: 'high',
    halfLife: '2-3 dni',
    onsetTime: '2-4 tygodnie',
    duration: '4-8 tygodni po odstawieniu',
    bioavailability: '95% z posiłkiem tłuszczowym',
    mechanism: 'Integralność błon neuronalnych, synteza prostaglandyn, neuroplastyczność',
    sources: ['Ryby głębinowe', 'Olej z krylu', 'Algi morskie'],
    cost: 'medium',
    rating: 4.8
  },
  {
    id: 'lions-mane',
    name: "Lion's Mane (Hericium erinaceus)",
    category: 'nootropic',
    primaryEffects: ['Neurogeneza', 'NGF', 'Pamięć', 'Koncentracja'],
    dosage: {
      min: 300,
      max: 1500,
      optimal: 750,
      unit: 'mg',
      frequency: 'dziennie'
    },
    timing: {
      bestTime: 'rano z posiłkiem',
      withFood: true,
      avoidWith: []
    },
    interactions: {
      positive: ['Omega-3', 'Bacopa monnieri', 'Ginkgo biloba'],
      negative: [],
      contraindications: ['Alergia na grzyby', 'Autoimmunologiczne']
    },
    sideEffects: {
      common: ['Łagodne problemy żołądkowe'],
      rare: ['Wysypka skórna', 'Zawroty głowy'],
      serious: ['Reakcje alergiczne']
    },
    evidenceLevel: 'high',
    halfLife: '6-8 godzin',
    onsetTime: '2-4 tygodnie',
    duration: '2-4 tygodnie po odstawieniu',
    bioavailability: '85% z posiłkiem',
    mechanism: 'Stymulacja NGF, mielinizacja, neurogeneza w hipokampie',
    sources: ['Ekstrakt grzyba', 'Proszek całego grzyba'],
    cost: 'medium',
    rating: 4.6
  },
  {
    id: 'magnesium-glycinate',
    name: 'Magnez glicynian',
    category: 'mineral',
    primaryEffects: ['Sen', 'Relaksacja', 'Funkcje NMDA', 'Stres'],
    dosage: {
      min: 200,
      max: 600,
      optimal: 400,
      unit: 'mg',
      frequency: 'wieczorem'
    },
    timing: {
      bestTime: '2h przed snem',
      withFood: false,
      avoidWith: ['Antybiotyki tetracyklinowe', 'Bisfosfonaty']
    },
    interactions: {
      positive: ['Witamina D3', 'Witamina B6', 'Tauryna'],
      negative: ['Cynk (w tym samym czasie)', 'Wapń (wysokie dawki)'],
      contraindications: ['Niewydolność nerek', 'Blok serca']
    },
    sideEffects: {
      common: ['Luźne stolce (wysokie dawki)'],
      rare: ['Nudności', 'Senność'],
      serious: ['Hipermagnezemia (bardzo rzadko)']
    },
    evidenceLevel: 'high',
    halfLife: '12-24 godziny',
    onsetTime: '30-60 minut',
    duration: '6-8 godzin',
    bioavailability: '80-90% (forma glicynian)',
    mechanism:
      'Antagonista receptorów NMDA, kofaktor 300+ enzymów, regulacja kanałów wapniowych',
    sources: ['Glicynian magnezu', 'Taurynian magnezu', 'Maleintan magnezu'],
    cost: 'low',
    rating: 4.7
  },
  {
    id: 'rhodiola-rosea',
    name: 'Rhodiola rosea',
    category: 'adaptogen',
    primaryEffects: ['Adaptogen', 'Stres', 'Energia', 'Nastrój'],
    dosage: {
      min: 200,
      max: 600,
      optimal: 400,
      unit: 'mg',
      frequency: 'rano na czczo'
    },
    timing: {
      bestTime: 'rano na czczo',
      withFood: false,
      avoidWith: ['Wieczorem (może zakłócać sen)']
    },
    interactions: {
      positive: ['Ashwagandha', 'Koenzym Q10', 'B-kompleks'],
      negative: ['Leki przeciwdepresyjne (ostrożnie)', 'Stymulatory'],
      contraindications: ['Zaburzenia dwubiegunowe', 'Ciąża']
    },
    sideEffects: {
      common: ['Pobudzenie', 'Bezsenność (jeśli wieczorem)'],
      rare: ['Zawroty głowy', 'Suchość w ustach'],
      serious: ['Nadmierne pobudzenie']
    },
    evidenceLevel: 'high',
    halfLife: '4-6 godzin',
    onsetTime: '30-60 minut',
    duration: '4-8 godzin',
    bioavailability: '70-85% na czczo',
    mechanism: 'Modulacja osi HPA, inhibicja MAO-A/B, zwiększenie BDNF',
    sources: ['Ekstrakt 3% rozawin + 1% salidrozyd'],
    cost: 'medium',
    rating: 4.5
  },
  {
    id: 'coq10-ubiquinol',
    name: 'Koenzym Q10 (Ubiquinol)',
    category: 'other',
    primaryEffects: ['Energia mitochondrialna', 'Antyoksydant', 'Serce', 'Mózg'],
    dosage: {
      min: 100,
      max: 400,
      optimal: 200,
      unit: 'mg',
      frequency: 'z posiłkiem tłuszczowym'
    },
    timing: {
      bestTime: 'z posiłkiem zawierającym tłuszcze',
      withFood: true,
      avoidWith: []
    },
    interactions: {
      positive: ['PQQ', 'Alpha-lipoic acid', 'Acetyl-L-carnitine'],
      negative: ['Warfaryna (może zmniejszać efekt)'],
      contraindications: ['Leczenie antykoagulantami (konsultacja)']
    },
    sideEffects: {
      common: ['Łagodne problemy żołądkowe'],
      rare: ['Bezsenność', 'Wysypka'],
      serious: ['Bardzo rzadkie']
    },
    evidenceLevel: 'high',
    halfLife: '33 godziny',
    onsetTime: '2-4 tygodnie',
    duration: '4-6 tygodni po odstawieniu',
    bioavailability: '90% (ubiquinol) vs 30% (ubiquinon)',
    mechanism: 'Transport elektronów w łańcuchu oddechowym, antyoksydant lipidowy',
    sources: ['Ubiquinol (forma aktywna)', 'Ubiquinon (forma utleniona)'],
    cost: 'high',
    rating: 4.4
  },
  {
    id: 'bacopa-monnieri',
    name: 'Bacopa monnieri',
    category: 'nootropic',
    primaryEffects: ['Pamięć', 'Uczenie się', 'Lęk', 'Koncentracja'],
    dosage: {
      min: 300,
      max: 900,
      optimal: 600,
      unit: 'mg',
      frequency: 'z posiłkiem'
    },
    timing: {
      bestTime: 'z posiłkiem (rano lub wieczorem)',
      withFood: true,
      avoidWith: []
    },
    interactions: {
      positive: ["Lion's Mane", 'Ginkgo biloba', 'Omega-3'],
      negative: ['Leki cholinergiczne (ostrożnie)'],
      contraindications: ['Zaburzenia tarczycy', 'Bradykardia']
    },
    sideEffects: {
      common: ['Nudności', 'Zmęczenie (początkowo)'],
      rare: ['Suchość w ustach', 'Problemy żołądkowe'],
      serious: ['Bardzo rzadkie']
    },
    evidenceLevel: 'high',
    halfLife: '6-8 godzin',
    onsetTime: '4-8 tygodni',
    duration: '2-4 tygodnie po odstawieniu',
    bioavailability: '85% z tłuszczami',
    mechanism: 'Modulacja acetylocholiny, neuroprotekcja, redukcja kortyzolu',
    sources: ['Ekstrakt 50% bakozydów A i B'],
    cost: 'medium',
    rating: 4.3
  }
]

/**
 *
 */
export default function SupplementDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)
  const [sortBy, setSortBy] = useState<string>('rating')

  const filteredSupplements = useMemo(() => {
    const filtered = supplementDatabase.filter((supplement) => {
      const matchesSearch =
        supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplement.primaryEffects.some((effect) =>
          effect.toLowerCase().includes(searchTerm.toLowerCase())
        )
      const matchesCategory =
        selectedCategory === 'all' || supplement.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort supplements
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'evidence': {
          const evidenceOrder = { high: 3, medium: 2, low: 1 }
          return evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel]
        }
        case 'cost': {
          const costOrder = { low: 1, medium: 2, high: 3 }
          return costOrder[a.cost] - costOrder[b.cost]
        }
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nootropic':
        return <Brain className="h-4 w-4" />
      case 'adaptogen':
        return <Shield className="h-4 w-4" />
      case 'vitamin':
        return <Zap className="h-4 w-4" />
      case 'mineral':
        return <Zap className="h-4 w-4" />
      case 'amino-acid':
        return <Zap className="h-4 w-4" />
      case 'herb':
        return <Shield className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getEvidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCostBadgeColor = (cost: string) => {
    switch (cost) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedSupplement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedSupplement(null)}>
            ← Powrót do listy
          </Button>
          <div className="flex items-center space-x-2">
            {getCategoryIcon(selectedSupplement.category)}
            <Badge className={getEvidenceBadgeColor(selectedSupplement.evidenceLevel)}>
              {selectedSupplement.evidenceLevel} evidence
            </Badge>
            <Badge className={getCostBadgeColor(selectedSupplement.cost)}>
              {selectedSupplement.cost} cost
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedSupplement.name}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-full ${
                      i < Math.floor(selectedSupplement.rating)
                        ? 'bg-yellow-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {selectedSupplement.rating}/5
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dosage" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dosage">Dawkowanie</TabsTrigger>
                <TabsTrigger value="effects">Efekty</TabsTrigger>
                <TabsTrigger value="interactions">Interakcje</TabsTrigger>
                <TabsTrigger value="safety">Bezpieczeństwo</TabsTrigger>
                <TabsTrigger value="science">Nauka</TabsTrigger>
              </TabsList>

              <TabsContent value="dosage" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Clock className="mr-2 h-5 w-5" />
                        Dawkowanie
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Minimalna:</span>
                        <span className="font-medium">
                          {selectedSupplement.dosage.min}
                          {selectedSupplement.dosage.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optymalna:</span>
                        <span className="font-medium text-green-600">
                          {selectedSupplement.dosage.optimal}
                          {selectedSupplement.dosage.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maksymalna:</span>
                        <span className="font-medium">
                          {selectedSupplement.dosage.max}
                          {selectedSupplement.dosage.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Częstotliwość:</span>
                        <span className="font-medium">
                          {selectedSupplement.dosage.frequency}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Clock className="mr-2 h-5 w-5" />
                        Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Najlepszy czas:</span>
                        <span className="font-medium">
                          {selectedSupplement.timing.bestTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Z jedzeniem:</span>
                        <span className="font-medium">
                          {selectedSupplement.timing.withFood ? 'Tak' : 'Nie'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Początek działania:</span>
                        <span className="font-medium">
                          {selectedSupplement.onsetTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Czas działania:</span>
                        <span className="font-medium">{selectedSupplement.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Główne efekty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplement.primaryEffects.map((effect, index) => (
                        <Badge key={index} variant="secondary">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mechanizm działania</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedSupplement.mechanism}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interactions" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">
                        Pozytywne synergie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.interactions.positive.map((item, index) => (
                          <li key={index} className="text-sm">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">
                        Negatywne interakcje
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.interactions.negative.map((item, index) => (
                          <li key={index} className="text-sm">
                            • {item}
                          </li>
                        ))}
                        {selectedSupplement.timing.avoidWith.map((item, index) => (
                          <li key={`avoid-${index}`} className="text-sm">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {selectedSupplement.interactions.contraindications.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Przeciwwskazania:</strong>{' '}
                      {selectedSupplement.interactions.contraindications.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-600">Częste</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.sideEffects.common.map((effect, index) => (
                          <li key={index} className="text-sm">
                            • {effect}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-600">Rzadkie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.sideEffects.rare.map((effect, index) => (
                          <li key={index} className="text-sm">
                            • {effect}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Poważne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.sideEffects.serious.map((effect, index) => (
                          <li key={index} className="text-sm">
                            • {effect}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="science" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Farmakokinetyka</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Biodostępność:</span>
                        <span className="font-medium">
                          {selectedSupplement.bioavailability}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Okres półtrwania:</span>
                        <span className="font-medium">{selectedSupplement.halfLife}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Źródła</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSupplement.sources.map((source, index) => (
                          <li key={index} className="text-sm">
                            • {source}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Szukaj suplementów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="nootropic">Nootropiki</SelectItem>
            <SelectItem value="adaptogen">Adaptogeny</SelectItem>
            <SelectItem value="vitamin">Witaminy</SelectItem>
            <SelectItem value="mineral">Minerały</SelectItem>
            <SelectItem value="amino-acid">Aminokwasy</SelectItem>
            <SelectItem value="herb">Zioła</SelectItem>
            <SelectItem value="other">Inne</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sortuj" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Ocena</SelectItem>
            <SelectItem value="name">Nazwa</SelectItem>
            <SelectItem value="evidence">Poziom dowodów</SelectItem>
            <SelectItem value="cost">Koszt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSupplements.map((supplement) => (
          <Card
            key={supplement.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => setSelectedSupplement(supplement)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(supplement.category)}
                  <span>{supplement.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 w-3 rounded-full ${
                        i < Math.floor(supplement.rating)
                          ? 'bg-yellow-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {supplement.primaryEffects.slice(0, 3).map((effect, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                  {supplement.primaryEffects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{supplement.primaryEffects.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getEvidenceBadgeColor(supplement.evidenceLevel)}>
                    {supplement.evidenceLevel}
                  </Badge>
                  <Badge className={getCostBadgeColor(supplement.cost)}>
                    {supplement.cost}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Dawka:</span>
                    <span>
                      {supplement.dosage.optimal}
                      {supplement.dosage.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Czas działania:</span>
                    <span>{supplement.onsetTime}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Zobacz szczegóły
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSupplements.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            Nie znaleziono suplementów spełniających kryteria wyszukiwania.
          </p>
        </div>
      )}
    </div>
  )
}
