import {
  HiOutlineCube,
  HiOutlineCommandLine,
  HiOutlineWrenchScrewdriver,
  HiOutlineBuildingLibrary,
  HiOutlineCodeBracket,
  HiOutlineServerStack,
} from "react-icons/hi2";

const BUILDS = [
  {
    icon: HiOutlineCube,
    label: "Packages",
    description:
      "Reusable building blocks for full-stack applications. Published to npm, documented thoroughly, designed to compose.",
  },
  {
    icon: HiOutlineCommandLine,
    label: "SDKs",
    description:
      "Interfaces for powerful systems. typed, minimal, and built to integrate cleanly into any project.",
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    label: "Tools",
    description:
      "Utilities that remove repetitive work. CLI helpers, generators, and developer experience enhancements.",
  },
  {
    icon: HiOutlineBuildingLibrary,
    label: "Projects",
    description:
      "Products and experiments built by Gablura. Full-stack applications that solve real problems.",
  },
  {
    icon: HiOutlineCodeBracket,
    label: "Libraries",
    description:
      "Core libraries and shared logic used across the Gablura ecosystem. Designed for reuse and reliability.",
  },
  {
    icon: HiOutlineServerStack,
    label: "Infrastructure",
    description:
      "Developer infrastructure and platform tooling. The foundation that makes everything else possible.",
  },
] as const;

export default function WhatWeBuild() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-container">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            02 / What We Build
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything we build, in one place.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Gablura is not a single product. It is an ecosystem of developer
            tools, packages, and infrastructure designed to work together.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUILDS.map((item) => (
            <article
              key={item.label}
              className="group rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-elevated"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <item.icon className="size-5 text-accent" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
