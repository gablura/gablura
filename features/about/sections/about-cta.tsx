import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-container">
        <div className="rounded-2xl border border-border-subtle bg-surface p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Get involved
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built in public.
              <br />
              Used by developers.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Gablura is open-source friendly. Every package, tool, and
              project is built to be shared, documented, and improved by the
              community.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packages"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
            >
              Explore ecosystem
            </Link>
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
      </div>
    </section>
  );
}
