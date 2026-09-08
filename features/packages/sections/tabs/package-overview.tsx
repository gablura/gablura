"use client";

import type { Resource } from "@/types/resources";

interface PackageOverviewProps {
  pkg: Resource;
}

export default function PackageOverview({ pkg }: PackageOverviewProps) {
  const docs = pkg.documentation;

  const overview = docs?.overview || pkg.description || "";
  const whyItExists = docs?.whyItExists || "";
  const features =
    docs?.features
      ?.split("\n")
      .map((f) => f.replace(/^-\s*/, "").trim())
      .filter(Boolean) ?? [];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      {/* Overview */}
      {overview && (
        <div>
          <h3 className="text-lg font-semibold text-foreground">Overview</h3>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {overview}
          </div>
        </div>
      )}

      {/* Why it exists */}
      {whyItExists && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">
            Why it exists
          </h3>
          <div className="mt-3 rounded-lg border border-border-subtle bg-background p-4">
            <div className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {whyItExists}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">Features</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-lg border border-border-subtle bg-background p-3"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                  <svg
                    className="size-3.5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="text-sm leading-6 text-muted-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick info */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border-subtle bg-background p-4">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Version
          </span>
          <p className="mt-1.5 text-sm font-semibold text-foreground">
            v{pkg.version}
          </p>
        </div>
        <div className="rounded-lg border border-border-subtle bg-background p-4">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            License
          </span>
          <p className="mt-1.5 text-sm font-semibold text-foreground">MIT</p>
        </div>
        <div className="rounded-lg border border-border-subtle bg-background p-4">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Status
          </span>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            <span className="text-sm font-semibold capitalize text-foreground">
              {pkg.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
