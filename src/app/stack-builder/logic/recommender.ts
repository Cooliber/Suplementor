import  { type Supplement } from '@/types/supplement';

import { interactionsMatrix } from '../../suplementy/data/interactions';
import { nootropicsDatabase } from '../../suplementy/data/nootropics-database';
import { supplementsDatabase } from '../../suplementy/data/supplements-database';


interface Recommendation {
  item: Supplement;
  synergyScore: number;
}

type SupplementItem = Supplement;

const goalKeywords: { [key: string]: string[] } = {
  'Wzmacnianie poznawcze': ['pamięć', 'koncentracja', 'kognitywne', 'uczenie', 'energia neuronalną', 'plastyczność', 'memory', 'concentration', 'cognitive', 'learning', 'neuronal energy', 'plasticity'],
  'Redukcja stresu': ['stres', 'kortyzol', 'relaksacja', 'GABA', 'lęk', 'adaptogen', 'stress', 'cortisol', 'relaxation', 'anxiety'],
  // System-based goals
  'układ nerwowy': ['nervous', 'neuron', 'neuro', 'pamięć', 'koncentracja', 'gaba', 'dopamina', 'serotonina', 'acetylcholina', 'plastyczność', 'synapsa', 'mózg'],
  'układ krążenia': ['cardiovascular', 'serce', 'krążenie', 'naczynia', 'krwi', 'tętno', 'omega3', 'koq10', 'ciśnienie'],
  'układ odpornościowy': ['immune', 'odporność', 'immuno', 'zapalenie', 'antyoksydant', 'witamina c', 'cynk', 'kurkumina'],
  'układ trawienny': ['digestive', 'trawienie', 'jelita', 'probiotyki', 'prebiotyki', 'enzymy', 'mikrobiom'],
  'układ endokrynny': ['endocrine', 'hormony', 'insulina', 'kortyzol', 'tarczyca', 'berberyna', 'chrom'],
  'układ mięśniowo-szkieletowy': ['musculoskeletal', 'kości', 'mięśnie', 'wapń', 'witamina d', 'magnez', 'kolagen'],
  'układ rozrodczy': ['reproductive', 'hormony', 'testosteron', 'maca', 'tongkat ali', 'witamina e'],
  'układ moczowy': ['urinary', 'mocz', 'cranberry', 'witamina b6', 'potassium'],
  'układ oddechowy': ['respiratory', 'płuca', 'oddech', 'nac', 'bromelaina', 'kwercetyna'],
  'układ skórny': ['integumentary', 'skóra', 'cynk', 'witamina a', 'antyoksydanty'],
  'układ sensoryczny': ['sensory', 'wzrok', 'słuch', 'luteina', 'witamina a', 'omega3']
};

const predefinedSynergies: { [key: string]: { pair: string; score: number; goal: string }[] } = {
  'L-Theanine': [
    { pair: 'Caffeine', score: 90, goal: 'Wzmacnianie poznawcze' }, // synergia dla koncentracji
  ],
  'Creatine': [
    { pair: 'Caffeine', score: 80, goal: 'Wzmacnianie poznawcze' }, // energy pathways
    { pair: 'Magnesium', score: 75, goal: 'Redukcja stresu' },
  ],
  'Ashwagandha': [
    { pair: 'Rhodiola Rosea', score: 85, goal: 'Redukcja stresu' },
    { pair: 'L-Theanine', score: 80, goal: 'Redukcja stresu' },
  ],
  'Bacopa Monnieri': [
    { pair: 'Alpha-GPC', score: 85, goal: 'Wzmacnianie poznawcze' }, // poprawa pamięci
    { pair: 'Phosphatidylserine', score: 80, goal: 'Wzmacnianie poznawcze' },
  ],
  'Piracetam': [
    { pair: 'Alpha-GPC', score: 90, goal: 'Wzmacnianie poznawcze' }, // cholinergic support
    { pair: 'Omega-3 Fish Oil', score: 75, goal: 'układ nerwowy' },
  ],
  'Aniracetam': [
    { pair: 'Alpha-GPC', score: 85, goal: 'Wzmacnianie poznawcze' },
    { pair: 'L-Theanine', score: 80, goal: 'Redukcja stresu' },
  ],
  'Oxiracetam': [
    { pair: 'Caffeine', score: 80, goal: 'Wzmacnianie poznawcze' },
    { pair: 'Alpha-GPC', score: 85, goal: 'Wzmacnianie poznawcze' },
  ],
  'Vitamin B12': [
    { pair: 'Vitamin D3', score: 75, goal: 'układ nerwowy' },
    { pair: 'Magnesium', score: 70, goal: 'Redukcja stresu' },
  ],
  'Vitamin D3': [
    { pair: 'Magnesium', score: 80, goal: 'układ nerwowy' },
    { pair: 'Omega-3 Fish Oil', score: 75, goal: 'układ krążenia' },
  ],
  'Magnesium': [
    { pair: 'Vitamin D3', score: 80, goal: 'układ nerwowy' },
    { pair: 'L-Theanine', score: 85, goal: 'Redukcja stresu' },
  ],
  'Rhodiola Rosea': [
    { pair: 'Ashwagandha', score: 85, goal: 'Redukcja stresu' },
    { pair: 'Panax Ginseng', score: 80, goal: 'Wzmacnianie poznawcze' },
  ],
  'Lion\'s Mane': [
    { pair: 'Bacopa Monnieri', score: 85, goal: 'Wzmacnianie poznawcze' }, // neurogeneza + pamięć
    { pair: 'Omega-3 Fish Oil', score: 80, goal: 'układ nerwowy' },
  ],
  'Alpha-GPC': [
    { pair: 'Citicoline', score: 90, goal: 'Wzmacnianie poznawcze' },
    { pair: 'Piracetam', score: 90, goal: 'Wzmacnianie poznawcze' },
  ],
  'Citicoline': [
    { pair: 'Alpha-GPC', score: 90, goal: 'Wzmacnianie poznawcze' },
    { pair: 'Omega-3 Fish Oil', score: 85, goal: 'układ nerwowy' },
  ],
  'Phosphatidylserine': [
    { pair: 'Omega-3 Fish Oil', score: 85, goal: 'Redukcja stresu' },
    { pair: 'Bacopa Monnieri', score: 80, goal: 'Wzmacnianie poznawcze' },
  ],
  'Ginkgo Biloba': [
    { pair: 'Panax Ginseng', score: 80, goal: 'Wzmacnianie poznawcze' },
    { pair: 'Omega-3 Fish Oil', score: 75, goal: 'układ krążenia' },
  ],
  'Panax Ginseng': [
    { pair: 'Ginkgo Biloba', score: 80, goal: 'Wzmacnianie poznawcze' },
    { pair: 'Rhodiola Rosea', score: 80, goal: 'Redukcja stresu' },
  ],
};

const contraindicationKeywords: { [key: string]: string[] } = {
  'heart disease': ['serca', 'heart', 'nadciśnienie', 'hypertension', 'tachykardia', 'tachycardia'],
  'pregnancy': ['ciąży', 'pregnancy'],
  // Add more
};

export interface RecommendResponse {
  recommendations: Recommendation[];
  validatedStack: boolean;
  warnings: string[];
  systemWarnings: string[];
  recommendedForSystem: string;
}

/**
 * Recommends stack based on goals and system
 * @param goals - Array of user goals (e.g., 'Wzmacnianie poznawcze', 'układ nerwowy')
 * @param userProfile - Optional user profile with age and conditions for safety filtering
 * @param currentStack - Optional current stack for interaction analysis
 * @returns Recommendation response with scored items, validation, and warnings
 */
export const recommendStack = (
  goals: string[],
  userProfile?: { age: number; conditions: string[] },
  currentStack?: string[]
): RecommendResponse => {
  // Combine both databases
  let candidates: SupplementItem[] = [...nootropicsDatabase, ...supplementsDatabase];

  // Filter by goals: match keywords in notes
  candidates = candidates.filter((item: SupplementItem) => {
    let textToSearch = '';
    textToSearch = item.notes?.toLowerCase() || '';
    return goals.some(goal => {
      const keywords = goalKeywords[goal] || [];
      return keywords.some(keyword => textToSearch.includes(keyword.toLowerCase()));
    });
  });

  // Exclude based on conditions: parse sideEffects
  if (userProfile?.conditions) {
    candidates = candidates.filter((item: SupplementItem) => {
      let safetyText = '';
      safetyText = item.sideEffects?.join(' ').toLowerCase() || '';
      return !userProfile.conditions.some(condition => {
        const keywords = contraindicationKeywords[condition.toLowerCase()] || [];
        return keywords.some(keyword => safetyText.includes(keyword.toLowerCase()));
      });
    });
  }

  // Age filter: for >60, prefer safe, low-risk
  if (userProfile?.age && userProfile.age > 60) {
    candidates = candidates.filter((item: SupplementItem) => {
      let safetyText = '';
      safetyText = item.sideEffects?.join(' ').toLowerCase() || '';
      return !safetyText.includes('tolerancję') && !safetyText.includes('uzależnienie') && !safetyText.includes('tolerance') && !safetyText.includes('addiction');
    });
  }

  // System-based scoring and warnings
  const systemWarnings: string[] = [];
  let recommendedForSystem = '';
  if (goals.some(g => g.startsWith('układ'))) {
    const systemGoal = goals.find(g => g.startsWith('układ')) || '';
    recommendedForSystem = systemGoal;

    // Find system from interactionsMatrix entries

    // System-specific incompatibilities/synergies
    candidates.forEach((item: SupplementItem) => {
      const itemName = item.name;
      const entry = interactionsMatrix[itemName as keyof typeof interactionsMatrix];
      if (entry && entry.system === systemGoal.replace('układ ', '').replace('owy', '')) {
        if (currentStack) {
          const incompatMatches = entry.incompatibleWith.filter((inc: string) => currentStack.includes(inc));
          if (incompatMatches.length > 0) {
            systemWarnings.push(`Ostrzeżenie: Interakcja w ${systemGoal} (Warning: Interaction in ${systemGoal}) - ${itemName} z ${incompatMatches.join(', ')}`);
          }
        }
      }
    });
  }

  // Score based on matches and synergies
  const recommendations: Recommendation[] = candidates.map((item: SupplementItem) => {
    let score = 50; // base score for matching goal

    // Identify item name for synergies - use name since Supplement doesn't have compoundName
    const itemName = item.name;
    const synergies = predefinedSynergies[itemName] || [];
    score += synergies.reduce((sum, syn) => {
      if (goals.includes(syn.goal)) {
        return sum + syn.score / 2;
      }
      return sum;
    }, 0);

    // System boost
    const entry = interactionsMatrix[itemName as keyof typeof interactionsMatrix];
    if (entry && entry.system && goals.some(g => g.includes(entry.system || ''))) {
      score += 30; // +30 for system match
    }

    // Integrate interactionsMatrix if currentStack provided
    let interactionScore = 0;
    const localWarnings: string[] = [];
    if (currentStack) {
      if (entry) {
        // Check incompatibilities with current stack
        const incompatMatches = entry.incompatibleWith.filter((inc: string) => currentStack.includes(inc));
        if (incompatMatches.length > 0) {
          interactionScore -= 50 * incompatMatches.length;
          localWarnings.push(`Potencjalna interakcja: ${itemName} z ${incompatMatches.join(', ')} - ryzyko wysokiego poziomu`);
        }
        // Check synergies
        const synergyMatches = entry.synergyWith.filter((syn: string) => currentStack.includes(syn));
        interactionScore += 20 * synergyMatches.length;
        if (synergyMatches.length > 0) {
          localWarnings.push(`Synergia: ${itemName} z ${synergyMatches.join(', ')} - +20 punktów`);
        }
        // Adjust score for risk level
        if (entry.riskLevel === 'high') interactionScore -= 30;
        else if (entry.riskLevel === 'medium') interactionScore -= 10;
      }
    }

    score += interactionScore;


    return { item, synergyScore: Math.max(0, Math.min(score, 100)) };
  });

  // Sort by score descending
  recommendations.sort((a, b) => b.synergyScore - a.synergyScore);

  // Validation for entire stack
  const warnings: string[] = [];
  let validatedStack = true;
  if (currentStack && currentStack.length > 1) {
    for (let i = 0; i < currentStack.length; i++) {
      for (let j = i + 1; j < currentStack.length; j++) {
        const item1 = currentStack[i];
        const item2 = currentStack[j];
        if (item1 && (item1 as keyof typeof interactionsMatrix) in interactionsMatrix) {
          const entry1 = interactionsMatrix[item1 as keyof typeof interactionsMatrix]!;
          if (item2 && entry1.incompatibleWith.includes(item2)) {
            warnings.push(`Ostrzeżenie: ${item1} i ${item2} - niezgodność (incompatible), ryzyko ${entry1.riskLevel}`);
            if (entry1.riskLevel === 'high') validatedStack = false;
          }
        }
        if (item2 && (item2 as keyof typeof interactionsMatrix) in interactionsMatrix) {
          const entry2 = interactionsMatrix[item2 as keyof typeof interactionsMatrix]!;
          if (item1 && entry2.incompatibleWith.includes(item1)) {
            warnings.push(`Ostrzeżenie: ${item2} i ${item1} - niezgodność (incompatible), ryzyko ${entry2.riskLevel}`);
            if (entry2.riskLevel === 'high') validatedStack = false;
          }
        }
      }
    }
  }

  return {
    recommendations: recommendations.slice(0, 5),
    validatedStack,
    warnings,
    systemWarnings,
    recommendedForSystem
  };
};