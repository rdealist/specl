import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';
import { callAi, parseAiJson } from '@/lib/ai/client';
import { handleAiError } from '@/lib/ai/errorHandler';

const prisma = new PrismaClient();

interface SuggestedFlowsRequest {
  documentId: string;
  requirementId: string;
  userStory: string;
  acceptance?: Array<{ given: string; when: string; then: string }>;
}

interface FlowStep {
  stepTitle: string;
  userIntent: string;
  systemResponse: string;
}

interface SuggestedFlowsResponse {
  flows: {
    main: FlowStep[];
    alternatives: FlowStep[];
  };
  tokensUsed: number;
  cost: number;
}

// POST /api/ai/suggested-flows - Generate user flows for a requirement
export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: SuggestedFlowsRequest = await request.json();
    const { documentId, requirementId, userStory, acceptance } = body;

    if (!documentId || !requirementId || !userStory) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, requirementId, userStory' },
        { status: 400 }
      );
    }

    // Get user's workspace
    const workspace = await prisma.workspace.findFirst({
      where: { ownerUserId: userId },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Verify document ownership
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        workspaceId: workspace.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Build AI prompt
    const systemPrompt = `You are a UX expert. Your task is to generate detailed user flows for a feature requirement.

A user flow describes the step-by-step interaction between a user and the system.

Flow step format:
- stepTitle: Short title for this step (e.g., "Enter login credentials")
- userIntent: What the user is trying to do
- systemResponse: What the system does in response

Rules:
1. Generate a main flow (happy path) with 3-7 steps
2. Generate 1-2 alternative flows (error scenarios, edge cases)
3. Each flow should be complete and actionable
4. Return ONLY valid JSON in this format:
{
  "flows": {
    "main": [
      { "stepTitle": "...", "userIntent": "...", "systemResponse": "..." }
    ],
    "alternatives": [
      { "stepTitle": "...", "userIntent": "...", "systemResponse": "..." }
    ]
  },
  "explanation": "Brief explanation of the flows"
}`;

    const userPrompt = `Requirement ID: ${requirementId}
User Story: ${userStory}

${acceptance && acceptance.length > 0 ? `Acceptance Criteria:\n${acceptance.map((ac) => `- Given ${ac.given}, when ${ac.when}, then ${ac.then}`).join('\n')}` : ''}

Generate detailed user flows for this requirement.`;

    // Call AI
    const aiResponse = await callAi(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 2048,
    });

    // Parse AI response
    const parsedResponse = parseAiJson<{
      flows: { main: FlowStep[]; alternatives: FlowStep[] };
      explanation: string;
    }>(aiResponse.content);

    // Validate flows structure
    if (!parsedResponse.flows || !Array.isArray(parsedResponse.flows.main)) {
      return NextResponse.json(
        {
          error: 'AI generated invalid flows structure',
        },
        { status: 500 }
      );
    }

    // Calculate cost
    const costPerInputToken = 3 / 1_000_000;
    const costPerOutputToken = 15 / 1_000_000;
    const estimatedCost =
      aiResponse.tokensIn * costPerInputToken + aiResponse.tokensOut * costPerOutputToken;

    // Log AI usage
    await prisma.aiAuditLog.create({
      data: {
        workspaceId: workspace.id,
        userId,
        documentId,
        taskType: 'suggested_flows',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        tokenIn: aiResponse.tokensIn,
        tokenOut: aiResponse.tokensOut,
        costEstimate: estimatedCost,
      },
    });

    return NextResponse.json({
      flows: parsedResponse.flows,
      tokensUsed: aiResponse.tokensIn + aiResponse.tokensOut,
      cost: estimatedCost,
    } as SuggestedFlowsResponse);
  } catch (error: any) {
    console.error('POST /api/ai/suggested-flows error:', error);

    // Handle AI-specific errors
    const aiError = handleAiError(error);
    return NextResponse.json(
      {
        error: aiError.userMessage,
        code: aiError.code,
        retryable: aiError.retryable,
        retryAfter: aiError.retryAfter,
      },
      { status: aiError.code === 'AI_DISABLED' ? 503 : 500 }
    );
  }
}
