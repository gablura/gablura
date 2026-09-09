import { HiOutlineFolderOpen } from "react-icons/hi2";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No items found.",
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-elevated">
        <HiOutlineFolderOpen className="size-6 text-muted-foreground" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
