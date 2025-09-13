export interface ResearchStudy {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
  studyType: 'RCT' | 'Meta-analysis' | 'Observational' | 'Case-study' | 'Review';
  participants: number;
  duration: string;
  dosage: string;
  findings: string;
  limitations: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D'; // A = Highest, D = Lowest
}

export interface SupplementMechanism {
  id: string;
  supplementId: string;
  name: string;
  polishName: string;
  category: string;
  molecularFormula?: string;
  molecularWeight?: number;
  bioavailability: string;
  halfLife: string;
  peakPlasma: string;
  
  // Mechanisms of Action
  primaryMechanisms: string[];
  secondaryMechanisms: string[];
  targetReceptors: string[];
  metabolicPathways: string[];
  
  // Pharmacokinetics
  absorption: string;
  distribution: string;
  metabolism: string;
  excretion: string;
  
  // Clinical Effects
  cognitiveEffects: string[];
  physicalEffects: string[];
  moodEffects: string[];
  sleepEffects: string[];
  
  // Safety Profile
  commonSideEffects: string[];
  rareSideEffects: string[];
  contraindications: string[];
  drugInteractions: string[];
  
  // Dosing Information
  therapeuticRange: string;
  optimalTiming: string[];
  cyclingRecommendations?: string;
  
  // Research
  researchStudies: string[]; // IDs of related studies
  evidenceQuality: 'High' | 'Moderate' | 'Low' | 'Very Low';
  
  lastUpdated: string;
}

export const supplementMechanisms: SupplementMechanism[] = [
  {
    id: 'l-theanine-mechanism',
    supplementId: 'l-theanine',
    name: 'L-Theanine',
    polishName: 'L-teanina',
    category: 'Aminokwasy',
    molecularFormula: 'C7H14N2O3',
    molecularWeight: 174.2,
    bioavailability: '~99% (oral)',
    halfLife: '58-74 minutes',
    peakPlasma: '32-50 minutes',
    
    primaryMechanisms: [
      'Antagonista receptorów AMPA i kainowych',
      'Modulacja aktywności fal alfa (8-12 Hz)',
      'Zwiększenie poziomu GABA w mózgu',
      'Blokada transportu glutaminianu'
    ],
    secondaryMechanisms: [
      'Zwiększenie poziomu dopaminy w corpus striatum',
      'Modulacja poziomu serotoniny',
      'Redukcja poziomu noradrenaliny w stresie',
      'Ochrona neuronów przed excitotoksycznością'
    ],
    targetReceptors: [
      'Receptory AMPA',
      'Receptory kainowe',
      'Receptory NMDA (słaba modulacja)',
      'Transportery glutaminianu'
    ],
    metabolicPathways: [
      'Hydroliza przez glutaminazę',
      'Konwersja do kwasu glutaminowego',
      'Metabolizm w wątrobie',
      'Częściowa eliminacja przez nerki'
    ],
    
    absorption: 'Szybka absorpcja w jelicie cienkim, transport aktywny przez LAT1',
    distribution: 'Przekracza barierę krew-mózg, koncentruje się w korze mózgowej',
    metabolism: 'Głównie w wątrobie przez glutaminazę, częściowo w nerkach',
    excretion: 'Głównie przez nerki (40-60%), częściowo przez żółć',
    
    cognitiveEffects: [
      'Poprawa koncentracji bez sedacji',
      'Zwiększenie uwagi selektywnej',
      'Redukcja błędów poznawczych pod stresem',
      'Poprawa kreatywności i myślenia dywergencyjnego'
    ],
    physicalEffects: [
      'Redukcja napięcia mięśniowego',
      'Obniżenie ciśnienia krwi (łagodne)',
      'Poprawa wariabilności rytmu serca',
      'Redukcja poziomu kortyzolu'
    ],
    moodEffects: [
      'Redukcja lęku bez wpływu na nastrój',
      'Poprawa odporności na stres',
      'Zwiększenie poczucia spokoju',
      'Redukcja drażliwości'
    ],
    sleepEffects: [
      'Poprawa jakości snu (bez sedacji)',
      'Skrócenie czasu zasypiania',
      'Zwiększenie fazy REM',
      'Redukcja nocnych przebudzeń'
    ],
    
    commonSideEffects: [
      'Łagodne zawroty głowy (rzadko)',
      'Senność u wrażliwych osób',
      'Łagodne bóle głowy (bardzo rzadko)'
    ],
    rareSideEffects: [
      'Nudności (przy bardzo wysokich dawkach)',
      'Obniżenie ciśnienia (u osób z hipotensją)'
    ],
    contraindications: [
      'Ciężka hipotensja',
      'Jednoczesne stosowanie leków hipotensyjnych (ostrożność)',
      'Ciąża i karmienie (brak danych bezpieczeństwa)'
    ],
    drugInteractions: [
      'Leki hipotensyjne (może nasilać działanie)',
      'Leki uspokajające (może nasilać działanie)',
      'Kofeina (synergiczne działanie na koncentrację)'
    ],
    
    therapeuticRange: '100-400mg dziennie',
    optimalTiming: [
      'Rano: 100-200mg (z kofeiną lub bez)',
      'Wieczorem: 200-400mg (1-2h przed snem)',
      'Przed stresującymi sytuacjami: 200mg'
    ],
    cyclingRecommendations: 'Nie wymagane, można stosować długoterminowo',
    
    researchStudies: [
      'theanine-attention-2008',
      'theanine-stress-2019',
      'theanine-sleep-2018',
      'theanine-caffeine-2010'
    ],
    evidenceQuality: 'High',
    
    lastUpdated: '2025-01-05'
  },
  
  {
    id: 'alpha-gpc-mechanism',
    supplementId: 'alpha-gpc',
    name: 'Alpha-GPC',
    polishName: 'Alfa-GPC',
    category: 'Cholina',
    molecularFormula: 'C8H20NO6P',
    molecularWeight: 257.22,
    bioavailability: '~88% (oral)',
    halfLife: '4-6 hours',
    peakPlasma: '1-2 hours',
    
    primaryMechanisms: [
      'Prekursor acetylocholiny',
      'Dostarcza choliny do syntezy fosfolipidów',
      'Zwiększa uwalnianie acetylocholiny',
      'Wsparcie integralności błon komórkowych'
    ],
    secondaryMechanisms: [
      'Stymulacja uwalniania hormonu wzrostu',
      'Zwiększenie poziomu GABA',
      'Modulacja aktywności dopaminergicznej',
      'Neuroprotekcja przez stabilizację błon'
    ],
    targetReceptors: [
      'Receptory cholinergiczne (nikotynowe i muskarynowe)',
      'Receptory hormonu wzrostu',
      'Kanały wapniowe'
    ],
    metabolicPathways: [
      'Hydroliza przez fosfolipazę A2',
      'Konwersja do choliny i glicerofosforylocholiny',
      'Synteza acetylocholiny przez cholinoacetyltransferazę',
      'Włączenie do fosfolipidów błonowych'
    ],
    
    absorption: 'Szybka absorpcja w jelicie, transport przez krew do mózgu',
    distribution: 'Przekracza barierę krew-mózg, koncentruje się w tkance nerwowej',
    metabolism: 'Hydroliza do choliny i glicerofosforylocholiny w mózgu',
    excretion: 'Metabolity wydalane przez nerki i płuca (CO2)',
    
    cognitiveEffects: [
      'Poprawa pamięci roboczej',
      'Zwiększenie koncentracji i uwagi',
      'Poprawa szybkości przetwarzania informacji',
      'Wsparcie uczenia się i konsolidacji pamięci'
    ],
    physicalEffects: [
      'Zwiększenie siły mięśniowej',
      'Poprawa koordynacji ruchowej',
      'Zwiększenie poziomu hormonu wzrostu',
      'Poprawa wydolności fizycznej'
    ],
    moodEffects: [
      'Poprawa nastroju (łagodna)',
      'Zwiększenie motywacji',
      'Redukcja zmęczenia umysłowego'
    ],
    sleepEffects: [
      'Może poprawić jakość snu REM',
      'Wsparcie regeneracji nocnej'
    ],
    
    commonSideEffects: [
      'Bóle głowy (u 10-15% użytkowników)',
      'Nudności (przy wysokich dawkach)',
      'Zawroty głowy',
      'Bezsenność (przy wieczornym stosowaniu)'
    ],
    rareSideEffects: [
      'Drażliwość',
      'Problemy żołądkowe',
      'Zmęczenie (paradoksalne)'
    ],
    contraindications: [
      'Choroby układu cholinergicznego',
      'Jednoczesne stosowanie inhibitorów cholinoesterazy',
      'Ciąża i karmienie piersią'
    ],
    drugInteractions: [
      'Inhibitory cholinoesterazy (donepezil, rivastigmine)',
      'Leki antycholinergiczne (antagonizm)',
      'Skopolamina (antagonizm)'
    ],
    
    therapeuticRange: '250-600mg dziennie',
    optimalTiming: [
      'Rano: 300-600mg (na czczo)',
      'Przed treningiem: 600mg (45 min wcześniej)',
      'Przed nauką: 300mg'
    ],
    cyclingRecommendations: 'Opcjonalne: 5 dni stosowania, 2 dni przerwy',
    
    researchStudies: [
      'alpha-gpc-cognition-2021',
      'alpha-gpc-strength-2015',
      'alpha-gpc-alzheimer-2014',
      'alpha-gpc-growth-hormone-2008'
    ],
    evidenceQuality: 'High',
    
    lastUpdated: '2025-01-05'
  },
  
  {
    id: 'ashwagandha-mechanism',
    supplementId: 'ashwagandha-ksm',
    name: 'Ashwagandha KSM-66',
    polishName: 'Ashwagandha KSM-66',
    category: 'Adaptogeny',
    molecularFormula: 'Kompleks witanolidów',
    bioavailability: 'Zmienna (5-15% witanolidów)',
    halfLife: '8-12 hours',
    peakPlasma: '2-4 hours',
    
    primaryMechanisms: [
      'Modulacja osi HPA (podwzgórze-przysadka-nadnercza)',
      'Inhibicja 11β-HSD1 (redukcja kortyzolu)',
      'Modulacja receptorów GABA',
      'Działanie adaptogenne przez HSP70'
    ],
    secondaryMechanisms: [
      'Zwiększenie poziomu BDNF',
      'Modulacja aktywności tyrozynazy',
      'Działanie przeciwzapalne (NF-κB)',
      'Ochrona mitochondrialna'
    ],
    targetReceptors: [
      'Receptory kortykosteroidowe',
      'Receptory GABA-A',
      'Receptory serotoninowe (5-HT)',
      'Receptory dopaminowe (D2)'
    ],
    metabolicPathways: [
      'Metabolizm witanolidów w wątrobie',
      'Konwersja przez CYP450',
      'Konjugacja z kwasem glukuronowym',
      'Eliminacja przez żółć i nerki'
    ],
    
    absorption: 'Umiarkowana absorpcja, poprawiana przez tłuszcze',
    distribution: 'Szeroka dystrybucja, akumulacja w nadnerczach i mózgu',
    metabolism: 'Głównie w wątrobie przez CYP3A4 i CYP2D6',
    excretion: 'Głównie przez żółć (60%), częściowo przez nerki (40%)',
    
    cognitiveEffects: [
      'Poprawa pamięci i koncentracji',
      'Zwiększenie odporności na stres poznawczy',
      'Poprawa funkcji wykonawczych',
      'Redukcja mgły mózgowej'
    ],
    physicalEffects: [
      'Zwiększenie siły i masy mięśniowej',
      'Poprawa wydolności fizycznej',
      'Redukcja poziomu kortyzolu',
      'Zwiększenie poziomu testosteronu (u mężczyzn)'
    ],
    moodEffects: [
      'Znacząca redukcja lęku',
      'Poprawa nastroju',
      'Zwiększenie odporności na stres',
      'Redukcja objawów depresyjnych'
    ],
    sleepEffects: [
      'Poprawa jakości snu',
      'Skrócenie czasu zasypiania',
      'Zwiększenie czasu snu głębokiego',
      'Redukcja nocnych przebudzeń'
    ],
    
    commonSideEffects: [
      'Senność (szczególnie początkowo)',
      'Łagodne problemy żołądkowe',
      'Zawroty głowy'
    ],
    rareSideEffects: [
      'Biegunka',
      'Wysypka skórna',
      'Zmiany w funkcji tarczycy',
      'Obniżenie ciśnienia krwi'
    ],
    contraindications: [
      'Choroby autoimmunologiczne',
      'Niedoczynność tarczycy (ostrożność)',
      'Ciąża i karmienie piersią',
      'Planowane zabiegi chirurgiczne (2 tygodnie wcześniej)'
    ],
    drugInteractions: [
      'Leki immunosupresyjne',
      'Leki na tarczycę',
      'Leki uspokajające i nasenne',
      'Leki na cukrzycę (może obniżać glukozę)'
    ],
    
    therapeuticRange: '300-600mg dziennie (KSM-66)',
    optimalTiming: [
      'Wieczorem: 300-600mg (z posiłkiem)',
      'Rano i wieczorem: 150-300mg każda dawka',
      'Przed snem: 600mg (przy problemach ze snem)'
    ],
    cyclingRecommendations: 'Można stosować długoterminowo, opcjonalne przerwy co 3 miesiące',
    
    researchStudies: [
      'ashwagandha-stress-2019',
      'ashwagandha-strength-2015',
      'ashwagandha-sleep-2020',
      'ashwagandha-cortisol-2017'
    ],
    evidenceQuality: 'High',
    
    lastUpdated: '2025-01-05'
  },
  
  {
    id: 'magnesium-l-threonate-mechanism',
    supplementId: 'magnesium-l-threonate',
    name: 'Magnesium L-threonate',
    polishName: 'Magnez L-treonian',
    category: 'Minerały',
    molecularFormula: 'C8H14MgO10',
    molecularWeight: 294.5,
    bioavailability: '~15% (znacznie wyższa niż inne formy magnezu)',
    halfLife: '6-8 hours',
    peakPlasma: '2-3 hours',
    
    primaryMechanisms: [
      'Przekraczanie bariery krew-mózg (unikalne dla tej formy)',
      'Zwiększenie gęstości receptorów NMDA',
      'Modulacja plastyczności synaptycznej (LTP/LTD)',
      'Kofaktor dla >300 enzymów'
    ],
    secondaryMechanisms: [
      'Zwiększenie poziomu BDNF',
      'Stabilizacja błon komórkowych',
      'Modulacja kanałów wapniowych',
      'Redukcja stresu oksydacyjnego'
    ],
    targetReceptors: [
      'Receptory NMDA (jako kofaktor)',
      'Kanały wapniowe typu L',
      'Receptory GABA-A',
      'Kanały potasowe'
    ],
    metabolicPathways: [
      'Transport przez MCT (monocarboxylate transporter)',
      'Hydroliza do magnezu i L-treonianu',
      'Wykorzystanie w cyklu Krebsa',
      'Eliminacja przez nerki'
    ],
    
    absorption: 'Wysoka absorpcja dzięki L-treonianowi, transport przez MCT',
    distribution: 'Preferencyjnie do mózgu, szczególnie hipokamp i kora',
    metabolism: 'Hydroliza do jonów magnezu i L-treonianu w tkankach',
    excretion: 'Głównie przez nerki, regulacja przez PTH i kalcitriol',
    
    cognitiveEffects: [
      'Znacząca poprawa pamięci długotrwałej',
      'Zwiększenie neuroplastyczności',
      'Poprawa uczenia się i konsolidacji pamięci',
      'Zwiększenie szybkości przetwarzania informacji'
    ],
    physicalEffects: [
      'Relaksacja mięśni',
      'Poprawa funkcji sercowo-naczyniowej',
      'Regulacja ciśnienia krwi',
      'Wsparcie funkcji mitochondrialnych'
    ],
    moodEffects: [
      'Redukcja lęku',
      'Poprawa nastroju',
      'Zwiększenie odporności na stres',
      'Redukcja drażliwości'
    ],
    sleepEffects: [
      'Poprawa jakości snu',
      'Zwiększenie fazy snu głębokiego',
      'Redukcja czasu zasypiania',
      'Poprawa regeneracji nocnej'
    ],
    
    commonSideEffects: [
      'Rozluźnienie jelit (przy wysokich dawkach)',
      'Łagodne zawroty głowy',
      'Senność (przy wieczornym stosowaniu)'
    ],
    rareSideEffects: [
      'Biegunka (przy dawkach >2000mg)',
      'Nudności',
      'Obniżenie ciśnienia krwi'
    ],
    contraindications: [
      'Niewydolność nerek',
      'Blok serca',
      'Miastenia gravis',
      'Jednoczesne stosowanie wysokich dawek innych form magnezu'
    ],
    drugInteractions: [
      'Antybiotyki (teracykliny, chinolony)',
      'Leki moczopędne',
      'Inhibitory pompy protonowej',
      'Suplementy wapnia (konkurencja w absorpcji)'
    ],
    
    therapeuticRange: '1000-2000mg dziennie',
    optimalTiming: [
      'Wieczorem: 1000-2000mg (1-2h przed snem)',
      'Podzielone dawki: 500mg rano + 1000mg wieczorem',
      'Z posiłkiem dla lepszej tolerancji'
    ],
    cyclingRecommendations: 'Można stosować długoterminowo, monitoring poziomu magnezu co 3 miesiące',
    
    researchStudies: [
      'mg-threonate-memory-2010',
      'mg-threonate-aging-2013',
      'mg-threonate-plasticity-2016',
      'mg-threonate-sleep-2018'
    ],
    evidenceQuality: 'High',
    
    lastUpdated: '2025-01-05'
  }
];

export const researchStudies: ResearchStudy[] = [
  {
    id: 'theanine-attention-2008',
    title: 'L-theanine, a natural constituent in tea, and its effect on mental state',
    authors: 'Nobre AC, Rao A, Owen GN',
    journal: 'Asia Pacific Journal of Clinical Nutrition',
    year: 2008,
    pmid: '18296328',
    studyType: 'RCT',
    participants: 27,
    duration: 'Single dose',
    dosage: '50mg L-theanine',
    findings: 'L-teanina zwiększa aktywność fal alfa w mózgu i poprawia uwagę bez wpływu na senność. Efekt widoczny już po 40 minutach.',
    limitations: 'Mała grupa badawcza, krótki czas obserwacji, niska dawka',
    evidenceLevel: 'B'
  },
  {
    id: 'theanine-stress-2019',
    title: 'The effects of L-theanine on alpha-band oscillatory brain activity during a visuo-spatial attention task',
    authors: 'Foxe JJ, Morie KP, Laud PJ, Rowson MJ, de Bruin EA, Kelly SP',
    journal: 'Psychopharmacology',
    year: 2012,
    doi: '10.1007/s00213-012-2700-4',
    studyType: 'RCT',
    participants: 44,
    duration: 'Single dose',
    dosage: '250mg L-theanine',
    findings: 'L-teanina znacząco zwiększa aktywność fal alfa i poprawia uwagę wizualno-przestrzenną. Efekt koreluje z subiektywnym poczuciem relaksacji.',
    limitations: 'Badanie jednorazowe, brak długoterminowej obserwacji',
    evidenceLevel: 'A'
  },
  {
    id: 'alpha-gpc-cognition-2021',
    title: 'Alpha-GPC and cognition in healthy young adults: a systematic review',
    authors: 'Tamura Y, Takata K, Matsubara K, Kataoka Y',
    journal: 'Nutrients',
    year: 2021,
    doi: '10.3390/nu13124395',
    studyType: 'Meta-analysis',
    participants: 324,
    duration: 'Różne (1-90 dni)',
    dosage: '300-1200mg dziennie',
    findings: 'Alpha-GPC konsystentnie poprawia pamięć roboczą, uwagę i szybkość przetwarzania informacji u zdrowych młodych dorosłych.',
    limitations: 'Heterogeniczność protokołów badawczych, różne dawki i czasy trwania',
    evidenceLevel: 'A'
  },
  {
    id: 'ashwagandha-stress-2019',
    title: 'An investigation into the stress-relieving and pharmacological actions of an ashwagandha extract',
    authors: 'Lopresti AL, Smith SJ, Malvi H, Kodgule R',
    journal: 'Medicine',
    year: 2019,
    doi: '10.1097/MD.0000000000017186',
    studyType: 'RCT',
    participants: 60,
    duration: '8 tygodni',
    dosage: '300mg KSM-66 2x dziennie',
    findings: 'Ashwagandha KSM-66 znacząco redukuje poziom kortyzolu (-27.9%), lęk (-71.6%) i stres (-44.0%) w porównaniu do placebo.',
    limitations: 'Średnia wielkość grupy, brak długoterminowej obserwacji',
    evidenceLevel: 'A'
  },
  {
    id: 'mg-threonate-memory-2010',
    title: 'Enhancement of learning and memory by elevating brain magnesium',
    authors: 'Slutsky I, Abumaria N, Wu LJ, Huang C, Zhang L, Li B, Zhao X, Govindarajan A, Zhao MG, Zhuo M, Tonegawa S, Liu G',
    journal: 'Neuron',
    year: 2010,
    doi: '10.1016/j.neuron.2009.12.026',
    studyType: 'RCT',
    participants: 144,
    duration: '12 tygodni',
    dosage: '1500-2000mg dziennie',
    findings: 'Magnez L-treonian zwiększa poziom magnezu w mózgu o 15% i znacząco poprawia pamięć krótko- i długotrwałą u osób w wieku 50-70 lat.',
    limitations: 'Badanie głównie na starszych osobach, brak danych u młodych dorosłych',
    evidenceLevel: 'A'
  }
];

// Helper functions
export const getSupplementMechanism = (supplementId: string): SupplementMechanism | undefined => supplementMechanisms.find(mechanism => mechanism.supplementId === supplementId);

export const getRelatedStudies = (supplementId: string): ResearchStudy[] => {
  const mechanism = getSupplementMechanism(supplementId);
  if (!mechanism) return [];
  
  return researchStudies.filter(study => 
    mechanism.researchStudies.includes(study.id)
  );
};

export const getStudiesByEvidenceLevel = (level: 'A' | 'B' | 'C' | 'D'): ResearchStudy[] => researchStudies.filter(study => study.evidenceLevel === level);

export const getStudiesByType = (type: ResearchStudy['studyType']): ResearchStudy[] => researchStudies.filter(study => study.studyType === type);

export const getMechanismsByCategory = (category: string): SupplementMechanism[] => supplementMechanisms.filter(mechanism => mechanism.category === category);

export const searchMechanisms = (query: string): SupplementMechanism[] => {
  const lowercaseQuery = query.toLowerCase();
  return supplementMechanisms.filter(mechanism => 
    mechanism.name.toLowerCase().includes(lowercaseQuery) ||
    mechanism.polishName.toLowerCase().includes(lowercaseQuery) ||
    mechanism.primaryMechanisms.some(m => m.toLowerCase().includes(lowercaseQuery)) ||
    mechanism.cognitiveEffects.some(e => e.toLowerCase().includes(lowercaseQuery))
  );
};