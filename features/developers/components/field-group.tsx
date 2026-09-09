export const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50";

export const TEXTAREA_CLASS =
  "w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50";

export const SELECT_CLASS =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50";

export function FieldGroup({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint && (
          <span className="ml-1.5 text-xs text-text-muted">{hint}</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}
