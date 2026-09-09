interface ProjectsHeroProps {
  count: number;
}

export default function ProjectsHero({ count }: ProjectsHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-background py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_-20%,var(--accent-light,rgba(99,102,241,0.05)),transparent)]" />

      <div className="relative mx-auto max-w-container px-container">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-text-muted">
            Projects
          </span>
          <span className="h-px flex-1 max-w-[80px] bg-border-subtle" />
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Software we ship.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Real products built with the same tools and principles as the
          ecosystem. Not demos. Not prototypes. Production applications.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">{count}</p>
            <p className="text-xs text-text-muted">
              {count === 1 ? "project" : "projects"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
