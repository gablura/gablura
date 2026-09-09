import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import type { Project } from "@/types/projects";

interface EcosystemProjectsProps {
  projects: Project[];
}

export default function EcosystemProjects({ projects }: EcosystemProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section
      className="border-t border-border-subtle bg-surface py-section"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-container px-container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              Products
            </p>
            <h2
              id="projects-heading"
              className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              Built by Gablura.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
              Real software. Not demos. Production applications built with
              the same tools and principles as the ecosystem.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:block"
          >
            View all projects
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-background p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-accent/15 bg-accent-muted font-mono text-lg font-bold text-accent">
                    {project.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      project.status === "active"
                        ? "bg-success-muted text-success"
                        : project.status === "in-development"
                          ? "bg-warning-muted text-warning"
                          : "bg-surface-elevated text-text-muted"
                    }`}
                  >
                    <span
                      className={`size-1 rounded-full ${
                        project.status === "active"
                          ? "bg-success"
                          : project.status === "in-development"
                            ? "bg-warning"
                            : "bg-text-muted"
                      }`}
                    />
                    {project.status === "in-development"
                      ? "In Dev"
                      : project.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-accent">{project.tagline}</p>
                </div>

                {project.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-text-muted">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-text-muted">
                    project
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                    View
                    <HiOutlineArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            View all projects
          </Link>
        </div>
      </div>
    </section>
  );
}
