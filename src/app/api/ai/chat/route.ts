import { NextRequest } from 'next/server';
import { aiKnowledgeEngine } from '@/lib/ai-knowledge-engine';
import { advancedDebugger, DebugCategory } from '@/lib/advanced-debugging';
import { z } from 'zod';

// Request validation schema
const ChatRequestSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1).max(2000),
  context: z.object({
    userProfile: z.object({
      userId: z.string(),
      goals: z.array(z.string()),
      healthConditions: z.array(z.string()),
      currentSupplements: z.array(z.object({
        supplementId: z.string()
      }))
    }).optional(),
    conversationHistory: z.boolean().optional().default(true)
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    advancedDebugger.info(DebugCategory.AI, 'AI chat request received');

    const body = await request.json();
    const validatedData = ChatRequestSchema.parse(body);

    const result = await aiKnowledgeEngine.createInteractiveChat(
      validatedData.userId,
      validatedData.message,
      validatedData.context
    );

    advancedDebugger.info(DebugCategory.AI, 'AI chat stream initialized', {
      userId: validatedData.userId,
      messageLength: validatedData.message.length
    });

    // Return the streaming response
    return result.toDataStreamResponse();

  } catch (error) {
    advancedDebugger.error(DebugCategory.API, 'AI chat failed', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}