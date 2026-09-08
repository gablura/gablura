import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedResourceBySlug, getCachedRelatedResources } from "@/lib/resources";
import ToolHeader from "@/features/tools/sections/tool-header";
import ToolDocs from "@/features/tools/sections/tool-docs";
import RelatedTools from "@/features/tools/sections/related-tools";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getCachedResourceBySlug("tool", slug);

  if (!tool) {
    return { title: "Tool Not Found — Gablura" };
  }

  return {
    title: `${tool.name} — Gablura`,
    description: tool.description || `Documentation for ${tool.name}`,
  };
}

export const revalidate = 60;

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getCachedResourceBySlug("tool", slug);

  if (!tool) {
    notFound();
  }

  const related = await getCachedRelatedResources("tool", slug);

  return (
    <>
      <ToolHeader tool={tool} />
      <ToolDocs tool={tool} />
      <RelatedTools tools={related} />
    </>
  );
}
