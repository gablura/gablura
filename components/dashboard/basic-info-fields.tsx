import { TextInput, TextArea, Select, Toggle, FieldLabel } from "@/components/ui/form-field";
import type { ResourceFormData, ResourceType } from "@/types/resources";

interface BasicInfoFieldsProps {
  form: ResourceFormData;
  type: ResourceType;
  onFieldChange: <K extends keyof ResourceFormData>(key: K, value: ResourceFormData[K]) => void;
}

export default function BasicInfoFields({
  form,
  type,
  onFieldChange,
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Name</FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.name}
            onChange={(v) => onFieldChange("name", v)}
            placeholder={`My awesome ${type}`}
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="(auto-generated)">Slug</FieldLabel>
        <div className="mt-1.5">
          <TextInput
            value={form.slug}
            onChange={(v) => onFieldChange("slug", v)}
            placeholder="my-awesome-package"
            mono
          />
        </div>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <div className="mt-1.5">
          <TextArea
            value={form.description}
            onChange={(v) => onFieldChange("description", v)}
            placeholder="A brief description of what this does"
            rows={3}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Version</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.version}
              onChange={(v) => onFieldChange("version", v)}
              placeholder="0.1.0"
              mono
            />
          </div>
        </div>
        <div>
          <FieldLabel>Repository URL</FieldLabel>
          <div className="mt-1.5">
            <TextInput
              value={form.repositoryUrl}
              onChange={(v) => onFieldChange("repositoryUrl", v)}
              placeholder="https://github.com/..."
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
              onChange={(v) => onFieldChange("status", v as "draft" | "published")}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </div>
        </div>
        <div className="pt-6">
          <Toggle
            checked={form.featured}
            onChange={(v) => onFieldChange("featured", v)}
            label="Featured"
          />
        </div>
      </div>
    </div>
  );
}
