import {
  HiOutlineGlobeAlt,
  HiOutlineServer,
  HiOutlineCodeBracket,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import type { Project } from "@/types/projects";
import { PROJECT_STATUS_LABELS } from "@/types/projects";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tech Stack */}
            {project.techStack.length > 0 && (
              <div className="rounded-xl border border-border-subtle bg-surface p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Tech Stack
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-border-subtle bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">
                About this project
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="size-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Status
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {PROJECT_STATUS_LABELS[project.status]}
              </p>
            </div>

            {/* Links */}
            <div className="rounded-xl border border-border-subtle bg-surface p-5 space-y-3">
              {project.frontendUrl && (
                <a
                  href={project.frontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HiOutlineGlobeAlt className="size-4" />
                  Live Demo
                </a>
              )}
              {project.backendUrl && (
                <a
                  href={project.backendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HiOutlineServer className="size-4" />
                  Backend API
                </a>
              )}
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HiOutlineCodeBracket className="size-4" />
                  Source Code
                </a>
              )}
            </div>

            {/* Dates */}
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="flex items-center gap-2">
                <HiOutlineCalendarDays className="size-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Dates
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-text-muted">
                  Created{" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-text-muted">
                  Updated{" "}
                  {new Date(project.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
