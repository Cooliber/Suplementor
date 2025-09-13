import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { advancedDebugger, DebugCategory } from './advanced-debugging';

// Advanced monitoring schemas
const SupplementEffectSchema = z.object({
  supplementName: z.string(),
  reportedEffects: z.array(z.object({
    type: z.enum(['positive', 'negative', 'neutral', 'unexpected']),
    description: z.string(),
    severity: z.number().min(1).max(10),
    timeToOnset: z.string(),
    duration: z.string(),
    confidence: z.number().min(0).max(100)
  })),
  biomarkerChanges: z.array(z.object({
    parameter: z.string(),
    baseline: z.number(),
    current: z.number(),
    unit: z.string(),
    trend: z.enum(['improving', 'stable', 'declining', 'concerning']),
    significance: z.enum(['not_significant', 'noteworthy', 'significant', 'highly_significant'])
  })),
  adherenceScore: z.number().min(0).max(100),
  overallAssessment: z.object({
    effectivenessRating: z.number().min(0).max(100),
    safetyRating: z.number().min(0).max(100),
    continueRecommendation: z.enum(['continue', 'adjust_dose', 'discontinue', 'consult_physician']),
    reasoning: z.string()
  })
});

const StackMonitoringSchema = z.object({
  overallStackAssessment: z.object({
    effectivenessScore: z.number().min(0).max(100),
    safetyScore: z.number().min(0).max(100),
    synergisticEffects: z.array(z.object({
      supplements: z.array(z.string()),
      effect: z.string(),
      strength: z.enum(['weak', 'moderate', 'strong', 'very_strong'])
    })),
    antagonisticEffects: z.array(z.object({
      supplements: z.array(z.string()),
      effect: z.string(),
      impact: z.enum(['minimal', 'moderate', 'significant', 'severe'])
    }))
  }),
  
  individualSupplementAnalysis: z.array(SupplementEffectSchema),
  
  alerts: z.array(z.object({
    level: z.enum(['info', 'warning', 'critical', 'emergency']),
    type: z.enum(['interaction', 'side_effect', 'biomarker_change', 'adherence', 'dosage']),
    message: z.string(),
    supplements: z.array(z.string()),
    recommendedAction: z.string(),
    urgency: z.enum(['routine', 'within_week', 'within_day', 'immediate'])
  })),
  
  trends: z.object({
    improvingParameters: z.array(z.string()),
    decliningParameters: z.array(z.string()),
    stableParameters: z.array(z.string()),
    emergingConcerns: z.array(z.string())
  }),
  
  recommendations: z.object({
    immediate: z.array(z.string()),
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string()),
    monitoring: z.array(z.object({
      parameter: z.string(),
      frequency: z.string(),
      method: z.string(),
      targetRange: z.string()
    }))
  }),
  
  nextReviewDate: z.string(),
  specialInstructions: z.array(z.string())
});

const PredictiveAnalysisSchema = z.object({
  riskPredictions: z.array(z.object({
    riskType: z.enum(['interaction', 'adverse_effect', 'tolerance', 'deficiency', 'toxicity']),
    supplement: z.string(),
    probability: z.number().min(0).max(100),
    timeframe: z.string(),
    severity: z.enum(['mild', 'moderate', 'severe', 'life_threatening']),
    earlyWarningSignals: z.array(z.string()),
    preventionStrategies: z.array(z.string())
  })),
  
  efficacyPredictions: z.array(z.object({
    supplement: z.string(),
    goal: z.string(),
    predictedOutcome: z.enum(['excellent', 'good', 'moderate', 'poor', 'unlikely']),
    timeToEffect: z.string(),
    confidenceLevel: z.number().min(0).max(100),
    factors: z.array(z.string())
  })),
  
  optimizationOpportunities: z.array(z.object({
    type: z.enum(['timing', 'dosage', 'combination', 'replacement', 'addition']),
    currentSupplement: z.string(),
    recommendation: z.string(),
    expectedImprovement: z.string(),
    implementationComplexity: z.enum(['simple', 'moderate', 'complex']),
    costImpact: z.enum(['decrease', 'neutral', 'increase']),
    evidence: z.string()
  }))
});

interface SupplementLog {
  id: string;
  supplementId: string;
  supplementName: string;
  dosage: string;
  timestamp: Date;
  adherence: boolean;
  sideEffects?: string[];
  effectivenessRating?: number; // 1-10
  notes?: string;
}

interface BiomarkerReading {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  timestamp: Date;
  method: string; // blood test, wearable, self-report, etc.
  referenceRange: { min: number; max: number };
}

interface UserSymptomReport {
  id: string;
  symptoms: string[];
  severity: number; // 1-10
  timestamp: Date;
  context?: string;
  duration?: string;
  triggerSuspects?: string[];
}

interface MonitoringData {
  userId: string;
  supplementLogs: SupplementLog[];
  biomarkerReadings: BiomarkerReading[];
  symptomReports: UserSymptomReport[];
  userProfile: {
    age: number;
    gender: string;
    weight?: number;
    healthConditions: string[];
    medications: string[];
    goals: string[];
  };
  timeRange: {
    start: Date;
    end: Date;
  };
}

export class AIMonitoringSystem {
  private static instance: AIMonitoringSystem;
  private model = google('gemini-1.5-flash');
  private monitoringCache: Map<string, { data: any; timestamp: Date; expiresAt: Date }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
  
  // Real-time alerting system
  private alertSubscribers: Map<string, (alert: any) => void> = new Map();

  static getInstance(): AIMonitoringSystem {
    if (!AIMonitoringSystem.instance) {
      AIMonitoringSystem.instance = new AIMonitoringSystem();
    }
    return AIMonitoringSystem.instance;
  }

  private constructor() {
    advancedDebugger.info(DebugCategory.AI, 'AI Monitoring System initialized');
    this.startPeriodicMonitoring();
  }

  /**
   * Comprehensive supplement stack monitoring and analysis
   */
  public async monitorSupplementStack(data: MonitoringData): Promise<z.infer<typeof StackMonitoringSchema>> {
    advancedDebugger.info(DebugCategory.AI, 'Starting supplement stack monitoring', {
      userId: data.userId,
      supplementLogs: data.supplementLogs.length,
      biomarkerReadings: data.biomarkerReadings.length,
      symptomReports: data.symptomReports.length
    });

    const prompt = this.buildStackMonitoringPrompt(data);

    try {
      const result = await generateObject({
        model: this.model,
        schema: StackMonitoringSchema,
        prompt,
        temperature: 0.1 // Very low for accurate monitoring
      });

      const analysis = result.object;
      
      // Process alerts for real-time notifications
      this.processAlerts(data.userId, analysis.alerts);

      advancedDebugger.info(DebugCategory.AI, 'Stack monitoring completed', {
        userId: data.userId,
        effectivenessScore: analysis.overallStackAssessment.effectivenessScore,
        safetyScore: analysis.overallStackAssessment.safetyScore,
        alertCount: analysis.alerts.length
      });

      return analysis;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Stack monitoring failed', error);
      throw new Error(`Stack monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Predictive analysis for future supplement effects and risks
   */
  public async generatePredictiveAnalysis(
    data: MonitoringData,
    predictionTimeframe: '1_week' | '1_month' | '3_months' | '6_months' = '1_month'
  ): Promise<z.infer<typeof PredictiveAnalysisSchema>> {
    advancedDebugger.info(DebugCategory.AI, 'Starting predictive analysis', {
      userId: data.userId,
      timeframe: predictionTimeframe
    });

    const prompt = this.buildPredictiveAnalysisPrompt(data, predictionTimeframe);

    try {
      const result = await generateObject({
        model: this.model,
        schema: PredictiveAnalysisSchema,
        prompt,
        temperature: 0.2
      });

      advancedDebugger.info(DebugCategory.AI, 'Predictive analysis completed', {
        userId: data.userId,
        riskPredictions: result.object.riskPredictions.length,
        efficacyPredictions: result.object.efficacyPredictions.length,
        optimizationOpportunities: result.object.optimizationOpportunities.length
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Predictive analysis failed', error);
      throw new Error(`Predictive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Real-time symptom analysis and supplement correlation
   */
  public async analyzeSymptomCorrelation(
    symptoms: UserSymptomReport[],
    supplementLogs: SupplementLog[],
    timeWindow: number = 24 // hours
  ): Promise<{
    correlations: Array<{
      supplement: string;
      symptom: string;
      correlationStrength: number; // 0-1
      timePattern: string;
      confidence: number;
      recommendation: string;
    }>;
    overallAssessment: string;
    immediateActions: string[];
    followUpRecommendations: string[];
  }> {
    advancedDebugger.info(DebugCategory.AI, 'Analyzing symptom correlations', {
      symptoms: symptoms.length,
      supplements: supplementLogs.length,
      timeWindow
    });

    const correlationPrompt = `
    You are a clinical AI system analyzing potential correlations between supplement intake and reported symptoms. 

    SYMPTOM REPORTS (last ${timeWindow} hours):
    ${symptoms.map(s => `
    - Symptoms: ${s.symptoms.join(', ')}
    - Severity: ${s.severity}/10
    - Time: ${s.timestamp.toISOString()}
    - Duration: ${s.duration || 'Not specified'}
    - Notes: ${s.context || 'None'}
    `).join('')}

    SUPPLEMENT INTAKE:
    ${supplementLogs.map(log => `
    - ${log.supplementName}: ${log.dosage} at ${log.timestamp.toISOString()}
    - Adherence: ${log.adherence ? 'Yes' : 'No'}
    - Side effects reported: ${log.sideEffects?.join(', ') || 'None'}
    `).join('')}

    ANALYSIS REQUIREMENTS:
    1. Identify temporal correlations between supplement intake and symptoms
    2. Calculate correlation strength (0-1) based on timing, dose, and pattern
    3. Assess biological plausibility of each correlation
    4. Provide confidence levels for each assessment
    5. Recommend immediate actions if serious correlations found
    6. Suggest follow-up monitoring strategies

    Consider: onset times, dose-response relationships, known side effect profiles, and individual sensitivity patterns.
    `;

    try {
      const correlationSchema = z.object({
        correlations: z.array(z.object({
          supplement: z.string(),
          symptom: z.string(),
          correlationStrength: z.number().min(0).max(1),
          timePattern: z.string(),
          confidence: z.number().min(0).max(100),
          recommendation: z.string()
        })),
        overallAssessment: z.string(),
        immediateActions: z.array(z.string()),
        followUpRecommendations: z.array(z.string())
      });

      const result = await generateObject({
        model: this.model,
        schema: correlationSchema,
        prompt: correlationPrompt,
        temperature: 0.1
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Symptom correlation analysis failed', error);
      throw new Error(`Symptom analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Biomarker trend analysis with AI insights
   */
  public async analyzeBiomarkerTrends(
    biomarkers: BiomarkerReading[],
    supplementLogs: SupplementLog[],
    targetGoals: string[]
  ): Promise<{
    trends: Array<{
      parameter: string;
      trend: 'improving' | 'stable' | 'declining' | 'volatile';
      trendStrength: number;
      projectedValue: number;
      timeToTarget?: string;
      supplementContributions: Array<{
        supplement: string;
        contribution: 'positive' | 'negative' | 'neutral';
        confidence: number;
      }>;
    }>;
    goalProgress: Array<{
      goal: string;
      progress: number; // 0-100%
      keyBiomarkers: string[];
      recommendation: string;
    }>;
    alerts: Array<{
      parameter: string;
      alertType: 'out_of_range' | 'rapid_change' | 'concerning_trend';
      severity: 'info' | 'warning' | 'critical';
      message: string;
    }>;
  }> {
    advancedDebugger.info(DebugCategory.AI, 'Analyzing biomarker trends', {
      biomarkers: biomarkers.length,
      supplements: supplementLogs.length,
      goals: targetGoals.length
    });

    const trendPrompt = `
    You are a clinical data analyst specializing in biomarker interpretation and supplement effects. Analyze the following data:

    BIOMARKER DATA:
    ${this.formatBiomarkerData(biomarkers)}

    SUPPLEMENT INTAKE:
    ${supplementLogs.map(log => `
    - ${log.supplementName}: ${log.dosage} (taken ${log.adherence ? 'as prescribed' : 'missed'})
    `).join('')}

    USER GOALS:
    ${targetGoals.join(', ')}

    ANALYSIS REQUIREMENTS:
    1. Identify trends in each biomarker over time
    2. Correlate biomarker changes with supplement intake
    3. Assess progress toward user goals
    4. Generate alerts for concerning patterns
    5. Predict future biomarker values based on current trends
    6. Recommend optimizations for goal achievement

    Consider: normal fluctuations, supplement mechanisms of action, goal-biomarker relationships, and clinical significance.
    `;

    try {
      const trendSchema = z.object({
        trends: z.array(z.object({
          parameter: z.string(),
          trend: z.enum(['improving', 'stable', 'declining', 'volatile']),
          trendStrength: z.number().min(0).max(1),
          projectedValue: z.number(),
          timeToTarget: z.string().optional(),
          supplementContributions: z.array(z.object({
            supplement: z.string(),
            contribution: z.enum(['positive', 'negative', 'neutral']),
            confidence: z.number().min(0).max(100)
          }))
        })),
        goalProgress: z.array(z.object({
          goal: z.string(),
          progress: z.number().min(0).max(100),
          keyBiomarkers: z.array(z.string()),
          recommendation: z.string()
        })),
        alerts: z.array(z.object({
          parameter: z.string(),
          alertType: z.enum(['out_of_range', 'rapid_change', 'concerning_trend']),
          severity: z.enum(['info', 'warning', 'critical']),
          message: z.string()
        }))
      });

      const result = await generateObject({
        model: this.model,
        schema: trendSchema,
        prompt: trendPrompt,
        temperature: 0.1
      });

      return result.object;
    } catch (error) {
      advancedDebugger.error(DebugCategory.AI, 'Biomarker trend analysis failed', error);
      throw new Error(`Biomarker analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Subscribe to real-time alerts
   */
  public subscribeToAlerts(userId: string, callback: (alert: any) => void): () => void {
    this.alertSubscribers.set(userId, callback);
    return () => this.alertSubscribers.delete(userId);
  }

  /**
   * Generate personalized monitoring dashboard
   */
  public async generateMonitoringDashboard(data: MonitoringData): Promise<{
    summary: {
      overallHealth: number; // 0-100
      adherenceRate: number;
      effectivenessScore: number;
      safetyScore: number;
      trendDirection: 'improving' | 'stable' | 'declining';
    };
    keyMetrics: Array<{
      name: string;
      value: string;
      trend: 'up' | 'down' | 'stable';
      status: 'good' | 'concerning' | 'critical';
    }>;
    recentAlerts: Array<{
      message: string;
      severity: 'info' | 'warning' | 'critical';
      timestamp: Date;
    }>;
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      action: string;
      reasoning: string;
    }>;
    upcomingTasks: Array<{
      task: string;
      dueDate: Date;
      type: 'biomarker_test' | 'supplement_review' | 'symptom_check';
    }>;
  }> {
    // Implementation would create a comprehensive dashboard view
    // This is a placeholder for the full implementation
    return {
      summary: {
        overallHealth: 85,
        adherenceRate: 92,
        effectivenessScore: 78,
        safetyScore: 95,
        trendDirection: 'improving'
      },
      keyMetrics: [],
      recentAlerts: [],
      recommendations: [],
      upcomingTasks: []
    };
  }

  // Private helper methods
  private processAlerts(userId: string, alerts: any[]): void {
    const subscriber = this.alertSubscribers.get(userId);
    if (subscriber) {
      alerts.forEach(alert => {
        if (alert.level === 'critical' || alert.level === 'emergency') {
          subscriber(alert);
        }
      });
    }
  }

  private startPeriodicMonitoring(): void {
    // Start background monitoring for critical alerts
    setInterval(() => {
      this.checkForCriticalAlerts();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async checkForCriticalAlerts(): Promise<void> {
    // Implementation for periodic health checks
    advancedDebugger.info(DebugCategory.AI, 'Performing periodic alert check');
  }

  private formatBiomarkerData(biomarkers: BiomarkerReading[]): string {
    return biomarkers.map(b => 
      `${b.parameter}: ${b.value} ${b.unit} (${b.timestamp.toISOString()}) [Range: ${b.referenceRange.min}-${b.referenceRange.max}]`
    ).join('\n');
  }

  private buildStackMonitoringPrompt(data: MonitoringData): string {
    return `
    You are a clinical AI system monitoring supplement effectiveness and safety. Analyze this comprehensive dataset:

    USER PROFILE:
    - Age: ${data.userProfile.age}
    - Gender: ${data.userProfile.gender}
    - Weight: ${data.userProfile.weight || 'Not specified'}
    - Health conditions: ${data.userProfile.healthConditions.join(', ') || 'None'}
    - Current medications: ${data.userProfile.medications.join(', ') || 'None'}
    - Goals: ${data.userProfile.goals.join(', ')}

    SUPPLEMENT LOGS (${data.supplementLogs.length} entries):
    ${data.supplementLogs.map(log => `
    - ${log.supplementName}: ${log.dosage} at ${log.timestamp.toISOString()}
      Adherence: ${log.adherence ? 'Yes' : 'No'}
      Effectiveness rating: ${log.effectivenessRating || 'Not rated'}
      Side effects: ${log.sideEffects?.join(', ') || 'None reported'}
      Notes: ${log.notes || 'None'}
    `).join('')}

    BIOMARKER READINGS (${data.biomarkerReadings.length} readings):
    ${this.formatBiomarkerData(data.biomarkerReadings)}

    SYMPTOM REPORTS (${data.symptomReports.length} reports):
    ${data.symptomReports.map(s => `
    - Symptoms: ${s.symptoms.join(', ')}
    - Severity: ${s.severity}/10 at ${s.timestamp.toISOString()}
    - Duration: ${s.duration || 'Not specified'}
    - Context: ${s.context || 'None'}
    `).join('')}

    MONITORING PERIOD: ${data.timeRange.start.toISOString()} to ${data.timeRange.end.toISOString()}

    COMPREHENSIVE ANALYSIS REQUIRED:
    1. Assess overall stack effectiveness and safety
    2. Identify individual supplement performance
    3. Detect synergistic and antagonistic effects
    4. Generate appropriate alerts for concerning patterns
    5. Analyze trends in biomarkers and symptoms
    6. Provide specific recommendations for optimization
    7. Set next review date based on risk level

    Prioritize safety and evidence-based recommendations.
    `;
  }

  private buildPredictiveAnalysisPrompt(data: MonitoringData, timeframe: string): string {
    return `
    You are a predictive clinical AI system. Based on current data patterns, predict future supplement outcomes:

    CURRENT DATA SUMMARY:
    ${this.buildStackMonitoringPrompt(data)}

    PREDICTION TIMEFRAME: ${timeframe}

    PREDICTIVE ANALYSIS REQUIREMENTS:
    1. Identify risk factors for adverse effects or interactions
    2. Predict efficacy outcomes for each supplement
    3. Suggest optimization opportunities
    4. Consider individual response patterns
    5. Account for seasonal variations and lifestyle changes
    6. Provide confidence intervals for predictions

    Base predictions on:
    - Current biomarker trends
    - Adherence patterns
    - Reported effects and side effects
    - Known supplement mechanisms
    - Individual response patterns
    - Literature-based expectations

    Provide actionable insights for proactive health management.
    `;
  }
}

export const aiMonitoringSystem = AIMonitoringSystem.getInstance();