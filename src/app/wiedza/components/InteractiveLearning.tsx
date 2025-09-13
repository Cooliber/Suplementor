'use client'

import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Brain,
  Clock,
  ArrowRight,
  BookOpen,
  Target
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
// Note: Zustand store for brain state can be created in src/lib/stores/useBrainStore.ts for full integration
// For now, using local state to avoid editing other files

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  points: number
}

interface LearningLesson {
  id: string
  title: string
  content: string
  duration: number // in minutes
  keyPoints: string[]
  quiz: string[]
  nextLesson?: string | undefined
}

interface UserProgress {
  lessonId: string
  completed: boolean
  score: number
  timeSpent: number
  attempts: number
  lastAccessed: string
}

interface Section {
  title: string
  content: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question:
      'Który neuroprzekaźnik jest głównie odpowiedzialny za motywację i system nagrody?',
    options: ['Serotonina', 'Dopamina', 'GABA', 'Acetylocholina'],
    correctAnswer: 1,
    explanation:
      'Dopamina jest kluczowym neuroprzekaźnikiem w systemie nagrody mózgu, odpowiedzialnym za motywację, przyjemność i uczenie się przez wzmocnienie.',
    difficulty: 'easy',
    category: 'Neurobiologia',
    points: 10
  },
  {
    id: 'q2',
    question: 'Jaki jest główny mechanizm działania L-teaniny?',
    options: [
      'Zwiększa poziom dopaminy',
      'Blokuje receptory AMPA i moduluje fale alfa',
      'Inhibuje reuptake serotoniny',
      'Aktywuje receptory GABA'
    ],
    correctAnswer: 1,
    explanation:
      'L-teanina działa jako antagonista receptorów AMPA i kainowych, jednocześnie modulując aktywność fal alfa (8-12 Hz), co prowadzi do stanu relaksacji bez sedacji.',
    difficulty: 'medium',
    category: 'Farmakologia',
    points: 15
  },
  {
    id: 'q3',
    question: 'Która forma magnezu najlepiej przekracza barierę krew-mózg?',
    options: [
      'Magnez cytrynian',
      'Magnez L-treonian',
      'Magnez glicynat',
      'Magnez tlenek'
    ],
    correctAnswer: 1,
    explanation:
      'Magnez L-treonian został specjalnie zaprojektowany do przekraczania bariery krew-mózg dzięki transportowi przez MCT (monocarboxylate transporter).',
    difficulty: 'medium',
    category: 'Farmakologia',
    points: 15
  },
  {
    id: 'q4',
    question: 'Jaka jest główna funkcja osi HPA?',
    options: [
      'Regulacja snu',
      'Kontrola apetytu',
      'Odpowiedź na stres',
      'Regulacja temperatury'
    ],
    correctAnswer: 2,
    explanation:
      'Oś HPA (podwzgórze-przysadka-nadnercza) jest głównym systemem neuroendokrynnym odpowiedzialnym za reakcję organizmu na stres i produkcję kortyzolu.',
    difficulty: 'easy',
    category: 'Endokrynologia',
    points: 10
  },
  {
    id: 'q5',
    question: 'Który adaptogen najskuteczniej redukuje poziom kortyzolu?',
    options: ['Rhodiola rosea', 'Ashwagandha KSM-66', 'Ginseng', 'Schisandra'],
    correctAnswer: 1,
    explanation:
      'Ashwagandha KSM-66 wykazuje najsilniejsze działanie w redukcji kortyzolu, z badaniami pokazującymi redukcję do 27.9% w ciągu 8 tygodni.',
    difficulty: 'medium',
    category: 'Farmakologia',
    points: 15
  },
  {
    id: 'q6',
    question: 'Co to jest neuroplastyczność?',
    options: [
      'Elastyczność naczyń krwionośnych w mózgu',
      'Zdolność mózgu do zmiany i reorganizacji',
      'Ochrona neuronów przed uszkodzeniem',
      'Szybkość przewodzenia impulsów nerwowych'
    ],
    correctAnswer: 1,
    explanation:
      'Neuroplastyczność to zdolność mózgu do reorganizacji, tworzenia nowych połączeń neuronalnych i adaptacji przez całe życie.',
    difficulty: 'easy',
    category: 'Neurobiologia',
    points: 10
  },
  {
    id: 'q7',
    question: 'Który czynnik najsilniej stymuluje neurogenezę?',
    options: ['Ćwiczenia fizyczne', 'Dieta ketogeniczna', 'Suplementacja', 'Sen'],
    correctAnswer: 0,
    explanation:
      'Ćwiczenia fizyczne są najsilniejszym naturalnym stymulatorem neurogenezy, zwiększając poziom BDNF i promując tworzenie nowych neuronów.',
    difficulty: 'medium',
    category: 'Neurobiologia',
    points: 15
  },
  {
    id: 'q8',
    question: 'Jaki jest optymalny rytm dobowy kortyzolu?',
    options: [
      'Wysoki wieczorem, niski rano',
      'Stały poziom przez cały dzień',
      'Wysoki rano, stopniowy spadek do wieczora',
      'Niski rano, wzrost po południu'
    ],
    correctAnswer: 2,
    explanation:
      'Zdrowy rytm kortyzolu charakteryzuje się szczytem rano (6-8), który pomaga w przebudzeniu, a następnie stopniowym spadkiem do minimum w nocy.',
    difficulty: 'medium',
    category: 'Endokrynologia',
    points: 15
  }
]

const brainMDContent = `# Wstęp do Anatomii i Fizjologii Mózgu

Mózg ludzki to centralny organ układu nerwowego, pełniący rolę dowództwa nad całym organizmem, podobny do superkomputera przetwarzającego miliardy informacji na sekundę. W kontekście neuroregulacji i suplementów, zrozumienie anatomii i fizjologii mózgu jest kluczowe, ponieważ pozwala na lepsze wykorzystanie substancji odżywczych, takich jak L-lizyna, do wspierania funkcji poznawczych i emocjonalnych. Ten dokument dostarcza szczegółowych informacji na temat budowy, działania, zaburzeń oraz wpływu odżywiania i ewolucji na mózg, z naciskiem na aspekty biochemiczne i neurofizjologiczne istotne dla suplementacji. Sugestia wizualizacji: interaktywny model 3D mózgu w komponencie Brain3D.tsx, gdzie użytkownik może obracać i klikać w regiony dla tooltipów w języku polskim.

## Anatomia Mózgu

### Główne Regiony i Struktury

Mózg składa się z kilku głównych płatów i struktur podkorowych. Płat czołowy (frontal lobe) odpowiada za planowanie, podejmowanie decyzji i kontrolę ruchów, działając jak "dyrektor generalny" korporacji. Płat ciemieniowy (parietal lobe) integruje informacje sensoryczne, płat skroniowy (temporal lobe) przetwarza pamięć i mowę, a płat potyliczny (occipital lobe) zajmuje się wizją. Struktury podkorowe, takie jak hipokamp (hippocampus), kluczowy dla pamięci i uczenia się, oraz móżdżek (cerebellum), koordynujący ruchy, są połączone siecią szlaków nerwowych, tworząc złożoną sieć komunikacyjną.

Przykładowo, hipokamp współpracuje z korą mózgową poprzez pętlę perforantną, umożliwiając przechowywanie wspomnień. Móżdżek, z miliardami neuronów, zapewnia precyzję ruchów, jak w jeździe na rowerze. Interkonekcje te, w tym ciało modzelowate (corpus callosum) łączące półkule, pozwalają na holistyczne przetwarzanie informacji.

Sugestia wizualizacji: Diagram interaktywny w InteractiveDiagram.tsx pokazujący połączenia między regionami, z animacjami neuralnymi szlakami.

### Źródła
1. National Institute of Neurological Disorders and Stroke (NINDS), NIH: "Brain Basics: Know Your Brain" (2023).
2. Mayo Clinic: "Brain Anatomy" (2022).
3. Purves, D. et al. Neuroscience (Sinauer Associates, 2018).
4. Bear, M.F. et al. Neuroscience: Exploring the Brain (Lippincott Williams & Wilkins, 2020).
5. Kandel, E.R. et al. Principles of Neural Science (McGraw-Hill, 2021).

## Fizjologia Mózgu

### Sygnalizacja Neuralna i Bariera Krew-Mózg

Fizjologia mózgu opiera się na sygnalizacji neuralnej, gdzie neurony komunikują się poprzez impulsy elektryczne i chemiczne. Akson neuronu przewodzi impuls z prędkością do 120 m/s, a synapsa uwalnia neuroprzekaźniki, takie jak dopamina (dopamine) regulująca nagrodę i motywację, czy acetylocholina (acetylcholine) wspierająca pamięć i uwagę. Proces przetwarzania informacji odbywa się poprzez szlaki sensoryczno-motoryczne: bodźce z receptorów trafiają do wzgórza (thalamus), a następnie do kory, skąd wychodzą komendy ruchowe.

Bariera krew-mózg (blood-brain barrier, BBB) chroni mózg przed toksynami, ale umożliwia transport składników odżywczych, co jest kluczowe dla suplementów. Na przykład, L-lizyna, aminokwas egzogenny, przekracza BBB i wspiera produkcję neuroprzekaźników poprzez syntezę białek i redukcję stresu oksydacyjnego, co poprawia syntezę serotoniny i dopaminy, istotną w neuroregulacji.

Przykładowo, w ścieżce sensorycznej, światło aktywuje fotoreceptory w siatkówce, sygnał przechodzi przez nerw wzrokowy do kory wzrokowej. Analogia: mózg jako sieć komputerowa, gdzie neurony to procesory, a synapsy to połączenia kablowe.

### Biochemia: Hormony i Enzymy

Kluczowe hormony to kortyzol regulujący stres, a enzymy jak MAO (monoamine oxidase) rozkładają neuroprzekaźniki. W kontekście suplementów, omega-3 (DHA) modulują enzymy zapalne, wspierając BBB.

Sugestia wizualizacji: Animacja w Three.js pokazująca transmisję synaptyczną z overlayami Html dla opisów po polsku.

### Źródła
1. NIH: "Neuronal Signaling" (2023).
2. Mayo Clinic: "How the Brain Works" (2022).
3. Nature Neuroscience: "Synaptic Transmission" (Südhof, 2013).
4. Journal of Neuroscience: "Blood-Brain Barrier and Nutrients" (Abbott et al., 2010).
5. Biochemical Pharmacology: "L-Lysine and Neurotransmitter Synthesis" (Smriga et al., 2007).

## Zaburzenia, Odżywianie i Wpływ Suplementów

### Powszechne Zaburzenia

Choroba Alzheimera (Alzheimer's disease) charakteryzuje się nagromadzeniem blaszek amyloidowych, powodując utratę pamięci i dezorientację. Przyczyny: genetyczne (APOE4) i środowiskowe; objawy: problemy z pamięcią, zmiany behawioralne; leczenia: inhibitory cholinesterazy jak donepezil, oraz suplementy jak omega-3 redukujące zapalenie.

Inne: Parkinson – ubytek dopaminy w istocie czarnej (substantia nigra), leczony L-DOPA. W kontekście suplementów, L-lizyna wspiera syntezę dopaminy, potencjalnie łagodząc objawy stresu-related.

### Wpływ Odżywiania

Omega-3 (z ryb) poprawiają plastyczność synaptyczną, redukując ryzyko demencji. Witaminy B wspierają metabolizm homocysteiny, chroniąc przed udarami. Przykładowo, dieta śródziemnomorska z oliwą i orzechami wspiera BBB.

Sugestia wizualizacji: Quiz w QuizEngine.tsx testujący wiedzę o zaburzeniach i suplementach.

### Źródła
1. Alzheimer's Association & NIH: "Alzheimer's Disease Facts" (2023).
2. Mayo Clinic: "Alzheimer's Disease" (2022).
3. The Lancet Neurology: "Nutrition and Brain Health" (Gómez-Pinilla, 2008).
4. Journal of Alzheimer's Disease: "Omega-3 in Alzheimer's" (Yaffe et al., 2012).
5. European Journal of Nutrition: "L-Lysine Supplementation Effects" (Smriga, 2010).

## Aspekty Ewolucyjne i Nowe Badania

### Adaptacje Ewolucyjne

U człowieka neocortex (neocortex) jest powiększony, umożliwiając zaawansowane myślenie abstrakcyjne i język, w porównaniu do innych ssaków. Ewolucyjnie, rozwój hipokampu wspierał pamięć przestrzenną u łowców-zbieraczy.

### Nowe Badania: Neuroplastyczność i Oś Mózg-Jelita

Neuroplastyczność pozwala na reorganizacji połączeń neuronalnych, np. po urazach, stymulowana ćwiczeniami i suplementami jak BDNF-boostery (omega-3). Oś mózg-jelita (microbiome-brain axis) pokazuje, jak mikrobiom jelitowy wpływa na nastrój poprzez serotoninę (95% produkowana w jelitach). L-lizyna moduluje tę oś poprzez redukcję lęku.

Przykładowo, badania pokazują, że medytacja zwiększa grubość kory przedczołowej. Analogia: mózg jako plastyczny gliniany model, formowany doświadczeniami.

Sugestia wizualizacji: Tab w NeuroplasticityTab.tsx z animacjami zmian synaptycznych.

### Źródła
1. NIH: "Brain Evolution" (2023).
2. Nature Reviews Neuroscience: "Human Neocortex Expansion" (Rakic, 2009).
3. Science: "Neuroplasticity Mechanisms" (Holtmaat & Svoboda, 2009).
4. Cell: "Gut-Brain Axis" (Cryan & Dinan, 2012).
5. Frontiers in Neuroscience: "Microbiome and Neurotransmitters" (Cryan et al., 2019).

## Referencje Ogólne

Ten dokument opiera się na wiarygodnych źródłach, z cytacjami powyżej. Dla dalszych badań, polecamy PubMed i NIH.gov. Treść wspiera komponenty edukacyjne app, jak InteractiveLearning.tsx, integrując z danymi suplementów w supplements-database.ts dla neuroefektów.`

const learningLessons: LearningLesson[] = [
  {
    id: 'lesson-1',
    title: 'Wprowadzenie do Neuroprzekaźników',
    content: `
# Wprowadzenie do Neuroprzekaźników

## Czym są neuroprzekaźniki?

Neuroprzekaźniki to chemiczne posłańcy, które umożliwiają komunikację między neuronami. Są fundamentem wszystkich funkcji mózgu.

## Główne typy:

### 1. Neuroprzekaźniki pobudzające
- **Glutaminian**: Główny neuroprzekaźnik pobudzający
- **Acetylocholina**: Pamięć, uczenie się, uwaga
- **Noradrenalina**: Czujność, energia

### 2. Neuroprzekaźniki hamujące
- **GABA**: Główny neuroprzekaźnik hamujący
- **Glicyna**: Hamowanie w rdzeniu kręgowym

### 3. Neuroprzekaźniki modulujące
- **Dopamina**: Motywacja, nagroda
- **Serotonina**: Nastrój, sen, apetyt

## Proces neurotransmisji:

1. **Synteza**: Tworzenie neuroprzekaźnika w neuronie
2. **Magazynowanie**: Przechowywanie w pęcherzykach synaptycznych
3. **Uwolnienie**: Egzocytoza do szczeliny synaptycznej
4. **Wiązanie**: Połączenie z receptorami na neuronie postsynaptycznym
5. **Inaktywacja**: Usunięcie przez reuptake lub degradację

## Znaczenie dla zdrowia:

Równowaga neuroprzekaźników jest kluczowa dla:
- Stabilnego nastroju
- Dobrej pamięci i koncentracji
- Zdrowego snu
- Odpowiedniej motywacji
- Kontroli lęku i stresu
    `,
    duration: 15,
    keyPoints: [
      'Neuroprzekaźniki to chemiczne posłańcy mózgu',
      'Dzielą się na pobudzające, hamujące i modulujące',
      'Proces neurotransmisji ma 5 głównych etapów',
      'Równowaga neuroprzekaźników jest kluczowa dla zdrowia'
    ],
    quiz: ['q1', 'q6'],
    nextLesson: 'lesson-2'
  },
  {
    id: 'lesson-2',
    title: 'Mechanizmy Działania Suplementów',
    content: `
# Mechanizmy Działania Suplementów

## Jak suplementy wpływają na mózg?

Suplementy nootropowe działają przez różne mechanizmy:

### 1. Prekursory neuroprzekaźników
- **L-tyrozyna** → Dopamina, Noradrenalina
- **Tryptofan** → Serotonina
- **Cholina** → Acetylocholina

### 2. Modulatory receptorów
- **L-teanina**: Antagonista receptorów AMPA
- **GABA**: Agonista receptorów GABA-A
- **Magnez**: Kofaktor receptorów NMDA

### 3. Inhibitory enzymów
- **Huperzyna A**: Inhibitor cholinoesterazy
- **Kurkumina**: Inhibitor MAO

### 4. Adaptogeny
- **Ashwagandha**: Modulacja osi HPA
- **Rhodiola**: Adaptacja do stresu

## Farmakokinetyka:

### ADME (Absorpcja, Dystrybucja, Metabolizm, Eliminacja)

**Absorpcja**:
- Jelito cienkie (większość)
- Transport aktywny vs pasywny
- Wpływ posiłków i pH

**Dystrybucja**:
- Bariera krew-mózg (kluczowa!)
- Wiązanie z białkami
- Objętość dystrybucji

**Metabolizm**:
- Wątroba (CYP450)
- Efekt pierwszego przejścia
- Metabolity aktywne

**Eliminacja**:
- Nerki (głównie)
- Żółć
- Płuca (lotne związki)

## Czynniki wpływające na skuteczność:

1. **Bioavailability** - ile substancji dociera do krążenia
2. **Timing** - kiedy przyjmować dla optymalnego efektu
3. **Dawkowanie** - krzywa dawka-odpowiedź
4. **Interakcje** - z innymi suplementami i lekami
5. **Genetyka** - polimorfizmy enzymów metabolizujących
    `,
    duration: 20,
    keyPoints: [
      'Suplementy działają przez różne mechanizmy molekularne',
      'Farmakokinetyka określa skuteczność suplementu',
      'Bariera krew-mózg jest kluczowa dla nootropów',
      'Timing i dawkowanie wpływają na efektywność'
    ],
    quiz: ['q2', 'q3'],
    nextLesson: 'lesson-3'
  },
  {
    id: 'lesson-3',
    title: 'System Odpowiedzi na Stres',
    content: `
# System Odpowiedzi na Stres

## Oś HPA (Hypothalamic-Pituitary-Adrenal)

Główny system neuroendokrynny odpowiedzialny za reakcję na stres.

### Komponenty:

**1. Podwzgórze (Hypothalamus)**
- Wykrywa stresory
- Uwalnia CRH (Corticotropin-Releasing Hormone)
- Integruje sygnały z różnych obszarów mózgu

**2. Przysadka (Pituitary)**
- Przedni płat uwalnia ACTH
- Odpowiada na CRH z podwzgórza
- Reguluje aktywność nadnerczy

**3. Nadnercza (Adrenals)**
- Kora: Kortyzol (główny hormon stresu)
- Rdzeń: Adrenalina i noradrenalina
- Efekty systemowe na cały organizm

## Fazy odpowiedzi na stres:

### Faza 1: Alarm (0-15 min)
- Aktywacja układu sympatycznego
- Uwolnienie adrenaliny
- Mobilizacja energii
- Zwiększenie tętna i ciśnienia

### Faza 2: Opór (15 min - dni)
- Produkcja kortyzolu
- Adaptacja do stresora
- Utrzymanie homeostazy
- Zwiększona odporność

### Faza 3: Wyczerpanie (dni - miesiące)
- Przewlekły stres
- Dysregulacja osi HPA
- Wypalenie nadnerczy
- Problemy zdrowotne

## Kortyzol - hormon stresu:

### Funkcje fizjologiczne:
- Regulacja glukozy (glukoneogeneza)
- Kontrola stanu zapalnego
- Modulacja układu immunologicznego
- Wpływ na pamięć i nastrój

### Rytm dobowy:
- **6-8 rano**: Szczyt (budzenie)
- **12-14**: Spadek
- **18-20**: Dalszy spadek
- **22-24**: Minimum (sen)

### Problemy z kortyzolem:

**Nadmiar (hiperkortyzolizm)**:
- Bezsenność
- Przyrost masy ciała
- Osłabienie immunologiczne
- Problemy z pamięcią
- Depresja/lęk

**Niedobór (hipokortyzolizm)**:
- Chroniczne zmęczenie
- Niskie ciśnienie
- Problemy z koncentracją
- Zwiększona wrażliwość na stres

## Zarządzanie stresem:

### Naturalne metody:
1. **Ćwiczenia fizyczne** - regulują oś HPA
2. **Medytacja** - redukuje kortyzol
3. **Sen** - regeneracja osi HPA
4. **Dieta** - stabilizacja glukozy
5. **Wsparcie społeczne** - bufor stresu

### Suplementacja:
- **Adaptogeny**: Ashwagandha, Rhodiola
- **Magnez**: Relaksacja, sen
- **L-teanina**: Redukcja lęku
- **Fosfatydyloseryna**: Modulacja kortyzolu
    `,
    duration: 25,
    keyPoints: [
      'Oś HPA to główny system odpowiedzi na stres',
      'Kortyzol ma zdrowy rytm dobowy',
      'Przewlekły stres prowadzi do dysregulacji',
      'Adaptogeny pomagają w zarządzaniu stresem'
    ],
    quiz: ['q4', 'q5', 'q8'],
    nextLesson: 'brain-anatomy'
  },
  {
    id: 'brain-anatomy',
    title: 'Anatomia i Fizjologia Mózgu',
    content: brainMDContent,
    duration: 30,
    keyPoints: [
      'Mózg to centralny organ układu nerwowego',
      'Kluczowe regiony: Płat czołowy, ciemieniowy, skroniowy, potyliczny',
      'Suplementy jak L-lizyna wspierają produkcję neuroprzekaźników',
      'Neuroplastyczność i oś mózg-jelita są kluczowe dla zdrowia'
    ],
    quiz: ['q1', 'q6', 'q7'],
    nextLesson: undefined as any
  }
]

/**
 *
 * @param md
 */
const parseMDSections = (md: string): Section[] => {
  const sections: Section[] = []
  let currentSection: Section = { title: '', content: '' }
  const lines = md.split('\n')
  let inSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? ''
    if (line !== '') {
      if (line.startsWith('# ')) {
        // Main title
        if (currentSection.title) {
          currentSection.content = currentSection.content.trim()
          sections.push(currentSection)
        }
        currentSection = { title: line.substring(2).trim(), content: '' }
        inSection = true
      } else if (line.startsWith('## ')) {
        if (currentSection.title && currentSection.content) {
          currentSection.content = currentSection.content.trim()
          sections.push(currentSection)
        }
        currentSection = { title: line.substring(3).trim(), content: '' }
        inSection = true
      } else if (inSection) {
        currentSection.content += lines[i] + '\n'
      }
    }
  }
  if (currentSection.title && currentSection.content) {
    sections.push(currentSection)
  }
  return sections
}

interface InteractiveLearningProps {
  moduleId: string
}

/**
 *
 */
export default function InteractiveLearning({ moduleId }: InteractiveLearningProps) {
  const [currentLesson, setCurrentLesson] = useState<LearningLesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson')
  const [selectedRegion, setSelectedRegion] = useState<string>('') // Local state for Brain3D integration; can be replaced with Zustand

  useEffect(() => {
    // Load first lesson
    if (learningLessons.length > 0 && learningLessons[0]) {
      setCurrentLesson(learningLessons[0])
      setLessonStartTime(new Date())
    }

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('learning-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as unknown as UserProgress[]
        if (Array.isArray(parsed)) {
          setProgress(parsed)
        }
      } catch (error) {
        console.error('Failed to parse saved progress:', error)
      }
    }
  }, [])

  const saveProgress = (
    lessonId: string,
    completed: boolean,
    score: number,
    timeSpent: number
  ) => {
    const newProgress: UserProgress = {
      lessonId,
      completed,
      score,
      timeSpent,
      attempts: 1,
      lastAccessed: new Date().toISOString()
    }

    const updatedProgress = [
      ...progress.filter((p) => p.lessonId !== lessonId),
      newProgress
    ]
    setProgress(updatedProgress)
    localStorage.setItem('learning-progress', JSON.stringify(updatedProgress))
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentLesson) return

    const questions = getCurrentQuestions()
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(score + currentQuestion.points)
    }

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    const questions = getCurrentQuestions()

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
      if (currentLesson && lessonStartTime) {
        const timeSpent = Math.round(
          (new Date().getTime() - lessonStartTime.getTime()) / 60000
        )
        saveProgress(currentLesson.id, true, score, timeSpent)
      }
    }
  }

  const getCurrentQuestions = (): QuizQuestion[] => {
    if (!currentLesson) return []
    return quizQuestions.filter((q) => currentLesson.quiz.includes(q.id))
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const goToNextLesson = () => {
    if (!currentLesson?.nextLesson) return

    const nextLesson = learningLessons.find((l) => l.id === currentLesson.nextLesson)
    if (nextLesson) {
      setCurrentLesson(nextLesson)
      setActiveTab('lesson')
      resetQuiz()
      setLessonStartTime(new Date())
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSectionSelect = (value: string) => {
    // Map section to brain region for Brain3D integration (local state; can be Zustand)
    const regionMap: { [key: string]: string } = {
      'Anatomia Mózgu': 'frontal-lobe', // Example mapping; adjust based on Brain3D regions
      'Fizjologia Mózgu': 'hippocampus',
      'Zaburzenia, Odżywianie i Wpływ Suplementów': 'substantia-nigra',
      'Aspekty Ewolucyjne i Nowe Badania': 'neocortex'
      // Add more mappings as needed
    }
    setSelectedRegion(regionMap[value] || 'default')
  }

  if (!currentLesson) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto mb-4 h-12 w-12 text-blue-500" />
          <p className="text-gray-600">Ładowanie modułu nauki...</p>
        </div>
      </div>
    )
  }

  const questions = getCurrentQuestions()
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Postęp lekcji</span>
          <span>
            {Math.round(
              ((currentQuestionIndex + (quizCompleted ? 1 : 0)) /
                (questions.length + 1)) *
                100
            )}
            %
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + (quizCompleted ? 1 : 0)) / (questions.length + 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex rounded-lg bg-white p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
            activeTab === 'lesson'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="mr-2 inline h-4 w-4" />
          Lekcja
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
            activeTab === 'quiz'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Target className="mr-2 inline h-4 w-4" />
          Quiz
        </button>
      </div>

      {/* Lesson Content */}
      {activeTab === 'lesson' && (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {currentLesson.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="mr-1 h-4 w-4" />
              <span>{currentLesson.duration} min</span>
            </div>
          </div>

          {currentLesson.id === 'brain-anatomy' ? (
            <>
              <div className="prose mb-8 max-w-none">
                <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
              </div>
              {parseMDSections(currentLesson.content).length > 1 && (
                <Tabs
                  defaultValue={
                    parseMDSections(currentLesson.content)[0]?.title ??
                    'Wstęp do Anatomii i Fizjologii Mózgu'
                  }
                  onValueChange={handleSectionSelect}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    {parseMDSections(currentLesson.content).map((section) => (
                      <TabsTrigger
                        key={section.title}
                        value={section.title}
                        className="max-w-xs truncate"
                      >
                        {section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {parseMDSections(currentLesson.content).map((section) => (
                    <TabsContent
                      key={section.title}
                      value={section.title}
                      className="mt-4"
                    >
                      <div className="prose prose-headings:text-lg prose-p:leading-relaxed max-w-none">
                        <ReactMarkdown>{section.content}</ReactMarkdown>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </>
          ) : (
            <>
              <div className="prose mb-8 max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content.replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </>
          )}

          <div className="mb-6 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-3 font-semibold text-blue-900">Kluczowe punkty:</h3>
            <ul className="space-y-2">
              {currentLesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-blue-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Przejdź do quizu
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Content */}
      {activeTab === 'quiz' && (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          {!quizCompleted ? (
            <div>
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Quiz - {currentLesson.title}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Pytanie {currentQuestionIndex + 1} z {questions.length}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      Punkty: {score}
                    </span>
                  </div>
                </div>

                {currentQuestion && (
                  <div>
                    <div className="mb-4 flex items-center">
                      <span
                        className={`mr-3 rounded px-2 py-1 text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}
                      >
                        {currentQuestion.difficulty === 'easy'
                          ? 'Łatwe'
                          : currentQuestion.difficulty === 'medium'
                            ? 'Średnie'
                            : 'Trudne'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {currentQuestion.category}
                      </span>
                      <span className="ml-auto text-sm text-blue-600">
                        {currentQuestion.points} pkt
                      </span>
                    </div>

                    <h3 className="mb-6 text-lg font-medium">
                      {currentQuestion.question}
                    </h3>

                    <div className="mb-6 space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showExplanation}
                          className={`w-full rounded-lg border p-4 text-left transition-colors ${
                            selectedAnswer === index
                              ? showExplanation
                                ? index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-100 text-green-800'
                                  : 'border-red-500 bg-red-100 text-red-800'
                                : 'border-blue-500 bg-blue-100 text-blue-800'
                              : showExplanation && index === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-100 text-green-800'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span>{option}</span>
                            {showExplanation &&
                              index === currentQuestion.correctAnswer && (
                                <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                              )}
                            {showExplanation &&
                              selectedAnswer === index &&
                              index !== currentQuestion.correctAnswer && (
                                <XCircle className="ml-auto h-5 w-5 text-red-600" />
                              )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <div className="mb-6 rounded-lg bg-blue-50 p-4">
                        <h4 className="mb-2 font-semibold text-blue-900">Wyjaśnienie:</h4>
                        <p className="text-blue-800">{currentQuestion.explanation}</p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        onClick={resetQuiz}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Zacznij od nowa
                      </button>

                      {!showExplanation ? (
                        <button
                          onClick={handleAnswerSubmit}
                          disabled={selectedAnswer === null}
                          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Sprawdź odpowiedź
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                        >
                          {currentQuestionIndex < questions.length - 1
                            ? 'Następne pytanie'
                            : 'Zakończ quiz'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Award className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Quiz ukończony!</h2>

              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-gray-600">Punkty</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        (score / questions.reduce((sum, q) => sum + q.points, 0)) * 100
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Wynik</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {questions.length}
                    </div>
                    <div className="text-sm text-gray-600">Pytania</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="flex items-center rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Powtórz quiz
                </button>

                {currentLesson.nextLesson && (
                  <button
                    onClick={goToNextLesson}
                    className="flex items-center rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    Następna lekcja
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
