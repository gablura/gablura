import Link from "next/link";

const PRINCIPLES = [
  {
    number: "01",
    title: "Simple over clever.",
    description:
      "We favor clarity and maintainability over impressive abstractions. Code should be understood, not deciphered.",
  },
  {
    number: "02",
    title: "Reusable over repetitive.",
    description:
      "Every package, component, and pattern is designed to be used more than once. We build for the next project, not just this one.",
  },
  {
    number: "03",
    title: "Document everything.",
    description:
      "If it is not documented, it does not exist. Every package ships with clear guides, API references, and examples.",
  },
  {
    number: "04",
    title: "Ship useful software.",
    description:
      "We build tools that solve real problems. Every release must make a developer's day meaningfully easier.",
  },
  {
    number: "05",
    title: "Design for developers.",
    description:
      "Developer experience is not a feature. It is the foundation. APIs, CLIs, and documentation are all interfaces we design.",
  },
];

export default function EngineeringPrinciples() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-container">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            03 / Principles
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How we approach engineering.
          </h2>
          <p className="mt-4 text-muted-foreground">
            These principles guide every package, tool, and decision across
            the Gablura ecosystem.
          </p>
        </div>

        <div className="mt-12 space-y-0 divide-y divide-border-subtle">
          {PRINCIPLES.map((p) => (
            <article key={p.number} className="group py-8 first:pt-0">
              <div className="flex items-start gap-6">
                <span className="shrink-0 font-mono text-sm font-medium text-text-muted">
                  {p.number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Explore what we are building
            <svg
              className="size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
