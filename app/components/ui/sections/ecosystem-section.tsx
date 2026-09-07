import Link from "next/link";

const CATEGORIES = [
  {
    category: "PACKAGES",
    title: "Auth Core",
    description:
      "Authentication and authorization primitives you can compose into any stack.",
    count: "18 packages",
    href: "/packages/auth-core",
  },
  {
    category: "SDKs",
    title: "Node SDK",
    description:
      "Type-safe client libraries for every Gablura service, with first-class TypeScript.",
    count: "4 SDKs",
    href: "/sdks/node",
  },
  {
    category: "TOOLS",
    title: "CLI",
    description:
      "Develop, test, and ship — one command at a time. Built for real workflows.",
    count: "v1.0.0",
    href: "/tools/cli",
  },
  {
    category: "PROJECTS",
    title: "Focura",
    description:
      "Workspace and productivity software built for modern teams. Live at focura.dev.",
    count: "v0.6.0",
    href: "/projects/focura",
  },
];

export default function EcosystemSection() {
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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((item) => (
            <Link key={item.category} href={item.href} className="group block">
              <article className="flex h-full flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-muted">
                  {item.category}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-subtle">
                  <span className="text-xs font-mono text-text-muted tracking-wide">
                    {item.count}
                  </span>
                  <span className="text-xs font-medium text-accent">
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
