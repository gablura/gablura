export default function WhySection() {
  return (
    <section
      className="border-t border-border-subtle bg-surface py-section"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20 items-start">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Why We Build
            </p>
            <h2
              id="why-heading"
              className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              Serious software deserves better primitives.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-muted-foreground">
              Most teams end up rebuilding the same scaffolding: auth, sessions,
              permissions, integrations. We build the pieces that should already
              exist — and keep them open, composable, and boring in the best way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
