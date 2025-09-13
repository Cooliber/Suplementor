import { type Supplement } from '@/types/supplement'

export const supplements: Supplement[] = [
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    dosage: '5g daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Well-researched supplement known for improving strength, power, and cognitive function.',
    sideEffects: ['Gastrointestinal discomfort (rare)', 'Water retention'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/12701815/',
      'https://pubmed.ncbi.nlm.nih.gov/28615996/'
    ]
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    dosage: '300-600mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Choline compound that enhances acetylcholine levels in the brain, supporting memory and learning.',
    sideEffects: ['Headache', 'Nausea', 'Dizziness'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/21030620/',
      'https://pubmed.ncbi.nlm.nih.gov/18500924/'
    ]
  },
  {
    id: 'uridine-monophosphate',
    name: 'Uridine Monophosphate',
    dosage: '150-250mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Nucleotide that supports synaptic plasticity and phospholipid synthesis, crucial for brain health.',
    sideEffects: ['Mild gastrointestinal upset'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/21030620/',
      'https://pubmed.ncbi.nlm.nih.gov/16921107/'
    ]
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    dosage: '100-200mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Amino acid found in green tea, known for promoting relaxation without drowsiness and enhancing focus.',
    sideEffects: ['None commonly reported'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/18296328/',
      'https://pubmed.ncbi.nlm.nih.gov/18685108/'
    ]
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    dosage: '100-400mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'energy',
    startDate: '2024-01-01',
    notes: 'Stimulant that improves alertness, focus, and reaction time.',
    sideEffects: ['Anxiety', 'Jitters', 'Insomnia', 'Heart palpitations'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/18006208/',
      'https://pubmed.ncbi.nlm.nih.gov/17609251/'
    ]
  },
  {
    id: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    dosage: '300-450mg daily (50% bacosides)',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Traditional Ayurvedic herb known for its memory-enhancing and anxiolytic properties.',
    sideEffects: ['Nausea', 'Gastrointestinal upset'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/18611150/',
      'https://pubmed.ncbi.nlm.nih.gov/23795012/'
    ]
  },
  {
    id: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    dosage: '200-600mg daily (3% rosavins, 1% salidrosides)',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'mood',
    startDate: '2024-01-01',
    notes:
      'Adaptogenic herb that helps the body adapt to stress and improves mental and physical fatigue.',
    sideEffects: ['Insomnia (if taken late in day)', 'Irritability'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/17997521/',
      'https://pubmed.ncbi.nlm.nih.gov/22228617/'
    ]
  },
  {
    id: 'magnesium-l-threonate',
    name: 'Magnesium L-Threonate',
    dosage: '144mg elemental magnesium daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'health',
    startDate: '2024-01-01',
    notes:
      'Form of magnesium that can cross the blood-brain barrier, supporting memory and learning.',
    sideEffects: ['Drowsiness', 'Headache'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/20152123/',
      'https://pubmed.ncbi.nlm.nih.gov/24077916/'
    ]
  },
  {
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine (PS)',
    dosage: '100-300mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Phospholipid that is a key component of cell membranes, particularly abundant in the brain, supporting cognitive function.',
    sideEffects: ['Stomach upset', 'Insomnia'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/18636523/',
      'https://pubmed.ncbi.nlm.nih.gov/12065079/'
    ]
  },
  {
    id: 'ginkgo-biloba',
    name: 'Ginkgo Biloba',
    dosage: '120-240mg daily',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    category: 'cognitive',
    startDate: '2024-01-01',
    notes:
      'Herbal supplement known for improving blood flow to the brain and acting as an antioxidant.',
    sideEffects: ['Headache', 'Dizziness', 'Gastrointestinal upset'],
    contraindications: [],
    interactions: [],
    researchLinks: [
      'https://pubmed.ncbi.nlm.nih.gov/12404671/',
      'https://pubmed.ncbi.nlm.nih.gov/12020254/'
    ]
  }
]
