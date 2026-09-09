import { LuSearch, LuFilter } from "react-icons/lu";

export function DeveloperFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or stack..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <LuFilter className="size-4 text-text-muted" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
