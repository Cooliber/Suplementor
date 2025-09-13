export interface InteractionEntry {
  incompatibleWith: string[];
  synergyWith: string[];
  riskLevel: 'low' | 'medium' | 'high';
  system?: string;
  dosageNotes?: string;
  evidenceLevel?: 'low' | 'medium' | 'high';
}

export const interactionsMatrix: Record<string, InteractionEntry> = {
  'L-Theanine': {
    incompatibleWith: [],
    synergyWith: ['Caffeine'],
    riskLevel: 'low'
  },
  'Caffeine': {
    incompatibleWith: ['Modafinil'],
    synergyWith: ['L-Theanine', 'Theobromine'],
    riskLevel: 'medium'
  },
  'Creatine': {
    incompatibleWith: [],
    synergyWith: ['Caffeine'],
    riskLevel: 'low'
  },
  'Bacopa Monnieri': {
    incompatibleWith: ['Thyroid medications'],
    synergyWith: ['Alpha-GPC'],
    riskLevel: 'low'
  },
  'Piracetam': {
    incompatibleWith: [],
    synergyWith: ['Choline sources', 'Magnez'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Aniracetam': {
    incompatibleWith: [],
    synergyWith: ['Alpha-GPC', 'Citicoline'],
    riskLevel: 'medium'
  },
  'Oxiracetam': {
    incompatibleWith: [],
    synergyWith: ['Tyrosine'],
    riskLevel: 'medium'
  },
  'Phenylpiracetam': {
    incompatibleWith: ['Stimulants'],
    synergyWith: ['L-Theanine'],
    riskLevel: 'high'
  },
  'Noopept': {
    incompatibleWith: [],
    synergyWith: ['Choline sources'],
    riskLevel: 'low'
  },
  'Modafinil': {
    incompatibleWith: ['Caffeine high doses'],
    synergyWith: [],
    riskLevel: 'high'
  },
  '5-HTP': {
    incompatibleWith: ["St John's Wort"],
    synergyWith: ['Vitamin B6'],
    riskLevel: 'medium'
  },
  'Ashwagandha': {
    incompatibleWith: ['Thyroid conditions'],
    synergyWith: ['Rhodiola Rosea', 'L-teanina', 'Rhodiola'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Rhodiola Rosea': {
    incompatibleWith: [],
    synergyWith: ['Ashwagandha', 'Kofeina'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Ginkgo Biloba': {
    incompatibleWith: ['Blood thinners'],
    synergyWith: ['Vinpocetine'],
    riskLevel: 'medium'
  },
  'Panax Ginseng': {
    incompatibleWith: ['Blood pressure meds'],
    synergyWith: ['Rhodiola Rosea'],
    riskLevel: 'medium'
  },
  "St John's Wort": {
    incompatibleWith: ['5-HTP', 'SSRIs analogs'],
    synergyWith: [],
    riskLevel: 'high'
  },
  'Alpha-GPC': {
    incompatibleWith: [],
    synergyWith: ['Piracetam', 'Aniracetam'],
    riskLevel: 'low'
  },
  'Citicoline': {
    incompatibleWith: [],
    synergyWith: ['Uridine Monophosphate'],
    riskLevel: 'low'
  },
  'Huperzine A': {
    incompatibleWith: ['Cholinesterase inhibitors'],
    synergyWith: [],
    riskLevel: 'medium'
  },
  'Vinpocetine': {
    incompatibleWith: ['Blood thinners'],
    synergyWith: ['Ginkgo Biloba'],
    riskLevel: 'medium'
  },
  'Phosphatidylserine': {
    incompatibleWith: [],
    synergyWith: ['Omega-3 Fatty Acids', 'Bacopa'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Magnesium': {
    incompatibleWith: [],
    synergyWith: ['Vitamin B6', 'Witamina D'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Zinc': {
    incompatibleWith: ['High copper'],
    synergyWith: ['Magnesium', 'Biotin'],
    riskLevel: 'low',
    system: 'integumentary'
  },
  'Turmeric (Curcumin)': {
    incompatibleWith: ['Blood thinners'],
    synergyWith: ['Piperine', 'Omega3', 'Witamina C'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '500-1000 mg/dzień z piperyną dla biodostępności',
    evidenceLevel: 'high'
  },
  'Czosnek': {
    incompatibleWith: [],
    synergyWith: ['Witamina K2'],
    riskLevel: 'low',
    system: 'cardiovascular'
  },
  'Probiotyki': {
    incompatibleWith: [],
    synergyWith: ['Prebiotyki', 'Cynk'],
    riskLevel: 'low',
    system: 'digestive',
    dosageNotes: '10^9 CFU/dzień, różne szczepy Lactobacillus/Bifidobacterium',
    evidenceLevel: 'high'
  },
  'Chrom': {
    incompatibleWith: [],
    synergyWith: ['Berberyna'],
    riskLevel: 'low',
    system: 'endocrine'
  },
  'Witamina D': {
    incompatibleWith: [],
    synergyWith: ['Wapń', 'Magnez', 'Omega3'],
    riskLevel: 'low',
    system: 'musculoskeletal',
    dosageNotes: '600-2000 IU/dzień z posiłkiem zawierającym tłuszcze',
    evidenceLevel: 'high'
  },
  'Cynk': {
    incompatibleWith: ['High copper'],
    synergyWith: ['Magnesium', 'Biotin', 'Probiotyki', 'Witamina C', 'Kwercetyna'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '15-30 mg/dzień, nie przekraczać 40 mg',
    evidenceLevel: 'high'
  },
  'Maca': {
    incompatibleWith: [],
    synergyWith: ['Tongkat Ali'],
    riskLevel: 'low',
    system: 'reproductive'
  },
  'Witamina E': {
    incompatibleWith: [],
    synergyWith: ['Selen'],
    riskLevel: 'low',
    system: 'reproductive'
  },
  'Potassium': {
    incompatibleWith: [],
    synergyWith: ['Magnesium'],
    riskLevel: 'low',
    system: 'urinary'
  },
  'Vitamin B6': {
    incompatibleWith: [],
    synergyWith: ['Cranberry'],
    riskLevel: 'low',
    system: 'urinary'
  },
  'Lutein': {
    incompatibleWith: [],
    synergyWith: ['Zinc'],
    riskLevel: 'low',
    system: 'sensory'
  },
  'Vitamin A': {
    incompatibleWith: [],
    synergyWith: ['Omega3'],
    riskLevel: 'low',
    system: 'sensory'
  },
  'Bacopa': {
    incompatibleWith: ['Thyroid medications'],
    synergyWith: ['Alpha-GPC', 'Fosfatydyloseryna'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Omega3': {
    incompatibleWith: [],
    synergyWith: ['KoQ10', 'Witamina D', 'Kurkumina', 'Vitamin C', 'Witamina D'],
    riskLevel: 'low',
    system: 'cardiovascular',
    dosageNotes: '1-2g/dzień EPA/DHA z posiłkiem',
    evidenceLevel: 'high'
  },
  'KoQ10': {
    incompatibleWith: [],
    synergyWith: ['Omega3'],
    riskLevel: 'low',
    system: 'cardiovascular'
  },
  'Berberyna': {
    incompatibleWith: [],
    synergyWith: ['Chrom'],
    riskLevel: 'low',
    system: 'endocrine'
  },
  'Wapń': {
    incompatibleWith: ['High iron'],
    synergyWith: ['Witamina D', 'Witamina K2'],
    riskLevel: 'low',
    system: 'musculoskeletal',
    dosageNotes: '1000-1200 mg/dzień z witaminą D',
    evidenceLevel: 'high'
  },
  'Selen': {
    incompatibleWith: [],
    synergyWith: ['Witamina E'],
    riskLevel: 'low',
    system: 'reproductive'
  },
  'Cranberry': {
    incompatibleWith: [],
    synergyWith: ['Vitamin B6'],
    riskLevel: 'low',
    system: 'urinary'
  },
  'Tongkat Ali': {
    incompatibleWith: [],
    synergyWith: ['Maca'],
    riskLevel: 'low',
    system: 'reproductive'
  },
  'Prebiotyki': {
    incompatibleWith: [],
    synergyWith: ['Probiotyki'],
    riskLevel: 'low',
    system: 'digestive'
  },
  'Fosfatydyloseryna': {
    incompatibleWith: [],
    synergyWith: ['Omega-3 Fatty Acids', 'Bacopa'],
    riskLevel: 'low',
    system: 'nervous'
  },
  'Piperyna': {
    incompatibleWith: [],
    synergyWith: ['Kurkumina'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '5-10 mg/dzień z kurkuminą',
    evidenceLevel: 'high'
  },
  'Kwercetyna': {
    incompatibleWith: [],
    synergyWith: ['Cynk', 'Bromelaina'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '500 mg/dzień',
    evidenceLevel: 'high'
  },
  'Bromelaina': {
    incompatibleWith: [],
    synergyWith: ['Kwercetyna', 'Kurkumina'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '500 mg/dzień na pusty żołądek',
    evidenceLevel: 'high'
  },
  'Miedź': {
    incompatibleWith: ['High zinc'],
    synergyWith: ['Cynk', 'Witamina C'],
    riskLevel: 'low',
    system: 'musculoskeletal',
    dosageNotes: '1-2 mg/dzień',
    evidenceLevel: 'high'
  },
  'Witamina K2': {
    incompatibleWith: [],
    synergyWith: ['Witamina D', 'Wapń'],
    riskLevel: 'low',
    system: 'musculoskeletal',
    dosageNotes: '100-200 mcg/dzień MK-7',
    evidenceLevel: 'high'
  },
  'NAC': {
    incompatibleWith: [],
    synergyWith: ['Alpha-Lipoic Acid', 'Witamina C', 'Glutation'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '600-1200 mg/dzień',
    evidenceLevel: 'high'
  },
  'Elderberry': {
    incompatibleWith: [],
    synergyWith: ['Witamina C'],
    riskLevel: 'low',
    system: 'immune',
    dosageNotes: '300-500 mg ekstraktu/dzień',
    evidenceLevel: 'high'
  }
};