import { cn } from "@/lib/utils";

interface FormSubmitButtonProps {
  isPending: boolean;
  disabled?: boolean;
  label: string;
  formId: string;
}

export function FormSubmitButton({
  isPending,
  disabled,
  label,
  formId,
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      form={formId}
      disabled={disabled}
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
      {label}
    </button>
  );
}

export function FormCancelButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
    >
      Cancel
    </button>
  );
}
