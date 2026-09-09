import Link from "next/link";
import { HiOutlineCommandLine, HiOutlineArrowRight } from "react-icons/hi2";

const STEPS = [
  {
    step: "01",
    title: "Browse the ecosystem",
    description:
      "Explore packages, SDKs, and tools. Every resource has documentation, examples, and installation instructions.",
    link: { href: "/packages", label: "Browse packages" },
  },
  {
    step: "02",
    title: "Install what you need",
    description:
      "Copy the install command. Each package is independently published to npm and works with your existing stack.",
    link: null,
  },
  {
    step: "03",
    title: "Build with confidence",
    description:
      "Type-safe APIs, comprehensive docs, and active maintenance. Focus on your product, not plumbing.",
    link: null,
  },
];

export default function EcosystemHowItWorks() {
  return (
    <section
      className="border-t border-border-subtle bg-surface py-section"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Getting started
        </p>
        <h2
          id="how-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Three steps to start building.
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.step} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border-subtle bg-background font-mono text-sm font-semibold text-text-muted">
                  {step.step}
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
              {step.link && (
                <Link
                  href={step.link.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  {step.link.label}
                  <HiOutlineArrowRight className="size-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center flex-wrap gap-3 rounded-xl border border-border-subtle bg-background p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <HiOutlineCommandLine className="size-5 text-accent" />
          </div>
          <div className="min-w-0 sm:flex-1">
            <p className="text-sm font-medium text-foreground">
              Ready to explore?
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Browse the full ecosystem or jump into a specific category.
            </p>
          </div>
          <Link
            href="/ecosystem"
            className="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ecosystem
            <HiOutlineArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
