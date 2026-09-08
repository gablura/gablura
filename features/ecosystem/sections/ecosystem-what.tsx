import {
  HiOutlineCube,
  HiOutlineCommandLine,
  HiOutlineWrenchScrewdriver,
  HiOutlinePuzzlePiece,
} from "react-icons/hi2";

const PILLARS = [
  {
    icon: HiOutlineCube,
    title: "Packages",
    description:
      "Reusable building blocks. Typed, documented, and designed to compose into any project.",
  },
  {
    icon: HiOutlineCommandLine,
    title: "SDKs",
    description:
      "Client libraries that make external systems feel native. Type-safe with first-class TypeScript support.",
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: "Tools",
    description:
      "CLI helpers, generators, and utilities that remove repetitive work from your workflow.",
  },
  {
    icon: HiOutlinePuzzlePiece,
    title: "Composable",
    description:
      "Every piece is designed to work together. Mix and match what you need, ignore what you don't.",
  },
];

export default function EcosystemWhat() {
  return (
    <section
      className="border-t border-border-subtle bg-surface py-section"
      aria-labelledby="what-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              What is Gablura
            </p>
            <h2
              id="what-heading"
              className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              Open source infrastructure for developers.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">
              Gablura is a collection of packages, SDKs, and tools built to
              solve real problems. Every piece is independently usable,
              well-documented, and designed to work together.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">
              We believe developers deserve better primitives. Not another
              framework. Not another platform. Just solid, composable building
              blocks that respect your time and your stack.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="flex flex-col rounded-xl border border-border-subtle bg-background p-5 transition-colors duration-200 hover:border-border"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <pillar.icon className="size-5 text-accent" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
