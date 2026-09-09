import type { ResourceType } from "@/types/resources";

interface EcosystemHeroProps {
  counts: Record<ResourceType, number>;
  projectCount: number;
}

export default function EcosystemHero({ counts, projectCount }: EcosystemHeroProps) {
  const total = counts.package + counts.sdk + counts.tool + projectCount;

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
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-container px-container">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            Ecosystem
          </span>
          <span className="h-px flex-1 bg-border-subtle" />
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Everything we build,
          <br />
          <span className="text-muted-foreground">in one place.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Gablura organizes its work into four primary categories. Each has its
          own documentation, versioning, and release cycle. Pick what you need.
        </p>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-3xl font-semibold text-foreground">
              {String(total).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Total resources
            </p>
          </div>
          <div className="h-10 w-px bg-border-subtle" />
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Packages", count: counts.package },
              { label: "SDKs", count: counts.sdk },
              { label: "Tools", count: counts.tool },
              { label: "Projects", count: projectCount },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {String(item.count).padStart(2, "0")}
                </p>
                <p className="text-xs text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
