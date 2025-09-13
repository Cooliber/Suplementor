import { NextRequest, NextResponse } from 'next/server';
import { errorTracker, AppError, ValidationError } from '@/lib/error-monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyObj = body as { error: any; context: any; user: any };
    const { error, context, user } = bodyObj;

    if (!error) {
      throw new ValidationError('Error data is required');
    }

    // Set user context if provided
    if (user) {
      errorTracker.setUser(user);
    }

    // Add additional context
    const enhancedContext = {
      ...context,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip || 'unknown',
      timestamp: new Date().toISOString(),
      url: request.url,
    };

    // Capture the error
    const errorObj = new Error(error.message || 'Unknown error');
    errorObj.stack = error.stack;
    errorTracker.captureError(errorObj, enhancedContext);

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
      errorId: crypto.randomUUID(),
    });

  } catch (error) {
    console.error('Error in error handler:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process error report',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'error-handler',
  });
}