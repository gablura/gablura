import {
  type Developer,
  STATUS_BADGE,
  PROFICIENCY_LABEL,
  getDeveloperId,
} from "./types";

export function DevelopersMobileCards({
  developers,
  onSelect,
}: {
  developers: Developer[];
  onSelect: (dev: Developer) => void;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      {developers.map((dev) => (
        <button
          key={getDeveloperId(dev)}
          type="button"
          onClick={() => onSelect(dev)}
          className="w-full rounded-xl border border-border-subtle bg-surface p-4 text-left transition-colors hover:bg-surface-hover"
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {dev.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {dev.email}
              </p>
            </div>
            <span
              className={`ml-2 shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[dev.status]}`}
            >
              {dev.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border-subtle bg-background px-2.5 py-0.5 text-xs text-text-muted">
              {dev.primaryStack}
            </span>
            <span className="rounded-full border border-border-subtle bg-background px-2.5 py-0.5 text-xs text-text-muted">
              {PROFICIENCY_LABEL[dev.proficiency] ?? dev.proficiency}
            </span>
            <span className="rounded-full border border-border-subtle bg-background px-2.5 py-0.5 text-xs text-text-muted">
              {dev.nationality}
            </span>
          </div>
        </button>
      ))}
      {developers.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-surface py-12 text-center text-sm text-text-muted">
          No developers found matching your criteria.
        </div>
      )}
    </div>
  );
}
