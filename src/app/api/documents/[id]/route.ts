import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents/[id] - Get single document
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
        template: true,
        fields: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        languageMode: document.languageMode,
        updatedAt: document.updatedAt.toISOString(),
        createdAt: document.createdAt.toISOString(),
        template: document.template,
        fieldsJson: document.fields?.fieldsJson || {},
      },
    });
  } catch (error) {
    console.error('GET /api/documents/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/documents/[id] - Update document metadata
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
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { title, status } = body;

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      document: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        status: updatedDocument.status,
        updatedAt: updatedDocument.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('PATCH /api/documents/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/documents/[id] - Soft delete document
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Soft delete by setting status to archived
    await prisma.document.update({
      where: { id },
      data: { status: 'archived' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/documents/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
