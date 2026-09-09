import { TextInput, TextArea, Select, Toggle, FieldLabel } from "@/components/ui/form-field";
import type { ProjectFormData } from "@/types/projects";

interface ProjectBasicFieldsProps {
  form: ProjectFormData;
  onFieldChange: <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => void;
}

export default function ProjectBasicFields({
  form,
  onFieldChange,
}: ProjectBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Name <span className="text-error">*</span></FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.name}
            onChange={(v) => onFieldChange("name", v)}
            placeholder="My Project"
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="(auto-generated)">Slug</FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.slug}
            onChange={(v) => onFieldChange("slug", v)}
            placeholder="my-project"
            mono
          />
        </div>
      </div>

      <div>
        <FieldLabel>Tagline</FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.tagline}
            onChange={(v) => onFieldChange("tagline", v)}
            placeholder="A short description of your project"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <div className="mt-1.5">
          <TextArea
            value={form.description}
            onChange={(v) => onFieldChange("description", v)}
            placeholder="What does this project do?"
            rows={3}
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="comma-separated">Tech Stack</FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.techStack}
            onChange={(v) => onFieldChange("techStack", v)}
            placeholder="Next.js, React, TypeScript, PostgreSQL"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Frontend URL</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.frontendUrl}
              onChange={(v) => onFieldChange("frontendUrl", v)}
              placeholder="https://example.vercel.app"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Backend URL</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.backendUrl}
              onChange={(v) => onFieldChange("backendUrl", v)}
              placeholder="https://api.example.com"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Repository URL</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.repositoryUrl}
              onChange={(v) => onFieldChange("repositoryUrl", v)}
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Image URL</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.imageUrl}
              onChange={(v) => onFieldChange("imageUrl", v)}
              placeholder="https://example.com/screenshot.png"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="mt-1.5">
            <Select
              value={form.status}
              onChange={(v) => onFieldChange("status", v as ProjectFormData["status"])}
              options={[
                { value: "active", label: "Active" },
                { value: "in-development", label: "In Development" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
        </div>
        <div className="pt-6">
          <Toggle
            checked={form.featured}
            onChange={(v) => onFieldChange("featured", v)}
            label="Featured project"
          />
        </div>
      </div>
    </div>
  );
}
