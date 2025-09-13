import { NextRequest, NextResponse } from 'next/server'
import { aiKnowledgeEngine } from '@/lib/ai-knowledge-engine'
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging'
import { z } from 'zod'

// Request validation schema
const OptimizeStackRequestSchema = z.object({
  userProfile: z.object({
    userId: z.string().min(1),
    goals: z.array(z.string()),
    healthConditions: z.array(z.string()),
    medications: z.array(z.string()),
    allergies: z.array(z.string()),
    preferences: z.object({
      budgetLimit: z.number().optional()
    }),
    currentSupplements: z.array(
      z.object({
        supplementId: z.string()
      })
    )
  }),
  currentSupplements: z.array(
    z.object({
      name: z.string(),
      commonNames: z.array(z.string()),
      activeCompounds: z.array(z.string()),
      primaryEffects: z.array(z.string()),
      category: z.string(),
      targetSystems: z.array(z.string()),
      evidenceLevel: z.enum(['strong', 'moderate', 'weak', 'insufficient']),
      dosageInfo: z.object({
        standard: z.object({
          min: z.number(),
          max: z.number(),
          unit: z.string()
        })
      })
    })
  ),
  availableSupplements: z
    .array(
      z.object({
        name: z.string(),
        commonNames: z.array(z.string()),
        activeCompounds: z.array(z.string()),
        primaryEffects: z.array(z.string()),
        category: z.string(),
        targetSystems: z.array(z.string()),
        evidenceLevel: z.enum(['strong', 'moderate', 'weak', 'insufficient']),
        dosageInfo: z.object({
          standard: z.object({
            min: z.number(),
            max: z.number(),
            unit: z.string()
          })
        })
      })
    )
    .optional()
})

export async function POST(request: NextRequest) {
  try {
    advancedDebugger.info(DebugCategory.AI, 'AI stack optimization request received')

    const body = await request.json()
    const validatedData = OptimizeStackRequestSchema.parse(body)

    const result = await aiKnowledgeEngine.optimizeSupplementStack(
      validatedData.userProfile as any,
      validatedData.currentSupplements as any,
      validatedData.availableSupplements as any
    )

    advancedDebugger.info(
      DebugCategory.AI,
      'AI stack optimization completed successfully',
      {
        userId: validatedData.userProfile.userId,
        recommendationCount: result.recommendations.length
      }
    )

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    advancedDebugger.error(DebugCategory.API, 'AI stack optimization failed', error)

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
        error: error instanceof Error ? error.message : 'Stack optimization failed',
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
