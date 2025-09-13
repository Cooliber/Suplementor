'use client'

import {
  Brain,
  Leaf,
  Heart,
  Zap,
  Shield,
  Search,
  ArrowLeft,
  Package,
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

interface Supplement {
  id: string
  name: string
  polishName: string
  category: string
  description: string
  benefits: string[]
  dosage: string
  timing: string
  price: string
  sklad: {
    activeIngredient: string
    concentration: string
    form: string
    additional: string[]
  }
  neuroEffects: string[]
  warnings: string[]
}

const supplements: Supplement[] = [
  {
    id: 'l-lysine-pharmalysine',
    name: 'L-lysine | PharmaLysineTM',
    polishName: 'L-lizyna | PharmaLysineTM',
    category: 'Aminokwasy',
    description:
      'Esencjalny aminokwas niezbędny do syntezy białek, wzrostu i regeneracji tkanek. Wspiera zdrowie kości, stawów i mięśni.',
    benefits: [
      'Wspiera zdrowie mięśni, kości i stawów',
      'Promuje syntezę kolagenu',
      'Wspomaga odporność',
      'Poprawia wchłanianie wapnia'
    ],
    dosage: '500-2000mg dziennie',
    timing: 'Na czczo lub między posiłkami',
    price: 'od 3,99 €',
    sklad: {
      activeIngredient: 'L-lizyna HCl',
      concentration: '99%',
      form: 'Proszek krystaliczny',
      additional: ['Wolny od dodatków', 'Wegetariański', 'Bez GMO']
    },
    neuroEffects: [
      'Wspomaga produkcję neuroprzekaźników',
      'Poprawia koncentrację i nastrój'
    ],
    warnings: [
      'Nie przekraczać zalecanej dawki',
      'Konsultacja z lekarzem w przypadku ciąży'
    ]
  },
  {
    id: 'dha-extract-20-vegetarian',
    name: 'DHA extract 20% | Vegetarian Omega-3',
    polishName: 'Ekstrakt DHA 20% | Wegetariański Omega-3',
    category: 'Kwasy tłuszczowe',
    description:
      'Docosahexaenoic acid (DHA) - główny składnik neuronów i mózgu. Wersja wegańska z alg.',
    benefits: [
      'Główny składnik neuronów i mózgu',
      'Wspiera zdrowie układu nerwowego',
      'Poprawia pamięć i funkcje poznawcze',
      'Wegańska formuła'
    ],
    dosage: '250-1000mg DHA dziennie',
    timing: 'Z posiłkiem zawierającym tłuszcz',
    price: 'od 7,49 €',
    sklad: {
      activeIngredient: 'DHA (kwas dokozaheksaenowy)',
      concentration: '20%',
      form: 'Olej z alg',
      additional: ['Wegetariański', 'Bez ryb', 'Czysty olej DHA']
    },
    neuroEffects: [
      'Budulec neuronów',
      'Poprawa plastyczności synaptycznej',
      'Wsparcie neurogenezy'
    ],
    warnings: ['Przechowywać w chłodnym miejscu', 'Chronić przed światłem']
  },
  {
    id: 'dmpea-extract-99-eria-jarensis',
    name: 'DMPEA extract 99% | Eria jarensis',
    polishName: 'Ekstrakt DMPEA 99% | Eria jarensis',
    category: 'Stymulanty',
    description:
      'Silny ekstrakt z Eria jarensis wspierający wydolność fizyczną i psychiczną. Zwiększa produkcję dopaminy.',
    benefits: [
      'Silne wsparcie dla wydolności fizycznej',
      'Zwiększa energię i motywację',
      'Poprawia nastrój',
      'Wspomaga koncentrację'
    ],
    dosage: '100-300mg dziennie',
    timing: 'Rano na czczo',
    price: 'od 11,49 €',
    sklad: {
      activeIngredient: 'N-dimetylofenetyloamina (DMPEA)',
      concentration: '99%',
      form: 'Proszek krystaliczny',
      additional: ['Wolny od dodatków', 'Czysta forma']
    },
    neuroEffects: [
      'Zwiększa poziom dopaminy',
      'Poprawia funkcje poznawcze',
      'Wspomaga nastrój'
    ],
    warnings: ['Nie stosować wieczorem', 'Może wpływać na sen', 'Konsultacja z lekarzem']
  },
  {
    id: 'huperzine-a-1-huperzia-serrata',
    name: 'Huperzine A 1% | Huperzia serrata',
    polishName: 'Huperzyna A 1% | Huperzia serrata',
    category: 'Nootropy',
    description:
      'Skuteczne wsparcie dla zdolności intelektualnych i neurogenezy. Inhibitor acetylocholinesterazy poprawiający pamięć.',
    benefits: [
      'Skuteczne wsparcie dla zdolności intelektualnych',
      'Wspomaga neurogenezę',
      'Poprawia pamięć i naukę',
      'Zwiększa poziom acetylocholiny'
    ],
    dosage: '50-200mcg dziennie',
    timing: 'Rano na czczo',
    price: 'od 13,99 €',
    sklad: {
      activeIngredient: 'Huperzyna A',
      concentration: '1%',
      form: 'Proszek',
      additional: ['Z Huperzia serrata', 'Standardyzowany ekstrakt']
    },
    neuroEffects: [
      'Inhibitor acetylocholinesterazy',
      'Zwiększa poziom acetylocholiny',
      'Poprawa pamięci długotrwałej',
      'Wspomaga procesy uczenia się'
    ],
    warnings: [
      'Nie stosować codziennie długotrwale',
      'Cykle 5 dni stosowania, 2 dni przerwy',
      'Konsultacja z lekarzem'
    ]
  },
  {
    id: 'magnesium-l-threonate',
    name: 'Magnesium | Magnesium L-threonate',
    polishName: 'Magnez | Magnez L-treonian',
    category: 'Minerały',
    description:
      'Skuteczne funkcjonowanie mózgu i mięśni. Wysoce biodostępna forma magnezu przekraczająca barierę krew-mózg.',
    benefits: [
      'Efektywne funkcjonowanie mózgu i mięśni',
      'Przekracza barierę krew-mózg',
      'Poprawia pamięć i nastrój',
      'Redukuje stres'
    ],
    dosage: '1000-2000mg dziennie',
    timing: 'Wieczorem przed snem',
    price: 'od 7,49 €',
    sklad: {
      activeIngredient: 'Magnez L-treonian',
      concentration: '100%',
      form: 'Proszek',
      additional: ['Wysoka biodostępność', 'Przekracza BBB']
    },
    neuroEffects: [
      'Przekracza barierę krew-mózg',
      'Wspomaga neuroplastyczność',
      'Poprawia pamięć i uczenie się',
      'Redukuje lęk i stres'
    ],
    warnings: [
      'Może wywołać efekt uspokajający',
      'Nie stosować przed prowadzeniem pojazdów'
    ]
  },
  {
    id: 'alpha-gpc-50',
    name: 'Alpha-GPC 50%',
    polishName: 'Alfa-GPC 50%',
    category: 'Cholina',
    description:
      'Źródło choliny o wysokiej biodostępności. Prekursor acetylocholiny wspierający pamięć i koncentrację.',
    benefits: [
      'Źródło choliny o wysokiej biodostępności',
      'Prekursor acetylocholiny',
      'Poprawia pamięć i koncentrację',
      'Wspomaga wydolność fizyczną'
    ],
    dosage: '250-600mg dziennie',
    timing: 'Rano lub przed treningiem',
    price: 'od 12,99 €',
    sklad: {
      activeIngredient: 'L-alfa-glicerylofosforylocholina',
      concentration: '50%',
      form: 'Proszek',
      additional: ['Wysoka biodostępność', 'Czysta forma']
    },
    neuroEffects: [
      'Zwiększa poziom acetylocholiny',
      'Poprawa pamięci roboczej',
      'Wspomaga koncentrację',
      'Neuroprotekcyjne działanie'
    ],
    warnings: ['Może wywołać bóle głowy u niektórych osób', 'Rozpocząć od niższej dawki']
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    polishName: 'L-teanina',
    category: 'Aminokwasy',
    description:
      'Aminokwas występujący naturalnie w herbacie. Promuje relaksację bez senności i poprawia koncentrację.',
    benefits: [
      'Promuje relaksację bez senności',
      'Poprawia koncentrację i skupienie',
      'Redukuje stres i lęk',
      'Wspomaga jakość snu'
    ],
    dosage: '100-400mg dziennie',
    timing: 'Rano lub przed snem',
    price: 'od 8,99 €',
    sklad: {
      activeIngredient: 'L-teanina',
      concentration: '99%',
      form: 'Proszek',
      additional: ['Naturalny ekstrakt', 'Bez dodatków']
    },
    neuroEffects: [
      'Zwiększa fale alfa w mózgu',
      'Promuje stan spokojnego skupienia',
      'Moduluje GABA i dopaminę',
      'Redukuje stres'
    ],
    warnings: ['Może wzmacniać działanie leków uspokajających', 'Konsultacja z lekarzem']
  },
  {
    id: 'rhodiola-rosea-3-rosavins',
    name: 'Rhodiola Rosea 3% Rosavins',
    polishName: 'Różeniec górski 3% rozawin',
    category: 'Adaptogeny',
    description:
      'Adaptogen wspierający odporność na stres. Poprawia wydolność fizyczną i psychiczną oraz redukuje zmęczenie.',
    benefits: [
      'Adaptogen wspierający odporność na stres',
      'Poprawia wydolność fizyczną i psychiczną',
      'Redukuje zmęczenie',
      'Poprawia nastrój'
    ],
    dosage: '200-600mg dziennie',
    timing: 'Rano na czczo',
    price: 'od 9,99 €',
    sklad: {
      activeIngredient: 'Ekstrakt z Rhodiola rosea',
      concentration: '3% rozawin, 1% salidrozydu',
      form: 'Proszek',
      additional: ['Standardyzowany ekstrakt', 'Root extract']
    },
    neuroEffects: [
      'Moduluje układ HPA',
      'Redukuje kortyzol',
      'Poprawia odporność na stres',
      'Neuroprotekcyjne działanie'
    ],
    warnings: ['Może wywołać pobudzenie u niektórych osób', 'Nie stosować przed snem']
  },
  {
    id: 'bacopa-monnieri-50-bacosides',
    name: 'Bacopa Monnieri 50% Bacosides',
    polishName: 'Bakopa drobnolistna 50% bakozydów',
    category: 'Nootropy',
    description:
      'Tradycyjny ajurwedyjski nootrop. Poprawia pamięć, uczenie się i funkcje poznawcze. Wspomaga zdrowie mózgu.',
    benefits: [
      'Tradycyjny nootrop z Ajurwedy',
      'Poprawia pamięć i uczenie się',
      'Wspomaga funkcje poznawcze',
      'Neuroprotekcyjne działanie'
    ],
    dosage: '300-600mg dziennie',
    timing: 'Z posiłkiem',
    price: 'od 11,99 €',
    sklad: {
      activeIngredient: 'Bakozydy A i B',
      concentration: '50%',
      form: 'Proszek',
      additional: ['Standardyzowany ekstrakt', 'Cała roślina']
    },
    neuroEffects: [
      'Zwiększa czynniki neurotroficzne',
      'Poprawa pamięci długotrwałej',
      'Wspomaga neuroplastyczność',
      'Antyoksydacyjne działanie'
    ],
    warnings: [
      'Wymaga długotrwałego stosowania (4-8 tygodni)',
      'Może powodować łagodne problemy żołądkowe'
    ]
  },
  {
    id: 'lion-mane-extract-20-1',
    name: "Lion's Mane extract 20:1 | Hericium erinaceus",
    polishName: 'Ekstrakt z grzyba lwa 20:1 | Hericium erinaceus',
    category: 'Grzyby lecznicze',
    description:
      'Grzyb nootropowy wspierający neurogenezę i regenerację nerwów. Promuje wzrost czynników neurotroficznych.',
    benefits: [
      'Wspiera neurogenezę i regenerację nerwów',
      'Promuje wzrost NGF',
      'Poprawia pamięć i koncentrację',
      'Neuroprotekcyjne działanie'
    ],
    dosage: '500-1000mg dziennie',
    timing: 'Rano z posiłkiem',
    price: 'od 14,99 €',
    sklad: {
      activeIngredient: 'Polisacharydy i hericenony',
      concentration: '20:1 ekstrakt',
      form: 'Proszek',
      additional: ['Cały owocnik', 'Standardyzowany ekstrakt']
    },
    neuroEffects: [
      'Stymuluje produkcję NGF',
      'Wspomaga neurogenezę',
      'Poprawa myelinyzacji',
      'Neuroregeneracyjne działanie'
    ],
    warnings: [
      'Może wywołać reakcje alergiczne u osób uczulonych na grzyby',
      'Konsultacja z lekarzem'
    ]
  },
  {
    id: 'n-acetyl-l-tyrosine',
    name: 'N-Acetyl L-Tyrosine',
    polishName: 'N-acetylo-L-tyrozyna',
    category: 'Aminokwasy',
    description:
      'Wysoko biodostępna forma tyrozyny. Prekursor dopaminy i noradrenaliny wspierający nastrój i koncentrację.',
    benefits: [
      'Wysoko biodostępna forma tyrozyny',
      'Prekursor dopaminy i noradrenaliny',
      'Poprawia nastrój i koncentrację',
      'Wspomaga odporność na stres'
    ],
    dosage: '350-700mg dziennie',
    timing: 'Na czczo lub przed stresem',
    price: 'od 12,99 €',
    sklad: {
      activeIngredient: 'N-acetylo-L-tyrozyna',
      concentration: '99%',
      form: 'Proszek krystaliczny',
      additional: ['Wysoka biodostępność', 'Przekracza BBB']
    },
    neuroEffects: [
      'Zwiększa dopaminę i noradrenalinę',
      'Poprawia koncentrację pod stresem',
      'Wspomaga funkcje wykonawcze',
      'Redukuje zmęczenie psychiczne'
    ],
    warnings: [
      'Może wchodzić w interakcje z lekami przeciwdepresyjnymi',
      'Unikać przy nadciśnieniu'
    ]
  },
  {
    id: 'ashwagandha-ksm-66',
    name: 'Ashwagandha KSM-66',
    polishName: 'Ashwagandha KSM-66',
    category: 'Adaptogeny',
    description:
      'Najbardziej badany ekstrakt ashwagandhy. Redukuje kortyzol, stres i poprawia jakość snu oraz witalność.',
    benefits: [
      'Najbardziej badany ekstrakt ashwagandhy',
      'Redukuje kortyzol i stres',
      'Poprawia jakość snu',
      'Zwiększa witalność i siłę'
    ],
    dosage: '300-600mg dziennie',
    timing: 'Wieczorem z posiłkiem',
    price: 'od 15,99 €',
    sklad: {
      activeIngredient: 'Withanolidy',
      concentration: 'KSM-66 5% withanolidów',
      form: 'Proszek lub kapsułki',
      additional: ['Ekstrakt korzenia', 'Standardyzowany KSM-66']
    },
    neuroEffects: [
      'Moduluje układ HPA',
      'Redukuje kortyzol',
      'Poprawia odporność na stres',
      'Neuroprotekcyjne działanie'
    ],
    warnings: ['Może nasilać działanie leków nasennych', 'Konsultacja z lekarzem']
  }
]

const categories = [
  'Wszystkie',
  'Nootropy',
  'Adaptogeny',
  'Aminokwasy',
  'Antyoksydanty',
  'Minerały',
  'Grzyby lecznicze',
  'Kwasy tłuszczowe',
  'Cholina',
  'Stymulanty'
]

const categoryColors: Record<string, string> = {
  Nootropy: 'bg-purple-100 text-purple-800',
  Adaptogeny: 'bg-green-100 text-green-800',
  Aminokwasy: 'bg-blue-100 text-blue-800',
  Antyoksydanty: 'bg-orange-100 text-orange-800',
  Minerały: 'bg-indigo-100 text-indigo-800',
  'Grzyby lecznicze': 'bg-amber-100 text-amber-800',
  'Kwasy tłuszczowe': 'bg-cyan-100 text-cyan-800',
  Cholina: 'bg-pink-100 text-pink-800',
  Stymulanty: 'bg-red-100 text-red-800'
}

/**
 *
 */
export default function SupplementsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)

  const filteredSupplements = useMemo(
    () =>
      supplements.filter((supplement) => {
        const matchesSearch =
          supplement.polishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplement.benefits.some((benefit) =>
            benefit.toLowerCase().includes(searchTerm.toLowerCase())
          )

        const matchesCategory =
          selectedCategory === 'Wszystkie' || supplement.category === selectedCategory

        return matchesSearch && matchesCategory
      }),
    [searchTerm, selectedCategory]
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nootropy':
        return <Brain className="h-4 w-4" />
      case 'Adaptogeny':
        return <Shield className="h-4 w-4" />
      case 'Aminokwasy':
        return <Leaf className="h-4 w-4" />
      case 'Minerały':
        return <Zap className="h-4 w-4" />
      case 'Grzyby lecznicze':
        return <Package className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
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
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Baza Suplementów</h1>
          <p className="text-lg text-gray-600">
            Kompletna baza suplementów z Swiss Herbal EU z dokładnym składem i wskazówkami
            stosowania
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Wyszukaj suplementy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Znaleziono {filteredSupplements.length} suplementów
          </p>
        </div>

        {/* Supplements Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSupplements.map((supplement) => (
            <Card
              key={supplement.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedSupplement(supplement)}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplement.polishName}</CardTitle>
                    <p className="text-muted-foreground text-sm">{supplement.name}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    {getCategoryIcon(supplement.category)}
                    <span className="ml-1">{supplement.category}</span>
                  </Badge>
                </div>

                <CardDescription className="mb-4 line-clamp-3">
                  {supplement.description}
                </CardDescription>

                <div className="mb-4 space-y-2">
                  <div className="text-muted-foreground flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{supplement.dosage}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center text-sm">
                    <Package className="mr-1 h-4 w-4" />
                    <span>{supplement.timing}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center text-sm">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>{supplement.price}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {supplement.benefits.slice(0, 3).map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                  {supplement.benefits.length > 3 && (
                    <span className="text-muted-foreground text-xs">
                      +{supplement.benefits.length - 3} więcej
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSupplements.length === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Brak wyników</h3>
            <p className="text-gray-600">
              Nie znaleziono suplementów spełniających kryteria wyszukiwania.
            </p>
          </div>
        )}
      </div>

      {/* Supplement Detail Modal */}
      {selectedSupplement && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSupplement.polishName}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedSupplement.name}</p>
                </div>
                <button
                  onClick={() => setSelectedSupplement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Opis</h3>
                  <p className="text-gray-600">{selectedSupplement.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Skład (Składniki aktywne)
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Składnik aktywny:</span>
                        <span>{selectedSupplement.sklad.activeIngredient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Koncentracja:</span>
                        <span>{selectedSupplement.sklad.concentration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Forma:</span>
                        <span>{selectedSupplement.sklad.form}</span>
                      </div>
                      {selectedSupplement.sklad.additional.length > 0 && (
                        <div>
                          <span className="font-medium">Dodatkowe informacje:</span>
                          <ul className="mt-1 text-sm text-gray-600">
                            {selectedSupplement.sklad.additional.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Zalecane dawkowanie
                    </h3>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="font-medium text-blue-900">
                        {selectedSupplement.dosage}
                      </p>
                      <p className="mt-1 text-sm text-blue-700">
                        {selectedSupplement.timing}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Cena</h3>
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="font-medium text-green-900">
                        {selectedSupplement.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Korzyści</h3>
                  <ul className="space-y-1">
                    {selectedSupplement.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Efekty neuroregulacyjne
                  </h3>
                  <ul className="space-y-1">
                    {selectedSupplement.neuroEffects.map((effect, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-purple-500">•</span>
                        <span className="text-gray-600">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Ostrzeżenia
                  </h3>
                  <ul className="space-y-1">
                    {selectedSupplement.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-red-500">⚠</span>
                        <span className="text-gray-600">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button
                    onClick={() => setSelectedSupplement(null)}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
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
  )
}
