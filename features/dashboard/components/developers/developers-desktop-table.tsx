import {
  type Developer,
  STATUS_BADGE,
  PROFICIENCY_LABEL,
  formatDate,
  getDeveloperId,
} from "./types";

export function DevelopersDesktopTable({
  developers,
  selectedEmail,
  onSelect,
}: {
  developers: Developer[];
  selectedEmail: string | null;
  onSelect: (dev: Developer) => void;
}) {
  return (
    <div className="hidden rounded-xl border border-border-subtle bg-surface lg:block">
      <div className="grid grid-cols-[1fr_140px_120px_100px_100px] gap-4 border-b border-border-subtle bg-surface-elevated/50 px-5 py-3">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Developer
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Stack
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Proficiency
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Status
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Joined
        </span>
      </div>
      <div className="divide-y divide-border-subtle">
        {developers.map((dev) => (
          <button
            key={getDeveloperId(dev)}
            type="button"
            onClick={() => onSelect(dev)}
            className="grid w-full grid-cols-[1fr_140px_120px_100px_100px] gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {dev.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {dev.email}
              </p>
            </div>
            <span className="truncate text-sm text-muted-foreground">
              {dev.primaryStack}
            </span>
            <span className="text-sm text-muted-foreground">
              {PROFICIENCY_LABEL[dev.proficiency] ?? dev.proficiency}
            </span>
            <span>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[dev.status]}`}
              >
                {dev.status}
              </span>
            </span>
            <span className="text-xs text-text-muted">
              {formatDate(dev.createdAt)}
            </span>
          </button>
        ))}
        {developers.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-text-muted">
            No developers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
