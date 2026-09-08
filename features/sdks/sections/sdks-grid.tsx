import Link from "next/link";
import type { Resource } from "@/types/resources";
import CopyInstallButton from "@/features/marketing/sections/copy-install-button";

interface SdksGridProps {
  sdks: Resource[];
}

export default function SdksGrid({ sdks }: SdksGridProps) {
  if (sdks.length === 0) {
    return (
      <section
        className="border-t border-border-subtle bg-background py-section"
        aria-labelledby="sdks-grid-heading"
      >
        <div className="mx-auto max-w-container px-container">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface">
              <svg
                className="size-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
            </div>
            <h2
              id="sdks-grid-heading"
              className="mt-6 text-xl font-semibold text-foreground"
            >
              No SDKs yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              SDKs will appear here once they are published.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="sdks-grid-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <h2 id="sdks-grid-heading" className="sr-only">
          All SDKs
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sdks.map((sdk) => (
            <Link
              key={sdk.id}
              href={`/sdks/${sdk.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted font-mono text-lg font-bold text-accent">
                    {sdk.name.split("/").pop()?.substring(0, 2).toUpperCase() ??
                      "S"}
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-[0.16em] text-accent">
                    v{sdk.version}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {sdk.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {sdk.description || "No description yet."}
                  </p>
                </div>

                {/* Install command */}
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-code-background px-3 py-2 font-mono text-xs">
                    <span className="text-accent shrink-0">$</span>
                    <span className="text-foreground truncate max-w-[180px]">
                      npm i {sdk.name}
                    </span>
                    <CopyInstallButton package={sdk.name} size="sm" />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-success" />
                    <span className="text-xs font-mono text-text-muted">
                      {sdk.status}
                    </span>
                  </div>
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
