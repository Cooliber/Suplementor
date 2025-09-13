'use client';

'use client'

import { 
  Brain, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Clock,
  Search,
  Filter,
  ChevronRight,
  Play,
  Award,
  Zap,
  Shield,
  Moon,
  GraduationCap,
  FileText
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import InteractiveLearning from './components/InteractiveLearning';
import ProtocolGuides from './components/ProtocolGuides';

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  difficulty: 'Podstawowy' | 'Średniozaawansowany' | 'Zaawansowany';
  readTime: string;
  description: string;
  content: string;
  tags: string[];
  relatedSupplements: string[];
  lastUpdated: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  difficulty: string;
  icon: React.ReactNode;
  progress?: number;
}

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'neurotransmitters-basics',
    title: 'Podstawy Neuroprzekaźników',
    category: 'Neurobiologia',
    difficulty: 'Podstawowy',
    readTime: '8 min',
    description: 'Poznaj kluczowe neuroprzekaźniki i ich wpływ na funkcje poznawcze.',
    content: `
# Podstawy Neuroprzekaźników

## Czym są neuroprzekaźniki?

Neuroprzekaźniki to chemiczne posłańcy, które umożliwiają komunikację między neuronami. Są kluczowe dla wszystkich funkcji mózgu, od podstawowych procesów życiowych po złożone funkcje poznawcze.

## Główne neuroprzekaźniki:

### 1. Dopamina
- **Funkcja**: Motywacja, nagroda, kontrola ruchu
- **Niedobór**: Depresja, brak motywacji, choroba Parkinsona
- **Nadmiar**: Psychoza, nadpobudliwość
- **Naturalne wsparcie**: L-tyrozyna, ćwiczenia, muzyka

### 2. Serotonina
- **Funkcja**: Nastrój, sen, apetyt, regulacja emocji
- **Niedobór**: Depresja, bezsenność, lęk
- **Wsparcie**: Tryptofan, światło słoneczne, medytacja

### 3. Acetylocholina
- **Funkcja**: Pamięć, uczenie się, uwaga
- **Niedobór**: Problemy z pamięcią, trudności z koncentracją
- **Wsparcie**: Alpha-GPC, jaja, ryby

### 4. GABA
- **Funkcja**: Hamowanie, relaksacja, sen
- **Niedobór**: Lęk, bezsenność, napięcie
- **Wsparcie**: L-teanina, magnez, joga

### 5. Noradrenalina
- **Funkcja**: Czujność, energia, reakcja na stres
- **Niedobór**: Zmęczenie, brak koncentracji
- **Wsparcie**: L-tyrozyna, ćwiczenia, zimne prysznice

## Równowaga neuroprzekaźników

Kluczem do optymalnego funkcjonowania mózgu jest równowaga między wszystkimi neuroprzekaźnikami. Suplementacja powinna być przemyślana i dostosowana do indywidualnych potrzeb.
    `,
    tags: ['neurobiologia', 'podstawy', 'neuroprzekaźniki'],
    relatedSupplements: ['l-tyrosine', 'alpha-gpc', 'l-theanine'],
    lastUpdated: '2025-01-05'
  },
  {
    id: 'neuroplasticity-guide',
    title: 'Neuroplastyczność i Optymalizacja Mózgu',
    category: 'Neurobiologia',
    difficulty: 'Średniozaawansowany',
    readTime: '12 min',
    description: 'Jak mózg się zmienia i jak możemy wspierać jego rozwój.',
    content: `
# Neuroplastyczność i Optymalizacja Mózgu

## Czym jest neuroplastyczność?

Neuroplastyczność to zdolność mózgu do reorganizacji i tworzenia nowych połączeń neuronalnych przez całe życie. To podstawa uczenia się, pamięci i regeneracji po urazach.

## Typy neuroplastyczności:

### 1. Plastyczność strukturalna
- Tworzenie nowych neuronów (neurogeneza)
- Rozrost dendrytów i aksonów
- Zmiany w gęstości synaps

### 2. Plastyczność funkcjonalna
- Zmiany w sile połączeń synaptycznych
- Reorganizacja map korowych
- Kompensacja uszkodzeń

## Czynniki wspierające neuroplastyczność:

### 1. Uczenie się
- Nowe umiejętności
- Języki obce
- Instrumenty muzyczne
- Gry strategiczne

### 2. Ćwiczenia fizyczne
- Zwiększają BDNF (czynnik neurotroficzny)
- Poprawiają przepływ krwi do mózgu
- Stymulują neurogenezę

### 3. Sen
- Konsolidacja pamięci
- Usuwanie toksyn
- Regeneracja neuronów

### 4. Medytacja
- Zwiększa grubość kory mózgowej
- Poprawia koncentrację
- Redukuje stres

### 5. Suplementacja
- **Magnez L-treonian**: Przekracza barierę krew-mózg
- **Lion's Mane**: Stymuluje NGF
- **Omega-3**: Wsparcie błon komórkowych
- **Kurkumina**: Właściwości neuroprotekcyjne

## Protokoły optymalizacji:

### Protokół dzienny:
1. **Rano**: Medytacja (10 min) + ćwiczenia (30 min)
2. **Dzień**: Nauka nowych rzeczy + suplementacja
3. **Wieczór**: Refleksja + przygotowanie do snu

### Protokół tygodniowy:
- 5x ćwiczenia aerobowe
- 2x trening siłowy
- Codziennie medytacja
- 2-3x nowe wyzwania poznawcze
    `,
    tags: ['neuroplastyczność', 'optymalizacja', 'BDNF'],
    relatedSupplements: ['magnesium-l-threonate', 'lions-mane', 'omega-3'],
    lastUpdated: '2025-01-05'
  },
  {
    id: 'circadian-rhythms',
    title: 'Rytmy Circadienne i Optymalizacja Snu',
    category: 'Chronobiologia',
    difficulty: 'Średniozaawansowany',
    readTime: '10 min',
    description: 'Jak synchronizować zegar biologiczny dla lepszego zdrowia.',
    content: `
# Rytmy Circadienne i Optymalizacja Snu

## Czym są rytmy circadienne?

Rytmy circadienne to wewnętrzne zegary biologiczne, które regulują cykle snu i czuwania, temperaturę ciała, produkcję hormonów i wiele innych funkcji fizjologicznych.

## Główny zegar biologiczny:

### Jądro nadskrzyżowaniowe (SCN)
- Lokalizacja: Podwzgórze
- Funkcja: Główny regulator rytmów
- Sygnały: Światło, temperatura, posiłki

## Hormony regulujące sen:

### 1. Melatonina
- **Produkcja**: Szyszynka
- **Funkcja**: Sygnał do snu
- **Szczyt**: 2-3 w nocy
- **Wsparcie**: Ciemność, magnez, L-teanina

### 2. Kortyzol
- **Funkcja**: Budzenie, energia
- **Szczyt**: 6-8 rano
- **Problem**: Chroniczny stres

### 3. Adenozyna
- **Funkcja**: "Presja snu"
- **Akumulacja**: Podczas czuwania
- **Blokada**: Kofeina

## Protokół optymalizacji snu:

### Rano (6-9):
- Ekspozycja na światło słoneczne (15-30 min)
- Ćwiczenia fizyczne
- Kofeina (jeśli potrzebna)
- Zimny prysznic

### Dzień (9-18):
- Regularne posiłki
- Aktywność fizyczna
- Ograniczenie kofeiny po 14:00

### Wieczór (18-22):
- Ograniczenie niebieskiego światła
- Relaksacja (medytacja, czytanie)
- Obniżenie temperatury
- Suplementacja (magnez, L-teanina)

### Noc (22-6):
- Ciemność (maski, zasłony)
- Cisza lub białe szumy
- Temperatura 18-20°C
- Unikanie ekranów

## Suplementy wspierające sen:

### 1. Magnez L-treonian
- **Dawka**: 1000-2000mg
- **Czas**: 1-2h przed snem
- **Mechanizm**: Relaksacja, GABA

### 2. L-teanina
- **Dawka**: 200-400mg
- **Czas**: Wieczorem
- **Mechanizm**: Fale alfa, relaksacja

### 3. Ashwagandha
- **Dawka**: 300-600mg
- **Czas**: Wieczorem
- **Mechanizm**: Redukcja kortyzolu

### 4. Glicynat magnezu
- **Dawka**: 200-400mg
- **Czas**: Przed snem
- **Mechanizm**: Relaksacja mięśni

## Troubleshooting problemów ze snem:

### Trudności z zasypianiem:
- Zbyt dużo światła wieczorem
- Stres/lęk
- Kofeina za późno
- **Rozwiązanie**: Rutyna wieczorna + magnez

### Częste budzenie się:
- Niestabilny poziom cukru
- Niedobór magnezu
- Stres
- **Rozwiązanie**: Stabilizacja glukozy + ashwagandha

### Wczesne budzenie:
- Nadmiar kortyzolu
- Niedobór melatoniny
- **Rozwiązanie**: Zarządzanie stresem + optymalizacja światła
    `,
    tags: ['sen', 'rytmy-circadienne', 'melatonina'],
    relatedSupplements: ['magnesium-l-threonate', 'l-theanine', 'ashwagandha'],
    lastUpdated: '2025-01-05'
  },
  {
    id: 'stress-response-system',
    title: 'System Odpowiedzi na Stres (HPA Axis)',
    category: 'Endokrynologia',
    difficulty: 'Zaawansowany',
    readTime: '15 min',
    description: 'Jak działa oś podwzgórze-przysadka-nadnercza i jak ją optymalizować.',
    content: `
# System Odpowiedzi na Stres (HPA Axis)

## Czym jest oś HPA?

Oś podwzgórze-przysadka-nadnercza (HPA axis) to główny system neuroendokrynny odpowiedzialny za reakcję na stres. Reguluje produkcję kortyzolu i innych hormonów stresowych.

## Komponenty osi HPA:

### 1. Podwzgórze (Hypothalamus)
- **Funkcja**: Wykrywanie stresu
- **Hormon**: CRH (Corticotropin-Releasing Hormone)
- **Wyzwalacze**: Stres fizyczny, emocjonalny, metaboliczny

### 2. Przysadka (Pituitary)
- **Funkcja**: Przekaźnik sygnałów
- **Hormon**: ACTH (Adrenocorticotropic Hormone)
- **Regulacja**: Feedback z nadnerczy

### 3. Nadnercza (Adrenals)
- **Funkcja**: Produkcja hormonów stresowych
- **Hormony**: Kortyzol, adrenalina, noradrenalina
- **Efekty**: Mobilizacja energii, immunosupresja

## Fazy odpowiedzi na stres:

### 1. Faza alarmowa (0-15 min)
- Aktywacja układu sympatycznego
- Uwolnienie adrenaliny
- Zwiększenie tętna, ciśnienia
- Mobilizacja glukozy

### 2. Faza oporu (15 min - dni)
- Produkcja kortyzolu
- Adaptacja do stresora
- Utrzymanie homeostazy
- Zwiększona odporność

### 3. Faza wyczerpania (dni - miesiące)
- Przewlekły stres
- Dysregulacja osi HPA
- Wypalenie nadnerczy
- Problemy zdrowotne

## Kortyzol - hormon stresu:

### Funkcje fizjologiczne:
- Regulacja glukozy
- Kontrola stanu zapalnego
- Modulacja układu immunologicznego
- Wpływ na pamięć i nastrój

### Rytm dobowy kortyzolu:
- **6-8 rano**: Szczyt (15-25 μg/dl)
- **12-14**: Spadek (8-15 μg/dl)
- **18-20**: Dalszy spadek (3-8 μg/dl)
- **22-24**: Minimum (1-4 μg/dl)

### Problemy z kortyzolem:

#### Nadmiar (hiperkortyzolizm):
- Bezsenność
- Przyrost masy ciała
- Osłabienie immunologiczne
- Problemy z pamięcią
- Depresja/lęk

#### Niedobór (hipokortyzolizm):
- Chroniczne zmęczenie
- Niskie ciśnienie
- Problemy z koncentracją
- Zwiększona wrażliwość na stres

## Adaptogeny - naturalne regulatory stresu:

### 1. Ashwagandha (Withania somnifera)
- **Mechanizm**: Modulacja osi HPA
- **Efekty**: ↓ kortyzol, ↑ odporność na stres
- **Dawka**: 300-600mg KSM-66
- **Czas**: Wieczorem

### 2. Rhodiola rosea
- **Mechanizm**: Adaptacja do stresu
- **Efekty**: ↑ energia, ↓ zmęczenie
- **Dawka**: 200-600mg (3% rosaviny)
- **Czas**: Rano

### 3. Magnolia officinalis
- **Mechanizm**: Modulacja GABA
- **Efekty**: ↓ lęk, ↓ kortyzol
- **Dawka**: 200-400mg
- **Czas**: Wieczorem

### 4. Fosfatydyloseryna
- **Mechanizm**: Stabilizacja błon komórkowych
- **Efekty**: ↓ kortyzol po ćwiczeniach
- **Dawka**: 100-300mg
- **Czas**: Po treningu

## Protokoły zarządzania stresem:

### Protokół ostrego stresu:
1. **Natychmiast**: Oddychanie 4-7-8
2. **15 min**: L-teanina 200mg
3. **30 min**: Medytacja/spacer
4. **Wieczorem**: Magnez + ashwagandha

### Protokół przewlekłego stresu:
1. **Rano**: Rhodiola + medytacja
2. **Dzień**: Regularne posiłki + ćwiczenia
3. **Wieczór**: Ashwagandha + rutyna relaksacyjna
4. **Noc**: Optymalizacja snu

### Protokół regeneracji nadnerczy:
1. **Suplementacja**: Adaptogeny + witaminy B + magnez
2. **Dieta**: Stabilizacja glukozy + przeciwzapalna
3. **Lifestyle**: Redukcja stresorów + zwiększenie snu
4. **Czas**: 3-6 miesięcy odbudowy

## Monitoring stresu:

### Biomarkery:
- Kortyzol w ślinie (4x dziennie)
- Wariabilność rytmu serca (HRV)
- Temperatura ciała
- Jakość snu

### Objawy do obserwacji:
- Energia rano
- Nastrój i motywacja
- Jakość snu
- Odporność na infekcje
- Regeneracja po ćwiczeniach
    `,
    tags: ['stres', 'kortyzol', 'adaptogeny', 'HPA'],
    relatedSupplements: ['ashwagandha', 'rhodiola', 'phosphatidylserine'],
    lastUpdated: '2025-01-05'
  }
];

const learningModules: LearningModule[] = [
  {
    id: 'neuroscience-basics',
    title: 'Podstawy Neuroscience',
    description: 'Kompleksowy kurs neurobiologii dla początkujących',
    lessons: 8,
    duration: '4 tygodnie',
    difficulty: 'Podstawowy',
    icon: <Brain className="h-6 w-6" />,
    progress: 0
  },
  {
    id: 'supplement-science',
    title: 'Nauka o Suplementach',
    description: 'Mechanizmy działania i evidence-based protocols',
    lessons: 12,
    duration: '6 tygodni',
    difficulty: 'Średniozaawansowany',
    icon: <Zap className="h-6 w-6" />,
    progress: 0
  },
  {
    id: 'biohacking-protocols',
    title: 'Protokoły Biohackingu',
    description: 'Zaawansowane strategie optymalizacji',
    lessons: 15,
    duration: '8 tygodni',
    difficulty: 'Zaawansowany',
    icon: <Target className="h-6 w-6" />,
    progress: 0
  },
  {
    id: 'sleep-optimization',
    title: 'Optymalizacja Snu',
    description: 'Kompleksowy przewodnik po higienie snu',
    lessons: 6,
    duration: '3 tygodnie',
    difficulty: 'Podstawowy',
    icon: <Moon className="h-6 w-6" />,
    progress: 0
  },
  {
    id: 'stress-management',
    title: 'Zarządzanie Stresem',
    description: 'Naukowe podejście do redukcji stresu',
    lessons: 10,
    duration: '5 tygodni',
    difficulty: 'Średniozaawansowany',
    icon: <Shield className="h-6 w-6" />,
    progress: 0
  },
  {
    id: 'cognitive-enhancement',
    title: 'Wzmocnienie Kognitywne',
    description: 'Strategie poprawy funkcji poznawczych',
    lessons: 14,
    duration: '7 tygodni',
    difficulty: 'Zaawansowany',
    icon: <Lightbulb className="h-6 w-6" />,
    progress: 0
  }
];

const categories = [
  'Wszystkie',
  'Neurobiologia',
  'Chronobiologia',
  'Endokrynologia',
  'Farmakologia',
  'Biohacking'
];

const difficulties = [
  'Wszystkie',
  'Podstawowy',
  'Średniozaawansowany',
  'Zaawansowany'
];

/**
 *
 */
export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'modules' | 'quiz' | 'learning' | 'protocols'>('articles');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Wszystkie');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesCategory = selectedCategory === 'Wszystkie' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Wszystkie' || article.difficulty === selectedDifficulty;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Podstawowy': return 'bg-green-100 text-green-800';
      case 'Średniozaawansowany': return 'bg-yellow-100 text-yellow-800';
      case 'Zaawansowany': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Powrót do bazy wiedzy
          </button>
          
          <article className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedArticle.difficulty)}`}>
                  {selectedArticle.difficulty}
                </span>
                <span className="text-gray-500 text-sm">{selectedArticle.readTime}</span>
                <span className="text-gray-500 text-sm">Zaktualizowano: {selectedArticle.lastUpdated}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{selectedArticle.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedArticle.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
            </div>
            
            {selectedArticle.relatedSupplements.length > 0 && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Powiązane suplementy:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.relatedSupplements.map(supplement => (
                    <span key={supplement} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                      {supplement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Baza Wiedzy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kompleksowe zasoby edukacyjne o neuroregulacji, suplementach i optymalizacji zdrowia
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Artykuły
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'modules'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Play className="h-4 w-4 inline mr-2" />
              Kursy
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'learning'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <GraduationCap className="h-4 w-4 inline mr-2" />
              Nauka
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'protocols'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Protokoły
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Award className="h-4 w-4 inline mr-2" />
              Quiz
            </button>
          </div>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Szukaj artykułów..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                
                <div className="text-sm text-gray-600 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {filteredArticles.length} artykułów
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      Czytaj więcej
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Modules Tab */}
        {activeTab === 'modules' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Interaktywne Kursy</h2>
              <p className="text-gray-600">Strukturalne programy nauki z praktycznymi ćwiczeniami</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningModules.map(module => (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge variant="secondary">{module.difficulty}</Badge>
                      </div>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>{module.lessons} lekcji</span>
                      <span>{module.duration}</span>
                    </div>
                    
                    {module.progress !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Postęp</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full" variant="default">
                      {module.progress === 0 ? 'Rozpocznij kurs' : 'Kontynuuj'}
                      <Play className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Learning Tab */}
        {activeTab === 'learning' && (
          <InteractiveLearning moduleId="neuroregulation-basics" />
        )}

        {/* Protocol Guides Tab */}
        {activeTab === 'protocols' && (
          <ProtocolGuides />
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="text-center py-16">
            <Award className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quizy i Testy</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Sprawdź swoją wiedzę z interaktywnymi quizami i otrzymaj spersonalizowane rekomendacje
            </p>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-4">Wkrótce dostępne!</h3>
                <p className="text-muted-foreground mb-6">
                  Pracujemy nad interaktywnymi quizami, które pomogą Ci sprawdzić wiedzę i otrzymać spersonalizowane rekomendacje.
                </p>
                <Button>
                  Powiadom mnie
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}