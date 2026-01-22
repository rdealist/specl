import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';
import { evaluateReadiness } from '@/domain/readiness/evaluateReadiness';
import type { TemplateSchema } from '@/domain/readiness/types';

const prisma = new PrismaClient();

// GET /api/documents/[id]/readiness - Evaluate document readiness
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

    // Get document with template and fields
    const document = await prisma.document.findFirst({
      where: {
        id,
        workspaceId: workspace.id,
      },
      include: {
        template: true,
        fields: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (!document.fields) {
      return NextResponse.json({ error: 'Document fields not initialized' }, { status: 400 });
    }

    // Parse template schema
    const templateSchema = document.template.schemaJson as unknown as TemplateSchema;
    const fieldsJson = document.fields.fieldsJson as Record<string, any>;

    // Evaluate readiness
    const readiness = evaluateReadiness(fieldsJson, templateSchema);

    return NextResponse.json(readiness);
  } catch (error) {
    console.error('GET /api/documents/[id]/readiness error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
