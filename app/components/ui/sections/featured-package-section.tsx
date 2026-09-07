import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/types/resources";
import CopyInstallButton from "./copy-install-button";

interface FeaturedPackageSectionProps {
  pkg: Resource | null;
}

export default function FeaturedPackageSection({
  pkg,
}: FeaturedPackageSectionProps) {
  if (!pkg) return null;

  const overview = pkg.documentation?.overview || pkg.description || "";
  const firstSentence = overview.split(". ")[0] + ".";
  const features =
    pkg.documentation?.features
      ?.split("\n")
      .map((f) => f.replace(/^-\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 4) ?? [];

  return (
    <section
      className="relative border-t border-border-subtle bg-background py-12 sm:py-section overflow-hidden"
      aria-labelledby="featured-heading"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-container px-container">
        {/* Section label */}
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Featured {pkg.type}
        </p>

        {/* Main card */}
        <article className="mt-8 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
          {/* Gradient header */}
          <div className="relative border-b border-border-subtle bg-gradient-to-br from-accent/[0.07] via-surface to-surface px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            {/* Icon + Identity */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-accent/15 bg-accent-muted font-mono text-xl font-bold text-accent shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] sm:size-16 sm:text-2xl">
                {pkg.name.split("/").pop()?.substring(0, 2).toUpperCase() ?? "P"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-accent/70">
                  {pkg.type}
                </p>
                <h2
                  id="featured-heading"
                  className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
                >
                  {pkg.name}
                </h2>
                {firstSentence && firstSentence !== "." && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:text-base sm:leading-7">
                    {firstSentence}
                  </p>
                )}
              </div>
            </div>

            {/* Install command — desktop */}
            <div className="mt-6 hidden sm:block">
              <div className="inline-flex items-center gap-3 rounded-lg border border-border-subtle bg-code-background px-4 py-3 font-mono text-sm">
                <span className="text-accent">$</span>
                <span className="text-foreground truncate">
                  npm install {pkg.name}
                </span>
                <CopyInstallButton package={pkg.name} />
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                  >
                    <span className="size-1 rounded-full bg-accent/60" />
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-5 sm:px-8 lg:px-10">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-5 sm:gap-x-8 sm:py-6">
              {[
                { key: "VERSION", value: pkg.version },
                { key: "STATUS", value: pkg.status },
                { key: "TYPE", value: pkg.type },
                ...(pkg.authorName
                  ? [{ key: "AUTHOR", value: pkg.authorName }]
                  : []),
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2 text-xs font-mono sm:gap-2.5"
                >
                  <span className="text-text-muted">{item.key}</span>
                  <span className="h-3 w-px bg-border" />
                  <span className="font-semibold uppercase text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border-subtle" />

            {/* Actions */}
            <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
              {/* Mobile install */}
              <div className="sm:hidden">
                <div className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-code-background px-3 py-2 font-mono text-xs">
                  <span className="text-accent shrink-0">$</span>
                  <span className="text-foreground truncate max-w-[160px]">
                    npm i {pkg.name}
                  </span>
                  <CopyInstallButton package={pkg.name} size="sm" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 sm:ml-auto">
                {pkg.repositoryUrl && (
                  <a
                    href={pkg.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm" className="gap-2">
                      <svg
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source
                    </Button>
                  </a>
                )}
                <Link href={`/docs/${pkg.type}s/${pkg.slug}`}>
                  <Button size="sm" className="gap-2">
                    View docs
                    <svg
                      className="size-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
