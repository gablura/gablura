"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/actions/projects";
import { generateSlug } from "@/lib/slug";
import type { Project, ProjectFormData } from "@/types/projects";
import FormModal from "./form-modal";
import ProjectBasicFields from "./project-basic-fields";
import {
  FormSubmitButton,
  FormCancelButton,
} from "./form-submit-button";

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

      if (!result.success) {
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
          <FormCancelButton onClick={onClose} disabled={isPending} />
          <FormSubmitButton
            formId="project-form"
            isPending={isPending}
            disabled={!form.name.trim()}
            label={isEdit ? "Save changes" : "Create project"}
          />
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

        <ProjectBasicFields form={form} onFieldChange={updateField} />
      </form>
    </FormModal>
  );
}
