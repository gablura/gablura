const VALUES = [
  {
    number: "01",
    title: "Small APIs",
    body: "Every package exposes the smallest possible surface area. Learn less, build more.",
  },
  {
    number: "02",
    title: "Composition first",
    body: "No monolithic frameworks. Pick the pieces you need and compose them into your own architecture.",
  },
  {
    number: "03",
    title: "Type safety everywhere",
    body: "Full TypeScript support from day one. Catch errors at compile time, not in production.",
  },
  {
    number: "04",
    title: "Open by default",
    body: "MIT licensed. Public repositories. Transparent development. No lock-in, no surprises.",
  },
  {
    number: "05",
    title: "Tested and boring",
    body: "Comprehensive test suites. Predictable releases. Infrastructure should be boring.",
  },
];

export default function EcosystemValues() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="values-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Our principles
        </p>
        <h2
          id="values-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          How we build.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Every decision in the ecosystem is guided by these principles. They
          shape what we build, how we build it, and what we leave out.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <article
              key={value.number}
              className="flex flex-col rounded-xl border border-border-subtle bg-surface p-6"
            >
              <span className="font-mono text-xs font-semibold text-text-muted">
                {value.number}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                {value.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
