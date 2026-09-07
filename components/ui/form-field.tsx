import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint && (
        <span className="ml-1.5 text-xs text-text-muted">{hint}</span>
      )}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  mono?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-text-muted transition-colors",
        "focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        mono && "font-mono text-xs"
      )}
    />
  );
}

export const TextArea = forwardRef<HTMLTextAreaElement, {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
  className?: string;
}>(function TextArea(
  { value, onChange, placeholder, rows = 4, mono, className },
  ref
) {
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-text-muted transition-colors resize-y",
        "focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
        mono && "font-mono text-xs",
        className
      )}
    />
  );
});

export function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-colors",
        "focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
          checked ? "bg-accent" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}
