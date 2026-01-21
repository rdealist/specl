import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/server/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents - List user's documents
export async function GET(request: NextRequest) {
  try {
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query documents
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: {
          workspaceId: workspace.id,
          status: status as any,
        },
        include: {
          template: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.document.count({
        where: {
          workspaceId: workspace.id,
          status: status as any,
        },
      }),
    ]);

    // Format response
    const formattedDocs = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      updatedAt: doc.updatedAt.toISOString(),
      templateName: doc.template.name,
      // TODO: Calculate completionPercent from readiness evaluation
      completionPercent: 0,
    }));

    return NextResponse.json({
      documents: formattedDocs,
      total,
    });
  } catch (error) {
    console.error('GET /api/documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
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

    // Parse request body
    const body = await request.json();
    const { title, templateId, languageMode } = body;

    if (!title || !templateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify template exists and user has access
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        OR: [{ workspaceId: null }, { workspaceId: workspace.id }],
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create document
    const document = await prisma.document.create({
      data: {
        workspaceId: workspace.id,
        templateId: template.id,
        title,
        languageMode: languageMode || 'zh',
        status: 'draft',
        createdByUserId: userId,
      },
      include: {
        template: {
          select: {
            name: true,
          },
        },
      },
    });

    // Initialize empty fieldsJson
    const initialFieldsJson: Record<string, any> = {
      meta: { title },
      problem: {},
      goals: {},
      scope: {},
      requirements: { requirements: [] },
    };

    await prisma.documentField.create({
      data: {
        documentId: document.id,
        fieldsJson: initialFieldsJson,
      },
    });

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        updatedAt: document.updatedAt.toISOString(),
        templateName: document.template.name,
        completionPercent: 0,
      },
    });
  } catch (error) {
    console.error('POST /api/documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
