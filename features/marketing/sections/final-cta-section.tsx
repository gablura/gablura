import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCtaSection() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-6 px-container text-center sm:max-w-2xl">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Get Started
        </p>
        <h2
          id="cta-heading"
          className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Build the next thing.
        </h2>
        <p className="max-w-xl text-lg leading-7 text-muted-foreground">
          Start with Auth Core, read the docs, or explore the full ecosystem —
          whichever feels right first.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link href="/docs">
            <Button size="lg" className="rounded-lg px-7 gap-2">
              Read the Docs
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
          <Link href="/ecosystem">
            <Button variant="secondary" size="lg" className="rounded-lg px-7">
              Explore the Ecosystem
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
