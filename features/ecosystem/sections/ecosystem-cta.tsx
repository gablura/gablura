import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EcosystemCta() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="ecosystem-cta-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
            Get started
          </p>
          <h2
            id="ecosystem-cta-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Build with the ecosystem.
          </h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Every package is independently usable. Pick what you need, leave the
            rest. Start with a single install.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/packages">
              <Button size="lg" className="gap-2 rounded-lg px-7">
                Browse packages
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="secondary" size="lg" className="rounded-lg px-7">
                Read the docs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
