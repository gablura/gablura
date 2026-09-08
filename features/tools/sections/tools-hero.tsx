interface ToolsHeroProps {
  count: number;
}

export default function ToolsHero({ count }: ToolsHeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Accent gradient */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-container px-container">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            Tools
          </span>
          <span className="h-px flex-1 bg-border-subtle" />
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Utilities that remove repetitive work.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          CLI helpers, generators, and developer experience enhancements. Built
          for real workflows.
        </p>

        {/* Stats */}
        <div className="mt-10 flex items-center gap-4">
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">
              {String(count).padStart(2, "0")}
            </p>
            <p className="text-xs text-text-muted">Published</p>
          </div>
        </div>
      </div>
    </section>
  );
}
