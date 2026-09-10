import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocGroup, getDocSectionOrder, getAllDocGroups } from "@/lib/docs";
import { RESOURCE_TYPE_LABELS } from "@/types/resources";
import DocsDetailClient from "@/features/docs/components/docs-detail-client";

interface DocsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const groups = getAllDocGroups();
  return groups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: DocsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getDocGroup(slug);

  if (!group) return { title: "Not Found" };

  return {
    title: `${group.title} — Gablura Docs`,
    description: group.description,
    openGraph: {
      title: `${group.title} — Gablura Docs`,
      description: group.description,
    },
  };
}

export const revalidate = 60;

const SECTION_IMPORTS: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "auth-core/index": () => import("@/content/docs/auth-core/index.mdx"),
  "auth-core/installation": () => import("@/content/docs/auth-core/installation.mdx"),
  "auth-core/quick-start": () => import("@/content/docs/auth-core/quick-start.mdx"),
  "auth-core/configuration": () => import("@/content/docs/auth-core/configuration.mdx"),
  "auth-core/usage": () => import("@/content/docs/auth-core/usage.mdx"),
  "auth-core/api-reference": () => import("@/content/docs/auth-core/api-reference.mdx"),
  "auth-core/examples": () => import("@/content/docs/auth-core/examples.mdx"),
  "auth-core/security": () => import("@/content/docs/auth-core/security.mdx"),
  "auth-core/performance": () => import("@/content/docs/auth-core/performance.mdx"),
  "auth-core/faq": () => import("@/content/docs/auth-core/faq.mdx"),
  "auth-core/changelog": () => import("@/content/docs/auth-core/changelog.mdx"),
  "auth-core/contributing": () => import("@/content/docs/auth-core/contributing.mdx"),
  "auth-core/license": () => import("@/content/docs/auth-core/license.mdx"),
  "auth-next/index": () => import("@/content/docs/auth-next/index.mdx"),
  "auth-next/installation": () => import("@/content/docs/auth-next/installation.mdx"),
  "auth-next/quick-start": () => import("@/content/docs/auth-next/quick-start.mdx"),
  "auth-next/usage": () => import("@/content/docs/auth-next/usage.mdx"),
  "auth-next/configuration": () => import("@/content/docs/auth-next/configuration.mdx"),
  "auth-next/license": () => import("@/content/docs/auth-next/license.mdx"),
  "focura/index": () => import("@/content/docs/focura/index.mdx"),
};

export default async function DocsDetailPage({
  params,
}: DocsDetailPageProps) {
  const { slug } = await params;
  const group = getDocGroup(slug);

  if (!group) notFound();

  const allGroups = getAllDocGroups();

  const sidebarItems = allGroups.map((g) => ({
    slug: g.slug,
    title: g.title,
    type: g.type,
    version: g.version,
    hasMdx: g.hasMdx,
  }));

  // Resource without MDX docs — show coming soon page
  if (!group.hasMdx) {
    return (
      <DocsDetailClient
        slug={slug}
        title={group.title}
        description={group.description}
        sections={[]}
        sidebarItems={sidebarItems}
      >
        <div className="py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-accent/15 bg-accent-muted font-mono text-lg font-bold text-accent">
            {RESOURCE_TYPE_LABELS[group.type].substring(0, 2).toUpperCase()}
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">
            {group.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Documentation for this resource is coming soon.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href={group.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View source on GitHub
            </a>
          </div>
        </div>
      </DocsDetailClient>
    );
  }

  // Resource with MDX docs — load all sections
  const sectionOrder = getDocSectionOrder(slug);

  const sections = await Promise.all(
    sectionOrder.map(async (sectionSlug) => {
      const importKey = `${slug}/${sectionSlug}`;
      const importer = SECTION_IMPORTS[importKey];
      if (!importer) return null;
      const { default: Component } = await importer();
      return { slug: sectionSlug, Component };
    })
  );

  const validSections = sections.filter(
    (s): s is { slug: string; Component: React.ComponentType } => s !== null
  );

  return (
    <DocsDetailClient
      slug={slug}
      title={group.title}
      description={group.description}
      sections={validSections.map((s) => ({
        slug: s.slug,
        title: s.slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      }))}
      sidebarItems={sidebarItems}
    >
      {validSections.map((section) => (
        <div key={section.slug} id={`section-${section.slug}`} className="scroll-mt-28 lg:scroll-mt-24">
          <section.Component />
        </div>
      ))}
    </DocsDetailClient>
  );
}
