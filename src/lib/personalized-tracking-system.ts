import {
  EnhancedSupplement,
  UserSupplementProfile,
  SupplementRecommendation,
  UserGoal,
  BodySystem,
  EvidenceLevel
} from '@/types/enhanced-supplement';
import { advancedDebugger, DebugCategory, supplementDebugger } from './advanced-debugging';
import { aiRecommendationEngine } from './ai-recommendation-engine';
import { supplementInteractionChecker } from './supplement-interaction-checker';

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  source: 'user_input' | 'wearable' | 'lab_test' | 'estimated';
  category: 'biomarker' | 'symptom' | 'performance' | 'subjective';
  normalRange?: { min: number; max: number };
  trend?: 'improving' | 'declining' | 'stable';
}

export interface SupplementLog {
  id: string;
  userId: string;
  supplementId: string;
  dosage: string;
  timestamp: Date;
  taken: boolean;
  effectiveness?: number; // 1-10 scale
  sideEffects?: string[];
  notes?: string;
  mood?: number; // 1-10 scale
  energy?: number; // 1-10 scale
  focus?: number; // 1-10 scale
}

export interface GoalProgress {
  goalId: UserGoal;
  startDate: Date;
  targetDate?: Date;
  currentScore: number; // 0-100
  milestones: Milestone[];
  metrics: string[]; // Associated health metric IDs
  supplements: string[]; // Associated supplement IDs
  progressHistory: { date: Date; score: number; notes?: string }[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue?: number;
  completed: boolean;
  completedDate?: Date;
  reward?: string;
}

export interface PersonalizedInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'warning' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  relatedSupplements?: string[];
  relatedMetrics?: string[];
  confidence: number; // 0-100
  generatedAt: Date;
}

export interface StackAnalytics {
  effectiveness: {
    overall: number;
    byGoal: { goal: UserGoal; score: number }[];
    byTimeOfDay: { time: string; effectiveness: number }[];
  };
  adherence: {
    overall: number;
    bySuplement: { supplementId: string; adherence: number }[];
    trends: { date: Date; adherence: number }[];
  };
  costAnalysis: {
    monthlyTotal: number;
    costPerGoal: number;
    mostExpensive: string[];
    bestValue: string[];
  };
  sideEffects: {
    frequency: number;
    common: { effect: string; frequency: number }[];
    bySupplement: { supplementId: string; effects: string[] }[];
  };
}

class PersonalizedTrackingSystem {
  private static instance: PersonalizedTrackingSystem;
  private userProfiles: Map<string, UserSupplementProfile> = new Map();
  private healthMetrics: Map<string, HealthMetric[]> = new Map();
  private supplementLogs: Map<string, SupplementLog[]> = new Map();
  private goalProgress: Map<string, GoalProgress[]> = new Map();
  private insights: Map<string, PersonalizedInsight[]> = new Map();

  static getInstance(): PersonalizedTrackingSystem {
    if (!PersonalizedTrackingSystem.instance) {
      PersonalizedTrackingSystem.instance = new PersonalizedTrackingSystem();
    }
    return PersonalizedTrackingSystem.instance;
  }

  /**
   * Creates or updates a user's supplement profile
   */
  public async createUserProfile(profile: UserSupplementProfile): Promise<void> {
    advancedDebugger.info(DebugCategory.USER_INTERACTION, 'Creating user profile', {
      userId: profile.userId,
      supplementCount: profile.currentSupplements.length,
      goals: profile.goals
    });

    this.userProfiles.set(profile.userId, profile);

    // Initialize tracking data structures
    if (!this.healthMetrics.has(profile.userId)) {
      this.healthMetrics.set(profile.userId, []);
    }
    if (!this.supplementLogs.has(profile.userId)) {
      this.supplementLogs.set(profile.userId, []);
    }
    if (!this.goalProgress.has(profile.userId)) {
      this.goalProgress.set(profile.userId, []);
    }

    // Initialize goal progress tracking
    await this.initializeGoalTracking(profile.userId, profile.goals);
  }

  /**
   * Logs supplement intake
   */
  public async logSupplementIntake(log: Omit<SupplementLog, 'id'>): Promise<string> {
    const logId = crypto.randomUUID();
    const fullLog: SupplementLog = { id: logId, ...log };

    const userLogs = this.supplementLogs.get(log.userId) || [];
    userLogs.push(fullLog);
    this.supplementLogs.set(log.userId, userLogs);

    supplementDebugger.logInteraction(log.supplementId, log.taken ? 'take' : 'skip', {
      dosage: log.dosage,
      effectiveness: log.effectiveness,
      sideEffects: log.sideEffects
    });

    // Update analytics and generate insights
    await this.updateAnalytics(log.userId);
    await this.generatePersonalizedInsights(log.userId);

    return logId;
  }

  /**
   * Records health metrics
   */
  public async recordHealthMetric(userId: string, metric: Omit<HealthMetric, 'id'>): Promise<string> {
    const metricId = crypto.randomUUID();
    const fullMetric: HealthMetric = { id: metricId, ...metric };

    const userMetrics = this.healthMetrics.get(userId) || [];
    userMetrics.push(fullMetric);
    this.healthMetrics.set(userId, userMetrics);

    advancedDebugger.info(DebugCategory.USER_INTERACTION, 'Health metric recorded', {
      userId,
      metricName: metric.name,
      value: metric.value,
      source: metric.source
    });

    // Update goal progress based on metric
    await this.updateGoalProgress(userId, fullMetric);

    return metricId;
  }

  /**
   * Gets comprehensive stack analytics for a user
   */
  public async getStackAnalytics(userId: string, timeRange?: { start: Date; end: Date }): Promise<StackAnalytics> {
    const logs = this.getFilteredLogs(userId, timeRange);
    const profile = this.userProfiles.get(userId);

    if (!profile || logs.length === 0) {
      return this.getEmptyAnalytics();
    }

    const effectiveness = await this.calculateEffectiveness(userId, logs);
    const adherence = this.calculateAdherence(userId, logs);
    const costAnalysis = this.calculateCostAnalysis(profile, logs);
    const sideEffects = this.analyzeSideEffects(logs);

    return {
      effectiveness,
      adherence,
      costAnalysis,
      sideEffects
    };
  }

  /**
   * Generates personalized insights based on user data
   */
  public async generatePersonalizedInsights(userId: string): Promise<PersonalizedInsight[]> {
    const logs = this.supplementLogs.get(userId) || [];
    const metrics = this.healthMetrics.get(userId) || [];
    const profile = this.userProfiles.get(userId);

    if (!profile) return [];

    const insights: PersonalizedInsight[] = [];

    // Pattern recognition insights
    insights.push(...this.detectPatterns(userId, logs, metrics));

    // Optimization recommendations
    insights.push(...await this.generateOptimizationRecommendations(userId, profile));

    // Safety warnings
    insights.push(...this.generateSafetyWarnings(userId, logs, profile));

    // Achievement recognition
    insights.push(...this.recognizeAchievements(userId));

    // Sort by priority and confidence
    const sortedInsights = insights.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const scoreA = priorityWeight[a.priority] * a.confidence;
      const scoreB = priorityWeight[b.priority] * b.confidence;
      return scoreB - scoreA;
    });

    // Cache insights
    this.insights.set(userId, sortedInsights);

    advancedDebugger.info(DebugCategory.AI, 'Generated personalized insights', {
      userId,
      insightCount: sortedInsights.length
    });

    return sortedInsights;
  }

  /**
   * Tracks progress toward user goals
   */
  public async updateGoalProgress(userId: string, metric?: HealthMetric): Promise<void> {
    const goals = this.goalProgress.get(userId) || [];
    const profile = this.userProfiles.get(userId);

    if (!profile) return;

    for (const goalProgress of goals) {
      const newScore = await this.calculateGoalScore(userId, goalProgress.goalId, metric);
      
      goalProgress.progressHistory.push({
        date: new Date(),
        score: newScore,
        notes: metric ? `Updated from ${metric.name} reading` : undefined
      });

      goalProgress.currentScore = newScore;

      // Check for milestone completion
      this.checkMilestones(goalProgress);
    }

    this.goalProgress.set(userId, goals);
  }

  /**
   * Gets recommendations for stack optimization
   */
  public async getStackOptimizationRecommendations(
    userId: string,
    criteria?: {
      focusOnEffectiveness?: boolean;
      budgetConstraints?: boolean;
      minimizeSideEffects?: boolean;
    }
  ): Promise<SupplementRecommendation[]> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const analytics = await this.getStackAnalytics(userId);
    const recommendations: SupplementRecommendation[] = [];

    // Identify underperforming supplements
    const lowEffectivenessSupplements = profile.currentSupplements.filter(supp => 
      (supp.effectiveness || 0) < 5
    );

    for (const supplement of lowEffectivenessSupplements) {
      // This would suggest alternatives or dosage adjustments
      // For now, create a basic recommendation structure
    }

    return recommendations;
  }

  /**
   * Exports user data for analysis or backup
   */
  public exportUserData(userId: string): {
    profile: UserSupplementProfile | null;
    logs: SupplementLog[];
    metrics: HealthMetric[];
    goals: GoalProgress[];
    insights: PersonalizedInsight[];
  } {
    return {
      profile: this.userProfiles.get(userId) || null,
      logs: this.supplementLogs.get(userId) || [],
      metrics: this.healthMetrics.get(userId) || [],
      goals: this.goalProgress.get(userId) || [],
      insights: this.insights.get(userId) || []
    };
  }

  // Private helper methods

  private async initializeGoalTracking(userId: string, goals: UserGoal[]): Promise<void> {
    const goalProgressList: GoalProgress[] = goals.map(goal => ({
      goalId: goal,
      startDate: new Date(),
      currentScore: 0,
      milestones: this.createMilestonesForGoal(goal),
      metrics: this.getRelevantMetricsForGoal(goal),
      supplements: [],
      progressHistory: []
    }));

    this.goalProgress.set(userId, goalProgressList);
  }

  private createMilestonesForGoal(goal: UserGoal): Milestone[] {
    const baseMilestones: Milestone[] = [
      {
        id: crypto.randomUUID(),
        title: 'First Week Completed',
        description: 'Successfully tracked supplements for one week',
        completed: false,
        reward: 'Consistency Badge'
      },
      {
        id: crypto.randomUUID(),
        title: 'Noticeable Improvement',
        description: 'Reported improvement in goal-related metrics',
        completed: false,
        reward: 'Progress Badge'
      },
      {
        id: crypto.randomUUID(),
        title: 'Goal Achievement',
        description: 'Reached target improvement level',
        targetValue: 80,
        completed: false,
        reward: 'Achievement Badge'
      }
    ];

    return baseMilestones;
  }

  private getRelevantMetricsForGoal(goal: UserGoal): string[] {
    const goalMetricMap: Record<UserGoal, string[]> = {
      [UserGoal.COGNITIVE_ENHANCEMENT]: ['focus', 'memory', 'processing_speed'],
      [UserGoal.STRESS_REDUCTION]: ['cortisol', 'stress_level', 'sleep_quality'],
      [UserGoal.SLEEP_IMPROVEMENT]: ['sleep_duration', 'sleep_quality', 'sleep_latency'],
      [UserGoal.ENERGY_BOOST]: ['energy_level', 'fatigue_score', 'physical_performance'],
      [UserGoal.MOOD_ENHANCEMENT]: ['mood_score', 'anxiety_level', 'depression_score'],
      [UserGoal.ATHLETIC_PERFORMANCE]: ['strength', 'endurance', 'recovery_time'],
      [UserGoal.RECOVERY]: ['inflammation_markers', 'muscle_soreness', 'recovery_score'],
      [UserGoal.LONGEVITY]: ['biological_age', 'oxidative_stress', 'cellular_health'],
      [UserGoal.IMMUNE_SUPPORT]: ['illness_frequency', 'immune_markers', 'inflammation'],
      [UserGoal.GENERAL_HEALTH]: ['overall_wellbeing', 'vitality_score', 'health_markers']
    };

    return goalMetricMap[goal] || [];
  }

  private getFilteredLogs(userId: string, timeRange?: { start: Date; end: Date }): SupplementLog[] {
    const logs = this.supplementLogs.get(userId) || [];
    
    if (!timeRange) return logs;

    return logs.filter(log => 
      log.timestamp >= timeRange.start && log.timestamp <= timeRange.end
    );
  }

  private async calculateEffectiveness(userId: string, logs: SupplementLog[]): Promise<StackAnalytics['effectiveness']> {
    const effectivenessLogs = logs.filter(log => log.effectiveness !== undefined);
    
    if (effectivenessLogs.length === 0) {
      return {
        overall: 0,
        byGoal: [],
        byTimeOfDay: []
      };
    }

    const overall = effectivenessLogs.reduce((sum, log) => sum + (log.effectiveness || 0), 0) / effectivenessLogs.length;

    // Group by time of day
    const timeGroups = effectivenessLogs.reduce((groups, log) => {
      const hour = log.timestamp.getHours();
      const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      
      if (!groups[timeSlot]) groups[timeSlot] = [];
      groups[timeSlot].push(log.effectiveness || 0);
      return groups;
    }, {} as Record<string, number[]>);

    const byTimeOfDay = Object.entries(timeGroups).map(([time, scores]) => ({
      time,
      effectiveness: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    return {
      overall,
      byGoal: [], // Would calculate based on goal-supplement mapping
      byTimeOfDay
    };
  }

  private calculateAdherence(userId: string, logs: SupplementLog[]): StackAnalytics['adherence'] {
    const totalLogs = logs.length;
    const takenLogs = logs.filter(log => log.taken).length;
    
    const overall = totalLogs > 0 ? (takenLogs / totalLogs) * 100 : 0;

    // Group by supplement
    const supplementGroups = logs.reduce((groups, log) => {
      if (!groups[log.supplementId]) groups[log.supplementId] = { taken: 0, total: 0 };
      groups[log.supplementId].total++;
      if (log.taken) groups[log.supplementId].taken++;
      return groups;
    }, {} as Record<string, { taken: number; total: number }>);

    const bySuplement = Object.entries(supplementGroups).map(([supplementId, stats]) => ({
      supplementId,
      adherence: (stats.taken / stats.total) * 100
    }));

    return {
      overall,
      bySuplement,
      trends: [] // Would calculate daily adherence trends
    };
  }

  private calculateCostAnalysis(profile: UserSupplementProfile, logs: SupplementLog[]): StackAnalytics['costAnalysis'] {
    // This would calculate based on actual supplement costs
    // For now, return mock data
    return {
      monthlyTotal: 150,
      costPerGoal: 50,
      mostExpensive: ['supplement-a', 'supplement-b'],
      bestValue: ['supplement-c', 'supplement-d']
    };
  }

  private analyzeSideEffects(logs: SupplementLog[]): StackAnalytics['sideEffects'] {
    const sideEffectLogs = logs.filter(log => log.sideEffects && log.sideEffects.length > 0);
    const frequency = (sideEffectLogs.length / logs.length) * 100;

    const effectCounts = sideEffectLogs.reduce((counts, log) => {
      log.sideEffects?.forEach(effect => {
        counts[effect] = (counts[effect] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);

    const common = Object.entries(effectCounts)
      .map(([effect, count]) => ({ effect, frequency: (count / sideEffectLogs.length) * 100 }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      frequency,
      common,
      bySupplement: [] // Would group by supplement
    };
  }

  private detectPatterns(userId: string, logs: SupplementLog[], metrics: HealthMetric[]): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];

    // Example pattern: Better effectiveness in the morning
    const morningLogs = logs.filter(log => log.timestamp.getHours() < 12);
    const eveningLogs = logs.filter(log => log.timestamp.getHours() >= 18);

    if (morningLogs.length > 5 && eveningLogs.length > 5) {
      const morningEffectiveness = morningLogs.reduce((sum, log) => sum + (log.effectiveness || 0), 0) / morningLogs.length;
      const eveningEffectiveness = eveningLogs.reduce((sum, log) => sum + (log.effectiveness || 0), 0) / eveningLogs.length;

      if (morningEffectiveness > eveningEffectiveness + 1) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'pattern',
          priority: 'medium',
          title: 'Morning Effectiveness Pattern',
          description: `Your supplements appear to be more effective when taken in the morning (${morningEffectiveness.toFixed(1)}/10) compared to evening (${eveningEffectiveness.toFixed(1)}/10).`,
          actionItems: ['Consider taking more supplements in the morning', 'Review evening supplement timing'],
          confidence: 75,
          generatedAt: new Date()
        });
      }
    }

    return insights;
  }

  private async generateOptimizationRecommendations(userId: string, profile: UserSupplementProfile): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];

    // Example: Suggest optimization based on low effectiveness supplements
    const lowEffectivenessSupplements = profile.currentSupplements.filter(supp => 
      (supp.effectiveness || 0) < 4
    );

    if (lowEffectivenessSupplements.length > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'recommendation',
        priority: 'high',
        title: 'Stack Optimization Opportunity',
        description: `${lowEffectivenessSupplements.length} supplements in your stack have low effectiveness ratings. Consider reviewing these for potential alternatives.`,
        actionItems: [
          'Review dosage timing and food intake',
          'Consider alternative formulations',
          'Consult with healthcare provider about alternatives'
        ],
        relatedSupplements: lowEffectivenessSupplements.map(s => s.supplementId),
        confidence: 85,
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private generateSafetyWarnings(userId: string, logs: SupplementLog[], profile: UserSupplementProfile): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];

    // Example: Frequent side effects warning
    const recentLogs = logs.filter(log => 
      Date.now() - log.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );

    const sideEffectLogs = recentLogs.filter(log => log.sideEffects && log.sideEffects.length > 0);
    
    if (sideEffectLogs.length > recentLogs.length * 0.2) { // More than 20% have side effects
      insights.push({
        id: crypto.randomUUID(),
        type: 'warning',
        priority: 'high',
        title: 'Frequent Side Effects Detected',
        description: 'You\'ve reported side effects in more than 20% of your recent supplement logs. This warrants attention.',
        actionItems: [
          'Review supplement dosages',
          'Consider supplement interactions',
          'Consult with healthcare provider'
        ],
        confidence: 90,
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private recognizeAchievements(userId: string): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];

    // Example: Consistency achievement
    const logs = this.supplementLogs.get(userId) || [];
    const last7Days = logs.filter(log => 
      Date.now() - log.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );

    const adherence = last7Days.filter(log => log.taken).length / Math.max(1, last7Days.length);

    if (adherence >= 0.9) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'achievement',
        priority: 'medium',
        title: 'Excellent Adherence!',
        description: `You've maintained ${Math.round(adherence * 100)}% adherence over the past week. Keep up the great work!`,
        actionItems: ['Continue your current routine', 'Consider setting a new consistency goal'],
        confidence: 100,
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private async calculateGoalScore(userId: string, goal: UserGoal, newMetric?: HealthMetric): Promise<number> {
    const metrics = this.healthMetrics.get(userId) || [];
    const relevantMetrics = this.getRelevantMetricsForGoal(goal);
    
    // Filter metrics relevant to this goal
    const goalMetrics = metrics.filter(metric => 
      relevantMetrics.some(relevant => metric.name.toLowerCase().includes(relevant.toLowerCase()))
    );

    if (goalMetrics.length === 0) return 0;

    // Calculate average improvement
    const scores = goalMetrics.map(metric => {
      if (metric.normalRange) {
        const range = metric.normalRange.max - metric.normalRange.min;
        const normalizedValue = (metric.value - metric.normalRange.min) / range;
        return Math.max(0, Math.min(100, normalizedValue * 100));
      }
      return 50; // Default neutral score if no range
    });

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private checkMilestones(goalProgress: GoalProgress): void {
    goalProgress.milestones.forEach(milestone => {
      if (!milestone.completed) {
        if (milestone.targetValue && goalProgress.currentScore >= milestone.targetValue) {
          milestone.completed = true;
          milestone.completedDate = new Date();
        }
      }
    });
  }

  private getEmptyAnalytics(): StackAnalytics {
    return {
      effectiveness: { overall: 0, byGoal: [], byTimeOfDay: [] },
      adherence: { overall: 0, bySuplement: [], trends: [] },
      costAnalysis: { monthlyTotal: 0, costPerGoal: 0, mostExpensive: [], bestValue: [] },
      sideEffects: { frequency: 0, common: [], bySupplement: [] }
    };
  }
}

export const personalizedTrackingSystem = PersonalizedTrackingSystem.getInstance();