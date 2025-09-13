'use client';

import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Star,
  Users
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Protocol {
  id: string;
  name: string;
  category: string;
  difficulty: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany';
  duration: string;
  goal: string;
  description: string;
  supplements: {
    name: string;
    dosage: string;
    timing: string;
    importance: 'Kluczowy' | 'Ważny' | 'Opcjonalny';
  }[];
  schedule: {
    phase: string;
    duration: string;
    focus: string;
  }[];
  warnings: string[];
  expectedResults: string[];
  popularity: number;
}

const protocols: Protocol[] = [
  {
    id: 'cognitive-enhancement',
    name: 'Protokół Wzmocnienia Kognitywnego',
    category: 'Funkcje poznawcze',
    difficulty: 'Średniozaawansowany',
    duration: '8-12 tygodni',
    goal: 'Poprawa pamięci, koncentracji i funkcji wykonawczych',
    description: 'Kompleksowy protokół skupiający się na optymalizacji neurotransmiterów odpowiedzialnych za funkcje poznawcze.',
    supplements: [
      { name: 'Lion\'s Mane', dosage: '500-1000mg', timing: 'Rano na czczo', importance: 'Kluczowy' },
      { name: 'Bacopa Monnieri', dosage: '300-600mg', timing: 'Z posiłkiem', importance: 'Kluczowy' },
      { name: 'Rhodiola Rosea', dosage: '200-400mg', timing: 'Rano', importance: 'Ważny' },
      { name: 'Omega-3 (DHA)', dosage: '1000-2000mg', timing: 'Z posiłkiem', importance: 'Ważny' },
      { name: 'Fosfatydyloseryna', dosage: '100-200mg', timing: 'Wieczorem', importance: 'Opcjonalny' }
    ],
    schedule: [
      { phase: 'Faza adaptacji', duration: '2 tygodnie', focus: 'Wprowadzenie podstawowych suplementów' },
      { phase: 'Faza budowania', duration: '4-6 tygodni', focus: 'Pełny protokół z monitorowaniem' },
      { phase: 'Faza optymalizacji', duration: '2-4 tygodnie', focus: 'Dostosowanie dawek i timing' }
    ],
    warnings: [
      'Nie łączyć z lekami przeciwdepresyjnymi bez konsultacji',
      'Monitorować ciśnienie krwi przy Rhodiola',
      'Rozpocząć od niższych dawek'
    ],
    expectedResults: [
      'Poprawa koncentracji po 2-3 tygodniach',
      'Lepsza pamięć robocza po 4-6 tygodniach',
      'Zwiększona neuroplastyczność po 8+ tygodniach'
    ],
    popularity: 95
  },
  {
    id: 'stress-resilience',
    name: 'Protokół Odporności na Stres',
    category: 'Zarządzanie stresem',
    difficulty: 'Początkujący',
    duration: '6-8 tygodni',
    goal: 'Redukcja stresu i poprawa adaptacji do stresorów',
    description: 'Protokół adaptogeniczny wspierający naturalne mechanizmy radzenia sobie ze stresem.',
    supplements: [
      { name: 'Ashwagandha KSM-66', dosage: '300-600mg', timing: 'Wieczorem', importance: 'Kluczowy' },
      { name: 'Magnez Glicynian', dosage: '200-400mg', timing: 'Przed snem', importance: 'Kluczowy' },
      { name: 'L-Teanina', dosage: '100-200mg', timing: 'Rano lub po południu', importance: 'Ważny' },
      { name: 'Witamina D3', dosage: '2000-4000 IU', timing: 'Z posiłkiem', importance: 'Ważny' },
      { name: 'Kompleks witamin B', dosage: 'Według etykiety', timing: 'Rano', importance: 'Opcjonalny' }
    ],
    schedule: [
      { phase: 'Faza stabilizacji', duration: '2 tygodnie', focus: 'Normalizacja kortyzolu' },
      { phase: 'Faza wzmocnienia', duration: '3-4 tygodnie', focus: 'Budowanie odporności' },
      { phase: 'Faza utrzymania', duration: '2 tygodnie', focus: 'Długoterminowa adaptacja' }
    ],
    warnings: [
      'Ashwagandha może obniżać ciśnienie krwi',
      'Nie stosować w ciąży',
      'Monitorować poziom TSH przy problemach z tarczycą'
    ],
    expectedResults: [
      'Redukcja napięcia po 1-2 tygodniach',
      'Lepszy sen po 2-3 tygodniach',
      'Zwiększona odporność na stres po 4-6 tygodniach'
    ],
    popularity: 88
  },
  {
    id: 'sleep-optimization',
    name: 'Protokół Optymalizacji Snu',
    category: 'Sen i regeneracja',
    difficulty: 'Początkujący',
    duration: '4-6 tygodni',
    goal: 'Poprawa jakości snu i regeneracji nocnej',
    description: 'Protokół wspierający naturalne rytmy circadiane i głęboką regenerację.',
    supplements: [
      { name: 'Melatonina', dosage: '0.5-3mg', timing: '30-60 min przed snem', importance: 'Kluczowy' },
      { name: 'Magnez Glicynian', dosage: '200-400mg', timing: 'Przed snem', importance: 'Kluczowy' },
      { name: 'L-Tryptofan', dosage: '500-1000mg', timing: 'Wieczorem na czczo', importance: 'Ważny' },
      { name: 'GABA', dosage: '500-750mg', timing: 'Przed snem', importance: 'Ważny' },
      { name: 'Glicyna', dosage: '1-3g', timing: 'Przed snem', importance: 'Opcjonalny' }
    ],
    schedule: [
      { phase: 'Faza normalizacji', duration: '1-2 tygodnie', focus: 'Regulacja rytmu circadowego' },
      { phase: 'Faza pogłębienia', duration: '2-3 tygodnie', focus: 'Poprawa jakości snu' },
      { phase: 'Faza stabilizacji', duration: '1 tydzień', focus: 'Utrzymanie efektów' }
    ],
    warnings: [
      'Melatonina może powodować senność następnego dnia',
      'Nie prowadzić po zażyciu',
      'Konsultacja przy zaburzeniach snu'
    ],
    expectedResults: [
      'Szybsze zasypianie po 3-7 dniach',
      'Głębszy sen po 1-2 tygodniach',
      'Lepsza regeneracja po 3-4 tygodniach'
    ],
    popularity: 92
  },
  {
    id: 'energy-vitality',
    name: 'Protokół Energii i Witalności',
    category: 'Energia i wydajność',
    difficulty: 'Średniozaawansowany',
    duration: '6-10 tygodni',
    goal: 'Zwiększenie energii i wydolności fizycznej oraz umysłowej',
    description: 'Protokół mitochondrialny wspierający produkcję energii na poziomie komórkowym.',
    supplements: [
      { name: 'Koenzym Q10', dosage: '100-200mg', timing: 'Z posiłkiem tłuszczowym', importance: 'Kluczowy' },
      { name: 'PQQ', dosage: '10-20mg', timing: 'Rano na czczo', importance: 'Kluczowy' },
      { name: 'Kreatyna', dosage: '3-5g', timing: 'Po treningu lub rano', importance: 'Ważny' },
      { name: 'Kwas alfa-liponowy', dosage: '300-600mg', timing: 'Na czczo', importance: 'Ważny' },
      { name: 'Żeń-szeń koreański', dosage: '200-400mg', timing: 'Rano', importance: 'Opcjonalny' }
    ],
    schedule: [
      { phase: 'Faza ładowania', duration: '2 tygodnie', focus: 'Nasycenie mitochondriów' },
      { phase: 'Faza budowania', duration: '4-6 tygodni', focus: 'Optymalizacja metabolizmu' },
      { phase: 'Faza szczytowa', duration: '2 tygodnie', focus: 'Maksymalna wydajność' }
    ],
    warnings: [
      'Koenzym Q10 może wpływać na leki przeciwkrzepliwe',
      'Kreatyna wymaga zwiększonego nawodnienia',
      'Żeń-szeń może podnosić ciśnienie krwi'
    ],
    expectedResults: [
      'Zwiększona energia po 1-2 tygodniach',
      'Lepsza wydolność fizyczna po 3-4 tygodniach',
      'Optymalna funkcja mitochondriów po 6-8 tygodniach'
    ],
    popularity: 85
  }
];

const categories = ['Wszystkie', 'Funkcje poznawcze', 'Zarządzanie stresem', 'Sen i regeneracja', 'Energia i wydajność'];
const difficulties = ['Wszystkie', 'Początkujący', 'Średniozaawansowany', 'Zaawansowany'];

/**
 *
 */
export default function ProtocolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Wszystkie');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  const filteredProtocols = protocols.filter(protocol => {
    const categoryMatch = selectedCategory === 'Wszystkie' || protocol.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Wszystkie' || protocol.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Początkujący': return 'bg-green-100 text-green-800';
      case 'Średniozaawansowany': return 'bg-yellow-100 text-yellow-800';
      case 'Zaawansowany': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Kluczowy': return 'bg-red-100 text-red-800';
      case 'Ważny': return 'bg-yellow-100 text-yellow-800';
      case 'Opcjonalny': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Protokoły Suplementacji</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sprawdzone protokoły optymalizacji zdrowia i wydajności mózgu oparte na najnowszych badaniach naukowych
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Kategoria:</span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Poziom:</span>
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredProtocols.map(protocol => (
            <Card key={protocol.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProtocol(protocol)}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{protocol.name}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{protocol.popularity}%</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{protocol.category}</Badge>
                  <Badge className={getDifficultyColor(protocol.difficulty)}>{protocol.difficulty}</Badge>
                </div>
                <CardDescription>{protocol.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>{protocol.goal}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{protocol.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{protocol.supplements.length} suplementów</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Protocol Details Modal */}
        {selectedProtocol && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProtocol(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProtocol.name}</h2>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">{selectedProtocol.category}</Badge>
                      <Badge className={getDifficultyColor(selectedProtocol.difficulty)}>{selectedProtocol.difficulty}</Badge>
                      <Badge variant="outline">{selectedProtocol.duration}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedProtocol(null)}>Zamknij</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Supplements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Suplementy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProtocol.supplements.map((supplement, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{supplement.name}</h4>
                              <Badge className={getImportanceColor(supplement.importance)}>
                                {supplement.importance}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Dawka: {supplement.dosage}</p>
                            <p className="text-sm text-gray-600">Timing: {supplement.timing}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Harmonogram
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProtocol.schedule.map((phase, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <h4 className="font-medium mb-1">{phase.phase}</h4>
                            <p className="text-sm text-gray-600 mb-1">Czas trwania: {phase.duration}</p>
                            <p className="text-sm text-gray-600">Cel: {phase.focus}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Warnings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Ostrzeżenia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProtocol.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Expected Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Oczekiwane Rezultaty
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProtocol.expectedResults.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Ważne informacje</h3>
                  <p className="text-sm text-blue-800">
                    Protokoły są oparte na dostępnych badaniach naukowych, ale nie zastępują konsultacji medycznej. 
                    Przed rozpoczęciem jakiegokolwiek protokołu suplementacji skonsultuj się z lekarzem, 
                    szczególnie jeśli przyjmujesz leki lub masz problemy zdrowotne.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}