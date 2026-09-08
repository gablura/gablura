import Link from "next/link";
import type { Resource } from "@/types/resources";

const TYPE_COLORS: Record<string, string> = {
  package: "text-accent",
  sdk: "text-accent",
  tool: "text-accent",
};

const TYPE_BG: Record<string, string> = {
  package: "bg-accent-muted border-accent/15",
  sdk: "bg-accent-muted border-accent/15",
  tool: "bg-accent-muted border-accent/15",
};

interface ProjectsSectionProps {
  resources: Resource[];
}

export default function ProjectsSection({ resources }: ProjectsSectionProps) {
  if (resources.length === 0) return null;

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Latest Resources
        </p>
        <h2
          id="projects-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Shipping real software.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Products, packages, and tools that started as internal utilities and
          became open.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, i) => (
            <Link
              key={resource.id}
              href={`/docs/${resource.type}s/${resource.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-7 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border text-lg font-mono font-bold ${
                      TYPE_BG[resource.type] ?? TYPE_BG.package
                    } ${TYPE_COLORS[resource.type] ?? TYPE_COLORS.package}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono font-semibold uppercase tracking-[0.16em] text-accent mt-1">
                    {resource.type}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-semibold text-foreground">
                    {resource.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {resource.description || "No description yet."}
                  </p>
                </div>

                <div className="mt-auto pt-5 border-t border-border-subtle">
                  <p className="text-xs font-mono text-text-muted">
                    v{resource.version} · {resource.type}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
