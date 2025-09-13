'use client'

import {
  Search,
  Book,
  Brain,
  Beaker,
  TrendingUp,
  ExternalLink,
  Filter,
  Star
} from 'lucide-react'
import { useState, useMemo } from 'react'

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

interface KnowledgeItem {
  id: string
  title: string
  category: 'supplement' | 'mechanism' | 'research' | 'protocol'
  content: string
  tags: string[]
  evidenceLevel: 'high' | 'medium' | 'low'
  lastUpdated: string
  sources: {
    title: string
    url: string
    type: 'study' | 'review' | 'meta-analysis'
  }[]
  relatedItems: string[]
  rating: number
}

const knowledgeData: KnowledgeItem[] = [
  {
    id: 'omega-3-cognitive',
    title: 'Omega-3 i funkcje poznawcze',
    category: 'supplement',
    content: `Kwasy tłuszczowe Omega-3, szczególnie DHA (kwas dokozaheksaenowy), odgrywają kluczową rolę w funkcjonowaniu mózgu. DHA stanowi około 40% wielonienasyconych kwasów tłuszczowych w mózgu i jest niezbędny dla:

• **Integralność błon komórkowych** - DHA wpływa na płynność błon neuronalnych, co jest kluczowe dla transmisji sygnałów
• **Neuroplastyczność** - wspiera tworzenie nowych połączeń synaptycznych
• **Neurogenezę** - stymuluje powstawanie nowych neuronów w hipokampie
• **Redukcję stanu zapalnego** - działa przeciwzapalnie w mózgu

**Dawkowanie:** 1000-2000mg EPA+DHA dziennie, najlepiej z posiłkiem zawierającym tłuszcze.

**Synergię:** Działa synergistycznie z witaminą D3, magnezem i kurkuminą.`,
    tags: ['omega-3', 'DHA', 'EPA', 'neuroplastyczność', 'pamięć'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-15',
    sources: [
      {
        title: 'Omega-3 fatty acids and cognitive function: A systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example1',
        type: 'meta-analysis'
      },
      {
        title: 'DHA and brain development: Current evidence',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example2',
        type: 'review'
      }
    ],
    relatedItems: ['vitamin-d3-brain', 'magnesium-cognitive'],
    rating: 4.8
  },
  {
    id: 'lions-mane-neurogenesis',
    title: "Lion's Mane i neurogeneza",
    category: 'supplement',
    content: `Lion\'s Mane (Hericium erinaceus) zawiera unikalne związki - hericenony i erinacyny, które stymulują produkcję NGF (Nerve Growth Factor).

**Mechanizm działania:**
• **Stymulacja NGF** - zwiększa produkcję czynnika wzrostu nerwów o 20-60%
• **Mielinizacja** - wspiera regenerację osłonek mielinowych
• **Neurogeneza** - promuje powstawanie nowych neuronów
• **Ochrona neuronów** - działa neuroprotektywnie

**Efekty kliniczne:**
• Poprawa pamięci roboczej (15-25% w 8 tygodni)
• Zwiększenie koncentracji
• Wsparcie w łagodnych zaburzeniach poznawczych

**Dawkowanie:** 500-1000mg ekstraktu dziennie, najlepiej z posiłkiem.

**Czas działania:** Pierwsze efekty po 2-4 tygodniach, pełne korzyści po 8-12 tygodniach.`,
    tags: ['lions-mane', 'NGF', 'neurogeneza', 'pamięć', 'koncentracja'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-12',
    sources: [
      {
        title: 'Hericium erinaceus and cognitive function: Clinical trial',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example3',
        type: 'study'
      }
    ],
    relatedItems: ['bacopa-memory', 'rhodiola-adaptogen'],
    rating: 4.6
  },
  {
    id: 'circadian-optimization',
    title: 'Optymalizacja rytmu circadianowego',
    category: 'protocol',
    content: `Rytm circadianowy kontroluje około 40% procesów fizjologicznych, w tym produkcję hormonów, temperaturę ciała i funkcje poznawcze.

**Protokół optymalizacji:**

**Rano (6:00-9:00):**
• Ekspozycja na jasne światło (10,000 lux) przez 15-30 min
• Zimny prysznic (2-3 min, 15°C)
• Kofeina na czczo (100-200mg)
• Unikanie okularów przeciwsłonecznych

**Dzień (9:00-18:00):**
• Regularne posiłki co 4-5h
• Krótka drzemka (10-20 min) między 13:00-15:00
• Aktywność fizyczna przed 18:00

**Wieczór (18:00-22:00):**
• Ograniczenie niebieskiego światła
• Temperatura pokoju 18-20°C
• Magnez 200-400mg na 2h przed snem
• Unikanie kofeiny po 14:00

**Efekty:** Poprawa jakości snu o 30%, zwiększenie energii o 25%, lepsza koncentracja.`,
    tags: ['rytm-circadianowy', 'sen', 'energia', 'światłoterapia'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-10',
    sources: [
      {
        title: 'Circadian rhythm optimization and cognitive performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example4',
        type: 'review'
      }
    ],
    relatedItems: ['melatonin-sleep', 'magnesium-sleep'],
    rating: 4.9
  },
  {
    id: 'dopamine-motivation',
    title: 'System dopaminergiczny i motywacja',
    category: 'mechanism',
    content: `Dopamina jest kluczowym neuroprzekaźnikiem odpowiedzialnym za motywację, nagradzanie i uczenie się.

**Szlaki dopaminergiczne:**
• **Mezolimbiczny** - nagroda i motywacja
• **Mezokortykalny** - funkcje wykonawcze
• **Nigrostriatalny** - kontrola ruchu
• **Tuberohipofizarny** - regulacja hormonalna

**Naturalne sposoby zwiększenia dopaminy:**
• **Tyrozyna** - prekursor dopaminy (500-1000mg rano)
• **Ćwiczenia** - zwiększają dopaminę o 200-300%
• **Muzyka** - wzrost o 6-9%
• **Medytacja** - długoterminowy wzrost o 65%
• **Zimne kąpiele** - wzrost o 250% na 2-3h

**Suplementy wspierające:**
• L-DOPA (Mucuna pruriens): 100-500mg
• Rhodiola rosea: 200-400mg
• Ginkgo biloba: 120-240mg

**Uwaga:** Unikaj ciągłej stymulacji - dopamina potrzebuje okresów regeneracji.`,
    tags: ['dopamina', 'motywacja', 'tyrozyna', 'nagroda'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-08',
    sources: [
      {
        title: 'Dopaminergic pathways and cognitive function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example5',
        type: 'review'
      }
    ],
    relatedItems: ['rhodiola-adaptogen', 'tyrosine-focus'],
    rating: 4.7
  },
  {
    id: 'neuroplasticity-mechanisms',
    title: 'Mechanizmy neuroplastyczności',
    category: 'mechanism',
    content: `Neuroplastyczność to zdolność mózgu do reorganizacji strukturalnej i funkcjonalnej w odpowiedzi na doświadczenia.

**Typy neuroplastyczności:**
• **Plastyczność synaptyczna** - zmiany siły połączeń synaptycznych
• **Plastyczność strukturalna** - tworzenie nowych dendrytów i aksonów
• **Neurogeneza** - powstawanie nowych neuronów (głównie w hipokampie)
• **Plastyczność homeostyczna** - utrzymanie stabilności sieci neuronalnych

**Kluczowe mechanizmy molekularne:**
• **BDNF (Brain-Derived Neurotrophic Factor)** - główny czynnik wzrostu neuronów
• **CREB (cAMP Response Element-Binding)** - transkrypcja genów plastyczności
• **mTOR (mechanistic Target of Rapamycin)** - synteza białek synaptycznych
• **NMDA/AMPA receptory** - długoterminowa potencjacja (LTP)

**Czynniki zwiększające neuroplastyczność:**
• **Ćwiczenia aerobowe** - zwiększają BDNF o 200-300%
• **Nauka nowych umiejętności** - stymuluje tworzenie nowych połączeń
• **Medytacja mindfulness** - zwiększa grubość kory przedczołowej
• **Intermittent fasting** - aktywuje szlaki neuroprotekcyjne
• **Ekspozycja na zimno** - zwiększa noradrenalinę i BDNF

**Suplementy wspierające:**
• Lion's Mane: 500-1000mg (NGF, mielinizacja)
• Omega-3: 1000-2000mg (integralność błon)
• Magnez: 200-400mg (receptory NMDA)
• Kurkumina: 500-1000mg (neurogeneza)
• PQQ: 10-20mg (mitochondriogeneza)`,
    tags: ['neuroplastyczność', 'BDNF', 'LTP', 'neurogeneza', 'synaptogeneza'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-20',
    sources: [
      {
        title: 'Molecular mechanisms of synaptic plasticity and memory',
        url: 'https://pubmed.ncbi.nlm.nih.gov/neuroplasticity2024',
        type: 'review'
      },
      {
        title: 'BDNF and cognitive enhancement: Meta-analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/bdnf-meta2024',
        type: 'meta-analysis'
      }
    ],
    relatedItems: ['lions-mane-neurogenesis', 'omega-3-cognitive', 'exercise-cognition'],
    rating: 4.9
  },
  {
    id: 'mitochondrial-optimization',
    title: 'Optymalizacja funkcji mitochondrialnych',
    category: 'mechanism',
    content: `Mitochondria są "elektrowniami" komórek, szczególnie ważnymi dla energochłonnych neuronów.

**Funkcje mitochondrialne w mózgu:**
• **Produkcja ATP** - 95% energii neuronów
• **Regulacja Ca2+** - kontrola pobudliwości neuronów
• **Synteza neurotransmiterów** - wymagają koenzymów mitochondrialnych
• **Apoptoza** - kontrola śmierci komórek
• **Sygnalizacja redoks** - regulacja ekspresji genów

**Dysfunkcja mitochondrialna:**
• Zmniejszona produkcja ATP
• Zwiększony stres oksydacyjny
• Zaburzenia homeostazy wapniowej
• Przedwczesne starzenie neuronów

**Strategie optymalizacji:**

**1. Suplementacja:**
• **CoQ10** - 100-200mg (łańcuch oddechowy)
• **PQQ** - 10-20mg (biogeneza mitochondriów)
• **NAD+ prekursory** - NMN 250-500mg, NR 300-600mg
• **Alpha-lipoic acid** - 300-600mg (antyoksydant)
• **Acetyl-L-carnitine** - 500-1500mg (transport kwasów tłuszczowych)

**2. Interwencje żywieniowe:**
• **Ketoza** - alternatywne paliwo dla mózgu
• **Intermittent fasting** - aktywuje autofagię mitochondrialną
• **Ograniczenie kalorii** - zwiększa biogenezę mitochondriów

**3. Aktywność fizyczna:**
• **HIIT** - najsilniejszy stymulator biogenezy
• **Trening siłowy** - zwiększa gęstość mitochondriów
• **Cardio** - poprawia wydajność oddechową

**Biomarkery funkcji mitochondrialnej:**
• Stosunek ATP/ADP
• Aktywność cytochromu c oksydazy
• Poziom laktatów
• Variability tętna (HRV)`,
    tags: ['mitochondria', 'ATP', 'CoQ10', 'NAD+', 'biogeneza'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-18',
    sources: [
      {
        title: 'Mitochondrial function and cognitive performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/mito-cognition2024',
        type: 'review'
      },
      {
        title: 'NAD+ supplementation and brain aging',
        url: 'https://pubmed.ncbi.nlm.nih.gov/nad-brain2024',
        type: 'study'
      }
    ],
    relatedItems: ['coq10-energy', 'intermittent-fasting', 'exercise-cognition'],
    rating: 4.8
  },
  {
    id: 'stack-synergies',
    title: 'Synergie w stosach nootropowych',
    category: 'protocol',
    content: `Kombinowanie nootropów może zwiększyć ich efektywność przez synergistyczne działanie.

**Klasyczne synergie:**

**1. L-Theanine + Kofeina**
• Stosunek: 2:1 (200mg L-Theanine : 100mg kofeina)
• Efekt: Czujność bez nerwowości
• Mechanizm: L-Theanine blokuje negatywne efekty kofeiny

**2. Omega-3 + Kurkumina**
• Dawki: 1000mg EPA/DHA + 500mg kurkuminy
• Efekt: Zwiększona biodostępność i działanie przeciwzapalne
• Mechanizm: Kurkumina zwiększa absorpcję omega-3

**3. Magnez + Witamina D3**
• Dawki: 200-400mg Mg + 2000-4000 IU D3
• Efekt: Lepsza absorpcja i wykorzystanie obu składników
• Mechanizm: Magnez aktywuje witaminę D3

**4. Bacopa + Lion's Mane**
• Dawki: 300mg Bacopa + 500mg Lion's Mane
• Efekt: Kompleksowe wsparcie pamięci
• Mechanizm: Różne ścieżki neuroplastyczności

**Zasady kombinowania:**
• Rozpoczynaj od pojedynczych składników
• Dodawaj po jednym co 2 tygodnie
• Monitoruj efekty i interakcje
• Rób przerwy co 8-12 tygodni

**Przeciwwskazania:** Nie łączyć z inhibitorami MAO, ostrożnie z lekami na nadciśnienie.`,
    tags: ['synergie', 'stos', 'kombinacje', 'nootropy'],
    evidenceLevel: 'medium',
    lastUpdated: '2024-01-05',
    sources: [
      {
        title: 'Nootropic combinations and synergistic effects',
        url: 'https://pubmed.ncbi.nlm.nih.gov/example6',
        type: 'review'
      }
    ],
    relatedItems: ['l-theanine-caffeine', 'omega-3-cognitive'],
    rating: 4.5
  },
  {
    id: 'gut-brain-axis',
    title: 'Oś jelito-mózg i mikrobiom',
    category: 'mechanism',
    content: `Oś jelito-mózg to dwukierunkowa komunikacja między przewodem pokarmowym a ośrodkowym układem nerwowym.

**Mechanizmy komunikacji:**
• **Nerw błędny** - bezpośrednie połączenie neuronalne
• **Hormony jelitowe** - GLP-1, CCK, grelina
• **Metabolity bakteryjne** - SCFA, tryptofan, GABA
• **Cytokiny** - mediatory stanu zapalnego
• **Neurotransmitery** - 90% serotoniny produkowane w jelitach

**Wpływ mikrobiomu na mózg:**
• **Lactobacillus** - produkcja GABA, redukcja lęku
• **Bifidobacterium** - synteza witamin B, neuroprotekcja
• **Akkermansia** - integralność bariery jelitowej
• **Faecalibacterium** - produkcja maślanu, działanie przeciwzapalne

**Dysbioza i funkcje poznawcze:**
• Zwiększona przepuszczalność jelita ("leaky gut")
• Neuroinflammacja
• Zaburzenia produkcji neurotransmiterów
• Deficyty witamin B12, folianów, witaminy K2

**Optymalizacja mikrobiomu:**

**Probiotyki psychobiotyczne:**
• Lactobacillus helveticus R0052: 3 mld CFU
• Bifidobacterium longum R0175: 3 mld CFU
• Lactobacillus rhamnosus: 1-10 mld CFU

**Prebiotyki:**
• Inulina: 5-10g dziennie
• FOS (fruktooligosacharydy): 2-8g
• Resistant starch: 15-30g
• Arabinogalaktan: 4-8g

**Żywność fermentowana:**
• Kefir, kombucha, kimchi, sauerkraut
• Miso, tempeh, jogurt naturalny

**Suplementy wspierające:**
• L-glutamina: 5-15g (regeneracja jelita)
• Zinc carnosine: 75-150mg (bariera jelitowa)
• Butyrate: 300-600mg (paliwo dla kolonocytów)
• Quercetin: 500-1000mg (przeciwzapalny)`,
    tags: ['mikrobiom', 'jelito-mózg', 'probiotyki', 'serotonina', 'GABA'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-22',
    sources: [
      {
        title: 'Gut-brain axis and cognitive function: Systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/gut-brain2024',
        type: 'meta-analysis'
      },
      {
        title: 'Psychobiotics and mental health: Clinical evidence',
        url: 'https://pubmed.ncbi.nlm.nih.gov/psychobiotics2024',
        type: 'review'
      }
    ],
    relatedItems: ['serotonin-mood', 'inflammation-cognition', 'b-vitamins'],
    rating: 4.7
  },
  {
    id: 'chronobiology-optimization',
    title: 'Chronobiologia i optymalizacja rytmów',
    category: 'protocol',
    content: `Chronobiologia bada biologiczne rytmy i ich wpływ na fizjologię oraz funkcje poznawcze.

**Główne rytmy biologiczne:**
• **Rytm circadianowy** - 24-godzinny cykl sen-czuwanie
• **Rytm ultradianowy** - 90-120 min cykle uwagi
• **Rytm infradianowy** - tygodniowe/miesięczne cykle
• **Rytm sezonowy** - zmiany związane z długością dnia

**Molekularne zegary biologiczne:**
• **Clock genes** - CLOCK, BMAL1, PER, CRY
• **Suprachiasmatic nucleus (SCN)** - główny pacemaker
• **Peripheral clocks** - zegary w tkankach obwodowych
• **Melatonina** - hormon ciemności

**Chronotypy i optymalizacja:**

**Skowronki (25% populacji):**
• Szczyt wydajności: 6:00-12:00
• Optymalne czasy posiłków: 7:00, 12:00, 18:00
• Ćwiczenia: rano 6:00-8:00
• Sen: 21:00-5:00

**Sowy (25% populacji):**
• Szczyt wydajności: 14:00-22:00
• Optymalne czasy posiłków: 9:00, 14:00, 20:00
• Ćwiczenia: wieczorem 18:00-20:00
• Sen: 23:00-7:00

**Typ mieszany (50% populacji):**
• Elastyczne dostosowanie do harmonogramu
• Szczyt wydajności: 10:00-18:00

**Protokół synchronizacji rytmów:**

**Rano:**
• Światło 10,000 lux przez 30 min
• Temperatura 18-20°C
• Kofeina w ciągu 1h po przebudzeniu
• Białko 25-30g w pierwszym posiłku

**Dzień:**
• Regularne posiłki co 4-5h
• Krótkie przerwy co 90 min (rytm ultradianowy)
• Unikanie kofeiny po 14:00

**Wieczór:**
• Ograniczenie światła niebieskiego po zachodzie
• Temperatura pokoju 16-19°C
• Magnez 200-400mg na 2h przed snem
• Melatonina 0.5-3mg na 30 min przed snem

**Suplementy chronobiologiczne:**
• Melatonina: 0.5-3mg (regulacja rytmu)
• Magnez glicynian: 200-400mg (jakość snu)
• L-theanine: 100-200mg (relaksacja)
• Ashwagandha: 300-600mg (kortyzol)`,
    tags: ['chronobiologia', 'rytm-circadianowy', 'chronotyp', 'melatonina', 'sen'],
    evidenceLevel: 'high',
    lastUpdated: '2024-01-21',
    sources: [
      {
        title: 'Chronobiology and cognitive performance optimization',
        url: 'https://pubmed.ncbi.nlm.nih.gov/chronobio2024',
        type: 'review'
      },
      {
        title: 'Circadian rhythms and neuroplasticity',
        url: 'https://pubmed.ncbi.nlm.nih.gov/circadian-plasticity2024',
        type: 'study'
      }
    ],
    relatedItems: ['circadian-optimization', 'melatonin-sleep', 'light-therapy'],
    rating: 4.8
  }
]

/**
 *
 */
const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedEvidence, setSelectedEvidence] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')

  const filteredItems = useMemo(() => {
    let filtered = knowledgeData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Filter by evidence level
    if (selectedEvidence !== 'all') {
      filtered = filtered.filter((item) => item.evidenceLevel === selectedEvidence)
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, selectedEvidence, sortBy])

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supplement':
        return <Beaker className="h-4 w-4" />
      case 'mechanism':
        return <Brain className="h-4 w-4" />
      case 'research':
        return <Book className="h-4 w-4" />
      case 'protocol':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Book className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="mr-2 h-5 w-5 text-indigo-600" />
            Baza wiedzy nootropowej
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Szukaj w bazie wiedzy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kategorie</SelectItem>
                  <SelectItem value="supplement">Suplementy</SelectItem>
                  <SelectItem value="mechanism">Mechanizmy</SelectItem>
                  <SelectItem value="research">Badania</SelectItem>
                  <SelectItem value="protocol">Protokoły</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEvidence} onValueChange={setSelectedEvidence}>
                <SelectTrigger>
                  <SelectValue placeholder="Poziom dowodów" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie poziomy</SelectItem>
                  <SelectItem value="high">Wysokie dowody</SelectItem>
                  <SelectItem value="medium">Średnie dowody</SelectItem>
                  <SelectItem value="low">Niskie dowody</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sortuj według" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Ocena</SelectItem>
                  <SelectItem value="updated">Data aktualizacji</SelectItem>
                  <SelectItem value="title">Tytuł</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Znaleziono {filteredItems.length} artykułów
          </h3>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Zaawansowane filtry
          </Button>
        </div>

        {filteredItems.map((item) => (
          <Card key={item.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getCategoryIcon(item.category)}</div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                    <div className="mb-3 flex items-center space-x-2">
                      <Badge className={getEvidenceColor(item.evidenceLevel)}>
                        {item.evidenceLevel === 'high'
                          ? 'Wysokie dowody'
                          : item.evidenceLevel === 'medium'
                            ? 'Średnie dowody'
                            : 'Niskie dowody'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Aktualizacja:{' '}
                        {new Date(item.lastUpdated).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm mb-4 max-w-none">
                <div className="whitespace-pre-line text-gray-700">{item.content}</div>
              </div>

              {/* Sources */}
              {item.sources.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="mb-2 text-sm font-medium">Źródła naukowe:</h5>
                  <div className="space-y-1">
                    {item.sources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {source.title}
                        </a>
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default KnowledgeBase
