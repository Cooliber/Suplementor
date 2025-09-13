import { z } from 'zod';

// Base supplement schema with strict validation
const BaseSupplementObject = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(2, 'Supplement name must be at least 2 characters').max(100, 'Supplement name too long'),
  dosage: z.string().min(1, 'Dosage is required').max(50, 'Dosage too long'),
  frequency: z.enum(['daily', 'twice-daily', 'weekly', 'as-needed']),
  timeOfDay: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')).min(1, 'At least one time of day is required'),
  category: z.enum(['cognitive', 'energy', 'sleep', 'mood', 'health']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  sideEffects: z.array(z.string().max(100, 'Side effect description too long')).max(10, 'Too many side effects').optional(),
  effectiveness: z.number().int().min(1, 'Effectiveness must be between 1-10').max(10, 'Effectiveness must be between 1-10').optional(),
  cost: z.number().positive('Cost must be positive').max(1000, 'Cost too high').optional(),
  brand: z.string().max(50, 'Brand name too long').optional()
});

export const BaseSupplementSchema = BaseSupplementObject.refine(data => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
});

// Extended supplement schema with additional validation
export const ExtendedSupplementSchema = BaseSupplementObject.extend({
  polishName: z.string().max(100, 'Polish name too long').optional(),
  benefits: z.array(z.string().max(200, 'Benefit description too long')).max(10, 'Too many benefits').optional(),
  interactions: z.array(z.object({
    supplementId: z.string().min(1, 'Interaction supplement ID is required'),
    severity: z.enum(['low', 'medium', 'high']),
    description: z.string().max(200, 'Interaction description too long')
  })).max(10, 'Too many interactions').optional(),
  contraindications: z.array(z.string().max(200, 'Contraindication too long')).max(10, 'Too many contraindications').optional(),
  dosageHistory: z.array(z.object({
    dosage: z.string().min(1, 'Dosage is required').max(50, 'Dosage too long'),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    reason: z.string().max(200, 'Reason too long').optional()
  })).max(50, 'Too many dosage changes').optional(),
  researchLinks: z.array(z.string().url('Invalid URL')).max(10, 'Too many research links').optional()
});

// Type inference for Zod schemas
export const SupplementLogSchema = z.object({
  id: z.string().min(1, 'Log ID is required'),
  supplementId: z.string().min(1, 'Supplement ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  taken: z.boolean(),
  dosage: z.string().max(50, 'Dosage too long').optional(),
  notes: z.string().max(300, 'Notes too long').optional(),
  sideEffects: z.array(z.string().max(100, 'Side effect description too long')).max(5, 'Too many side effects').optional(),
  effectiveness: z.number().int().min(1, 'Effectiveness must be between 1-10').max(10, 'Effectiveness must be between 1-10').optional()
});

// AI recommendation schema
export const AIRecommendationSchema = z.object({
  id: z.string().min(1, 'Recommendation ID is required'),
  type: z.enum(['effectiveness', 'compliance', 'synergy', 'timing', 'dosage']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description too long'),
  confidence: z.number().int().min(0, 'Confidence must be between 0-100').max(100, 'Confidence must be between 0-100').optional(),
  reasoning: z.string().min(10, 'Reasoning must be at least 10 characters').max(500, 'Reasoning too long'),
  actionable: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  factors: z.object({
    effectiveness: z.number(),
    compliance: z.number(),
    synergy: z.number(),
    timing: z.number(),
    dosage: z.number(),
    sideEffects: z.number(),
    userGoals: z.number(),
  }),
  actions: z.array(z.string().max(100, 'Step description too long')).max(10, 'Too many steps')
});

// Performance metrics schema
export const PerformanceMetricSchema = z.object({
  id: z.string().min(1, 'Metric ID is required'),
  name: z.string().min(2, 'Metric name must be at least 2 characters').max(50, 'Metric name too long'),
  value: z.number(),
  unit: z.string().max(20, 'Unit too long'),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid ISO timestamp'),
  category: z.enum(['cognitive', 'physical', 'mood', 'sleep', 'general']),
  baseline: z.number().optional(),
  target: z.number().optional()
});

// Alert schema for notifications
export const AlertSchema = z.object({
  id: z.string().min(1, 'Alert ID is required'),
  type: z.enum(['missed_dose', 'low_effectiveness', 'interaction_warning', 'goal_achievement', 'system_error']),
  title: z.string().min(5, 'Alert title must be at least 5 characters').max(100, 'Alert title too long'),
  message: z.string().min(10, 'Alert message must be at least 10 characters').max(300, 'Alert message too long'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Invalid ISO timestamp'),
  read: z.boolean(),
  actionRequired: z.boolean(),
  actionUrl: z.string().url('Invalid action URL').optional(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/).optional()
});

// Validation helper functions
export const validateSupplement = (data: unknown) => {
  try {
    return { success: true, data: BaseSupplementSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.issues : [{ message: 'Unknown validation error' }] };
  }
};

export const validateSupplementLog = (data: unknown) => {
  try {
    return { success: true, data: SupplementLogSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.issues : [{ message: 'Unknown validation error' }] };
  }
};

export const validateAIRecommendation = (data: unknown) => {
  try {
    return { success: true, data: AIRecommendationSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.issues : [{ message: 'Unknown validation error' }] };
  }
};

// TypeScript type exports
export type BaseSupplement = z.infer<typeof BaseSupplementSchema>;
export type ExtendedSupplement = z.infer<typeof ExtendedSupplementSchema>;
export type SupplementLog = z.infer<typeof SupplementLogSchema>;
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;
export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;
export type Alert = z.infer<typeof AlertSchema>;

export type Supplement = ExtendedSupplement;
export type PerformanceMetrics = PerformanceMetric;

export const EffectivenessScoreSchema = z.object({
  supplementId: z.string(),
  supplementName: z.string(),
  effectivenessScore: z.number(),
  confidence: z.number(),
  correlation: z.number(),
  trend: z.number(),
  consistency: z.number(),
  sampleSize: z.number(),
  reasoning: z.string(),
});
export type EffectivenessScore = z.infer<typeof EffectivenessScoreSchema>;

export const ComplianceDataSchema = z.object({
  supplementId: z.string(),
  supplementName: z.string(),
  complianceRate: z.number(),
  expectedIntakes: z.number(),
  actualIntakes: z.number(),
  missedCount: z.number(),
  missedPatterns: z.object({
    morning: z.number(),
    afternoon: z.number(),
    evening: z.number(),
    weekdays: z.number(),
    weekends: z.number(),
  }),
  recommendations: z.array(z.string()),
});
export type ComplianceData = z.infer<typeof ComplianceDataSchema>;

// Validation result types
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: z.ZodIssue[] };

// Utility functions for data sanitization
export const sanitizeSupplementInput = (input: Partial<BaseSupplement>): Partial<BaseSupplement> => {
  const sanitized = { ...input };
  
  // Trim string fields
  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.dosage) sanitized.dosage = sanitized.dosage.trim();
  if (sanitized.notes) sanitized.notes = sanitized.notes.trim();
  if (sanitized.brand) sanitized.brand = sanitized.brand.trim();
  
  // Validate and clean arrays
  if (sanitized.timeOfDay) {
    sanitized.timeOfDay = sanitized.timeOfDay.filter(time => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time));
  }
  if (sanitized.sideEffects) {
    sanitized.sideEffects = sanitized.sideEffects.filter(effect => effect.trim().length > 0).map(effect => effect.trim());
  }
  
  return sanitized;
};

// Stack-related types for supplement combinations
export interface StackSupplement {
  id: string;
  name: string;
  polishName: string;
  category: string;
  description?: string;
  benefits: string[];
  dosage: string;
  timing?: string;
  price?: number;
  interactions?: string[];
  warnings?: string[];
  contraindications?: string[];
  neuroEffects?: string[];
  source?: string;
  sklad?: {
    substancjaCzynna: string;
    dawka: string;
    dodatki: string[];
  };
}

export interface StackItem {
  supplement: StackSupplement;
  customDosage: string;
  customTiming: string;
  notes?: string;
}

export interface Interaction {
  type: 'warning' | 'danger' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high';
  supplements: string[];
  recommendation: string;
}

export interface SafetyProfile {
  overallRisk: 'low' | 'medium' | 'high';
  interactions: Interaction[];
  warnings: string[];
  contraindications: string[];
  dosageWarnings: string[];
  timingConflicts: string[];
  cycleRecommendations: string[];
}

export const sanitizeSupplementLogInput = (input: Partial<SupplementLog>): Partial<SupplementLog> => {
  const sanitized = { ...input };

  if (sanitized.notes) sanitized.notes = sanitized.notes.trim();
  if (sanitized.dosage) sanitized.dosage = sanitized.dosage.trim();

  if (sanitized.sideEffects) {
    sanitized.sideEffects = sanitized.sideEffects.filter(effect => effect.trim().length > 0).map(effect => effect.trim());
  }

  return sanitized;
};

// Intake log schema for drag board functionality
export const SupplementWithTrackingSchema = ExtendedSupplementSchema.extend({
  time: z.string()
});

export const IntakeLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  supplements: z.array(SupplementWithTrackingSchema),
  immuneImpact: z.array(z.number())
});

// Type inference
export type SupplementWithTracking = z.infer<typeof SupplementWithTrackingSchema>;
export type IntakeLog = z.infer<typeof IntakeLogSchema>;