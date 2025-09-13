import { google } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';
import { 
  EnhancedSupplement, 
  UserSupplementProfile, 
  UserGoal, 
  EvidenceLevel,
  BodySystem,
  MechanismOfAction
} from '@/types/enhanced-supplement';
import { advancedDebugger, DebugCategory } from './advanced-debugging';

// Enhanced schemas for AI SDK 5 with better error handling
const SupplementAnalysisSchema = z.object({
  supplementName: z.string().describe('Name of the supplement being analyzed'),
  safetyRating: z.number().min(0).max(100).describe('Safety rating from 0-100'),
  efficacyRating: z.number().min(0).max(100).describe('Efficacy rating based on evidence'),
  keyBenefits: z.array(z.string()).describe('Main benefits of this supplement'),
  potentialRisks: z.array(z.string()).describe('Potential risks or side effects'),
  recommendedDosage: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.string(),
    timing: z.string()
  }).describe('Recommended dosage information'),
  targetConditions: z.array(z.string()).describe('Conditions this supplement may help with'),
  contraindications: z.array(z.string()).describe('When this supplement should be avoided'),
  evidenceQuality: z.enum(['strong', 'moderate', 'weak', 'insufficient']).describe('Quality of supporting evidence'),
  reasoning: z.string().describe('Detailed explanation of the analysis'),
  confidenceLevel: z.number().min(0).max(100).describe('AI confidence in this analysis'),
  lastUpdated: z.string().describe('When this analysis was last updated')
});

const StackOptimizationSchema = z.object({
  overallAssessment: z.string().describe('General assessment of the current supplement stack'),
  strengthsAndWeaknesses: z.object({
    strengths: z.array(z.string()).describe('What works well in current stack'),
    weaknesses: z.array(z.string()).describe('Areas needing improvement')
  }),
  recommendations: z.array(z.object({
    action: z.enum(['add', 'remove', 'modify', 'timing_change']).describe('Type of recommendation'),
    supplement: z.string().describe('Supplement name involved'),
    reason: z.string().describe('Why this change is recommended'),
    priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
    expectedBenefit: z.string().describe('Expected improvement from this change'),
    implementationSteps: z.array(z.string()).describe('Steps to implement this change'),
    timeframe: z.string().describe('When to implement this change')
  })),
  potentialInteractions: z.array(z.object({
    supplements: z.array(z.string()).describe('Supplements that may interact'),
    severity: z.enum(['mild', 'moderate', 'severe']).describe('Interaction severity'),
    description: z.string().describe('Description of the interaction'),
    recommendations: z.string().describe('How to manage this interaction')
  })),
  costOptimization: z.object({
    currentEstimatedCost: z.number().describe('Estimated monthly cost'),
    optimizedCost: z.number().describe('Optimized monthly cost'),
    savings: z.number().describe('Potential monthly savings'),
    costEffectiveAlternatives: z.array(z.object({
      original: z.string(),
      alternative: z.string(),
      savingsPerMonth: z.number()
    })).describe('More cost-effective alternatives')
  }),
  timeline: z.object({
    immediate: z.array(z.string()).describe('Changes to make immediately'),
    shortTerm: z.array(z.string()).describe('Changes within 2-4 weeks'),
    longTerm: z.array(z.string()).describe('Changes after 1-3 months')
  }),
  riskAssessment: z.object({
    overallRisk: z.enum(['low', 'moderate', 'high']).describe('Overall risk level'),
    specificRisks: z.array(z.string()).describe('Specific risks identified'),
    mitigationStrategies: z.array(z.string()).describe('How to mitigate risks')
  })
});

const KnowledgeQuerySchema = z.object({
  answer: z.string().describe('Comprehensive answer to the user question'),
  keyPoints: z.array(z.string()).describe('Key takeaway points'),
  relatedSupplements: z.array(z.string()).describe('Supplements related to this topic'),
  mechanismsInvolved: z.array(z.string()).describe('Biological mechanisms involved'),
  evidenceLevel: z.enum(['strong', 'moderate', 'weak', 'theoretical']).describe('Level of scientific evidence'),
  practicalApplications: z.array(z.string()).describe('How to apply this knowledge practically'),
  furtherReading: z.array(z.string()).describe('Suggested topics for further learning'),
  warnings: z.array(z.string()).describe('Important warnings or considerations'),
  sources: z.array(z.object({
    title: z.string(),
    type: z.enum(['study', 'review', 'guideline', 'expert_opinion']),
    reliability: z.enum(['high', 'medium', 'low'])
  })).describe('Sources for this information')
});

const PersonalizedRecommendationSchema = z.object({
  primaryRecommendations: z.array(z.object({
    supplement: z.string(),
    dosage: z.string(),
    timing: z.string(),
    rationale: z.string(),
    expectedBenefits: z.array(z.string()),
    timeToEffect: z.string(),
    confidenceLevel: z.number().min(0).max(100),
    priority: z.enum(['essential', 'recommended', 'optional'])
  })),
  lifestyleRecommendations: z.array(z.object({
    category: z.enum(['diet', 'exercise', 'sleep', 'stress_management', 'hydration', 'environment']),
    recommendation: z.string(),
    impact: z.enum(['high', 'medium', 'low']),
    difficulty: z.enum(['easy', 'moderate', 'challenging']),
    timeToImplement: z.string()
  })),
  monitoringSuggestions: z.array(z.object({
    parameter: z.string(),
    frequency: z.string(),
    method: z.string(),
    targetRange: z.string().optional(),
    importance: z.enum(['critical', 'important', 'useful'])
  })),
  riskAssessment: z.object({
    overallRisk: z.enum(['low', 'moderate', 'high']),
    specificRisks: z.array(z.string()),
    mitigationStrategies: z.array(z.string())
  }),
  personalizationNotes: z.string().describe('Specific notes about why these recommendations fit this user'),
  followUpRecommendations: z.array(z.object({
    timeframe: z.string(),
    action: z.string(),
    reason: z.string()
  })).describe('Recommended follow-up actions')
});

// Enhanced User Context Schema
const UserContextSchema = z.object({
  goals: z.array(z.string()).optional(),
  healthConditions: z.array(z.string()).optional(),
  currentSupplements: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  budget: z.object({
    monthly: z.number(),
    priority: z.enum(['cost_effective', 'balanced', 'premium'])
  }).optional()
});

type UserContext = z.infer<typeof UserContextSchema>;
type SupplementAnalysis = z.infer<typeof SupplementAnalysisSchema>;
type StackOptimization = z.infer<typeof StackOptimizationSchema>;
type KnowledgeQueryResult = z.infer<typeof KnowledgeQuerySchema>;
type PersonalizedRecommendation = z.infer<typeof PersonalizedRecommendationSchema>;

export class EnhancedAIKnowledgeEngine {
  private static instance: EnhancedAIKnowledgeEngine;
  private model = google('gemini-1.5-flash');
  private conversationHistory: Map<string, Array<{ role: string; content: string; timestamp: Date }>> = new Map();
  private analysisCache: Map<string, { data: any; timestamp: Date; expiresAt: Date }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  static getInstance(): EnhancedAIKnowledgeEngine {
    if (!EnhancedAIKnowledgeEngine.instance) {
      EnhancedAIKnowledgeEngine.instance = new EnhancedAIKnowledgeEngine();
    }
    return EnhancedAIKnowledgeEngine.instance;
  }

  private constructor() {
    advancedDebugger.info(DebugCategory.AI, 'Enhanced AI Knowledge Engine v2 initialized with Gemini Flash');
  }

  /**
   * Analyzes a supplement using AI with enhanced evaluation and caching
   */
  public async analyzeSupplementWithAI(
    supplement: Partial<EnhancedSupplement>,
    userContext?: UserContext
  ): Promise<SupplementAnalysis> {
    const cacheKey = `supplement_${supplement.name}_${JSON.stringify(userContext)}`;
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      advancedDebugger.info(DebugCategory.AI, 'Returning cached supplement analysis', { 
        supplement: supplement.name 
      });
      return cached as SupplementAnalysis;
    }

    advancedDebugger.info(DebugCategory.AI, 'Starting AI supplement analysis', {
      supplement: supplement.name,
      hasUserContext: !!userContext
    });

    const prompt = this.buildEnhancedSupplementAnalysisPrompt(supplement, userContext);

    try {
      const result = await generateObject({
        model: this.model,
        schema: SupplementAnalysisSchema,
        prompt,
        temperature: 0.2 // Very low temperature for consistent, factual responses
      });

      const analysis = {
        ...result.object,
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.setCachedResult(cacheKey, analysis);

      advancedDebugger.info(DebugCategory.AI, 'AI supplement analysis completed', {
        supplement: supplement.name,
        safetyRating: analysis.safetyRating,
        efficacyRating: analysis.efficacyRating,
        confidenceLevel: analysis.confidenceLevel
      });

      return analysis;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'AI supplement analysis failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        supplement: supplement.name 
      });
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimizes supplement stack using advanced AI analysis with enhanced features
   */
  public async optimizeSupplementStack(
    userProfile: Partial<UserSupplementProfile>,
    currentSupplements: Partial<EnhancedSupplement>[],
    availableSupplements?: Partial<EnhancedSupplement>[]
  ): Promise<StackOptimization> {
    advancedDebugger.info(DebugCategory.AI, 'Starting AI stack optimization', {
      userId: userProfile.userId,
      currentSupplementCount: currentSupplements.length,
      availableCount: availableSupplements?.length || 0
    });

    const prompt = this.buildEnhancedStackOptimizationPrompt(userProfile, currentSupplements, availableSupplements);

    try {
      const result = await generateObject({
        model: this.model,
        schema: StackOptimizationSchema,
        prompt,
        temperature: 0.3
      });

      advancedDebugger.info(DebugCategory.AI, 'AI stack optimization completed', {
        userId: userProfile.userId,
        recommendationCount: result.object.recommendations.length,
        estimatedSavings: result.object.costOptimization.savings,
        overallRisk: result.object.riskAssessment.overallRisk
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'AI stack optimization failed', error);
      throw new Error(`Stack optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Answers complex knowledge queries with enhanced research integration
   */
  public async answerKnowledgeQuery(
    query: string,
    context?: {
      userGoals?: string[];
      focusAreas?: string[];
      includeResearch?: boolean;
      preferredEvidenceLevel?: 'any' | 'strong' | 'moderate_or_better';
    }
  ): Promise<KnowledgeQueryResult> {
    advancedDebugger.info(DebugCategory.AI, 'Processing enhanced knowledge query', {
      query: query.substring(0, 100),
      hasContext: !!context,
      includeResearch: context?.includeResearch || false
    });

    const prompt = this.buildEnhancedKnowledgeQueryPrompt(query, context);

    try {
      const result = await generateObject({
        model: this.model,
        schema: KnowledgeQuerySchema,
        prompt,
        temperature: 0.4
      });

      advancedDebugger.info(DebugCategory.AI, 'Enhanced knowledge query answered', {
        answerLength: result.object.answer.length,
        evidenceLevel: result.object.evidenceLevel,
        relatedSupplementsCount: result.object.relatedSupplements.length,
        sourcesCount: result.object.sources.length
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Enhanced knowledge query failed', error);
      throw new Error(`Knowledge query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates highly personalized supplement recommendations with enhanced features
   */
  public async generatePersonalizedRecommendations(
    userProfile: Partial<UserSupplementProfile>,
    preferences?: {
      budgetLimit?: number;
      preferNatural?: boolean;
      avoidStimulants?: boolean;
      focusOnSafety?: boolean;
      maxSupplements?: number;
      timeHorizon?: '1_month' | '3_months' | '6_months' | '1_year';
    }
  ): Promise<PersonalizedRecommendation> {
    advancedDebugger.info(DebugCategory.AI, 'Generating enhanced personalized recommendations', {
      userId: userProfile.userId,
      goals: userProfile.goals,
      preferences: preferences
    });

    const prompt = this.buildEnhancedPersonalizationPrompt(userProfile, preferences);

    try {
      const result = await generateObject({
        model: this.model,
        schema: PersonalizedRecommendationSchema,
        prompt,
        temperature: 0.3
      });

      advancedDebugger.info(DebugCategory.AI, 'Enhanced personalized recommendations generated', {
        userId: userProfile.userId,
        primaryRecommendations: result.object.primaryRecommendations.length,
        lifestyleRecommendations: result.object.lifestyleRecommendations.length,
        riskLevel: result.object.riskAssessment.overallRisk,
        followUpActions: result.object.followUpRecommendations.length
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Enhanced personalized recommendations failed', error);
      throw new Error(`Personalized recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Interactive chat interface with enhanced context and tools
   */
  public async createEnhancedInteractiveChat(
    userId: string,
    message: string,
    context?: {
      userProfile?: Partial<UserSupplementProfile>;
      conversationHistory?: boolean;
      preferredResponseStyle?: 'detailed' | 'concise' | 'educational';
    }
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Starting enhanced interactive chat', {
      userId,
      messageLength: message.length,
      hasProfile: !!context?.userProfile,
      responseStyle: context?.preferredResponseStyle || 'detailed'
    });

    const history = context?.conversationHistory ? this.getConversationHistory(userId) : [];
    
    const systemPrompt = this.buildEnhancedChatSystemPrompt(context?.userProfile, context?.preferredResponseStyle);
    
    try {
      const result = await streamText({
        model: this.model,
        system: systemPrompt,
        messages: [
          ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
          { role: 'user', content: message }
        ],
        temperature: 0.6
      });

      // Store conversation for context
      if (context?.conversationHistory) {
        this.updateConversationHistory(userId, [
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: 'Streamed response', timestamp: new Date() }
        ]);
      }

      return result;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Enhanced interactive chat failed', error);
      throw new Error(`Chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private utility methods
  private getCachedResult(key: string): any | null {
    const cached = this.analysisCache.get(key);
    if (cached && cached.expiresAt > new Date()) {
      return cached.data;
    }
    if (cached) {
      this.analysisCache.delete(key);
    }
    return null;
  }

  private setCachedResult(key: string, data: any): void {
    this.analysisCache.set(key, {
      data,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + this.CACHE_DURATION)
    });
  }

  private getConversationHistory(userId: string): Array<{ role: string; content: string; timestamp: Date }> {
    return this.conversationHistory.get(userId) || [];
  }

  private updateConversationHistory(userId: string, newMessages: Array<{ role: string; content: string; timestamp: Date }>): void {
    const history = this.getConversationHistory(userId);
    const updatedHistory = [...history, ...newMessages].slice(-20); // Keep last 20 messages
    this.conversationHistory.set(userId, updatedHistory);
  }

  // Enhanced prompt building methods
  private buildEnhancedSupplementAnalysisPrompt(
    supplement: Partial<EnhancedSupplement>, 
    userContext?: UserContext
  ): string {
    return `
    You are a leading supplement researcher and clinical nutritionist with access to the latest scientific literature. Analyze the following supplement with exceptional detail and accuracy:

    Supplement Information:
    - Name: ${supplement.name}
    - Common names: ${supplement.commonNames?.join(', ') || 'Not specified'}
    - Active compounds: ${supplement.activeCompounds?.join(', ') || 'Not specified'}
    - Primary effects: ${supplement.primaryEffects?.join(', ') || 'Not specified'}
    - Category: ${supplement.category || 'Not specified'}

    ${userContext ? `
    User Context (PERSONALIZE YOUR ANALYSIS):
    - Goals: ${userContext.goals?.join(', ') || 'Not specified'}
    - Health conditions: ${userContext.healthConditions?.join(', ') || 'None specified'}
    - Current supplements: ${userContext.currentSupplements?.join(', ') || 'None'}
    - Medications: ${userContext.medications?.join(', ') || 'None'}
    - Age: ${userContext.age || 'Not specified'}
    - Activity level: ${userContext.activityLevel || 'Not specified'}
    - Budget considerations: ${userContext.budget ? `$${userContext.budget.monthly}/month (${userContext.budget.priority} priority)` : 'Not specified'}
    ` : ''}

    ANALYSIS REQUIREMENTS:
    1. Provide accurate safety (0-100) and efficacy (0-100) ratings
    2. Base recommendations on peer-reviewed research
    3. Consider drug-nutrient interactions if medications are specified
    4. Account for user's specific goals and health conditions
    5. Provide practical, actionable dosage guidance
    6. Include comprehensive contraindications
    7. Rate evidence quality honestly (many supplements have insufficient evidence)
    8. Express your confidence level (0-100) in this analysis
    9. Focus on user safety above all else

    Be thorough, evidence-based, and personalized. Prioritize safety and scientific accuracy.
    `;
  }

  private buildEnhancedStackOptimizationPrompt(
    userProfile: Partial<UserSupplementProfile>,
    currentSupplements: Partial<EnhancedSupplement>[],
    availableSupplements?: Partial<EnhancedSupplement>[]
  ): string {
    return `
    You are a clinical nutritionist and supplement stack optimization expert. Analyze and optimize this supplement regimen:

    User Profile:
    - Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None'}
    - Medications: ${userProfile.medications?.join(', ') || 'None'}
    - Allergies: ${userProfile.allergies?.join(', ') || 'None'}
    - Budget considerations: ${userProfile.preferences?.budgetLimit ? `$${userProfile.preferences.budgetLimit}/month` : 'Not specified'}

    Current Supplement Stack:
    ${currentSupplements.map(supp => `
    - ${supp.name}: 
      Primary effects: ${supp.primaryEffects?.join(', ') || 'Not specified'}
      Category: ${supp.category || 'Not specified'}
    `).join('')}

    ${availableSupplements ? `
    Available Alternatives: ${availableSupplements.map(s => s.name).join(', ')}
    ` : ''}

    OPTIMIZATION REQUIREMENTS:
    1. Analyze synergistic and antagonistic interactions
    2. Identify redundancies and gaps relative to user goals
    3. Provide cost optimization opportunities with specific savings
    4. Suggest implementation timeline (immediate/short-term/long-term)
    5. Include comprehensive risk assessment
    6. Provide specific implementation steps for each recommendation
    7. Consider bioavailability and absorption interactions
    8. Account for timing and food interactions
    9. Prioritize recommendations by importance and evidence

    Focus on evidence-based optimization that maximizes benefits while minimizing risks and costs.
    `;
  }

  private buildEnhancedKnowledgeQueryPrompt(query: string, context?: any): string {
    return `
    You are a world-class expert in nutritional science, biochemistry, and clinical research. Answer this question with exceptional depth and accuracy:

    Question: ${query}

    ${context ? `
    Context:
    - User goals: ${context.userGoals?.join(', ') || 'Not specified'}
    - Focus areas: ${context.focusAreas?.join(', ') || 'General'}
    - Include research: ${context.includeResearch ? 'Yes - include specific studies and evidence' : 'No'}
    - Evidence preference: ${context.preferredEvidenceLevel || 'Any quality evidence acceptable'}
    ` : ''}

    RESPONSE REQUIREMENTS:
    1. Provide a comprehensive, scientifically accurate answer
    2. Include key biological mechanisms and pathways
    3. List related supplements with their mechanisms of action
    4. Specify evidence quality for each claim
    5. Provide practical applications and implementation advice
    6. Include important warnings and contraindications
    7. Suggest credible sources for further learning
    8. Rate the overall evidence level for your response
    9. Include diverse source types (studies, reviews, guidelines)

    Be thorough, evidence-based, and practical. Acknowledge limitations in current knowledge.
    `;
  }

  private buildEnhancedPersonalizationPrompt(
    userProfile: Partial<UserSupplementProfile>,
    preferences?: any
  ): string {
    return `
    You are a personalized nutrition expert creating highly individualized supplement and lifestyle recommendations:

    User Profile:
    - Primary goals: ${userProfile.goals?.join(', ') || 'Not specified'}
    - Current supplements: ${userProfile.currentSupplements?.map(s => s.supplementId).join(', ') || 'None'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None'}
    - Medications: ${userProfile.medications?.join(', ') || 'None'}
    - Allergies: ${userProfile.allergies?.join(', ') || 'None'}

    Preferences & Constraints:
    - Budget limit: ${preferences?.budgetLimit ? `$${preferences.budgetLimit}/month` : 'Not specified'}
    - Prefer natural products: ${preferences?.preferNatural ? 'Yes' : 'No preference'}
    - Avoid stimulants: ${preferences?.avoidStimulants ? 'Yes' : 'No restriction'}
    - Safety focus: ${preferences?.focusOnSafety ? 'High priority' : 'Balanced approach'}
    - Maximum supplements: ${preferences?.maxSupplements || 'No limit'}
    - Time horizon: ${preferences?.timeHorizon || '3_months'}

    PERSONALIZATION REQUIREMENTS:
    1. Recommend supplements with specific dosing, timing, and priority levels
    2. Include lifestyle modifications with implementation difficulty ratings
    3. Suggest biomarkers and parameters to monitor with frequency
    4. Provide comprehensive risk assessment and mitigation strategies
    5. Explain why each recommendation is specifically suited to this user
    6. Include follow-up recommendations with specific timeframes
    7. Consider supplement-drug interactions if medications are present
    8. Prioritize recommendations by evidence strength and user goals
    9. Account for budget constraints and provide cost-effective alternatives

    Create a comprehensive, personalized plan that maximizes health outcomes while respecting user constraints and preferences.
    `;
  }

  private buildEnhancedChatSystemPrompt(
    userProfile?: Partial<UserSupplementProfile>, 
    responseStyle?: 'detailed' | 'concise' | 'educational'
  ): string {
    const styleInstructions = {
      detailed: 'Provide comprehensive, in-depth responses with full explanations and context.',
      concise: 'Keep responses focused and to-the-point while maintaining accuracy.',
      educational: 'Structure responses as learning opportunities with clear explanations of concepts.'
    };

    return `
    You are an AI assistant specializing in supplements, nutrition, and health optimization. You are knowledgeable, evidence-based, and prioritize user safety.

    Response Style: ${styleInstructions[responseStyle || 'detailed']}

    Your capabilities:
    - Analyze supplement interactions and provide safety guidance
    - Explain complex biochemical processes in accessible terms
    - Provide evidence-based recommendations with quality ratings
    - Suggest monitoring strategies for supplement effects
    - Offer personalized advice based on user context

    ${userProfile ? `
    Current user context:
    - Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
    - Current supplements: ${userProfile.currentSupplements?.map(s => s.supplementId).join(', ') || 'None'}
    - Health conditions: ${userProfile.healthConditions?.join(', ') || 'None specified'}
    - Medications: ${userProfile.medications?.join(', ') || 'None specified'}
    ` : ''}

    Guidelines:
    - Always prioritize safety and recommend consulting healthcare providers when appropriate
    - Provide evidence quality ratings (strong, moderate, weak, insufficient)
    - Ask clarifying questions when needed for better personalization
    - Acknowledge limitations and areas of scientific uncertainty
    - Suggest practical monitoring parameters when relevant
    - Warn about potential interactions or contraindications
    - Keep responses conversational but informative
    `;
  }
}

export const enhancedAIKnowledgeEngine = EnhancedAIKnowledgeEngine.getInstance();