import Link from "next/link";
import type { Resource } from "@/types/resources";

interface RelatedPackagesProps {
  packages: Resource[];
  type: string;
}

export default function RelatedPackages({
  packages,
  type,
}: RelatedPackagesProps) {
  if (packages.length === 0) return null;

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="related-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Related
        </p>
        <h2
          id="related-heading"
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          More {type}s
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/${type}s/${pkg.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted font-mono text-sm font-bold text-accent">
                    {pkg.name.split("/").pop()?.substring(0, 2).toUpperCase() ??
                      "P"}
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    v{pkg.version}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-semibold text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-5 text-muted-foreground line-clamp-2">
                    {pkg.description || "No description yet."}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <span className="text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                    View →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
