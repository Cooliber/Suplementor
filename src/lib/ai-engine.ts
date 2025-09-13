import { 
  Supplement, 
  SupplementLog, 
  AIRecommendation, 
  PerformanceMetrics,
  EffectivenessScore,
  ComplianceData
} from '@/types/supplement';

export interface AIAnalysisContext {
  supplements: Supplement[];
  logs: SupplementLog[];
  performanceMetrics: PerformanceMetrics[];
  timeRange: {
    start: Date;
    end: Date;
  };
  userPreferences: {
    goals: string[];
    sensitivities: string[];
    preferredTimes: string[];
  };
}

export interface RecommendationFactors {
  effectiveness: number;
  compliance: number;
  synergy: number;
  timing: number;
  dosage: number;
  sideEffects: number;
  userGoals: number;
}

export class AIRecommendationEngine {
  private readonly MIN_DATA_POINTS = 5;
  private readonly EFFECTIVENESS_THRESHOLD = 0.7;
  private readonly COMPLIANCE_THRESHOLD = 0.8;
  private readonly SYNERGY_WEIGHT = 0.15;
  private readonly COMPLIANCE_WEIGHT = 0.25;
  private readonly EFFECTIVENESS_WEIGHT = 0.35;
  private readonly USER_GOALS_WEIGHT = 0.25;
  private readonly CORRELATION_WEIGHT = 0.5;
  private readonly TREND_WEIGHT = 0.3;
  private readonly CONSISTENCY_WEIGHT = 0.2;

  /**
   * Generate comprehensive AI recommendations based on all available data
   */
  public generateRecommendations(context: AIAnalysisContext): AIRecommendation[] {
    const effectivenessScores = this.analyzeSupplementEffectiveness(context);
    const complianceData = this.analyzeCompliancePatterns(context);
    const synergies = this.analyzeSynergies(context);
    const timingAnalysis = this.analyzeTimingOptimization(context);
    const dosageAnalysis = this.analyzeDosageOptimization(context);

    const effectivenessRecommendations = this.createEffectivenessRecommendations(effectivenessScores, complianceData);
    const complianceRecommendations = this.createComplianceRecommendations(complianceData);
    const synergyRecommendations = this.createSynergyRecommendations(synergies);
    const timingRecommendations = this.createTimingRecommendations(timingAnalysis);
    const dosageRecommendations = this.createDosageRecommendations(dosageAnalysis);

    // Add confidence to recommendations
    effectivenessRecommendations.forEach(rec => rec.confidence = Math.round(rec.factors.effectiveness * 100));
    complianceRecommendations.forEach(rec => rec.confidence = Math.round(rec.factors.compliance * 100));
    synergyRecommendations.forEach(rec => rec.confidence = 85);
    timingRecommendations.forEach(rec => rec.confidence = 75);
    dosageRecommendations.forEach(rec => rec.confidence = 75);

    const allRecommendations = [
      ...effectivenessRecommendations,
      ...complianceRecommendations,
      ...synergyRecommendations,
      ...timingRecommendations,
      ...dosageRecommendations,
    ];

    return this.prioritizeRecommendations(allRecommendations);
  }

  /**
   * Analyze supplement effectiveness based on performance correlation
   */
  private analyzeSupplementEffectiveness(context: AIAnalysisContext): EffectivenessScore[] {
    const { supplements, logs, performanceMetrics } = context;
    const scores: EffectivenessScore[] = [];

    for (const supplement of supplements) {
      const supplementLogs = logs.filter(log => log.supplementId === supplement.id);
      if (supplementLogs.length < this.MIN_DATA_POINTS) continue;

      const alignedData = this.alignDataByTime(supplementLogs, performanceMetrics);
      if (alignedData.length < this.MIN_DATA_POINTS) continue;

      const { correlation, pValue } = this.calculatePerformanceCorrelation(alignedData);
      const consistency = this.calculateConsistencyScore(alignedData.map(d => d.taken));
      const trend = this.calculateTrendScore(alignedData.map(d => d.performanceScore));

      const effectivenessScore =
        correlation * this.CORRELATION_WEIGHT +
        trend * this.TREND_WEIGHT +
        consistency * this.CONSISTENCY_WEIGHT;

      const confidence = this.calculateConfidence(pValue, alignedData.length);

      scores.push({
        supplementId: supplement.id,
        supplementName: supplement.name,
        effectivenessScore: Math.max(0, Math.min(1, effectivenessScore)),
        confidence,
        correlation,
        trend,
        consistency,
        sampleSize: alignedData.length,
        reasoning: this.generateEffectivenessReasoning(correlation, trend, consistency),
      });
    }

    return scores;
  }

  /**
   * Calculate correlation between supplement intake and performance metrics
   */
  private calculatePerformanceCorrelation(
    alignedData: { taken: boolean; performanceScore: number }[]
  ): { correlation: number; pValue: number } {
    const intake = alignedData.map(d => (d.taken ? 1 : 0));
    const performance = alignedData.map(d => d.performanceScore);

    if (intake.length < 2 || performance.length < 2) {
      return { correlation: 0, pValue: 1 };
    }

    const { pearson, pValue } = this.calculatePearsonCorrelation(intake, performance);
    return { correlation: isNaN(pearson) ? 0 : pearson, pValue };
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private calculatePearsonCorrelation(
    x: number[],
    y: number[]
  ): { pearson: number; pValue: number } {
    const n = x.length;
    if (n < 2 || n !== y.length) return { pearson: 0, pValue: 1 };

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * (y[i] ?? 0)).reduce((a, b) => a + b, 0);
    const sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);
    const sumY2 = y.map(yi => yi * yi).reduce((a, b) => a + b, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return { pearson: 0, pValue: 1 };

    const pearson = numerator / denominator;
    
    const t = pearson * Math.sqrt((n - 2) / (1 - pearson * pearson));
    const pValue = 2 * (1 - this.tDist(t, n - 2));

    return { pearson, pValue: isNaN(pValue) ? 1 : pValue };
  }

  // Student's t-distribution cumulative distribution function
  private tDist(t: number, df: number): number {
    // Abramowitz and Stegun formula 26.7.1
    const a1 = 0.196854;
    const a2 = 0.115194;
    const a3 = 0.000344;
    const a4 = 0.019527;
    
    const x = Math.abs(t);
    let p = 1 + x * (a1 + x * (a2 + x * (a3 + x * a4)));
    p = Math.pow(p, -4);
    
    return t > 0 ? 1 - p / 2 : p / 2;
  }
  
  /**
   * Calculate confidence score based on p-value and sample size
   */
  private calculateConfidence(pValue: number, sampleSize: number): number {
    const pValueEffect = 1 - pValue;
    const sampleSizeEffect = Math.min(1, sampleSize / 30); // Cap at 30 data points
    return pValueEffect * 0.7 + sampleSizeEffect * 0.3;
  }

  /**
   * Calculate consistency score based on regularity of intake
   */
  private calculateConsistencyScore(taken: boolean[]): number {
    if (taken.length < 2) return 1; // Perfect consistency

    const takenIndices = taken.map((t, i) => t ? i : -1).filter(i => i !== -1);
    if (takenIndices.length < 2) return 1;

    const intervals = [];
    for (let i = 1; i < takenIndices.length; i++) {
      const current = takenIndices[i];
      const previous = takenIndices[i - 1];
      if (current !== undefined && previous !== undefined) {
        intervals.push(current - previous);
      }
    }

    if (intervals.length === 0) return 1;

    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    if (meanInterval === 0) return 1;
    return Math.max(0, 1 - (stdDev / meanInterval));
  }

  /**
   * Calculate trend score based on performance improvement over time
   */
  private calculateTrendScore(performanceScores: number[]): number {
    if (performanceScores.length < 2) return 0;
    const x = Array.from({ length: performanceScores.length }, (_, i) => i);
    const y = performanceScores;
    const slope = this.calculateLinearRegressionSlope(x, y);
    return Math.max(-1, Math.min(1, slope));
  }

  private calculateLinearRegressionSlope(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * (y[i] ?? 0), 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumX2 - sumX * sumX;

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Analyze compliance patterns and identify issues
   */
  private analyzeCompliancePatterns(context: AIAnalysisContext): ComplianceData[] {
    const { supplements, logs, timeRange } = context;
    const complianceData: ComplianceData[] = [];

    for (const supplement of supplements) {
      const supplementLogs = logs.filter(log => log.supplementId === supplement.id);
      const expectedIntakes = this.calculateExpectedIntakes(supplement, timeRange);
      const actualIntakes = supplementLogs.filter(log => log.taken).length;
      const complianceRate = expectedIntakes > 0 ? actualIntakes / expectedIntakes : 1;

      const missedPatterns = this.identifyMissedPatterns(supplementLogs, supplement);
      const recommendations = this.generateComplianceRecommendations(missedPatterns);

      complianceData.push({
        supplementId: supplement.id,
        supplementName: supplement.name,
        complianceRate,
        expectedIntakes,
        actualIntakes,
        missedCount: expectedIntakes - actualIntakes,
        missedPatterns,
        recommendations,
      });
    }

    return complianceData;
  }

  /**
   * Calculate expected number of intakes based on schedule
   */
  private calculateExpectedIntakes(
    supplement: Supplement, 
    timeRange: { start: Date; end: Date }
  ): number {
    const daysDiff = Math.ceil(
      (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (supplement.frequency) {
      case 'daily':
        return daysDiff;
      case 'twice-daily':
        return daysDiff * 2;
      case 'weekly':
        return Math.ceil(daysDiff / 7);
      case 'as-needed':
        return Math.ceil(daysDiff / 3); // Estimate
      default:
        return daysDiff;
    }
  }

  /**
   * Identify patterns in missed doses
   */
  private identifyMissedPatterns(logs: SupplementLog[], supplement: Supplement): { morning: number; afternoon: number; evening: number; weekdays: number; weekends: number } {
    const missedLogs = logs.filter(log => !log.taken);
  const counts = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    weekdays: 0,
    weekends: 0,
  };

  missedLogs.forEach(log => {
    const time = log.time ? log.time : '09:00';
    const parts = time.split(':');
    const hourStr = parts.length > 0 ? parts[0] : '9';
    const hour = parseInt(hourStr, 10) || 0;
      if (hour < 12) counts.morning++;
      else if (hour < 17) counts.afternoon++;
      else counts.evening++;

      const dayOfWeek = new Date(log.date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) counts.weekends++;
      else counts.weekdays++;
    });

    return counts;
  }

  /**
   * Analyze supplement synergies and interactions
   */
  private analyzeSynergies(context: AIAnalysisContext): any[] {
    const synergies: any[] = [];
    const supplements = context.supplements;

    for (let i = 0; i < supplements.length; i++) {
      for (let j = i + 1; j < supplements.length; j++) {
        const supplementA = supplements[i];
        const supplementB = supplements[j];

        if (!supplementA || !supplementB) continue;

        const synergyScore = this.calculateSynergyScore(supplementA, supplementB, context);
        
        if (synergyScore > 0.6) {
          synergies.push({
            supplementA: supplementA.name,
            supplementB: supplementB.name,
            synergyScore,
            type: synergyScore > 0.8 ? 'strong' : 'moderate',
            recommendation: this.generateSynergyRecommendation(supplementA, supplementB, synergyScore),
          });
        }
      }
    }

    return synergies;
  }

  /**
   * Calculate synergy score between two supplements
   */
  private calculateSynergyScore(
    supplementA: Supplement,
    supplementB: Supplement,
    context: AIAnalysisContext
  ): number {
    const { logs, performanceMetrics } = context;
    const logsA = logs.filter(log => log.supplementId === supplementA.id);
    const logsB = logs.filter(log => log.supplementId === supplementB.id);

    if (logsA.length < this.MIN_DATA_POINTS || logsB.length < this.MIN_DATA_POINTS) return 0;

    const takenDaysA = new Set(logsA.filter(l => l.taken).map(l => new Date(l.date).toDateString()));
    const takenDaysB = new Set(logsB.filter(l => l.taken).map(l => new Date(l.date).toDateString()));

    const metricsByDate = new Map(performanceMetrics.map(m => [new Date(m.timestamp).toDateString(), m.value]));

    const scores: { both: number[]; a_only: number[]; b_only: number[] } = {
        both: [],
        a_only: [],
        b_only: [],
    };

    const allDays = new Set([...takenDaysA, ...takenDaysB]);

    for (const day of allDays) {
        const score = metricsByDate.get(day);
        if (score === undefined) continue;

        const takenA = takenDaysA.has(day);
        const takenB = takenDaysB.has(day);

        if (takenA && takenB) {
            scores.both.push(score);
        } else if (takenA) {
            scores.a_only.push(score);
        } else if (takenB) {
            scores.b_only.push(score);
        }
    }

    if (scores.both.length < 3 || scores.a_only.length < 3 || scores.b_only.length < 3) {
      return 0; // Not enough data
    }

    const avgBoth = scores.both.reduce((a, b) => a + b, 0) / scores.both.length;
    const avgA = scores.a_only.reduce((a, b) => a + b, 0) / scores.a_only.length;
    const avgB = scores.b_only.reduce((a, b) => a + b, 0) / scores.b_only.length;

    const synergyEffect = avgBoth - (avgA + avgB) / 2;

    const maxPossibleScore = Math.max(...performanceMetrics.map(m => m.value), 100);
    const normalizedSynergy = synergyEffect / maxPossibleScore;

    return Math.max(0, Math.min(1, normalizedSynergy + 0.5));
  }

  /**
   * Generate reasoning text for effectiveness analysis
   */
  private generateEffectivenessReasoning(
    correlation: number,
    trend: number,
    consistency: number
  ): string {
    const parts = [];
    
    if (correlation > 0.5) {
      parts.push(`shows strong positive correlation with performance`);
    } else if (correlation > 0.2) {
      parts.push(`shows moderate positive correlation with performance`);
    } else if (correlation < -0.2) {
      parts.push(`shows negative correlation with performance`);
    }

    if (consistency > 0.8) {
      parts.push(`demonstrates excellent consistency in intake`);
    } else if (consistency > 0.6) {
      parts.push(`shows good consistency in intake`);
    }

    if (trend > 0.5) {
      parts.push(`indicates improving effectiveness over time`);
    } else if (trend < -0.2) {
      parts.push(`shows declining effectiveness`);
    }

    return parts.length > 0 ? parts.join(' and ') : 'insufficient data for analysis';
  }

  /**
   * Generate compliance recommendations
   */
  private generateComplianceRecommendations(missedPatterns: { morning: number; afternoon: number; evening: number; weekdays: number; weekends: number }): string[] {
    const recommendations = [];

    if (missedPatterns.weekends > missedPatterns.weekdays) {
      recommendations.push('Consider setting weekend reminders');
    }

    if (missedPatterns.morning > missedPatterns.afternoon && missedPatterns.morning > missedPatterns.evening) {
      recommendations.push('Try taking supplements with breakfast');
    }

    if (missedPatterns.evening > missedPatterns.morning && missedPatterns.evening > missedPatterns.afternoon) {
      recommendations.push('Set evening reminder notifications');
    }

    return recommendations;
  }

  /**
   * Generate synergy recommendations
   */
  private generateSynergyRecommendation(
    supplementA: Supplement,
    supplementB: Supplement,
    synergyScore: number
  ): string {
    if (synergyScore > 0.8) {
      return `Strong synergy detected between ${supplementA.name} and ${supplementB.name}. Consider taking them together.`;
    } else {
      return `Moderate synergy between ${supplementA.name} and ${supplementB.name}. May be beneficial to coordinate timing.`;
    }
  }

  /**
   * Create effectiveness-based recommendations
   */
  private createEffectivenessRecommendations(scores: EffectivenessScore[], complianceData: ComplianceData[]): AIRecommendation[] {
    const complianceMap = new Map(complianceData.map(d => [d.supplementId, d.complianceRate]));
    return scores
      .filter(score => score.effectivenessScore < this.EFFECTIVENESS_THRESHOLD)
      .map(score => ({
        id: `effectiveness-${score.supplementId}`,
        type: 'effectiveness',
        title: `Optimize ${score.supplementName} effectiveness`,
        description: `Current effectiveness: ${(score.effectivenessScore * 100).toFixed(1)}%. ${score.reasoning}`,
        priority: score.effectivenessScore < 0.5 ? 'high' : 'medium',
        factors: {
          effectiveness: score.effectivenessScore,
          compliance: complianceMap.get(score.supplementId) ?? 0.8,
          synergy: 0.5,
          timing: 0.7,
          dosage: 0.6,
          sideEffects: 0.9,
          userGoals: 0.7,
        },
        actionable: true,
        actions: [
          'Review dosage timing',
          'Check for interactions',
          'Consider cycling',
          'Monitor effectiveness more closely',
        ],
        reasoning: `Based on ${score.sampleSize} data points with ${(score.confidence * 100).toFixed(1)}% confidence`,
      }));
  }

  /**
   * Create compliance-based recommendations
   */
  private createComplianceRecommendations(data: ComplianceData[]): AIRecommendation[] {
    return data
      .filter(d => d.complianceRate < this.COMPLIANCE_THRESHOLD)
      .map(d => ({
        id: `compliance-${d.supplementId}`,
        type: 'compliance',
        title: `Improve ${d.supplementName} compliance`,
        description: `Current compliance: ${(d.complianceRate * 100).toFixed(1)}%. ${d.missedCount} doses missed.`,
        priority: d.complianceRate < 0.6 ? 'high' : 'medium',
        factors: {
          effectiveness: 0.7,
          compliance: d.complianceRate,
          synergy: 0.5,
          timing: 0.6,
          dosage: 0.8,
          sideEffects: 0.9,
          userGoals: 0.8,
        },
        actionable: true,
        actions: [
          ...d.recommendations,
          'Set multiple reminders',
          'Use pill organizer',
          'Link to daily routine',
        ],
        reasoning: 'Based on missed pattern analysis',
      }));
  }

  /**
   * Create synergy-based recommendations
   */
  private createSynergyRecommendations(synergies: any[]): AIRecommendation[] {
    return synergies.map(synergy => ({
      id: `synergy-${synergy.supplementA}-${synergy.supplementB}`,
      type: 'synergy',
      title: `Leverage ${synergy.type} synergy`,
      description: synergy.recommendation,
      priority: synergy.type === 'strong' ? 'high' : 'medium',
      factors: {
        effectiveness: 0.8,
        compliance: 0.9,
        synergy: synergy.synergyScore,
        timing: 0.7,
        dosage: 0.8,
        sideEffects: 0.9,
        userGoals: 0.7,
      },
      actionable: true,
      actions: [
        'Take together at same time',
        'Monitor combined effects',
        'Adjust individual dosages if needed',
      ],
      reasoning: `Synergy score: ${(synergy.synergyScore * 100).toFixed(1)}%`,
    }));
  }

  /**
   * Create timing optimization recommendations
   */
  private createTimingRecommendations(analysis: any[]): AIRecommendation[] {
    return analysis.map(item => ({
      id: `timing-${item.supplementId}`,
      type: 'timing',
      title: `Optimize ${item.supplementName} timing`,
      description: `Current timing may not be optimal based on your patterns`,
      priority: 'medium',
      factors: {
        effectiveness: 0.7,
        compliance: 0.8,
        synergy: 0.6,
        timing: 0.5,
        dosage: 0.9,
        sideEffects: 0.8,
        userGoals: 0.7,
      },
      actionable: true,
      actions: [
        'Try morning intake',
        'Consider with/without food',
        'Monitor sleep impact',
        'Test different times',
      ],
      reasoning: 'Based on timing pattern analysis',
    }));
  }

  /**
   * Create dosage optimization recommendations
   */
  private createDosageRecommendations(analysis: any[]): AIRecommendation[] {
    return analysis.map(item => ({
      id: `dosage-${item.supplementId}`,
      type: 'dosage',
      title: `Review ${item.supplementName} dosage`,
      description: `Current dosage may need adjustment based on effectiveness data`,
      priority: 'medium',
      factors: {
        effectiveness: 0.8,
        compliance: 0.9,
        synergy: 0.7,
        timing: 0.8,
        dosage: 0.6,
        sideEffects: 0.7,
        userGoals: 0.8,
      },
      actionable: true,
      actions: [
        'Gradually adjust dosage',
        'Monitor side effects',
        'Consider cycling',
        'Consult healthcare provider',
      ],
      reasoning: 'Based on dosage-response analysis',
    }));
  }

  /**
   * Find most common days of the week
   */
  private findMostCommonDays(days: number[]): string[] {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts: { [key: number]: number } = {};
    
    days.forEach(day => {
      counts[day] = (counts[day] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));
    return (Object.entries(counts)
      .filter(([_, count]) => count === maxCount && count > 1)
      .map(([day]) => {
        const index = parseInt(day) || 0;
        if (index >= 0 && index < dayNames.length) {
          return dayNames[index];
        } else {
          return 'Unknown';
        }
      })) as string[];
  }

  /**
   * Find most common times
   */
  private findMostCommonTimes(times: string[]): string[] {
    const counts: { [key: string]: number } = {};

    times.forEach(time => {
      counts[time] = (counts[time] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));
    return (Object.entries(counts)
      .filter(([_, count]) => count === maxCount && count > 1)
      .map(([time]) => time)) as string[];
  }

  /**
   * Prioritize recommendations based on multiple factors
   */
  private prioritizeRecommendations(recommendations: AIRecommendation[]): AIRecommendation[] {
    return recommendations
      .map(rec => ({
        ...rec,
        overallScore: this.calculateOverallScore(rec.factors),
      }))
      .sort((a, b) => {
        // Sort by priority first, then by overall score
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        
        return b.overallScore - a.overallScore;
      })
      .slice(0, 10); // Limit to top 10 recommendations
  }

  /**
   * Calculate overall recommendation score
   */
  private calculateOverallScore(factors: RecommendationFactors): number {
    return (
      factors.effectiveness * this.EFFECTIVENESS_WEIGHT +
      factors.compliance * this.COMPLIANCE_WEIGHT +
      factors.synergy * this.SYNERGY_WEIGHT +
      factors.userGoals * this.USER_GOALS_WEIGHT
    );
  }

  /**
   * Analyze timing optimization opportunities
   */
  private analyzeTimingOptimization(context: AIAnalysisContext): any[] {
    // Placeholder for timing analysis
    return context.supplements.map(supplement => ({
      supplementId: supplement.id,
      supplementName: supplement.name,
    }));
  }

  /**
   * Analyze dosage optimization opportunities
   */
  private analyzeDosageOptimization(context: AIAnalysisContext): any[] {
    // Placeholder for dosage analysis
    return context.supplements.map(supplement => ({
      supplementId: supplement.id,
      supplementName: supplement.name,
    }));
  }

  /**
   * Align supplement logs with performance metrics by date
   */
  private alignDataByTime(
    logs: SupplementLog[],
    metrics: PerformanceMetrics[],
  ): { date: string; taken: boolean; performanceScore: number }[] {
    const alignedData: { [date: string]: { date: string; taken: boolean; performanceScore: number } } = {};
    
    logs.forEach(log => {
      const date = new Date(log.date).toDateString();
      if (!alignedData[date]) {
        alignedData[date] = { date, taken: false, performanceScore: 0 };
      }
      if (log.taken) {
        alignedData[date].taken = true;
      }
    });

    metrics.forEach(metric => {
      const date = new Date(metric.timestamp).toDateString();
      if (alignedData[date]) {
        alignedData[date].performanceScore = metric.value;
      }
    });

    return Object.values(alignedData);
  }
}