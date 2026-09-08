const PRINCIPLES = [
  { head: "Small APIs", body: "A missing overload is better than a misleading one. We prefer shallow primitives you can build up over deep abstractions you have to reverse-engineer." },
  { head: "Composition first", body: "Packages should be independently useful. Imports are cheap, dependencies should earn their place, and nothing should fork your architecture." },
  { head: "Type safety everywhere", body: "If it compiles in our repo, it ships with types. Internal utilities, generated clients, docs examples — every layer gets the same standard." },
  { head: "Open by default", body: "Public APIs are public promises. We keep them stable, document them honestly, and do not hide useful behavior behind feature gates." },
  { head: "Tested and boring", body: "We prefer unglamorous reliability over clever runtime behavior. Failures should be obvious, recovery should be predictable, and surprises should be rare." },
];

export default function EngineeringPrinciplesSection() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="principles-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Engineering Principles
        </p>
        <h2
          id="principles-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          How we build.
        </h2>

        <div className="mt-14 flex flex-col">
          {PRINCIPLES.map((principle, i) => (
            <div
              key={principle.head}
              className="grid gap-4 border-b border-border-subtle py-8 sm:grid-cols-2 sm:gap-10 sm:py-10 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span className="text-xs font-mono uppercase tracking-wide text-accent">
                <span className="mr-3 text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                {principle.head}
              </span>
              <p className="text-lg leading-7 text-muted-foreground">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
