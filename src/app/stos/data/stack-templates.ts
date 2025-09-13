export interface Supplement {
  id: string
  name: string
  polishName: string
  category: string
  dosage: string
  timing: string
  price: string
  interactions: string[]
  synergies: string[]
  halfLife: string
  mechanism: string
  warnings: string[]
  contraindications: string[]
  brand: string
}

export interface StackItem {
  supplement: Supplement
  customDosage: string
  customTiming: string
  notes: string
}

export interface NeuroStack {
  id: string
  name: string
  polishName: string
  description: string
  polishDescription: string
  goal: string
  polishGoal: string
  items: StackItem[]
  totalCost: string
  monthlyCost: string
  cycleLength: string
  polishCycleLength: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  polishDifficulty: string
  tags: string[]
  polishTags: string[]
  createdAt: Date
  benefits: string[]
  polishBenefits: string[]
  considerations: string[]
  polishConsiderations: string[]
}

const supplements: Supplement[] = [
  {
    id: 'l-lysine',
    name: 'L-lysine PharmaLysine',
    polishName: 'L-lizyna PharmaLysine',
    category: 'Aminokwasy',
    dosage: '500-2000mg',
    timing: 'Na czczo',
    price: '3.99€',
    interactions: ['arginine'],
    synergies: ['magnesium', 'b6'],
    halfLife: '2-3h',
    mechanism: 'Prekursor neuroprzekaźników, wsparcie nastroju',
    warnings: ['Może nasilać działanie leków przeciwwirusowych'],
    contraindications: ['Ciąża, karmienie piersią - konsultacja lekarska'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'magnesium-l-threonate',
    name: 'Magnesium L-threonate',
    polishName: 'Magnez L-treonian',
    category: 'Minerały',
    dosage: '1000-2000mg',
    timing: 'Wieczorem',
    price: '7.49€',
    interactions: ['calcium', 'zinc', 'antybiotyki'],
    synergies: ['l-theanine', 'melatonin', 'vitamin-d'],
    halfLife: '6-8h',
    mechanism: 'Przekracza barierę krew-mózg, poprawa neuroplastyczności',
    warnings: ['Może powodować rozluźnienie jelit w dużych dawkach'],
    contraindications: ['Niewydolność nerek', 'blok serca'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC 50%',
    polishName: 'Alfa-GPC 50%',
    category: 'Cholina',
    dosage: '250-600mg',
    timing: 'Rano',
    price: '12.99€',
    interactions: ['antycholinergiki', 'leki na alzheimera'],
    synergies: ['huperzine', 'l-tyrosine', 'uridine'],
    halfLife: '4-6h',
    mechanism: 'Zwiększa acetylocholinę, wsparcie pamięci i skupienia',
    warnings: ['Może powodować bóle głowy u niektórych osób'],
    contraindications: ['Choroby układu nerwowego - konsultacja lekarska'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    polishName: 'L-teanina',
    category: 'Aminokwasy',
    dosage: '100-400mg',
    timing: 'Rano/Wieczorem',
    price: '8.99€',
    interactions: ['leki na ciśnienie', 'usypiające'],
    synergies: ['caffeine', 'magnesium', 'ashwagandha'],
    halfLife: '2-5h',
    mechanism: 'Zwiększa fale alfa, redukcja stresu bez sedacji',
    warnings: ['Może nasilać działanie leków uspokajających'],
    contraindications: ['Nadciśnienie - monitorowanie ciśnienia'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'rhodiola',
    name: 'Rhodiola Rosea 3%',
    polishName: 'Różeniec górski 3%',
    category: 'Adaptogeny',
    dosage: '200-600mg',
    timing: 'Rano',
    price: '9.99€',
    interactions: ['ssri', 'maoi', 'leki na cukrzycę'],
    synergies: ['ashwagandha', 'b-vitamins', 'magnesium'],
    halfLife: '4-6h',
    mechanism: 'Moduluje HPA axis, adaptacja do stresu',
    warnings: ['Może nasilać działanie leków przeciwdepresyjnych'],
    contraindications: ['Choroby afektywne dwubiegunowe', 'ciśnienie skokowe'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'ashwagandha-ksm',
    name: 'Ashwagandha KSM-66',
    polishName: 'Ashwagandha KSM-66',
    category: 'Adaptogeny',
    dosage: '300-600mg',
    timing: 'Wieczorem',
    price: '15.99€',
    interactions: ['leki tarczycowe', 'immunosupresanty', 'leki nasenne'],
    synergies: ['rhodiola', 'magnesium', 'l-theanine'],
    halfLife: '8-12h',
    mechanism: 'Redukuje kortyzol, poprawa odporności na stres',
    warnings: ['Może nasilać działanie leków immunosupresyjnych'],
    contraindications: ['Autoimmunologiczne choroby', 'niedoczynność tarczycy'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'bacopa-monnieri',
    name: 'Bacopa Monnieri 50%',
    polishName: 'Bakopa drobnolistna 50%',
    category: 'Zioła ajurwedyjskie',
    dosage: '300-600mg',
    timing: 'Z posiłkiem',
    price: '11.99€',
    interactions: ['leki tarczycowe', 'leki przeciwdrgawkowe'],
    synergies: ['ginkgo', "lion's-mane", 'omega-3'],
    halfLife: '8-12h',
    mechanism: 'Poprawa pamięci długotrwałej, neuroprotekcja',
    warnings: ['Wymaga 4-6 tygodni aby zadziałać'],
    contraindications: ['Choroby wątroby', 'bradycardia'],
    brand: 'Swiss Herbal'
  },
  {
    id: "lion's-mane",
    name: "Lion's Mane 10:1",
    polishName: 'Grzyb Mane 10:1',
    category: 'Grzyby nootropowe',
    dosage: '500-1000mg',
    timing: 'Rano',
    price: '18.99€',
    interactions: ['leki przeciwzakrzepowe'],
    synergies: ['bacopa', 'psilocybin-micro', 'niacin'],
    halfLife: '24h+',
    mechanism: 'Stymuluje NGF, neuroregeneracja',
    warnings: ['Może nasilać działanie leków przeciwzakrzepowych'],
    contraindications: ['Alergie na grzyby', 'zabiegi chirurgiczne'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'n-acetyl-l-tyrosine',
    name: 'N-Acetyl-L-Tyrosine',
    polishName: 'N-acetylo-L-tyrozyna',
    category: 'Aminokwasy',
    dosage: '350-700mg',
    timing: 'Rano',
    price: '14.99€',
    interactions: ['leki tarczycowe', 'maoi', 'leki na parkinsona'],
    synergies: ['alpha-gpc', 'rhodiola', 'b-vitamins'],
    halfLife: '2-3h',
    mechanism: 'Prekursor dopaminy i noradrenaliny',
    warnings: ['Może nasilać działanie leków na tarczycę'],
    contraindications: ['Choroby afektywne dwubiegunowe', 'nadciśnienie'],
    brand: 'Swiss Herbal'
  },
  {
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine 50%',
    polishName: 'Fosfatydyloseryna 50%',
    category: 'Fosfolipidy',
    dosage: '100-300mg',
    timing: 'Z posiłkiem',
    price: '16.99€',
    interactions: ['leki przeciwzakrzepowe', 'leki na cukrzycę'],
    synergies: ['dha', 'ginkgo', 'acetyl-l-carnitine'],
    halfLife: '4-6h',
    mechanism: 'Wsparcie błon komórkowych, pamięć',
    warnings: ['Może obniżać ciśnienie krwi'],
    contraindications: ['Niskie ciśnienie', 'zabiegi chirurgiczne'],
    brand: 'Swiss Herbal'
  }
]

export const stackTemplates: NeuroStack[] = [
  {
    id: 'beginner-focus',
    name: 'Beginner Focus Stack',
    polishName: 'Początkujący Stack Skupienia',
    description: 'Gentle introduction to nootropics with minimal side effects',
    polishDescription:
      'Łagodne wprowadzenie do nootropików z minimalnymi skutkami ubocznymi',
    goal: 'Basic focus and mental clarity',
    polishGoal: 'Podstawowe skupienie i jasność umysłu',
    items: [
      {
        supplement: supplements[3]!, // L-Theanine
        customDosage: '200mg',
        customTiming: 'Rano z kawą',
        notes: 'Zbalansowana energia bez stresu'
      },
      {
        supplement: supplements[0]!, // L-Lysine
        customDosage: '1000mg',
        customTiming: 'Na czczo',
        notes: 'Wsparcie neuroprzekaźników'
      }
    ],
    totalCost: '12.98€',
    monthlyCost: '38.94€',
    cycleLength: '4-6 weeks',
    polishCycleLength: '4-6 tygodni',
    difficulty: 'beginner',
    polishDifficulty: 'Początkujący',
    tags: ['focus', 'clarity', 'beginner', 'gentle'],
    polishTags: ['skupienie', 'jasność', 'początkujący', 'łagodny'],
    createdAt: new Date(),
    benefits: ['Improved focus', 'Reduced anxiety', 'Better mood', 'Gentle introduction'],
    polishBenefits: [
      'Poprawione skupienie',
      'Zredukowany niepokój',
      'Lepszy nastrój',
      'Łagodne wprowadzenie'
    ],
    considerations: [
      'Start with lower doses',
      'Monitor effects',
      'Combine with caffeine'
    ],
    polishConsiderations: [
      'Zacznij od niższych dawek',
      'Monitoruj efekty',
      'Połącz z kofeiną'
    ]
  },
  {
    id: 'advanced-focus',
    name: 'Advanced Focus Stack',
    polishName: 'Zaawansowany Stack Skupienia',
    description: 'Powerful combination for deep work and productivity',
    polishDescription: 'Potężna kombinacja dla głębokiej pracy i produktywności',
    goal: 'Maximum focus and cognitive performance',
    polishGoal: 'Maksymalne skupienie i wydajność poznawcza',
    items: [
      {
        supplement: supplements[2]!, // Alpha-GPC
        customDosage: '400mg',
        customTiming: 'Rano na czczo',
        notes: 'Podstawowy nootrop dla pamięci'
      },
      {
        supplement: supplements[8]!, // NALT
        customDosage: '500mg',
        customTiming: 'Rano',
        notes: 'Wsparcie dopaminy i motywacji'
      },
      {
        supplement: supplements[3]!, // L-Theanine
        customDosage: '200mg',
        customTiming: 'Z kofeiną',
        notes: 'Zbalansowana stymulacja'
      }
    ],
    totalCost: '44.97€',
    monthlyCost: '134.91€',
    cycleLength: '8-12 weeks',
    polishCycleLength: '8-12 tygodni',
    difficulty: 'advanced',
    polishDifficulty: 'Zaawansowany',
    tags: ['focus', 'productivity', 'advanced', 'stimulating'],
    polishTags: ['skupienie', 'produktywność', 'zaawansowany', 'stymulujący'],
    createdAt: new Date(),
    benefits: [
      'Enhanced memory',
      'Improved focus',
      'Better motivation',
      'Cognitive clarity'
    ],
    polishBenefits: [
      'Wzmocniona pamięć',
      'Poprawione skupienie',
      'Lepsza motywacja',
      'Jasność poznawcza'
    ],
    considerations: [
      'Monitor for overstimulation',
      'Cycle off every 8 weeks',
      'Stay hydrated'
    ],
    polishConsiderations: [
      'Monitoruj przedstymulowanie',
      'Zrób przerwę co 8 tygodni',
      'Pij dużo wody'
    ]
  },
  {
    id: 'stress-resilience',
    name: 'Stress Resilience Stack',
    polishName: 'Stack Odporności na Stres',
    description: 'Adaptogenic blend for stress management and emotional balance',
    polishDescription:
      'Adaptogenna mieszanka do zarządzania stresem i równowagi emocjonalnej',
    goal: 'Stress reduction and emotional stability',
    polishGoal: 'Redukcja stresu i stabilność emocjonalna',
    items: [
      {
        supplement: supplements[4]!, // Rhodiola
        customDosage: '400mg',
        customTiming: 'Rano na czczo',
        notes: 'Adaptogen dla energii'
      },
      {
        supplement: supplements[5]!, // Ashwagandha
        customDosage: '500mg',
        customTiming: 'Wieczorem',
        notes: 'Redukcja kortyzolu'
      },
      {
        supplement: supplements[1]!, // Magnesium
        customDosage: '1500mg',
        customTiming: 'Przed snem',
        notes: 'Relaksacja i sen'
      }
    ],
    totalCost: '33.47€',
    monthlyCost: '100.41€',
    cycleLength: '12-16 weeks',
    polishCycleLength: '12-16 tygodni',
    difficulty: 'intermediate',
    polishDifficulty: 'Średniozaawansowany',
    tags: ['stress', 'adaptogens', 'mood', 'sleep'],
    polishTags: ['stres', 'adaptogeny', 'nastrój', 'sen'],
    createdAt: new Date(),
    benefits: [
      'Reduced cortisol',
      'Better stress response',
      'Improved sleep',
      'Emotional balance'
    ],
    polishBenefits: [
      'Zredukowany kortyzol',
      'Lepsza odpowiedź na stres',
      'Poprawiony sen',
      'Równowaga emocjonalna'
    ],
    considerations: [
      'May take 2-4 weeks to notice effects',
      'Monitor thyroid function',
      'Cycle rhodiola'
    ],
    polishConsiderations: [
      'Efekty mogą wymagać 2-4 tygodni',
      'Monitoruj funkcję tarczycy',
      'Cyklicznie stosuj różeniec'
    ]
  },
  {
    id: 'memory-enhancement',
    name: 'Memory Enhancement Stack',
    polishName: 'Stack Wzmacniający Pamięć',
    description: 'Neuroplasticity-focused stack for memory formation and retention',
    polishDescription:
      'Stack skoncentrowany na neuroplastyczności dla formowania i zachowania pamięci',
    goal: 'Enhanced memory formation and recall',
    polishGoal: 'Wzmocnione formowanie i przypominanie pamięci',
    items: [
      {
        supplement: supplements[6]!, // Bacopa
        customDosage: '500mg',
        customTiming: 'Z posiłkiem',
        notes: 'Wymaga 4-6 tygodni na efekty'
      },
      {
        supplement: supplements[7]!, // Lion's Mane
        customDosage: '750mg',
        customTiming: 'Rano',
        notes: 'Neuroregeneracja i NGF'
      },
      {
        supplement: supplements[9]!, // Phosphatidylserine
        customDosage: '200mg',
        customTiming: 'Z posiłkiem',
        notes: 'Wsparcie błon komórkowych'
      }
    ],
    totalCost: '47.97€',
    monthlyCost: '143.91€',
    cycleLength: '12-16 weeks',
    polishCycleLength: '12-16 tygodni',
    difficulty: 'intermediate',
    polishDifficulty: 'Średniozaawansowany',
    tags: ['memory', 'neuroplasticity', 'long-term', 'neurogenesis'],
    polishTags: ['pamięć', 'neuroplastyczność', 'długoterminowy', 'neurogeneza'],
    createdAt: new Date(),
    benefits: [
      'Enhanced memory consolidation',
      'Improved recall',
      'Neuroprotection',
      'Long-term benefits'
    ],
    polishBenefits: [
      'Wzmocniona konsolidacja pamięci',
      'Poprawione przypominanie',
      'Neuroprotekcja',
      'Korzyści długoterminowe'
    ],
    considerations: [
      'Requires consistent use',
      'Effects build over time',
      'Take with food'
    ],
    polishConsiderations: [
      'Wymaga systematycznego stosowania',
      'Efekty budują się z czasem',
      'Przyjmuj z posiłkiem'
    ]
  },
  {
    id: 'sleep-optimization',
    name: 'Sleep Optimization Stack',
    polishName: 'Stack Optymalizacji Snu',
    description: 'Natural sleep support with relaxation and recovery benefits',
    polishDescription:
      'Naturalne wsparcie snu z korzyściami relaksacyjnymi i regeneracyjnymi',
    goal: 'Improved sleep quality and recovery',
    polishGoal: 'Poprawiona jakość snu i regeneracja',
    items: [
      {
        supplement: supplements[5]!, // Ashwagandha
        customDosage: '600mg',
        customTiming: '2h przed snem',
        notes: 'Redukcja kortyzolu na noc'
      },
      {
        supplement: supplements[1]!, // Magnesium
        customDosage: '2000mg',
        customTiming: '1h przed snem',
        notes: 'Relaksacja mięśni i umysłu'
      },
      {
        supplement: supplements[3]!, // L-Theanine
        customDosage: '400mg',
        customTiming: '30min przed snem',
        notes: 'Spokój bez sedacji'
      }
    ],
    totalCost: '32.47€',
    monthlyCost: '97.41€',
    cycleLength: 'Continuous',
    polishCycleLength: 'Ciągły',
    difficulty: 'beginner',
    polishDifficulty: 'Początkujący',
    tags: ['sleep', 'recovery', 'relaxation', 'stress'],
    polishTags: ['sen', 'regeneracja', 'relaksacja', 'stres'],
    createdAt: new Date(),
    benefits: [
      'Faster sleep onset',
      'Deeper sleep',
      'Better recovery',
      'Morning refreshment'
    ],
    polishBenefits: [
      'Szybsze zaśnięcie',
      'Głębszy sen',
      'Lepsza regeneracja',
      'Poranne odświeżenie'
    ],
    considerations: ['Start 2-3 hours before bed', 'Consistent timing', 'Dark room'],
    polishConsiderations: [
      'Zacznij 2-3h przed snem',
      'Systematyczne czasowanie',
      'Ciemny pokój'
    ]
  },
  {
    id: 'neuroprotection',
    name: 'Neuroprotection Stack',
    polishName: 'Stack Neuroprotekcyjny',
    description:
      'Comprehensive neuroprotection with antioxidants and anti-inflammatories',
    polishDescription: 'Kompleksowa neuroprotekcja z antyoksydantami i przeciwzapalnymi',
    goal: 'Long-term brain health and protection',
    polishGoal: 'Długoterminowe zdrowie i ochrona mózgu',
    items: [
      {
        supplement: supplements[7]!, // Lion's Mane
        customDosage: '1000mg',
        customTiming: 'Rano',
        notes: 'Neuroregeneracja i NGF'
      },
      {
        supplement: supplements[6]!, // Bacopa
        customDosage: '600mg',
        customTiming: 'Z posiłkiem',
        notes: 'Antyoksydacja i pamięć'
      },
      {
        supplement: supplements[9]!, // Phosphatidylserine
        customDosage: '300mg',
        customTiming: 'Z posiłkiem',
        notes: 'Ochrona błon komórkowych'
      }
    ],
    totalCost: '47.97€',
    monthlyCost: '143.91€',
    cycleLength: 'Continuous',
    polishCycleLength: 'Ciągły',
    difficulty: 'intermediate',
    polishDifficulty: 'Średniozaawansowany',
    tags: ['neuroprotection', 'longevity', 'antioxidants', 'anti-inflammatory'],
    polishTags: ['neuroprotekcja', 'długowieczność', 'antyoksydanty', 'przeciwzapalne'],
    createdAt: new Date(),
    benefits: [
      'Neuroprotection',
      'Anti-aging',
      'Cognitive preservation',
      'Long-term health'
    ],
    polishBenefits: [
      'Neuroprotekcja',
      'Przeciwstarzeniowe',
      'Zachowanie funkcji poznawczych',
      'Długoterminowe zdrowie'
    ],
    considerations: ['Long-term commitment', 'Consistent use', 'Healthy lifestyle'],
    polishConsiderations: [
      'Długoterminowe zaangażowanie',
      'Systematyczne stosowanie',
      'Zdrowy styl życia'
    ]
  }
]

export const getTemplateById = (id: string): NeuroStack | undefined =>
  stackTemplates.find((template) => template.id === id)

export const getTemplatesByDifficulty = (difficulty: string): NeuroStack[] =>
  stackTemplates.filter((template) => template.difficulty === difficulty)

export const getTemplatesByTag = (tag: string): NeuroStack[] =>
  stackTemplates.filter(
    (template) => template.tags.includes(tag) || template.polishTags.includes(tag)
  )

export const getRecommendedTemplates = (
  experience: string,
  goals: string[]
): NeuroStack[] => {
  let templates = stackTemplates

  if (experience === 'beginner') {
    templates = templates.filter((t) => t.difficulty === 'beginner')
  } else if (experience === 'intermediate') {
    templates = templates.filter((t) => t.difficulty !== 'advanced')
  }

  if (goals.length > 0) {
    templates = templates.filter((t) =>
      goals.some(
        (goal) =>
          t.tags.some((tag) => tag.toLowerCase().includes(goal.toLowerCase())) ||
          t.polishTags.some((tag) => tag.toLowerCase().includes(goal.toLowerCase()))
      )
    )
  }

  return templates
}

export default stackTemplates
