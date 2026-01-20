import React from 'react';
import { ExportPageClient } from '@/components/export/ExportPageClient';

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExportPageClient id={id} />;
}
