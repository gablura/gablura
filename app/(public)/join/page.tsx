import type { Metadata } from "next";
import {
  LuCode,
  LuUsers,
  LuGlobe,
  LuBookOpen,
  LuShield,
  LuHeart,
} from "react-icons/lu";
import DeveloperRegistrationForm from "@/features/developers/components/developer-registration-form";

export const metadata: Metadata = {
  title: "Join the Waitlist — Gablura",
  description:
    "Join the Gablura developer waitlist. Be first to collaborate on open-source packages, SDKs, and tools for modern full-stack development.",
};

const BENEFITS = [
  {
    icon: LuCode,
    title: "Build in the Open",
    description:
      "Contribute to packages, SDKs, and tools that are used by developers worldwide. Every contribution ships to npm under the @gablura scope.",
  },
  {
    icon: LuUsers,
    title: "Collaborate with Developers",
    description:
      "Work alongside other passionate developers. Review PRs, discuss architecture, and learn from real-world open-source maintenance.",
  },
  {
    icon: LuBookOpen,
    title: "Learn Engineering Standards",
    description:
      "Work with well-architected codebases that follow strict patterns: server-first rendering, Zod validation, repository patterns, and comprehensive documentation.",
  },
  {
    icon: LuGlobe,
    title: "Global Community",
    description:
      "Gablura welcomes developers from every country. Our community includes engineers from diverse backgrounds and skill levels.",
  },
  {
    icon: LuShield,
    title: "Real-World Experience",
    description:
      "Gain hands-on experience with production-grade code: CI/CD, testing, documentation, npm publishing, and versioning.",
  },
  {
    icon: LuHeart,
    title: "Open Source, Free Forever",
    description:
      "There is no cost to join or contribute. Gablura is entirely open source, and every contribution is credited to its author.",
  },
];

const CONTRIBUTION_AREAS = [
  {
    title: "Package Development",
    description:
      "Build and improve core packages like @gablura/auth-core and @gablura/auth-next. Write tests, fix bugs, add features.",
    tags: ["TypeScript", "Node.js", "npm"],
  },
  {
    title: "Documentation",
    description:
      "Write clear, developer-friendly documentation using MDX. Improve guides, API references, and code examples.",
    tags: ["MDX", "Technical Writing", "API Docs"],
  },
  {
    title: "Testing",
    description:
      "Write unit and integration tests. Improve coverage, fix flaky tests, and establish testing patterns.",
    tags: ["Vitest", "Testing", "Quality"],
  },
  {
    title: "Tooling & Infrastructure",
    description:
      "Build developer tools, CLI utilities, and internal infrastructure that makes the ecosystem better.",
    tags: ["CLI", "Build Tools", "DX"],
  },
];

export default function JoinPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-background">
        <div className="mx-auto max-w-container px-container py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Developer Waitlist
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Join the builders.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Gablura is an open-source developer organization. We&apos;re onboarding
              contributors gradually. Join the waitlist to be first in line when
              new contribution areas open up.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-b border-border-subtle bg-surface py-section">
        <div className="mx-auto max-w-container px-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Why Join
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What you get as a Gablura developer.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-background p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted">
                  <benefit.icon className="size-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution Areas */}
      <section className="border-b border-border-subtle bg-background py-section">
        <div className="mx-auto max-w-container px-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Contribution Areas
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Where you can contribute.
            </h2>
            <p className="mt-4 text-lg leading-7 text-muted-foreground">
              Whether you&apos;re a frontend specialist, backend engineer, or
              documentation writer, there&apos;s a place for you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {CONTRIBUTION_AREAS.map((area) => (
              <article
                key={area.title}
                className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                  {area.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs font-mono text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="border-b border-border-subtle bg-surface py-section">
        <div className="mx-auto max-w-container px-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Join the Waitlist
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Reserve your spot.
            </h2>
            <p className="mt-4 text-lg leading-7 text-muted-foreground">
              Tell us about yourself and your interests. We&apos;ll reach out
              when a contribution area matching your skills opens up.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <div className="rounded-2xl border border-border-subtle bg-background p-6 sm:p-8">
              <DeveloperRegistrationForm />
            </div>

            <p className="mt-6 text-center text-xs text-text-muted">
              No payment required. We review every submission and welcome
              developers of all skill levels.
            </p>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-background py-section">
        <div className="mx-auto max-w-container px-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              What Happens Next
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              How the waitlist works.
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Join the waitlist",
                  description:
                    "Fill out the form with your details, tech stack, and what you'd like to work on.",
                },
                {
                  step: "02",
                  title: "We review your profile",
                  description:
                    "The team reviews your interests and skills to find the best fit. This typically takes 2-3 days.",
                },
                {
                  step: "03",
                  title: "Get matched to a project",
                  description:
                    "When a contribution area opens that matches your skills, we'll send you an invitation.",
                },
                {
                  step: "04",
                  title: "Start contributing",
                  description:
                    "Pick up your first issue, submit a PR, or propose a new feature. Every contribution counts.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-5 rounded-xl border border-border-subtle bg-surface p-6"
                >
                  <span className="text-2xl font-mono font-bold text-accent/40">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
