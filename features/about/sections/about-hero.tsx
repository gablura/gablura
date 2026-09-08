import { getCachedPublishedCounts } from "@/lib/resources";

export default async function AboutHero() {
  const counts = await getCachedPublishedCounts();
  const total = counts.package + counts.tool + counts.sdk;

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
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Left — editorial content */}
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
                About
              </span>
              <span className="h-px flex-1 bg-border-subtle" />
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A developer organization
              <br />
              <span className="text-muted-foreground">building useful</span>
              <br />
              software.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Gablura is a developer-focused organization and technical brand
              building packages, SDKs, tools, and infrastructure for modern
              full-stack development. Not an agency. Not a portfolio. A
              digital headquarters for everything built under the Gablura
              identity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/packages"
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
              >
                Explore ecosystem
              </a>
              <a
                href="https://github.com/gablura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right — metadata panel */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Identity
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Developer Organization
                </p>
              </div>

              <div className="h-px bg-border-subtle" />

              <div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Focus
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Packages, SDKs, Tools, Infrastructure
                </p>
              </div>

              <div className="h-px bg-border-subtle" />

              <div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Stack
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Next.js · TypeScript · MongoDB · PostgreSQL 
                </p>
              </div>

              <div className="h-px bg-border-subtle" />

              <div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Status
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">
                    Active
                  </span>
                </div>
              </div>

              <div className="h-px bg-border-subtle" />

              {/* Live stats */}
              <div>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Ecosystem
                </span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {String(counts.package).padStart(2, "0")}
                    </p>
                    <p className="text-[11px] text-text-muted">Packages</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {String(counts.sdk).padStart(2, "0")}
                    </p>
                    <p className="text-[11px] text-text-muted">SDKs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {String(counts.tool).padStart(2, "0")}
                    </p>
                    <p className="text-[11px] text-text-muted">Tools</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {String(total).padStart(2, "0")}
                    </p>
                    <p className="text-[11px] text-text-muted">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
