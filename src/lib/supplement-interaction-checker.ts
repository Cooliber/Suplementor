import { 
  EnhancedSupplement, 
  UserSupplementProfile, 
  SupplementInteraction,
  InteractionSeverity,
  EvidenceLevel,
  BodySystem,
  MechanismOfAction
} from '@/types/enhanced-supplement';
import { supplementDebugger } from './advanced-debugging';

export interface InteractionAnalysis {
  hasInteractions: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'severe';
  interactions: DetailedInteraction[];
  warnings: SafetyWarning[];
  recommendations: string[];
  monitoringRequired: string[];
  safetyScore: number; // 0-100 (100 = completely safe)
}

export interface DetailedInteraction {
  supplement1: string;
  supplement2: string;
  severity: InteractionSeverity;
  type: 'synergistic' | 'antagonistic' | 'additive' | 'competitive' | 'toxic';
  mechanism: string;
  clinicalEvidence: EvidenceLevel;
  description: string;
  recommendation: string;
  timeGap?: string;
  dosageAdjustment?: string;
  references: string[];
}

export interface SafetyWarning {
  type: 'contraindication' | 'caution' | 'monitoring' | 'dose_adjustment' | 'timing';
  severity: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  supplements: string[];
  action: string;
}

export interface SupplementStack {
  supplements: { id: string; dosage: string; timing: string }[];
  duration: string;
  purpose: string[];
}

class SupplementInteractionChecker {
  private static instance: SupplementInteractionChecker;
  private interactionDatabase: Map<string, DetailedInteraction[]> = new Map();
  private contradictionDatabase: Map<string, string[]> = new Map();
  
  static getInstance(): SupplementInteractionChecker {
    if (!SupplementInteractionChecker.instance) {
      SupplementInteractionChecker.instance = new SupplementInteractionChecker();
    }
    return SupplementInteractionChecker.instance;
  }

  private constructor() {
    this.initializeInteractionDatabase();
  }

  private initializeInteractionDatabase() {
    // Known supplement interactions - this would typically come from a comprehensive database
    const knownInteractions: DetailedInteraction[] = [
      {
        supplement1: 'alpha-gpc',
        supplement2: 'citicoline',
        severity: InteractionSeverity.BENEFICIAL,
        type: 'synergistic',
        mechanism: 'Both increase acetylcholine levels through different pathways',
        clinicalEvidence: EvidenceLevel.MODERATE,
        description: 'Alpha-GPC and Citicoline work synergistically to enhance cholinergic function',
        recommendation: 'Can be taken together, may reduce required doses',
        references: ['https://pubmed.ncbi.nlm.nih.gov/21030620/']
      },
      {
        supplement1: 'caffeine',
        supplement2: 'l-theanine',
        severity: InteractionSeverity.BENEFICIAL,
        type: 'synergistic',
        mechanism: 'L-theanine modulates caffeine stimulation, reducing jitters',
        clinicalEvidence: EvidenceLevel.STRONG,
        description: 'L-theanine smooths caffeine effects and improves focus without jitters',
        recommendation: 'Optimal ratio is 2:1 (theanine:caffeine)',
        references: ['https://pubmed.ncbi.nlm.nih.gov/18296328/']
      },
      {
        supplement1: 'magnesium',
        supplement2: 'calcium',
        severity: InteractionSeverity.MODERATE,
        type: 'competitive',
        mechanism: 'Compete for absorption in intestines',
        clinicalEvidence: EvidenceLevel.MODERATE,
        description: 'High doses of either can reduce absorption of the other',
        recommendation: 'Take at different times, maintain 2:1 calcium:magnesium ratio',
        timeGap: '2-3 hours apart',
        references: ['https://pubmed.ncbi.nlm.nih.gov/12040917/']
      },
      {
        supplement1: 'iron',
        supplement2: 'zinc',
        severity: InteractionSeverity.MODERATE,
        type: 'competitive',
        mechanism: 'Compete for same transporters (DMT1, ZIP14)',
        clinicalEvidence: EvidenceLevel.STRONG,
        description: 'Iron can significantly reduce zinc absorption when taken together',
        recommendation: 'Take at different meals or use chelated forms',
        timeGap: '2-4 hours apart',
        references: ['https://pubmed.ncbi.nlm.nih.gov/11115789/']
      },
      {
        supplement1: 'curcumin',
        supplement2: 'black-pepper-extract',
        severity: InteractionSeverity.BENEFICIAL,
        type: 'synergistic',
        mechanism: 'Piperine inhibits curcumin metabolism, increasing bioavailability',
        clinicalEvidence: EvidenceLevel.STRONG,
        description: 'Black pepper extract (piperine) increases curcumin absorption by 2000%',
        recommendation: 'Take together for maximum benefit',
        references: ['https://pubmed.ncbi.nlm.nih.gov/9619120/']
      },
      {
        supplement1: 'warfarin',
        supplement2: 'omega-3',
        severity: InteractionSeverity.SEVERE,
        type: 'additive',
        mechanism: 'Both have anticoagulant effects',
        clinicalEvidence: EvidenceLevel.STRONG,
        description: 'Increased bleeding risk when combined with anticoagulants',
        recommendation: 'Medical supervision required, regular INR monitoring',
        references: ['https://pubmed.ncbi.nlm.nih.gov/15998711/']
      }
    ];

    // Organize interactions by supplement pairs
    knownInteractions.forEach(interaction => {
      const key1 = `${interaction.supplement1}-${interaction.supplement2}`;
      const key2 = `${interaction.supplement2}-${interaction.supplement1}`;
      
      if (!this.interactionDatabase.has(key1)) {
        this.interactionDatabase.set(key1, []);
      }
      if (!this.interactionDatabase.has(key2)) {
        this.interactionDatabase.set(key2, []);
      }
      
      this.interactionDatabase.get(key1)!.push(interaction);
      this.interactionDatabase.get(key2)!.push(interaction);
    });
  }

  /**
   * Analyzes interactions for a complete supplement stack
   */
  public analyzeSupplementStack(stack: SupplementStack, userProfile: UserSupplementProfile): InteractionAnalysis {
    supplementDebugger.logInteraction('stack-analysis', 'analyze', { 
      supplementCount: stack.supplements.length,
      userId: userProfile.userId 
    });

    const interactions: DetailedInteraction[] = [];
    const warnings: SafetyWarning[] = [];
    const recommendations: string[] = [];
    const monitoringRequired: string[] = [];

    // Check pairwise interactions
    for (let i = 0; i < stack.supplements.length; i++) {
      for (let j = i + 1; j < stack.supplements.length; j++) {
        const supp1 = stack.supplements[i];
        const supp2 = stack.supplements[j];
        
        const pairInteractions = this.checkPairwiseInteraction(supp1.id, supp2.id);
        interactions.push(...pairInteractions);
      }
    }

    // Check medication interactions
    stack.supplements.forEach(supp => {
      userProfile.medications.forEach(medication => {
        const medInteractions = this.checkMedicationInteraction(supp.id, medication);
        interactions.push(...medInteractions);
      });
    });

    // Generate warnings based on interactions
    interactions.forEach(interaction => {
      if (interaction.severity === InteractionSeverity.SEVERE) {
        warnings.push({
          type: 'contraindication',
          severity: 'danger',
          title: 'Severe Interaction Detected',
          description: interaction.description,
          supplements: [interaction.supplement1, interaction.supplement2],
          action: interaction.recommendation
        });
      } else if (interaction.severity === InteractionSeverity.MODERATE) {
        warnings.push({
          type: 'caution',
          severity: 'warning',
          title: 'Moderate Interaction',
          description: interaction.description,
          supplements: [interaction.supplement1, interaction.supplement2],
          action: interaction.recommendation
        });
      }
    });

    // Check for condition-specific contraindications
    this.checkConditionContraindications(stack.supplements, userProfile, warnings);

    // Calculate overall risk level and safety score
    const riskLevel = this.calculateRiskLevel(interactions);
    const safetyScore = this.calculateSafetyScore(interactions, warnings);

    // Generate personalized recommendations
    this.generateRecommendations(interactions, userProfile, recommendations, monitoringRequired);

    const analysis: InteractionAnalysis = {
      hasInteractions: interactions.length > 0,
      riskLevel,
      interactions,
      warnings,
      recommendations,
      monitoringRequired,
      safetyScore
    };

    // Log the analysis for debugging
    supplementDebugger.logInteraction('stack-analysis', 'complete', {
      riskLevel,
      interactionCount: interactions.length,
      warningCount: warnings.length,
      safetyScore
    });

    return analysis;
  }

  /**
   * Checks interaction between two specific supplements
   */
  private checkPairwiseInteraction(supplement1Id: string, supplement2Id: string): DetailedInteraction[] {
    const key = `${supplement1Id}-${supplement2Id}`;
    return this.interactionDatabase.get(key) || [];
  }

  /**
   * Checks interactions between supplement and medication
   */
  private checkMedicationInteraction(supplementId: string, medication: string): DetailedInteraction[] {
    // This would query a comprehensive drug-supplement interaction database
    const interactions: DetailedInteraction[] = [];
    
    // Known high-risk medication interactions
    const highRiskMeds = {
      'warfarin': ['omega-3', 'ginkgo-biloba', 'garlic', 'ginseng'],
      'insulin': ['chromium', 'cinnamon', 'bitter-melon'],
      'lithium': ['caffeine', 'psyllium'],
      'digoxin': ['hawthorn', 'st-johns-wort'],
      'ssri': ['st-johns-wort', '5-htp', 'sam-e']
    };

    Object.entries(highRiskMeds).forEach(([med, supplements]) => {
      if (medication.toLowerCase().includes(med) && supplements.includes(supplementId)) {
        interactions.push({
          supplement1: supplementId,
          supplement2: medication,
          severity: InteractionSeverity.SEVERE,
          type: 'toxic',
          mechanism: `${supplementId} may enhance or interfere with ${medication} effects`,
          clinicalEvidence: EvidenceLevel.MODERATE,
          description: `Potential serious interaction between ${supplementId} and ${medication}`,
          recommendation: 'Consult healthcare provider before combining',
          references: []
        });
      }
    });

    return interactions;
  }

  /**
   * Checks for condition-specific contraindications
   */
  private checkConditionContraindications(
    supplements: { id: string; dosage: string }[], 
    userProfile: UserSupplementProfile, 
    warnings: SafetyWarning[]
  ) {
    const conditionContraindications = {
      'hypertension': ['licorice', 'ma-huang', 'bitter-orange'],
      'diabetes': ['ma-huang', 'bitter-orange'],
      'bleeding-disorders': ['ginkgo', 'garlic', 'ginger', 'omega-3'],
      'autoimmune': ['echinacea', 'astragalus', 'elderberry'],
      'bipolar': ['sam-e', 'st-johns-wort'],
      'kidney-disease': ['creatine', 'potassium'],
      'liver-disease': ['kava', 'comfrey', 'pennyroyal']
    };

    userProfile.healthConditions.forEach(condition => {
      const contraindicated = conditionContraindications[condition.toLowerCase() as keyof typeof conditionContraindications];
      if (contraindicated) {
        supplements.forEach(supp => {
          if (contraindicated.includes(supp.id)) {
            warnings.push({
              type: 'contraindication',
              severity: 'danger',
              title: `Contraindicated for ${condition}`,
              description: `${supp.id} may be unsafe with ${condition}`,
              supplements: [supp.id],
              action: 'Consult healthcare provider before use'
            });
          }
        });
      }
    });
  }

  /**
   * Calculates overall risk level based on interactions
   */
  private calculateRiskLevel(interactions: DetailedInteraction[]): 'none' | 'low' | 'medium' | 'high' | 'severe' {
    if (interactions.length === 0) return 'none';
    
    const severeCounts = {
      severe: interactions.filter(i => i.severity === InteractionSeverity.SEVERE).length,
      moderate: interactions.filter(i => i.severity === InteractionSeverity.MODERATE).length,
      minor: interactions.filter(i => i.severity === InteractionSeverity.MINOR).length,
      beneficial: interactions.filter(i => i.severity === InteractionSeverity.BENEFICIAL).length
    };

    if (severeCounts.severe > 0) return 'severe';
    if (severeCounts.moderate > 2) return 'high';
    if (severeCounts.moderate > 0) return 'medium';
    if (severeCounts.minor > 3) return 'medium';
    return 'low';
  }

  /**
   * Calculates safety score (0-100, higher is safer)
   */
  private calculateSafetyScore(interactions: DetailedInteraction[], warnings: SafetyWarning[]): number {
    let score = 100;
    
    interactions.forEach(interaction => {
      switch (interaction.severity) {
        case InteractionSeverity.SEVERE:
          score -= 30;
          break;
        case InteractionSeverity.MODERATE:
          score -= 15;
          break;
        case InteractionSeverity.MINOR:
          score -= 5;
          break;
        case InteractionSeverity.BENEFICIAL:
          score += 5;
          break;
      }
    });

    warnings.forEach(warning => {
      switch (warning.severity) {
        case 'danger':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generates personalized recommendations
   */
  private generateRecommendations(
    interactions: DetailedInteraction[], 
    userProfile: UserSupplementProfile,
    recommendations: string[],
    monitoringRequired: string[]
  ) {
    // Timing recommendations
    const timingInteractions = interactions.filter(i => i.timeGap);
    if (timingInteractions.length > 0) {
      recommendations.push('Stagger supplement timing to avoid absorption competition');
      timingInteractions.forEach(interaction => {
        recommendations.push(`Take ${interaction.supplement1} and ${interaction.supplement2} ${interaction.timeGap} apart`);
      });
    }

    // Dosage adjustments
    const dosageInteractions = interactions.filter(i => i.dosageAdjustment);
    dosageInteractions.forEach(interaction => {
      recommendations.push(`Consider dosage adjustment: ${interaction.dosageAdjustment}`);
    });

    // Monitoring requirements
    if (userProfile.medications.length > 0) {
      monitoringRequired.push('Regular monitoring recommended due to medication interactions');
    }

    const severeInteractions = interactions.filter(i => i.severity === InteractionSeverity.SEVERE);
    if (severeInteractions.length > 0) {
      monitoringRequired.push('Immediate medical consultation required');
      monitoringRequired.push('Regular blood work monitoring');
    }

    // General safety recommendations
    recommendations.push('Start with lower doses to assess tolerance');
    recommendations.push('Keep a supplement diary to track effects');
    recommendations.push('Regular review with healthcare provider');
  }

  /**
   * Public method to check single supplement against user profile
   */
  public checkSupplementSafety(
    supplementId: string, 
    supplement: EnhancedSupplement,
    userProfile: UserSupplementProfile
  ): InteractionAnalysis {
    const stack: SupplementStack = {
      supplements: [
        { id: supplementId, dosage: supplement.dosageInfo.standard.min + supplement.dosageInfo.standard.unit, timing: 'morning' },
        ...userProfile.currentSupplements.map(s => ({
          id: s.supplementId,
          dosage: s.dosage,
          timing: s.frequency
        }))
      ],
      duration: '30 days',
      purpose: ['safety_check']
    };

    return this.analyzeSupplementStack(stack, userProfile);
  }

  /**
   * Generates a comprehensive safety report
   */
  public generateSafetyReport(analysis: InteractionAnalysis): string {
    let report = `# Supplement Interaction Safety Report\n\n`;
    
    report += `**Overall Safety Score: ${analysis.safetyScore}/100**\n`;
    report += `**Risk Level: ${analysis.riskLevel.toUpperCase()}**\n\n`;

    if (analysis.interactions.length > 0) {
      report += `## Detected Interactions (${analysis.interactions.length})\n\n`;
      analysis.interactions.forEach((interaction, index) => {
        report += `### ${index + 1}. ${interaction.supplement1} + ${interaction.supplement2}\n`;
        report += `- **Severity:** ${interaction.severity}\n`;
        report += `- **Type:** ${interaction.type}\n`;
        report += `- **Description:** ${interaction.description}\n`;
        report += `- **Recommendation:** ${interaction.recommendation}\n`;
        if (interaction.timeGap) {
          report += `- **Timing:** ${interaction.timeGap}\n`;
        }
        report += `\n`;
      });
    }

    if (analysis.warnings.length > 0) {
      report += `## Safety Warnings (${analysis.warnings.length})\n\n`;
      analysis.warnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.title}\n`;
        report += `- **Severity:** ${warning.severity}\n`;
        report += `- **Description:** ${warning.description}\n`;
        report += `- **Action Required:** ${warning.action}\n\n`;
      });
    }

    if (analysis.recommendations.length > 0) {
      report += `## Recommendations\n\n`;
      analysis.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
      report += `\n`;
    }

    if (analysis.monitoringRequired.length > 0) {
      report += `## Monitoring Required\n\n`;
      analysis.monitoringRequired.forEach((mon, index) => {
        report += `${index + 1}. ${mon}\n`;
      });
    }

    return report;
  }
}

export const supplementInteractionChecker = SupplementInteractionChecker.getInstance();