import Link from "next/link";

const CATEGORY_META: Record<string, { label: string; href: string }> = {
  package: { label: "PACKAGES", href: "/packages" },
  sdk: { label: "SDKs", href: "/sdks" },
  tool: { label: "TOOLS", href: "/tools" },
};

interface EcosystemSectionProps {
  counts: Record<string, number>;
}

export default function EcosystemSection({ counts }: EcosystemSectionProps) {
  const categories = [
    {
      key: "package",
      title: "Packages",
      description: "Authentication, authorization, and composable primitives for modern stacks.",
      count: counts.package ?? 0,
    },
    {
      key: "sdk",
      title: "SDKs",
      description: "Type-safe client libraries for every service, with first-class TypeScript.",
      count: counts.sdk ?? 0,
    },
    {
      key: "tool",
      title: "Tools",
      description: "Develop, test, and ship — built for real workflows.",
      count: counts.tool ?? 0,
    },
  ];

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="ecosystem-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          The Ecosystem
        </p>
        <h2
          id="ecosystem-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          One modular ecosystem.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Everything composes. Every package is independently usable. Pick what
          you need, leave the rest.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.key];
            return (
              <Link key={cat.key} href={meta.href} className="group block">
                <article className="flex h-full flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted">
                    {meta.label}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-subtle">
                    <span className="text-xs font-mono text-text-muted tracking-wide">
                      {cat.count} {cat.count === 1 ? "item" : "items"}
                    </span>
                    <span className="text-xs font-medium text-accent">
                      View →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {total > 0 && (
          <p className="mt-8 text-center text-sm text-text-muted">
            {total} {total === 1 ? "resource" : "resources"} published across the ecosystem
          </p>
        )}
      </div>
    </section>
  );
}
