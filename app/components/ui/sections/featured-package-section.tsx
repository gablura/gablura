import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURED = {
  label: "PACKAGE / 01",
  title: "Auth Core",
  description:
    "Authentication and authorization primitives for modern stacks — sessions, scopes, guards, and integrations that fit your architecture.",
  meta: [
    { key: "VERSION", value: "1.0.0" },
    { key: "STATUS", value: "ACTIVE" },
    { key: "LICENSE", value: "MIT" },
  ],
  href: "/packages/auth-core",
};

export default function FeaturedPackageSection() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Featured Package
        </p>
        <h2
          id="featured-heading"
          className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Auth Core.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">
          The package developers reach for first. Small surface, deep utility —
          and the same primitives across every runtime.
        </p>

        <article className="mt-10 rounded-xl border border-border-subtle bg-surface p-8 sm:p-10 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent font-mono text-base font-bold border border-accent/10">
              01
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted">
                {FEATURED.label}
              </p>
              <h3 className="mt-1.5 text-2xl font-semibold text-foreground">
                {FEATURED.title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                {FEATURED.description}
              </p>
            </div>
          </div>

          <div className="my-8 h-px bg-border-subtle" />

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {FEATURED.meta.map((row) => (
              <div key={row.key} className="flex items-center gap-2.5 text-xs font-mono">
                <span className="text-text-muted">{row.key}</span>
                <span className="h-3 w-px bg-border" />
                <span className="font-semibold text-foreground">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href={FEATURED.href}>
              <Button variant="ghost" size="sm" className="gap-2 text-accent hover:text-accent-hover">
                View package
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
