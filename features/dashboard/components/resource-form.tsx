"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createResource, updateResource } from "@/actions/resources";
import { generateSlug } from "@/lib/slug";
import type {
  ResourceType,
  Resource,
  ResourceFormData,
  ResourceDocumentation,
} from "@/types/resources";
import FormModal from "./form-modal";
import BasicInfoFields from "./basic-info-fields";
import DocFields from "./doc-fields";

interface ResourceFormProps {
  type: ResourceType;
  resource?: Resource | null;
  open: boolean;
  onClose: () => void;
}

function toFormData(resource?: Resource | null): ResourceFormData {
  return {
    name: resource?.name ?? "",
    slug: resource?.slug ?? "",
    description: resource?.description ?? "",
    version: resource?.version ?? "",
    repositoryUrl: resource?.repositoryUrl ?? "",
    status: resource?.status ?? "draft",
    featured: resource?.featured ?? false,
    documentation: {
      overview: resource?.documentation?.overview ?? "",
      whyItExists: resource?.documentation?.whyItExists ?? "",
      features: resource?.documentation?.features ?? "",
      installation: resource?.documentation?.installation ?? "",
      quickStart: resource?.documentation?.quickStart ?? "",
      apiReference: resource?.documentation?.apiReference ?? "",
      examples: resource?.documentation?.examples ?? "",
      changelog: resource?.documentation?.changelog ?? "",
    },
  };
}

type Tab = "basic" | "docs";

export default function ResourceForm({
  type,
  resource,
  open,
  onClose,
}: ResourceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ResourceFormData>(toFormData());
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("basic");

  const isEdit = !!resource;
  const formKey = `${type}-${resource?.id ?? "new"}-${open ? "open" : "closed"}`;

  function updateField<K extends keyof ResourceFormData>(
    key: K,
    value: ResourceFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !isEdit) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  function updateDoc(key: keyof ResourceDocumentation, value: string) {
    setForm((prev) => ({
      ...prev,
      documentation: { ...prev.documentation, [key]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const data: ResourceFormData = {
      ...form,
      slug: form.slug.trim() || generateSlug(form.name),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateResource(type, resource!.id, data)
        : await createResource(type, data);

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
      title={isEdit ? `Edit ${type}` : `New ${type}`}
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
            form="resource-form"
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
            {isEdit ? "Save changes" : `Create ${type}`}
          </button>
        </>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-border-subtle px-5">
        {(["basic", "docs"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-1 py-3 text-sm font-medium transition-colors",
              activeTab === tab
                ? "text-accent"
                : "text-text-muted hover:text-foreground"
            )}
          >
            {tab === "basic" ? "Basic info" : "Documentation"}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Form content */}
      <form
        id="resource-form"
        onSubmit={handleSubmit}
        className="px-5 py-5"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {activeTab === "basic" && (
          <BasicInfoFields
            form={form}
            type={type}
            onFieldChange={updateField}
          />
        )}

        {activeTab === "docs" && (
          <DocFields
            documentation={form.documentation}
            onChange={updateDoc}
          />
        )}
      </form>
    </FormModal>
  );
}
