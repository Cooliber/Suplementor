import { z } from 'zod';

// Evidence levels for research backing
export enum EvidenceLevel {
  STRONG = 'strong',        // Multiple large RCTs, meta-analyses
  MODERATE = 'moderate',    // Some RCTs, good observational data  
  WEAK = 'weak',           // Limited studies, case reports
  INSUFFICIENT = 'insufficient', // Theoretical only, no studies
  CONFLICTING = 'conflicting'    // Studies show mixed results
}

// Supplement interaction severity levels
export enum InteractionSeverity {
  SEVERE = 'severe',       // Dangerous combination, avoid
  MODERATE = 'moderate',   // May require dose adjustment or monitoring
  MINOR = 'minor',        // Usually not clinically significant
  BENEFICIAL = 'beneficial' // Synergistic, enhances effects
}

// Body system categories
export enum BodySystem {
  NERVOUS = 'nervous',
  CARDIOVASCULAR = 'cardiovascular', 
  DIGESTIVE = 'digestive',
  IMMUNE = 'immune',
  ENDOCRINE = 'endocrine',
  MUSCULOSKELETAL = 'musculoskeletal',
  RESPIRATORY = 'respiratory',
  URINARY = 'urinary',
  REPRODUCTIVE = 'reproductive',
  INTEGUMENTARY = 'integumentary'
}

// Mechanism of action categories
export enum MechanismOfAction {
  NEUROTRANSMITTER_MODULATION = 'neurotransmitter_modulation',
  ENZYME_INHIBITION = 'enzyme_inhibition',
  ENZYME_ACTIVATION = 'enzyme_activation',
  RECEPTOR_AGONISM = 'receptor_agonism',
  RECEPTOR_ANTAGONISM = 'receptor_antagonism',
  ANTIOXIDANT = 'antioxidant',
  ANTI_INFLAMMATORY = 'anti_inflammatory',
  MEMBRANE_STABILIZATION = 'membrane_stabilization',
  ION_CHANNEL_MODULATION = 'ion_channel_modulation',
  GENE_EXPRESSION = 'gene_expression',
  METABOLIC_ENHANCEMENT = 'metabolic_enhancement'
}

// User goals for personalization
export enum UserGoal {
  COGNITIVE_ENHANCEMENT = 'cognitive_enhancement',
  STRESS_REDUCTION = 'stress_reduction',
  SLEEP_IMPROVEMENT = 'sleep_improvement',
  ENERGY_BOOST = 'energy_boost',
  MOOD_ENHANCEMENT = 'mood_enhancement',
  ATHLETIC_PERFORMANCE = 'athletic_performance',
  RECOVERY = 'recovery',
  LONGEVITY = 'longevity',
  IMMUNE_SUPPORT = 'immune_support',
  GENERAL_HEALTH = 'general_health'
}

// Research study schema
export const ResearchStudySchema = z.object({
  pubmedId: z.string().optional(),
  title: z.string(),
  authors: z.array(z.string()),
  journal: z.string(),
  year: z.number(),
  studyType: z.enum(['rct', 'observational', 'meta_analysis', 'systematic_review', 'case_study', 'in_vitro', 'animal']),
  sampleSize: z.number().optional(),
  duration: z.string().optional(), // e.g., "12 weeks"
  dosage: z.string().optional(),
  findings: z.string(),
  limitations: z.string().optional(),
  evidenceLevel: z.nativeEnum(EvidenceLevel),
  url: z.string().url().optional()
});

// Dosage information schema
export const DosageInfoSchema = z.object({
  standard: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.string(),
    frequency: z.string()
  }),
  clinical: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.string(),
    frequency: z.string()
  }).optional(),
  bodyWeightBased: z.object({
    mgPerKg: z.number(),
    maxDose: z.number().optional()
  }).optional(),
  ageSpecific: z.array(z.object({
    ageRange: z.string(),
    dose: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string()
    })
  })).optional(),
  timing: z.array(z.enum(['empty_stomach', 'with_food', 'morning', 'evening', 'pre_workout', 'post_workout'])),
  cyclingRecommended: z.boolean().default(false),
  cyclingPattern: z.string().optional()
});

// Supplement interaction schema
export const SupplementInteractionSchema = z.object({
  supplementId: z.string(),
  supplementName: z.string(),
  severity: z.nativeEnum(InteractionSeverity),
  type: z.enum(['drug', 'supplement', 'food', 'condition']),
  description: z.string(),
  mechanism: z.string().optional(),
  recommendation: z.string(),
  timeGap: z.string().optional(), // e.g., "Take 2 hours apart"
  references: z.array(z.string()).optional()
});

// Biomarker tracking schema
export const BiomarkerSchema = z.object({
  name: z.string(),
  normalRange: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.string()
  }),
  supplementEffect: z.enum(['increases', 'decreases', 'modulates', 'no_effect']),
  monitoringFrequency: z.string(), // e.g., "monthly", "quarterly"
  clinicalSignificance: z.string()
});

// Enhanced supplement schema
export const EnhancedSupplementSchema = z.object({
  // Basic information
  id: z.string(),
  name: z.string(),
  commonNames: z.array(z.string()).default([]),
  category: z.string(),
  subcategory: z.string().optional(),
  
  // Chemical information
  activeCompounds: z.array(z.string()).default([]),
  molecularWeight: z.number().optional(),
  bioavailability: z.number().optional(), // percentage
  halfLife: z.string().optional(),
  
  // Dosage and administration
  dosageInfo: DosageInfoSchema,
  formulations: z.array(z.string()).default([]), // e.g., ['capsule', 'powder', 'liquid']
  
  // Effects and mechanisms
  primaryEffects: z.array(z.string()),
  secondaryEffects: z.array(z.string()).default([]),
  mechanismsOfAction: z.array(z.nativeEnum(MechanismOfAction)).default([]),
  targetSystems: z.array(z.nativeEnum(BodySystem)).default([]),
  onsetTime: z.string().optional(),
  peakTime: z.string().optional(),
  duration: z.string().optional(),
  
  // Safety information
  sideEffects: z.array(z.object({
    effect: z.string(),
    frequency: z.enum(['rare', 'uncommon', 'common', 'very_common']),
    severity: z.enum(['mild', 'moderate', 'severe']),
    reversible: z.boolean().default(true)
  })).default([]),
  contraindications: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  pregnancyCategory: z.enum(['A', 'B', 'C', 'D', 'X', 'unknown']).optional(),
  breastfeedingSafe: z.boolean().optional(),
  
  // Interactions
  interactions: z.array(SupplementInteractionSchema).default([]),
  
  // Research and evidence
  research: z.array(ResearchStudySchema).default([]),
  evidenceLevel: z.nativeEnum(EvidenceLevel),
  lastUpdated: z.date(),
  
  // Personalization factors
  userGoals: z.array(z.nativeEnum(UserGoal)).default([]),
  geneticFactors: z.array(z.object({
    gene: z.string(),
    variant: z.string(),
    impact: z.string()
  })).default([]),
  
  // Quality and sourcing
  qualityMarkers: z.array(z.string()).default([]),
  standardization: z.string().optional(),
  thirdPartyTested: z.boolean().default(false),
  organicCertified: z.boolean().default(false),
  
  // Monitoring
  biomarkers: z.array(BiomarkerSchema).default([]),
  labTests: z.array(z.string()).default([]),
  
  // Cost analysis
  costPerDose: z.number().optional(),
  costEffectiveness: z.enum(['high', 'medium', 'low']).optional(),
  
  // Additional metadata
  tags: z.array(z.string()).default([]),
  popularityScore: z.number().default(0),
  clinicalUse: z.boolean().default(false),
  fdaApproved: z.boolean().default(false),
  regulatoryStatus: z.string().optional()
});

// User supplement profile schema
export const UserSupplementProfileSchema = z.object({
  userId: z.string(),
  currentSupplements: z.array(z.object({
    supplementId: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    adherence: z.number(), // 0-100%
    effectiveness: z.number().optional(), // 1-10 rating
    sideEffects: z.array(z.string()).default([])
  })),
  goals: z.array(z.nativeEnum(UserGoal)),
  healthConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  preferences: z.object({
    budgetLimit: z.number().optional(),
    preferredFormulations: z.array(z.string()).default([]),
    avoidIngredients: z.array(z.string()).default([]),
    organicOnly: z.boolean().default(false)
  }),
  biomarkers: z.array(z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
    date: z.date(),
    reference: z.string().optional()
  })).default([]),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Supplement recommendation schema
export const SupplementRecommendationSchema = z.object({
  supplementId: z.string(),
  supplement: EnhancedSupplementSchema,
  score: z.number(), // 0-100
  reasoning: z.array(z.string()),
  warnings: z.array(z.string()).default([]),
  dosageRecommendation: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  evidenceScore: z.number(), // 0-100
  costEffectiveness: z.number(), // 0-100
  interactionRisk: z.enum(['none', 'low', 'medium', 'high']),
  monitoringRequired: z.array(z.string()).default([])
});

// Type exports
export type ResearchStudy = z.infer<typeof ResearchStudySchema>;
export type DosageInfo = z.infer<typeof DosageInfoSchema>;
export type SupplementInteraction = z.infer<typeof SupplementInteractionSchema>;
export type Biomarker = z.infer<typeof BiomarkerSchema>;
export type EnhancedSupplement = z.infer<typeof EnhancedSupplementSchema>;
export type UserSupplementProfile = z.infer<typeof UserSupplementProfileSchema>;
export type SupplementRecommendation = z.infer<typeof SupplementRecommendationSchema>;

// Helper functions for validation and type safety
export const validateEnhancedSupplement = (data: unknown): EnhancedSupplement | null => {
  try {
    return EnhancedSupplementSchema.parse(data);
  } catch (error) {
    console.error('Invalid supplement data:', error);
    return null;
  }
};

export const validateUserProfile = (data: unknown): UserSupplementProfile | null => {
  try {
    return UserSupplementProfileSchema.parse(data);
  } catch (error) {
    console.error('Invalid user profile data:', error);
    return null;
  }
};

// Utility functions
export const calculateInteractionRisk = (supplement: EnhancedSupplement, userProfile: UserSupplementProfile): 'none' | 'low' | 'medium' | 'high' => {
  const userSupplementIds = userProfile.currentSupplements.map(s => s.supplementId);
  const interactions = supplement.interactions.filter(i => 
    userSupplementIds.includes(i.supplementId) ||
    userProfile.medications.includes(i.supplementName)
  );

  if (interactions.some(i => i.severity === InteractionSeverity.SEVERE)) return 'high';
  if (interactions.some(i => i.severity === InteractionSeverity.MODERATE)) return 'medium';
  if (interactions.some(i => i.severity === InteractionSeverity.MINOR)) return 'low';
  return 'none';
};

export const getEvidenceScore = (supplement: EnhancedSupplement): number => {
  const weights = {
    [EvidenceLevel.STRONG]: 100,
    [EvidenceLevel.MODERATE]: 75,
    [EvidenceLevel.WEAK]: 50,
    [EvidenceLevel.INSUFFICIENT]: 25,
    [EvidenceLevel.CONFLICTING]: 40
  };

  let totalScore = 0;
  let totalWeight = 0;

  supplement.research.forEach(study => {
    const studyWeight = {
      'meta_analysis': 1.0,
      'systematic_review': 0.9,
      'rct': 0.8,
      'observational': 0.6,
      'case_study': 0.4,
      'animal': 0.3,
      'in_vitro': 0.2
    }[study.studyType] || 0.5;

    totalScore += weights[study.evidenceLevel] * studyWeight;
    totalWeight += studyWeight;
  });

  if (totalWeight === 0) return weights[supplement.evidenceLevel];
  return Math.round(totalScore / totalWeight);
};