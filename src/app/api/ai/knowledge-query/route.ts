import { NextRequest, NextResponse } from 'next/server';
import { aiKnowledgeEngine } from '@/lib/ai-knowledge-engine';
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging';
import { z } from 'zod';

// Request validation schema
const KnowledgeQueryRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  context: z.object({
    userGoals: z.array(z.string()).optional(),
    focusAreas: z.array(z.string()).optional(),
    includeResearch: z.boolean().optional().default(false)
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    advancedDebugger.info(DebugCategory.AI, 'AI knowledge query request received');

    const body = await request.json();
    const validatedData = KnowledgeQueryRequestSchema.parse(body);

    const result = await aiKnowledgeEngine.answerKnowledgeQuery(
      validatedData.query,
      validatedData.context
    );

    advancedDebugger.info(DebugCategory.AI, 'AI knowledge query completed successfully', {
      queryLength: validatedData.query.length,
      evidenceLevel: result.evidenceLevel,
      relatedSupplementsCount: result.relatedSupplements.length
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    advancedDebugger.error(DebugCategory.API, 'AI knowledge query failed', error);

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
        error: error instanceof Error ? error.message : 'Knowledge query failed',
        timestamp: new Date().toISOString()
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}