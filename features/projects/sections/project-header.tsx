import Link from "next/link";
import {
  HiOutlineArrowUpRight,
  HiOutlineCodeBracket,
} from "react-icons/hi2";
import type { Project } from "@/types/projects";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-background py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_-20%,var(--accent-light,rgba(99,102,241,0.05)),transparent)]" />

      <div className="relative mx-auto max-w-container px-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{project.name}</span>
        </nav>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl border border-accent/15 bg-accent-muted font-mono text-xl font-bold text-accent shadow-[0_2px_8px_-2px_rgba(99,102,241,0.15)]">
                {project.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {project.name}
                </h1>
                <p className="mt-1 text-base text-accent">{project.tagline}</p>
              </div>
            </div>

            <p className="mt-6 text-lg leading-7 text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 gap-3">
            {project.frontendUrl && (
              <a
                href={project.frontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/20 bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
              >
                <HiOutlineArrowUpRight className="size-4" />
                Live Demo
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              >
                <HiOutlineCodeBracket className="size-4" />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
