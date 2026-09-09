import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedResourceBySlug, getCachedRelatedResources } from "@/lib/resources";
import SdkHeader from "@/features/sdks/sections/sdk-header";
import SdkDocs from "@/features/sdks/sections/sdk-docs";
import RelatedSdks from "@/features/sdks/sections/related-sdks";

interface SdkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SdkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sdk = await getCachedResourceBySlug("sdk", slug);

  if (!sdk) {
    return { title: "SDK Not Found" };
  }

  const title = sdk.name;
  const description = sdk.description || `Documentation for ${sdk.name}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Gablura`,
      description,
    },
    twitter: {
      title: `${title} — Gablura`,
      description,
    },
  };
}

export const revalidate = 60;

export default async function SdkPage({ params }: SdkPageProps) {
  const { slug } = await params;
  const sdk = await getCachedResourceBySlug("sdk", slug);

  if (!sdk) {
    notFound();
  }

  const related = await getCachedRelatedResources("sdk", slug);

  return (
    <>
      <SdkHeader sdk={sdk} />
      <SdkDocs sdk={sdk} />
      <RelatedSdks sdks={related} />
    </>
  );
}
