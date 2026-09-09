import Link from "next/link";
import {
  HiOutlineCube,
  HiOutlineCommandLine,
  HiOutlineWrenchScrewdriver,
  HiOutlineBuildingLibrary,
} from "react-icons/hi2";
import type { ResourceType } from "@/types/resources";

const CATEGORIES: {
  key: ResourceType;
  title: string;
  href: string;
  icon: typeof HiOutlineCube;
  description: string;
  detail: string;
}[] = [
  {
    key: "package",
    title: "Packages",
    href: "/packages",
    icon: HiOutlineCube,
    description: "Reusable building blocks for full-stack applications.",
    detail:
      "Published to npm. Typed. Documented. Designed to compose into any project.",
  },
  {
    key: "sdk",
    title: "SDKs",
    href: "/sdks",
    icon: HiOutlineCommandLine,
    description: "Interfaces for powerful systems.",
    detail:
      "Type-safe client libraries with first-class TypeScript support.",
  },
  {
    key: "tool",
    title: "Tools",
    href: "/tools",
    icon: HiOutlineWrenchScrewdriver,
    description: "Utilities that remove repetitive work.",
    detail:
      "CLI helpers, generators, and developer experience enhancements.",
  },
];

interface EcosystemCategoriesProps {
  counts: Record<ResourceType, number>;
  projectCount: number;
}

export default function EcosystemCategories({
  counts,
  projectCount,
}: EcosystemCategoriesProps) {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Categories
        </p>
        <h2
          id="categories-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Four primary categories.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Each category serves a distinct purpose. All categories share the same
          engineering standards and documentation approach.
        </p>

        {/* Active categories */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const count = counts[cat.key] ?? 0;
            return (
              <Link key={cat.key} href={cat.href} className="group block">
                <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                      <cat.icon className="size-5 text-accent" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted">
                      {cat.title}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {cat.description}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {cat.detail}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                    <span className="text-xs font-mono text-text-muted tracking-wide">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                    <span className="text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                      View all →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}

          {/* Projects category */}
          <Link href="/projects" className="group block">
            <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <HiOutlineBuildingLibrary className="size-5 text-accent" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted">
                  Projects
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-foreground">
                  Projects
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Products and applications built by Gablura.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Full-stack applications that solve real problems.
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                <span className="text-xs font-mono text-text-muted tracking-wide">
                  {projectCount} {projectCount === 1 ? "project" : "projects"}
                </span>
                <span className="text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                  View all →
                </span>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </section>
  );
}
