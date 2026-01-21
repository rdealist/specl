import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient, ExportProfile, ExportLanguage, ExportScope } from '@prisma/client';
import { buildExportContext } from '@/domain/context/exportContext';
import { filterRequirementsByScope } from '@/lib/export/filterScope';
import { generateCacheKey } from '@/lib/export/cacheKey';

const prisma = new PrismaClient();

interface ExportRequestBody {
  profile: ExportProfile;
  language: ExportLanguage;
  scope: ExportScope;
}

// POST /api/documents/[id]/export - Export document to context JSON
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace
    const workspace = await prisma.workspace.findFirst({
      where: { ownerUserId: userId },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Get document with fields and template
    const document = await prisma.document.findFirst({
      where: {
        id,
        workspaceId: workspace.id,
      },
      include: {
        fields: true,
        template: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Parse request body
    const body: ExportRequestBody = await request.json();
    const { profile, language, scope } = body;

    // Validate input
    if (!profile || !language || !scope) {
      return NextResponse.json(
        { error: 'Missing required fields: profile, language, scope' },
        { status: 400 }
      );
    }

    // Get fieldsJson
    const fieldsJson = (document.fields?.fieldsJson as Record<string, any>) || {};

    // === ZH Export Flow ===
    if (language === 'zh') {
      // 1. Map document to context
      const exportResult = buildExportContext({
        documentId: document.id,
        updatedAt: document.updatedAt.toISOString(),
        fieldsJson,
        language: 'zh',
        source: 'manual',
        profile,
        includeFlowsInLean: false,
      });

      // 2. Filter requirements by scope
      if (exportResult.context.requirements) {
        exportResult.context.requirements = filterRequirementsByScope(
          exportResult.context.requirements,
          scope
        );
      }

      // 3. Validate
      if (!exportResult.valid) {
        return NextResponse.json(
          {
            error: 'Export validation failed',
            validationErrors: exportResult.errors,
          },
          { status: 400 }
        );
      }

      // 4. Generate cache key
      const contentHash = generateCacheKey(exportResult.context);

      // 5. Check if export already exists
      const existingExport = await prisma.exportRecord.findFirst({
        where: {
          documentId: id,
          profile,
          language,
          scope,
          contentHash,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingExport) {
        // Return cached export
        return NextResponse.json({
          context: existingExport.contentJson,
          cached: true,
          createdAt: existingExport.createdAt.toISOString(),
        });
      }

      // 6. Store new export
      const newExport = await prisma.exportRecord.create({
        data: {
          documentId: id,
          profile,
          language,
          scope,
          contentJson: exportResult.context,
          contentHash,
        },
      });

      return NextResponse.json({
        context: exportResult.context,
        cached: false,
        createdAt: newExport.createdAt.toISOString(),
      });
    }

    // === EN Export Flow ===
    if (language === 'en') {
      // Import AI translation dynamically (only when needed)
      const { translateContextToEn } = await import('@/lib/ai/translate');
      const { handleAiError } = await import('@/lib/ai/errorHandler');

      try {
        // 1. Generate ZH export first (deterministic)
        const zhExportResult = buildExportContext({
          documentId: document.id,
          updatedAt: document.updatedAt.toISOString(),
          fieldsJson,
          language: 'zh',
          source: 'manual',
          profile,
          includeFlowsInLean: false,
        });

        // 2. Filter requirements by scope
        if (zhExportResult.context.requirements) {
          zhExportResult.context.requirements = filterRequirementsByScope(
            zhExportResult.context.requirements,
            scope
          );
        }

        // 3. Validate ZH context
        if (!zhExportResult.valid) {
          return NextResponse.json(
            {
              error: 'Source ZH export validation failed',
              validationErrors: zhExportResult.errors,
            },
            { status: 400 }
          );
        }

        // 4. Translate ZH context to EN using AI
        const translationResult = await translateContextToEn(zhExportResult.context);

        // 5. Validate EN context
        const { validateContext } = await import('@/domain/context/validate');
        const enValidation = validateContext(translationResult.enContext);

        if (!enValidation.valid) {
          return NextResponse.json(
            {
              error: 'EN translation validation failed',
              validationErrors: enValidation.errors,
              message: 'AI translation produced invalid structure. Please try again or contact support.',
            },
            { status: 500 }
          );
        }

        // 6. Generate cache key
        const contentHash = generateCacheKey(translationResult.enContext);

        // 7. Calculate cost
        const costPerInputToken = 3 / 1_000_000;
        const costPerOutputToken = 15 / 1_000_000;
        const estimatedCost =
          translationResult.tokensIn * costPerInputToken +
          translationResult.tokensOut * costPerOutputToken;

        // 8. Log AI usage
        await prisma.aiAuditLog.create({
          data: {
            workspaceId: workspace.id,
            userId,
            documentId: id,
            taskType: 'context_export_en',
            provider: 'anthropic',
            model: 'claude-3-5-sonnet-20241022',
            tokenIn: translationResult.tokensIn,
            tokenOut: translationResult.tokensOut,
            costEstimate: estimatedCost,
          },
        });

        // 9. Store export record
        const newExport = await prisma.exportRecord.create({
          data: {
            documentId: id,
            profile,
            language: 'en',
            scope,
            contentJson: translationResult.enContext,
            contentHash,
          },
        });

        return NextResponse.json({
          context: translationResult.enContext,
          cached: false,
          createdAt: newExport.createdAt.toISOString(),
          aiMetadata: {
            tokensUsed: translationResult.tokensIn + translationResult.tokensOut,
            cost: estimatedCost,
          },
        });
      } catch (error: any) {
        console.error('EN export translation error:', error);
        const aiError = handleAiError(error);
        return NextResponse.json(
          {
            error: aiError.userMessage,
            code: aiError.code,
            retryable: aiError.retryable,
          },
          { status: aiError.code === 'AI_DISABLED' ? 503 : 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/documents/[id]/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/documents/[id]/export - Get export history
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        id,
        workspaceId: workspace.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get export history
    const exports = await prisma.exportRecord.findMany({
      where: {
        documentId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Last 10 exports
    });

    return NextResponse.json({
      exports: exports.map((exp) => ({
        id: exp.id,
        profile: exp.profile,
        language: exp.language,
        scope: exp.scope,
        contentHash: exp.contentHash,
        createdAt: exp.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('GET /api/documents/[id]/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
