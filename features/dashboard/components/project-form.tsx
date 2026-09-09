"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createProject, updateProject } from "@/actions/projects";
import { generateSlug } from "@/lib/slug";
import type { Project, ProjectFormData } from "@/types/projects";
import FormModal from "./form-modal";

interface ProjectFormProps {
  project?: Project | null;
  open: boolean;
  onClose: () => void;
}

function toFormData(project?: Project | null): ProjectFormData {
  return {
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    tagline: project?.tagline ?? "",
    description: project?.description ?? "",
    techStack: project?.techStack?.join(", ") ?? "",
    frontendUrl: project?.frontendUrl ?? "",
    backendUrl: project?.backendUrl ?? "",
    repositoryUrl: project?.repositoryUrl ?? "",
    imageUrl: project?.imageUrl ?? "",
    featured: project?.featured ?? false,
    status: project?.status ?? "in-development",
  };
}

export default function ProjectForm({
  project,
  open,
  onClose,
}: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ProjectFormData>(toFormData(project));
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!project;
  const formKey = `project-${project?.id ?? "new"}-${open ? "open" : "closed"}`;

  useEffect(() => {
    if (open) {
      setForm(toFormData(project));
      setError(null);
    }
  }, [open, project]);

  function updateField<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !isEdit) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const data: ProjectFormData = {
      ...form,
      slug: form.slug.trim() || generateSlug(form.name),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateProject(project!.id, data)
        : await createProject(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      onClose();
      router.refresh();
    });
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit project" : "New project"}
      formKey={formKey}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={isPending || !form.name.trim()}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
              "border-primary/20 bg-primary text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:bg-primary/85"
            )}
          >
            {isPending && (
              <svg
                className="size-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {isEdit ? "Save changes" : "Create project"}
          </button>
        </>
      }
    >
      <form
        id="project-form"
        onSubmit={handleSubmit}
        className="px-5 py-5"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="project-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Name <span className="text-error">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="My Project"
              className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="project-slug"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Slug
            </label>
            <input
              id="project-slug"
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="my-project"
              className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 font-mono text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Tagline */}
          <div>
            <label
              htmlFor="project-tagline"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tagline
            </label>
            <input
              id="project-tagline"
              type="text"
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="A short description of your project"
              className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="project-description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="What does this project do?"
              rows={3}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label
              htmlFor="project-tech"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tech Stack
            </label>
            <input
              id="project-tech"
              type="text"
              value={form.techStack}
              onChange={(e) => updateField("techStack", e.target.value)}
              placeholder="Next.js, React, TypeScript, PostgreSQL"
              className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="mt-1 text-xs text-text-muted">
              Comma-separated list of technologies
            </p>
          </div>

          {/* URLs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-frontend"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Frontend URL
              </label>
              <input
                id="project-frontend"
                type="url"
                value={form.frontendUrl}
                onChange={(e) => updateField("frontendUrl", e.target.value)}
                placeholder="https://example.vercel.app"
                className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="project-backend"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Backend URL
              </label>
              <input
                id="project-backend"
                type="url"
                value={form.backendUrl}
                onChange={(e) => updateField("backendUrl", e.target.value)}
                placeholder="https://api.example.com"
                className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-repo"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Repository URL
              </label>
              <input
                id="project-repo"
                type="url"
                value={form.repositoryUrl}
                onChange={(e) => updateField("repositoryUrl", e.target.value)}
                placeholder="https://github.com/user/repo"
                className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="project-image"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Image URL
              </label>
              <input
                id="project-image"
                type="url"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Status + Featured */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-status"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Status
              </label>
              <select
                id="project-status"
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value as ProjectFormData["status"]
                  )
                }
                className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="active">Active</option>
                <option value="in-development">In Development</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="size-4 rounded border-border-subtle text-accent focus:ring-accent"
                />
                <span className="text-sm font-medium text-foreground">
                  Featured project
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
}
