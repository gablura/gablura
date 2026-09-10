import type { Metadata } from "next";
import Link from "next/link";
import { getAllDocGroups } from "@/lib/docs";
import type { ResourceType } from "@/types/resources";
import { RESOURCE_TYPE_LABELS } from "@/types/resources";

export const metadata: Metadata = {
  title: "Documentation — Gablura",
  description:
    "Documentation for Gablura packages, SDKs, tools, and projects.",
};

export const revalidate = 60;

const TYPE_META: Record<
  ResourceType,
  { icon: string; description: string }
> = {
  package: {
    icon: "PK",
    description: "Reusable building blocks for your applications.",
  },
  sdk: {
    icon: "SDK",
    description: "Interfaces for powerful systems and services.",
  },
  tool: {
    icon: "TL",
    description: "Utilities that remove repetitive development work.",
  },
  project: {
    icon: "PR",
    description: "Products and experiments built by Gablura.",
  },
};

const TYPE_ORDER: ResourceType[] = ["package", "sdk", "tool", "project"];

export default function DocsPage() {
  const groups = getAllDocGroups();

  const groupsByType = TYPE_ORDER.reduce(
    (acc, type) => {
      acc[type] = groups.filter((g) => g.type === type);
      return acc;
    },
    {} as Record<ResourceType, typeof groups>
  );

  return (
    <section className="py-section">
      <div className="mx-auto max-w-container px-container">
        {/* Page header */}
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Documentation
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          Developer Documentation
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Guides, references, and examples for every package, SDK, tool, and
          project in the Gablura ecosystem.
        </p>

        {/* Type sections */}
        <div className="mt-10 space-y-10">
          {TYPE_ORDER.map((type) => {
            const resources = groupsByType[type];
            const meta = TYPE_META[type];

            if (resources.length === 0) return null;

            return (
              <section key={type}>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted font-mono text-xs font-bold text-accent">
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {RESOURCE_TYPE_LABELS[type]}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Link
                      key={resource.slug}
                      href={`/docs/${resource.slug}`}
                      className="group block rounded-xl border border-border-subtle bg-surface p-4 transition-colors duration-200 hover:border-border hover:bg-surface-hover"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-accent/10 bg-accent-muted font-mono text-xs font-bold text-accent">
                          {meta.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.hasMdx ? (
                            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-accent">
                              DOCS
                            </span>
                          ) : null}
                          <span className="text-[10px] font-mono text-text-muted">
                            v{resource.version}
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-foreground">
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      <span className="mt-3 inline-block text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                        Read docs →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
