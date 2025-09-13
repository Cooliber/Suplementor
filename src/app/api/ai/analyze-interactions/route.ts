import { NextRequest, NextResponse } from 'next/server';
import { aiInteractionAnalyzer } from '@/lib/ai-interaction-analyzer';
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging';
import { z } from 'zod';

// Request validation schemas
const SupplementSchema = z.object({
  name: z.string().min(1),
  currentDosage: z.string().optional(),
  primaryEffects: z.array(z.string()).optional(),
  activeCompounds: z.array(z.string()).optional(),
  category: z.string().optional(),
  frequency: z.enum(['once_daily', 'twice_daily', 'three_times_daily', 'as_needed']).optional()
});

const UserHealthProfileSchema = z.object({
  age: z.number().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  healthConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  liverFunction: z.enum(['normal', 'impaired', 'unknown']).optional(),
  kidneyFunction: z.enum(['normal', 'impaired', 'unknown']).optional(),
  pregnancyStatus: z.enum(['pregnant', 'breastfeeding', 'trying_to_conceive', 'not_applicable']).optional()
});

const AnalysisOptionsSchema = z.object({
  includeAlternatives: z.boolean().optional(),
  focusOnSafety: z.boolean().optional(),
  generateSchedule: z.boolean().optional(),
  riskTolerance: z.enum(['conservative', 'balanced', 'aggressive']).optional()
});

const FullAnalysisRequestSchema = z.object({
  supplements: z.array(SupplementSchema).min(1),
  userProfile: UserHealthProfileSchema.optional(),
  options: AnalysisOptionsSchema.optional()
});

const QuickSafetyCheckSchema = z.object({
  newSupplement: SupplementSchema.extend({
    proposedDosage: z.string().optional()
  }),
  existingSupplements: z.array(SupplementSchema),
  userProfile: UserHealthProfileSchema.optional()
});

const DrugInteractionSchema = z.object({
  supplements: z.array(SupplementSchema),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string().optional(),
    frequency: z.string().optional()
  })),
  userProfile: UserHealthProfileSchema.optional()
});

const ScheduleGenerationSchema = z.object({
  supplements: z.array(SupplementSchema.extend({
    frequency: z.enum(['once_daily', 'twice_daily', 'three_times_daily', 'as_needed']).optional()
  })),
  preferences: z.object({
    wakeUpTime: z.string().optional(),
    bedTime: z.string().optional(),
    mealTimes: z.object({
      breakfast: z.string().optional(),
      lunch: z.string().optional(),
      dinner: z.string().optional()
    }).optional(),
    workSchedule: z.enum(['standard', 'shift_work', 'flexible']).optional(),
    lifestyle: z.enum(['sedentary', 'active', 'very_active']).optional()
  }).optional()
});

// Main comprehensive analysis endpoint
export async function POST(request: NextRequest) {
  try {
    advancedDebugger.info(DebugCategory.API, 'AI interaction analysis request received');

    const url = new URL(request.url);
    const analysisType = url.searchParams.get('type') || 'full';

    const body = await request.json();

    let result;

    switch (analysisType) {
      case 'full':
        result = await handleFullAnalysis(body);
        break;
      case 'quick-safety':
        result = await handleQuickSafetyCheck(body);
        break;
      case 'drug-interactions':
        result = await handleDrugInteractions(body);
        break;
      case 'schedule':
        result = await handleScheduleGeneration(body);
        break;
      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    advancedDebugger.info(DebugCategory.API, 'AI interaction analysis completed successfully', {
      analysisType,
      hasResult: !!result
    });

    return NextResponse.json({
      success: true,
      analysisType,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    advancedDebugger.error(DebugCategory.API, 'AI interaction analysis failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function handleFullAnalysis(body: any) {
  const validatedData = FullAnalysisRequestSchema.parse(body);
  
  return await aiInteractionAnalyzer.analyzeSupplementStack(
    validatedData.supplements,
    validatedData.userProfile,
    validatedData.options
  );
}

async function handleQuickSafetyCheck(body: any) {
  const validatedData = QuickSafetyCheckSchema.parse(body);
  
  return await aiInteractionAnalyzer.quickSafetyCheck(
    validatedData.newSupplement,
    validatedData.existingSupplements,
    validatedData.userProfile
  );
}

async function handleDrugInteractions(body: any) {
  const validatedData = DrugInteractionSchema.parse(body);
  
  return await aiInteractionAnalyzer.analyzeDrugSupplementInteractions(
    validatedData.supplements,
    validatedData.medications,
    validatedData.userProfile
  );
}

async function handleScheduleGeneration(body: any) {
  const validatedData = ScheduleGenerationSchema.parse(body);
  
  return await aiInteractionAnalyzer.generateOptimalSchedule(
    validatedData.supplements,
    validatedData.preferences
  );
}

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'healthy',
      service: 'AI Interaction Analyzer',
      capabilities: [
        'full-interaction-analysis',
        'quick-safety-check',
        'drug-supplement-interactions',
        'optimal-schedule-generation'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}