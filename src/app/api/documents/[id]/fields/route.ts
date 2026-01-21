import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents/[id]/fields - Load fieldsJson
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

    // Get document
    const document = await prisma.document.findFirst({
      where: {
        id,
        workspaceId: workspace.id,
      },
      include: {
        fields: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      fieldsJson: document.fields?.fieldsJson || {},
      updatedAt: document.fields?.updatedAt?.toISOString() || document.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('GET /api/documents/[id]/fields error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/documents/[id]/fields - Section-based update
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      include: {
        fields: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { sectionKey, updates } = body;

    if (!sectionKey || !updates) {
      return NextResponse.json({ error: 'Missing required fields: sectionKey, updates' }, { status: 400 });
    }

    // Load current fieldsJson
    const currentFieldsJson = (document.fields?.fieldsJson as Record<string, any>) || {};

    // Merge updates into section
    const updatedFieldsJson = {
      ...currentFieldsJson,
      [sectionKey]: {
        ...(currentFieldsJson[sectionKey] || {}),
        ...updates,
      },
    };

    // Upsert DocumentField
    await prisma.documentField.upsert({
      where: { documentId: id },
      update: {
        fieldsJson: updatedFieldsJson,
      },
      create: {
        documentId: id,
        fieldsJson: updatedFieldsJson,
      },
    });

    // Update Document.updatedAt
    await prisma.document.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      fieldsJson: updatedFieldsJson,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('PATCH /api/documents/[id]/fields error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
