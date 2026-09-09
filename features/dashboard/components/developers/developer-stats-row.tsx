export function DeveloperStatsRow({
  total,
  counts,
}: {
  total: number;
  counts: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl border border-border-subtle bg-surface p-4">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          Total
        </span>
        <p className="mt-1.5 text-2xl font-semibold text-foreground">{total}</p>
      </div>
      {(["pending", "approved", "rejected"] as const).map((status) => (
        <div
          key={status}
          className="rounded-xl border border-border-subtle bg-surface p-4"
        >
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            {status}
          </span>
          <p className="mt-1.5 text-2xl font-semibold text-foreground">
            {counts[status] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
