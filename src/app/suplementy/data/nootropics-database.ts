import { type Supplement } from '@/types/supplement'

export const nootropicsDatabase: Supplement[] = [
  {
    id: 'creatine',
    name: 'Creatine',
    dosage: '2-5 g dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Zwiększa zapasy fosfokreatyny w mózgu, poprawiając produkcję ATP i energię neuronalną.',
    sideEffects: [
      'Może powodować zaburzenia żołądkowo-jelitowe w wysokich dawkach. Zapewnij odpowiednie nawodnienie.'
    ],
    contraindications: ['Należy zapewnić odpowiednie nawodnienie'],
    interactions: [],
    researchLinks: []
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    dosage: '100-400 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Zwiększa fale alfa w mózgu, promując relaksację bez sedacji. Moduluje neuroprzekaźniki takie jak GABA, serotonina i dopamina. Synergia z kofeiną dla lepszej koncentracji (PubMed: 18296328).',
    sideEffects: ['Może nieznacznie obniżać ciśnienie krwi'],
    contraindications: [],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/18296328/']
  },
  {
    id: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    dosage: '300-600 mg 50% bakozydów dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Zawiera bakozydy, które poprawiają komunikację synaptyczną, zwiększają arborizację dendrytów i wykazują efekty antyoksydacyjne. Badania pokazują poprawę pamięci po 12 tygodniach (PubMed: 22747190).',
    sideEffects: [
      'Może powodować nudności, zaburzenia żołądkowo-jelitowe i suchość w ustach'
    ],
    contraindications: ['Ciąża'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/22747190/']
  },
  {
    id: 'piracetam',
    name: 'Piracetam',
    dosage: '1200-4800 mg dziennie, podzielone na dawki',
    frequency: 'daily',
    timeOfDay: ['08:00', '14:00', '20:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Moduluje receptory AMPA i poprawia przepływ krwi w mózgu, zwiększając plastyczność synaptyczną. Synergia z choliną dla lepszych efektów (PubMed: 12025849).',
    sideEffects: ['Możliwe skutki uboczne: bóle głowy, nerwowość'],
    contraindications: ['Problemy nerkowe'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/12025849/']
  },
  {
    id: 'aniracetam',
    name: 'Aniracetam',
    dosage: '750-1500 mg dziennie, podzielone na dawki',
    frequency: 'daily',
    timeOfDay: ['08:00', '14:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Działa na receptory AMPA i zwiększa uwalnianie dopaminy oraz serotoniny, poprawiając pamięć i redukując lęk. Badania wskazują na efekty antylękowe (PubMed: 15378679).',
    sideEffects: ['Możliwe: niepokój, bezsenność'],
    contraindications: ['Padaczka'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/15378679/']
  },
  {
    id: 'oxiracetam',
    name: 'Oxiracetam',
    dosage: '750-1500 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Stymuluje receptory glutaminianowe i zwiększa aktywność acetylcholiny, poprawiając koncentrację i pamięć logiczną. Synergia z kofeiną dla energii poznawczej (PubMed: 16908950).',
    sideEffects: ['Może powodować bezsenność'],
    contraindications: ['Nadciśnienie'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/16908950/']
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    dosage: '50-200 mg na porcję',
    frequency: 'as-needed',
    timeOfDay: ['08:00'],
    category: 'energy',
    startDate: '2024-01-01',
    notes:
      'Blokuje receptory adenozyny, zwiększając uwalnianie dopaminy i noradrenaliny. Synergia z L-teaniną dla zrównoważonej stymulacji (PubMed: 18681988).',
    sideEffects: ['Nadmiar: niepokój, tachykardia'],
    contraindications: [],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/18681988/']
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    dosage: '500-1000 mcg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Niezbędna dla syntezy DNA i czerwonych krwinek, wspiera funkcje nerwowe. Niedobór powoduje neuropatię. Badania pokazują poprawę poznawczą u wegan (PubMed: 29387398). Synergia z B9 dla metylacji.',
    sideEffects: ['Rzadkie skutki uboczne'],
    contraindications: [],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/29387398/']
  },
  {
    id: 'vitamin-d3',
    name: 'Vitamin D3',
    dosage: '1000-4000 IU dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Reguluje wapń i fosfor, wspiera zdrowie kości i moduluje immunitet. Niedobór związany z depresją. Synergia z K2 dla lepszego wchłaniania (PubMed: 30078710).',
    sideEffects: [],
    contraindications: ['Nie przekraczać 10000 IU'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/30078710/']
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    dosage: '300-400 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['20:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Kofaktor ponad 300 enzymów, relaksuje mięśnie i wspiera neurotransmisję. Synergia z witaminą D dla lepszej absorpcji (PubMed: 29480918).',
    sideEffects: ['Może powodować biegunkę w wysokich dawkach'],
    contraindications: [],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/29480918/']
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    dosage: '300-600 mg ekstraktu dziennie',
    frequency: 'twice-daily',
    timeOfDay: ['08:00', '20:00'],
    category: 'mood',
    startDate: '2024-01-01',
    notes:
      'Adaptogen redukujący kortyzol, poprawiający wytrzymałość i funkcje poznawcze. Synergia z rhodiola dla stresu (PubMed: 23439798).',
    sideEffects: ['Może powodować senność'],
    contraindications: ['Ciąża'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/23439798/']
  },
  {
    id: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    dosage: '200-400 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'mood',
    startDate: '2024-01-01',
    notes:
      'Adaptogen zwiększający odporność na stres, poprawiający nastrój i funkcje poznawcze. Synergia z ashwagandhą (PubMed: 22228617).',
    sideEffects: [],
    contraindications: ['Bipolar'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/22228617/']
  },
  {
    id: 'lions-mane',
    name: "Lion's Mane",
    dosage: '1000-3000 mg dziennie',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Stymuluje czynnik wzrostu nerwów (NGF), wspiera neurogenezę. Badania pokazują poprawę pamięci (PubMed: 24266378). Synergia z PS dla mózgu.',
    sideEffects: ['Rzadkie alergie'],
    contraindications: ['Astma'],
    interactions: [],
    researchLinks: ['https://pubmed.ncbi.nlm.nih.gov/24266378/']
  }
]
