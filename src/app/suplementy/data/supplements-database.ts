import { type Supplement } from '@/types/supplement'

export const supplementsDatabase: readonly Supplement[] = [
  {
    id: 'l-lysine-pharmalysine',
    name: 'L-lysine | PharmaLysineTM',
    dosage: '500-2000mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Esencjalny aminokwas niezbędny do syntezy białek, wzrostu i regeneracji tkanek. Wspiera zdrowie kości, stawów i mięśni.',
    sideEffects: [
      'Nie przekraczać zalecanej dawki',
      'Konsultacja z lekarzem w przypadku ciąży'
    ],
    contraindications: ['Niewydolność nerek', 'Hiperlizinemia'],
    interactions: [
      {
        supplementId: 'calcium',
        severity: 'low',
        description: 'Może zwiększać wchłanianie wapnia'
      }
    ],
    researchLinks: []
  },
  {
    id: 'lions-mane-extract-fruiting-body',
    name: "Lion's Mane Extract | Hericium erinaceus",
    dosage: '500-1000mg dziennie (ekstrakt 10:1)',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Potężny nootropowy grzyb stymulujący NGF (Nerve Growth Factor), wspierający neurogenezę i plastyczność mózgu. Wykazuje działanie neuroprotekcyjne i poprawia funkcje poznawcze.',
    sideEffects: ['Rozpocząć od niższej dawki', 'Monitorować reakcje alergiczne'],
    contraindications: [
      'Alergia na grzyby',
      'Autoimmunologiczne choroby (konsultacja lekarska)'
    ],
    interactions: [
      {
        supplementId: 'blood-thinners',
        severity: 'medium',
        description: 'Może nasilać działanie leków przeciwzakrzepowych'
      },
      {
        supplementId: 'immunomodulators',
        severity: 'low',
        description: 'Potencjalne interakcje z immunomodulatorami'
      }
    ],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/24266378/',
      'https://pubmed.ncbi.nlm.nih.gov/20834180/'
    ]
  },
  {
    id: 'dha-extract-20-vegetarian',
    name: 'DHA extract 20% | Vegetarian Omega-3',
    dosage: '250-1000mg DHA dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Docosahexaenoic acid (DHA) - główny składnik neuronów i mózgu. Wersja wegańska z alg.',
    sideEffects: ['Przechowywać w chłodnym miejscu', 'Chronić przed światłem'],
    contraindications: [
      'Alergia na ryby (dla wersji rybnej)',
      'Zaburzenia krzepnięcia krwi'
    ],
    interactions: [
      {
        supplementId: 'blood-thinners',
        severity: 'medium',
        description: 'Może zwiększać efekt leków przeciwzakrzepowych'
      },
      {
        supplementId: 'blood-pressure-meds',
        severity: 'low',
        description: 'Interakcje z lekami obniżającymi ciśnienie'
      }
    ],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/25740555/']
  },
  {
    id: 'dmpea-extract-99-eria-jarensis',
    name: 'DMPEA extract 99% | Eria jarensis',
    dosage: '100-300mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'energy',
    startDate: '2024-01-01',
    notes:
      'Silny ekstrakt z Eria jarensis wspierający wydolność fizyczną i psychiczną. Zwiększa produkcję dopaminy.',
    sideEffects: [
      'Nie stosować wieczorem',
      'Może wpływać na sen',
      'Konsultacja z lekarzem'
    ],
    contraindications: [],
    interactions: [],
    researchLinks: []
  },
  {
    id: 'angelica-astragalus-synergy',
    name: 'ANGELICA + ASTRAGALUS',
    dosage: '500-1000mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'mood',
    startDate: '2024-01-01',
    notes:
      'Wielka para adaptogenów z medycyny chińskiej. Wspiera odporność, zmniejsza stres i poprawia ogólną kondycję.',
    sideEffects: ['Nie stosować podczas ciąży', 'Konsultacja z lekarzem'],
    contraindications: ['Ciąża'],
    interactions: [],
    researchLinks: []
  },
  {
    id: 'european-ginseng-codonopsis',
    name: 'European ginseng extract 20:1 | Codonopsis pilosula',
    dosage: '300-600mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Chińska specjalność dla ciała i mózgu. Tradycyjny adaptogen wspierający witalność i funkcje poznawcze.',
    sideEffects: ['Nie stosować wieczorem', 'Może wpływać na sen'],
    contraindications: [],
    interactions: [],
    researchLinks: []
  },
  {
    id: 'quercetin-95-sophora-japonica',
    name: 'Quercetin 95% | Sophora japonica',
    dosage: '200-500mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Potężny flawonoid przeciwzapalny wspierający odporność. Naturalny antyoksydant z Sophora japonica.',
    sideEffects: [
      'Może powodować łagodne problemy trawienne',
      'Konsultacja z lekarzem przy chorobach nerek'
    ],
    contraindications: ['Choroby nerek'],
    interactions: [],
    researchLinks: []
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    dosage: '300-600 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Prekursor acetylocholiny, zwiększa poziom choliny w mózgu, poprawiając pamięć i uczenie się. Synergia z racetamami (PubMed: 12637119).',
    sideEffects: ['Możliwe bóle głowy', 'Unikać przy astmie'],
    contraindications: ['Astma'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/12637119/']
  },
  {
    id: 'citicoline',
    name: 'Citicoline',
    dosage: '250-500 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Dostarcza choliny i urydyny, wspiera syntezę fosfatydylocholiny w błonach komórkowych. Badania pokazują efekty w udarach (PubMed: 10974208). Synergia z DHA.',
    sideEffects: ['Rzadkie skutki'],
    contraindications: ['Epilepsja'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/10974208/']
  },
  {
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine',
    dosage: '100-300 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['20:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Kluczowy składnik błon komórkowych, redukuje kortyzol, poprawia pamięć. Synergia z Omega-3 (PubMed: 18456273).',
    sideEffects: ['Droga'],
    contraindications: ['Alergia na soję'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/18456273/']
  },
  {
    id: 'omega-3-fish-oil',
    name: 'Omega-3 Fish Oil',
    dosage: '1000-2000 mg EPA/DHA dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'EPA i DHA wspierają zdrowie mózgu, redukują zapalenie. Synergia z kurkuminą (PubMed: 25694085).',
    sideEffects: ['Rozrzedza krew'],
    contraindications: ['Alergia na ryby'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/25694085/']
  },
  {
    id: 'ginkgo-biloba',
    name: 'Ginkgo Biloba',
    dosage: '120-240 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Poprawia krążenie mózgowe, działa antyoksydacyjnie. Synergia z winpocetyną (PubMed: 11588457).',
    sideEffects: ['Rozrzedza krew'],
    contraindications: ['Przed operacją'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/11588457/']
  },
  {
    id: 'panax-ginseng',
    name: 'Panax Ginseng',
    dosage: '200-400 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Adaptogen zwiększający energię, poprawiający funkcje poznawcze. Synergia z ginkgo (PubMed: 20737519).',
    sideEffects: [],
    contraindications: ['Nadciśnienie'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/20737519/']
  }
]
