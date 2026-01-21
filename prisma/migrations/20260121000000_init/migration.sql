-- CreateEnum
CREATE TYPE "LanguageMode" AS ENUM ('zh', 'en', 'bilingual');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('draft', 'ready_to_export', 'archived');

-- CreateEnum
CREATE TYPE "ExportProfile" AS ENUM ('lean', 'standard', 'detailed');

-- CreateEnum
CREATE TYPE "ExportLanguage" AS ENUM ('zh', 'en');

-- CreateEnum
CREATE TYPE "ExportScope" AS ENUM ('all', 'p0_only', 'p0_p1');

-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('anthropic', 'openai', 'local');

-- CreateEnum
CREATE TYPE "AiTaskType" AS ENUM ('consistency_check', 'field_patch', 'suggested_flows', 'context_export_en', 'repair_json');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "schemaJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "languageMode" "LanguageMode" NOT NULL DEFAULT 'zh',
    "status" "DocumentStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentField" (
    "documentId" TEXT NOT NULL,
    "fieldsJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentField_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshotFieldsJson" JSONB NOT NULL,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportRecord" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "profile" "ExportProfile" NOT NULL,
    "language" "ExportLanguage" NOT NULL,
    "scope" "ExportScope" NOT NULL DEFAULT 'all',
    "contentJson" JSONB NOT NULL,
    "contentHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT,
    "taskType" "AiTaskType" NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "model" TEXT NOT NULL,
    "tokenIn" INTEGER,
    "tokenOut" INTEGER,
    "costEstimate" DECIMAL(10,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "Workspace_ownerUserId_idx" ON "Workspace"("ownerUserId");

-- CreateIndex
CREATE INDEX "Workspace_updatedAt_idx" ON "Workspace"("updatedAt");

-- CreateIndex
CREATE INDEX "Template_workspaceId_idx" ON "Template"("workspaceId");

-- CreateIndex
CREATE INDEX "Template_name_idx" ON "Template"("name");

-- CreateIndex
CREATE INDEX "Document_workspaceId_updatedAt_idx" ON "Document"("workspaceId", "updatedAt");

-- CreateIndex
CREATE INDEX "Document_templateId_idx" ON "Document"("templateId");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_versionNumber_key" ON "DocumentVersion"("documentId", "versionNumber");

-- CreateIndex
CREATE INDEX "DocumentVersion_documentId_createdAt_idx" ON "DocumentVersion"("documentId", "createdAt");

-- CreateIndex
CREATE INDEX "ExportRecord_documentId_createdAt_idx" ON "ExportRecord"("documentId", "createdAt");

-- CreateIndex
CREATE INDEX "ExportRecord_contentHash_idx" ON "ExportRecord"("contentHash");

-- CreateIndex
CREATE INDEX "AiAuditLog_workspaceId_createdAt_idx" ON "AiAuditLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "AiAuditLog_userId_createdAt_idx" ON "AiAuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiAuditLog_documentId_createdAt_idx" ON "AiAuditLog"("documentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentField" ADD CONSTRAINT "DocumentField_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportRecord" ADD CONSTRAINT "ExportRecord_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAuditLog" ADD CONSTRAINT "AiAuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAuditLog" ADD CONSTRAINT "AiAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAuditLog" ADD CONSTRAINT "AiAuditLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
