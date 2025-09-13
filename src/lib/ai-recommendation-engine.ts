import {
  EnhancedSupplement,
  UserSupplementProfile,
  SupplementRecommendation,
  UserGoal,
  EvidenceLevel,
  InteractionSeverity,
  BodySystem,
  MechanismOfAction,
  getEvidenceScore,
  calculateInteractionRisk
} from '@/types/enhanced-supplement'
import {
  supplementInteractionChecker,
  type InteractionAnalysis
} from './supplement-interaction-checker'
import { advancedDebugger, DebugCategory } from './advanced-debugging'

export interface RecommendationCriteria {
  goals: UserGoal[]
  budget?: number
  maxSupplements?: number
  evidenceThreshold?: EvidenceLevel
  safetyThreshold?: number // 0-100
  preferredFormulations?: string[]
  avoidIngredients?: string[]
  prioritizeNatural?: boolean
  includeExperimental?: boolean
}

export interface GoalProfile {
  goal: UserGoal
  targetSystems: BodySystem[]
  keyMechanisms: MechanismOfAction[]
  primarySupplements: string[]
  supportingSupplements: string[]
  contraindications: string[]
  biomarkers: string[]
  evidenceWeight: number // How much evidence is required for this goal
  timeframe: string // Expected time to see effects
}

export interface StackOptimization {
  currentStack: { supplementId: string; effectiveness: number }[]
  recommendations: {
    add: SupplementRecommendation[]
    remove: string[]
    modify: { supplementId: string; newDosage: string; reason: string }[]
  }
  costAnalysis: {
    currentCost: number
    optimizedCost: number
    savings: number
    costPerGoal: number
  }
  timelineAnalysis: {
    shortTerm: SupplementRecommendation[] // 1-4 weeks
    mediumTerm: SupplementRecommendation[] // 1-3 months
    longTerm: SupplementRecommendation[] // 3+ months
  }
}

class AIRecommendationEngine {
  private static instance: AIRecommendationEngine
  private goalProfiles: Map<UserGoal, GoalProfile> = new Map()
  private supplementDatabase: Map<string, EnhancedSupplement> = new Map()

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine()
    }
    return AIRecommendationEngine.instance
  }

  private constructor() {
    this.initializeGoalProfiles()
  }

  private initializeGoalProfiles() {
    // Define goal-specific profiles for targeted recommendations
    this.goalProfiles.set(UserGoal.COGNITIVE_ENHANCEMENT, {
      goal: UserGoal.COGNITIVE_ENHANCEMENT,
      targetSystems: [BodySystem.NERVOUS],
      keyMechanisms: [
        MechanismOfAction.NEUROTRANSMITTER_MODULATION,
        MechanismOfAction.ANTIOXIDANT,
        MechanismOfAction.MEMBRANE_STABILIZATION
      ],
      primarySupplements: ['alpha-gpc', 'citicoline', 'lions-mane', 'bacopa-monnieri'],
      supportingSupplements: [
        'omega-3',
        'magnesium-l-threonate',
        'phosphatidylserine',
        'uridine'
      ],
      contraindications: ['severe-depression', 'bipolar-disorder'],
      biomarkers: ['acetylcholine', 'bdnf', 'inflammation-markers'],
      evidenceWeight: 0.8,
      timeframe: '2-8 weeks'
    })

    this.goalProfiles.set(UserGoal.STRESS_REDUCTION, {
      goal: UserGoal.STRESS_REDUCTION,
      targetSystems: [BodySystem.NERVOUS, BodySystem.ENDOCRINE],
      keyMechanisms: [
        MechanismOfAction.NEUROTRANSMITTER_MODULATION,
        MechanismOfAction.ANTI_INFLAMMATORY,
        MechanismOfAction.RECEPTOR_AGONISM
      ],
      primarySupplements: ['ashwagandha', 'rhodiola-rosea', 'l-theanine', 'magnesium'],
      supportingSupplements: ['phosphatidylserine', 'holy-basil', 'lemon-balm'],
      contraindications: ['autoimmune-disorders'],
      biomarkers: ['cortisol', 'dhea', 'inflammatory-markers'],
      evidenceWeight: 0.7,
      timeframe: '1-4 weeks'
    })

    this.goalProfiles.set(UserGoal.SLEEP_IMPROVEMENT, {
      goal: UserGoal.SLEEP_IMPROVEMENT,
      targetSystems: [BodySystem.NERVOUS],
      keyMechanisms: [
        MechanismOfAction.NEUROTRANSMITTER_MODULATION,
        MechanismOfAction.RECEPTOR_AGONISM
      ],
      primarySupplements: ['melatonin', 'magnesium-glycinate', 'l-theanine', 'valerian'],
      supportingSupplements: ['gaba', 'chamomile', 'passionflower', 'glycine'],
      contraindications: ['sleep-apnea-untreated'],
      biomarkers: ['melatonin', 'cortisol', 'gaba'],
      evidenceWeight: 0.6,
      timeframe: '3-14 days'
    })

    this.goalProfiles.set(UserGoal.ENERGY_BOOST, {
      goal: UserGoal.ENERGY_BOOST,
      targetSystems: [
        BodySystem.NERVOUS,
        BodySystem.ENDOCRINE,
        BodySystem.CARDIOVASCULAR
      ],
      keyMechanisms: [
        MechanismOfAction.METABOLIC_ENHANCEMENT,
        MechanismOfAction.NEUROTRANSMITTER_MODULATION,
        MechanismOfAction.ANTIOXIDANT
      ],
      primarySupplements: ['coq10', 'rhodiola-rosea', 'b-complex', 'iron'],
      supportingSupplements: ['creatine', 'tyrosine', 'cordyceps', 'ribose'],
      contraindications: ['hyperthyroidism', 'severe-anxiety'],
      biomarkers: ['b12', 'iron', 'thyroid-hormones', 'atp'],
      evidenceWeight: 0.6,
      timeframe: '1-3 weeks'
    })

    this.goalProfiles.set(UserGoal.ATHLETIC_PERFORMANCE, {
      goal: UserGoal.ATHLETIC_PERFORMANCE,
      targetSystems: [
        BodySystem.MUSCULOSKELETAL,
        BodySystem.CARDIOVASCULAR,
        BodySystem.NERVOUS
      ],
      keyMechanisms: [
        MechanismOfAction.METABOLIC_ENHANCEMENT,
        MechanismOfAction.ANTIOXIDANT,
        MechanismOfAction.ANTI_INFLAMMATORY
      ],
      primarySupplements: ['creatine', 'beta-alanine', 'citrulline', 'caffeine'],
      supportingSupplements: ['hmb', 'beetroot', 'taurine', 'branched-chain-amino-acids'],
      contraindications: ['heart-conditions', 'severe-hypertension'],
      biomarkers: ['creatine-kinase', 'lactate', 'testosterone', 'growth-hormone'],
      evidenceWeight: 0.9,
      timeframe: '1-6 weeks'
    })
  }

  /**
   * Generates personalized supplement recommendations based on user profile and goals
   */
  public async generateRecommendations(
    userProfile: UserSupplementProfile,
    criteria: RecommendationCriteria,
    availableSupplements: EnhancedSupplement[]
  ): Promise<SupplementRecommendation[]> {
    advancedDebugger.info(DebugCategory.AI, 'Starting recommendation generation', {
      userId: userProfile.userId,
      goals: criteria.goals,
      supplementCount: availableSupplements.length
    })

    // Initialize supplement database
    availableSupplements.forEach((supp) => {
      this.supplementDatabase.set(supp.id, supp)
    })

    const recommendations: SupplementRecommendation[] = []

    // Score supplements for each goal
    for (const goal of criteria.goals) {
      const goalProfile = this.goalProfiles.get(goal)
      if (!goalProfile) continue

      const goalRecommendations = await this.generateGoalSpecificRecommendations(
        goal,
        goalProfile,
        userProfile,
        criteria,
        availableSupplements
      )

      recommendations.push(...goalRecommendations)
    }

    // Remove duplicates and merge scores
    const mergedRecommendations = this.mergeDuplicateRecommendations(recommendations)

    // Filter by criteria
    const filteredRecommendations = this.applyRecommendationFilters(
      mergedRecommendations,
      criteria,
      userProfile
    )

    // Sort by overall score
    const sortedRecommendations = filteredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, criteria.maxSupplements || 10)

    advancedDebugger.info(DebugCategory.AI, 'Recommendation generation completed', {
      totalRecommendations: sortedRecommendations.length,
      averageScore:
        sortedRecommendations.reduce((sum, r) => sum + r.score, 0) /
        sortedRecommendations.length
    })

    return sortedRecommendations
  }

  /**
   * Generates recommendations specific to a single goal
   */
  private async generateGoalSpecificRecommendations(
    goal: UserGoal,
    goalProfile: GoalProfile,
    userProfile: UserSupplementProfile,
    criteria: RecommendationCriteria,
    availableSupplements: EnhancedSupplement[]
  ): Promise<SupplementRecommendation[]> {
    const recommendations: SupplementRecommendation[] = []

    for (const supplement of availableSupplements) {
      // Skip if user is already taking this supplement
      if (userProfile.currentSupplements.some((s) => s.supplementId === supplement.id)) {
        continue
      }

      // Check if supplement is relevant to the goal
      const relevanceScore = this.calculateGoalRelevance(supplement, goalProfile)
      if (relevanceScore < 0.3) continue

      // Calculate evidence score
      const evidenceScore = getEvidenceScore(supplement)

      // Check safety and interactions
      const interactionRisk = calculateInteractionRisk(supplement, userProfile)
      const safetyAnalysis = supplementInteractionChecker.checkSupplementSafety(
        supplement.id,
        supplement,
        userProfile
      )

      // Calculate overall score
      const overallScore = this.calculateOverallScore(
        supplement,
        goalProfile,
        relevanceScore,
        evidenceScore,
        safetyAnalysis,
        criteria
      )

      if (overallScore > 30) {
        // Minimum threshold
        const recommendation: SupplementRecommendation = {
          supplementId: supplement.id,
          supplement,
          score: overallScore,
          reasoning: this.generateReasoning(
            supplement,
            goalProfile,
            relevanceScore,
            evidenceScore
          ),
          warnings: safetyAnalysis.warnings.map((w) => w.description),
          dosageRecommendation: this.calculatePersonalizedDosage(
            supplement,
            userProfile,
            goal
          ),
          priority: this.calculatePriority(overallScore, safetyAnalysis),
          evidenceScore,
          costEffectiveness: this.calculateCostEffectiveness(supplement, overallScore),
          interactionRisk: safetyAnalysis.riskLevel,
          monitoringRequired: safetyAnalysis.monitoringRequired
        }

        recommendations.push(recommendation)
      }
    }

    return recommendations
  }

  /**
   * Calculates how relevant a supplement is to a specific goal
   */
  private calculateGoalRelevance(
    supplement: EnhancedSupplement,
    goalProfile: GoalProfile
  ): number {
    let score = 0
    let maxScore = 0

    // Check if supplement directly targets the goal
    maxScore += 40
    if (supplement.userGoals.includes(goalProfile.goal)) {
      score += 40
    }

    // Check primary effects alignment
    maxScore += 30
    const primaryEffectMatch = supplement.primaryEffects.some((effect) =>
      goalProfile.primarySupplements.some((primary) =>
        effect.toLowerCase().includes(primary)
      )
    )
    if (primaryEffectMatch) score += 30

    // Check mechanism of action alignment
    maxScore += 20
    const mechanismMatch = supplement.mechanismsOfAction.some((mechanism) =>
      goalProfile.keyMechanisms.includes(mechanism)
    )
    if (mechanismMatch) score += 20

    // Check target system alignment
    maxScore += 10
    const systemMatch = supplement.targetSystems.some((system) =>
      goalProfile.targetSystems.includes(system)
    )
    if (systemMatch) score += 10

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Calculates overall recommendation score
   */
  private calculateOverallScore(
    supplement: EnhancedSupplement,
    goalProfile: GoalProfile,
    relevanceScore: number,
    evidenceScore: number,
    safetyAnalysis: InteractionAnalysis,
    criteria: RecommendationCriteria
  ): number {
    let score = 0

    // Relevance to goal (40% weight)
    score += relevanceScore * 40

    // Evidence quality (30% weight)
    score += (evidenceScore / 100) * 30 * goalProfile.evidenceWeight

    // Safety score (20% weight)
    score += (safetyAnalysis.safetyScore / 100) * 20

    // Cost effectiveness (10% weight)
    if (supplement.costEffectiveness) {
      const costScore = { high: 10, medium: 7, low: 4 }[supplement.costEffectiveness]
      score += costScore
    }

    // Penalties for issues
    if (safetyAnalysis.riskLevel === 'high' || safetyAnalysis.riskLevel === 'severe') {
      score -= 30
    }
    if (safetyAnalysis.riskLevel === 'medium') {
      score -= 15
    }

    // Bonus for beneficial interactions
    const beneficialInteractions = safetyAnalysis.interactions.filter(
      (i) => i.severity === InteractionSeverity.BENEFICIAL
    )
    score += beneficialInteractions.length * 5

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Generates reasoning for the recommendation
   */
  private generateReasoning(
    supplement: EnhancedSupplement,
    goalProfile: GoalProfile,
    relevanceScore: number,
    evidenceScore: number
  ): string[] {
    const reasoning: string[] = []

    if (supplement.userGoals.includes(goalProfile.goal)) {
      reasoning.push(
        `Directly targets your goal of ${goalProfile.goal.replace('_', ' ')}`
      )
    }

    if (evidenceScore > 75) {
      reasoning.push('Strong scientific evidence supporting its effectiveness')
    } else if (evidenceScore > 50) {
      reasoning.push('Moderate scientific evidence supporting its effectiveness')
    }

    const mechanismMatches = supplement.mechanismsOfAction.filter((m) =>
      goalProfile.keyMechanisms.includes(m)
    )
    if (mechanismMatches.length > 0) {
      reasoning.push(`Works through key mechanisms: ${mechanismMatches.join(', ')}`)
    }

    if (supplement.clinicalUse) {
      reasoning.push('Used in clinical practice for this purpose')
    }

    if (supplement.popularityScore > 80) {
      reasoning.push('Highly regarded in the supplement community')
    }

    return reasoning
  }

  /**
   * Calculates personalized dosage recommendation
   */
  private calculatePersonalizedDosage(
    supplement: EnhancedSupplement,
    userProfile: UserSupplementProfile,
    goal: UserGoal
  ): string {
    const baseMinDose = supplement.dosageInfo.standard.min
    const baseMaxDose = supplement.dosageInfo.standard.max
    const unit = supplement.dosageInfo.standard.unit

    // Adjust based on user factors
    let adjustedMin = baseMinDose
    let adjustedMax = baseMaxDose

    // Conservative approach for beginners
    const isNewToSupplements = userProfile.currentSupplements.length < 3
    if (isNewToSupplements) {
      adjustedMin = baseMinDose * 0.75
      adjustedMax = baseMinDose * 1.25
    }

    // Consider age-specific dosing
    if (supplement.dosageInfo.ageSpecific) {
      // This would require user age information
      // For now, assume standard adult dosing
    }

    // Consider body weight based dosing
    if (supplement.dosageInfo.bodyWeightBased) {
      // This would require user weight information
      // Default to standard dosing for now
    }

    const recommendedDose = Math.round((adjustedMin + adjustedMax) / 2)
    return `${recommendedDose}${unit} ${supplement.dosageInfo.standard.frequency}`
  }

  /**
   * Calculates priority level
   */
  private calculatePriority(
    score: number,
    safetyAnalysis: InteractionAnalysis
  ): 'high' | 'medium' | 'low' {
    if (safetyAnalysis.riskLevel === 'high' || safetyAnalysis.riskLevel === 'severe') {
      return 'low'
    }

    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
  }

  /**
   * Calculates cost effectiveness score
   */
  private calculateCostEffectiveness(
    supplement: EnhancedSupplement,
    score: number
  ): number {
    if (!supplement.costPerDose || !supplement.costEffectiveness) return 50

    const costMultiplier = { high: 1.2, medium: 1.0, low: 0.8 }[
      supplement.costEffectiveness
    ]
    return Math.round((score / 100) * 100 * costMultiplier)
  }

  /**
   * Merges duplicate recommendations and combines scores
   */
  private mergeDuplicateRecommendations(
    recommendations: SupplementRecommendation[]
  ): SupplementRecommendation[] {
    const merged = new Map<string, SupplementRecommendation>()

    recommendations.forEach((rec) => {
      if (merged.has(rec.supplementId)) {
        const existing = merged.get(rec.supplementId)!
        existing.score = Math.max(existing.score, rec.score)
        existing.reasoning.push(...rec.reasoning)
        existing.warnings.push(...rec.warnings)
        existing.monitoringRequired.push(...rec.monitoringRequired)
      } else {
        merged.set(rec.supplementId, { ...rec })
      }
    })

    return Array.from(merged.values())
  }

  /**
   * Applies filtering criteria to recommendations
   */
  private applyRecommendationFilters(
    recommendations: SupplementRecommendation[],
    criteria: RecommendationCriteria,
    userProfile: UserSupplementProfile
  ): SupplementRecommendation[] {
    return recommendations.filter((rec) => {
      // Evidence threshold
      if (
        criteria.evidenceThreshold &&
        rec.evidenceScore < this.getEvidenceThreshold(criteria.evidenceThreshold)
      ) {
        return false
      }

      // Safety threshold
      if (
        criteria.safetyThreshold &&
        rec.supplement.evidenceLevel === EvidenceLevel.INSUFFICIENT
      ) {
        return false
      }

      // Avoid ingredients
      if (
        criteria.avoidIngredients?.some((ingredient) =>
          rec.supplement.activeCompounds.some((compound) =>
            compound.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      ) {
        return false
      }

      // Preferred formulations
      if (
        criteria.preferredFormulations?.length &&
        !rec.supplement.formulations.some((form) =>
          criteria.preferredFormulations!.includes(form)
        )
      ) {
        return false
      }

      // Budget constraints
      if (
        criteria.budget &&
        rec.supplement.costPerDose &&
        rec.supplement.costPerDose * 30 > criteria.budget
      ) {
        return false
      }

      return true
    })
  }

  private getEvidenceThreshold(level: EvidenceLevel): number {
    const thresholds = {
      [EvidenceLevel.STRONG]: 85,
      [EvidenceLevel.MODERATE]: 65,
      [EvidenceLevel.WEAK]: 45,
      [EvidenceLevel.INSUFFICIENT]: 25,
      [EvidenceLevel.CONFLICTING]: 40
    }
    return thresholds[level]
  }

  /**
   * Optimizes an existing supplement stack
   */
  public async optimizeSupplementStack(
    userProfile: UserSupplementProfile,
    criteria: RecommendationCriteria,
    availableSupplements: EnhancedSupplement[]
  ): Promise<StackOptimization> {
    advancedDebugger.info(DebugCategory.AI, 'Starting stack optimization', {
      userId: userProfile.userId,
      currentSupplements: userProfile.currentSupplements.length
    })

    // Analyze current stack effectiveness
    const currentStackAnalysis = this.analyzeCurrentStack(
      userProfile,
      availableSupplements
    )

    // Generate new recommendations
    const newRecommendations = await this.generateRecommendations(
      userProfile,
      criteria,
      availableSupplements
    )

    // Identify supplements to remove (low effectiveness, high risk, or redundant)
    const toRemove = currentStackAnalysis
      .filter((item) => item.effectiveness < 0.3)
      .map((item) => item.supplementId)

    // Identify supplements to modify (dosage adjustments)
    const toModify = this.identifyDosageAdjustments(userProfile, availableSupplements)

    // Calculate cost analysis
    const costAnalysis = this.calculateCostAnalysis(
      userProfile,
      newRecommendations,
      availableSupplements
    )

    // Create timeline analysis
    const timelineAnalysis = this.createTimelineAnalysis(newRecommendations)

    return {
      currentStack: currentStackAnalysis,
      recommendations: {
        add: newRecommendations.slice(0, 5), // Top 5 new recommendations
        remove: toRemove,
        modify: toModify
      },
      costAnalysis,
      timelineAnalysis
    }
  }

  private analyzeCurrentStack(
    userProfile: UserSupplementProfile,
    availableSupplements: EnhancedSupplement[]
  ): { supplementId: string; effectiveness: number }[] {
    return userProfile.currentSupplements.map((current) => {
      const supplement = availableSupplements.find((s) => s.id === current.supplementId)
      if (!supplement) return { supplementId: current.supplementId, effectiveness: 0 }

      // Calculate effectiveness based on evidence, goal alignment, and user rating
      let effectiveness = (getEvidenceScore(supplement) / 100) * 0.5

      if (current.effectiveness) {
        effectiveness += (current.effectiveness / 10) * 0.3
      }

      if (current.adherence) {
        effectiveness *= current.adherence / 100
      }

      // Goal alignment
      const goalAlignment = supplement.userGoals.some((goal) =>
        userProfile.goals.includes(goal)
      )
        ? 0.2
        : 0
      effectiveness += goalAlignment

      return {
        supplementId: current.supplementId,
        effectiveness: Math.min(1, effectiveness)
      }
    })
  }

  private identifyDosageAdjustments(
    userProfile: UserSupplementProfile,
    availableSupplements: EnhancedSupplement[]
  ): { supplementId: string; newDosage: string; reason: string }[] {
    const adjustments: { supplementId: string; newDosage: string; reason: string }[] = []

    userProfile.currentSupplements.forEach((current) => {
      const supplement = availableSupplements.find((s) => s.id === current.supplementId)
      if (!supplement) return

      const standardMin = supplement.dosageInfo.standard.min
      const standardMax = supplement.dosageInfo.standard.max
      const currentDosageMatch = current.dosage.match(/(\d+(?:\.\d+)?)/)
      const currentDosage = currentDosageMatch
        ? parseFloat(currentDosageMatch[1])
        : standardMin

      // Suggest adjustments based on effectiveness and side effects
      if (
        current.effectiveness &&
        current.effectiveness < 5 &&
        currentDosage < standardMax
      ) {
        adjustments.push({
          supplementId: current.supplementId,
          newDosage: `${Math.min(standardMax, currentDosage * 1.5)}${supplement.dosageInfo.standard.unit}`,
          reason: 'Low effectiveness reported, consider increasing dose within safe range'
        })
      }

      if (current.sideEffects.length > 0 && currentDosage > standardMin) {
        adjustments.push({
          supplementId: current.supplementId,
          newDosage: `${Math.max(standardMin, currentDosage * 0.7)}${supplement.dosageInfo.standard.unit}`,
          reason: 'Side effects reported, consider reducing dose'
        })
      }
    })

    return adjustments
  }

  private calculateCostAnalysis(
    userProfile: UserSupplementProfile,
    recommendations: SupplementRecommendation[],
    availableSupplements: EnhancedSupplement[]
  ): StackOptimization['costAnalysis'] {
    // Calculate current monthly cost
    const currentCost = userProfile.currentSupplements.reduce((total, current) => {
      const supplement = availableSupplements.find((s) => s.id === current.supplementId)
      return total + (supplement?.costPerDose ? supplement.costPerDose * 30 : 0)
    }, 0)

    // Calculate optimized cost (top 5 recommendations)
    const optimizedCost = recommendations.slice(0, 5).reduce((total, rec) => {
      return total + (rec.supplement.costPerDose ? rec.supplement.costPerDose * 30 : 0)
    }, 0)

    const savings = currentCost - optimizedCost
    const costPerGoal = optimizedCost / Math.max(1, userProfile.goals.length)

    return {
      currentCost,
      optimizedCost,
      savings,
      costPerGoal
    }
  }

  private createTimelineAnalysis(
    recommendations: SupplementRecommendation[]
  ): StackOptimization['timelineAnalysis'] {
    const shortTerm: SupplementRecommendation[] = []
    const mediumTerm: SupplementRecommendation[] = []
    const longTerm: SupplementRecommendation[] = []

    recommendations.forEach((rec) => {
      // Categorize based on expected onset time and supplement characteristics
      const hasQuickOnset =
        rec.supplement.onsetTime &&
        (rec.supplement.onsetTime.includes('minutes') ||
          rec.supplement.onsetTime.includes('hours') ||
          rec.supplement.onsetTime.includes('days'))

      const isFoundational =
        rec.supplement.category === 'health' ||
        rec.supplement.userGoals.includes(UserGoal.GENERAL_HEALTH)

      if (hasQuickOnset && rec.priority === 'high') {
        shortTerm.push(rec)
      } else if (isFoundational || rec.priority === 'medium') {
        mediumTerm.push(rec)
      } else {
        longTerm.push(rec)
      }
    })

    return {
      shortTerm: shortTerm.slice(0, 3),
      mediumTerm: mediumTerm.slice(0, 4),
      longTerm: longTerm.slice(0, 3)
    }
  }
}

export const aiRecommendationEngine = AIRecommendationEngine.getInstance()
