import { google } from '@ai-sdk/google'
import { generateObject, generateText, streamText, tool } from 'ai'
import { z } from 'zod'
import {
  EnhancedSupplement,
  UserSupplementProfile,
  UserGoal,
  EvidenceLevel,
  BodySystem,
  MechanismOfAction
} from '@/types/enhanced-supplement'
import { advancedDebugger, DebugCategory } from './advanced-debugging'
import { researchIntegrationSystem } from './research-integration'
import { bodyKnowledgeSystem } from './body-knowledge-system'

// Enhanced schemas for AI SDK 5
const SupplementAnalysisSchema = z.object({
  supplementName: z.string().describe('Name of the supplement being analyzed'),
  safetyRating: z.number().min(0).max(100).describe('Safety rating from 0-100'),
  efficacyRating: z
    .number()
    .min(0)
    .max(100)
    .describe('Efficacy rating based on evidence'),
  keyBenefits: z.array(z.string()).describe('Main benefits of this supplement'),
  potentialRisks: z.array(z.string()).describe('Potential risks or side effects'),
  recommendedDosage: z
    .object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
      timing: z.string()
    })
    .describe('Recommended dosage information'),
  targetConditions: z
    .array(z.string())
    .describe('Conditions this supplement may help with'),
  contraindications: z
    .array(z.string())
    .describe('When this supplement should be avoided'),
  evidenceQuality: z
    .enum(['strong', 'moderate', 'weak', 'insufficient'])
    .describe('Quality of supporting evidence'),
  reasoning: z.string().describe('Detailed explanation of the analysis')
})

const StackOptimizationSchema = z.object({
  overallAssessment: z
    .string()
    .describe('General assessment of the current supplement stack'),
  strengthsAndWeaknesses: z.object({
    strengths: z.array(z.string()).describe('What works well in current stack'),
    weaknesses: z.array(z.string()).describe('Areas needing improvement')
  }),
  recommendations: z.array(
    z.object({
      action: z
        .enum(['add', 'remove', 'modify', 'timing_change'])
        .describe('Type of recommendation'),
      supplement: z.string().describe('Supplement name involved'),
      reason: z.string().describe('Why this change is recommended'),
      priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
      expectedBenefit: z.string().describe('Expected improvement from this change')
    })
  ),
  potentialInteractions: z.array(
    z.object({
      supplements: z.array(z.string()).describe('Supplements that may interact'),
      severity: z.enum(['mild', 'moderate', 'severe']).describe('Interaction severity'),
      description: z.string().describe('Description of the interaction')
    })
  ),
  costOptimization: z.object({
    currentEstimatedCost: z.number().describe('Estimated monthly cost'),
    optimizedCost: z.number().describe('Optimized monthly cost'),
    savings: z.number().describe('Potential monthly savings'),
    costEffectiveAlternatives: z
      .array(z.string())
      .describe('More cost-effective alternatives')
  }),
  timeline: z.object({
    immediate: z.array(z.string()).describe('Changes to make immediately'),
    shortTerm: z.array(z.string()).describe('Changes within 2-4 weeks'),
    longTerm: z.array(z.string()).describe('Changes after 1-3 months')
  })
})

const KnowledgeQuerySchema = z.object({
  answer: z.string().describe('Comprehensive answer to the user question'),
  keyPoints: z.array(z.string()).describe('Key takeaway points'),
  relatedSupplements: z.array(z.string()).describe('Supplements related to this topic'),
  mechanismsInvolved: z.array(z.string()).describe('Biological mechanisms involved'),
  evidenceLevel: z
    .enum(['strong', 'moderate', 'weak', 'theoretical'])
    .describe('Level of scientific evidence'),
  practicalApplications: z
    .array(z.string())
    .describe('How to apply this knowledge practically'),
  furtherReading: z.array(z.string()).describe('Suggested topics for further learning'),
  warnings: z.array(z.string()).describe('Important warnings or considerations')
})

const PersonalizedRecommendationSchema = z.object({
  primaryRecommendations: z.array(
    z.object({
      supplement: z.string(),
      dosage: z.string(),
      timing: z.string(),
      rationale: z.string(),
      expectedBenefits: z.array(z.string()),
      timeToEffect: z.string(),
      confidenceLevel: z.number().min(0).max(100)
    })
  ),
  lifestyle_recommendations: z.array(
    z.object({
      category: z.enum(['diet', 'exercise', 'sleep', 'stress_management', 'other']),
      recommendation: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      difficulty: z.enum(['easy', 'moderate', 'challenging'])
    })
  ),
  monitoring_suggestions: z.array(
    z.object({
      parameter: z.string(),
      frequency: z.string(),
      method: z.string(),
      target_range: z.string().optional()
    })
  ),
  risk_assessment: z.object({
    overall_risk: z.enum(['low', 'moderate', 'high']),
    specific_risks: z.array(z.string()),
    mitigation_strategies: z.array(z.string())
  }),
  personalization_notes: z
    .string()
    .describe('Specific notes about why these recommendations fit this user')
})

export class AIKnowledgeEngine {
  private static instance: AIKnowledgeEngine
  private model = google('gemini-1.5-flash')
  private conversationHistory: Map<string, any[]> = new Map()

  static getInstance(): AIKnowledgeEngine {
    if (!AIKnowledgeEngine.instance) {
      AIKnowledgeEngine.instance = new AIKnowledgeEngine()
    }
    return AIKnowledgeEngine.instance
  }

  private constructor() {
    advancedDebugger.info(
      DebugCategory.AI,
      'AI Knowledge Engine initialized with Gemini Flash'
    )
  }

  /**
   * Analyzes a supplement using AI with comprehensive evaluation
   */
  public async analyzeSupplementWithAI(
    supplement: EnhancedSupplement,
    userContext?: {
      goals: UserGoal[]
      healthConditions: string[]
      currentSupplements: string[]
      age?: number
      gender?: string
    }
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Starting AI supplement analysis', {
      supplement: supplement.name,
      hasUserContext: !!userContext
    })

    const prompt = this.buildSupplementAnalysisPrompt(supplement, userContext)

    try {
      const result = await generateObject({
        model: this.model,
        schema: SupplementAnalysisSchema,
        prompt,
        temperature: 0.3 // Lower temperature for more consistent, factual responses
      })

      advancedDebugger.info(DebugCategory.AI, 'AI supplement analysis completed', {
        supplement: supplement.name,
        safetyRating: result.object.safetyRating,
        efficacyRating: result.object.efficacyRating
      })

      return result.object
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'AI supplement analysis failed', error)
      throw new Error(
        `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Optimizes supplement stack using advanced AI analysis
   */
  public async optimizeSupplementStack(
    userProfile: UserSupplementProfile,
    currentSupplements: EnhancedSupplement[],
    availableSupplements?: EnhancedSupplement[]
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Starting AI stack optimization', {
      userId: userProfile.userId,
      currentSupplementCount: currentSupplements.length,
      availableCount: availableSupplements?.length || 0
    })

    const prompt = this.buildStackOptimizationPrompt(
      userProfile,
      currentSupplements,
      availableSupplements
    )

    try {
      const result = await generateObject({
        model: this.model,
        schema: StackOptimizationSchema,
        prompt,
        temperature: 0.4
      })

      advancedDebugger.info(DebugCategory.AI, 'AI stack optimization completed', {
        userId: userProfile.userId,
        recommendationCount: result.object.recommendations.length,
        estimatedSavings: result.object.costOptimization.savings
      })

      return result.object
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'AI stack optimization failed', error)
      throw new Error(
        `Stack optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Answers complex knowledge queries using AI with research integration
   */
  public async answerKnowledgeQuery(
    query: string,
    context?: {
      userGoals?: UserGoal[]
      focusAreas?: BodySystem[]
      includeResearch?: boolean
    }
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Processing knowledge query', {
      query: query.substring(0, 100),
      hasContext: !!context
    })

    let enhancedPrompt = query

    // Add research context if requested
    if (context?.includeResearch) {
      try {
        // This would integrate with research system for latest findings
        enhancedPrompt += `\n\nPlease incorporate latest research findings and cite scientific evidence where available.`
      } catch (error) {
        advancedDebugger.warn(
          DebugCategory.AI,
          'Research integration failed, continuing without',
          error
        )
      }
    }

    const prompt = this.buildKnowledgeQueryPrompt(enhancedPrompt, context)

    try {
      const result = await generateObject({
        model: this.model,
        schema: KnowledgeQuerySchema,
        prompt,
        temperature: 0.5
      })

      advancedDebugger.info(DebugCategory.AI, 'Knowledge query answered', {
        answerLength: result.object.answer.length,
        evidenceLevel: result.object.evidenceLevel,
        relatedSupplementsCount: result.object.relatedSupplements.length
      })

      return result.object
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Knowledge query failed', error)
      throw new Error(
        `Knowledge query failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Generates highly personalized supplement recommendations
   */
  public async generatePersonalizedRecommendations(
    userProfile: UserSupplementProfile,
    preferences?: {
      budgetLimit?: number
      preferNatural?: boolean
      avoidStimulants?: boolean
      focusOnSafety?: boolean
      maxSupplements?: number
    }
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Generating personalized recommendations', {
      userId: userProfile.userId,
      goals: userProfile.goals,
      preferences: preferences
    })

    const prompt = this.buildPersonalizationPrompt(userProfile, preferences)

    try {
      const result = await generateObject({
        model: this.model,
        schema: PersonalizedRecommendationSchema,
        prompt,
        temperature: 0.4
      })

      advancedDebugger.info(DebugCategory.AI, 'Personalized recommendations generated', {
        userId: userProfile.userId,
        primaryRecommendations: result.object.primaryRecommendations.length,
        lifestyleRecommendations: result.object.lifestyle_recommendations.length,
        riskLevel: result.object.risk_assessment.overall_risk
      })

      return result.object
    } catch (error) {
      advancedDebugger.error(
        DebugCategory.AI,
        'Personalized recommendations failed',
        error
      )
      throw new Error(
        `Personalized recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Interactive chat interface for supplement and health questions
   */
  public async createInteractiveChat(
    userId: string,
    initialMessage: string,
    context?: {
      userProfile?: UserSupplementProfile
      conversationHistory?: boolean
    }
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Starting interactive chat', {
      userId,
      messageLength: initialMessage.length,
      hasProfile: !!context?.userProfile
    })

    const history = context?.conversationHistory
      ? this.conversationHistory.get(userId) || []
      : []

    const systemPrompt = this.buildChatSystemPrompt(context?.userProfile)

    try {
      const result = await streamText({
        model: this.model,
        system: systemPrompt,
        messages: [...history, { role: 'user', content: initialMessage }],
        tools: {
          analyzeSupplementInteraction: tool({
            description: 'Analyze potential interactions between supplements',
            parameters: z.object({
              supplements: z
                .array(z.string())
                .describe('List of supplement names to analyze')
            }),
            execute: async ({ supplements }) => {
              // This would call our interaction checker
              return `Analyzing interactions between: ${supplements.join(', ')}`
            }
          }),
          searchResearch: tool({
            description:
              'Search for latest research on a specific supplement or health topic',
            parameters: z.object({
              topic: z.string().describe('Research topic to search for')
            }),
            execute: async ({ topic }) => {
              // This would integrate with our research system
              return `Searching latest research on: ${topic}`
            }
          }),
          recommendSupplements: tool({
            description: 'Get personalized supplement recommendations',
            parameters: z.object({
              goals: z.array(z.string()).describe('User health goals'),
              restrictions: z
                .array(z.string())
                .optional()
                .describe('Any restrictions or preferences')
            }),
            execute: async ({ goals, restrictions }) => {
              return `Generating recommendations for goals: ${goals.join(', ')}`
            }
          })
        },
        temperature: 0.6,
        maxTokens: 1500
      })

      // Store conversation for context
      if (context?.conversationHistory) {
        const newHistory = [
          ...history,
          { role: 'user', content: initialMessage },
          { role: 'assistant', content: 'AI response will be streamed' }
        ]
        this.conversationHistory.set(userId, newHistory.slice(-10)) // Keep last 10 messages
      }

      return result
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Interactive chat failed', error)
      throw new Error(
        `Chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Generates educational content about supplements and body systems
   */
  public async generateEducationalContent(
    topic: string,
    targetAudience: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    format: 'article' | 'summary' | 'qa' | 'interactive' = 'article'
  ) {
    advancedDebugger.info(DebugCategory.AI, 'Generating educational content', {
      topic,
      targetAudience,
      format
    })

    const prompt = `
    Create comprehensive educational content about: ${topic}
    
    Target audience: ${targetAudience}
    Format: ${format}
    
    Requirements:
    - Scientifically accurate and evidence-based
    - Appropriate for ${targetAudience} level
    - Include practical applications
    - Mention safety considerations
    - Cite mechanisms of action where relevant
    - Include any relevant supplement connections
    
    Structure the response as ${
      format === 'article'
        ? 'a full article with sections'
        : format === 'summary'
          ? 'key points and takeaways'
          : format === 'qa'
            ? 'questions and detailed answers'
            : 'an interactive learning module'
    }
    `

    try {
      const result = await generateText({
        model: this.model,
        prompt,
        temperature: 0.5,
        maxTokens: 2000
      })

      advancedDebugger.info(DebugCategory.AI, 'Educational content generated', {
        topic,
        contentLength: result.text.length,
        format
      })

      return result.text
    } catch (error) {
      advancedDebugger.error(
        DebugCategory.AI,
        'Educational content generation failed',
        error
      )
      throw new Error(
        `Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Private helper methods for building prompts

  private buildSupplementAnalysisPrompt(
    supplement: EnhancedSupplement,
    userContext?: any
  ): string {
    return `
    You are an expert supplement researcher and clinical nutritionist. Analyze the following supplement comprehensively:

    Supplement: ${supplement.name}
    Common names: ${supplement.commonNames.join(', ')}
    Active compounds: ${supplement.activeCompounds.join(', ')}
    Primary effects: ${supplement.primaryEffects.join(', ')}
    Category: ${supplement.category}
    Target systems: ${supplement.targetSystems.join(', ')}
    Current evidence level: ${supplement.evidenceLevel}
    
    ${
      userContext
        ? `
    User context:
    - Goals: ${userContext.goals?.map((g: any) => g.goal).join(', ') || 'Not specified'}
    - Health conditions: ${userContext.healthConditions?.join(', ') || 'None specified'}
    - Current supplements: ${userContext.currentSupplements?.join(', ') || 'None'}
    - Age: ${userContext.age || 'Not specified'}
    - Gender: ${userContext.gender || 'Not specified'}
    `
        : ''
    }

    Provide a comprehensive analysis focusing on:
    1. Safety profile and potential risks
    2. Efficacy based on current research
    3. Optimal dosing and timing
    4. Target conditions and benefits
    5. Contraindications and warnings
    6. Quality of supporting evidence
    
    Be objective, evidence-based, and consider the user context if provided.
    `
  }

  private buildStackOptimizationPrompt(
    userProfile: UserSupplementProfile,
    currentSupplements: EnhancedSupplement[],
    availableSupplements?: EnhancedSupplement[]
  ): string {
    return `
    You are a clinical nutritionist and supplement optimization expert. Analyze and optimize the following supplement stack:

    User Profile:
    - Goals: ${userProfile.goals.map((g) => g).join(', ')}
    - Health conditions: ${userProfile.healthConditions.join(', ') || 'None'}
    - Medications: ${userProfile.medications.join(', ') || 'None'}
    - Allergies: ${userProfile.allergies.join(', ') || 'None'}
    - Budget limit: ${userProfile.preferences.budgetLimit || 'Not specified'}

    Current Supplements:
    ${currentSupplements
      .map(
        (supp) => `
    - ${supp.name}: ${supp.dosageInfo.standard.min}-${supp.dosageInfo.standard.max}${supp.dosageInfo.standard.unit}
      Primary effects: ${supp.primaryEffects.join(', ')}
      Evidence level: ${supp.evidenceLevel}
    `
      )
      .join('')}

    Provide comprehensive optimization recommendations considering:
    1. Synergistic effects and interactions
    2. Cost optimization opportunities
    3. Dosing and timing improvements
    4. Redundancy elimination
    5. Gap identification for user goals
    6. Safety and contraindication assessment
    7. Implementation timeline
    
    Focus on evidence-based recommendations that align with the user's goals and constraints.
    `
  }

  private buildKnowledgeQueryPrompt(query: string, context?: any): string {
    return `
    You are an expert in supplement science, biochemistry, and clinical nutrition. Answer the following question comprehensively:

    Question: ${query}

    ${
      context
        ? `
    Context:
    - User goals: ${context.userGoals?.map((g: any) => g).join(', ') || 'Not specified'}
    - Focus areas: ${context.focusAreas?.join(', ') || 'General'}
    - Include research: ${context.includeResearch ? 'Yes' : 'No'}
    `
        : ''
    }

    Provide a thorough, evidence-based response that includes:
    1. Direct answer to the question
    2. Key scientific mechanisms involved
    3. Related supplements or interventions
    4. Practical applications
    5. Important warnings or considerations
    6. Quality of supporting evidence
    7. Suggestions for further learning
    
    Be accurate, cite evidence levels, and provide actionable insights.
    `
  }

  private buildPersonalizationPrompt(
    userProfile: UserSupplementProfile,
    preferences?: any
  ): string {
    return `
    You are a personalized nutrition expert specializing in supplement optimization. Create highly personalized recommendations for this user:

    User Profile:
    - Goals: ${userProfile.goals.map((g) => g).join(', ')}
    - Current supplements: ${userProfile.currentSupplements.map((s) => s.supplementId).join(', ')}
    - Health conditions: ${userProfile.healthConditions.join(', ') || 'None'}
    - Medications: ${userProfile.medications.join(', ') || 'None'}
    - Allergies: ${userProfile.allergies.join(', ') || 'None'}

    Preferences:
    - Budget limit: ${preferences?.budgetLimit || 'Not specified'}
    - Prefer natural: ${preferences?.preferNatural ? 'Yes' : 'No'}
    - Avoid stimulants: ${preferences?.avoidStimulants ? 'Yes' : 'No'}
    - Focus on safety: ${preferences?.focusOnSafety ? 'Yes' : 'No'}
    - Max supplements: ${preferences?.maxSupplements || 'No limit'}

    Provide personalized recommendations including:
    1. Specific supplement suggestions with dosing and timing
    2. Lifestyle modifications to enhance goals
    3. Biomarkers or parameters to monitor
    4. Risk assessment and mitigation strategies
    5. Explanation of why these recommendations fit this specific user
    
    Prioritize safety, evidence-based recommendations, and user preferences.
    `
  }

  private buildChatSystemPrompt(userProfile?: UserSupplementProfile): string {
    return `
    You are an AI assistant specializing in supplements, nutrition, and health optimization. You have access to tools for analyzing interactions, searching research, and providing recommendations.

    Your role:
    - Provide accurate, evidence-based information about supplements and health
    - Help users optimize their supplement regimens safely
    - Explain complex biochemical concepts in accessible terms
    - Always prioritize safety and recommend consulting healthcare providers when appropriate
    - Use available tools to provide comprehensive answers

    ${
      userProfile
        ? `
    Current user context:
    - Goals: ${userProfile.goals.map((g) => g).join(', ')}
    - Current supplements: ${userProfile.currentSupplements.map((s) => s.supplementId).join(', ')}
    - Health conditions: ${userProfile.healthConditions.join(', ') || 'None specified'}
    `
        : ''
    }

    Guidelines:
    - Ask clarifying questions when needed
    - Provide practical, actionable advice
    - Cite evidence levels (strong, moderate, weak, insufficient)
    - Warn about potential interactions or risks
    - Suggest monitoring parameters when relevant
    - Keep responses conversational but informative
    `
  }
}

export const aiKnowledgeEngine = AIKnowledgeEngine.getInstance()
