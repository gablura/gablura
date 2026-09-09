"use client";

import { useState, useTransition, useEffect } from "react";
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
import {
  FormSubmitButton,
  FormCancelButton,
} from "./form-submit-button";

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
  const [form, setForm] = useState<ResourceFormData>(toFormData(resource));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("basic");

  const isEdit = !!resource;
  const formKey = `${type}-${resource?.id ?? "new"}-${open ? "open" : "closed"}`;

  useEffect(() => {
    if (open) {
      setForm(toFormData(resource));
      setError(null);
      setActiveTab("basic");
    }
  }, [open, resource]);

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
      title={isEdit ? `Edit ${type}` : `New ${type}`}
      formKey={formKey}
      footer={
        <>
          <FormCancelButton onClick={onClose} disabled={isPending} />
          <FormSubmitButton
            formId="resource-form"
            isPending={isPending}
            disabled={!form.name.trim()}
            label={isEdit ? "Save changes" : `Create ${type}`}
          />
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
