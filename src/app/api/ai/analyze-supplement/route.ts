import { NextRequest, NextResponse } from 'next/server'
import { aiKnowledgeEngine } from '@/lib/ai-knowledge-engine'
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging'
import { z } from 'zod'

// Request validation schema
const AnalyzeSupplementRequestSchema = z.object({
  supplement: z.object({
    name: z.string().min(1),
    commonNames: z.array(z.string()),
    activeCompounds: z.array(z.string()),
    primaryEffects: z.array(z.string()),
    category: z.string(),
    targetSystems: z.array(z.string()),
    evidenceLevel: z.enum(['strong', 'moderate', 'weak', 'insufficient'])
  }),
  userContext: z
    .object({
      goals: z.array(z.object({ goal: z.string() })).optional(),
      healthConditions: z.array(z.string()).optional(),
      currentSupplements: z.array(z.string()).optional(),
      age: z.number().optional(),
      gender: z.string().optional()
    })
    .optional()
})

export async function POST(request: NextRequest) {
  try {
    advancedDebugger.info(DebugCategory.API, 'AI supplement analysis request received')

    const body = await request.json()
    const validatedData = AnalyzeSupplementRequestSchema.parse(body)

    const result = await aiKnowledgeEngine.analyzeSupplementWithAI(
      validatedData.supplement,
      validatedData.userContext
    )

    advancedDebugger.info(
      DebugCategory.API,
      'AI supplement analysis completed successfully'
    )

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    advancedDebugger.error(DebugCategory.API, 'AI supplement analysis failed', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
