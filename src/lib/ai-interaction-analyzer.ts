import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { advancedDebugger, DebugCategory } from './advanced-debugging';
import { EnhancedSupplement } from '@/types/enhanced-supplement';

// Comprehensive interaction analysis schema
const InteractionAnalysisSchema = z.object({
  analysis: z.object({
    overallRiskScore: z.number().min(0).max(100).describe('Overall interaction risk score 0-100'),
    riskLevel: z.enum(['minimal', 'low', 'moderate', 'high', 'severe']).describe('Categorical risk level'),
    confidenceLevel: z.number().min(0).max(100).describe('AI confidence in analysis'),
    timeToOnset: z.string().describe('Expected time for interactions to manifest')
  }),
  
  pairwiseInteractions: z.array(z.object({
    supplement1: z.string(),
    supplement2: z.string(),
    interactionType: z.enum([
      'synergistic', 'antagonistic', 'competitive', 'additive', 
      'potentiating', 'interfering', 'neutral'
    ]),
    severity: z.enum(['minimal', 'mild', 'moderate', 'severe', 'critical']),
    mechanism: z.string().describe('Biological mechanism of interaction'),
    clinicalSignificance: z.enum(['not_significant', 'monitor', 'caution', 'avoid']),
    recommendations: z.array(z.string()).describe('Specific recommendations for this interaction'),
    evidence: z.object({
      level: z.enum(['theoretical', 'case_reports', 'observational', 'clinical_trials', 'systematic_reviews']),
      description: z.string(),
      sources: z.array(z.string()).describe('Key evidence sources')
    })
  })),
  
  systemicEffects: z.object({
    cardiovascular: z.object({
      risk: z.enum(['none', 'low', 'moderate', 'high']),
      effects: z.array(z.string()),
      monitoring: z.array(z.string())
    }),
    hepatic: z.object({
      risk: z.enum(['none', 'low', 'moderate', 'high']),
      effects: z.array(z.string()),
      monitoring: z.array(z.string())
    }),
    renal: z.object({
      risk: z.enum(['none', 'low', 'moderate', 'high']),
      effects: z.array(z.string()),
      monitoring: z.array(z.string())
    }),
    neurological: z.object({
      risk: z.enum(['none', 'low', 'moderate', 'high']),
      effects: z.array(z.string()),
      monitoring: z.array(z.string())
    }),
    endocrine: z.object({
      risk: z.enum(['none', 'low', 'moderate', 'high']),
      effects: z.array(z.string()),
      monitoring: z.array(z.string())
    })
  }),
  
  timingOptimization: z.object({
    recommendations: z.array(z.object({
      supplement: z.string(),
      optimalTiming: z.string(),
      avoidWith: z.array(z.string()),
      takeWith: z.array(z.string()),
      foodRequirements: z.string(),
      spacing: z.string()
    })),
    scheduleTemplate: z.array(z.object({
      time: z.string(),
      supplements: z.array(z.string()),
      notes: z.string()
    }))
  }),
  
  dosageAdjustments: z.array(z.object({
    supplement: z.string(),
    currentDosage: z.string(),
    recommendedDosage: z.string(),
    reason: z.string(),
    priority: z.enum(['immediate', 'within_week', 'gradual', 'monitor']),
    tapering: z.object({
      required: z.boolean(),
      schedule: z.string().optional(),
      monitoring: z.array(z.string()).optional()
    })
  })),
  
  monitoringPlan: z.object({
    immediateMonitoring: z.array(z.object({
      parameter: z.string(),
      method: z.string(),
      frequency: z.string(),
      alertThresholds: z.string()
    })),
    ongoingMonitoring: z.array(z.object({
      parameter: z.string(),
      method: z.string(),
      frequency: z.string(),
      normalRanges: z.string()
    })),
    redFlags: z.array(z.object({
      symptom: z.string(),
      action: z.string(),
      urgency: z.enum(['routine', 'urgent', 'emergency'])
    }))
  }),
  
  riskMitigation: z.object({
    immediateActions: z.array(z.string()),
    shortTermStrategies: z.array(z.string()),
    longTermOptimization: z.array(z.string()),
    emergencyProtocol: z.object({
      warningSigns: z.array(z.string()),
      immediateSteps: z.array(z.string()),
      whenToSeekHelp: z.string()
    })
  }),
  
  alternativeRecommendations: z.array(z.object({
    originalSupplement: z.string(),
    alternatives: z.array(z.object({
      name: z.string(),
      rationale: z.string(),
      safetyProfile: z.string(),
      efficacyComparison: z.string(),
      costComparison: z.string()
    }))
  })),
  
  summary: z.object({
    safeToTake: z.boolean().describe('Overall safety assessment'),
    keyRecommendations: z.array(z.string()),
    priorityActions: z.array(z.string()),
    followUpTimeframe: z.string(),
    specialConsiderations: z.array(z.string())
  })
});

type InteractionAnalysis = z.infer<typeof InteractionAnalysisSchema>;

interface UserHealthProfile {
  age?: number;
  gender?: string;
  weight?: number;
  healthConditions?: string[];
  medications?: string[];
  allergies?: string[];
  liverFunction?: 'normal' | 'impaired' | 'unknown';
  kidneyFunction?: 'normal' | 'impaired' | 'unknown';
  pregnancyStatus?: 'pregnant' | 'breastfeeding' | 'trying_to_conceive' | 'not_applicable';
}

export class AIInteractionAnalyzer {
  private static instance: AIInteractionAnalyzer;
  private model = google('gemini-1.5-flash');
  private analysisCache: Map<string, { analysis: InteractionAnalysis; timestamp: Date; expiresAt: Date }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 2; // 2 hours

  static getInstance(): AIInteractionAnalyzer {
    if (!AIInteractionAnalyzer.instance) {
      AIInteractionAnalyzer.instance = new AIInteractionAnalyzer();
    }
    return AIInteractionAnalyzer.instance;
  }

  private constructor() {
    advancedDebugger.info(DebugCategory.AI, 'AI Interaction Analyzer initialized');
  }

  /**
   * Comprehensive supplement stack interaction analysis
   */
  public async analyzeSupplementStack(
    supplements: (Partial<EnhancedSupplement> & { currentDosage?: string })[],
    userProfile?: UserHealthProfile,
    options?: {
      includeAlternatives?: boolean;
      focusOnSafety?: boolean;
      generateSchedule?: boolean;
      riskTolerance?: 'conservative' | 'balanced' | 'aggressive';
    }
  ): Promise<InteractionAnalysis> {
    const cacheKey = this.generateCacheKey(supplements, userProfile, options);
    
    // Check cache first
    const cached = this.getCachedAnalysis(cacheKey);
    if (cached) {
      advancedDebugger.info(DebugCategory.AI, 'Returning cached interaction analysis');
      return cached;
    }

    advancedDebugger.info(DebugCategory.AI, 'Starting comprehensive interaction analysis', {
      supplementCount: supplements.length,
      hasUserProfile: !!userProfile,
      options
    });

    const prompt = this.buildInteractionAnalysisPrompt(supplements, userProfile, options);

    try {
      const result = await generateObject({
        model: this.model,
        schema: InteractionAnalysisSchema,
        prompt,
        temperature: 0.1 // Very low for safety-critical analysis
      });

      const analysis = result.object;
      
      // Cache the result
      this.setCachedAnalysis(cacheKey, analysis);

      advancedDebugger.info(DebugCategory.AI, 'Interaction analysis completed', {
        overallRiskScore: analysis.analysis.overallRiskScore,
        riskLevel: analysis.analysis.riskLevel,
        pairwiseInteractions: analysis.pairwiseInteractions.length,
        safeToTake: analysis.summary.safeToTake
      });

      return analysis;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Interaction analysis failed', error);
      throw new Error(`Interaction analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Quick safety check for adding a new supplement to existing stack
   */
  public async quickSafetyCheck(
    newSupplement: Partial<EnhancedSupplement> & { proposedDosage?: string },
    existingSupplements: (Partial<EnhancedSupplement> & { currentDosage?: string })[],
    userProfile?: UserHealthProfile
  ): Promise<{
    isSafe: boolean;
    riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'severe';
    primaryConcerns: string[];
    recommendations: string[];
    requiresFullAnalysis: boolean;
  }> {
    advancedDebugger.info(DebugCategory.AI, 'Performing quick safety check', {
      newSupplement: newSupplement.name,
      existingCount: existingSupplements.length
    });

    const quickCheckPrompt = `
    You are a clinical pharmacist specializing in supplement safety. Perform a rapid safety assessment:

    NEW SUPPLEMENT TO ADD:
    - Name: ${newSupplement.name}
    - Proposed dosage: ${newSupplement.proposedDosage || 'Standard'}
    - Primary effects: ${newSupplement.primaryEffects?.join(', ') || 'Unknown'}

    EXISTING SUPPLEMENTS:
    ${existingSupplements.map(supp => `
    - ${supp.name}: ${supp.currentDosage || 'Unknown dosage'}
      Effects: ${supp.primaryEffects?.join(', ') || 'Unknown'}
    `).join('')}

    ${userProfile ? `
    USER PROFILE:
    - Age: ${userProfile.age || 'Unknown'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None'}
    - Medications: ${userProfile.medications?.join(', ') || 'None'}
    ${userProfile.liverFunction !== 'normal' ? `- Liver function: ${userProfile.liverFunction}` : ''}
    ${userProfile.kidneyFunction !== 'normal' ? `- Kidney function: ${userProfile.kidneyFunction}` : ''}
    ` : ''}

    QUICK ASSESSMENT REQUIRED:
    1. Is it generally safe to add this supplement? (Yes/No)
    2. What's the risk level? (minimal/low/moderate/high/severe)
    3. What are the top 3 concerns?
    4. What are the key recommendations?
    5. Does this require a full interaction analysis?

    Focus on major interactions, contraindications, and safety red flags.
    `;

    try {
      const quickSchema = z.object({
        isSafe: z.boolean(),
        riskLevel: z.enum(['minimal', 'low', 'moderate', 'high', 'severe']),
        primaryConcerns: z.array(z.string()).max(3),
        recommendations: z.array(z.string()).max(5),
        requiresFullAnalysis: z.boolean()
      });

      const result = await generateObject({
        model: this.model,
        schema: quickSchema,
        prompt: quickCheckPrompt,
        temperature: 0.1
      });

      advancedDebugger.info(DebugCategory.AI, 'Quick safety check completed', {
        isSafe: result.object.isSafe,
        riskLevel: result.object.riskLevel,
        requiresFullAnalysis: result.object.requiresFullAnalysis
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Quick safety check failed', error);
      throw new Error(`Quick safety check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze drug-supplement interactions
   */
  public async analyzeDrugSupplementInteractions(
    supplements: (Partial<EnhancedSupplement> & { currentDosage?: string })[],
    medications: Array<{ name: string; dosage?: string; frequency?: string }>,
    userProfile?: UserHealthProfile
  ): Promise<{
    criticalInteractions: Array<{
      supplement: string;
      medication: string;
      severity: 'mild' | 'moderate' | 'severe' | 'contraindicated';
      mechanism: string;
      clinicalEffect: string;
      recommendations: string[];
    }>;
    monitoringRequirements: Array<{
      parameter: string;
      frequency: string;
      reason: string;
    }>;
    dosageAdjustments: Array<{
      item: string;
      type: 'supplement' | 'medication';
      adjustment: string;
      reason: string;
    }>;
    overallAssessment: string;
  }> {
    advancedDebugger.info(DebugCategory.AI, 'Analyzing drug-supplement interactions', {
      supplementCount: supplements.length,
      medicationCount: medications.length
    });

    const drugInteractionPrompt = `
    You are a clinical pharmacologist analyzing drug-supplement interactions. Provide a comprehensive assessment:

    SUPPLEMENTS:
    ${supplements.map(supp => `
    - ${supp.name}: ${supp.currentDosage || 'Unknown dosage'}
      Active compounds: ${supp.activeCompounds?.join(', ') || 'Unknown'}
      Primary effects: ${supp.primaryEffects?.join(', ') || 'Unknown'}
    `).join('')}

    MEDICATIONS:
    ${medications.map(med => `
    - ${med.name}: ${med.dosage || 'Unknown'} ${med.frequency || 'Unknown frequency'}
    `).join('')}

    ${userProfile ? `
    PATIENT PROFILE:
    - Age: ${userProfile.age || 'Unknown'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None'}
    - Liver function: ${userProfile.liverFunction || 'Unknown'}
    - Kidney function: ${userProfile.kidneyFunction || 'Unknown'}
    ` : ''}

    ANALYSIS REQUIREMENTS:
    1. Identify all potential drug-supplement interactions
    2. Rate severity and clinical significance
    3. Explain biological mechanisms
    4. Specify monitoring requirements
    5. Recommend dosage adjustments if needed
    6. Provide overall safety assessment

    Focus on clinically significant interactions that could affect drug efficacy or safety.
    `;

    try {
      const drugInteractionSchema = z.object({
        criticalInteractions: z.array(z.object({
          supplement: z.string(),
          medication: z.string(),
          severity: z.enum(['mild', 'moderate', 'severe', 'contraindicated']),
          mechanism: z.string(),
          clinicalEffect: z.string(),
          recommendations: z.array(z.string())
        })),
        monitoringRequirements: z.array(z.object({
          parameter: z.string(),
          frequency: z.string(),
          reason: z.string()
        })),
        dosageAdjustments: z.array(z.object({
          item: z.string(),
          type: z.enum(['supplement', 'medication']),
          adjustment: z.string(),
          reason: z.string()
        })),
        overallAssessment: z.string()
      });

      const result = await generateObject({
        model: this.model,
        schema: drugInteractionSchema,
        prompt: drugInteractionPrompt,
        temperature: 0.1
      });

      advancedDebugger.info(DebugCategory.AI, 'Drug-supplement interaction analysis completed', {
        criticalInteractions: result.object.criticalInteractions.length,
        monitoringRequirements: result.object.monitoringRequirements.length
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Drug-supplement interaction analysis failed', error);
      throw new Error(`Drug-supplement analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimal supplement timing schedule
   */
  public async generateOptimalSchedule(
    supplements: (Partial<EnhancedSupplement> & { 
      currentDosage?: string;
      frequency?: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'as_needed';
    })[],
    preferences?: {
      wakeUpTime?: string;
      bedTime?: string;
      mealTimes?: { breakfast?: string; lunch?: string; dinner?: string };
      workSchedule?: 'standard' | 'shift_work' | 'flexible';
      lifestyle?: 'sedentary' | 'active' | 'very_active';
    }
  ): Promise<{
    schedule: Array<{
      time: string;
      supplements: Array<{
        name: string;
        dosage: string;
        instructions: string;
      }>;
      notes: string[];
    }>;
    generalGuidelines: string[];
    foodRequirements: Array<{
      supplement: string;
      requirement: 'empty_stomach' | 'with_food' | 'with_fat' | 'flexible';
      reasoning: string;
    }>;
    conflictResolution: Array<{
      conflict: string;
      solution: string;
      rationale: string;
    }>;
  }> {
    advancedDebugger.info(DebugCategory.AI, 'Generating optimal supplement schedule', {
      supplementCount: supplements.length,
      hasPreferences: !!preferences
    });

    const schedulePrompt = `
    You are a clinical nutritionist creating an optimal supplement timing schedule. Consider absorption, interactions, and lifestyle:

    SUPPLEMENTS TO SCHEDULE:
    ${supplements.map(supp => `
    - ${supp.name}: ${supp.currentDosage || 'Standard dose'} - ${supp.frequency || 'once_daily'}
      Active compounds: ${supp.activeCompounds?.join(', ') || 'Unknown'}
      Category: ${supp.category || 'Unknown'}
    `).join('')}

    ${preferences ? `
    USER PREFERENCES:
    - Wake up: ${preferences.wakeUpTime || 'Not specified'}
    - Bedtime: ${preferences.bedTime || 'Not specified'}
    - Meal times: Breakfast: ${preferences.mealTimes?.breakfast || 'Not specified'}, 
                  Lunch: ${preferences.mealTimes?.lunch || 'Not specified'}, 
                  Dinner: ${preferences.mealTimes?.dinner || 'Not specified'}
    - Work schedule: ${preferences.workSchedule || 'Not specified'}
    - Lifestyle: ${preferences.lifestyle || 'Not specified'}
    ` : ''}

    OPTIMIZATION REQUIREMENTS:
    1. Maximize absorption and bioavailability
    2. Minimize negative interactions
    3. Enhance synergistic effects
    4. Consider food requirements
    5. Fit user's lifestyle and preferences
    6. Provide clear timing rationale
    7. Include backup options for missed doses

    Create a practical, easy-to-follow schedule that optimizes supplement effectiveness.
    `;

    try {
      const scheduleSchema = z.object({
        schedule: z.array(z.object({
          time: z.string(),
          supplements: z.array(z.object({
            name: z.string(),
            dosage: z.string(),
            instructions: z.string()
          })),
          notes: z.array(z.string())
        })),
        generalGuidelines: z.array(z.string()),
        foodRequirements: z.array(z.object({
          supplement: z.string(),
          requirement: z.enum(['empty_stomach', 'with_food', 'with_fat', 'flexible']),
          reasoning: z.string()
        })),
        conflictResolution: z.array(z.object({
          conflict: z.string(),
          solution: z.string(),
          rationale: z.string()
        }))
      });

      const result = await generateObject({
        model: this.model,
        schema: scheduleSchema,
        prompt: schedulePrompt,
        temperature: 0.2
      });

      advancedDebugger.info(DebugCategory.AI, 'Optimal schedule generated', {
        timeSlots: result.object.schedule.length,
        conflicts: result.object.conflictResolution.length
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Schedule generation failed', error);
      throw new Error(`Schedule generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private utility methods
  private generateCacheKey(
    supplements: any[], 
    userProfile?: UserHealthProfile, 
    options?: any
  ): string {
    const supplementNames = supplements.map(s => s.name).sort().join(',');
    const profileHash = userProfile ? JSON.stringify(userProfile) : '';
    const optionsHash = options ? JSON.stringify(options) : '';
    return `interaction_${supplementNames}_${profileHash}_${optionsHash}`;
  }

  private getCachedAnalysis(key: string): InteractionAnalysis | null {
    const cached = this.analysisCache.get(key);
    if (cached && cached.expiresAt > new Date()) {
      return cached.analysis;
    }
    if (cached) {
      this.analysisCache.delete(key);
    }
    return null;
  }

  private setCachedAnalysis(key: string, analysis: InteractionAnalysis): void {
    this.analysisCache.set(key, {
      analysis,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + this.CACHE_DURATION)
    });
  }

  private buildInteractionAnalysisPrompt(
    supplements: any[],
    userProfile?: UserHealthProfile,
    options?: any
  ): string {
    return `
    You are a leading clinical pharmacologist and supplement interaction expert. Perform a comprehensive analysis of this supplement combination:

    SUPPLEMENT STACK:
    ${supplements.map((supp, index) => `
    ${index + 1}. ${supp.name}
       - Current dosage: ${supp.currentDosage || 'Standard'}
       - Active compounds: ${supp.activeCompounds?.join(', ') || 'Unknown'}
       - Primary effects: ${supp.primaryEffects?.join(', ') || 'Unknown'}
       - Category: ${supp.category || 'Unknown'}
    `).join('')}

    ${userProfile ? `
    USER HEALTH PROFILE:
    - Age: ${userProfile.age || 'Not specified'}
    - Gender: ${userProfile.gender || 'Not specified'}
    - Weight: ${userProfile.weight || 'Not specified'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None specified'}
    - Current medications: ${userProfile.medications?.join(', ') || 'None specified'}
    - Known allergies: ${userProfile.allergies?.join(', ') || 'None specified'}
    - Liver function: ${userProfile.liverFunction || 'Unknown'}
    - Kidney function: ${userProfile.kidneyFunction || 'Unknown'}
    - Pregnancy status: ${userProfile.pregnancyStatus || 'Not applicable'}
    ` : ''}

    ANALYSIS REQUIREMENTS:
    1. Calculate overall interaction risk score (0-100)
    2. Identify all pairwise supplement interactions
    3. Assess systemic effects on major organ systems
    4. Optimize timing to minimize negative interactions
    5. Suggest dosage adjustments if needed
    6. Create comprehensive monitoring plan
    7. Develop risk mitigation strategies
    8. Recommend alternatives for high-risk combinations
    9. Provide clear safety assessment and recommendations

    ANALYSIS DEPTH: ${options?.focusOnSafety ? 'MAXIMUM SAFETY FOCUS' : 'BALANCED ANALYSIS'}
    RISK TOLERANCE: ${options?.riskTolerance || 'BALANCED'}
    INCLUDE ALTERNATIVES: ${options?.includeAlternatives ? 'YES' : 'NO'}
    GENERATE SCHEDULE: ${options?.generateSchedule ? 'YES' : 'NO'}

    Be extremely thorough and prioritize user safety. Consider both known interactions and theoretical risks based on mechanisms of action.
    `;
  }
}

export const aiInteractionAnalyzer = AIInteractionAnalyzer.getInstance();