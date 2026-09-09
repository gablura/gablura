import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedResourceBySlug, getCachedRelatedResources } from "@/lib/resources";
import PackageHeader from "@/features/packages/sections/package-header";
import PackageDocs from "@/features/packages/sections/package-docs";
import RelatedPackages from "@/features/packages/sections/related-packages";

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getCachedResourceBySlug("package", slug);

  if (!pkg) {
    return { title: "Package Not Found" };
  }

  const title = pkg.name;
  const description = pkg.description || `Documentation for ${pkg.name}`;

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

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = await getCachedResourceBySlug("package", slug);

  if (!pkg) {
    notFound();
  }

  const related = await getCachedRelatedResources("package", slug);

  return (
    <>
      <PackageHeader pkg={pkg} />
      <PackageDocs pkg={pkg} />
      <RelatedPackages packages={related} type="package" />
    </>
  );
}
