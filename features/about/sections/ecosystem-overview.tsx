import {
  HiOutlineCube,
  HiOutlineCommandLine,
  HiOutlineWrenchScrewdriver,
  HiOutlineBuildingLibrary,
} from "react-icons/hi2";

const CATEGORIES = [
  {
    icon: HiOutlineCube,
    title: "Packages",
    stat: "Reusable building blocks.",
    detail: "Published to npm. Typed. Documented. Designed to compose.",
  },
  {
    icon: HiOutlineCommandLine,
    title: "SDKs",
    stat: "Interfaces for systems.",
    detail: "Minimal APIs that integrate cleanly into any stack.",
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: "Tools",
    stat: "Utilities that ship.",
    detail: "CLI helpers, generators, and developer experience enhancements.",
  },
  {
    icon: HiOutlineBuildingLibrary,
    title: "Projects",
    stat: "Products that solve problems.",
    detail: "Full-stack applications built and maintained by Gablura.",
  },
];

export default function EcosystemOverview() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-container">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            04 / Ecosystem
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One ecosystem, many categories.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Gablura organizes its work into four primary categories. Each has
            its own documentation, versioning, and release cycle.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <article
              key={cat.title}
              className="group rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10">
                  <cat.icon className="size-[18px] text-accent" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {cat.title}
                </h3>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {cat.stat}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {cat.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
