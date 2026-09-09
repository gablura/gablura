import Link from "next/link";
import {
  HiOutlineArrowRight,
  HiOutlineGlobeAlt,
  HiOutlineCodeBracket,
} from "react-icons/hi2";
import type { Project } from "@/types/projects";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <section className="py-section">
        <div className="mx-auto max-w-container px-container">
          <div className="rounded-xl border border-border-subtle bg-surface p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No projects yet. Check back soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-border hover:bg-surface-hover">
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
                      ? "In Development"
                      : project.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-accent">{project.tagline}</p>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {project.techStack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted">
                        +{project.techStack.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-subtle">
                  <div className="flex items-center gap-3">
                    {project.frontendUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                        <HiOutlineGlobeAlt className="size-3" />
                        Live
                      </span>
                    )}
                    {project.repositoryUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                        <HiOutlineCodeBracket className="size-3" />
                        Source
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover">
                    View
                    <HiOutlineArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
