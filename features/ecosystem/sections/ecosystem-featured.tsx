import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import type { Resource } from "@/types/resources";

interface EcosystemFeaturedProps {
  resources: Resource[];
}

export default function EcosystemFeatured({
  resources,
}: EcosystemFeaturedProps) {
  if (resources.length === 0) return null;

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Highlighted
            </p>
            <h2
              id="featured-heading"
              className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              Featured resources.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
              The most useful pieces in the ecosystem, curated for developers
              getting started.
            </p>
          </div>
          <Link
            href="/packages"
            className="hidden text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:block"
          >
            View all packages
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={`/${resource.type}s/${resource.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted font-mono text-lg font-bold text-accent">
                    {resource.name
                      .split("/")
                      .pop()
                      ?.slice(0, 2)
                      .toUpperCase() ?? "??"}
                  </div>
                  <span className="rounded-md bg-surface-elevated px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    v{resource.version}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-semibold text-foreground">
                    {resource.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-5 text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-text-muted">
                    {resource.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                    View
                    <HiOutlineArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/packages"
            className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            View all packages
          </Link>
        </div>
      </div>
    </section>
  );
}
