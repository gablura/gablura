import Link from "next/link";

const PROJECTS = [
  {
    number: "01",
    name: "Focura",
    tagline: "Workspace and productivity software built for modern teams.",
    stack: "Next.js · TypeScript · PostgreSQL",
    href: "/projects/focura",
  },
  {
    number: "02",
    name: "Gablura CLI",
    tagline: "Develop, test, and ship with one command at a time.",
    stack: "Rust · TypeScript · Nix",
    href: "/tools/cli",
  },
  {
    number: "03",
    name: "Auth Core",
    tagline: "Authentication and authorization primitives for every stack.",
    stack: "TypeScript · ESM · CDN",
    href: "/packages/auth-core",
  },
];

export default function ProjectsSection() {
  return (
    <section
      className="border-t border-border-subtle bg-background py-section"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
          Selected Projects
        </p>
        <h2
          id="projects-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Shipping real software.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
          Products, packages, and tools that started as internal utilities and
          became open.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <Link key={project.name} href={project.href} className="group block">
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-7 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted text-lg font-mono font-bold text-accent">
                    {project.number}
                  </span>
                  <span className="text-xs font-mono font-semibold uppercase tracking-[0.16em] text-accent mt-1">
                    {project.stack.split(" · ")[0]}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-auto pt-5 border-t border-border-subtle">
                  <p className="text-xs font-mono text-text-muted">
                    {project.stack}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
