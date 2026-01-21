import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';
import { callAi, parseAiJson } from '@/lib/ai/client';
import { handleAiError } from '@/lib/ai/errorHandler';
import { JsonPatchOperation, validatePatch } from '@/lib/jsonPatch';

const prisma = new PrismaClient();

interface FieldPatchRequest {
  documentId: string;
  targetFieldPath: string; // e.g., "requirements.0.acceptance"
  currentValue: any;
  documentSummary: {
    title: string;
    userStory?: string;
  };
}

interface FieldPatchResponse {
  patches: JsonPatchOperation[];
  preview: string;
  tokensUsed: number;
  cost: number;
}

// POST /api/ai/field-patch - Generate field suggestions and patches
export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: FieldPatchRequest = await request.json();
    const { documentId, targetFieldPath, currentValue, documentSummary } = body;

    if (!documentId || !targetFieldPath) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, targetFieldPath' },
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

    // Build AI prompt based on field path
    const systemPrompt = buildSystemPrompt(targetFieldPath);
    const userPrompt = buildUserPrompt(targetFieldPath, currentValue, documentSummary);

    // Call AI
    const aiResponse = await callAi(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 2048,
    });

    // Parse AI response as JSON patches
    const parsedResponse = parseAiJson<{ patches: JsonPatchOperation[]; explanation: string }>(
      aiResponse.content
    );

    // Validate patches
    const validation = validatePatch(parsedResponse.patches);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'AI generated invalid patches',
          validationErrors: validation.errors,
        },
        { status: 500 }
      );
    }

    // Calculate cost (rough estimate: $3 per 1M input tokens, $15 per 1M output tokens for Claude Sonnet)
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
        taskType: 'field_patch',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        tokenIn: aiResponse.tokensIn,
        tokenOut: aiResponse.tokensOut,
        costEstimate: estimatedCost,
      },
    });

    return NextResponse.json({
      patches: parsedResponse.patches,
      preview: parsedResponse.explanation,
      tokensUsed: aiResponse.tokensIn + aiResponse.tokensOut,
      cost: estimatedCost,
    } as FieldPatchResponse);
  } catch (error: any) {
    console.error('POST /api/ai/field-patch error:', error);

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

function buildSystemPrompt(targetFieldPath: string): string {
  if (targetFieldPath.includes('acceptance')) {
    return `You are a product requirements expert. Your task is to generate Given-When-Then acceptance criteria for a feature.

Rules:
1. Generate 3-5 acceptance criteria
2. Each criterion must follow the format: { "given": "...", "when": "...", "then": "..." }
3. Cover happy path, edge cases, and error scenarios
4. Be specific and testable
5. Return ONLY valid JSON in this format:
{
  "patches": [
    { "op": "replace", "path": "/acceptance", "value": [ { "given": "...", "when": "...", "then": "..." } ] }
  ],
  "explanation": "Brief explanation of the generated criteria"
}`;
  }

  if (targetFieldPath.includes('edgeCases')) {
    return `You are a QA expert. Your task is to identify edge cases for a feature.

Rules:
1. Generate 3-5 edge cases
2. Each edge case should be a concise string describing a boundary condition or unusual scenario
3. Focus on error handling, validation, and unexpected user behavior
4. Return ONLY valid JSON in this format:
{
  "patches": [
    { "op": "replace", "path": "/edgeCases", "value": ["edge case 1", "edge case 2", ...] }
  ],
  "explanation": "Brief explanation of the edge cases"
}`;
  }

  // Generic field patch
  return `You are a product requirements expert. Your task is to improve or complete a PRD field.

Rules:
1. Analyze the current field value and document context
2. Generate patches to improve or complete the field
3. Return ONLY valid JSON in this format:
{
  "patches": [
    { "op": "replace", "path": "/<field>", "value": "..." }
  ],
  "explanation": "Brief explanation of the changes"
}`;
}

function buildUserPrompt(
  targetFieldPath: string,
  currentValue: any,
  documentSummary: { title: string; userStory?: string }
): string {
  return `Document: ${documentSummary.title}
${documentSummary.userStory ? `User Story: ${documentSummary.userStory}` : ''}

Current field path: ${targetFieldPath}
Current value: ${JSON.stringify(currentValue, null, 2) || 'empty'}

Generate appropriate content for this field based on the document context.`;
}
