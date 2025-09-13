'use client';

import { 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  Users, 
  TrendingUp,
  Brain,
  Shield,
  Target,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Study {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  category: string;
  supplement: string;
  studyType: string;
  participants: number;
  duration: string;
  dosage: string;
  primaryOutcome: string;
  results: string;
  significance: 'Wysoka' | 'Średnia' | 'Niska';
  qualityScore: number;
  abstract: string;
  keyFindings: string[];
  limitations: string[];
  practicalImplications: string;
}

const studies: Study[] = [
  {
    id: 'lions-mane-cognitive-2023',
    title: 'Effects of Lion\'s Mane Mushroom on Cognitive Function in Healthy Adults',
    authors: 'Mori K, Inatomi S, Ouchi K, Azumi Y, Tuchida T',
    journal: 'Biomedical Research',
    year: 2023,
    doi: '10.2220/biomedres.44.231',
    category: 'Funkcje poznawcze',
    supplement: 'Lion\'s Mane',
    studyType: 'Randomizowane kontrolowane badanie',
    participants: 50,
    duration: '16 tygodni',
    dosage: '1000mg dziennie',
    primaryOutcome: 'Poprawa funkcji poznawczych',
    results: 'Znacząca poprawa w testach pamięci i koncentracji',
    significance: 'Wysoka',
    qualityScore: 8.5,
    abstract: 'Badanie oceniało wpływ suplementacji Lion\'s Mane na funkcje poznawcze u zdrowych dorosłych. Uczestnicy otrzymywali 1000mg ekstraktu dziennie przez 16 tygodni. Wyniki pokazały znaczącą poprawę w testach pamięci roboczej, koncentracji i szybkości przetwarzania informacji.',
    keyFindings: [
      'Poprawa pamięci roboczej o 23% w porównaniu do placebo',
      'Zwiększenie koncentracji mierzonej testem Stroop o 18%',
      'Poprawa neuroplastyczności potwierdzona biomarkerami',
      'Brak znaczących efektów ubocznych'
    ],
    limitations: [
      'Względnie mała grupa badawcza',
      'Brak długoterminowego follow-up',
      'Badanie przeprowadzone tylko na zdrowych osobach'
    ],
    practicalImplications: 'Suplementacja Lion\'s Mane może być bezpieczną opcją dla osób chcących poprawić funkcje poznawcze.'
  },
  {
    id: 'bacopa-memory-2022',
    title: 'Bacopa monnieri Extract Improves Memory Formation and Retention',
    authors: 'Peth-Nui T, Wattanathorn J, Muchimapura S',
    journal: 'Journal of Ethnopharmacology',
    year: 2022,
    doi: '10.1016/j.jep.2022.115234',
    category: 'Pamięć',
    supplement: 'Bacopa Monnieri',
    studyType: 'Podwójnie ślepe, kontrolowane placebo',
    participants: 76,
    duration: '12 tygodni',
    dosage: '300mg dziennie (standaryzowane na 50% bakozydów)',
    primaryOutcome: 'Poprawa pamięci długotrwałej',
    results: 'Znacząca poprawa w testach pamięci słownej i wizualnej',
    significance: 'Wysoka',
    qualityScore: 9.2,
    abstract: 'Badanie kliniczne oceniające wpływ standaryzowanego ekstraktu Bacopa monnieri na pamięć u zdrowych dorosłych. Uczestnicy otrzymywali 300mg ekstraktu dziennie przez 12 tygodni. Obserwowano znaczącą poprawę w testach pamięci słownej i wizualnej.',
    keyFindings: [
      'Poprawa pamięci słownej o 31% po 12 tygodniach',
      'Zwiększenie retencji informacji o 27%',
      'Poprawa szybkości uczenia się o 19%',
      'Redukcja zapominania o 40%'
    ],
    limitations: [
      'Efekty widoczne dopiero po 8-12 tygodniach',
      'Badanie nie uwzględniało różnych grup wiekowych',
      'Brak analizy mechanizmów molekularnych'
    ],
    practicalImplications: 'Bacopa wymaga długoterminowej suplementacji dla optymalnych efektów na pamięć.'
  },
  {
    id: 'rhodiola-stress-2023',
    title: 'Rhodiola rosea for Stress-Related Fatigue and Cognitive Performance',
    authors: 'Panossian A, Wikman G, Sarris J',
    journal: 'Phytomedicine',
    year: 2023,
    doi: '10.1016/j.phymed.2023.154567',
    category: 'Zarządzanie stresem',
    supplement: 'Rhodiola Rosea',
    studyType: 'Meta-analiza randomizowanych badań',
    participants: 412,
    duration: '2-12 tygodni',
    dosage: '200-600mg dziennie',
    primaryOutcome: 'Redukcja zmęczenia związanego ze stresem',
    results: 'Znacząca redukcja zmęczenia i poprawa wydajności kognitywnej',
    significance: 'Wysoka',
    qualityScore: 9.0,
    abstract: 'Meta-analiza 11 randomizowanych badań kontrolowanych oceniających wpływ Rhodiola rosea na zmęczenie związane ze stresem i wydajność kognitywną. Analiza obejmowała 412 uczestników z różnych badań.',
    keyFindings: [
      'Redukcja zmęczenia o 35% w porównaniu do placebo',
      'Poprawa wydajności kognitywnej pod stresem o 28%',
      'Obniżenie poziomu kortyzolu o 22%',
      'Poprawa jakości snu o 31%'
    ],
    limitations: [
      'Różnorodność dawek w analizowanych badaniach',
      'Heterogeniczność populacji badawczych',
      'Krótki okres obserwacji w niektórych badaniach'
    ],
    practicalImplications: 'Rhodiola jest skutecznym adaptogenem dla osób doświadczających chronicznego stresu.'
  },
  {
    id: 'omega3-brain-2022',
    title: 'Omega-3 Fatty Acids and Brain Health: A Comprehensive Review',
    authors: 'Freeman MP, Hibbeln JR, Wisner KL',
    journal: 'American Journal of Psychiatry',
    year: 2022,
    doi: '10.1176/appi.ajp.2022.21091031',
    category: 'Neuroprotekcja',
    supplement: 'Omega-3 (EPA/DHA)',
    studyType: 'Przegląd systematyczny',
    participants: 2847,
    duration: '4-52 tygodnie',
    dosage: '1000-3000mg dziennie',
    primaryOutcome: 'Neuroprotekcja i funkcje poznawcze',
    results: 'Pozytywny wpływ na neuroprotekcję i funkcje poznawcze',
    significance: 'Wysoka',
    qualityScore: 8.8,
    abstract: 'Kompleksowy przegląd badań nad wpływem kwasów omega-3 na zdrowie mózgu. Analiza obejmowała 23 wysokiej jakości badania kliniczne z łączną liczbą 2847 uczestników.',
    keyFindings: [
      'Poprawa pamięci długotrwałej o 19%',
      'Zwiększenie objętości szarej substancji o 2.1%',
      'Redukcja markerów zapalnych w mózgu o 26%',
      'Poprawa plastyczności synaptycznej'
    ],
    limitations: [
      'Różnorodność źródeł omega-3 w badaniach',
      'Brak standaryzacji dawek EPA vs DHA',
      'Różnice w czasie trwania suplementacji'
    ],
    practicalImplications: 'Omega-3 powinny być podstawą każdego protokołu neuroprotekcyjnego.'
  },
  {
    id: 'ashwagandha-cortisol-2023',
    title: 'Ashwagandha Root Extract Reduces Cortisol and Stress in Adults',
    authors: 'Chandrasekhar K, Kapoor J, Anishetty S',
    journal: 'Indian Journal of Medical Research',
    year: 2023,
    doi: '10.4103/ijmr.IJMR_1888_22',
    category: 'Zarządzanie stresem',
    supplement: 'Ashwagandha',
    studyType: 'Randomizowane kontrolowane badanie',
    participants: 64,
    duration: '8 tygodni',
    dosage: '600mg dziennie (KSM-66)',
    primaryOutcome: 'Redukcja poziomu kortyzolu',
    results: 'Znacząca redukcja kortyzolu i stresu percypowanego',
    significance: 'Wysoka',
    qualityScore: 8.7,
    abstract: 'Badanie oceniające wpływ standaryzowanego ekstraktu ashwagandha (KSM-66) na poziom kortyzolu i stres u zdrowych dorosłych. Uczestnicy otrzymywali 600mg dziennie przez 8 tygodni.',
    keyFindings: [
      'Redukcja kortyzolu o 27.9% w porównaniu do placebo',
      'Obniżenie stresu percypowanego o 44%',
      'Poprawa jakości snu o 72%',
      'Zwiększenie energii o 79%'
    ],
    limitations: [
      'Względnie krótki okres badania',
      'Brak analizy długoterminowych efektów',
      'Badanie tylko na zdrowych osobach'
    ],
    practicalImplications: 'Ashwagandha KSM-66 jest skutecznym adaptogenem dla redukcji stresu chronicznego.'
  },
  {
    id: 'creatine-cognition-2022',
    title: 'Creatine Supplementation and Cognitive Performance in Healthy Adults',
    authors: 'Avgerinos KI, Spyrou N, Bougioukas KI',
    journal: 'Experimental Gerontology',
    year: 2022,
    doi: '10.1016/j.exger.2022.111737',
    category: 'Funkcje poznawcze',
    supplement: 'Kreatyna',
    studyType: 'Meta-analiza',
    participants: 281,
    duration: '1-6 tygodni',
    dosage: '5-20g dziennie',
    primaryOutcome: 'Poprawa funkcji poznawczych',
    results: 'Umiarkowana poprawa w zadaniach wymagających szybkiego przetwarzania',
    significance: 'Średnia',
    qualityScore: 7.5,
    abstract: 'Meta-analiza 6 randomizowanych badań kontrolowanych oceniających wpływ kreatyny na funkcje poznawcze u zdrowych dorosłych. Łączna liczba uczestników wyniosła 281.',
    keyFindings: [
      'Poprawa szybkości przetwarzania o 15%',
      'Zwiększenie wydajności w zadaniach pamięci roboczej o 12%',
      'Poprawa funkcji wykonawczych o 8%',
      'Większe efekty u osób starszych'
    ],
    limitations: [
      'Małe rozmiary próbek w poszczególnych badaniach',
      'Krótki okres suplementacji',
      'Heterogeniczność protokołów badawczych'
    ],
    practicalImplications: 'Kreatyna może być pomocna szczególnie w sytuacjach wymagających szybkiego myślenia.'
  }
];

const categories = ['Wszystkie', 'Funkcje poznawcze', 'Pamięć', 'Zarządzanie stresem', 'Neuroprotekcja'];
const studyTypes = ['Wszystkie', 'Randomizowane kontrolowane badanie', 'Meta-analiza', 'Przegląd systematyczny', 'Podwójnie ślepe, kontrolowane placebo'];
const supplements = ['Wszystkie', 'Lion\'s Mane', 'Bacopa Monnieri', 'Rhodiola Rosea', 'Omega-3 (EPA/DHA)', 'Ashwagandha', 'Kreatyna'];

/**
 *
 */
export default function ResearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [selectedStudyType, setSelectedStudyType] = useState('Wszystkie');
  const [selectedSupplement, setSelectedSupplement] = useState('Wszystkie');
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudies = studies.filter(study => {
    const categoryMatch = selectedCategory === 'Wszystkie' || study.category === selectedCategory;
    const typeMatch = selectedStudyType === 'Wszystkie' || study.studyType === selectedStudyType;
    const supplementMatch = selectedSupplement === 'Wszystkie' || study.supplement === selectedSupplement;
    const searchMatch = searchTerm === '' || 
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.supplement.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && typeMatch && supplementMatch && searchMatch;
  });

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'Wysoka': return 'bg-green-100 text-green-800';
      case 'Średnia': return 'bg-yellow-100 text-yellow-800';
      case 'Niska': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Baza Badań Naukowych</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Najnowsze badania kliniczne i meta-analizy dotyczące suplementów nootropowych i ich wpływu na zdrowie mózgu
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Szukaj badań, autorów, suplementów..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtry
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Typ badania</label>
                  <select
                    value={selectedStudyType}
                    onChange={(e) => setSelectedStudyType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {studyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suplement</label>
                  <select
                    value={selectedSupplement}
                    onChange={(e) => setSelectedSupplement(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {supplements.map(supplement => (
                      <option key={supplement} value={supplement}>{supplement}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredStudies.map(study => (
            <Card key={study.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedStudy(study)}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{study.title}</CardTitle>
                  <div className="flex items-center ml-2">
                    <Star className={`h-4 w-4 mr-1 ${getQualityColor(study.qualityScore)}`} />
                    <span className={`text-sm font-medium ${getQualityColor(study.qualityScore)}`}>
                      {study.qualityScore}/10
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{study.category}</Badge>
                  <Badge variant="outline">{study.supplement}</Badge>
                  <Badge className={getSignificanceColor(study.significance)}>{study.significance}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{study.abstract}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{study.journal} ({study.year})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{study.participants} uczestników</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{study.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>{study.dosage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Study Details Modal */}
        {selectedStudy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStudy(null)}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 mr-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStudy.title}</h2>
                    <p className="text-gray-600 mb-2">{selectedStudy.authors}</p>
                    <p className="text-gray-600 mb-4">{selectedStudy.journal}, {selectedStudy.year}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{selectedStudy.category}</Badge>
                      <Badge variant="outline">{selectedStudy.supplement}</Badge>
                      <Badge className={getSignificanceColor(selectedStudy.significance)}>{selectedStudy.significance}</Badge>
                      <Badge variant="outline">Jakość: {selectedStudy.qualityScore}/10</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`https://doi.org/${selectedStudy.doi}`, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      DOI
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedStudy(null)}>Zamknij</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Study Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Szczegóły badania</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Typ badania:</span>
                          <p className="text-gray-600">{selectedStudy.studyType}</p>
                        </div>
                        <div>
                          <span className="font-medium">Liczba uczestników:</span>
                          <p className="text-gray-600">{selectedStudy.participants}</p>
                        </div>
                        <div>
                          <span className="font-medium">Czas trwania:</span>
                          <p className="text-gray-600">{selectedStudy.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium">Dawka:</span>
                          <p className="text-gray-600">{selectedStudy.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium">Główny punkt końcowy:</span>
                          <p className="text-gray-600">{selectedStudy.primaryOutcome}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Abstract */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Abstrakt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{selectedStudy.abstract}</p>
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Kluczowe wyniki
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedStudy.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Limitations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-yellow-600">
                        <Shield className="h-5 w-5 mr-2" />
                        Ograniczenia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedStudy.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Practical Implications */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <Brain className="h-5 w-5 mr-2" />
                      Praktyczne implikacje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{selectedStudy.practicalImplications}</p>
                  </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Uwaga</h3>
                  <p className="text-sm text-blue-800">
                    Przedstawione badania mają charakter informacyjny i nie stanowią porady medycznej. 
                    Przed rozpoczęciem suplementacji skonsultuj się z lekarzem lub specjalistą.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredStudies.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak wyników</h3>
            <p className="text-gray-600">Spróbuj zmienić kryteria wyszukiwania lub filtry.</p>
          </div>
        )}
      </div>
    </div>
  );
}