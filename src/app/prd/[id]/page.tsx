import EditorPageClient from '@/components/editor/EditorPageClient';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorPageClient id={id} />;
}
