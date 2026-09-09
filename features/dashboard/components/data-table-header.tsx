interface Column {
  label: string;
  className?: string;
}

interface DataTableHeaderProps {
  columns: Column[];
}

export default function DataTableHeader({ columns }: DataTableHeaderProps) {
  return (
    <div
      className={`grid gap-4 border-b border-border-subtle px-5 py-3 ${columns.map((c) => c.className).join(" ")}`}
      style={{
        gridTemplateColumns: columns.map(() => "1fr").join(" "),
      }}
    >
      {columns.map((col) => (
        <span
          key={col.label}
          className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted"
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}
