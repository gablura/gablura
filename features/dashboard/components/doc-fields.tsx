"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TextArea, FieldLabel } from "@/components/ui/form-field";
import type { ResourceDocumentation } from "@/types/resources";

interface DocFieldsProps {
  documentation: ResourceDocumentation;
  onChange: (key: keyof ResourceDocumentation, value: string) => void;
}

function insertFormat(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end);

  const before = value.substring(0, start);
  const after = value.substring(end);

  const newVal = `${before}${prefix}${selected || "text"}${suffix}${after}`;
  const newCursorPos = selected
    ? start + prefix.length + selected.length + suffix.length
    : start + prefix.length;

  return { value: newVal, cursorPos: newCursorPos };
}

function FormattingToolbar({
  textareaRef,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (v: string) => void;
}) {
  const applyFormat = useCallback(
    (prefix: string, suffix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const result = insertFormat(ta, prefix, suffix);
      onChange(result.value);

      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.cursorPos, result.cursorPos);
      });
    },
    [textareaRef, onChange]
  );

  const insertBlock = useCallback(
    (block: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const value = ta.value;
      const before = value.substring(0, start);
      const after = value.substring(start);
      const needsNewline = before.length > 0 && !before.endsWith("\n\n");

      const insertion = needsNewline ? `\n\n${block}` : block;
      const newVal = `${before}${insertion}${after}`;
      const cursorPos = start + insertion.length;

      onChange(newVal);

      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [textareaRef, onChange]
  );

  return (
    <div className="flex items-center gap-0.5 rounded-t-lg border border-b-0 border-border bg-surface-elevated px-2 py-1">
      <ToolbarButton
        onClick={() => applyFormat("**", "**")}
        label="Bold"
        shortcut="B"
      />
      <ToolbarButton
        onClick={() => applyFormat("*", "*")}
        label="Italic"
        shortcut="I"
      />
      <ToolbarButton
        onClick={() => applyFormat("`", "`")}
        label="Inline code"
        shortcut="<>"
      />
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton
        onClick={() =>
          insertBlock("```\ncode\n```")
        }
        label="Code block"
      />
      <ToolbarButton
        onClick={() => insertBlock("- Item 1\n- Item 2\n- Item 3")}
        label="List"
      />
      <ToolbarButton
        onClick={() => insertBlock("## Heading")}
        label="Heading"
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  label,
  shortcut,
}: {
  onClick: () => void;
  label: string;
  shortcut?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded text-text-muted transition-colors",
        "hover:bg-surface-hover hover:text-foreground"
      )}
    >
      {shortcut ? (
        <span className="text-[11px] font-semibold">{shortcut}</span>
      ) : (
        <svg
          className="size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      )}
    </button>
  );
}

interface DocFieldConfig {
  key: keyof ResourceDocumentation;
  label: string;
  placeholder: string;
  rows: number;
  hint?: string;
}

const DOC_FIELDS: DocFieldConfig[] = [
  {
    key: "overview",
    label: "Overview",
    placeholder: "What is this project? High-level summary.",
    rows: 3,
  },
  {
    key: "whyItExists",
    label: "Why it exists",
    placeholder: "What problem does this solve? Why was it created?",
    rows: 3,
  },
  {
    key: "features",
    label: "Features",
    placeholder: "List the key features (one per line or use bullet points)",
    rows: 4,
    hint: "supports lists",
  },
  {
    key: "installation",
    label: "Installation",
    placeholder: "npm install @gablura/package-name",
    rows: 3,
    hint: "use code blocks for commands",
  },
  {
    key: "quickStart",
    label: "Quick Start",
    placeholder: "Basic usage example to get started quickly",
    rows: 4,
    hint: "supports code blocks",
  },
  {
    key: "apiReference",
    label: "API Reference",
    placeholder: "Document the main API surface",
    rows: 5,
    hint: "use bold for method names, mono for signatures",
  },
  {
    key: "examples",
    label: "Examples",
    placeholder:
      "Write code examples. Separate multiple examples with ---\n\nExample:\n```ts\nconst x = new Package();\n```\n---\n```ts\nconst y = new Package({ strict: true });\n```",
    rows: 6,
    hint: "use --- to separate multiple examples, wrap code in ```",
  },
  {
    key: "changelog",
    label: "Changelog",
    placeholder: "## 0.1.0\n- Initial release\n\n## 0.2.0\n- Added feature X",
    rows: 4,
    hint: "supports markdown",
  },
];

export default function DocFields({ documentation, onChange }: DocFieldsProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-text-muted">
        Fill in the documentation sections. These will be displayed on the
        public documentation page. Use the toolbar for formatting —{" "}
        <strong>bold</strong>, <em>italic</em>, <code className="rounded bg-surface-elevated px-1 py-0.5 text-[11px] font-mono">mono</code>,
        and code blocks. Leave blank for default content.
      </p>

      {DOC_FIELDS.map((field) => (
        <DocField
          key={field.key}
          config={field}
          value={documentation[field.key]}
          onChange={(v) => onChange(field.key, v)}
        />
      ))}
    </div>
  );
}

function DocField({
  config,
  value,
  onChange,
}: {
  config: DocFieldConfig;
  value: string;
  onChange: (v: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <FieldLabel hint={config.hint}>{config.label}</FieldLabel>
      <div className="mt-1.5 overflow-hidden rounded-lg border border-border">
        <FormattingToolbar
          textareaRef={textareaRef}
          onChange={onChange}
        />
        <TextArea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={config.placeholder}
          rows={config.rows}
          mono
          className="rounded-t-none border-0 focus:ring-0"
        />
      </div>
    </div>
  );
}
